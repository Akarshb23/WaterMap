from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ...core.dependencies import get_db_dependency
from ...core.city_registry import validate_city_id
from ...services.prediction_service import list_predictions as fetch_predictions

router = APIRouter(prefix="/predictions", tags=["predictions"])

@router.get("")
def list_predictions(ward_id: str | None = Query(None), horizon_days: int = Query(30, ge=1, le=365), city_id: str = Query("bengaluru"), db: Session = Depends(get_db_dependency)):
    validate_city_id(city_id)
    result=fetch_predictions(db,ward_id,horizon_days)
    if ward_id and not result: raise HTTPException(status_code=404, detail=f"Ward '{ward_id}' not found")
    return {"count":len(result),"results":result,"model":"baseline-persistence-1.0","limitation":"A calibrated time-series model requires longitudinal observations; this endpoint uses a transparent persistence baseline."}
