/**
 * Demonstration data for the District Details page (Koramangala, Bangalore).
 *
 * Every value here is illustrative sample data for the prototype — it is
 * NOT live government, sensor or GIS data.
 */

/** The district rendered by the details page. */
export const DISTRICT_DETAILS = {
  id: 12,
  districtNumber: 12,
  wardNumber: 12,
  name: 'Koramangala',
  riskLabel: 'High Risk',
  zone: 'Central Bangalore',
  population: '240,000',
  area: '18.4 km²',
  wsi: 0.87,
  rainfall: '520 mm',
  demand: '124 MLD',
  groundwater: '-18.4 m',
}
export const WARD_DETAILS = DISTRICT_DETAILS

/**
 * KPI cards shown at the top of the Overview tab.
 */
export const DISTRICT_KPIS = [
  {
    id: 'water-stress',
    title: 'Water Stress Index',
    value: '0.87',
    progress: { percent: 87, label: 'Water stress index 0.87 out of 1' },
    change: '18% vs last year',
    changeDirection: 'up',
  },
  {
    id: 'population',
    title: 'Population',
    value: '240,000',
    icon: 'users',
    tone: 'green',
    change: '2.3% vs last year',
    changeDirection: 'up',
  },
  {
    id: 'rainfall',
    title: 'Annual Rainfall',
    value: '520',
    unit: 'mm',
    icon: 'cloud-rain',
    tone: 'blue',
    change: '14% vs last year',
    changeDirection: 'down',
  },
  {
    id: 'demand',
    title: 'Water Demand',
    value: '124',
    unit: 'MLD',
    icon: 'droplet',
    tone: 'blue',
    change: '12% vs last year',
    changeDirection: 'up',
  },
  {
    id: 'groundwater',
    title: 'Groundwater Level',
    value: '-18.4',
    unit: 'm',
    icon: 'gauge',
    tone: 'green',
    change: '1.6 m vs last year',
    changeDirection: 'down',
  },
]
export const WARD_KPIS = DISTRICT_KPIS

/** Donut chart: land-use composition of the district. */
export const DISTRICT_LAND_USE = [
  { name: 'Residential', value: 42, percent: '42%', color: '#2589E9' },
  { name: 'Commercial', value: 18, percent: '18%', color: '#45BD9B' },
  { name: 'Industrial', value: 12, percent: '12%', color: '#F59E0B' },
  { name: 'Green Space', value: 10, percent: '10%', color: '#0F9D6E' },
  { name: 'Other', value: 18, percent: '18%', color: '#94A3B8' },
]
export const WARD_LAND_USE = DISTRICT_LAND_USE

export const DISTRICT_LAND_USE_TOTAL = { value: '100%', label: 'Area' }
export const WARD_LAND_USE_TOTAL = DISTRICT_LAND_USE_TOTAL

/** Water supply mix. */
export const DISTRICT_WATER_SOURCES = [
  { id: 'groundwater', name: 'Groundwater', percent: 48 },
  { id: 'surface', name: 'Surface Water', percent: 32 },
  { id: 'recycled', name: 'Recycled Water', percent: 12 },
  { id: 'other', name: 'Other', percent: 8 },
]
export const WARD_WATER_SOURCES = DISTRICT_WATER_SOURCES

/**
 * Key risk factors driving the district's high-risk rating.
 */
export const DISTRICT_RISK_FACTORS = [
  {
    id: 'population-density',
    icon: 'users',
    tone: 'low',
    title: 'High population density',
    severity: 'High',
    severityTone: 'danger',
    weight: 25,
    description:
      'About 13,000 residents per km² concentrate demand on a compact supply network.',
  },
  {
    id: 'low-rainfall',
    icon: 'cloud-rain',
    tone: 'info',
    title: 'Low rainfall',
    severity: 'High',
    severityTone: 'danger',
    weight: 20,
    description:
      'Annual rainfall of 520 mm is roughly 24% below the city average of 680 mm.',
  },
  {
    id: 'increasing-demand',
    icon: 'trending-up',
    tone: 'warning',
    title: 'Increasing water demand',
    severity: 'High',
    severityTone: 'danger',
    weight: 25,
    description:
      'Demand has grown to 124 MLD and is expected to rise by a further 12% over five years.',
  },
  {
    id: 'groundwater-decline',
    icon: 'arrow-down',
    tone: 'moderate',
    title: 'Declining groundwater levels',
    severity: 'High',
    severityTone: 'danger',
    weight: 20,
    description:
      'The water table has dropped to about -18.4 m, falling 1.6 m in the last year alone.',
  },
  {
    id: 'impervious-surface',
    icon: 'grid',
    tone: 'warning',
    title: 'High impervious surface area',
    severity: 'Medium',
    severityTone: 'moderate',
    weight: 10,
    description:
      'Sealed roads and rooftops limit rainwater infiltration and natural groundwater recharge.',
  },
]
export const WARD_RISK_FACTORS = DISTRICT_RISK_FACTORS

/** Quick insight bullets for the Overview tab. */
export const DISTRICT_INSIGHTS = [
  { id: 'stress-rise', text: '18% increase in water stress over the last 3 years.' },
  { id: 'rainfall-gap', text: 'Rainfall is 24% below the city average.' },
  { id: 'groundwater-drop', text: 'Groundwater levels have declined by 1.6 m.' },
  { id: 'harvesting-potential', text: 'High potential for rainwater harvesting.' },
  { id: 'demand-outlook', text: 'Demand expected to rise by 12% in the next 5 years.' },
]
export const WARD_INSIGHTS = DISTRICT_INSIGHTS

/** Water Stress Index trend. */
export const WSI_TREND = [
  { year: '2020', value: 0.32 },
  { year: '2021', value: 0.51 },
  { year: '2022', value: 0.53 },
  { year: '2023', value: 0.7 },
  { year: '2024', value: 0.87 },
]

export const WSI_TREND_RANGE_OPTIONS = [
  { value: '5', label: 'Last 5 years' },
  { value: '3', label: 'Last 3 years' },
]

/** Recommended actions. */
export const DISTRICT_RECOMMENDATIONS = [
  {
    id: 'rainwater-harvesting',
    icon: 'droplets',
    tone: 'low',
    title: 'Implement rainwater harvesting',
    description: 'High potential for rooftop and community systems.',
    impact: 'High Impact',
    impactTone: 'danger',
  },
  {
    id: 'recycled-water',
    icon: 'recycle',
    tone: 'info',
    title: 'Increase use of recycled water',
    description: 'Utilize treated wastewater for non-potable uses.',
    impact: 'Medium Impact',
    impactTone: 'moderate',
  },
  {
    id: 'green-infrastructure',
    icon: 'leaf',
    tone: 'low',
    title: 'Enhance green infrastructure',
    description: 'Increase permeable surfaces and urban green cover.',
    impact: 'Medium Impact',
    impactTone: 'moderate',
  },
  {
    id: 'groundwater-monitoring',
    icon: 'gauge',
    tone: 'info',
    title: 'Expand groundwater monitoring',
    description: 'Add quarterly observation wells to track the falling water table.',
    impact: 'High Impact',
    impactTone: 'danger',
  },
  {
    id: 'demand-management',
    icon: 'ruler',
    tone: 'warning',
    title: 'Promote demand management',
    description: 'Tiered tariffs and awareness campaigns to curb per-capita use.',
    impact: 'Medium Impact',
    impactTone: 'moderate',
  },
]
export const WARD_RECOMMENDATIONS = DISTRICT_RECOMMENDATIONS

export const DISTRICT_FEATURED_ACTIONS = DISTRICT_RECOMMENDATIONS.slice(0, 3)
export const WARD_FEATURED_ACTIONS = DISTRICT_FEATURED_ACTIONS

/** Historical series for the Trends tab. */
export const DISTRICT_HISTORY = [
  { year: '2020', wsi: 0.32, rainfall: 610, groundwater: -14.0, demand: 96 },
  { year: '2021', wsi: 0.51, rainfall: 585, groundwater: -15.1, demand: 101 },
  { year: '2022', wsi: 0.53, rainfall: 640, groundwater: -16.0, demand: 106 },
  { year: '2023', wsi: 0.7, rainfall: 605, groundwater: -16.8, demand: 111 },
  { year: '2024', wsi: 0.87, rainfall: 520, groundwater: -18.4, demand: 124 },
]
export const WARD_HISTORY = DISTRICT_HISTORY

export const DISTRICT_HISTORY_SUMMARY = [
  { id: 'wsi', label: 'Water Stress Index', change: '0.32 → 0.87', note: '+172% since 2020', tone: 'danger' },
  { id: 'rainfall', label: 'Annual rainfall', change: '610 → 520 mm', note: '−15% since 2020', tone: 'info' },
  { id: 'groundwater', label: 'Groundwater level', change: '−14.0 → −18.4 m', note: '−4.4 m since 2020', tone: 'moderate' },
  { id: 'demand', label: 'Water demand', change: '96 → 124 MLD', note: '+29% since 2020', tone: 'moderate' },
]
export const WARD_HISTORY_SUMMARY = DISTRICT_HISTORY_SUMMARY

/** Raw data rows. */
export const DISTRICT_RAW_DATA = [
  { id: 'wsi', metric: 'Water Stress Index', value: '0.87', unit: 'index (0–1)', year: '2024' },
  { id: 'population', metric: 'Population', value: '240,000', unit: 'persons', year: '2024' },
  { id: 'density', metric: 'Population density', value: '13,043', unit: 'persons/km²', year: '2024' },
  { id: 'area', metric: 'Area', value: '18.4', unit: 'km²', year: '—' },
  { id: 'rainfall', metric: 'Annual rainfall', value: '520', unit: 'mm', year: '2024' },
  { id: 'demand', metric: 'Water demand', value: '124', unit: 'MLD', year: '2024' },
  { id: 'supply', metric: 'Per capita supply', value: null, unit: 'lpcd', year: '2024' },
  { id: 'groundwater', metric: 'Groundwater level', value: '-18.4', unit: 'm below ground', year: '2024' },
  { id: 'water-quality', metric: 'Water quality index', value: null, unit: 'index (0–100)', year: '2024' },
  { id: 'nrw', metric: 'Non-revenue water', value: '31', unit: '% of supply', year: '2023' },
]
export const WARD_RAW_DATA = DISTRICT_RAW_DATA

export const DEMO_DATA_NOTE =
  'Illustrative demonstration data — not live government or sensor readings.'
