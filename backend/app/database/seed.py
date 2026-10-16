from sqlalchemy.orm import Session

from . import models


def seed_data(db: Session) -> dict:
    wards = [
        {"ward_id": "W001", "name": "Central Ward", "district": "Downtown", "population": 24500},
        {"ward_id": "W002", "name": "Northside Ward", "district": "Northgate", "population": 19200},
        {"ward_id": "W003", "name": "Eastside Ward", "district": "Riverbend", "population": 21800},
        {"ward_id": "W004", "name": "Westend Ward", "district": "Harborview", "population": 17600},
        {"ward_id": "W005", "name": "Southbank Ward", "district": "Southside", "population": 23400},
    ]

    sources = [
        {
            "source_id": "DS001",
            "name": "Municipal Registry",
            "source_type": "internal",
            "url": "https://registry.umc.local",
            "description": "City municipal resident registry",
            "refresh_interval_hours": 24,
            "is_active": True,
        },
        {
            "source_id": "DS002",
            "name": "Hydrology Bureau",
            "source_type": "government",
            "url": "https://hydro.gov.bureau/feed",
            "description": "Surface water and groundwater monitoring data",
            "refresh_interval_hours": 12,
            "is_active": True,
        },
        {
            "source_id": "DS003",
            "name": "City Open Data",
            "source_type": "open-data",
            "url": "https://data.city.gov/releases",
            "description": "Publicly released urban infrastructure datasets",
            "refresh_interval_hours": 72,
            "is_active": True,
        },
    ]

    created_wards = []
    for w in wards:
        db_ward = models.Ward(**w)
        db.add(db_ward)
        db.commit()
        db.refresh(db_ward)
        created_wards.append(db_ward)

    created_sources = []
    for s in sources:
        db_source = models.DataSource(**s)
        db.add(db_source)
        db.commit()
        db.refresh(db_source)
        created_sources.append(db_source)

    return {
        "wards_created": len(created_wards),
        "sources_created": len(created_sources),
    }
