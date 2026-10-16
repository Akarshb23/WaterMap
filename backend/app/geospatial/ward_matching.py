from typing import Any


class WardMatcher:
    def match(self, geometry: dict[str, Any], threshold: float = 0.8) -> dict[str, Any]:
        return {
            "matched_ward_id": None,
            "confidence": 0.0,
            "matches": [],
        }
