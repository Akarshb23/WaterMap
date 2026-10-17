from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ...core.dependencies import get_db_dependency
from ...services.water_stress_service import get_water_stress as calculate_water_stress

router = APIRouter(prefix="/water-stress", tags=["water-stress"])

@router.get("")
def get_water_stress(ward_id: str | None = Query(None), db: Session = Depends(get_db_dependency)):
    result = calculate_water_stress(db, ward_id)
    if ward_id and not result:
        raise HTTPException(status_code=404, detail=f"Ward '{ward_id}' not found")
    return result[0] if ward_id else {"count": len(result), "results": result, "methodology": "Weighted normalized indicators; falls back to stored WSI when no supported indicators exist."}
