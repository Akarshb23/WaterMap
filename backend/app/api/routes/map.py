from fastapi import APIRouter, Depends, HTTPException, status

from ...core.dependencies import get_map_service_dependency
from ...services.map_service import MapGeometry, MapLayer, MapSummary

router = APIRouter(
    prefix="/map",
    tags=["map"],
)


@router.get(
    "/layers",
    response_model=MapSummary,
)
def list_map_layers(
    service = Depends(get_map_service_dependency),
) -> MapSummary:
    layers = service.list_layers()
    return MapSummary(
        layers=[
            MapLayer(
                layer_id=l["layer_id"],
                layer_name=l["layer_name"],
                geometry=l["geometry"],
            )
            for l in layers
        ],
        ward_count=service.count_wards(),
        boundary_style="simplified",
    )


@router.get(
    "/wards/{ward_id}",
    response_model=MapGeometry,
)
def get_ward_geometry(
    ward_id: str,
    service = Depends(get_map_service_dependency),
) -> MapGeometry:
    geometry = service.ward_geometry(ward_id)
    if geometry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ward geometry not found",
        )
    return geometry
