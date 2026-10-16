from typing import Any


class Aggregator:
    def aggregate(self, records: list[dict], group_by: str) -> dict[str, Any]:
        return {
            "group_by": group_by,
            "count": len(records),
            "average": (sum(r.get("value", 0) for r in records) / len(records))
            if records
            else 0.0,
        }
