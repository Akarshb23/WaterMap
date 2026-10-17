from app.database import models

def test_predictions_returns_baseline_forecast(client, db_session):
    db_session.add(models.Ward(ward_id="WP1",name="Forecast Ward",district="Test",population=1000,water_stress_index=0.6,risk_category="high")); db_session.commit()
    response=client.get("/api/v1/predictions?ward_id=WP1&horizon_days=14")
    assert response.status_code==200
    data=response.json()
    assert data["count"]==1
    assert data["results"][0]["water_stress_index"]==0.6
    assert data["results"][0]["horizon_days"]==14

def test_predictions_unknown_ward_is_404(client):
    assert client.get("/api/v1/predictions?ward_id=missing").status_code==404
