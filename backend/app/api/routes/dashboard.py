from fastapi import APIRouter, Depends
from pydantic import BaseModel

from ...core.dependencies import get_dashboard_service_dependency
from ...schemas.dashboard import DashboardSummary

router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"],
)


@router.get(
    "",
    response_model=DashboardSummary,
)
def get_dashboard_summary(
    service = Depends(get_dashboard_service_dependency),
) -> DashboardSummary:
    result = service.summary()
    return DashboardSummary(
        total_wards=result["total_wards"],
        healthy_wards=result["healthy_wards"],
        warning_wards=result["warning_wards"],
        critical_wards=result["critical_wards"],
        last_updated=result["last_updated"],
    )
