import pytest
from fastapi.testclient import TestClient

from app.main import create_app


@pytest.mark.skipif(
    True,
    reason="DB-dependent tests require PostgreSQL database (not available in test environment)"
)
def test_list_wards_empty(client):
    """Test list wards endpoint (requires PostgreSQL)"""
    response = client.get("/wards")
    assert response.status_code == 200
    data = response.json()
    assert data == []


@pytest.mark.skipif(
    True,
    reason="DB-dependent tests require PostgreSQL database (not available in test environment)"
)
def test_get_ward_not_found(client):
    """Test get ward by ID (requires PostgreSQL)"""
    response = client.get("/wards/nonexistent")
    assert response.status_code == 404
    data = response.json()
    assert "detail" in data
