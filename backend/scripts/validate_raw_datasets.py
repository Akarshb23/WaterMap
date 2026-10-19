"""Validate WaterMap's five demo CSVs without importing them into official wards.

These rows are synthetic test fixtures. This script validates file shape and basic
numeric consistency only; it does not establish real-world data provenance.
Run from backend/: python scripts/validate_raw_datasets.py
"""
import csv
import json
from pathlib import Path

RAW = Path(__file__).resolve().parents[1] / "data" / "raw"
SPECS = {
    "groundwater_levels.csv": {
        "columns": ["ward_id", "station_id", "date", "water_level_mbgl", "pre_monsoon_mbgl", "post_monsoon_mbgl", "status", "source_id"],
        "numeric": ["water_level_mbgl", "pre_monsoon_mbgl", "post_monsoon_mbgl"],
    },
    "rainfall_precipitation.csv": {
        "columns": ["ward_id", "station_id", "date", "actual_rainfall_mm", "normal_rainfall_mm", "departure_pct", "dry_spell_days", "source_id"],
        "numeric": ["actual_rainfall_mm", "normal_rainfall_mm", "departure_pct", "dry_spell_days"],
    },
    "piped_water_supply.csv": {
        "columns": ["ward_id", "date", "supply_mld", "per_capita_lpcd", "benchmark_lpcd", "deficit_lpcd", "supply_hours_per_day", "source_id"],
        "numeric": ["supply_mld", "per_capita_lpcd", "benchmark_lpcd", "deficit_lpcd", "supply_hours_per_day"],
    },
    "tanker_water_demand.csv": {
        "columns": ["ward_id", "date", "registered_tanker_trips", "avg_tanker_price_inr", "scarcity_complaints", "trips_per_thousand_residents", "source_id"],
        "numeric": ["registered_tanker_trips", "avg_tanker_price_inr", "scarcity_complaints", "trips_per_thousand_residents"],
    },
    "water_bodies_lakes.csv": {
        "columns": ["ward_id", "lake_name", "total_area_ha", "storage_capacity_pct", "coverage_pct_of_ward", "source_id"],
        "numeric": ["total_area_ha", "storage_capacity_pct", "coverage_pct_of_ward"],
    },
}

report = {"status": "passed", "data_classification": "SYNTHETIC_DEMO", "datasets": {}, "warnings": []}
for filename, spec in SPECS.items():
    path = RAW / filename
    if not path.exists():
        report["status"] = "failed"
        report["datasets"][filename] = {"status": "failed", "error": "file missing"}
        continue
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        columns = reader.fieldnames or []
        rows = list(reader)
    errors = []
    if columns != spec["columns"]:
        errors.append({"expected_columns": spec["columns"], "actual_columns": columns})
    if len(rows) != 25:
        errors.append(f"expected 25 rows; found {len(rows)}")
    ids = [r.get("ward_id", "").strip() for r in rows]
    if len(set(ids)) != len(ids):
        errors.append("duplicate ward_id rows")
    if any(not value.startswith("W") for value in ids):
        errors.append("expected W-style demo ward IDs")
    for i, row in enumerate(rows, start=2):
        if row.get("source_id") != "SYNTHETIC_DEMO":
            errors.append(f"line {i}: source_id must be SYNTHETIC_DEMO")
        for column in spec["numeric"]:
            try:
                value = float(row[column])
                if value != value or value in (float("inf"), float("-inf")):
                    raise ValueError("not finite")
            except (ValueError, TypeError, KeyError):
                errors.append(f"line {i}: invalid numeric value for {column}")
    report["datasets"][filename] = {"status": "passed" if not errors else "failed", "rows": len(rows), "unique_ward_ids": len(set(ids)), "errors": errors}
    if errors:
        report["status"] = "failed"

report["warnings"].append("W001-W025 are synthetic IDs and are not mapped to official BBMP-### ward polygons.")
report["warnings"].append("Passing these checks confirms CSV shape and basic numeric validity only, not official provenance or real-world accuracy.")
output = RAW.parent / "processed" / "demo_dataset_validation.json"
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(json.dumps(report, indent=2), encoding="utf-8")
print(json.dumps(report, indent=2))
raise SystemExit(0 if report["status"] == "passed" else 1)
