from typing import Any


class MapDataLoader:
    def load(self, layer: str) -> dict[str, Any]:
        return {
            "layer": layer,
            "features": [],
            "bounds": {"minx": 0, "miny": 0, "maxx": 0, "maxy": 0},
        }
