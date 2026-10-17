import csv
import json
import logging
import time
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional

from sqlalchemy.orm import Session

from ..core.config import get_settings
from ..database import models, queries
from .aggregation import Aggregator
from .cleaning import Cleaner
from .ingestion import Ingestor, SourceType
from .normalization import Normalizer
from .source_registry import SourceRegistry, get_source_registry
from .validation import Validator, ValidationResult

logger = logging.getLogger(__name__)


class DataPipeline:
    def __init__(
        self,
        db: Session,
        registry: Optional[SourceRegistry] = None,
    ) -> None:
        self.db = db
        self.registry = registry or get_source_registry()
        self.ingestors: Dict[str, Ingestor] = {}
        self.cleaner = Cleaner()
        self.validator = Validator()
        self.normalizer = Normalizer()
        self.aggregator = Aggregator()

        # Initialize default ingestors from registry
        for sid, stype in self.registry._registry.items():
            self.register_ingestor(sid, stype)

    def register_ingestor(self, source_id: str, source_type: SourceType) -> None:
        self.ingestors[source_id] = Ingestor(source_type)

    def run(self, source_id: str, source_config: dict) -> dict[str, Any]:
        """Runs the pipeline for a single source config."""
        start_time = time.time()
        ingestor = self.ingestors.get(source_id)
        if ingestor is None:
            source_type = self.registry.get(source_id) or SourceType.government
            self.register_ingestor(source_id, source_type)
            ingestor = self.ingestors[source_id]

        staged = ingestor.ingest(source_config)
        if staged.get("status") == "failed":
            return {"status": "failed", "error": staged.get("error")}

        records = staged.get("records", [])
        dataset_type = source_config.get("dataset_type", "indicators")

        result = self.validator.validate(records, schema_type=dataset_type)
        if not result.is_valid and source_config.get("strict_validation", False):
            return {
                "status": "validation_failed",
                "errors": result.errors,
                "invalid_count": result.invalid_count,
            }

        # Clean the valid records (or all records with best-effort)
        clean_input = result.records if result.records else records
        cleaned = self.cleaner.clean(clean_input, dataset_type=dataset_type)
        normalized = self.normalizer.normalize(cleaned["records"])
        aggregated = self.aggregator.aggregate(normalized, group_by="source_id")

        duration = round(time.time() - start_time, 3)

        return {
            "status": "completed",
            "source_id": source_id,
            "records_staged": len(records),
            "records_cleaned": cleaned["cleaned"],
            "records_dropped": cleaned["dropped"],
            "records_normalized": len(normalized),
            "aggregation": aggregated,
            "duration_seconds": duration,
        }

    def run_full_pipeline(
        self,
        raw_dir: Optional[str | Path] = None,
        processed_dir: Optional[str | Path] = None,
    ) -> Dict[str, Any]:
        """Executes full end-to-end ingestion and persistence across all public datasets."""
        start_time = time.time()
        settings = get_settings()
        raw_path = Path(raw_dir) if raw_dir else Path(settings.raw_data_dir)
        proc_path = Path(processed_dir) if processed_dir else Path(settings.processed_data_dir)
        proc_path.mkdir(parents=True, exist_ok=True)

        logger.info("Starting WaterMap full data pipeline run from %s...", raw_path)

        stats = {
            "sources_registered": 0,
            "wards_created": 0,
            "indicators_created": 0,
            "records_processed": 0,
            "errors": [],
        }

        # 1. Ingest & Persist Data Sources
        sources_file = raw_path / "data_sources.json"
        if sources_file.exists():
            with open(sources_file, "r", encoding="utf-8") as f:
                sources_data = json.load(f)
            for s in sources_data:
                existing = queries.get_data_source(self.db, s["source_id"])
                if not existing:
                    queries.create_data_source(self.db, **s)
                    stats["sources_registered"] += 1

        # 2. Ingest Ward Boundaries GeoJSON
        wards_file = raw_path / "ward_boundaries.geojson"
        ward_models: Dict[str, models.Ward] = {}
        if wards_file.exists():
            with open(wards_file, "r", encoding="utf-8") as f:
                geojson = json.load(f)
            features = geojson.get("features", [])
            for feat in features:
                props = feat.get("properties", {})
                wid = self.cleaner.standardize_ward_id(props.get("ward_id"))
                geom_str = json.dumps(feat.get("geometry", {}))

                ward_data = {
                    "ward_id": wid,
                    "name": props.get("name", "Unknown Ward"),
                    "district": props.get("district", "Bengaluru Urban"),
                    "zone": props.get("zone", "Central"),
                    "population": int(props.get("population", 50000)),
                    "area_sqkm": float(props.get("area_sqkm", 5.0)),
                    "geometry": geom_str,
                    "centroid_lat": float(props.get("centroid_lat") or 12.9716),
                    "centroid_lon": float(props.get("centroid_lon") or 77.5946),
                    "water_stress_index": 0.0,
                    "risk_category": "low",
                }

                existing_ward = queries.get_ward(self.db, wid)
                if not existing_ward:
                    created = queries.create_ward(self.db, **ward_data)
                    ward_models[wid] = created
                    stats["wards_created"] += 1
                else:
                    update_fields = {k: v for k, v in ward_data.items() if k != "ward_id"}
                    queries.update_ward(self.db, wid, **update_fields)
                    ward_models[wid] = existing_ward

        # 3. Ingest Indicators
        metric_files = [
            ("groundwater_levels.csv", "groundwater_depth_mbgl", "mbgl", "water_level_mbgl", "DS001"),
            ("rainfall_precipitation.csv", "rainfall_deficit_pct", "%", "departure_pct", "DS002"),
            ("piped_water_supply.csv", "piped_water_supply_lpcd", "lpcd", "per_capita_lpcd", "DS003"),
            ("tanker_water_demand.csv", "tanker_dependency_index", "trips/k", "trips_per_thousand_residents", "DS004"),
            ("water_bodies_lakes.csv", "water_body_coverage_pct", "%", "coverage_pct_of_ward", "DS005"),
        ]

        ward_indicators: Dict[str, List[Dict[str, Any]]] = {w: [] for w in ward_models.keys()}

        for filename, metric_name, unit, val_col, source_id in metric_files:
            file_path = raw_path / filename
            if not file_path.exists():
                continue

            with open(file_path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    wid = self.cleaner.standardize_ward_id(row.get("ward_id"))
                    raw_val = row.get(val_col)
                    if raw_val is None or wid not in ward_models:
                        continue

                    try:
                        f_val = float(raw_val)
                    except ValueError:
                        continue

                    norm_val = self.normalizer.normalize_metric(metric_name, f_val)
                    ind_id = f"IND-{wid}-{metric_name}"

                    ind_data = {
                        "ward_id": wid,
                        "metric": metric_name,
                        "value": f_val,
                        "unit": unit,
                        "normalized_value": norm_val,
                        "source_id": source_id,
                    }

                    queries.upsert_indicator(self.db, ind_id, **ind_data)
                    stats["indicators_created"] += 1
                    ward_indicators[wid].append({"indicator_id": ind_id, **ind_data})


        # 4. Compute Ward Composite Stress Index & Risk Category
        for wid, inds in ward_indicators.items():
            if not inds:
                continue
            agg_result = self.aggregator.aggregate_ward_indicators(inds)
            wsi = agg_result["water_stress_index"]
            risk_cat = agg_result["risk_category"]
            queries.update_ward(
                self.db,
                wid,
                water_stress_index=wsi,
                risk_category=risk_cat,
            )

        duration = round(time.time() - start_time, 3)

        # 5. Record Pipeline Audit
        run_id = f"RUN-{uuid.uuid4().hex[:8]}"
        audit_run = queries.record_pipeline_run(
            self.db,
            run_id=run_id,
            status="completed",
            records_ingested=stats["wards_created"] + stats["indicators_created"],
            records_cleaned=stats["wards_created"] + stats["indicators_created"],
            records_dropped=len(stats["errors"]),
            duration_seconds=duration,
            details=json.dumps(stats),
        )

        # 6. Save Processed Summary
        summary_file = proc_path / "processed_pipeline_summary.json"
        with open(summary_file, "w", encoding="utf-8") as f:
            json.dump({
                "run_id": run_id,
                "duration_seconds": duration,
                "stats": stats,
                "total_wards": len(ward_models),
            }, f, indent=2)

        logger.info(
            "WaterMap data pipeline completed in %.2fs: %d wards, %d indicators",
            duration,
            len(ward_models),
            stats["indicators_created"],
        )

        return {
            "status": "completed",
            "run_id": run_id,
            "duration_seconds": duration,
            "stats": stats,
            "total_wards": len(ward_models),
        }


def get_data_pipeline(db: Session, registry: Optional[SourceRegistry] = None) -> DataPipeline:
    return DataPipeline(db=db, registry=registry)

