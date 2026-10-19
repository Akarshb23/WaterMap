from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class MapGeometry(BaseModel):
    type: str = Field(..., min_length=1)
    coordinates: list = Field(default_factory=list)


class MapLayer(BaseModel):
    layer_id: str = Field(..., min_length=1)
    layer_name: str = Field(..., min_length=1)
    geometry: MapGeometry = Field(default_factory=lambda: MapGeometry(type="Polygon", coordinates=[]))
    description: Optional[str] = None


class MapSummary(BaseModel):
    layers: list[MapLayer] = Field(default_factory=list)
    ward_count: int = Field(..., ge=0)
    boundary_style: str = Field(..., min_length=1)
    bounds: Optional[Dict[str, float]] = None


class GeoJSONFeature(BaseModel):
    type: str = "Feature"
    id: Optional[str] = None
    properties: Dict[str, Any] = Field(default_factory=dict)
    geometry: Dict[str, Any] = Field(default_factory=dict)


class GeoJSONFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    layer: Optional[str] = "ward_boundaries"
    features: List[GeoJSONFeature] = Field(default_factory=list)
    bounds: Optional[Dict[str, float]] = None
    ward_count: int = 0


class PointLookupOut(BaseModel):
    matched_ward_id: Optional[str] = None
    ward_name: Optional[str] = None
    district: Optional[str] = None
    zone: Optional[str] = None
    confidence: float = 0.0
    is_inside: bool = False
    distance_km: Optional[float] = None
    water_stress_index: Optional[float] = None
    risk_category: Optional[str] = None

