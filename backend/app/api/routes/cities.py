from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...core.dependencies import get_db_dependency
from ...database import queries

router = APIRouter(prefix="/cities", tags=["cities"])

@router.get("")
def list_supported_cities(db: Session = Depends(get_db_dependency)):
    """Return only cities represented by the currently loaded ward dataset.

    This deployment ships Bengaluru ward data. Add a separately validated
    ward dataset before exposing another city in this list.
    """
    wards = queries.list_wards(db)
    if not wards:
        return []
    districts = sorted({(ward.district or "").strip() for ward in wards if ward.district})
    # City identity is explicit rather than pretending every district is a city.
    return [{"city_id": "bengaluru", "name": "Bengaluru", "districts": districts, "ward_count": len(wards), "data_available": True}]
