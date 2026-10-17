import argparse
import logging
import sys

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from ..database import base as database_base, connection, seed
from ..core.config import get_settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger(__name__)


def init_db(database_url: str | None = None, seed_sample: bool = True) -> dict:
    url = database_url or connection.get_database_url()
    logger.info("Initializing database with URL: %s", url)

    engine = connection.create_engine_for_url(url)
    if not url.startswith("sqlite"):
        # Try enabling PostGIS if PostgreSQL
        try:
            with engine.connect() as conn:
                conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
                conn.commit()
                logger.info("PostGIS extension checked/enabled successfully.")
        except Exception as e:
            logger.warning("Could not enable PostGIS extension (may not be supported or lacked permissions): %s", e)

    database_base.Base.metadata.create_all(bind=engine)
    logger.info("Database tables verified and created successfully.")

    result = {}
    if seed_sample:
        SessionLocal = sessionmaker(bind=engine)
        with SessionLocal() as session:
            result = seed.seed_data(session)
            logger.info("Database seeded successfully: %s", result)

    return result


def main() -> None:
    parser = argparse.ArgumentParser(description="Initialize WaterMap database and schema")
    parser.add_argument("--database-url", default=None, help="Database connection URL")
    parser.add_argument("--create-tables-only", action="store_true", help="Create tables without seeding data")
    parser.add_argument("--seed", action="store_true", help="Seed data into database")
    args = parser.parse_args()

    seed_flag = args.seed or (not args.create_tables_only)
    try:
        init_db(database_url=args.database_url, seed_sample=seed_flag)
    except Exception as exc:
        logger.exception("Database initialization failed: %s", exc)
        sys.exit(1)


if __name__ == "__main__":
    main()

