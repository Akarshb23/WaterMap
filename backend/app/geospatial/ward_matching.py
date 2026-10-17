import json
import math
import logging
from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session

from ..database import queries

logger = logging.getLogger(__name__)


def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Computes great circle distance between two points in kilometers."""
    R = 6371.0  # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2.0) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c


def point_in_polygon(lon: float, lat: float, ring: List[List[float]]) -> bool:
    """Ray casting algorithm to test if (lon, lat) is inside a polygon ring."""
    n = len(ring)
    inside = False
    p1x, p1y = ring[0][0], ring[0][1]

    for i in range(1, n + 1):
        p2x, p2y = ring[i % n][0], ring[i % n][1]
        if lat > min(p1y, p2y):
            if lat <= max(p1y, p2y):
                if lon <= max(p1x, p2x):
                    if p1y != p2y:
                        xints = (lat - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                    if p1x == p2x or lon <= xints:
                        inside = not inside
        p1x, p1y = p2x, p2y

    return inside


class WardMatcher:
    def __init__(self, db: Optional[Session] = None) -> None:
        self.db = db

    def match_point(
        self, lat: float, lon: float, db: Optional[Session] = None
    ) -> Dict[str, Any]:
        """Matches a latitude/longitude point to a ward using point-in-polygon,
        falling back to nearest ward centroid distance."""
        session = db or self.db
        if not session:
            return {
                "matched_ward_id": None,
                "ward_name": None,
                "confidence": 0.0,
                "is_inside": False,
                "distance_km": None,
            }

        wards = queries.list_wards(session)
        best_match = None
        min_distance = float("inf")
        nearest_ward = None

        for w in wards:
            # Check point-in-polygon if geometry is available
            if w.geometry:
                try:
                    geom = json.loads(w.geometry) if isinstance(w.geometry, str) else w.geometry
                    if geom.get("type") == "Polygon" and geom.get("coordinates"):
                        ring = geom["coordinates"][0]
                        if point_in_polygon(lon, lat, ring):
                            return {
                                "matched_ward_id": w.ward_id,
                                "ward_name": w.name,
                                "district": w.district,
                                "zone": w.zone,
                                "confidence": 1.0,
                                "is_inside": True,
                                "distance_km": 0.0,
                                "water_stress_index": float(w.water_stress_index or 0.0),
                                "risk_category": w.risk_category,
                            }
                except Exception as exc:
                    logger.debug("Error parsing geometry for ward %s: %s", w.ward_id, exc)

            # Check centroid distance
            c_lat = float(w.centroid_lat or 12.9716)
            c_lon = float(w.centroid_lon or 77.5946)
            dist = haversine_distance_km(lat, lon, c_lat, c_lon)
            if dist < min_distance:
                min_distance = dist
                nearest_ward = w

        if nearest_ward:
            # Confidence decays with distance (1.0 at 0km down to 0.0 at 15km)
            confidence = round(max(0.0, 1.0 - (min_distance / 15.0)), 2)
            return {
                "matched_ward_id": nearest_ward.ward_id,
                "ward_name": nearest_ward.name,
                "district": nearest_ward.district,
                "zone": nearest_ward.zone,
                "confidence": confidence,
                "is_inside": False,
                "distance_km": round(min_distance, 2),
                "water_stress_index": float(nearest_ward.water_stress_index or 0.0),
                "risk_category": nearest_ward.risk_category,
            }

        return {
            "matched_ward_id": None,
            "confidence": 0.0,
            "is_inside": False,
            "matches": [],
        }

    def match(
        self, geometry: Dict[str, Any], threshold: float = 0.8
    ) -> Dict[str, Any]:
        """Legacy interface for geometry matching."""
        if not geometry:
            return {"matched_ward_id": None, "confidence": 0.0, "matches": []}

        # If coordinates provided, try matching centroid
        coords = geometry.get("coordinates", [])
        if coords and coords[0] and len(coords[0]) > 0:
            pt = coords[0][0]
            if len(pt) >= 2:
                return self.match_point(lat=pt[1], lon=pt[0])

        return {
            "matched_ward_id": None,
            "confidence": 0.0,
            "matches": [],
        }

