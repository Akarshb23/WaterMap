from pathlib import Path
from typing import Dict, Any
from sqlalchemy.orm import Session

from . import models
from ..core.config import get_settings


def seed_data(db: Session) -> Dict[str, Any]:
    """Seeds the database with reference data sources, 25 wards, and indicators.
    If raw datasets exist on disk, runs the data pipeline; otherwise seeds core records."""
    settings = get_settings()
    raw_path = Path(settings.raw_data_dir)

    if (raw_path / "ward_boundaries.geojson").exists():
        from ..data_pipeline.pipeline_runner import get_data_pipeline

        pipeline = get_data_pipeline(db=db)
        result = pipeline.run_full_pipeline(raw_dir=raw_path)
        return {
            "wards_created": result["total_wards"],
            "sources_created": result["stats"]["sources_registered"],
            "indicators_created": result["stats"]["indicators_created"],
            "pipeline_run_id": result["run_id"],
        }

    # Fallback in-memory seed (e.g. for isolated test environments)
    sources = [
        {
            "source_id": "DS001",
            "name": "Central Ground Water Board (CGWB) NWIC",
            "source_type": "government",
            "url": "https://nwic.gov.in/groundwater-monitoring",
            "description": "National Water Informatics Center telemetric and manual well observation network.",
            "refresh_interval_hours": 24,
            "is_active": True,
        },
        {
            "source_id": "DS002",
            "name": "India Meteorological Department (IMD) Precipitation Grid",
            "source_type": "weather",
            "url": "https://mausam.imd.gov.in/bengaluru/rainfall",
            "description": "High-resolution gridded daily rainfall and precipitation deviation monitoring.",
            "refresh_interval_hours": 12,
            "is_active": True,
        },
        {
            "source_id": "DS003",
            "name": "Bangalore Water Supply and Sewerage Board (BWSSB)",
            "source_type": "municipal",
            "url": "https://bwssb.karnataka.gov.in/telemetry",
            "description": "Bulk piped drinking water transmission and per capita distribution.",
            "refresh_interval_hours": 24,
            "is_active": True,
        },
    ]

    for s in sources:
        existing = db.query(models.DataSource).filter_by(source_id=s["source_id"]).first()
        if not existing:
            db.add(models.DataSource(**s))

    wards = [
        {
            "ward_id": "W001",
            "name": "Koramangala",
            "district": "Bengaluru Urban",
            "zone": "South",
            "population": 52400,
            "area_sqkm": 6.85,
            "centroid_lat": 12.9352,
            "centroid_lon": 77.6245,
            "water_stress_index": 0.45,
            "risk_category": "moderate",
            "geometry": '{"type": "Polygon", "coordinates": [[[77.61, 12.92], [77.64, 12.92], [77.64, 12.95], [77.61, 12.95], [77.61, 12.92]]]}',
        },
        {
            "ward_id": "W002",
            "name": "Indiranagar",
            "district": "Bengaluru Urban",
            "zone": "East",
            "population": 46800,
            "area_sqkm": 4.92,
            "centroid_lat": 12.9784,
            "centroid_lon": 77.6408,
            "water_stress_index": 0.32,
            "risk_category": "low",
            "geometry": '{"type": "Polygon", "coordinates": [[[77.63, 12.97], [77.66, 12.97], [77.66, 12.99], [77.63, 12.99], [77.63, 12.97]]]}',
        },
        {
            "ward_id": "W003",
            "name": "Bellandur",
            "district": "Bengaluru Urban",
            "zone": "Mahadevapura",
            "population": 94500,
            "area_sqkm": 14.30,
            "centroid_lat": 12.9260,
            "centroid_lon": 77.6762,
            "water_stress_index": 0.88,
            "risk_category": "critical",
            "geometry": '{"type": "Polygon", "coordinates": [[[77.66, 12.91], [77.70, 12.91], [77.70, 12.95], [77.66, 12.95], [77.66, 12.91]]]}',
        },
        {
            "ward_id": "W004",
            "name": "Whitefield",
            "district": "Bengaluru Urban",
            "zone": "Mahadevapura",
            "population": 88200,
            "area_sqkm": 13.80,
            "centroid_lat": 12.9698,
            "centroid_lon": 77.7499,
            "water_stress_index": 0.91,
            "risk_category": "critical",
            "geometry": '{"type": "Polygon", "coordinates": [[[77.73, 12.95], [77.77, 12.95], [77.77, 12.99], [77.73, 12.99], [77.73, 12.95]]]}',
        },
        {
            "ward_id": "W005",
            "name": "Malleshwaram",
            "district": "Bengaluru Urban",
            "zone": "West",
            "population": 43500,
            "area_sqkm": 4.25,
            "centroid_lat": 12.9962,
            "centroid_lon": 77.5714,
            "water_stress_index": 0.18,
            "risk_category": "low",
            "geometry": '{"type": "Polygon", "coordinates": [[[77.56, 12.98], [77.59, 12.98], [77.59, 13.01], [77.56, 13.01], [77.56, 12.98]]]}',
        },
    ]

    for w in wards:
        existing = db.query(models.Ward).filter_by(ward_id=w["ward_id"]).first()
        if not existing:
            db.add(models.Ward(**w))

    db.commit()

    return {
        "wards_created": len(wards),
        "sources_created": len(sources),
    }

