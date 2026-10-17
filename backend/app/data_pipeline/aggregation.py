from typing import Any, Dict, List, Optional
from collections import defaultdict
import logging

logger = logging.getLogger(__name__)

DEFAULT_WEIGHTS = {
    "groundwater": 0.30,
    "water_supply": 0.25,
    "tankers": 0.20,
    "rainfall": 0.15,
    "lakes": 0.10,
}


class Aggregator:
    def __init__(self, weights: Optional[Dict[str, float]] = None) -> None:
        self.weights = weights or DEFAULT_WEIGHTS

    def aggregate(self, records: List[Dict[str, Any]], group_by: str = "source_id") -> Dict[str, Any]:
        """Generic aggregation matching the original interface."""
        count = len(records)
        avg = (sum(r.get("value", 0.0) for r in records) / count) if count > 0 else 0.0
        return {
            "group_by": group_by,
            "count": count,
            "average": round(avg, 3),
        }

    def compute_composite_wsi(self, normalized_scores: Dict[str, float]) -> float:
        """Computes weighted Water Stress Index (0.0 to 1.0)."""
        total_weight = 0.0
        weighted_sum = 0.0

        for key, score in normalized_scores.items():
            # Match key to weights
            w = 0.0
            for weight_key, weight_val in self.weights.items():
                if weight_key in key:
                    w = weight_val
                    break
            if w == 0.0:
                w = 0.10  # fallback weight for unclassified metric

            weighted_sum += score * w
            total_weight += w

        if total_weight == 0.0:
            return 0.0
        return round(min(1.0, max(0.0, weighted_sum / total_weight)), 3)

    @staticmethod
    def get_risk_category(wsi: float) -> str:
        """Determines risk category from Water Stress Index."""
        if wsi >= 0.75:
            return "critical"
        elif wsi >= 0.55:
            return "high"
        elif wsi >= 0.35:
            return "moderate"
        return "low"

    def aggregate_ward_indicators(
        self, ward_indicators: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Groups indicators for a ward, calculates latest readings and composite index."""
        scores: Dict[str, float] = {}
        for ind in ward_indicators:
            metric = ind.get("metric", "")
            norm_val = ind.get("normalized_value", 0.0)
            scores[metric] = norm_val

        wsi = self.compute_composite_wsi(scores)
        risk_cat = self.get_risk_category(wsi)

        return {
            "water_stress_index": wsi,
            "risk_category": risk_cat,
            "indicator_count": len(ward_indicators),
            "scores": scores,
        }

