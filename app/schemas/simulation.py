from pydantic import BaseModel, Field


class SimulationOut(BaseModel):
    simulation_id: str = Field(..., min_length=1)
    scenario_id: str = Field(..., min_length=1)
    ward_id: str = Field(..., min_length=1)
    intervention_type: str = Field(..., min_length=1)
    impact_estimate: float = Field(..., ge=-1.0, le=1.0)
    simulation_date: str = Field(..., min_length=1)
    status: str = Field(..., min_length=1)
