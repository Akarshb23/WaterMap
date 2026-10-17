from typing import Any, Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class WardIndicatorOut(BaseModel):
    indicator_id: str
    metric: str
    value: float
    unit: Optional[str] = None
    normalized_value: float = Field(default=0.0, ge=0.0, le=1.0)
    source_id: Optional[str] = None
    recorded_at: Optional[datetime] = None


class WardOut(BaseModel):
    ward_id: str = Field(..., min_length=1)
    name: str = Field(..., min_length=1)
    district: str = Field(..., min_length=1)
    zone: Optional[str] = None
    population: int = Field(..., ge=0)
    area_sqkm: Optional[float] = None
    water_stress_index: float = Field(..., ge=0.0, le=1.0)
    risk_category: str = Field(..., min_length=1)
    centroid_lat: Optional[float] = None
    centroid_lon: Optional[float] = None


class WardDetailOut(WardOut):
    geometry: Optional[Dict[str, Any]] = None
    indicators: List[WardIndicatorOut] = Field(default_factory=list)

