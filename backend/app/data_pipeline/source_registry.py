from typing import Any

from .ingestion import SourceType


class SourceRegistry:
    def __init__(self) -> None:
        self._registry: dict[str, SourceType] = {}

    def register(self, source_id: str, source_type: SourceType) -> None:
        self._registry[source_id] = source_type

    def get(self, source_id: str) -> SourceType | None:
        return self._registry.get(source_id)

    def list_sources(self) -> dict[str, Any]:
        return {"sources": self._registry}


def get_source_registry() -> SourceRegistry:
    return SourceRegistry()
