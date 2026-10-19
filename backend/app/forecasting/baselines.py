"""Transparent baseline forecast functions."""
def persistence_forecast(current_score: float, horizon_days: int) -> float:
    # With no longitudinal observation series, persistence is the honest baseline.
    return round(max(0.0, min(1.0, float(current_score))), 4)
