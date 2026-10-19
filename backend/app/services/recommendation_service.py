from sqlalchemy.orm import Session
from ..database.queries import get_ward, list_wards, list_indicators_for_ward
from ..recommendations.engine import recommend_for_ward

def list_recommendations(db: Session, ward_id: str | None = None) -> list[dict]:
    wards=[get_ward(db,ward_id)] if ward_id else list_wards(db)
    if ward_id and wards[0] is None: return []
    results=[]
    for ward in wards:
        results.extend(recommend_for_ward(ward,list_indicators_for_ward(db,ward.ward_id)))
    return sorted(results,key=lambda r:(-r["priority"],r["ward_id"]))
