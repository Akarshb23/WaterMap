import csv
import json
import logging
from enum import Enum
from pathlib import Path
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class SourceType(str, Enum):
    municipal = "municipal"
    government = "government"
    open_data = "open_data"
    sensor = "sensor"
    weather = "weather"
    satellite = "satellite"
    hydrology = "hydrology"


class Ingestor:
    def __init__(self, source_type: SourceType = SourceType.government) -> None:
        self.source_type = source_type

    def ingest_csv(self, file_path: str | Path) -> List[Dict[str, Any]]:
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"CSV file not found: {file_path}")

        records = []
        with open(path, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                cleaned_row = {}
                for k, v in row.items():
                    if k is None:
                        continue
                    k_clean = k.strip()
                    val = v.strip() if isinstance(v, str) else v
                    # Try converting numeric values
                    if val == "" or val is None:
                        cleaned_row[k_clean] = None
                    else:
                        try:
                            if "." in val:
                                cleaned_row[k_clean] = float(val)
                            else:
                                cleaned_row[k_clean] = int(val)
                        except ValueError:
                            cleaned_row[k_clean] = val
                records.append(cleaned_row)

        logger.info("Ingested %d records from CSV %s", len(records), path.name)
        return records

    def ingest_geojson(self, file_path: str | Path) -> Dict[str, Any]:
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"GeoJSON file not found: {file_path}")

        with open(path, mode="r", encoding="utf-8") as f:
            data = json.load(f)

        logger.info(
            "Ingested GeoJSON %s with %d features",
            path.name,
            len(data.get("features", [])),
        )
        return data

    def ingest_json(self, file_path: str | Path) -> List[Dict[str, Any]]:
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"JSON file not found: {file_path}")

        with open(path, mode="r", encoding="utf-8") as f:
            data = json.load(f)

        if isinstance(data, list):
            return data
        return [data]

    def ingest(self, source_config: dict) -> dict:
        file_path = source_config.get("file_path")
        format_type = source_config.get("format", "csv").lower()

        if not file_path:
            return {
                "source_type": self.source_type,
                "status": "error",
                "message": "file_path is required in source_config",
                "records": [],
            }

        try:
            if format_type == "geojson":
                geojson = self.ingest_geojson(file_path)
                features = geojson.get("features", [])
                records = [
                    {**f.get("properties", {}), "geometry": f.get("geometry")}
                    for f in features
                ]
            elif format_type == "json":
                records = self.ingest_json(file_path)
            else:
                records = self.ingest_csv(file_path)

            return {
                "source_type": self.source_type,
                "status": "staged",
                "record_count": len(records),
                "records": records,
                "fields": list(records[0].keys()) if records else [],
            }
        except Exception as exc:
            logger.exception("Ingestion failed for %s: %s", file_path, exc)
            return {
                "source_type": self.source_type,
                "status": "failed",
                "error": str(exc),
                "records": [],
            }

