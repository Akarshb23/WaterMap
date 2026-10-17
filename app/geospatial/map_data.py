import json
import logging
from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session

from ..database import queries
from .boundaries import BoundaryResolver

logger = logging.getLogger(__name__)

AVAILABLE_LAYERS = [
    {
        "layer_id": "ward_boundaries",
        "layer_name": "Ward Boundaries & Water Stress Index",
        "geometry_type": "Polygon",
        "description": "BBMP administrative ward boundaries with composite water stress index and risk tiers.",
    },
    {
        "layer_id": "groundwater_stress",
        "layer_name": "Groundwater Depletion Layer",
        "geometry_type": "Polygon",
        "description": "Ward-level depth to groundwater (mbgl) and over-exploitation classification.",
    },
    {
        "layer_id": "water_supply_deficit",
        "layer_name": "Municipal Piped Supply Deficit",
        "geometry_type": "Polygon",
        "description": "Per capita piped water distribution (LPCD) vs national 135 LPCD benchmark.",
    },
    {
        "layer_id": "tanker_hotspots",
        "layer_name": "Commercial Tanker Reliance Hotspots",
        "geometry_type": "Polygon",
        "description": "Tanker delivery density and water scarcity grievance frequency.",
    },
    {
        "layer_id": "surface_water_bodies",
        "layer_name": "Urban Lake & Water Body Health",
        "geometry_type": "Polygon",
        "description": "Satellite-mapped surface water spread area, storage utilization, and lake coverage ratio.",
    },
]


class MapDataLoader:
    def __init__(self, db: Optional[Session] = None) -> None:
        self.db = db

    def list_layers(self) -> List[Dict[str, Any]]:
        return AVAILABLE_LAYERS

    def load(self, layer: str = "ward_boundaries", db: Optional[Session] = None) -> Dict[str, Any]:
        session = db or self.db
        if not session:
            return {
                "type": "FeatureCollection",
                "layer": layer,
                "features": [],
                "bounds": {"minx": 0.0, "miny": 0.0, "maxx": 0.0, "maxy": 0.0},
            }

        wards = queries.list_wards(session)
        features = []
        all_lons = []
        all_lats = []

        for w in wards:
            geom = None
            if w.geometry:
                try:
                    geom = json.loads(w.geometry) if isinstance(w.geometry, str) else w.geometry
                except Exception:
                    geom = None

            if not geom:
                # generate basic fallback polygon if none exists
                lat = float(w.centroid_lat or 12.9716)
                lon = float(w.centroid_lon or 77.5946)
                geom = {
                    "type": "Polygon",
                    "coordinates": [[
                        [lon - 0.01, lat - 0.01],
                        [lon + 0.01, lat - 0.01],
                        [lon + 0.01, lat + 0.01],
                        [lon - 0.01, lat + 0.01],
                        [lon - 0.01, lat - 0.01],
                    ]],
                }

            # Collect coordinates for bounds
            coords = geom.get("coordinates", [])
            if coords and coords[0]:
                for pt in coords[0]:
                    if len(pt) >= 2:
                        all_lons.append(pt[0])
                        all_lats.append(pt[1])

            # Get latest indicators for properties
            indicators = queries.get_latest_indicators_for_ward(session, w.ward_id)
            ind_props = {
                ind.metric: {
                    "raw_value": float(ind.value),
                    "unit": ind.unit,
                    "normalized_value": float(ind.normalized_value or 0.0),
                }
                for ind in indicators.values()
            }

            feature = {
                "type": "Feature",
                "id": w.ward_id,
                "properties": {
                    "ward_id": w.ward_id,
                    "name": w.name,
                    "district": w.district,
                    "zone": w.zone,
                    "population": w.population,
                    "area_sqkm": float(w.area_sqkm or 0.0),
                    "water_stress_index": float(w.water_stress_index or 0.0),
                    "risk_category": w.risk_category or "low",
                    "centroid_lat": float(w.centroid_lat or 12.9716),
                    "centroid_lon": float(w.centroid_lon or 77.5946),
                    "indicators": ind_props,
                },
                "geometry": geom,
            }
            features.append(feature)

        bounds = {
            "minx": min(all_lons) if all_lons else 77.4,
            "miny": min(all_lats) if all_lats else 12.8,
            "maxx": max(all_lons) if all_lons else 77.8,
            "maxy": max(all_lats) if all_lats else 13.2,
        }

        return {
            "type": "FeatureCollection",
            "layer": layer,
            "features": features,
            "bounds": bounds,
            "ward_count": len(features),
        }

