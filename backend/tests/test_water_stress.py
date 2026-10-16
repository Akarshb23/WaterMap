import pytest
from fastapi.testclient import TestClient

from app.main import create_app


@pytest.mark.skipif(
    True,
    reason="DB-dependent tests require PostgreSQL database (not available in test environment)"
)
def test_water_stress_not_implemented(client):
    """Test water stress endpoint"""
    response = client.get("/api/v1/water-stress")
    assert response.status_code == 501
