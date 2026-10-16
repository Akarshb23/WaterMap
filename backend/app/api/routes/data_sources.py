from fastapi import APIRouter, Depends, HTTPException, status

from ...core.dependencies import get_data_source_service_dependency
from ...services.data_source_service import DataSourceOut, DataSourceCreate

router = APIRouter(
    prefix="/data-sources",
    tags=["data-sources"],
)


@router.get(
    "",
    response_model=list[DataSourceOut],
)
def list_data_sources(
    service = Depends(get_data_source_service_dependency),
) -> list[DataSourceOut]:
    return service.list_data_sources()


@router.post(
    "",
    response_model=DataSourceOut,
    status_code=status.HTTP_201_CREATED,
)
def create_data_source(
    payload: DataSourceCreate,
    service = Depends(get_data_source_service_dependency),
) -> DataSourceOut:
    source = service.create_data_source(
        name=payload.name,
        type=payload.type,
        url=payload.url,
        description=payload.description,
        refresh_interval_hours=payload.refresh_interval_hours,
        is_active=payload.is_active,
    )
    return DataSourceOut(
        source_id=source["source_id"],
        name=source["name"],
        type=source["type"],
        url=source["url"],
        description=source["description"],
        refresh_interval_hours=source["refresh_interval_hours"],
        is_active=source["is_active"],
    )


@router.get(
    "/{source_id}",
    response_model=DataSourceOut,
)
def get_data_source(
    source_id: str,
    service = Depends(get_data_source_service_dependency),
) -> DataSourceOut:
    source = service.get_data_source(source_id)
    if source is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Data source not found",
        )
    return DataSourceOut(
        source_id=source["source_id"],
        name=source["name"],
        type=source["type"],
        url=source["url"],
        description=source["description"],
        refresh_interval_hours=source["refresh_interval_hours"],
        is_active=source["is_active"],
    )
