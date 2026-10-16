from pydantic import BaseModel, Field


class DashboardSummary(BaseModel):
    total_wards: int = Field(..., ge=0)
    healthy_wards: int = Field(..., ge=0)
    warning_wards: int = Field(..., ge=0)
    critical_wards: int = Field(..., ge=0)
    last_updated: str
