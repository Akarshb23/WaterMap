"""Indicator validation and normalization helpers."""
from typing import Any, Dict, Iterable, List
from .normalization import normalize_metric

def normalize_indicators(indicators: Iterable[Any]) -> List[Dict[str, Any]]:
    result = []
    for item in indicators:
        metric = str(item.get("metric", "")).strip()
        if not metric: continue
        try: value = float(item.get("value"))
        except (TypeError, ValueError): continue
        if not __import__("math").isfinite(value): continue
        result.append({**item, "metric": metric, "value": value, "normalized_value": normalize_metric(metric, value)})
    return result
