from typing import Any, Dict, Optional
from .ingestion import SourceType


DEFAULT_SOURCES = {
    "DS001": {
        "name": "Central Ground Water Board (CGWB) NWIC",
        "source_type": SourceType.government,
        "format": "csv",
        "metric": "groundwater_depth_mbgl",
        "unit": "mbgl",
    },
    "DS002": {
        "name": "India Meteorological Department (IMD) Precipitation Grid",
        "source_type": SourceType.weather,
        "format": "csv",
        "metric": "rainfall_deficit_pct",
        "unit": "%",
    },
    "DS003": {
        "name": "Bangalore Water Supply and Sewerage Board (BWSSB)",
        "source_type": SourceType.municipal,
        "format": "csv",
        "metric": "piped_water_supply_lpcd",
        "unit": "lpcd",
    },
    "DS004": {
        "name": "BBMP Sahaaya 2.0 Grievance Redressal",
        "source_type": SourceType.municipal,
        "format": "csv",
        "metric": "tanker_dependency_index",
        "unit": "trips/k",
    },
    "DS005": {
        "name": "Karnataka State Remote Sensing Applications Centre (KSRSAC)",
        "source_type": SourceType.satellite,
        "format": "csv",
        "metric": "water_body_coverage_pct",
        "unit": "%",
    },
    "DS006": {
        "name": "Open Government Data (OGD) Platform India",
        "source_type": SourceType.open_data,
        "format": "geojson",
        "metric": "demographics",
        "unit": "count",
    },
}


class SourceRegistry:
    def __init__(self) -> None:
        self._registry: Dict[str, SourceType] = {}
        self._metadata: Dict[str, Dict[str, Any]] = {}
        for sid, info in DEFAULT_SOURCES.items():
            self.register(sid, info["source_type"], info)

    def register(
        self,
        source_id: str,
        source_type: SourceType,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> None:
        self._registry[source_id] = source_type
        if metadata:
            self._metadata[source_id] = metadata

    def get(self, source_id: str) -> Optional[SourceType]:
        return self._registry.get(source_id)

    def get_metadata(self, source_id: str) -> Optional[Dict[str, Any]]:
        return self._metadata.get(source_id)

    def list_sources(self) -> Dict[str, Any]:
        return {
            "sources": self._registry,
            "metadata": self._metadata,
        }


def get_source_registry() -> SourceRegistry:
    return SourceRegistry()

