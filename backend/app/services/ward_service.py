from pydantic import BaseModel
from typing import Any

from sqlalchemy.orm import Session

from ..database import queries


class WardOut(BaseModel):
    ward_id: str
    name: str
    district: str
    population: int
    water_stress_index: float
    risk_category: str


class WardService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_wards(self) -> list[WardOut]:
        return [
            WardOut(
                ward_id=w.ward_id,
                name=w.name,
                district=w.district,
                population=w.population,
                water_stress_index=float(w.water_stress_index or 0.0),
                risk_category=w.risk_category,
            )
            for w in queries.list_wards(self.db)
        ]

    def get_ward(self, ward_id: str) -> WardOut | None:
        ward = queries.get_ward(self.db, ward_id)
        if ward is None:
            return None
        return WardOut(
            ward_id=ward.ward_id,
            name=ward.name,
            district=ward.district,
            population=ward.population,
            water_stress_index=float(ward.water_stress_index or 0.0),
            risk_category=ward.risk_category,
        )


def get_ward_service(db: Session) -> WardService:
    return WardService(db)
