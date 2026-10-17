/**
 * Scenario Simulation demo model — deterministic, transparent, illustrative.
 *
 * MODEL (documented formula — no randomness, no ML, no live sensors):
 *
 *   adjustment       adj = L × A × H
 *   ward WSI drop    r_w = clamp(W × adj, 0, 0.9)
 *   city WSI drop    r_c = clamp(C × adj, 0, 0.6)
 *
 *   L = implementation level factor  (0.25 / 0.5 / 0.75 / 1)
 *   A = target-area adjustment       (per area, 0.75 … 1)
 *   H = time-horizon factor          (0.7 / 0.85 / 1 / 1.15)
 *   W = intervention ward-level efficacy   (SCENARIOS[].wardEfficacy)
 *   C = intervention city-wide efficacy    (SCENARIOS[].cityEfficacy)
 *   d = demand-reduction efficacy          (SCENARIOS[].demandEfficacy)
 *   g = groundwater recovery in metres     (SCENARIOS[].groundwaterGain)
 *
 *   simulated WSI        = clamp(baseline_wsi × (1 − r_w), 0, 1)
 *   demand drop (MLD)    = baseline_demand × d × adj
 *   groundwater gain (m) = g × adj  (rounded to 0.1 m)
 *
 * The constants are calibrated so the DEFAULT selections (Rainwater
 * Harvesting · Ward 12 · Moderate (50%) · 2030) reproduce the reference
 * screen exactly:
 *   r_w  = 0.88 × 0.5 × 1 × 1 = 0.44      → "44% reduction"
 *   WSI   0.82 → 0.4592                    → displayed 0.46
 *   demand 124 × 0.42 × 0.5 = 26.04        → "26 MLD"
 *   groundw. −18.4 + (6.6 × 0.5) = −15.1   → "+3.3 m"
 *   r_c   = 0.36 × 0.5 = 0.18              → "18% city-wide" (and −18%
 *     for the Rainwater Harvesting effectiveness bar at the default run)
 *
 * ILLUSTRATIVE ONLY — not a validated water-resource forecast and not
 * produced by trained machine-learning models or real-time sensors.
 */

export const SIMULATION_INFO =
  'Simulate real-world interventions and compare their impact before implementation.'

export const SIMULATION_NOTE =
  'Illustrative simulation based on configurable assumptions; not a validated water-resource forecast.'

const clamp01 = (value) => Math.min(1, Math.max(0, value))
const round1 = (value) => Math.round(value * 10) / 10

/** Interventions. `color` drives the effectiveness bars; efficacy constants feed the model. */
export const SCENARIOS = [
  {
    id: 'rainwater',
    label: 'Rainwater Harvesting',
    description: 'Rooftop and community systems',
    color: '#12b886',
    wardEfficacy: 0.88,
    cityEfficacy: 0.36,
    demandEfficacy: 0.42,
    groundwaterGain: 6.6,
  },
  {
    id: 'recycled',
    label: 'Increase Recycled Water',
    description: 'Treated wastewater for non-potable uses',
    color: '#2589e9',
    wardEfficacy: 0.62,
    cityEfficacy: 0.24,
    demandEfficacy: 0.5,
    groundwaterGain: 4.2,
  },
  {
    id: 'demand',
    label: 'Demand Management',
    description: 'Reduce consumption through policies',
    color: '#fcc419',
    wardEfficacy: 0.55,
    cityEfficacy: 0.2,
    demandEfficacy: 0.65,
    groundwaterGain: 3,
  },
  {
    id: 'green',
    label: 'Green Infrastructure',
    description: 'Parks, permeable surfaces, urban green cover',
    color: '#9775fa',
    wardEfficacy: 0.45,
    cityEfficacy: 0.16,
    demandEfficacy: 0.3,
    groundwaterGain: 5.4,
  },
  {
    id: 'supply',
    label: 'New Water Supply',
    description: 'Additional surface/groundwater supply',
    color: '#7b93a8',
    wardEfficacy: 0.36,
    cityEfficacy: 0.12,
    demandEfficacy: 0.55,
    groundwaterGain: 5,
  },
]

/** Target areas with their per-area adjustment (A) and baseline metrics. */
export const AREAS = [
  {
    id: 'ward-12',
    label: 'Ward 12',
    areaFactor: 1,
    baseline: { wsi: 0.82, rainfall: 520, demand: 124, groundwater: -18.4 },
  },
  {
    id: 'central',
    label: 'Central Delhi',
    areaFactor: 0.95,
    baseline: { wsi: 0.74, rainfall: 505, demand: 210, groundwater: -17.2 },
  },
  {
    id: 'east',
    label: 'East Delhi',
    areaFactor: 0.9,
    baseline: { wsi: 0.71, rainfall: 540, demand: 190, groundwater: -16.5 },
  },
  {
    id: 'west',
    label: 'West Delhi',
    areaFactor: 0.85,
    baseline: { wsi: 0.65, rainfall: 515, demand: 175, groundwater: -19.1 },
  },
  {
    id: 'north',
    label: 'North Delhi',
    areaFactor: 0.8,
    baseline: { wsi: 0.6, rainfall: 530, demand: 150, groundwater: -15.8 },
  },
  {
    id: 'south',
    label: 'South Delhi',
    areaFactor: 0.75,
    baseline: { wsi: 0.55, rainfall: 495, demand: 140, groundwater: -20.3 },
  },
  {
    id: 'city',
    label: 'City Wide',
    areaFactor: 0.9,
    baseline: { wsi: 0.68, rainfall: 518, demand: 960, groundwater: -17.6 },
  },
]

/** Implementation levels — `value` is the percent implemented as a string. */
export const LEVELS = [
  { value: '25', label: 'Low (25%)' },
  { value: '50', label: 'Moderate (50%)' },
  { value: '75', label: 'High (75%)' },
  { value: '100', label: 'Very High (100%)' },
]

/** Time horizons with their maturity factor (H). */
export const HORIZONS = [
  { value: '2026', label: '2026', factor: 0.7 },
  { value: '2028', label: '2028', factor: 0.85 },
  { value: '2030', label: '2030', factor: 1 },
  { value: '2035', label: '2035', factor: 1.15 },
]

export const SCENARIO_SELECT_OPTIONS = SCENARIOS.map(({ id, label }) => ({ value: id, label }))
export const AREA_OPTIONS = AREAS.map(({ id, label }) => ({ value: id, label }))
export const LEVEL_OPTIONS = LEVELS.map(({ value, label }) => ({ value, label }))
export const HORIZON_OPTIONS = HORIZONS.map(({ value, label }) => ({ value, label }))

export const CITYWIDE_METRIC_OPTIONS = [
  { value: 'wsi', label: 'Water Stress Index' },
  { value: 'demand', label: 'Water Demand' },
  { value: 'groundwater', label: 'Groundwater Level' },
]

export const DEFAULT_SIMULATION_INPUT = {
  scenario: 'rainwater',
  area: 'ward-12',
  level: '50',
  horizon: '2030',
}

/**
 * Run the deterministic demonstration simulation for the given selections.
 * Always returns the same output for the same input.
 */
export function runScenarioSimulation(input = DEFAULT_SIMULATION_INPUT) {
  const scenario = SCENARIOS.find((item) => item.id === input.scenario) ?? SCENARIOS[0]
  const area = AREAS.find((item) => item.id === input.area) ?? AREAS[0]
  const level = LEVELS.find((item) => item.value === input.level) ?? LEVELS[1]
  const horizon = HORIZONS.find((item) => item.value === input.horizon) ?? HORIZONS[2]

  const levelFactor = Number(level.value) / 100
  const adjustment = levelFactor * area.areaFactor * horizon.factor

  const wardReduction = Math.min(0.9, Math.max(0, scenario.wardEfficacy * adjustment))
  const cityReduction = Math.min(0.6, Math.max(0, scenario.cityEfficacy * adjustment))

  const baseline = area.baseline
  const demandDrop = Math.min(
    baseline.demand,
    Math.round(baseline.demand * scenario.demandEfficacy * adjustment),
  )
  const groundwaterGain = round1(Math.min(8, scenario.groundwaterGain * adjustment))
  const simulatedWsi = clamp01(baseline.wsi * (1 - wardReduction))

  const wardReductionPct = Math.round(wardReduction * 100)
  const cityReductionPct = Math.round(cityReduction * 100)

  const resilience =
    wardReduction >= 0.4
      ? 'More resilient'
      : wardReduction >= 0.25
        ? 'More robust'
        : wardReduction >= 0.1
          ? 'Slightly improved'
          : 'Marginal gain'

  return {
    input: { scenario: scenario.id, area: area.id, level: level.value, horizon: horizon.value },
    scenario,
    area,
    level,
    horizon,
    adjustment,
    wardReduction,
    wardReductionPct,
    cityReduction,
    cityReductionPct,
    baseline: { ...baseline },
    simulated: {
      wsi: simulatedWsi,
      rainfall: baseline.rainfall, // context metric — unchanged by design
      demand: baseline.demand - demandDrop,
      groundwater: round1(baseline.groundwater + groundwaterGain),
    },
    demandDrop,
    groundwaterGain,
    resilience,
  }
}

/* --- Water Stress Index forecast series ---------------------------------- */

const FORECAST_YEARS = [2020, 2022, 2024, 2026, 2028, 2030]
const FORECAST_BASELINE = [0.48, 0.63, 0.68, 0.78, 0.85, 0.82]
/** Simulated series produced by the DEFAULT run (the reference screen). */
const FORECAST_REFERENCE_SIMULATED = [0.28, 0.4, 0.42, 0.41, 0.4, 0.46]
const REFERENCE_WARD_REDUCTION = 0.44 // r_w of the default run

/**
 * Baseline/simulated WSI forecast rows (2020 → 2030).
 * The reference simulated curve is anchored at the default run and scales
 * linearly with the current ward WSI reduction; r_w = 0 reproduces the
 * baseline, so the output stays deterministic and bounded in [0, 1].
 */
export function buildWsiForecastSeries(wardReduction) {
  const scale = wardReduction / REFERENCE_WARD_REDUCTION
  return FORECAST_YEARS.map((year, index) => {
    const baseline = FORECAST_BASELINE[index]
    const referenceShare = 1 - FORECAST_REFERENCE_SIMULATED[index] / baseline
    const factor = Math.max(0, 1 - referenceShare * scale)
    return { year, baseline, simulated: Math.min(1, Math.max(0, baseline * factor)) }
  })
}

/* --- City-wide comparison data ------------------------------------------- */

const ZONE_DEMAND = [
  { zone: 'Central', baseline: 250 },
  { zone: 'East', baseline: 195 },
  { zone: 'West', baseline: 175 },
  { zone: 'North', baseline: 165 },
  { zone: 'South', baseline: 175 },
]

const ZONE_GROUNDWATER = [
  { zone: 'Central', baseline: -17.2 },
  { zone: 'East', baseline: -16.5 },
  { zone: 'West', baseline: -19.1 },
  { zone: 'North', baseline: -15.8 },
  { zone: 'South', baseline: -20.3 },
]

/**
 * Grouped-bar dataset for the City-wide Comparison card.
 * `metric` is one of `wsi | demand | groundwater`; every view derives from
 * the last run so the chart updates when "Run Simulation" is clicked.
 * The default view (wsi, default run) matches the reference exactly:
 * Low 28→42, Moderate 43→38, High 29→20.
 */
export function buildCitywideData(result, metric) {
  if (metric === 'demand') {
    const share = result.baseline.demand > 0 ? result.demandDrop / result.baseline.demand : 0
    return ZONE_DEMAND.map((item) => ({
      category: `${item.zone} Delhi`,
      baseline: item.baseline,
      simulated: Math.max(0, Math.round(item.baseline * (1 - share))),
    }))
  }

  if (metric === 'groundwater') {
    return ZONE_GROUNDWATER.map((item) => ({
      category: `${item.zone} Delhi`,
      baseline: item.baseline,
      simulated: round1(item.baseline + result.groundwaterGain),
    }))
  }

  // Water Stress Index view: distribution of wards across risk categories.
  const k = result.cityReductionPct / 18 // 1 on the default run
  const high = Math.max(0, 29 - Math.round(9 * k))
  const moderate = Math.max(0, 43 - Math.round(5 * k))
  const low = Math.max(0, 100 - high - moderate)
  return [
    { category: 'Low Risk Wards', baseline: 28, simulated: low },
    { category: 'Moderate Risk Wards', baseline: 43, simulated: moderate },
    { category: 'High Risk Wards', baseline: 29, simulated: high },
  ]
}

/* --- Key takeaways -------------------------------------------------------- */

/**
 * Takeaway statements derived from the run (default run reproduces the
 * reference lines); claims are dropped or reworded when the new result
 * no longer supports them.
 */
export function buildKeyTakeaways(result) {
  const k = result.cityReductionPct / 18
  const wardsMoved = Math.max(0, Math.min(15, Math.round(8 * k)))
  const groundwaterShare = Math.max(0, Math.min(100, Math.round(65 * k)))

  const items = [
    {
      id: 'wards',
      text:
        wardsMoved > 0
          ? `${wardsMoved} more ward${wardsMoved === 1 ? '' : 's'} move to low risk category.`
          : 'No wards shift risk category at this level.',
    },
    {
      id: 'wsi',
      text:
        result.cityReductionPct > 0
          ? `Overall city WSI reduces by ${result.cityReductionPct}%.`
          : 'Overall city WSI is essentially unchanged.',
    },
    {
      id: 'groundwater',
      text:
        groundwaterShare > 0
          ? `Groundwater levels improve in ${groundwaterShare}% of wards.`
          : 'No measurable groundwater improvement at this level.',
    },
    {
      id: 'impact',
      text:
        k >= 0.5 && wardsMoved > 0
          ? 'Greatest impact in central and east Delhi.'
          : 'Impact remains limited at this implementation level.',
    },
  ]

  return items
}