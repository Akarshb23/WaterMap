"""Consistent Water Stress Index risk bands."""
def risk_category(score: float) -> str:
    score = max(0.0, min(1.0, float(score)))
    if score >= 0.75: return "critical"
    if score >= 0.55: return "high"
    if score >= 0.35: return "moderate"
    return "low"

def risk_label(score: float) -> str:
    return risk_category(score).title()
