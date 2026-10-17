from sqlalchemy.orm import Session
from ..database.queries import list_wards, get_ward, list_indicators_for_ward
from ..forecasting.forecaster import forecast_ward

def list_predictions(db: Session, ward_id: str | None = None, horizon_days: int = 30) -> list[dict]:
    wards=[get_ward(db,ward_id)] if ward_id else list_wards(db)
    if ward_id and wards[0] is None: return []
    return [forecast_ward(w,list_indicators_for_ward(db,w.ward_id),horizon_days) for w in wards]
