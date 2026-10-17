from datetime import datetime, timezone
from typing import Any, Dict, List
from sqlalchemy.orm import Session

from ..database import queries
from ..schemas.dashboard import DashboardSummary, TopStressedWard


class DashboardService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def summary(self) -> Dict[str, Any]:
        wards = queries.list_wards(self.db)
        total = len(wards)
        if total == 0:
            return {
                "total_wards": 0,
                "healthy_wards": 0,
                "warning_wards": 0,
                "critical_wards": 0,
                "last_updated": "1970-01-01T00:00:00+00:00",
                "city_avg_stress_index": 0.0,
                "risk_distribution": {"low": 0, "moderate": 0, "high": 0, "critical": 0},
                "top_critical_wards": [],
            }

        healthy = sum(1 for w in wards if float(w.water_stress_index or 0.0) < 0.4)
        warning = sum(1 for w in wards if 0.4 <= float(w.water_stress_index or 0.0) < 0.7)
        critical = sum(1 for w in wards if float(w.water_stress_index or 0.0) >= 0.7)

        avg_stress = sum(float(w.water_stress_index or 0.0) for w in wards) / total

        # Top critical wards sorted by water_stress_index descending
        sorted_wards = sorted(
            wards,
            key=lambda w: float(w.water_stress_index or 0.0),
            reverse=True,
        )
        top_critical = [
            TopStressedWard(
                ward_id=w.ward_id,
                name=w.name,
                water_stress_index=float(w.water_stress_index or 0.0),
                risk_category=w.risk_category or "low",
                population=w.population,
            )
            for w in sorted_wards[:5]
        ]

        risk_dist = {
            "low": sum(1 for w in wards if (w.risk_category or "low") == "low"),
            "moderate": sum(1 for w in wards if w.risk_category == "moderate"),
            "high": sum(1 for w in wards if w.risk_category == "high"),
            "critical": sum(1 for w in wards if w.risk_category == "critical"),
        }

        latest_time = max(
            (w.updated_at or w.created_at for w in wards if w.updated_at or w.created_at),
            default=None,
        )

        iso_time = (
            latest_time.isoformat()
            if isinstance(latest_time, datetime)
            else (latest_time if latest_time else datetime.now(timezone.utc).isoformat())
        )

        return {
            "total_wards": total,
            "healthy_wards": healthy,
            "warning_wards": warning,
            "critical_wards": critical,
            "last_updated": iso_time,
            "city_avg_stress_index": round(avg_stress, 3),
            "risk_distribution": risk_dist,
            "top_critical_wards": [w.model_dump() for w in top_critical],
        }


def get_dashboard_service(db: Session) -> DashboardService:
    return DashboardService(db)

