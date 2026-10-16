from typing import Any

from sqlalchemy.orm import Session

from ..database import queries
from .ingestion import SourceType, Ingestor
from .cleaning import Cleaner
from .validation import Validator, ValidationResult
from .normalization import Normalizer
from .aggregation import Aggregator
from .source_registry import SourceRegistry


class DataPipeline:
    def __init__(
        self,
        db: Session,
        registry: SourceRegistry,
    ) -> None:
        self.db = db
        self.registry = registry
        self.ingestors: dict[str, Ingestor] = {}
        self.cleaner = Cleaner()
        self.validator = Validator()
        self.normalizer = Normalizer()
        self.aggregator = Aggregator()

    def register_ingestor(self, source_id: str, source_type: SourceType) -> None:
        self.ingestors[source_id] = Ingestor(source_type)

    def run(self, source_id: str, source_config: dict) -> dict[str, Any]:
        ingestor = self.ingestors.get(source_id)
        if ingestor is None:
            return {"status": "error", "message": f"No ingestor registered for {source_id}"}

        staged = ingestor.ingest(source_config)
        records = staged.get("records", [])

        result = self.validator.validate(records)
        if not result.is_valid:
            return {"status": "validation_failed", "errors": result.errors}

        cleaned = self.cleaner.clean(result.records)
        normalized = self.normalizer.normalize(cleaned["records"])
        aggregated = self.aggregator.aggregate(normalized, group_by="source_id")

        return {
            "status": "completed",
            "records_cleaned": cleaned["cleaned"],
            "records_normalized": len(normalized),
            "aggregation": aggregated,
        }


def get_data_pipeline(db: Session, registry: SourceRegistry) -> DataPipeline:
    return DataPipeline(db=db, registry=registry)
