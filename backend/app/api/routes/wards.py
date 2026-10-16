from fastapi import APIRouter, Depends, HTTPException, status

from ...core.dependencies import get_ward_service_dependency
from ...services.ward_service import WardOut

router = APIRouter(
    prefix="/wards",
    tags=["wards"],
)


@router.get(
    "",
    response_model=list[WardOut],
)
def list_wards(
    service = Depends(get_ward_service_dependency),
) -> list[WardOut]:
    return service.list_wards()


@router.get(
    "/{ward_id}",
    response_model=WardOut,
)
def get_ward(
    ward_id: str,
    service = Depends(get_ward_service_dependency),
) -> WardOut:
    ward = service.get_ward(ward_id)
    if ward is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ward not found",
        )
    return ward
