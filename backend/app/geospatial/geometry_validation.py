from typing import Any


class GeometryValidator:
    def validate(self, geometry: dict[str, Any]) -> dict[str, Any]:
        return {
            "valid": True,
            "errors": [],
            "geometry": geometry,
        }
