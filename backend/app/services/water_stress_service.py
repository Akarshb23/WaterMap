from sqlalchemy.orm import Session
from ..database.models import Ward
from ..database.queries import list_wards, list_indicators_for_ward
from ..water_stress.index import calculate_wsi

def get_water_stress(db: Session, ward_id: str | None = None) -> list[dict]:
    wards = [db.get(Ward, ward_id)] if ward_id else list_wards(db)
    if ward_id and wards[0] is None: return []
    output=[]
    for ward in wards:
        indicators=list_indicators_for_ward(db, ward.ward_id)
        score=calculate_wsi(indicators, ward.water_stress_index or 0.0)
        output.append({"ward_id":ward.ward_id,"ward_name":ward.name,"district":ward.district,**score})
    return output
