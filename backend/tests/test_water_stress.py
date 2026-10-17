from app.database import models

def test_water_stress_calculates_from_indicators(client, db_session):
    ward=models.Ward(ward_id="WST1",name="Stress Ward",district="Test",population=10000,water_stress_index=0.2,risk_category="low")
    db_session.add(ward); db_session.flush()
    db_session.add(models.Indicator(indicator_id="I-GW",ward_id="WST1",metric="groundwater_depth_mbgl",value=60,unit="mbgl",normalized_value=0.8))
    db_session.commit()
    response=client.get("/api/v1/water-stress?ward_id=WST1")
    assert response.status_code==200
    data=response.json()
    assert data["ward_id"]=="WST1"
    assert data["water_stress_index"]==0.8
    assert data["risk_category"]=="critical"

def test_water_stress_unknown_ward_is_404(client):
    assert client.get("/api/v1/water-stress?ward_id=missing").status_code==404
