import argparse
import logging
import sys

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from ..database import base as database_base, models, connection, seed

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init_db() -> None:
    engine = create_engine(str(connection.build_database_url()))
    database_base.Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    with SessionLocal() as session:
        db_seed = seed.seed_data(session)
        logger.info("Database initialized: %s", db_seed)


def main() -> None:
    parser = argparse.ArgumentParser(description="Initialize WaterMap database")
    parser.add_argument("--create-tables", action="store_true", help="Create tables only")
    parser.add_argument("--seed", action="store_true", help="Seed sample data")
    args = parser.parse_args()

    init_db()
    if args.seed:
        from ..database import session as db_session

        with db_session.SessionLocal() as session:
            seeded = seed.seed_data(session)
            logger.info("Seeded: %s", seeded)


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        logger.exception("Database initialization failed: %s", exc)
        sys.exit(1)
