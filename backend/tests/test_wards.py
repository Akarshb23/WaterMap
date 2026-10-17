import pytest
from app.database import models


def test_list_wards_empty(client):
    """Test list wards endpoint returns empty list when no wards exist"""
    response = client.get("/wards")
    assert response.status_code == 200
    data = response.json()
    assert data == []


def test_get_ward_not_found(client):
    """Test get ward by non-existent ID returns 404"""
    response = client.get("/wards/nonexistent")
    assert response.status_code == 404
    data = response.json()
    assert "detail" in data


def test_list_and_get_wards_with_data(client, db_session):
    """Test creating wards in DB and fetching via API endpoints"""
    ward1 = models.Ward(
        ward_id="W001",
        name="Koramangala",
        district="Bengaluru Urban",
        zone="South",
        population=52000,
        area_sqkm=6.85,
        centroid_lat=12.9352,
        centroid_lon=77.6245,
        water_stress_index=0.45,
        risk_category="moderate",
    )
    ward2 = models.Ward(
        ward_id="W003",
        name="Bellandur",
        district="Bengaluru Urban",
        zone="Mahadevapura",
        population=94500,
        area_sqkm=14.30,
        centroid_lat=12.9260,
        centroid_lon=77.6762,
        water_stress_index=0.88,
        risk_category="critical",
    )
    db_session.add(ward1)
    db_session.add(ward2)
    db_session.commit()

    # Test list wards
    res = client.get("/wards")
    assert res.status_code == 200
    wards = res.json()
    assert len(wards) == 2
    assert wards[0]["ward_id"] == "W001"
    assert wards[0]["name"] == "Koramangala"

    # Test filter by risk_category
    res_crit = client.get("/wards?risk_category=critical")
    assert res_crit.status_code == 200
    crit_wards = res_crit.json()
    assert len(crit_wards) == 1
    assert crit_wards[0]["ward_id"] == "W003"

    # Test search by name
    res_search = client.get("/wards?search=kora")
    assert res_search.status_code == 200
    search_wards = res_search.json()
    assert len(search_wards) == 1
    assert search_wards[0]["name"] == "Koramangala"

    # Test get ward details
    res_detail = client.get("/wards/W001")
    assert res_detail.status_code == 200
    detail = res_detail.json()
    assert detail["ward_id"] == "W001"
    assert detail["population"] == 52000
    assert "indicators" in detail


def test_ward_indicators(client, db_session):
    """Test ward indicator sub-endpoints"""
    ward = models.Ward(
        ward_id="W001",
        name="Koramangala",
        district="Bengaluru Urban",
        population=52000,
        water_stress_index=0.45,
        risk_category="moderate",
    )
    db_session.add(ward)

    source = models.DataSource(
        source_id="DS001",
        name="CGWB",
        source_type="government",
    )
    db_session.add(source)
    db_session.commit()

    ind1 = models.Indicator(
        indicator_id="IND-W001-groundwater_depth_mbgl",
        ward_id="W001",
        metric="groundwater_depth_mbgl",
        value=28.5,
        unit="mbgl",
        normalized_value=0.38,
        source_id="DS001",
    )
    ind2 = models.Indicator(
        indicator_id="IND-W001-piped_water_supply_lpcd",
        ward_id="W001",
        metric="piped_water_supply_lpcd",
        value=95.0,
        unit="lpcd",
        normalized_value=0.36,
        source_id="DS001",
    )
    db_session.add(ind1)
    db_session.add(ind2)
    db_session.commit()

    # Get all indicators for ward
    res_inds = client.get("/wards/W001/indicators")
    assert res_inds.status_code == 200
    indicators = res_inds.json()
    assert len(indicators) == 2
    metrics = [i["metric"] for i in indicators]
    assert "groundwater_depth_mbgl" in metrics
    assert "piped_water_supply_lpcd" in metrics

    # Get specific metric indicator
    res_metric = client.get("/wards/W001/indicators/groundwater_depth_mbgl")
    assert res_metric.status_code == 200
    metric_inds = res_metric.json()
    assert len(metric_inds) == 1
    assert metric_inds[0]["value"] == 28.5
    assert metric_inds[0]["unit"] == "mbgl"

