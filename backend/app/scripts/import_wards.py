import argparse
import csv
import logging
import sys

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from ..database import base as database_base, models, connection, queries

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def import_from_csv(csv_path: str, database_url: str) -> int:
    engine = create_engine(database_url)
    database_base.Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)

    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        count = 0
        with SessionLocal() as session:
            for row in reader:
                ward_id = row.get("ward_id") or row.get("wardID")
                name = row.get("name") or row.get("ward_name")
                district = row.get("district")
                population = int(row.get("population") or 0)
                if not ward_id or not name:
                    continue
                queries.create_ward(
                    db=session,
                    ward_id=ward_id,
                    name=name,
                    district=district or "Unknown",
                    population=population,
                )
                count += 1
                logger.info("Imported ward: %s (%s)", ward_id, name)
    return count


def main() -> None:
    parser = argparse.ArgumentParser(description="Import wards from CSV")
    parser.add_argument("csv_path", help="Path to the CSV file")
    parser.add_argument("--database-url", default=None, help="Database URL (defaults to config)")
    args = parser.parse_args()

    database_url = args.database_url or str(connection.build_database_url())
    try:
        imported = import_from_csv(args.csv_path, database_url)
        logger.info("Imported %d wards.", imported)
    except Exception as exc:
        logger.exception("Import failed: %s", exc)
        sys.exit(1)


if __name__ == "__main__":
    main()
