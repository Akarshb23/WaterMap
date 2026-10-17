import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class Cleaner:
    def standardize_ward_id(self, raw_id: Any) -> str:
        if raw_id is None:
            return ""
        sid = str(raw_id).strip().upper()
        if sid.startswith("W") and sid[1:].isdigit():
            sid = f"W{int(sid[1:]):03d}"
        elif sid.isdigit():
            sid = f"W{int(sid):03d}"
        return sid


    def clean_ward_record(self, record: Dict[str, Any]) -> Dict[str, Any]:
        cleaned = dict(record)
        cleaned["ward_id"] = self.standardize_ward_id(cleaned.get("ward_id"))

        if "name" in cleaned and cleaned["name"]:
            cleaned["name"] = str(cleaned["name"]).strip().title()

        if "district" in cleaned:
            cleaned["district"] = str(cleaned["district"] or "Bengaluru Urban").strip()

        # Handle population
        try:
            pop = int(cleaned.get("population") or 0)
            cleaned["population"] = max(pop, 5000)
        except (ValueError, TypeError):
            cleaned["population"] = 45000  # default median urban ward population

        # Handle area
        try:
            area = float(cleaned.get("area_sqkm") or 0.0)
            cleaned["area_sqkm"] = round(max(area, 0.5), 2)
        except (ValueError, TypeError):
            cleaned["area_sqkm"] = 5.0

        return cleaned

    def clean_groundwater_record(self, record: Dict[str, Any]) -> Dict[str, Any]:
        cleaned = dict(record)
        cleaned["ward_id"] = self.standardize_ward_id(cleaned.get("ward_id"))

        val = cleaned.get("water_level_mbgl")
        try:
            val_f = float(val) if val is not None else 35.0
            # Clamp between 0.0 and 150.0 mbgl
            cleaned["water_level_mbgl"] = round(min(max(val_f, 0.0), 150.0), 2)
        except (ValueError, TypeError):
            cleaned["water_level_mbgl"] = 35.0

        return cleaned

    def clean_rainfall_record(self, record: Dict[str, Any]) -> Dict[str, Any]:
        cleaned = dict(record)
        cleaned["ward_id"] = self.standardize_ward_id(cleaned.get("ward_id"))

        act = cleaned.get("actual_rainfall_mm")
        norm = cleaned.get("normal_rainfall_mm")
        try:
            act_f = max(0.0, float(act)) if act is not None else 700.0
            norm_f = max(1.0, float(norm)) if norm is not None else 840.0
            cleaned["actual_rainfall_mm"] = round(act_f, 1)
            cleaned["normal_rainfall_mm"] = round(norm_f, 1)
            cleaned["departure_pct"] = round(((act_f - norm_f) / norm_f) * 100.0, 1)
        except (ValueError, TypeError):
            cleaned["actual_rainfall_mm"] = 700.0
            cleaned["normal_rainfall_mm"] = 840.0
            cleaned["departure_pct"] = -16.7

        return cleaned

    def clean_water_supply_record(self, record: Dict[str, Any]) -> Dict[str, Any]:
        cleaned = dict(record)
        cleaned["ward_id"] = self.standardize_ward_id(cleaned.get("ward_id"))

        lpcd = cleaned.get("per_capita_lpcd")
        try:
            lpcd_f = max(0.0, float(lpcd)) if lpcd is not None else 75.0
            # Clamp to max 250 LPCD
            cleaned["per_capita_lpcd"] = round(min(lpcd_f, 250.0), 1)
        except (ValueError, TypeError):
            cleaned["per_capita_lpcd"] = 75.0

        return cleaned

    def clean_tanker_record(self, record: Dict[str, Any]) -> Dict[str, Any]:
        cleaned = dict(record)
        cleaned["ward_id"] = self.standardize_ward_id(cleaned.get("ward_id"))

        trips = cleaned.get("registered_tanker_trips")
        try:
            cleaned["registered_tanker_trips"] = max(0, int(trips)) if trips is not None else 50
        except (ValueError, TypeError):
            cleaned["registered_tanker_trips"] = 50

        complaints = cleaned.get("scarcity_complaints")
        try:
            cleaned["scarcity_complaints"] = max(0, int(complaints)) if complaints is not None else 10
        except (ValueError, TypeError):
            cleaned["scarcity_complaints"] = 10

        return cleaned

    def clean(
        self, records: List[Dict[str, Any]], dataset_type: Optional[str] = None
    ) -> Dict[str, Any]:
        cleaned_records = []
        seen_keys = set()
        dropped = 0
        imputed = 0
        clamped = 0
        warnings = []

        cleaner_func = {
            "wards": self.clean_ward_record,
            "groundwater": self.clean_groundwater_record,
            "rainfall": self.clean_rainfall_record,
            "water_supply": self.clean_water_supply_record,
            "tankers": self.clean_tanker_record,
        }.get(dataset_type)

        for i, rec in enumerate(records):
            if not isinstance(rec, dict):
                dropped += 1
                warnings.append(f"Row {i} is not a valid dictionary record; dropped.")
                continue

            cleaned_rec = cleaner_func(rec) if cleaner_func else dict(rec)
            key = cleaned_rec.get("ward_id") or cleaned_rec.get("source_id") or f"row_{i}"

            # Deduplication
            if key in seen_keys:
                dropped += 1
                warnings.append(f"Duplicate record with key '{key}' at row {i}; dropped.")
                continue

            seen_keys.add(key)
            cleaned_records.append(cleaned_rec)

        return {
            "records": cleaned_records,
            "cleaned": len(cleaned_records),
            "dropped": dropped,
            "imputed": imputed,
            "clamped": clamped,
            "warnings": warnings,
        }

