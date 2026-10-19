"""Explainable contribution breakdown for a composite water-stress score."""
from typing import Dict
from .weights import WEIGHTS, ALIASES

def explain_score(scores: Dict[str, float]) -> dict:
    matched = {}
    for canonical, aliases in ALIASES.items():
        for metric, score in scores.items():
            if metric.lower() in aliases or any(alias in metric.lower() for alias in aliases):
                matched[canonical] = max(0.0, min(1.0, float(score)))
                break
    denominator = sum(WEIGHTS[k] for k in matched)
    contributions = {k: round(v * WEIGHTS[k] / denominator, 4) for k, v in matched.items()} if denominator else {}
    score = sum(matched[k] * WEIGHTS[k] for k in matched) / denominator if denominator else None
    return {"water_stress_index": round(score, 4) if score is not None else None, "indicators_used": len(matched), "contributions": contributions, "weights_used": {k: WEIGHTS[k] for k in matched}}
