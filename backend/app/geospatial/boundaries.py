import json
import logging
from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session

from ..database import queries

logger = logging.getLogger(__name__)


class BoundaryResolver:
    def __init__(self, db: Optional[Session] = None) -> None:
        self.db = db

    def resolve(self, ward_id: str, db: Optional[Session] = None) -> Dict[str, Any]:
        session = db or self.db
        if session:
            ward = queries.get_ward(session, ward_id)
            if ward and ward.geometry:
                try:
                    geom = json.loads(ward.geometry) if isinstance(ward.geometry, str) else ward.geometry
                    return {
                        "ward_id": ward_id,
                        "name": ward.name,
                        "geometry": geom,
                        "source": "database",
                    }
                except Exception as e:
                    logger.warning("Error parsing geometry for ward %s: %s", ward_id, e)

        # Fallback empty polygon
        return {
            "ward_id": ward_id,
            "name": f"Ward {ward_id}",
            "geometry": {"type": "Polygon", "coordinates": []},
            "source": "fallback",
        }

    @staticmethod
    def compute_bbox(coordinates: List[Any]) -> Dict[str, float]:
        """Calculates bounding box [minx, miny, maxx, maxy] for a GeoJSON Polygon."""
        if not coordinates or not coordinates[0]:
            return {"minx": 0.0, "miny": 0.0, "maxx": 0.0, "maxy": 0.0}

        ring = coordinates[0]
        lons = [p[0] for p in ring if len(p) >= 2]
        lats = [p[1] for p in ring if len(p) >= 2]

        if not lons or not lats:
            return {"minx": 0.0, "miny": 0.0, "maxx": 0.0, "maxy": 0.0}

        return {
            "minx": min(lons),
            "miny": min(lats),
            "maxx": max(lons),
            "maxy": max(lats),
        }

    @staticmethod
    def compute_centroid(coordinates: List[Any]) -> Dict[str, float]:
        """Calculates average centroid coordinate from a polygon ring."""
        if not coordinates or not coordinates[0]:
            return {"lat": 12.9716, "lon": 77.5946}

        ring = coordinates[0]
        valid_points = [p for p in ring if len(p) >= 2]
        if not valid_points:
            return {"lat": 12.9716, "lon": 77.5946}

        avg_lon = sum(p[0] for p in valid_points) / len(valid_points)
        avg_lat = sum(p[1] for p in valid_points) / len(valid_points)
        return {"lat": round(avg_lat, 6), "lon": round(avg_lon, 6)}

