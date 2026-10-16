import pytest
from fastapi.testclient import TestClient

from app.main import create_app


@pytest.mark.skipif(
    True,
    reason="DB-dependent tests require PostgreSQL database (not available in test environment)"
)
def test_simulations_list_not_implemented(client):
    """Test simulations list endpoint"""
    response = client.get("/api/v1/simulations")
    assert response.status_code == 501
