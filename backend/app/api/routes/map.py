from typing import Any, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status

from ...core.dependencies import get_map_service_dependency
from ...schemas.map import MapGeometry, MapLayer, MapSummary, PointLookupOut, GeoJSONFeatureCollection
from ...services.map_service import MapService

router = APIRouter(
    prefix="/map",
    tags=["map"],
)


@router.get(
    "/layers",
    response_model=MapSummary,
)
def list_map_layers(
    service: MapService = Depends(get_map_service_dependency),
) -> MapSummary:
    layers = service.list_layers()
    return MapSummary(
        layers=[
            MapLayer(
                layer_id=l["layer_id"],
                layer_name=l["layer_name"],
                geometry=MapGeometry(
                    type=l["geometry"].get("type", "Polygon"),
                    coordinates=l["geometry"].get("coordinates", []),
                ),
                description=l.get("description"),
            )
            for l in layers
        ],
        ward_count=service.count_wards(),
        boundary_style="simplified",
    )


@router.get(
    "/geojson",
    response_model=GeoJSONFeatureCollection,
)
def get_map_geojson(
    layer: str = Query("ward_boundaries", description="Map layer to render"),
    service: MapService = Depends(get_map_service_dependency),
) -> GeoJSONFeatureCollection:
    data = service.get_geojson(layer=layer)
    return GeoJSONFeatureCollection(**data)


@router.get(
    "/wards/{ward_id}",
    response_model=MapGeometry,
)
def get_ward_geometry(
    ward_id: str,
    service: MapService = Depends(get_map_service_dependency),
) -> MapGeometry:
    geometry = service.ward_geometry(ward_id)
    if geometry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ward geometry not found",
        )
    return geometry


@router.get(
    "/lookup",
    response_model=PointLookupOut,
)
def lookup_ward_by_coordinates(
    lat: float = Query(..., ge=-90.0, le=90.0, description="Latitude"),
    lon: float = Query(..., ge=-180.0, le=180.0, description="Longitude"),
    service: MapService = Depends(get_map_service_dependency),
) -> PointLookupOut:
    return service.lookup_point(lat=lat, lon=lon)

