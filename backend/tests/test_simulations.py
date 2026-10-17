import pytest


def test_simulations_list_not_implemented(client):
    """Test simulations list endpoint returns 501 Not Implemented"""
    response = client.get("/api/v1/simulations")
    assert response.status_code == 501

