/**
 * Scenario Simulation demo model — deterministic, transparent, illustrative.
 * Calibrated for Bangalore urban water resilience.
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
    districtEfficacy: 0.88,
    cityEfficacy: 0.36,
    demandEfficacy: 0.42,
    groundwaterGain: 6.6,
  },
  {
    id: 'recycled',
    label: 'Increase Recycled Water',
    description: 'Treated wastewater for non-potable uses',
    color: '#2589e9',
    districtEfficacy: 0.62,
    cityEfficacy: 0.24,
    demandEfficacy: 0.5,
    groundwaterGain: 4.2,
  },
  {
    id: 'demand',
    label: 'Demand Management',
    description: 'Reduce consumption through policies',
    color: '#fcc419',
    districtEfficacy: 0.55,
    cityEfficacy: 0.2,
    demandEfficacy: 0.65,
    groundwaterGain: 3,
  },
  {
    id: 'green',
    label: 'Green Infrastructure',
    description: 'Parks, permeable surfaces, urban green cover',
    color: '#9775fa',
    districtEfficacy: 0.45,
    cityEfficacy: 0.16,
    demandEfficacy: 0.3,
    groundwaterGain: 5.4,
  },
  {
    id: 'supply',
    label: 'New Water Supply',
    description: 'Additional surface/groundwater supply',
    color: '#7b93a8',
    districtEfficacy: 0.36,
    wardEfficacy: 0.36,
    cityEfficacy: 0.12,
    demandEfficacy: 0.55,
    groundwaterGain: 5,
  },
]

/** Target areas with their per-area adjustment (A) and baseline metrics. */
export const AREAS = [
  {
    id: 'koramangala',
    legacyId: 'district-12',
    label: 'Koramangala',
    areaFactor: 1,
    baseline: { wsi: 0.82, rainfall: 520, demand: 124, groundwater: -18.4 },
  },
  {
    id: 'central',
    label: 'Central Bangalore',
    areaFactor: 0.95,
    baseline: { wsi: 0.74, rainfall: 505, demand: 210, groundwater: -17.2 },
  },
  {
    id: 'east',
    label: 'East Bangalore',
    areaFactor: 0.9,
    baseline: { wsi: 0.71, rainfall: 540, demand: 190, groundwater: -16.5 },
  },
  {
    id: 'west',
    label: 'West Bangalore',
    areaFactor: 0.85,
    baseline: { wsi: 0.65, rainfall: 515, demand: 175, groundwater: -19.1 },
  },
  {
    id: 'north',
    label: 'North Bangalore',
    areaFactor: 0.8,
    baseline: { wsi: 0.6, rainfall: 530, demand: 150, groundwater: -15.8 },
  },
  {
    id: 'south',
    label: 'South Bangalore',
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
  area: 'koramangala',
  level: '50',
  horizon: '2030',
}

/**
 * Run the deterministic demonstration simulation for the given selections.
 */
export function runScenarioSimulation(input = DEFAULT_SIMULATION_INPUT) {
  const scenario = SCENARIOS.find((item) => item.id === input.scenario) ?? SCENARIOS[0]
  const area =
    AREAS.find((item) => item.id === input.area || item.legacyId === input.area) ?? AREAS[0]
  const level = LEVELS.find((item) => item.value === input.level) ?? LEVELS[1]
  const horizon = HORIZONS.find((item) => item.value === input.horizon) ?? HORIZONS[2]

  const levelFactor = Number(level.value) / 100
  const adjustment = levelFactor * area.areaFactor * horizon.factor

  const districtReduction = Math.min(0.9, Math.max(0, (scenario.districtEfficacy || scenario.wardEfficacy) * adjustment))
  const cityReduction = Math.min(0.6, Math.max(0, scenario.cityEfficacy * adjustment))

  const baseline = area.baseline
  const demandDrop = Math.min(
    baseline.demand,
    Math.round(baseline.demand * scenario.demandEfficacy * adjustment),
  )
  const groundwaterGain = round1(Math.min(8, scenario.groundwaterGain * adjustment))
  const simulatedWsi = clamp01(baseline.wsi * (1 - districtReduction))

  const districtReductionPct = Math.round(districtReduction * 100)
  const cityReductionPct = Math.round(cityReduction * 100)

  const resilience =
    districtReduction >= 0.4
      ? 'More resilient'
      : districtReduction >= 0.25
        ? 'More robust'
        : districtReduction >= 0.1
          ? 'Slightly improved'
          : 'Marginal gain'

  return {
    input: { scenario: scenario.id, area: area.id, level: level.value, horizon: horizon.value },
    scenario,
    area,
    level,
    horizon,
    adjustment,
    districtReduction,
    districtReductionPct,
    cityReduction,
    cityReductionPct,
    baseline: { ...baseline },
    simulated: {
      wsi: simulatedWsi,
      rainfall: baseline.rainfall,
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
const FORECAST_REFERENCE_SIMULATED = [0.28, 0.4, 0.42, 0.41, 0.4, 0.46]
const REFERENCE_DISTRICT_REDUCTION = 0.44

export function buildWsiForecastSeries(districtReduction) {
  const eff = typeof districtReduction === 'number' ? districtReduction : 0.44
  const scale = eff / REFERENCE_DISTRICT_REDUCTION
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

export function buildCitywideData(result, metric) {
  if (metric === 'demand') {
    const share = result.baseline.demand > 0 ? result.demandDrop / result.baseline.demand : 0
    return ZONE_DEMAND.map((item) => ({
      category: `${item.zone} Bangalore`,
      baseline: item.baseline,
      simulated: Math.max(0, Math.round(item.baseline * (1 - share))),
    }))
  }

  if (metric === 'groundwater') {
    return ZONE_GROUNDWATER.map((item) => ({
      category: `${item.zone} Bangalore`,
      baseline: item.baseline,
      simulated: round1(item.baseline + result.groundwaterGain),
    }))
  }

  // Water Stress Index view: distribution of districts across risk categories.
  const k = result.cityReductionPct / 18
  const high = Math.max(0, 29 - Math.round(9 * k))
  const moderate = Math.max(0, 43 - Math.round(5 * k))
  const low = Math.max(0, 100 - high - moderate)
  return [
    { category: 'Low Risk Districts', baseline: 28, simulated: low },
    { category: 'Moderate Risk Districts', baseline: 43, simulated: moderate },
    { category: 'High Risk Districts', baseline: 29, simulated: high },
  ]
}

/* --- Key takeaways -------------------------------------------------------- */

export function buildKeyTakeaways(result) {
  const k = result.cityReductionPct / 18
  const districtsMoved = Math.max(0, Math.min(15, Math.round(8 * k)))
  const groundwaterShare = Math.max(0, Math.min(100, Math.round(65 * k)))

  const items = [
    {
      id: 'districts',
      text:
        districtsMoved > 0
          ? `${districtsMoved} more district${districtsMoved === 1 ? '' : 's'} move to low risk category`
          : 'No districts shift risk category at this level',
    },
    {
      id: 'wsi',
      text:
        result.cityReductionPct > 0
          ? `Overall city WSI reduces by ${result.cityReductionPct}%`
          : 'Overall city WSI is essentially unchanged',
    },
    {
      id: 'groundwater',
      text:
        groundwaterShare > 0
          ? `Groundwater levels improve in ${groundwaterShare}% of districts`
          : 'No measurable groundwater improvement at this level',
    },
    {
      id: 'impact',
      text:
        k >= 0.5 && districtsMoved > 0
          ? 'Greatest impact in central and east Bangalore'
          : 'Impact remains limited at this implementation level',
    },
  ]

  return items
}