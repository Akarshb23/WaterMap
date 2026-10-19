from fastapi import APIRouter, Depends, Query
from ...core.city_registry import validate_city_id

from ...core.dependencies import get_dashboard_service_dependency
from ...schemas.dashboard import DashboardSummary
from ...services.dashboard_service import DashboardService

router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"],
)


@router.get(
    "",
    response_model=DashboardSummary,
)
def get_dashboard_summary(
    city_id: str = Query("bengaluru"),
    service: DashboardService = Depends(get_dashboard_service_dependency),
) -> DashboardSummary:
    validate_city_id(city_id)
    result = service.summary()
    return DashboardSummary(**result)

