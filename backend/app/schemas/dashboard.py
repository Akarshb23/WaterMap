from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class TopStressedWard(BaseModel):
    ward_id: str
    name: str
    water_stress_index: float
    risk_category: str
    population: int


class DashboardSummary(BaseModel):
    total_wards: int = Field(..., ge=0)
    healthy_wards: int = Field(..., ge=0)
    warning_wards: int = Field(..., ge=0)
    critical_wards: int = Field(..., ge=0)
    last_updated: str
    city_avg_stress_index: float = Field(default=0.0, ge=0.0, le=1.0)
    risk_distribution: Dict[str, int] = Field(default_factory=dict)
    top_critical_wards: List[TopStressedWard] = Field(default_factory=list)

