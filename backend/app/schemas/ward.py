from pydantic import BaseModel, Field


class WardOut(BaseModel):
    ward_id: str = Field(..., min_length=1)
    name: str = Field(..., min_length=1)
    district: str = Field(..., min_length=1)
    population: int = Field(..., ge=0)
    water_stress_index: float = Field(..., ge=0.0, le=1.0)
    risk_category: str = Field(..., min_length=1)
