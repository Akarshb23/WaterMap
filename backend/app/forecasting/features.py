"""Feature extraction for ward-level forecasts."""
def build_features(ward, indicators):
    return {"ward_id": ward.ward_id, "current_wsi": max(0.0, min(1.0, float(ward.water_stress_index or 0.0))), "indicator_count": len(indicators), "population": int(ward.population or 0), "area_sqkm": float(ward.area_sqkm or 0.0)}
