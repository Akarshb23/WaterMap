import json
import os
from pathlib import Path

import pytest
from fastapi import HTTPException
from pyproj import CRS, Transformer
from shapely.geometry import mapping, shape

from app.api.routes import map as map_routes


KARNATAKA_ANCHOR_LON = 77.5946
KARNATAKA_ANCHOR_LAT = 12.9716

KARNATAKA_BBOX = (74.0, 11.5, 78.7, 18.9)


def _feature(crs: CRS, properties: dict, coordinates) -> dict:
    return {
        "type": "Feature",
        "properties": properties,
        "geometry": {"type": "Polygon", "coordinates": coordinates},
    }


def _write_collection(path: Path, collection: dict) -> None:
    path.write_text(json.dumps(collection), encoding="utf-8")


def test_known_coordinate_transforms_to_expected_wgs84():
    """EPSG:7755 -> EPSG:4326 must land on the known anchor with lon first."""
    source = CRS.from_epsg(7755)
    transformer = Transformer.from_crs(
        CRS.from_epsg(4326),
        source,
        always_xy=True,
    )

    # Generate source CRS coordinates for the known anchor point so the
    # test is independent of hand-written projected values.
    easting, northing = transformer.transform(KARNATAKA_ANCHOR_LON, KARNATAKA_ANCHOR_LAT)
    coordinates = [
        [easting, northing],
        [easting + 1000.0, northing],
        [easting + 1000.0, northing + 1000.0],
        [easting, northing],
    ]

    result = map_routes._transform_and_simplify_geometry(
        {"type": "Polygon", "coordinates": [coordinates]},
        source,
    )

    polygon = shape(result)
    centroid = polygon.centroid

    # Longitude first, latitude second in the output coordinates.
    ring = result["coordinates"][0]
    assert 74.0 < ring[0][0] < 78.7
    assert 11.5 < ring[0][1] < 18.9

    assert abs(centroid.x - KARNATAKA_ANCHOR_LON) < 0.01
    assert abs(centroid.y - KARNATAKA_ANCHOR_LAT) < 0.01


def test_transformed_district_coordinates_are_valid_wgs84_in_karnataka():
    """A declared-EPSG:7755 vendor polygon must yield in-range lon/lat."""
    source = CRS.from_epsg(7755)
    transformer = Transformer.from_crs(
        CRS.from_epsg(4326),
        source,
        always_xy=True,
    )

    # A rough quadrilateral around Hassan district, Karnataka.
    corners = [
        (75.9, 12.9),
        (76.2, 12.9),
        (76.2, 13.4),
        (75.9, 13.4),
    ]
    projected = [transformer.transform(lon, lat) for lon, lat in corners]
    coordinates = [[list(pair) for pair in projected + projected[:1]]]

    result = map_routes._transform_and_simplify_geometry(
        {"type": "Polygon", "coordinates": coordinates},
        source,
    )

    polygon = shape(result)
    lon_min, lat_min, lon_max, lat_max = polygon.bounds

    assert lon_min >= KARNATAKA_BBOX[0]
    assert lat_min >= KARNATAKA_BBOX[1]
    assert lon_max <= KARNATAKA_BBOX[2]
    assert lat_max <= KARNATAKA_BBOX[3]

    # No coordinate may sit outside valid WGS84 ranges.
    for ring in result["coordinates"]:
        for lon, lat in ring:
            assert -180.0 <= lon <= 180.0
            assert -90.0 <= lat <= 90.0


def test_geographic_source_crs_is_not_simplified_with_metre_tolerance():
    """A metre simplification tolerance must never touch lon/lat input."""
    source = CRS.from_epsg(4326)
    coordinates = [
        [77.0, 12.0],
        [77.01, 12.0],
        [77.01, 12.01],
        [77.0, 12.0],
    ]

    result = map_routes._transform_and_simplify_geometry(
        {"type": "Polygon", "coordinates": [coordinates]},
        source,
    )

    processed = mapping(shape(result))

    assert shape(processed).equals_exact(shape({"type": "Polygon", "coordinates": [coordinates]}), 1e-9)


def test_empty_geometry_raises():
    with pytest.raises(ValueError):
        map_routes._transform_and_simplify_geometry(
            {"type": "Polygon", "coordinates": []},
            CRS.from_epsg(4326),
        )


def test_empty_geometry_feature_is_skipped(monkeypatch, tmp_path):
    collection = {
        "type": "FeatureCollection",
        "crs": {"type": "name", "properties": {"name": "EPSG:4326"}},
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "state_name": "Karnataka",
                    "district": "Good District",
                    "dtcode": "524",
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[77.0, 12.0], [78.0, 12.0], [78.0, 13.0], [77.0, 12.0]]],
                },
            },
            {
                "type": "Feature",
                "properties": {
                    "state_name": "Karnataka",
                    "district": "Empty District",
                    "dtcode": "525",
                },
                "geometry": {"type": "Polygon", "coordinates": []},
            },
            {
                "type": "Feature",
                "properties": {
                    "state_name": "Karnataka",
                    "district": "Broken District",
                    "dtcode": "526",
                },
                "geometry": None,
            },
        ],
    }

    local_file = tmp_path / "karnataka_districts.geojson"
    _write_collection(local_file, collection)

    features, _crs, _source = map_routes._get_processed_boundary_features(local_file)

    names = {feature["properties"]["district_name"] for feature in features}

    assert names == {"Good District"}


def test_duplicate_district_identifiers_are_deduplicated(monkeypatch, tmp_path):
    single = {
        "type": "Feature",
        "properties": {
            "state_name": "Karnataka",
            "district": "Bagalkote",
            "dtcode": "524",
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [[[75.0, 16.0], [75.5, 16.0], [75.5, 16.5], [75.0, 16.0]]],
        },
    }

    collection = {
        "type": "FeatureCollection",
        "crs": {"type": "name", "properties": {"name": "EPSG:4326"}},
        "features": [single, dict(single), dict(single)],
    }

    local_file = tmp_path / "karnataka_districts.geojson"
    _write_collection(local_file, collection)

    monkeypatch.setattr(map_routes, "DISTRICT_GEOJSON_PATH", local_file)

    result = map_routes.get_districts_geojson()

    district_ids = [feature["properties"]["district_id"] for feature in result["features"]]

    assert district_ids == ["524"]
    assert result["district_count"] == 1


def test_only_karnataka_districts_are_returned(monkeypatch, tmp_path):
    karnataka = {
        "type": "Feature",
        "properties": {
            "state_name": "Karnataka",
            "district": "Kodagu",
            "dtcode": "552",
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [[[75.4, 12.2], [75.9, 12.2], [75.9, 12.8], [75.4, 12.2]]],
        },
    }
    kerala = {
        "type": "Feature",
        "properties": {
            "state_name": "Kerala",
            "district": "Kasaragod",
            "dtcode": "593",
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [[[74.9, 12.3], [75.1, 12.3], [75.1, 12.6], [74.9, 12.3]]],
        },
    }
    manipur = {
        "type": "Feature",
        "properties": {
            "state_name": "Manipur",
            "district": "Kamjong",
            "dtcode": "717",
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [[[94.3, 24.9], [94.7, 24.9], [94.7, 25.3], [94.3, 24.9]]],
        },
    }

    collection = {
        "type": "FeatureCollection",
        "crs": {"type": "name", "properties": {"name": "EPSG:4326"}},
        "features": [karnataka, kerala, manipur],
    }

    local_file = tmp_path / "karnataka_districts.geojson"
    _write_collection(local_file, collection)

    monkeypatch.setattr(map_routes, "DISTRICT_GEOJSON_PATH", local_file)

    result = map_routes.get_districts_geojson()

    names = {feature["properties"]["district_name"] for feature in result["features"]}

    assert names == {"Kodagu"}
    assert result["district_count"] == 1


def test_boundary_cache_is_reused_until_the_source_file_changes(monkeypatch, tmp_path):
    collection = {
        "type": "FeatureCollection",
        "crs": {"type": "name", "properties": {"name": "EPSG:4326"}},
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "state_name": "Karnataka",
                    "district": "Hassan",
                    "dtcode": "539",
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[76.0, 13.0], [76.1, 13.0], [76.1, 13.1], [76.0, 13.0]]],
                },
            }
        ],
    }

    local_file = tmp_path / "karnataka_districts.geojson"
    _write_collection(local_file, collection)

    load_calls = []
    original_loader = map_routes._load_district_boundaries

    def counting_loader(local_path=None):
        load_calls.append(local_path)
        return original_loader(local_path)

    monkeypatch.setattr(map_routes, "_load_district_boundaries", counting_loader)

    first = map_routes._get_processed_boundary_features(local_file)
    second = map_routes._get_processed_boundary_features(local_file)

    # Same content, different processed instances because enrichment copies
    # are made per request; the file itself was loaded exactly once.
    assert len(load_calls) == 1
    assert first[0] == second[0]

    # Touch the file: change mtime while keeping the size identical.
    stat = local_file.stat()
    os.utime(local_file, (stat.st_atime, stat.st_mtime + 5))

    _third = map_routes._get_processed_boundary_features(local_file)

    assert len(load_calls) == 2


def test_missing_boundary_file_returns_503(monkeypatch, tmp_path):
    monkeypatch.setattr(map_routes, "DISTRICT_GEOJSON_PATH", tmp_path / "absent.geojson")

    with pytest.raises(HTTPException) as excinfo:
        map_routes.get_districts_geojson()

    assert excinfo.value.status_code == 503
    assert "not found" in str(excinfo.value.detail).lower()


def test_invalid_boundary_file_returns_503(monkeypatch, tmp_path):
    local_file = tmp_path / "karnataka_districts.geojson"
    local_file.write_text("{not valid json(", encoding="utf-8")

    monkeypatch.setattr(map_routes, "DISTRICT_GEOJSON_PATH", local_file)

    with pytest.raises(HTTPException) as excinfo:
        map_routes.get_districts_geojson()

    assert excinfo.value.status_code == 503
    assert "invalid" in str(excinfo.value.detail).lower()


def test_non_featurecollection_file_returns_503(monkeypatch, tmp_path):
    local_file = tmp_path / "karnataka_districts.geojson"
    _write_collection(local_file, {"type": "Point", "features": []})

    monkeypatch.setattr(map_routes, "DISTRICT_GEOJSON_PATH", local_file)

    with pytest.raises(HTTPException) as excinfo:
        map_routes.get_districts_geojson()

    assert excinfo.value.status_code == 503


def test_collection_without_karnataka_features_returns_502(monkeypatch, tmp_path):
    collection = {
        "type": "FeatureCollection",
        "crs": {"type": "name", "properties": {"name": "EPSG:4326"}},
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "state_name": "Kerala",
                    "district": "Kasaragod",
                    "dtcode": "593",
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[74.9, 12.3], [75.1, 12.3], [75.1, 12.6], [74.9, 12.3]]],
                },
            }
        ],
    }

    local_file = tmp_path / "karnataka_districts.geojson"
    _write_collection(local_file, collection)

    monkeypatch.setattr(map_routes, "DISTRICT_GEOJSON_PATH", local_file)

    with pytest.raises(HTTPException) as excinfo:
        map_routes.get_districts_geojson()

    assert excinfo.value.status_code == 502


def test_declared_crs_without_name_is_rejected(monkeypatch, tmp_path):
    collection = {
        "type": "FeatureCollection",
        "crs": {"type": "name", "properties": {}},
        "features": [],
    }

    with pytest.raises(HTTPException) as excinfo:
        map_routes._get_source_crs(collection)

    assert excinfo.value.status_code == 503


def test_unsupported_declared_crs_is_rejected(monkeypatch, tmp_path):
    collection = {
        "type": "FeatureCollection",
        "crs": {"type": "name", "properties": {"name": "not-a-crs"}},
        "features": [],
    }

    with pytest.raises(HTTPException) as excinfo:
        map_routes._get_source_crs(collection)

    assert excinfo.value.status_code == 503
