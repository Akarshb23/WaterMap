import pytest


def test_water_stress_not_implemented(client):
    """Test water stress endpoint returns 501 Not Implemented"""
    response = client.get("/api/v1/water-stress")
    assert response.status_code == 501

