import pytest


def test_predictions_list_not_implemented(client):
    """Test predictions list endpoint returns 501 Not Implemented"""
    response = client.get("/api/v1/predictions")
    assert response.status_code == 501

