"""Prioritize recommended actions on a 1..10 scale."""
def priority_for(score: float, risk_category: str) -> int:
    base = round(max(0.0, min(1.0, float(score))) * 8) + 2
    if risk_category == "critical": base += 1
    return max(1, min(10, base))
