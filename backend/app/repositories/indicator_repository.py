from typing import Any, Optional, List, Dict
from sqlalchemy.orm import Session

from ..database import models, queries


class IndicatorRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_by_ward(
        self, ward_id: str, metric: Optional[str] = None
    ) -> List[models.Indicator]:
        return queries.list_indicators_for_ward(self.db, ward_id, metric)

    def get_latest_for_ward(self, ward_id: str) -> Dict[str, models.Indicator]:
        return queries.get_latest_indicators_for_ward(self.db, ward_id)

    def get_indicator(self, indicator_id: str) -> Optional[models.Indicator]:
        return queries.get_indicator(self.db, indicator_id)

    def create(self, **kwargs) -> models.Indicator:
        return queries.create_indicator(self.db, **kwargs)

    def upsert(self, indicator_id: str, **kwargs) -> models.Indicator:
        return queries.upsert_indicator(self.db, indicator_id, **kwargs)

    def bulk_create(self, indicators_data: List[dict]) -> List[models.Indicator]:
        created = []
        for item in indicators_data:
            ind = models.Indicator(**item)
            self.db.add(ind)
            created.append(ind)
        self.db.commit()
        return created


def get_indicator_repository(db: Session) -> IndicatorRepository:
    return IndicatorRepository(db)

