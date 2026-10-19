# District metrics methodology and limitations

## Coverage

`district_metrics.csv` contains 155 records: five indicator families for each of the 31 district polygons in the current Karnataka boundary dataset. It is designed to make the district map and district details usable end-to-end; it does **not** mean that all five indicators are measured observations.

## Source-backed inputs

1. **Groundwater** — `CGWB_GWRA_2024`, from the Central Ground Water Board / Karnataka Ground Water Directorate *Dynamic Ground Water Resources of Karnataka 2024*, Annexure V (printed pages 75–76). The source provides the stage of groundwater extraction as a percentage. The normalized stress input is `min(1, stage_percent / 150)`. This is WaterMap's index transformation, not the CGWB's own category. Dates are set to `2024-03-31` to represent the 2024 assessment.
2. **Rainfall** — `KSNDMC_RAINFALL_2024`, the 2024 district annual rainfall dataset distributed by OpenCity. The raw value stores the reported total rainfall departure percentage. Normalized rainfall-deficit stress is `max(0, min(1, -departure_percent / 50))`; an annual rainfall surplus therefore gives zero deficit stress. Dates are `2024-12-31`.
3. **Bengaluru South boundary crosswalk** — the current boundary layer contains Bengaluru South, while the 2024 input datasets identify Ramanagara. The Ramanagara source value is used as a **proxy estimate** for Bengaluru South and is marked `is_verified=false`.

## Estimated indicator families

Piped supply, tanker reliance, and water-body stress are estimates because the project does not contain dependable, district-wide observed datasets for these indicators. The formulas are recorded in each CSV row's `normalization_method` field and use:

- `groundwater_stress`: normalized source-backed groundwater extraction stage;
- `rainfall_deficit_stress`: normalized 2024 rainfall departure;
- `district_urban_pressure_archetype`: a coarse WaterMap assumption for urban/service pressure, explicitly not a measured statistic;
- `regional_surface-water-stress proxy`: a coarse regional assumption, not a lake inventory or storage observation.

Formulas (values are clamped to [0, 1]):

- `piped_supply = 0.52 * groundwater_stress + 0.23 * rainfall_deficit_stress + 0.25 * urban_pressure`
- `tanker_reliance = 0.58 * groundwater_stress + 0.27 * rainfall_deficit_stress + 0.15 * urban_pressure`
- `water_bodies = 0.48 * groundwater_stress + 0.42 * rainfall_deficit_stress + 0.10 * regional_surface_water_stress_proxy`

These are deliberately provisional model estimates, **not observed water supply, tanker-trip, lake area, or storage-capacity values**. Their inclusion is a pragmatic demonstration fallback so all districts have a visible score. Replace them when suitable district-level source datasets become available.

## Index calculation

The backend combines the five normalized metric families using weights defined in `app/services/district_water_stress.py`: groundwater 0.30, rainfall 0.15, piped supply 0.25, tanker reliance 0.20, and water bodies 0.10. Available metric weights are re-normalized. The current complete dataset has all five families for every district. Because three families are model estimates, the combined district index is marked `estimated_model` and must not be represented as an official or verified score.

Risk bands are project presentation bands: critical >= 0.75, high >= 0.55, moderate >= 0.35, low otherwise. They are not official CGWB classifications. A model-generated band should be read as a **provisional planning signal**, not as a ground-truth risk assessment.

## Quality checks

- `is_verified=true` only for source-backed groundwater and rainfall records that map directly to the district boundary; this flag indicates source-backed input, not independent audit of the source.
- Model estimates use `is_verified=false`, `source_id=WATERMAP_ESTIMATE_V1`, and `data_quality=estimated_model` (or `estimated_proxy`). The backend accepts non-verified records only through this explicit estimate path.
- Raw source measurements and their units are retained in `raw_value` and `raw_unit`; normalized values and formulas are retained separately.
- Do not merge the project's older 25-row ward CSVs into district metrics; their granularity and provenance differ.
