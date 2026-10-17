from typing import Any, List, Optional
from sqlalchemy.orm import Session

from ..database import queries
from ..schemas.data_source import DataSourceOut, DataSourceCreate



class DataSourceService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_data_sources(self) -> list[DataSourceOut]:
        return [
            DataSourceOut(
                source_id=s.source_id,
                name=s.name,
                type=s.source_type,
                url=s.url,
                description=s.description,
                refresh_interval_hours=s.refresh_interval_hours,
                is_active=s.is_active,
            )
            for s in queries.list_data_sources(self.db)
        ]

    def get_data_source(self, source_id: str) -> DataSourceOut | None:
        source = queries.get_data_source(self.db, source_id)
        if source is None:
            return None
        return DataSourceOut(
            source_id=source.source_id,
            name=source.name,
            type=source.source_type,
            url=source.url,
            description=source.description,
            refresh_interval_hours=source.refresh_interval_hours,
            is_active=source.is_active,
        )

    def create_data_source(self, name: str, type: str, url: str | None,
                           description: str | None, refresh_interval_hours: int,
                           is_active: bool = True) -> DataSourceOut:
        source = queries.create_data_source(
            db=self.db,
            name=name,
            source_type=type,
            url=url,
            description=description,
            refresh_interval_hours=refresh_interval_hours,
            is_active=is_active,
        )
        return DataSourceOut(
            source_id=source.source_id,
            name=source.name,
            type=source.source_type,
            url=source.url,
            description=source.description,
            refresh_interval_hours=source.refresh_interval_hours,
            is_active=source.is_active,
        )


def get_data_source_service(db: Session) -> DataSourceService:
    return DataSourceService(db)
