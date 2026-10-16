from enum import Enum


class SourceType(str, Enum):
    municipal = "municipal"
    government = "government"
    open_data = "open_data"
    sensor = "sensor"
    weather = "weather"
    hydrology = "hydrology"


class Ingestor:
    def __init__(self, source_type: SourceType) -> None:
        self.source_type = source_type

    def ingest(self, source_config: dict) -> dict:
        return {
            "source_type": self.source_type,
            "status": "staged",
            "records": 0,
            "fields": [],
        }
