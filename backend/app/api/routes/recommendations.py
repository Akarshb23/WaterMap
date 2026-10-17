from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ...core.dependencies import get_db_dependency
from ...services.recommendation_service import list_recommendations as fetch_recommendations

router=APIRouter(prefix="/recommendations",tags=["recommendations"])

@router.get("")
def list_recommendations(ward_id: str | None = Query(None), db: Session=Depends(get_db_dependency)):
    results=fetch_recommendations(db,ward_id)
    if ward_id and not results:
        # Distinguish a real ward with no recommendations from an unknown ward.
        from ...database.queries import get_ward
        if get_ward(db,ward_id) is None: raise HTTPException(status_code=404,detail=f"Ward '{ward_id}' not found")
    return {"count":len(results),"results":results,"method":"explainable rules based on stored WSI and available indicators"}
