from typing import Any

from sqlalchemy.orm import Session

from ..database import models


class DataSourceRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_sources(self) -> list[models.DataSource]:
        return self.db.query(models.DataSource).all()

    def get_source(self, source_id: str) -> models.DataSource | None:
        return (
            self.db.query(models.DataSource)
            .filter(models.DataSource.source_id == source_id)
            .first()
        )

    def create(self, **kwargs) -> models.DataSource:
        source = models.DataSource(**kwargs)
        self.db.add(source)
        self.db.commit()
        self.db.refresh(source)
        return source


def get_data_source_repository(db: Session) -> DataSourceRepository:
    return DataSourceRepository(db)
