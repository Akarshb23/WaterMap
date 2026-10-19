# WaterMap data status

## District-level data

`district_metrics.csv` now contains five metric families for each of the 31 district boundary features (155 rows). Groundwater extraction-stage inputs come from CGWB/Ground Water Directorate GWRA 2024 Annexure V; rainfall inputs come from KSNDMC district rainfall for 2024 distributed through OpenCity. The CSV retains source values, units, normalization formulas, source URLs, and a quality label.

Three families (piped supply, tanker reliance, and water-body stress) are **explicitly model-estimated proxies**, not measured district-level facts. The Bengaluru South boundary uses Ramanagara 2024 source data as a proxy because that boundary name does not match the source-era district name. The combined WSI is therefore labelled `estimated_model`, not verified. Read `DISTRICT_METRICS_METHODOLOGY.md` before interpreting scores.

## Legacy ward data

The older `groundwater_levels.csv`, `rainfall_precipitation.csv`, `piped_water_supply.csv`, `tanker_water_demand.csv`, and `water_bodies_lakes.csv` files contain ward-keyed sample/demo records. They are not used to manufacture district observations and should not be described as official ward telemetry without independently validating their provenance.

## Important limitation

All districts now have a usable, provisional map score so the interface can be demonstrated end-to-end. This is not equivalent to verified district-by-district water-stress measurement. Replace estimated families with reliable observations before using the map for operational, policy, or public-risk decisions.
