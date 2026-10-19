from sqlalchemy.orm import Session
from ..database.queries import get_ward, list_wards
from ..simulation.engine import simulate

def run_simulation(db: Session, ward_id: str, intervention_type: str, coverage: float = 1.0) -> dict | None:
    ward=get_ward(db,ward_id)
    if ward is None: return None
    return simulate(ward,intervention_type,coverage)

def list_simulations(db: Session) -> list:
    # Simulations are stateless calculations; no historical run is implied.
    return []
