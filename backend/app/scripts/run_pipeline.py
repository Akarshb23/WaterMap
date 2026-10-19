import argparse
import json
import logging
import sys

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from ..core.config import get_settings
from ..database import base as database_base, connection
from ..data_pipeline.pipeline_runner import DataPipeline, get_data_pipeline
from ..data_pipeline.source_registry import get_source_registry

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger(__name__)


def run_pipeline(database_url: str | None = None, source_id: str | None = None, source_config: dict | None = None) -> dict:
    url = database_url or connection.get_database_url()
    logger.info("Connecting to database: %s", url)

    engine = connection.create_engine_for_url(url)

    database_base.Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)

    with SessionLocal() as session:
        registry = get_source_registry()
        pipeline = get_data_pipeline(db=session, registry=registry)

        if source_id and source_config:
            result = pipeline.run(source_id=source_id, source_config=source_config)
            logger.info("Single source pipeline result: %s", result)
            return result
        else:
            result = pipeline.run_full_pipeline()
            logger.info("Full data pipeline completed: %s", result)
            return result


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the WaterMap data pipeline")
    parser.add_argument("--database-url", default=None, help="Database connection URL (defaults to config)")
    parser.add_argument("--full", action="store_true", default=True, help="Run full pipeline across all public datasets")
    parser.add_argument("--source-id", default=None, help="Run for specific source ID (e.g. DS001)")
    parser.add_argument("--config", default=None, help="JSON source configuration for single source run")
    args = parser.parse_args()

    try:
        config = json.loads(args.config) if args.config else None
        run_pipeline(
            database_url=args.database_url,
            source_id=args.source_id,
            source_config=config,
        )
    except Exception as exc:
        logger.exception("Pipeline run failed: %s", exc)
        sys.exit(1)


if __name__ == "__main__":
    main()

