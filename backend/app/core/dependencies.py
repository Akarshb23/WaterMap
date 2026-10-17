from typing import Generator

from fastapi import Depends, Request
from sqlalchemy.orm import Session

from .config import get_settings
from .logging import setup_logging
from .exceptions import WardNotFoundException
from ..database import get_db, SessionLocal
from ..services.dashboard_service import DashboardService, get_dashboard_service
from ..services.ward_service import WardService, get_ward_service
from ..services.map_service import MapService, get_map_service
from ..services.data_source_service import DataSourceService, get_data_source_service
from ..repositories.ward_repository import WardRepository, get_ward_repository
from ..repositories.indicator_repository import IndicatorRepository, get_indicator_repository
from ..repositories.data_source_repository import DataSourceRepository, get_data_source_repository
from ..data_pipeline.pipeline_runner import DataPipeline, get_data_pipeline
from ..data_pipeline.source_registry import get_source_registry


def get_settings_dependency() -> object:
    return get_settings()


def get_db_dependency() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_ward_not_found_exception(ward_id: str) -> WardNotFoundException:
    return WardNotFoundException(ward_id=ward_id)


def get_dashboard_service_dependency(
    db: Session = Depends(get_db_dependency),
) -> DashboardService:
    return get_dashboard_service(db=db)


def get_ward_service_dependency(
    db: Session = Depends(get_db_dependency),
) -> WardService:
    return get_ward_service(db=db)


def get_map_service_dependency(
    db: Session = Depends(get_db_dependency),
) -> MapService:
    return get_map_service(db=db)


def get_data_source_service_dependency(
    db: Session = Depends(get_db_dependency),
) -> DataSourceService:
    return get_data_source_service(db=db)


def get_ward_repository_dependency(
    db: Session = Depends(get_db_dependency),
) -> WardRepository:
    return get_ward_repository(db=db)


def get_indicator_repository_dependency(
    db: Session = Depends(get_db_dependency),
) -> IndicatorRepository:
    return get_indicator_repository(db=db)


def get_data_source_repository_dependency(
    db: Session = Depends(get_db_dependency),
) -> DataSourceRepository:
    return get_data_source_repository(db=db)


def get_data_pipeline_dependency(
    db: Session = Depends(get_db_dependency),
) -> DataPipeline:
    registry = get_source_registry()
    return get_data_pipeline(db=db, registry=registry)
