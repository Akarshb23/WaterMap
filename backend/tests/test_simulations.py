from app.database import models

def test_simulation_runs_supported_intervention(client, db_session):
    db_session.add(models.Ward(ward_id="WS1",name="Scenario Ward",district="Test",population=1000,water_stress_index=0.8,risk_category="critical")); db_session.commit()
    response=client.post("/api/v1/simulations/run",json={"ward_id":"WS1","intervention_type":"leakage_reduction","coverage":1})
    assert response.status_code==200
    data=response.json()
    assert data["baseline_wsi"]==0.8
    assert data["projected_wsi"]==0.72
    assert data["status"]=="completed"

def test_simulation_rejects_unknown_intervention(client, db_session):
    db_session.add(models.Ward(ward_id="WS2",name="Scenario Ward",district="Test",population=1000,water_stress_index=0.8,risk_category="critical")); db_session.commit()
    assert client.post("/api/v1/simulations/run",json={"ward_id":"WS2","intervention_type":"magic"}).status_code==422
