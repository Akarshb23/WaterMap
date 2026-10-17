import pytest
from app.database import models


def test_dashboard_summary_empty(client):
    """Test dashboard summary endpoint returns zeroed aggregates when empty"""
    response = client.get("/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert data["total_wards"] == 0
    assert data["healthy_wards"] == 0
    assert data["warning_wards"] == 0
    assert data["critical_wards"] == 0


def test_dashboard_with_data(client, db_session):
    """Test dashboard with sample healthy, warning, and critical wards"""
    w1 = models.Ward(
        ward_id="W001",
        name="Malleshwaram",
        district="Bengaluru Urban",
        population=40000,
        water_stress_index=0.20,
        risk_category="low",
    )
    w2 = models.Ward(
        ward_id="W002",
        name="Koramangala",
        district="Bengaluru Urban",
        population=50000,
        water_stress_index=0.50,
        risk_category="moderate",
    )
    w3 = models.Ward(
        ward_id="W003",
        name="Bellandur",
        district="Bengaluru Urban",
        population=90000,
        water_stress_index=0.85,
        risk_category="critical",
    )
    db_session.add(w1)
    db_session.add(w2)
    db_session.add(w3)
    db_session.commit()

    response = client.get("/dashboard")
    assert response.status_code == 200
    data = response.json()

    assert data["total_wards"] == 3
    assert data["healthy_wards"] == 1  # < 0.4
    assert data["warning_wards"] == 1  # 0.4 <= wsi < 0.7
    assert data["critical_wards"] == 1  # >= 0.7
    assert "last_updated" in data
    assert "city_avg_stress_index" in data
    assert len(data.get("top_critical_wards", [])) == 3
    assert data["top_critical_wards"][0]["ward_id"] == "W003"

