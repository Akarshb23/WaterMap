import json
from pathlib import Path
from pyproj import CRS

raw = Path(__file__).parent.parent / "data" / "raw"
k = json.loads((raw / "karnataka_districts.geojson").read_text(encoding="utf-8"))

crs = CRS.from_epsg(7755)
print("CRS 7755 authoritative:", crs.to_epsg())
print("CRS 7755 axis info:")
for a in crs.axis_info:
    print("  ", a.name, a.abbrev, a.direction, "units:", getattr(a, "units", "n/a"))

crs_name = k["crs"]["properties"]["name"]
loaded = CRS.from_user_input(crs_name)
print("\nLoaded from file:", crs_name)
print("Loaded epsg:", loaded.to_epsg())
print("Loaded is_geographic?", loaded.is_geographic)

# Simple sanity: transform a known Karnataka centroid
from shapely.ops import transform as tg
from shapely.geometry import Point
from pyproj import Transformer

t = Transformer.from_crs(7755, 4326, always_xy=True)
pt7755 = Point(727000, 1505000)
pt4326 = tg(t.transform, pt7755)
print("\nSample transform 7755(727000,1505000) -> lng/lat:", round(pt4326.x,4), round(pt4326.y,4))
