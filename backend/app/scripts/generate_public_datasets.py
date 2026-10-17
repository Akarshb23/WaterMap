import json
import csv
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
RAW_DIR = BASE_DIR / "data" / "raw"
SAMPLE_DIR = BASE_DIR / "data" / "sample"
PROCESSED_DIR = BASE_DIR / "data" / "processed"

RAW_DIR.mkdir(parents=True, exist_ok=True)
SAMPLE_DIR.mkdir(parents=True, exist_ok=True)
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

# 25 Realistic Urban Wards (Bengaluru Metropolitan Region)
WARDS = [
    {
        "ward_id": "W001",
        "name": "Koramangala",
        "district": "Bengaluru Urban",
        "zone": "South",
        "population": 52400,
        "area_sqkm": 6.85,
        "center_lat": 12.9352,
        "center_lon": 77.6245,
        "groundwater_mbgl": 28.5,
        "rainfall_mm": 680.0,
        "normal_rainfall_mm": 840.0,
        "supply_lpcd": 95.0,
        "tanker_trips": 110,
        "tanker_price": 950,
        "complaints": 38,
        "lake_name": "Koramangala Valley Tank",
        "lake_area_ha": 14.5,
        "lake_storage_pct": 42.0,
    },
    {
        "ward_id": "W002",
        "name": "Indiranagar",
        "district": "Bengaluru Urban",
        "zone": "East",
        "population": 46800,
        "area_sqkm": 4.92,
        "center_lat": 12.9784,
        "center_lon": 77.6408,
        "groundwater_mbgl": 24.2,
        "rainfall_mm": 710.0,
        "normal_rainfall_mm": 840.0,
        "supply_lpcd": 115.0,
        "tanker_trips": 45,
        "tanker_price": 900,
        "complaints": 18,
        "lake_name": "Domlur Sub-basin",
        "lake_area_ha": 8.0,
        "lake_storage_pct": 55.0,
    },
    {
        "ward_id": "W003",
        "name": "Bellandur",
        "district": "Bengaluru Urban",
        "zone": "Mahadevapura",
        "population": 94500,
        "area_sqkm": 14.30,
        "center_lat": 12.9260,
        "center_lon": 77.6762,
        "groundwater_mbgl": 68.4,
        "rainfall_mm": 610.0,
        "normal_rainfall_mm": 840.0,
        "supply_lpcd": 38.0,
        "tanker_trips": 485,
        "tanker_price": 1450,
        "complaints": 164,
        "lake_name": "Bellandur Lake",
        "lake_area_ha": 365.0,
        "lake_storage_pct": 28.0,
    },
    {
        "ward_id": "W004",
        "name": "Whitefield",
        "district": "Bengaluru Urban",
        "zone": "Mahadevapura",
        "population": 88200,
        "area_sqkm": 13.80,
        "center_lat": 12.9698,
        "center_lon": 77.7499,
        "groundwater_mbgl": 72.5,
        "rainfall_mm": 595.0,
        "normal_rainfall_mm": 840.0,
        "supply_lpcd": 32.0,
        "tanker_trips": 520,
        "tanker_price": 1500,
        "complaints": 182,
        "lake_name": "Sheelavanthakere",
        "lake_area_ha": 22.0,
        "lake_storage_pct": 22.0,
    },
    {
        "ward_id": "W005",
        "name": "Marathahalli",
        "district": "Bengaluru Urban",
        "zone": "Mahadevapura",
        "population": 73600,
        "area_sqkm": 9.45,
        "center_lat": 12.9563,
        "center_lon": 77.7011,
        "groundwater_mbgl": 58.2,
        "rainfall_mm": 625.0,
        "normal_rainfall_mm": 840.0,
        "supply_lpcd": 45.0,
        "tanker_trips": 340,
        "tanker_price": 1350,
        "complaints": 115,
        "lake_name": "Kundalahalli Lake",
        "lake_area_ha": 18.5,
        "lake_storage_pct": 34.0,
    },
    {
        "ward_id": "W006",
        "name": "HSR Layout",
        "district": "Bengaluru Urban",
        "zone": "Bommanahalli",
        "population": 65400,
        "area_sqkm": 7.80,
        "center_lat": 12.9121,
        "center_lon": 77.6446,
        "groundwater_mbgl": 44.8,
        "rainfall_mm": 670.0,
        "normal_rainfall_mm": 840.0,
        "supply_lpcd": 78.0,
        "tanker_trips": 195,
        "tanker_price": 1100,
        "complaints": 62,
        "lake_name": "Agara Lake",
        "lake_area_ha": 58.0,
        "lake_storage_pct": 62.0,
    },
    {
        "ward_id": "W007",
        "name": "Jayanagar",
        "district": "Bengaluru Urban",
        "zone": "South",
        "population": 48200,
        "area_sqkm": 5.10,
        "center_lat": 12.9250,
        "center_lon": 77.5838,
        "groundwater_mbgl": 18.2,
        "rainfall_mm": 740.0,
        "normal_rainfall_mm": 840.0,
        "supply_lpcd": 135.0,
        "tanker_trips": 15,
        "tanker_price": 800,
        "complaints": 8,
        "lake_name": "Madhavan Park Reservoir",
        "lake_area_ha": 4.2,
        "lake_storage_pct": 75.0,
    },
    {
        "ward_id": "W008",
        "name": "Malleshwaram",
        "district": "Bengaluru Urban",
        "zone": "West",
        "population": 43500,
        "area_sqkm": 4.25,
        "center_lat": 12.9962,
        "center_lon": 77.5714,
        "groundwater_mbgl": 12.4,
        "rainfall_mm": 765.0,
        "normal_rainfall_mm": 840.0,
        "supply_lpcd": 142.0,
        "tanker_trips": 10,
        "tanker_price": 800,
        "complaints": 5,
        "lake_name": "Sankey Tank",
        "lake_area_ha": 15.0,
        "lake_storage_pct": 82.0,
    },
    {
        "ward_id": "W009",
        "name": "Hebbal",
        "district": "Bengaluru Urban",
        "zone": "North",
        "population": 59100,
        "area_sqkm": 8.15,
        "center_lat": 13.0358,
        "center_lon": 77.5970,
        "groundwater_mbgl": 31.0,
        "rainfall_mm": 715.0,
        "normal_rainfall_mm": 840.0,
        "supply_lpcd": 88.0,
        "tanker_trips": 140,
        "tanker_price": 1050,
        "complaints": 48,
        "lake_name": "Hebbal Lake",
        "lake_area_ha": 65.0,
        "lake_storage_pct": 58.0,
    },
    {
        "ward_id": "W010",
        "name": "Yelahanka Satellite Town",
        "district": "Bengaluru Urban",
        "zone": "Yelahanka",
        "population": 71200,
        "area_sqkm": 11.20,
        "center_lat": 13.1007,
        "center_lon": 77.5963,
        "groundwater_mbgl": 52.3,
        "rainfall_mm": 640.0,
        "normal_rainfall_mm": 840.0,
        "supply_lpcd": 55.0,
        "tanker_trips": 280,
        "tanker_price": 1250,
        "complaints": 98,
        "lake_name": "Yelahanka Kere",
        "lake_area_ha": 120.0,
        "lake_storage_pct": 46.0,
    },
    {
        "ward_id": "W011",
        "name": "Vasanth Nagar",
        "district": "Bengaluru Urban",
        "zone": "Central",
        "population": 32800,
        "area_sqkm": 3.10,
        "center_lat": 12.9902,
        "center_lon": 77.5901,
        "groundwater_mbgl": 14.5,
        "rainfall_mm": 750.0,
        "normal_rainfall_mm": 840.0,
        "supply_lpcd": 148.0,
        "tanker_trips": 8,
        "tanker_price": 850,
        "complaints": 4,
        "lake_name": "High Grounds Catchment",
        "lake_area_ha": 3.5,
        "lake_storage_pct": 80.0,
    },
    {
        "ward_id": "W012",
        "name": "Shanthinagar",
        "district": "Bengaluru Urban",
        "zone": "Central",
        "population": 39400,
        "area_sqkm": 3.85,
        "center_lat": 12.9605,
        "center_lon": 77.5982,
        "groundwater_mbgl": 16.8,
        "rainfall_mm": 735.0,
        "normal_rainfall_mm": 840.0,
        "supply_lpcd": 138.0,
        "tanker_trips": 12,
        "tanker_price": 850,
        "complaints": 6,
        "lake_name": "Lalbagh Lake",
        "lake_area_ha": 16.0,
        "lake_storage_pct": 72.0,
    },
    {
        "ward_id": "W013",
        "name": "BTM Layout",
        "district": "Bengaluru Urban",
        "zone": "South",
        "population": 68900,
        "area_sqkm": 6.90,
        "center_lat": 12.9166,
        "center_lon": 77.6101,
        "groundwater_mbgl": 36.4,
        "rainfall_mm": 690.0,
        "normal_rainfall_mm": 840.0,
        "supply_lpcd": 82.0,
        "tanker_trips": 160,
        "tanker_price": 1000,
        "complaints": 54,
        "lake_name": "Madiwala Lake",
        "lake_area_ha": 114.0,
        "lake_storage_pct": 52.0,
    },
    {
        "ward_id": "W014",
        "name": "Domlur",
        "district": "Bengaluru Urban",
        "zone": "East",
        "population": 41200,
        "area_sqkm": 4.15,
        "center_lat": 12.9610,
        "center_lon": 77.6387,
        "groundwater_mbgl": 26.0,
        "rainfall_mm": 710.0,
        "normal_rainfall_mm": 840.0,
        "supply_lpcd": 108.0,
        "tanker_trips": 65,
        "tanker_price": 950,
        "complaints": 24,
        "lake_name": "Challaghatta Basin",
        "lake_area_ha": 12.0,
        "lake_storage_pct": 48.0,
    },
    {
        "ward_id": "W015",
        "name": "Rajajinagar",
        "district": "Bengaluru Urban",
        "zone": "West",
        "population": 54800,
        "area_sqkm": 5.40,
        "center_lat": 12.9915,
        "center_lon": 77.5532,
        "groundwater_mbgl": 19.5,
        "rainfall_mm": 755.0,
        "normal_rainfall_mm": 840.0,
        "supply_lpcd": 130.0,
        "tanker_trips": 22,
        "tanker_price": 850,
        "complaints": 9,
        "lake_name": "Kethmaranahalli Tank",
        "lake_area_ha": 7.5,
        "lake_storage_pct": 68.0,
    },
    {
        "ward_id": "W016",
        "name": "Basavanagudi",
        "district": "Bengaluru Urban",
        "zone": "South",
        "population": 44300,
        "area_sqkm": 4.50,
        "center_lat": 12.9421,
        "center_lon": 77.5742,
        "groundwater_mbgl": 13.8,
        "rainfall_mm": 770.0,
        "normal_rainfall_mm": 840.0,
        "supply_lpcd": 140.0,
        "tanker_trips": 11,
        "tanker_price": 800,
        "complaints": 5,
        "lake_name": "Kempambudhi Lake",
        "lake_area_ha": 18.0,
        "lake_storage_pct": 74.0,
    },
    {
        "ward_id": "W017",
        "name": "Shivajinagar",
        "district": "Bengaluru Urban",
        "zone": "Central",
        "population": 49100,
        "area_sqkm": 3.60,
        "center_lat": 12.9863,
        "center_lon": 77.6033,
        "groundwater_mbgl": 17.5,
        "rainfall_mm": 745.0,
        "normal_rainfall_mm": 840.0,
        "supply_lpcd": 132.0,
        "tanker_trips": 18,
        "tanker_price": 850,
        "complaints": 12,
        "lake_name": "Ulsoor Lake North",
        "lake_area_ha": 48.0,
        "lake_storage_pct": 71.0,
    },
    {
        "ward_id": "W018",
        "name": "Banashankari",
        "district": "Bengaluru Urban",
        "zone": "South",
        "population": 61200,
        "area_sqkm": 6.75,
        "center_lat": 12.9155,
        "center_lon": 77.5562,
        "groundwater_mbgl": 25.8,
        "rainfall_mm": 720.0,
        "normal_rainfall_mm": 840.0,
        "supply_lpcd": 118.0,
        "tanker_trips": 52,
        "tanker_price": 900,
        "complaints": 21,
        "lake_name": "Yediyur Lake",
        "lake_area_ha": 11.2,
        "lake_storage_pct": 65.0,
    },
    {
        "ward_id": "W019",
        "name": "RT Nagar",
        "district": "Bengaluru Urban",
        "zone": "North",
        "population": 53400,
        "area_sqkm": 5.20,
        "center_lat": 13.0185,
        "center_lon": 77.5945,
        "groundwater_mbgl": 29.4,
        "rainfall_mm": 705.0,
        "normal_rainfall_mm": 840.0,
        "supply_lpcd": 98.0,
        "tanker_trips": 85,
        "tanker_price": 980,
        "complaints": 31,
        "lake_name": "Matadahalli Tank",
        "lake_area_ha": 6.8,
        "lake_storage_pct": 50.0,
    },
    {
        "ward_id": "W020",
        "name": "Mahadevapura Core",
        "district": "Bengaluru Urban",
        "zone": "Mahadevapura",
        "population": 81200,
        "area_sqkm": 11.80,
        "center_lat": 12.9882,
        "center_lon": 77.6953,
        "groundwater_mbgl": 64.0,
        "rainfall_mm": 605.0,
        "normal_rainfall_mm": 840.0,
        "supply_lpcd": 42.0,
        "tanker_trips": 420,
        "tanker_price": 1400,
        "complaints": 145,
        "lake_name": "Mahadevapura Lake",
        "lake_area_ha": 26.5,
        "lake_storage_pct": 30.0,
    },
    {
        "ward_id": "W021",
        "name": "Bommanahalli Core",
        "district": "Bengaluru Urban",
        "zone": "Bommanahalli",
        "population": 76500,
        "area_sqkm": 9.10,
        "center_lat": 12.8984,
        "center_lon": 77.6212,
        "groundwater_mbgl": 48.6,
        "rainfall_mm": 655.0,
        "normal_rainfall_mm": 840.0,
        "supply_lpcd": 65.0,
        "tanker_trips": 260,
        "tanker_price": 1180,
        "complaints": 88,
        "lake_name": "Bommanahalli Kere",
        "lake_area_ha": 19.4,
        "lake_storage_pct": 38.0,
    },
    {
        "ward_id": "W022",
        "name": "KR Puram",
        "district": "Bengaluru Urban",
        "zone": "Mahadevapura",
        "population": 78900,
        "area_sqkm": 10.60,
        "center_lat": 13.0075,
        "center_lon": 77.6961,
        "groundwater_mbgl": 55.4,
        "rainfall_mm": 630.0,
        "normal_rainfall_mm": 840.0,
        "supply_lpcd": 52.0,
        "tanker_trips": 310,
        "tanker_price": 1300,
        "complaints": 105,
        "lake_name": "KR Puram Lake",
        "lake_area_ha": 32.0,
        "lake_storage_pct": 35.0,
    },
    {
        "ward_id": "W023",
        "name": "Thanisandra",
        "district": "Bengaluru Urban",
        "zone": "Yelahanka",
        "population": 62800,
        "area_sqkm": 8.90,
        "center_lat": 13.0552,
        "center_lon": 77.6324,
        "groundwater_mbgl": 49.0,
        "rainfall_mm": 660.0,
        "normal_rainfall_mm": 840.0,
        "supply_lpcd": 58.0,
        "tanker_trips": 220,
        "tanker_price": 1200,
        "complaints": 76,
        "lake_name": "Rachenahalli Lake",
        "lake_area_ha": 44.0,
        "lake_storage_pct": 45.0,
    },
    {
        "ward_id": "W024",
        "name": "Electronic City",
        "district": "Bengaluru Urban",
        "zone": "South Peripheral",
        "population": 85000,
        "area_sqkm": 12.50,
        "center_lat": 12.8452,
        "center_lon": 77.6601,
        "groundwater_mbgl": 66.8,
        "rainfall_mm": 615.0,
        "normal_rainfall_mm": 840.0,
        "supply_lpcd": 36.0,
        "tanker_trips": 460,
        "tanker_price": 1450,
        "complaints": 155,
        "lake_name": "Doddathoguru Lake",
        "lake_area_ha": 25.0,
        "lake_storage_pct": 25.0,
    },
    {
        "ward_id": "W025",
        "name": "Sarjapur Road Peripheral",
        "district": "Bengaluru Urban",
        "zone": "Mahadevapura Peripheral",
        "population": 91000,
        "area_sqkm": 13.40,
        "center_lat": 12.9080,
        "center_lon": 77.6985,
        "groundwater_mbgl": 71.0,
        "rainfall_mm": 600.0,
        "normal_rainfall_mm": 840.0,
        "supply_lpcd": 30.0,
        "tanker_trips": 505,
        "tanker_price": 1500,
        "complaints": 178,
        "lake_name": "Kaikondrahalli Lake",
        "lake_area_ha": 48.0,
        "lake_storage_pct": 32.0,
    },
]

DATA_SOURCES = [
    {
        "source_id": "DS001",
        "name": "Central Ground Water Board (CGWB) NWIC",
        "source_type": "government",
        "url": "https://nwic.gov.in/groundwater-monitoring",
        "description": "National Water Informatics Center telemetric and manual well observation network for depth to groundwater.",
        "citation": "Central Ground Water Board, Ministry of Jal Shakti, Government of India (2024). Dynamic Ground Water Resources Assessment.",
        "license": "Government Open Data License - India (GODL)",
        "refresh_interval_hours": 24,
        "is_active": True,
    },
    {
        "source_id": "DS002",
        "name": "India Meteorological Department (IMD) Precipitation Grid",
        "source_type": "weather",
        "url": "https://mausam.imd.gov.in/bengaluru/rainfall",
        "description": "High-resolution gridded daily rainfall and precipitation deviation monitoring across urban gauges.",
        "citation": "India Meteorological Department, Ministry of Earth Sciences (2024). Urban Precipitation Telemetry.",
        "license": "Open Data License",
        "refresh_interval_hours": 12,
        "is_active": True,
    },
    {
        "source_id": "DS003",
        "name": "Bangalore Water Supply and Sewerage Board (BWSSB)",
        "source_type": "municipal",
        "url": "https://bwssb.karnataka.gov.in/telemetry",
        "description": "Bulk piped drinking water transmission, DMA distribution volume, and per capita LPCD delivery metrics.",
        "citation": "BWSSB Department of Water Supply (2024). Bulk Water Distribution and Per Capita Supply Ledger.",
        "license": "Public Disclosure / Municipal Gazette",
        "refresh_interval_hours": 24,
        "is_active": True,
    },
    {
        "source_id": "DS004",
        "name": "BBMP Sahaaya 2.0 Grievance Redressal",
        "source_type": "municipal",
        "url": "https://sahaaya.bbmp.gov.in/water-scarcity-complaints",
        "description": "Citizen logged water scarcity grievances, borewell drying reports, and municipal tanker dispatch records.",
        "citation": "Bruhat Bengaluru Mahanagara Palike (2024). Urban Grievance Redressal and Citizen Telemetry.",
        "license": "Open Municipal Data",
        "refresh_interval_hours": 6,
        "is_active": True,
    },
    {
        "source_id": "DS005",
        "name": "Karnataka State Remote Sensing Applications Centre (KSRSAC)",
        "source_type": "satellite",
        "url": "https://ksrsac.karnataka.gov.in/lake-atlas",
        "description": "Sentinel-2 and Landsat NDWI satellite surface water spread area, lake storage percentage, and catchment health.",
        "citation": "KSRSAC Urban Lake Information System (2024). Satellite-based Urban Hydrological Atlas.",
        "license": "Public Research Data",
        "refresh_interval_hours": 72,
        "is_active": True,
    },
    {
        "source_id": "DS006",
        "name": "Open Government Data (OGD) Platform India",
        "source_type": "open_data",
        "url": "https://data.gov.in/resource/urban-demographics-wards",
        "description": "Census population projections, administrative boundaries, ward spatial polygons, and socioeconomic indices.",
        "citation": "Office of the Registrar General & Census Commissioner, India (2021 Projections).",
        "license": "Open Data Commons Open Database License (ODbL)",
        "refresh_interval_hours": 168,
        "is_active": True,
    },
]


def make_ward_polygon(lat: float, lon: float, area_sqkm: float) -> list:
    """Generate a realistic 6-vertex polygon around a center coordinate based on area."""
    radius = (area_sqkm ** 0.5) * 0.005  # approx degrees
    angles = [0, 60, 120, 180, 240, 300, 360]
    import math
    coords = []
    for angle in angles:
        rad = math.radians(angle)
        # Add slight pseudo-irregularity for natural urban ward shape
        r = radius * (0.85 + 0.3 * math.sin(rad * 3 + lat * 10))
        d_lon = r * math.cos(rad) / math.cos(math.radians(lat))
        d_lat = r * math.sin(rad)
        coords.append([round(lon + d_lon, 6), round(lat + d_lat, 6)])
    return [coords]


def generate_all():
    print(f"Generating public datasets in {RAW_DIR} and {SAMPLE_DIR}...")

    # 1. Ward Boundaries GeoJSON
    features = []
    for w in WARDS:
        poly_coords = make_ward_polygon(w["center_lat"], w["center_lon"], w["area_sqkm"])
        features.append({
            "type": "Feature",
            "id": w["ward_id"],
            "properties": {
                "ward_id": w["ward_id"],
                "name": w["name"],
                "district": w["district"],
                "zone": w["zone"],
                "population": w["population"],
                "area_sqkm": w["area_sqkm"],
                "centroid_lat": w["center_lat"],
                "centroid_lon": w["center_lon"],
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": poly_coords,
            }
        })

    geojson_data = {
        "type": "FeatureCollection",
        "name": "Bengaluru_Wards_Water_Resilience",
        "crs": {
            "type": "name",
            "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}
        },
        "features": features
    }

    with open(RAW_DIR / "ward_boundaries.geojson", "w", encoding="utf-8") as f:
        json.dump(geojson_data, f, indent=2)
    with open(SAMPLE_DIR / "ward_boundaries.geojson", "w", encoding="utf-8") as f:
        # Sample contains top 5 wards
        sample_geojson = dict(geojson_data)
        sample_geojson["features"] = features[:5]
        json.dump(sample_geojson, f, indent=2)

    # 2. Groundwater Levels CSV
    gw_file = RAW_DIR / "groundwater_levels.csv"
    with open(gw_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "ward_id", "station_id", "date", "water_level_mbgl",
            "pre_monsoon_mbgl", "post_monsoon_mbgl", "status", "source_id"
        ])
        for w in WARDS:
            pre_m = round(w["groundwater_mbgl"] + 3.2, 2)
            post_m = round(w["groundwater_mbgl"] - 1.8, 2)
            status = "over_exploited" if w["groundwater_mbgl"] > 40 else (
                "critical" if w["groundwater_mbgl"] > 25 else (
                    "semi_critical" if w["groundwater_mbgl"] > 15 else "safe"
                )
            )
            writer.writerow([
                w["ward_id"],
                f"CGWB-BLR-{w['ward_id']}",
                "2024-09-30",
                w["groundwater_mbgl"],
                pre_m,
                post_m,
                status,
                "DS001"
            ])

    # 3. Rainfall & Precipitation CSV
    rf_file = RAW_DIR / "rainfall_precipitation.csv"
    with open(rf_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "ward_id", "station_id", "date", "actual_rainfall_mm",
            "normal_rainfall_mm", "departure_pct", "dry_spell_days", "source_id"
        ])
        for w in WARDS:
            dep_pct = round(((w["rainfall_mm"] - w["normal_rainfall_mm"]) / w["normal_rainfall_mm"]) * 100, 1)
            dry_days = int(max(0, -dep_pct / 2.5)) + 4
            writer.writerow([
                w["ward_id"],
                f"IMD-BLR-{w['ward_id']}",
                "2024-09-30",
                w["rainfall_mm"],
                w["normal_rainfall_mm"],
                dep_pct,
                dry_days,
                "DS002"
            ])

    # 4. Piped Water Supply CSV
    ws_file = RAW_DIR / "piped_water_supply.csv"
    with open(ws_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "ward_id", "date", "supply_mld", "per_capita_lpcd",
            "benchmark_lpcd", "deficit_lpcd", "supply_hours_per_day", "source_id"
        ])
        for w in WARDS:
            mld = round((w["population"] * w["supply_lpcd"]) / 1_000_000, 2)
            deficit = max(0.0, round(135.0 - w["supply_lpcd"], 1))
            hours = round(w["supply_lpcd"] / 30.0, 1)
            writer.writerow([
                w["ward_id"],
                "2024-09-30",
                mld,
                w["supply_lpcd"],
                135.0,
                deficit,
                hours,
                "DS003"
            ])

    # 5. Tanker Water Demand CSV
    td_file = RAW_DIR / "tanker_water_demand.csv"
    with open(td_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "ward_id", "date", "registered_tanker_trips", "avg_tanker_price_inr",
            "scarcity_complaints", "trips_per_thousand_residents", "source_id"
        ])
        for w in WARDS:
            rate = round((w["tanker_trips"] / w["population"]) * 1000, 2)
            writer.writerow([
                w["ward_id"],
                "2024-09-30",
                w["tanker_trips"],
                w["tanker_price"],
                w["complaints"],
                rate,
                "DS004"
            ])

    # 6. Water Bodies and Lakes CSV
    wb_file = RAW_DIR / "water_bodies_lakes.csv"
    with open(wb_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "ward_id", "lake_name", "total_area_ha", "storage_capacity_pct",
            "coverage_pct_of_ward", "source_id"
        ])
        for w in WARDS:
            cov_pct = round((w["lake_area_ha"] / (w["area_sqkm"] * 100)) * 100, 2)
            writer.writerow([
                w["ward_id"],
                w["lake_name"],
                w["lake_area_ha"],
                w["lake_storage_pct"],
                cov_pct,
                "DS005"
            ])

    # 7. Data Sources JSON
    with open(RAW_DIR / "data_sources.json", "w", encoding="utf-8") as f:
        json.dump(DATA_SOURCES, f, indent=2)
    with open(SAMPLE_DIR / "data_sources.json", "w", encoding="utf-8") as f:
        json.dump(DATA_SOURCES[:3], f, indent=2)

    # Copy CSV samples to sample dir (top 5 rows)
    for csv_file in [gw_file, rf_file, ws_file, td_file, wb_file]:
        with open(csv_file, "r", encoding="utf-8") as src:
            lines = [src.readline() for _ in range(6)]
        with open(SAMPLE_DIR / csv_file.name, "w", encoding="utf-8") as dst:
            dst.writelines(lines)

    print("All public datasets successfully generated!")


if __name__ == "__main__":
    generate_all()
