"""Baseline ward-level water-stress forecasting."""
from datetime import date, timedelta
from .baselines import persistence_forecast
from ..water_stress.risk_categories import risk_category

def forecast_ward(ward, indicators, horizon_days: int = 30) -> dict:
    current = max(0.0, min(1.0, float(ward.water_stress_index or 0.0)))
    predicted = persistence_forecast(current, horizon_days)
    confidence = max(0.25, min(0.85, 0.8 - horizon_days * 0.005 + min(len(indicators), 5) * 0.02))
    return {"prediction_id": f"pred-{ward.ward_id}-{horizon_days}d", "ward_id": ward.ward_id, "forecast_date": (date.today()+timedelta(days=horizon_days)).isoformat(), "horizon_days": horizon_days, "current_water_stress_index": round(current,4), "water_stress_index": predicted, "risk_category": risk_category(predicted), "confidence": round(confidence, 2), "model_version": "baseline-persistence-1.0", "method": "persistence baseline; historical time series unavailable", "created_at": date.today().isoformat()}
