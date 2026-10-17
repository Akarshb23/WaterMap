from app.database import models

def test_recommendations_are_explainable(client, db_session):
    db_session.add(models.Ward(ward_id="WR1",name="Recommendation Ward",district="Test",population=1000,water_stress_index=0.8,risk_category="critical")); db_session.flush()
    db_session.add(models.Indicator(indicator_id="IR1",ward_id="WR1",metric="groundwater_depth_mbgl",value=60,normalized_value=0.8)); db_session.commit()
    response=client.get("/api/v1/recommendations?ward_id=WR1")
    assert response.status_code==200
    data=response.json()
    assert data["count"]>=1
    assert data["results"][0]["priority"]>=1
    assert data["results"][0]["rationale"]

def test_unknown_ward_recommendations_404(client):
    assert client.get("/api/v1/recommendations?ward_id=missing").status_code==404
