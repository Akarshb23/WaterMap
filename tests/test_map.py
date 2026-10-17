import pytest
from app.database import models


def test_list_map_layers(client):
    """Test list map layers endpoint"""
    response = client.get("/map/layers")
    assert response.status_code == 200
    data = response.json()
    assert "layers" in data
    assert len(data["layers"]) > 0
    assert data["layers"][0]["layer_name"] == "Ward Boundaries"


def test_get_ward_geometry_not_found(client):
    """Test get ward geometry returns 404 when ward not found"""
    response = client.get("/map/wards/nonexistent")
    assert response.status_code == 404


def test_get_ward_geometry_and_geojson(client, db_session):
    """Test retrieving geometry for an existing ward and full GeoJSON"""
    ward = models.Ward(
        ward_id="W001",
        name="Koramangala",
        district="Bengaluru Urban",
        population=52000,
        area_sqkm=6.85,
        centroid_lat=12.9352,
        centroid_lon=77.6245,
        water_stress_index=0.45,
        risk_category="moderate",
        geometry='{"type": "Polygon", "coordinates": [[[77.61, 12.92], [77.64, 12.92], [77.64, 12.95], [77.61, 12.95], [77.61, 12.92]]]}',
    )
    db_session.add(ward)
    db_session.commit()

    # Get single ward geometry
    res = client.get("/map/wards/W001")
    assert res.status_code == 200
    geom = res.json()
    assert geom["type"] == "Polygon"
    assert len(geom["coordinates"]) > 0

    # Get full GeoJSON FeatureCollection
    res_geo = client.get("/map/geojson")
    assert res_geo.status_code == 200
    geojson = res_geo.json()
    assert geojson["type"] == "FeatureCollection"
    assert geojson["ward_count"] == 1
    assert len(geojson["features"]) == 1
    assert geojson["features"][0]["properties"]["ward_id"] == "W001"

    # Test point lookup inside polygon
    res_lookup = client.get("/map/lookup?lat=12.935&lon=77.625")
    assert res_lookup.status_code == 200
    lookup = res_lookup.json()
    assert lookup["matched_ward_id"] == "W001"
    assert lookup["is_inside"] is True

