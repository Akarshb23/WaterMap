import json
import logging
from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session

from ..database import queries
from ..schemas.ward import WardOut, WardDetailOut, WardIndicatorOut

logger = logging.getLogger(__name__)


class WardService:
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
    ) -> List[WardOut]:
        wards = queries.list_wards(
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
        return [
            WardOut(
                ward_id=w.ward_id,
                name=w.name,
                district=w.district,
                zone=w.zone,
                population=w.population,
                area_sqkm=float(w.area_sqkm) if w.area_sqkm else None,
                water_stress_index=float(w.water_stress_index or 0.0),
                risk_category=w.risk_category or "low",
                centroid_lat=float(w.centroid_lat) if w.centroid_lat else None,
                centroid_lon=float(w.centroid_lon) if w.centroid_lon else None,
            )
            for w in wards
        ]

    def get_ward(self, ward_id: str) -> Optional[WardDetailOut]:
        ward = queries.get_ward(self.db, ward_id)
        if ward is None:
            return None

        # Parse geometry
        geom = None
        if ward.geometry:
            try:
                geom = json.loads(ward.geometry) if isinstance(ward.geometry, str) else ward.geometry
            except Exception:
                geom = None

        # Fetch latest indicators
        indicators = queries.list_indicators_for_ward(self.db, ward_id)
        ind_models = [
            WardIndicatorOut(
                indicator_id=ind.indicator_id,
                metric=ind.metric,
                value=float(ind.value),
                unit=ind.unit,
                normalized_value=float(ind.normalized_value or 0.0),
                source_id=ind.source_id,
                recorded_at=ind.recorded_at,
            )
            for ind in indicators
        ]

        return WardDetailOut(
            ward_id=ward.ward_id,
            name=ward.name,
            district=ward.district,
            zone=ward.zone,
            population=ward.population,
            area_sqkm=float(ward.area_sqkm) if ward.area_sqkm else None,
            water_stress_index=float(ward.water_stress_index or 0.0),
            risk_category=ward.risk_category or "low",
            centroid_lat=float(ward.centroid_lat) if ward.centroid_lat else None,
            centroid_lon=float(ward.centroid_lon) if ward.centroid_lon else None,
            geometry=geom,
            indicators=ind_models,
        )

    def get_ward_indicators(
        self, ward_id: str, metric: Optional[str] = None
    ) -> List[WardIndicatorOut]:
        indicators = queries.list_indicators_for_ward(self.db, ward_id, metric=metric)
        return [
            WardIndicatorOut(
                indicator_id=ind.indicator_id,
                metric=ind.metric,
                value=float(ind.value),
                unit=ind.unit,
                normalized_value=float(ind.normalized_value or 0.0),
                source_id=ind.source_id,
                recorded_at=ind.recorded_at,
            )
            for ind in indicators
        ]


def get_ward_service(db: Session) -> WardService:
    return WardService(db)

