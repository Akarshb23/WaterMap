import json
import time
from pathlib import Path
from pyproj import CRS, Transformer
from shapely.geometry import mapping, shape
from shapely.ops import transform as transform_geometry

# Import the normalization and helper functions from the map routes
import sys
sys.path.append(str(Path(__file__).parent))
from app.api.routes.map import _normalize_properties, _get_district_name, _get_state_name, _get_district_code, _get_source_crs, _transform_and_simplify_geometry, _load_district_boundaries

# Constants
DISTRICT_GEOJSON_PATH = Path(__file__).parent / "data" / "raw" / "karnataka_districts.geojson"
DISTRICT_SIMPLIFY_TOLERANCE_METRES = 100.0

def count_vertices(geom):
    """Count the number of vertices in a geometry (including exterior and interior rings)."""
    if geom.geom_type == 'Polygon':
        # Exterior ring
        count = len(list(geom.exterior.coords))
        # Interior rings
        for interior in geom.interiors:
            count += len(list(interior.coords))
        return count
    elif geom.geom_type == 'MultiPolygon':
        total = 0
        for polygon in geom.geoms:
            total += count_vertices(polygon)
        return total
    else:
        # For other geometries, just return the number of coordinates
        return len(list(geom.coords))

def main():
    # Load the original GeoJSON
    collection, _, _ = _load_district_boundaries(DISTRICT_GEOJSON_PATH)
    source_crs = _get_source_crs(collection)

    # We'll process each feature and collect the original and simplified geometries
    original_vertices = 0
    simplified_vertices = 0
    original_geoms = []
    simplified_geoms = []

    start_time = time.time()

    for original in collection["features"]:
        if not isinstance(original, dict):
            continue
        geometry_data = original.get("geometry")
        if not isinstance(geometry_data, dict):
            continue

        properties = _normalize_properties(original.get("properties") or {})
        state_name = _get_state_name(properties)
        if state_name not in {"karnataka", "ಕರ್ನಾಟಕ"}:
            continue

        district_name = _get_district_name(properties)
        if not district_name:
            continue

        # Process the geometry: simplify and transform
        try:
            processed_geometry = _transform_and_simplify_geometry(geometry_data, source_crs)
        except Exception as e:
            print(f"Skipping {district_name} due to error: {e}")
            continue

        # Convert the original geometry data to a shape object for vertex counting
        original_geom = shape(geometry_data)
        simplified_geom = shape(processed_geometry)

        original_vertices += count_vertices(original_geom)
        simplified_vertices += count_vertices(simplified_geom)

        original_geoms.append(original_geom)
        simplified_geoms.append(simplified_geom)

    processing_time = time.time() - start_time

    # Calculate the size of the original and simplified GeoJSON features
    # We'll create a simplified feature collection and measure its JSON string length
    simplified_features = []
    for i, original in enumerate(collection["features"]):
        if i >= len(simplified_geoms):
            break
        properties = _normalize_properties(original.get("properties") or {})
        state_name = _get_state_name(properties)
        if state_name not in {"karnataka", "ಕರ್ನಾಟಕ"}:
            continue

        district_name = _get_district_name(properties)
        if not district_name:
            continue

        simplified_features.append({
            "type": "Feature",
            "properties": {
                "district_name": district_name,
                # We can add more properties if needed, but for size comparison we keep it minimal
            },
            "geometry": mapping(simplified_geoms[i])
        })

    original_geojson_str = json.dumps(collection)
    simplified_geojson_str = json.dumps({
        "type": "FeatureCollection",
        "features": simplified_features
    })

    original_size = len(original_geojson_str.encode('utf-8'))
    simplified_size = len(simplified_geojson_str.encode('utf-8'))

    # Print the results
    print(f"Number of districts processed: {len(simplified_geoms)}")
    print(f"Original vertices: {original_vertices}")
    print(f"Simplified vertices: {simplified_vertices}")
    print(f"Vertex reduction: {original_vertices - simplified_vertices} ({((original_vertices - simplified_vertices) / original_vertices) * 100:.2f}%)")
    print(f"Original GeoJSON size: {original_size} bytes")
    print(f"Simplified GeoJSON size: {simplified_size} bytes")
    print(f"Size reduction: {original_size - simplified_size} bytes ({((original_size - simplified_size) / original_size) * 100:.2f}%)")
    print(f"Processing time: {processing_time:.3f} seconds")

    # Additionally, we can check the validity and other properties
    invalid_count = 0
    empty_count = 0
    for geom in simplified_geoms:
        if geom.is_empty:
            empty_count += 1
        if not geom.is_valid:
            invalid_count += 1
    print(f"Empty geometries after simplification: {empty_count}")
    print(f"Invalid geometries after simplification: {invalid_count}")

if __name__ == "__main__":
    main()