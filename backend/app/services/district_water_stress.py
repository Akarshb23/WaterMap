
"""District-level Water Stress Index with strict data-quality safeguards.

Input:
    backend/data/raw/district_metrics.csv

The input must contain district-level normalized stress observations with
explicit district identifiers, observation dates, verification flags, and
traceable source URLs. Ward-level demo CSVs are never used here.
"""

import csv
import logging
import math
import re
import unicodedata
from collections import defaultdict
from datetime import date
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)

METRIC_WEIGHTS = {
    "groundwater": 0.30,
    "rainfall": 0.15,
    "piped_supply": 0.25,
    "tanker_reliance": 0.20,
    "water_bodies": 0.10,
}

MINIMUM_METRIC_FAMILIES = 3

RISK_BANDS = (
    (0.75, "critical"),
    (0.55, "high"),
    (0.35, "moderate"),
    (0.00, "low"),
)

SYNTHETIC_SOURCE_MARKERS = (
    "synthetic",
    "demo",
    "mock",
    "placeholder",
    "test_data",
)

TRUTHY_VALUES = {"true", "1", "yes", "verified"}


def _normalize_name(value: Any) -> str:
    """Normalize names for exact matching, without fuzzy matching."""
    text = unicodedata.normalize("NFKD", str(value or ""))
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    text = text.casefold().strip()
    text = re.sub(r"[^a-z0-9]+", " ", text)
    return " ".join(text.split())


def _normalize_id(value: Any) -> str:
    return str(value or "").strip().casefold()


def _is_verified(value: Any) -> bool:
    return str(value or "").strip().casefold() in TRUTHY_VALUES


def _valid_source(source_id: str, source_url: str) -> bool:
    source_id_normalized = source_id.casefold()

    if not source_id.strip() or not source_url.strip():
        return False

    if any(marker in source_id_normalized for marker in SYNTHETIC_SOURCE_MARKERS):
        return False

    return source_url.startswith(("https://", "http://"))


def _parse_date(value: Any) -> date | None:
    try:
        return date.fromisoformat(str(value).strip())
    except (TypeError, ValueError):
        return None


def _risk_category(score: float) -> str:
    for threshold, category in RISK_BANDS:
        if score >= threshold:
            return category
    return "low"


def _empty_properties(properties: dict[str, Any]) -> dict[str, Any]:
    """Preserve boundary identity while clearing unverified analytical values."""
    return {
        **properties,
        "water_stress_index": None,
        "risk_category": "insufficient_data",
        "data_status": "insufficient_data",
        "data_coverage": 0,
        "data_date": None,
        "data_source": None,
        "indicators_used": 0,
        "verified_indicators": 0,
        "estimated_indicators": 0,
        "indicator_scores": {},
    }


def _feature_match_key(properties: dict[str, Any]) -> tuple[str, str]:
    district_id = _normalize_id(properties.get("district_id"))
    district_name = _normalize_name(properties.get("district_name"))
    return district_id, district_name


def _load_metric_records(csv_path: Path) -> list[dict[str, Any]]:
    if not csv_path.is_file():
        logger.info("District metrics file not found: %s", csv_path)
        return []

    required_columns = {
        "district_id",
        "district_name",
        "observation_date",
        "metric",
        "normalized_value",
        "source_id",
        "source_url",
        "is_verified",
    }

    accepted = []
    rejected = 0

    with csv_path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        columns = set(reader.fieldnames or [])

        missing = required_columns - columns
        if missing:
            raise ValueError(
                "district_metrics.csv is missing required columns: "
                + ", ".join(sorted(missing))
            )

        for row in reader:
            district_id = _normalize_id(row.get("district_id"))
            district_name = _normalize_name(row.get("district_name"))
            metric = str(row.get("metric") or "").strip().casefold()
            observation_date = _parse_date(row.get("observation_date"))
            source_id = str(row.get("source_id") or "").strip()
            source_url = str(row.get("source_url") or "").strip()

            try:
                value = float(row.get("normalized_value", ""))
            except (TypeError, ValueError):
                rejected += 1
                continue

            verified = _is_verified(row.get("is_verified"))
            data_quality = str(row.get("data_quality") or "").strip().casefold()
            # Non-verified values are accepted only from the explicitly named,
            # documented WaterMap estimate model. This keeps arbitrary or
            # untraceable rows out while allowing a usable, labelled estimate.
            source_name_normalized = str(row.get("source_name") or "").casefold()
            allowed_estimate = (
                not verified
                and source_id == "WATERMAP_ESTIMATE_V1"
                and data_quality in {"estimated_model", "estimated_proxy"}
                and "estimate" in source_name_normalized
            )

            if (
                not district_id
                or not district_name
                or metric not in METRIC_WEIGHTS
                or observation_date is None
                or not math.isfinite(value)
                or not 0.0 <= value <= 1.0
                or (not verified and not allowed_estimate)
                or not _valid_source(source_id, source_url)
            ):
                rejected += 1
                continue

            accepted.append({
                "district_id": district_id,
                "district_name": district_name,
                "observation_date": observation_date,
                "metric": metric,
                "normalized_value": value,
                "source_id": source_id,
                "source_url": source_url,
                "source_name": str(row.get("source_name") or source_id).strip(),
                "is_verified": verified,
                "data_quality": data_quality or ("observed_source_value" if verified else "estimated_model"),
            })

    logger.info(
        "District metrics loaded: %d accepted, %d rejected",
        len(accepted),
        rejected,
    )

    return accepted


def enrich_district_features(
    features: list[dict[str, Any]],
    raw_dir: Path,
) -> list[dict[str, Any]]:
    """Enrich boundary features only with verified district-level records.

    Records match by exact normalized district ID OR, when the CSV ID is
    blank, exact normalized district name. No fuzzy, positional, ward, or
    coordinate-based matching is performed.
    """
    csv_path = Path(raw_dir) / "district_metrics.csv"
    records = _load_metric_records(csv_path)

    records_by_id: dict[str, list[dict[str, Any]]] = defaultdict(list)
    records_by_name: dict[str, list[dict[str, Any]]] = defaultdict(list)

    for record in records:
        if record["district_id"]:
            records_by_id[record["district_id"]].append(record)
        if record["district_name"]:
            records_by_name[record["district_name"]].append(record)

    enriched = []

    for feature in features:
        properties = feature.get("properties") or {}
        district_id, district_name = _feature_match_key(properties)

        matched = records_by_id.get(district_id, []) if district_id else []

        # Name matching is used only when no district ID was supplied
        # by the observation. It is exact after normalization.
        if not matched:
            matched = [
                record
                for record in records_by_name.get(district_name, [])
                if not record["district_id"]
            ]

        new_properties = _empty_properties(properties)

        if matched:
            # Use the latest observation date for each metric family.
            latest_by_metric: dict[str, date] = {}

            for record in matched:
                metric = record["metric"]
                latest_by_metric[metric] = max(
                    latest_by_metric.get(metric, record["observation_date"]),
                    record["observation_date"],
                )

            selected_records = []
            for metric, latest_date in latest_by_metric.items():
                selected_records.extend(
                    record
                    for record in matched
                    if record["metric"] == metric
                    and record["observation_date"] == latest_date
                )

            # Multiple observations for the same district, metric, and
            # latest date are averaged within that metric family.
            metric_values: dict[str, list[float]] = defaultdict(list)

            for record in selected_records:
                metric_values[record["metric"]].append(
                    record["normalized_value"]
                )

            metric_scores = {
                metric: sum(values) / len(values)
                for metric, values in metric_values.items()
                if values
            }

            if len(metric_scores) >= MINIMUM_METRIC_FAMILIES:
                total_weight = sum(
                    METRIC_WEIGHTS[metric]
                    for metric in metric_scores
                )

                score = sum(
                    metric_scores[metric] * METRIC_WEIGHTS[metric]
                    for metric in metric_scores
                ) / total_weight

                score = round(max(0.0, min(1.0, score)), 4)

                latest_date = max(
                    record["observation_date"]
                    for record in selected_records
                )

                source_names = sorted({
                    record["source_name"]
                    for record in selected_records
                })

                verified_metrics = {
                    metric for metric in metric_scores
                    if any(record["metric"] == metric and record["is_verified"] for record in selected_records)
                }
                estimated_metrics = set(metric_scores) - verified_metrics
                score_status = "estimated_model" if estimated_metrics else "verified_district_metrics"

                new_properties.update({
                    "water_stress_index": score,
                    "risk_category": _risk_category(score),
                    "data_status": score_status,
                    "data_coverage": round(
                        len(metric_scores) / len(METRIC_WEIGHTS) * 100
                    ),
                    "verified_indicators": len(verified_metrics),
                    "estimated_indicators": len(estimated_metrics),
                    "data_date": latest_date.isoformat(),
                    "data_source": "; ".join(source_names),
                    "indicators_used": len(metric_scores),
                    "indicator_scores": {
                        metric: round(value, 4)
                        for metric, value in metric_scores.items()
                    },
                })
            else:
                new_properties["data_status"] = (
                    "insufficient_verified_metric_families"
                )

        enriched.append({
            **feature,
            "properties": new_properties,
        })

    return enriched
