from typing import Any, Dict, List, Optional
import logging

logger = logging.getLogger(__name__)


class Normalizer:
    @staticmethod
    def normalize_groundwater(depth_mbgl: float) -> float:
        """Groundwater: Deeper water table = higher stress.
        0m -> 0.0; 75m+ -> 1.0."""
        return round(min(1.0, max(0.0, depth_mbgl / 75.0)), 3)

    @staticmethod
    def normalize_water_supply(lpcd: float) -> float:
        """Piped Water Supply: CPHEEO benchmark 135 LPCD.
        >= 135 LPCD -> 0.0; <= 25 LPCD -> 1.0."""
        if lpcd >= 135.0:
            return 0.0
        return round(min(1.0, max(0.0, (135.0 - lpcd) / 110.0)), 3)

    @staticmethod
    def normalize_rainfall(departure_pct: float) -> float:
        """Rainfall Anomaly: Deficit (% below normal) = higher stress.
        >= 0% (surplus/normal) -> 0.0; <= -60% (drought) -> 1.0."""
        if departure_pct >= 0.0:
            return 0.0
        return round(min(1.0, max(0.0, abs(departure_pct) / 60.0)), 3)

    @staticmethod
    def normalize_tanker_dependency(trips_per_thousand: float) -> float:
        """Tanker Trips per 1,000 population: Higher trips = higher stress.
        0 -> 0.0; >= 6.0 trips/k -> 1.0."""
        return round(min(1.0, max(0.0, trips_per_thousand / 6.0)), 3)

    @staticmethod
    def normalize_surface_water(coverage_pct: float) -> float:
        """Lake/Surface Water Coverage % of Ward Area.
        >= 5.0% -> 0.0 (good buffering); 0.0% -> 1.0 (no buffering)."""
        if coverage_pct >= 5.0:
            return 0.0
        return round(min(1.0, max(0.0, (5.0 - coverage_pct) / 5.0)), 3)

    def normalize_metric(self, metric: str, raw_value: float) -> float:
        m = metric.lower().strip()
        if "groundwater" in m or "water_level" in m:
            return self.normalize_groundwater(raw_value)
        elif "supply" in m or "lpcd" in m:
            return self.normalize_water_supply(raw_value)
        elif "rain" in m or "departure" in m:
            return self.normalize_rainfall(raw_value)
        elif "tanker" in m:
            return self.normalize_tanker_dependency(raw_value)
        elif "lake" in m or "surface_water" in m or "coverage" in m:
            return self.normalize_surface_water(raw_value)
        else:
            # Default linear scale [0, 100] -> [0, 1]
            return round(min(1.0, max(0.0, raw_value / 100.0)), 3)

    def normalize(self, records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        normalized = []
        for r in records:
            metric = str(r.get("metric", "")).lower().strip()
            val = float(r.get("value", 0.0) or 0.0)
            norm_val = self.normalize_metric(metric, val)
            item = dict(r)
            item["metric"] = metric
            item["value"] = val
            item["normalized_value"] = norm_val
            normalized.append(item)
        return normalized

