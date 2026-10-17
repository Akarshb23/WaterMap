import argparse
import csv
import json
import logging
import sys
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from ..core.config import get_settings
from ..database import base as database_base, connection, queries

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger(__name__)


def import_wards_file(file_path: str, database_url: str | None = None) -> int:
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")

    url = database_url or connection.get_database_url()
    if url.startswith("sqlite"):
        engine = create_engine(url, connect_args={"check_same_thread": False})
    else:
        engine = create_engine(url)

    database_base.Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)

    count = 0
    with SessionLocal() as session:
        if path.suffix.lower() in [".geojson", ".json"]:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
            features = data.get("features", [])
            for feat in features:
                props = feat.get("properties", {})
                wid = props.get("ward_id") or feat.get("id")
                name = props.get("name") or "Unknown"
                district = props.get("district") or "Bengaluru Urban"
                zone = props.get("zone")
                pop = int(props.get("population") or 45000)
                area = float(props.get("area_sqkm") or 5.0)
                c_lat = float(props.get("centroid_lat") or 12.9716)
                c_lon = float(props.get("centroid_lon") or 77.5946)
                geom_str = json.dumps(feat.get("geometry", {}))

                if not wid:
                    continue

                existing = queries.get_ward(session, wid)
                ward_kwargs = {
                    "ward_id": wid,
                    "name": name,
                    "district": district,
                    "zone": zone,
                    "population": pop,
                    "area_sqkm": area,
                    "centroid_lat": c_lat,
                    "centroid_lon": c_lon,
                    "geometry": geom_str,
                }
                if existing:
                    kwargs_to_update = {k: v for k, v in ward_kwargs.items() if k != "ward_id"}
                    queries.update_ward(session, wid, **kwargs_to_update)
                else:
                    queries.create_ward(session, **ward_kwargs)

                count += 1
                logger.info("Imported GeoJSON ward: %s (%s)", wid, name)

        else:  # CSV format
            with open(path, newline="", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    wid = row.get("ward_id") or row.get("wardID")
                    name = row.get("name") or row.get("ward_name")
                    district = row.get("district") or "Bengaluru Urban"
                    pop = int(row.get("population") or 0)
                    if not wid or not name:
                        continue
                    existing = queries.get_ward(session, wid)
                    if existing:
                        queries.update_ward(session, wid, name=name, district=district, population=pop)
                    else:
                        queries.create_ward(session, ward_id=wid, name=name, district=district, population=pop)
                    count += 1
                    logger.info("Imported CSV ward: %s (%s)", wid, name)

    return count


def main() -> None:
    parser = argparse.ArgumentParser(description="Import wards from GeoJSON or CSV")
    parser.add_argument("file_path", help="Path to the GeoJSON or CSV file")
    parser.add_argument("--database-url", default=None, help="Database URL (defaults to config)")
    args = parser.parse_args()

    try:
        imported = import_wards_file(args.file_path, args.database_url)
        logger.info("Successfully imported %d wards.", imported)
    except Exception as exc:
        logger.exception("Import failed: %s", exc)
        sys.exit(1)


if __name__ == "__main__":
    main()

