from fastapi import APIRouter, Depends

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
    service: DashboardService = Depends(get_dashboard_service_dependency),
) -> DashboardSummary:
    result = service.summary()
    return DashboardSummary(**result)

