from pydantic import BaseModel, Field


class PredictionOut(BaseModel):
    prediction_id: str = Field(..., min_length=1)
    ward_id: str = Field(..., min_length=1)
    forecast_date: str = Field(..., min_length=1)
    water_stress_index: float = Field(..., ge=0.0, le=1.0)
    confidence: float = Field(..., ge=0.0, le=1.0)
    model_version: str = Field(..., min_length=1)
    created_at: str = Field(..., min_length=1)
