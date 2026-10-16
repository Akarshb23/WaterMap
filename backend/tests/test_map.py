import pytest
from fastapi.testclient import TestClient

from app.main import create_app


@pytest.mark.skipif(
    True,
    reason="DB-dependent tests require PostgreSQL database (not available in test environment)"
)
def test_list_map_layers(client):
    """Test list map layers endpoint (requires PostgreSQL)"""
    response = client.get("/map/layers")
    assert response.status_code == 200
    data = response.json()
    assert "layers" in data
    assert data["layers"][0]["layer_name"] == "Ward Boundaries"


@pytest.mark.skipif(
    True,
    reason="DB-dependent tests require PostgreSQL database (not available in test environment)"
)
def test_get_ward_geometry_not_found(client):
    """Test get ward geometry (requires PostgreSQL)"""
    response = client.get("/map/wards/nonexistent")
    assert response.status_code == 404
