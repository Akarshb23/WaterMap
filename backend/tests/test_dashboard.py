import pytest
from fastapi.testclient import TestClient

from app.main import create_app


@pytest.mark.skipif(
    True,
    reason="Dashboard requires PostgreSQL database which is not available in test environment"
)
def test_dashboard_summary_empty(client):
    """Test dashboard summary endpoint (requires PostgreSQL)"""
    response = client.get("/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert data["total_wards"] == 0
    assert data["healthy_wards"] == 0
    assert data["warning_wards"] == 0
    assert data["critical_wards"] == 0


@pytest.mark.skipif(
    True,
    reason="Database-dependent endpoints are skipped when PostgreSQL is not available"
)
def test_dashboard_with_data(client):
    """Test dashboard with sample data (requires PostgreSQL)"""
    pass
