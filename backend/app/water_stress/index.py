"""Water Stress Index calculation service."""
from typing import Any, Dict, Iterable
from .normalization import normalize_metric
from .weights import WEIGHTS, ALIASES
from .risk_categories import risk_category

def calculate_wsi(indicators: Iterable[Any], fallback_score: float = 0.0) -> dict:
    scores: Dict[str, float] = {}
    for indicator in indicators:
        metric = str(getattr(indicator, "metric", indicator.get("metric", "") if isinstance(indicator, dict) else "")).lower()
        value = getattr(indicator, "value", indicator.get("value") if isinstance(indicator, dict) else None)
        if value is None: continue
        canonical = next((key for key, aliases in ALIASES.items() if metric in aliases or any(a in metric for a in aliases)), None)
        if canonical:
            scores[canonical] = normalize_metric(metric, float(value))
    total = sum(WEIGHTS[k] for k in scores)
    score = sum(scores[k] * WEIGHTS[k] for k in scores) / total if total else max(0.0, min(1.0, float(fallback_score or 0.0)))
    return {"water_stress_index": round(score, 4), "risk_category": risk_category(score), "indicators_used": len(scores), "indicator_scores": scores, "method": "weighted_normalized_indicators" if scores else "stored_ward_index_fallback"}
