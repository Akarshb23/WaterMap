from typing import Any

from sqlalchemy.orm import Session

from ..database import queries


class DashboardService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def summary(self) -> dict[str, Any]:
        wards = queries.list_wards(self.db)
        total = len(wards)
        if total == 0:
            return {
                "total_wards": 0,
                "healthy_wards": 0,
                "warning_wards": 0,
                "critical_wards": 0,
                "last_updated": "1970-01-01T00:00:00+00:00",
            }

        healthy = sum(1 for w in wards if w.water_stress_index < 0.4)
        warning = sum(1 for w in wards if 0.4 <= w.water_stress_index < 0.7)
        critical = sum(1 for w in wards if w.water_stress_index >= 0.7)

        latest = (
            max((w.updated_at for w in wards if w.updated_at is not None), default=None)
            or "1970-01-01T00:00:00+00:00"
        )

        return {
            "total_wards": total,
            "healthy_wards": healthy,
            "warning_wards": warning,
            "critical_wards": critical,
            "last_updated": latest.isoformat() if latest else "1970-01-01T00:00:00+00:00",
        }


def get_dashboard_service(db: Session) -> DashboardService:
    return DashboardService(db)
