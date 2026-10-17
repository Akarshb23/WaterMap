"""Weights and metric aliases for the WaterMap composite index."""
WEIGHTS = {
    "groundwater_depth_mbgl": 0.30,
    "piped_water_supply_lpcd": 0.25,
    "tanker_dependency_index": 0.20,
    "rainfall_deficit_pct": 0.15,
    "water_body_coverage_pct": 0.10,
}
ALIASES = {
    "groundwater_depth_mbgl": ("groundwater_depth_mbgl", "groundwater_depth", "groundwater"),
    "piped_water_supply_lpcd": ("piped_water_supply_lpcd", "water_supply", "supply_lpcd"),
    "tanker_dependency_index": ("tanker_dependency_index", "tanker_dependency", "tanker"),
    "rainfall_deficit_pct": ("rainfall_deficit_pct", "rainfall_deficit", "rainfall_departure", "rainfall"),
    "water_body_coverage_pct": ("water_body_coverage_pct", "water_body_coverage", "lake_coverage", "surface_water"),
}
