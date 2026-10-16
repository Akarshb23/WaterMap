from typing import Any

from sqlalchemy.orm import Session

from ..database import models


class WardRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_wards(self) -> list[models.Ward]:
        return self.db.query(models.Ward).all()

    def get_ward(self, ward_id: str) -> models.Ward | None:
        return self.db.query(models.Ward).filter(models.Ward.ward_id == ward_id).first()

    def create(self, **kwargs) -> models.Ward:
        ward = models.Ward(**kwargs)
        self.db.add(ward)
        self.db.commit()
        self.db.refresh(ward)
        return ward


def get_ward_repository(db: Session) -> WardRepository:
    return WardRepository(db)
