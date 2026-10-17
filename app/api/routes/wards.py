from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status

from ...core.dependencies import get_ward_service_dependency
from ...schemas.ward import WardOut, WardDetailOut, WardIndicatorOut
from ...services.ward_service import WardService

router = APIRouter(
    prefix="/wards",
    tags=["wards"],
)


@router.get(
    "",
    response_model=List[WardOut],
)
def list_wards(
    district: Optional[str] = Query(None, description="Filter by district name"),
    zone: Optional[str] = Query(None, description="Filter by administrative zone"),
    risk_category: Optional[str] = Query(None, description="Filter by risk category: low, moderate, high, critical"),
    min_stress: Optional[float] = Query(None, ge=0.0, le=1.0, description="Minimum water stress index"),
    max_stress: Optional[float] = Query(None, ge=0.0, le=1.0, description="Maximum water stress index"),
    search: Optional[str] = Query(None, description="Search by name, ID, or zone"),
    limit: Optional[int] = Query(None, ge=1, le=1000, description="Pagination limit"),
    offset: Optional[int] = Query(None, ge=0, description="Pagination offset"),
    service: WardService = Depends(get_ward_service_dependency),
) -> List[WardOut]:
    return service.list_wards(
        district=district,
        zone=zone,
        risk_category=risk_category,
        min_stress=min_stress,
        max_stress=max_stress,
        search=search,
        limit=limit,
        offset=offset,
    )


@router.get(
    "/{ward_id}",
    response_model=WardDetailOut,
)
def get_ward(
    ward_id: str,
    service: WardService = Depends(get_ward_service_dependency),
) -> WardDetailOut:
    ward = service.get_ward(ward_id)
    if ward is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ward '{ward_id}' not found",
        )
    return ward


@router.get(
    "/{ward_id}/indicators",
    response_model=List[WardIndicatorOut],
)
def get_ward_indicators(
    ward_id: str,
    service: WardService = Depends(get_ward_service_dependency),
) -> List[WardIndicatorOut]:
    ward = service.get_ward(ward_id)
    if ward is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ward '{ward_id}' not found",
        )
    return service.get_ward_indicators(ward_id)


@router.get(
    "/{ward_id}/indicators/{metric}",
    response_model=List[WardIndicatorOut],
)
def get_ward_metric_indicators(
    ward_id: str,
    metric: str,
    service: WardService = Depends(get_ward_service_dependency),
) -> List[WardIndicatorOut]:
    ward = service.get_ward(ward_id)
    if ward is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ward '{ward_id}' not found",
        )
    return service.get_ward_indicators(ward_id, metric=metric)

