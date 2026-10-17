from typing import Any, Optional, List
from sqlalchemy.orm import Session

from ..database import models, queries


class DataSourceRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_sources(self, active_only: bool = False) -> List[models.DataSource]:
        return queries.list_data_sources(self.db, active_only=active_only)

    def get_source(self, source_id: str) -> Optional[models.DataSource]:
        return queries.get_data_source(self.db, source_id)

    def create(self, **kwargs) -> models.DataSource:
        return queries.create_data_source(self.db, **kwargs)

    def update(self, source_id: str, **kwargs) -> Optional[models.DataSource]:
        source = self.get_source(source_id)
        if not source:
            return None
        for k, v in kwargs.items():
            if hasattr(source, k) and v is not None:
                setattr(source, k, v)
        self.db.commit()
        self.db.refresh(source)
        return source

    def delete(self, source_id: str) -> bool:
        source = self.get_source(source_id)
        if not source:
            return False
        self.db.delete(source)
        self.db.commit()
        return True


def get_data_source_repository(db: Session) -> DataSourceRepository:
    return DataSourceRepository(db)

