from typing import Any


class Normalizer:
    def normalize(self, records: list[dict]) -> list[dict]:
        return [
            {
                "metric": str(r.get("metric", "")).lower().strip(),
                "value": float(r.get("value", 0) or 0),
            }
            for r in records
        ]
