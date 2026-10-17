import json
import logging
from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session

from ..database import queries
from ..geospatial.boundaries import BoundaryResolver
from ..geospatial.map_data import MapDataLoader
from ..geospatial.ward_matching import WardMatcher
from ..schemas.map import MapGeometry, MapLayer, MapSummary, PointLookupOut

logger = logging.getLogger(__name__)


class MapService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.loader = MapDataLoader(db)
        self.boundary_resolver = BoundaryResolver(db)
        self.matcher = WardMatcher(db)

    def list_layers(self) -> List[Dict[str, Any]]:
        return [
            {
                "layer_id": "ward_boundaries",
                "layer_name": "Ward Boundaries",
                "geometry": {"type": "Polygon", "coordinates": []},
                "description": "Administrative ward boundaries with water stress index",
            },
            {
                "layer_id": "groundwater_stress",
                "layer_name": "Groundwater Depletion Layer",
                "geometry": {"type": "Polygon", "coordinates": []},
                "description": "Depth to groundwater and exploitation tiers",
            },
            {
                "layer_id": "piped_water_deficit",
                "layer_name": "Piped Water Supply Deficit",
                "geometry": {"type": "Polygon", "coordinates": []},
                "description": "Per capita piped water distribution vs benchmark",
            },
            {
                "layer_id": "tanker_reliance",
                "layer_name": "Tanker Reliance Hotspots",
                "geometry": {"type": "Polygon", "coordinates": []},
                "description": "Commercial tanker dependency frequency",
            },
        ]

    def count_wards(self) -> int:
        return queries.count_wards(self.db)

    def ward_geometry(self, ward_id: str) -> Optional[MapGeometry]:
        ward = queries.get_ward(self.db, ward_id)
        if ward is None:
            return None

        if ward.geometry:
            try:
                geom_data = json.loads(ward.geometry) if isinstance(ward.geometry, str) else ward.geometry
                return MapGeometry(
                    type=geom_data.get("type", "Polygon"),
                    coordinates=geom_data.get("coordinates", []),
                )
            except Exception:
                pass

        # If no geometry string stored, fallback to synthetic square around centroid
        lat = float(ward.centroid_lat or 12.9716)
        lon = float(ward.centroid_lon or 77.5946)
        return MapGeometry(
            type="Polygon",
            coordinates=[[
                [lon - 0.01, lat - 0.01],
                [lon + 0.01, lat - 0.01],
                [lon + 0.01, lat + 0.01],
                [lon - 0.01, lat + 0.01],
                [lon - 0.01, lat - 0.01],
            ]],
        )

    def get_geojson(self, layer: str = "ward_boundaries") -> Dict[str, Any]:
        return self.loader.load(layer=layer, db=self.db)

    def lookup_point(self, lat: float, lon: float) -> PointLookupOut:
        result = self.matcher.match_point(lat=lat, lon=lon, db=self.db)
        return PointLookupOut(**result)


def get_map_service(db: Session) -> MapService:
    return MapService(db)

