from pydantic import BaseModel, Field


class MapGeometry(BaseModel):
    type: str = Field(..., min_length=1)
    coordinates: list = Field(default_factory=list)


class MapLayer(BaseModel):
    layer_id: str = Field(..., min_length=1)
    layer_name: str = Field(..., min_length=1)
    geometry: MapGeometry = Field(default_factory=MapGeometry)


class MapSummary(BaseModel):
    layers: list[MapLayer] = Field(default_factory=list)
    ward_count: int = Field(..., ge=0)
    boundary_style: str = Field(..., min_length=1)
