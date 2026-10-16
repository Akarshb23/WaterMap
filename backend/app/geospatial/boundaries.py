from typing import Any


class BoundaryResolver:
    def resolve(self, ward_id: str) -> dict[str, Any]:
        return {
            "ward_id": ward_id,
            "geometry": {"type": "Polygon", "coordinates": []},
            "source": "postgis",
        }
