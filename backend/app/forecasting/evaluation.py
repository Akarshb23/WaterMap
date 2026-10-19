"""Forecast evaluation metrics."""
def mean_absolute_error(actual, predicted) -> float:
    pairs = [(float(a), float(p)) for a, p in zip(actual, predicted)]
    if not pairs: raise ValueError("At least one actual/predicted pair is required")
    return round(sum(abs(a-p) for a,p in pairs) / len(pairs), 4)
