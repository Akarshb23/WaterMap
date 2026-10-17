from typing import Any, Optional, List
from sqlalchemy.orm import Session

from ..database import models, queries


class WardRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_wards(
        self,
        district: Optional[str] = None,
        zone: Optional[str] = None,
        risk_category: Optional[str] = None,
        min_stress: Optional[float] = None,
        max_stress: Optional[float] = None,
        search: Optional[str] = None,
        limit: Optional[int] = None,
        offset: Optional[int] = None,
    ) -> List[models.Ward]:
        return queries.list_wards(
            self.db,
            district=district,
            zone=zone,
            risk_category=risk_category,
            min_stress=min_stress,
            max_stress=max_stress,
            search=search,
            limit=limit,
            offset=offset,
        )

    def count_wards(self) -> int:
        return queries.count_wards(self.db)

    def get_ward(self, ward_id: str) -> Optional[models.Ward]:
        return queries.get_ward(self.db, ward_id)

    def create(self, **kwargs) -> models.Ward:
        return queries.create_ward(self.db, **kwargs)

    def update(self, ward_id: str, **kwargs) -> Optional[models.Ward]:
        return queries.update_ward(self.db, ward_id, **kwargs)

    def delete(self, ward_id: str) -> bool:
        ward = self.get_ward(ward_id)
        if not ward:
            return False
        self.db.delete(ward)
        self.db.commit()
        return True


def get_ward_repository(db: Session) -> WardRepository:
    return WardRepository(db)

