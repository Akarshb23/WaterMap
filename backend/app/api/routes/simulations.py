from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from ...core.dependencies import get_db_dependency
from ...core.city_registry import validate_city_id
from ...services.simulation_service import run_simulation
from ...simulation.intervention_rules import INTERVENTIONS

router=APIRouter(prefix="/simulations",tags=["simulations"])
class SimulationRequest(BaseModel):
    city_id: str = Field("bengaluru", min_length=1)
    ward_id: str = Field(..., min_length=1)
    intervention_type: str = Field(..., min_length=1)
    coverage: float = Field(1.0, ge=0.0, le=1.0)

@router.get("")
def list_simulations():
    return {"count":0,"results":[],"available_interventions":INTERVENTIONS,"note":"Runs are calculated on demand and are not persisted."}

@router.post("/run")
def create_simulation(payload: SimulationRequest, db: Session=Depends(get_db_dependency)):
    validate_city_id(payload.city_id)
    if payload.intervention_type not in INTERVENTIONS:
        raise HTTPException(status_code=422, detail={"message":"Unsupported intervention_type","supported":sorted(INTERVENTIONS)})
    result=run_simulation(db,payload.ward_id,payload.intervention_type,payload.coverage)
    if result is None: raise HTTPException(status_code=404,detail=f"Ward '{payload.ward_id}' not found")
    return result
