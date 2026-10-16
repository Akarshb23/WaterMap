import argparse
import logging
import sys

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from ..data_pipeline.pipeline_runner import DataPipeline, get_data_pipeline
from ..data_pipeline.source_registry import get_source_registry

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def run_pipeline(database_url: str, source_id: str, source_config: dict) -> None:
    engine = create_engine(database_url)
    from ..database import base as database_base

    database_base.Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)

    with SessionLocal() as session:
        registry = get_source_registry()
        pipeline = get_data_pipeline(db=session, registry=registry)
        result = pipeline.run(source_id=source_id, source_config=source_config)
        logger.info("Pipeline result: %s", result)


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the WaterMap data pipeline")
    parser.add_argument("--database-url", required=True)
    parser.add_argument("--source-id", required=True)
    parser.add_argument("--config", required=True, help="JSON source configuration")
    args = parser.parse_args()

    try:
        import json

        config = json.loads(args.config)
        run_pipeline(args.database_url, args.source_id, config)
    except Exception as exc:
        logger.exception("Pipeline run failed: %s", exc)
        sys.exit(1)


if __name__ == "__main__":
    main()
