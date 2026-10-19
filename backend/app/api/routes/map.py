
from pathlib import Path
import json
import logging
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pyproj import CRS, Transformer
from shapely.geometry import mapping, shape
from shapely.ops import transform as transform_geometry

from ...core.dependencies import get_map_service_dependency
from ...core.city_registry import validate_city_id
from ...schemas.map import (
    GeoJSONFeatureCollection,
    MapGeometry,
    MapLayer,
    MapSummary,
    PointLookupOut,
)
from ...services.map_service import MapService
from ...services.district_water_stress import enrich_district_features

logger = logging.getLogger(__name__)

# Module-level paths are intentionally patchable in tests.
BACKEND_DIR = Path(__file__).resolve().parents[3]
RAW_DATA_DIR = BACKEND_DIR / "data" / "raw"

DISTRICT_GEOJSON_PATH = RAW_DATA_DIR / "karnataka_districts.geojson"
DISTRICT_METRICS_PATH = RAW_DATA_DIR / "district_metrics.csv"

# Simplification tolerance in the source CRS units.
# The expected EPSG:7755 source uses metres.
# Adjust after visually validating boundaries at your intended zoom level.
DISTRICT_SIMPLIFY_TOLERANCE_METRES = 100.0

router = APIRouter(prefix="/map", tags=["map"])

# Cache only the processed boundary features, not metric enrichment.
# This allows updated district_metrics.csv data to be picked up on
# subsequent requests without rereading and reprojecting the GeoJSON.
_boundary_cache: dict[str, Any] = {}


def _normalize_properties(
    properties: dict[str, Any],
) -> dict[str, Any]:
    """Normalize source property names without changing their values."""
    return {
        str(key).strip().lower().replace(" ", "_").replace("-", "_"): value
        for key, value in properties.items()
    }


def _get_district_name(properties: dict[str, Any]) -> str:
    return str(
        properties.get("lgd_districtname")
        or properties.get("dtname")
        or properties.get("district_name")
        or properties.get("district")
        or properties.get("name")
        or properties.get("dt_name")
        or ""
    ).strip()


def _get_state_name(properties: dict[str, Any]) -> str:
    return str(
        properties.get("stname")
        or properties.get("state_name")
        or properties.get("state")
        or properties.get("statename")
        or properties.get("state_ut")
        or ""
    ).strip().casefold()


def _get_district_code(properties: dict[str, Any]) -> str:
    """Stable official district identifier.

    LGD district codes (Local Government Directory) are the official
    Government of India identifiers; the IAB2024 source carries them in
    lgd_districtcode, legacy NWIC source in dtcode.
    """
    return str(
        properties.get("lgd_districtcode")
        or properties.get("dtcode")
        or properties.get("district_code")
        or properties.get("lgd_code")
        or properties.get("dt_code")
        or ""
    ).strip()


def _load_district_boundaries(
    local_path: Path | None = None,
) -> tuple[dict[str, Any], str, str]:
    """Synchronously load and validate the local district GeoJSON."""
    path = Path(local_path or DISTRICT_GEOJSON_PATH)

    if not path.is_file():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                f"District boundary file not found: {path}. "
                "Provide a verified Karnataka district GeoJSON file. "
                "No ward geometry was substituted."
            ),
        )

    try:
        collection = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        logger.exception("Could not read local district GeoJSON")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The local district boundary dataset is invalid.",
        ) from exc

    if (
        not isinstance(collection, dict)
        or collection.get("type") != "FeatureCollection"
        or not isinstance(collection.get("features"), list)
    ):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "The local district boundary dataset is not a valid "
                "GeoJSON FeatureCollection."
            ),
        )

    return collection, "local district GeoJSON", str(path)


def _get_source_crs(collection: dict[str, Any]) -> CRS:
    """
    Read the declared source CRS.

    RFC 7946 GeoJSON without a CRS declaration is assumed to use WGS84
    longitude/latitude. A known projected source must declare its CRS.
    """
    crs_data = collection.get("crs")

    if not isinstance(crs_data, dict):
        return CRS.from_epsg(4326)

    properties = crs_data.get("properties") or {}
    name = properties.get("name") if isinstance(properties, dict) else None

    if not name:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "The district GeoJSON declares a CRS object without a "
                "usable CRS name. Specify its actual source CRS."
            ),
        )

    try:
        return CRS.from_user_input(name)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Unsupported district boundary CRS: {name}",
        ) from exc


def _crs_label(crs: CRS) -> str:
    """Return a readable CRS label."""
    authority = crs.to_authority()

    if authority:
        return f"{authority[0]}:{authority[1]}"

    return crs.to_string()


def _transform_and_simplify_geometry(
    geometry_data: dict[str, Any],
    source_crs: CRS,
) -> dict[str, Any]:
    """
    Simplify projected polygons in source units, then transform to WGS84.

    The output is suitable for Leaflet: longitude first, latitude second.
    """
    try:
        geometry = shape(geometry_data)

        if geometry.is_empty:
            raise ValueError("Empty district geometry")

        if not geometry.is_valid:
            # Repair invalid input where possible without replacing it
            # with unrelated or synthetic geometry.
            geometry = geometry.buffer(0)

        if geometry.is_empty or not geometry.is_valid:
            raise ValueError("District geometry is invalid")

        # Simplify only in a projected CRS whose units are metres.
        # Never apply a metre tolerance to longitude/latitude coordinates.
        if (
            not source_crs.is_geographic
            and source_crs.axis_info
            and all(
                abs(axis.unit_conversion_factor - 1.0) < 1e-9
                for axis in source_crs.axis_info[:2]
            )
        ):
            geometry = geometry.simplify(
                DISTRICT_SIMPLIFY_TOLERANCE_METRES,
                preserve_topology=True,
            )

        target_crs = CRS.from_epsg(4326)

        if source_crs != target_crs:
            transformer = Transformer.from_crs(
                source_crs,
                target_crs,
                always_xy=True,
            )
            geometry = transform_geometry(
                transformer.transform,
                geometry,
            )

        if geometry.is_empty or not geometry.is_valid:
            raise ValueError("Geometry became invalid after transformation")

        return mapping(geometry)

    except HTTPException:
        raise
    except Exception as exc:
        raise ValueError(
            f"Could not process district geometry: {exc}"
        ) from exc


def _get_processed_boundary_features(
    path: Path,
) -> tuple[list[dict[str, Any]], str, str]:
    """Return cached, simplified WGS84 district boundary features."""
    try:
        stat_result = path.stat()
    except OSError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"District boundary file not found: {path}",
        ) from exc

    cache_key = str(path.resolve())
    cache_signature = (
        stat_result.st_mtime_ns,
        stat_result.st_size,
    )

    cached = _boundary_cache.get(cache_key)

    if cached and cached["signature"] == cache_signature:
        return (
            cached["features"],
            cached["source_crs"],
            cached["source_url"],
        )

    collection, _source, source_url = _load_district_boundaries(path)
    source_crs = _get_source_crs(collection)

    features_by_id: dict[str, dict[str, Any]] = {}

    for original in collection["features"]:
        if not isinstance(original, dict):
            continue

        geometry_data = original.get("geometry")
        if not isinstance(geometry_data, dict):
            continue

        properties = _normalize_properties(
            original.get("properties") or {}
        )

        state_name = _get_state_name(properties)
        if state_name not in {"karnataka", "ಕರ್ನಾಟಕ"}:
            continue

        district_name = _get_district_name(properties)
        if not district_name:
            continue

        district_code = _get_district_code(properties)
        district_id = (
            district_code
            or district_name.casefold().replace(" ", "-")
        )
        dedupe_key = district_id.strip().casefold()

        if dedupe_key in features_by_id:
            continue

        try:
            processed_geometry = _transform_and_simplify_geometry(
                geometry_data,
                source_crs,
            )
        except ValueError:
            logger.exception(
                "Skipping invalid district geometry: %s",
                district_name,
            )
            continue

        features_by_id[dedupe_key] = {
            "type": "Feature",
            "id": district_id,
            "properties": {
                "district_id": district_id,
                "district_name": district_name,
                "state_name": "Karnataka",
            },
            "geometry": processed_geometry,
        }

    features = list(features_by_id.values())

    if not features:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=(
                "No recognizable Karnataka district polygons could be "
                "processed. Check the source CRS and district properties."
            ),
        )

    source_crs_label = _crs_label(source_crs)

    _boundary_cache[cache_key] = {
        "signature": cache_signature,
        "features": features,
        "source_crs": source_crs_label,
        "source_url": source_url,
    }

    return features, source_crs_label, source_url


@router.get(
    "/districts/geojson",
    summary="Karnataka district boundaries with sourced measurements and labelled model estimates",
)
def get_districts_geojson() -> dict[str, Any]:
    """Return simplified WGS84 Karnataka boundaries and available metrics."""
    raw_dir = Path(DISTRICT_GEOJSON_PATH).parent

    features, source_crs, source_url = _get_processed_boundary_features(
        Path(DISTRICT_GEOJSON_PATH)
    )

    # Copy the feature/property dictionaries before enrichment so that
    # cached boundary features remain independent of metric updates.
    features_for_response = [
        {
            **feature,
            "properties": dict(feature["properties"]),
        }
        for feature in features
    ]

    try:
        features_for_response = enrich_district_features(
            features_for_response,
            raw_dir,
        )
    except ValueError as exc:
        logger.exception("Invalid district metrics schema")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc

    scored_count = sum(
        feature.get("properties", {}).get("data_status")
        in {"verified_district_metrics", "estimated_model"}
        for feature in features_for_response
    )
    verified_count = sum(
        feature.get("properties", {}).get("data_status") == "verified_district_metrics"
        for feature in features_for_response
    )
    estimated_count = sum(
        feature.get("properties", {}).get("data_status") == "estimated_model"
        for feature in features_for_response
    )

    return {
        "type": "FeatureCollection",
        "name": "Karnataka district boundaries",
        "source": "local district GeoJSON",
        "source_url": source_url,
        "source_coordinate_reference_system": source_crs,
        "coordinate_reference_system": "EPSG:4326",
        "data_status": (
            "district_metrics_available"
            if scored_count
            else "boundaries_only_no_district_metrics"
        ),
        "district_count": len(features_for_response),
        "scored_district_count": scored_count,
        "verified_scored_district_count": verified_count,
        "estimated_scored_district_count": estimated_count,
        "features": features_for_response,
    }


@router.get("/layers", response_model=MapSummary)
def list_map_layers(
    service: MapService = Depends(get_map_service_dependency),
) -> MapSummary:
    layers = service.list_layers()

    return MapSummary(
        layers=[
            MapLayer(
                layer_id=layer["layer_id"],
                layer_name=layer["layer_name"],
                geometry=MapGeometry(
                    type=layer["geometry"].get("type", "Polygon"),
                    coordinates=layer["geometry"].get("coordinates", []),
                ),
                description=layer.get("description"),
            )
            for layer in layers
        ],
        ward_count=service.count_wards(),
        boundary_style="simplified",
    )


@router.get(
    "/geojson",
    response_model=GeoJSONFeatureCollection,
)
def get_map_geojson(
    city_id: str = Query(
        "bengaluru",
        description="Supported city ID",
    ),
    layer: str = Query(
        "ward_boundaries",
        description="Legacy map layer",
    ),
    service: MapService = Depends(get_map_service_dependency),
) -> GeoJSONFeatureCollection:
    validate_city_id(city_id)
    data = service.get_geojson(layer=layer)
    return GeoJSONFeatureCollection(**data)


@router.get("/wards/{ward_id}", response_model=MapGeometry)
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


@router.get("/lookup", response_model=PointLookupOut)
def lookup_ward_by_coordinates(
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0),
    service: MapService = Depends(get_map_service_dependency),
) -> PointLookupOut:
    return service.lookup_point(lat=lat, lon=lon)
