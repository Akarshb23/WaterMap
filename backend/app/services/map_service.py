from typing import Any

from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..database import queries


class MapGeometry(BaseModel):
    type: str
    coordinates: list


class MapLayer(BaseModel):
    layer_id: str
    layer_name: str
    geometry: MapGeometry


class MapSummary(BaseModel):
    layers: list[MapLayer]
    ward_count: int
    boundary_style: str


class MapService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_layers(self) -> list[dict[str, Any]]:
        layers = [
            {"layer_id": "ward_boundaries", "layer_name": "Ward Boundaries", "geometry": {}}
        ]
        return layers

    def count_wards(self) -> int:
        return len(queries.list_wards(self.db))

    def ward_geometry(self, ward_id: str) -> dict[str, Any] | None:
        ward = queries.get_ward(self.db, ward_id)
        if ward is None:
            return None
        return {
            "type": "Polygon",
            "coordinates": [],
        }


def get_map_service(db: Session) -> MapService:
    return MapService(db)
