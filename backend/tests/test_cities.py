from app.database import models


def test_supported_cities_reflect_loaded_ward_dataset(client, db_session):
    db_session.add(models.Ward(
        ward_id="W001",
        name="Koramangala",
        district="Bengaluru Urban",
        zone="South",
        population=52000,
        water_stress_index=0.45,
        risk_category="moderate",
    ))
    db_session.commit()

    response = client.get("/api/v1/cities")
    assert response.status_code == 200
    cities = response.json()
    assert len(cities) == 1
    assert cities[0]["city_id"] == "bengaluru"
    assert cities[0]["name"] == "Bengaluru"
    assert cities[0]["ward_count"] == 1


def test_unknown_city_is_rejected(client):
    response = client.get("/api/v1/dashboard", params={"city_id": "new-delhi"})
    assert response.status_code == 404
    assert "not supported" in response.json()["detail"]
