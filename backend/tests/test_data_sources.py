import pytest
from app.database import models


def test_list_data_sources_empty(client):
    """Test listing data sources when none registered"""
    response = client.get("/data-sources")
    assert response.status_code == 200
    assert response.json() == []


def test_create_and_get_data_source(client, db_session):
    """Test creating a data source and retrieving it by ID"""
    payload = {
        "name": "Central Ground Water Board",
        "type": "government",
        "url": "https://nwic.gov.in",
        "description": "National groundwater monitoring network",
        "refresh_interval_hours": 24,
        "is_active": True,
    }
    create_res = client.post("/data-sources", json=payload)
    assert create_res.status_code == 201
    source = create_res.json()
    assert "source_id" in source
    assert source["name"] == payload["name"]
    assert source["type"] == payload["type"]

    source_id = source["source_id"]

    # Get by ID
    get_res = client.get(f"/data-sources/{source_id}")
    assert get_res.status_code == 200
    fetched = get_res.json()
    assert fetched["source_id"] == source_id
    assert fetched["name"] == payload["name"]

    # List data sources
    list_res = client.get("/data-sources")
    assert list_res.status_code == 200
    sources = list_res.json()
    assert len(sources) == 1
    assert sources[0]["source_id"] == source_id


def test_get_data_source_not_found(client):
    """Test getting non-existent data source returns 404"""
    response = client.get("/data-sources/DS999")
    assert response.status_code == 404
