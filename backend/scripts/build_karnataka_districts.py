"""Build the WaterMap district boundary file from the Esri India Living Atlas IAB2024 dataset.

Provenance
----------
Source:   Esri India Living Atlas, "IAB2024 / IAB_District_2024" (District Boundary feature layer),
          https://livingatlas.esri.in/server/rest/services/IAB2024/IAB_District_2024/MapServer/0
Query:    where=upper(state)='KARNATAKA', outFields=*, outSR=4326, f=geojson
          (the service stores geometry in Web Mercator EPSG:102100 and reprojects server-side)
Retrieved: 2026-10-19 (raw download kept unchanged at data/raw/iab2024_karnataka_epsg4326_raw.geojson)
Attributes: Official Government of India Local Government Directory (LGD) district and state
          codes, Census 2011 codes, and Census/local-language names. All source attributes are
          preserved unchanged.

Transformation policy
---------------------
The download is WGS84 (EPSG:4326), requested explicitly via the service's outSR=4326 parameter.
The WaterMap boundary pipeline expects a projected CRS in metres so that polygon simplification
tolerances are metric and topology-safe. This script therefore transforms the actual geometry
from EPSG:4326 to EPSG:7755 (WGS 84 / India NSF LCC, metres) with PyProj using always_xy=True,
and writes the declared CRS member into the output GeoJSON. The backend transforms the geometry
back to EPSG:4326 (also with always_xy=True) at request time and caches the result.

It writes only verified source geometry. No synthetic, approximated, or renamed-substitute
polygons are ever introduced.

Usage
-----
    python scripts/build_karnataka_districts.py

Inputs (relative to backend/data/raw):
    iab2024_karnataka_epsg4326_raw.geojson    (raw authoritative download)
Outputs:
    karnataka_districts.geojson               (EPSG:7755, all attributes preserved)
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

from pyproj import CRS, Transformer
from shapely.geometry import shape
from shapely.ops import transform as transform_geometry

DATA_DIR = Path(__file__).resolve().parents[1] / "data" / "raw"
RAW_INPUT = DATA_DIR / "iab2024_karnataka_epsg4326_raw.geojson"
OUTPUT = DATA_DIR / "karnataka_districts.geojson"

DECLARED_CRS = "urn:ogc:def:crs:EPSG::7755"
KARNATAKA_BBOX = (74.0, 11.5, 78.7, 18.9)
EXPECTED_COUNT = 31
EXPECTED_DISTRICTS = {
    "Bagalkote", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru South",
    "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapura",
    "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere",
    "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar",
    "Koppal", "Mandya", "Mysuru", "Raichur", "Shivamogga", "Tumakuru",
    "Udupi", "Uttara Kannada", "Vijayanagara", "Vijayapura", "Yadgir",
}


def main() -> int:
    if not RAW_INPUT.is_file():
        print(f"Missing raw authoritative download: {RAW_INPUT}", file=sys.stderr)
        print(
            "Re-download it with:\n"
            'curl "https://livingatlas.esri.in/server/rest/services/IAB2024/'
            'IAB_District_2024/MapServer/0/query?where=upper(state)%3D%27KARNATAKA%27'
            '&outFields=*&returnGeometry=true&outSR=4326&f=geojson" -o '
            "data/raw/iab2024_karnataka_epsg4326_raw.geojson",
            file=sys.stderr,
        )
        return 2

    collection = json.loads(RAW_INPUT.read_text(encoding="utf-8"))
    features = collection["features"]

    problems: list[str] = []

    names = [str(ft["properties"].get("name", "")).strip() for ft in features]
    codes = [ft["properties"].get("lgd_districtcode") for ft in features]

    if collection.get("type") != "FeatureCollection":
        problems.append("Download is not a GeoJSON FeatureCollection.")
    if len(features) != EXPECTED_COUNT:
        problems.append(f"Expected {EXPECTED_COUNT} Karnataka districts, got {len(features)}.")
    if set(names) != EXPECTED_DISTRICTS:
        problems.append("Unexpected district set from the authoritative source.")
    if any(not name for name in names):
        problems.append("A feature is missing its district name.")
    if len(set(codes)) != len(codes) or any(code is None for code in codes):
        problems.append("LGD district codes are not unique or one is empty.")

    transformer = Transformer.from_crs(
        CRS.from_epsg(4326),
        CRS.from_epsg(7755),
        always_xy=True,
    )
    reverse_transformer = Transformer.from_crs(
        CRS.from_epsg(7755),
        CRS.from_epsg(4326),
        always_xy=True,
    )

    out_features: list[dict] = []

    for feature in features:
        properties = feature["properties"]
        geometry = shape(feature["geometry"])

        if geometry.is_empty:
            problems.append(f"Empty geometry: {properties.get('name')}")
            continue
        if not geometry.is_valid:
            problems.append(f"Invalid geometry: {properties.get('name')}")
            continue

        projected = transform_geometry(transformer.transform, geometry)

        # Independent correctness check: every transformed coordinate must
        # round-trip to the same WGS84 position.
        back = transform_geometry(reverse_transformer.transform, projected)
        if not back.is_valid or not back.equals_exact(geometry, 1e-7):
            problems.append(f"Validity round-trip failed: {properties.get('name')}")

        out_features.append({
            "type": "Feature",
            "geometry": json.loads(json.dumps(projected.__geo_interface__)),
            "properties": dict(properties),
        })

    if problems:
        for problem in problems:
            print("FAIL:", problem, file=sys.stderr)
        return 1

    out_features.sort(key=lambda feature: feature["properties"]["name"])

    output_collection = {
        "type": "FeatureCollection",
        "name": "Karnataka districts IAB2024",
        "crs": {"type": "name", "properties": {"name": DECLARED_CRS}},
        "features": out_features,
    }

    OUTPUT.write_text(
        json.dumps(output_collection, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )

    size_kb = OUTPUT.stat().st_size / 1024
    print(f"Wrote {OUTPUT.name}: {len(out_features)} districts, {size_kb:,.0f} KB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
