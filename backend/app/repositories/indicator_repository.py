from typing import Any

from sqlalchemy.orm import Session

from ..database import models


class IndicatorRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_by_ward(self, ward_id: str) -> list[models.Indicator]:
        return (
            self.db.query(models.Indicator)
            .filter(models.Indicator.ward_id == ward_id)
            .all()
        )


def get_indicator_repository(db: Session) -> IndicatorRepository:
    return IndicatorRepository(db)
