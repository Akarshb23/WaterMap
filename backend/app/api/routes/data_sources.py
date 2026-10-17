from typing import List
from fastapi import APIRouter, Depends, HTTPException, status

from ...core.dependencies import get_data_source_service_dependency
from ...schemas.data_source import DataSourceOut, DataSourceCreate
from ...services.data_source_service import DataSourceService

router = APIRouter(
    prefix="/data-sources",
    tags=["data-sources"],
)


@router.get(
    "",
    response_model=List[DataSourceOut],
)
def list_data_sources(
    service: DataSourceService = Depends(get_data_source_service_dependency),
) -> List[DataSourceOut]:
    return service.list_data_sources()


@router.post(
    "",
    response_model=DataSourceOut,
    status_code=status.HTTP_201_CREATED,
)
def create_data_source(
    payload: DataSourceCreate,
    service: DataSourceService = Depends(get_data_source_service_dependency),
) -> DataSourceOut:
    source = service.create_data_source(
        name=payload.name,
        type=payload.type,
        url=payload.url,
        description=payload.description,
        refresh_interval_hours=payload.refresh_interval_hours,
        is_active=payload.is_active,
    )
    return source


@router.get(
    "/{source_id}",
    response_model=DataSourceOut,
)
def get_data_source(
    source_id: str,
    service: DataSourceService = Depends(get_data_source_service_dependency),
) -> DataSourceOut:
    source = service.get_data_source(source_id)
    if source is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Data source '{source_id}' not found",
        )
    return source

