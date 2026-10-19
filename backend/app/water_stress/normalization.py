"""Normalize raw water indicators to a comparable 0..1 stress scale."""
def normalize_metric(metric: str, value: float) -> float:
    key = metric.lower().strip()
    value = float(value)
    if "groundwater" in key or "depth_mbgl" in key or "water_level" in key:
        score = value / 75.0
    elif "supply" in key or "lpcd" in key:
        score = (135.0 - value) / 110.0
    elif "rain" in key or "departure" in key or "deficit" in key:
        score = max(0.0, -value / 60.0)
    elif "tanker" in key:
        score = value / 6.0
    elif "lake" in key or "surface_water" in key or "coverage" in key or "water_body" in key:
        score = (5.0 - value) / 5.0
    else:
        score = value / 100.0
    return round(max(0.0, min(1.0, score)), 4)
