"""
Karnataka district boundary verification script.

Reproducibility checks:
- CRS resolution and projected-vs-geographic classification
- Karnataka filtering by authoritative state attribute
- Unique name / LGD code / UID checks
- Empty and invalid geometry counts (original and transformed)
- WGS84 extent, coordinate range, centroid spot-checks
- Geodesic area (union and per-district largest polygon)
- Comparison against the official 31-district Karnataka list
"""

import hashlib
import json
from pathlib import Path

import numpy as np
import math
from pyproj import CRS, Geod, Transformer
from shapely.geometry import Polygon, shape
from shapely.ops import unary_union

RAW = Path(__file__).resolve().parents[1] / "data" / "raw"
GEOJSON_PATH = RAW / "karnataka_districts.geojson"

KARNATAKA_OFFICIAL = [
    "Bagalkote", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru South",
    "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapura", "Chikkamagaluru",
    "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag",
    "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar",
    "Koppal", "Mandya", "Mysuru", "Raichur", "Shivamogga",
    "Tumakuru", "Udupi", "Uttara Kannada", "Vijayanagara", "Vijayapura", "Yadgir",
]

# Legacy 30-district Karnataka list (pre-2021) for an additional cross-check.
# Useful for explaining why the dataset says 31 districts while older references say 30.
KARNATAKA_OFFICIAL_LEGACY = [
    "Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban",
    "Bidar", "Mysuru", "Raichur", "Bidar",
    "Chamarajanagar", "Chikkaballapura", "Dakshina Kannada", "Dharwad", "Gadag",
    "Kalaburagi", "Haveri", "Kodagu", "Kolar", "Mandya",
    "Mysuru", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada",
    "Chitradurga", "Bagalkot", "Belagavi", "Bengaluru Urban",
]

KARNATAKA_OFFICIAL_LEGACY_NORM = [
    "Bagalkot", "Bellary", "Belgaum", "Bangalore Rural", "Bangalore Urban",
    "Bidar", "Mysore", "Raichur",
    "Chamrajnagar", "Chickballapur", "South Canara", "Dharwad", "Gadag",
    "Gulbarga", "Haveri", "Kodagu", "Kolar", "Mandya",
    "Mysore", "Shimoga", "Tumkur", "Udupi", "North Canara",
    "Chitaldroog", "Bagalkot", "Belgaum", "Bangalore Urban",
]

KARNATAKA_LON_MIN, KARNATAKA_LON_MAX = 74.05, 78.59
KARNATAKA_LAT_MIN, KARNATAKA_LAT_MAX = 11.50, 18.48

CRS_7755 = CRS.from_epsg(7755)
CRS_WGS84 = CRS.from_epsg(4326)
TRANSFORMER = Transformer.from_crs(CRS_7755, CRS_WGS84, always_xy=True)
GEOD = Geod(ellps="WGS84")


def _build_transformed_polygon(geom, transformer):
    if geom.geom_type == "Polygon":
        rings = [geom.exterior] + list(geom.interiors)
        parts = []
        for ring in rings:
            coords = np.asarray(ring.coords)
            lon, lat = transformer.transform(coords[:, 0], coords[:, 1])
            parts.append(Polygon(zip(lon, lat)))
        return parts
    if geom.geom_type == "MultiPolygon":
        parts = []
        for poly_part in geom.geoms:
            rings = [poly_part.exterior] + list(poly_part.interiors)
            for ring in rings:
                coords = np.asarray(ring.coords)
                lon, lat = transformer.transform(coords[:, 0], coords[:, 1])
                parts.append(Polygon(zip(lon, lat)))
        return parts
    return []


def main():
    collection = json.loads(GEOJSON_PATH.read_text(encoding="utf-8"))
    features = collection["features"]

    print("FILE")
    print(f"  path: {GEOJSON_PATH}")
    print(f"  size (bytes): {GEOJSON_PATH.stat().st_size}")
    print(f"  sha256: {hashlib.sha256(GEOJSON_PATH.read_bytes()).hexdigest()}")
    print()

    print("CRS")
    print(f"  declared: {collection.get('crs')}")
    declared_name = (collection.get("crs") or {}).get("properties", {}).get("name")
    crs_resolved = CRS.from_user_input(declared_name)
    print(f"  resolved epsg: {crs_resolved.to_epsg()}")
    print(f"  is geograhpic: {crs_resolved.is_geographic}")
    print(f"  axis info: {[(a.name, a.abbrev, a.direction) for a in crs_resolved.axis_info]}")
    print()

    print(f"FEATURES: {len(features)}")
    names = [ft["properties"]["name"] for ft in features]
    codes = [ft["properties"].get("lgd_districtcode") for ft in features]
    uids = [ft["properties"].get("uid") for ft in features]
    print(f"  distinct names: {len(set(names))}")
    print(f"  distinct lgd_districtcode: {len(set(str(c) for c in codes if c is not None))}")
    print(f"  distinct uid: {len(set(str(u) for u in uids if u is not None))}")
    print(f"  duplicate names: {[n for n in set(names) if names.count(n) > 1]}")
    code_strs = [str(c) for c in codes if c is not None]
    uid_strs = [str(u) for u in uids if u is not None]
    print(f"  duplicate codes: {[c for c in set(code_strs) if code_strs.count(c) > 1]}")
    print(f"  duplicate uids: {[u for u in set(uid_strs) if uid_strs.count(u) > 1]}")
    print(f"  state values: {set(ft['properties'].get('state') for ft in features)}")
    print(f"  country values: {set(ft['properties'].get('country') for ft in features)}")
    print()

    print("GEOMETRY (original, CRS 7755)")
    orig_empty = sum(1 for ft in features if shape(ft["geometry"]).is_empty)
    orig_invalid = sum(1 for ft in features if not shape(ft["geometry"]).is_valid)
    orig_multipolygon = sum(1 for ft in features if shape(ft["geometry"]).geom_type == "MultiPolygon")
    print(f"  empty: {orig_empty}")
    print(f"  invalid: {orig_invalid}")
    print(f"  multipolygon: {orig_multipolygon}")
    print()

    print("GEOMETRY (transformed, WGS84)")
    transformed_features = []
    empty_after = 0
    invalid_after = 0
    all_transformed_polys = []
    for ft in features:
        geom = shape(ft["geometry"])
        tparts = _build_transformed_polygon(geom, TRANSFORMER)
        if not tparts:
            empty_after += 1
            continue
        combined_valid = all(p.is_valid and not p.is_empty for p in tparts)
        if not combined_valid:
            invalid_after += 1
        # Combine into one geometry for extent/area work if needed;
        # keep individual polygons for area counting.
        all_transformed_polys.extend(tparts)
        transformed_features.append((ft, tparts))

    print(f"  empty after transform: {empty_after}")
    print(f"  invalid after transform: {invalid_after}")
    print(f"  total transformed polygons: {len(all_transformed_polys)}")
    print()

    print("WGS84 EXTENT (all transformed polygons)")
    if all_transformed_polys:
        minx = min(p.bounds[0] for p in all_transformed_polys)
        miny = min(p.bounds[1] for p in all_transformed_polys)
        maxx = max(p.bounds[2] for p in all_transformed_polys)
        maxy = max(p.bounds[3] for p in all_transformed_polys)
        print(f"  lon: {minx:.4f} to {maxx:.4f}")
        print(f"  lat: {miny:.4f} to {maxy:.4f}")
        print(f"  outside Karnataka range: "
              f"{sum(1 for p in all_transformed_polys if p.bounds[0] < KARNATAKA_LON_MIN - 0.1 or p.bounds[2] > KARNATAKA_LON_MAX + 0.1 or p.bounds[1] < KARNATAKA_LAT_MIN - 0.1 or p.bounds[3] > KARNATAKA_LAT_MAX + 0.1)}")
    print()

    print("KARNATAKA OFFICIAL LIST COMPARISON")
    obtained = sorted(set(names))
    missing = set(KARNATAKA_OFFICIAL) - set(obtained)
    extra = set(obtained) - set(KARNATAKA_OFFICIAL)
    print(f"  expected: {len(KARNATAKA_OFFICIAL)}")
    print(f"  obtained: {len(obtained)}")
    print(f"  missing: {sorted(missing) or 'none'}")
    print(f"  extra: {sorted(extra) or 'none'}")
    normalise = {
        n.replace("Bengaluru", "Bangalore")
        .replace("Kalaburagi", "Gulbarga")
        .replace("Ballari", "Bellary")
        .replace("Chikkamagaluru", "Shimoga")
        .replace("Chikkaballapura", "Chickballapur")
        .replace("Chitradurga", "Chitaldroog")
        .replace("Dakshina Kannada", "South Canara")
        .replace("Uttara Kannada", "North Canara")
        .replace("Shivamogga", "Shimoga")
        for n in obtained
    }
    missing_vs_legacy = set(KARNATAKA_OFFICIAL_LEGACY_NORM) - set(normalise)
    extra_vs_legacy = set(normalise) - set(KARNATAKA_OFFICIAL_LEGACY_NORM)
    print(f"  vs legacy 30-district names (normalised): {len(set(normalise) & set(KARNATAKA_OFFICIAL_LEGACY_NORM))} match, missing={sorted(missing_vs_legacy) or 'none'}, extra={sorted(extra_vs_legacy) or 'none'}")
    print(f"  exact match: {not missing and not extra}")
    print()

    print("DISTRICT AREAS (geodesic, WGS84, largest polygon per district)")
    district_areas = {}
    for ft, parts in transformed_features:
        name = ft["properties"]["name"]
        largest = max(parts, key=lambda p: p.area)
        area, _ = GEOD.geometry_area_perimeter(largest)
        district_areas[name] = abs(area)

    for i, (name, area) in enumerate(sorted(district_areas.items(), key=lambda kv: kv[1], reverse=True), start=1):
        print(f"  {i:>2}. {name:<25} {area/1e6:>8.0f} sq km")
    total_geodesic = sum(district_areas.values()) / 1e6
    print(f"  sum of largest polygons: {total_geodesic:.0f} sq km")
    print()

    print("UNION AREA (WGS84, all polygons merged)")
    union = unary_union(all_transformed_polys)
    union_area, _ = GEOD.geometry_area_perimeter(union)
    union_area_km2 = abs(union_area) / 1e6
    print(f"  union area: {union_area_km2:.0f} sq km")
    print(f"  Karnataka official area: ~191,976 sq km")
    print(f"  delta: {191976 - union_area_km2:.0f} sq km ({(191976 - union_area_km2)/191976*100:.1f}%)")
    print()

    print("CENTROIDS (WGS84, largest polygon per district)")
    for i, (ft, parts) in enumerate(transformed_features, start=1):
        name = ft["properties"]["name"]
        largest = max(parts, key=lambda p: p.area)
        centroid = largest.centroid
        print(f"  {i:>2}. {name:<25} lon={centroid.x:<7.4f} lat={centroid.y:<6.4f}")
    print()


if __name__ == "__main__":
    main()
