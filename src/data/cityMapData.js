/**
 * Demonstration data for the Interactive City Map page.
 *
 * Every value here is illustrative sample data for the prototype — it is
 * NOT live government, sensor or GIS data. The ward roster is shared with
 * the dashboard's demo map (`demoData.js`).
 */
import { MAP_WARDS } from './demoData.js'

/** Filter toolbar options. */
export const CITY_MAP_VIEW_OPTIONS = [
  { value: 'wsi', label: 'Water Stress Index' },
  { value: 'rainfall', label: 'Annual Rainfall' },
  { value: 'demand', label: 'Water Demand' },
  { value: 'groundwater', label: 'Groundwater Level' },
]

export const CITY_MAP_PERIOD_OPTIONS = [
  { value: '2024', label: 'Latest (2024)' },
  { value: '2023', label: '2023' },
  { value: '2022', label: '2022' },
  { value: '2021', label: '2021' },
  { value: '2020', label: '2020' },
]

export const CITY_MAP_ZONE_OPTIONS = [
  { value: 'all', label: 'All Zones' },
  { value: 'north', label: 'North Delhi' },
  { value: 'south', label: 'South Delhi' },
  { value: 'east', label: 'East Delhi' },
  { value: 'west', label: 'West Delhi' },
  { value: 'central', label: 'Central Delhi' },
]

/** Ward roster used by the zone/search filters (shared demo wards). */
export const CITY_MAP_WARDS = MAP_WARDS

export const DEFAULT_PERIOD = '2024'

/**
 * Illustrative per-year metric values for the selected ward, used by the
 * "Current view" readout so the View and Time Period filters visibly change
 * the displayed information.
 */
export const WARD_METRIC_SERIES = {
  wsi: { unit: '', label: 'Water Stress Index', decimals: 2, values: { 2020: 0.42, 2021: 0.6, 2022: 0.61, 2023: 0.8, 2024: 0.87 } },
  rainfall: { unit: ' mm', label: 'Annual Rainfall', decimals: 0, values: { 2020: 610, 2021: 585, 2022: 640, 2023: 545, 2024: 520 } },
  demand: { unit: ' MLD', label: 'Water Demand', decimals: 0, values: { 2020: 104, 2021: 109, 2022: 113, 2023: 118, 2024: 124 } },
  groundwater: { unit: ' m', label: 'Groundwater Level', decimals: 1, values: { 2020: -14.2, 2021: -15.1, 2022: -16, 2023: -17.2, 2024: -18.4 } },
}

/** The ward shown in the right-hand detail panel (matches the reference). */
export const FEATURED_WARD = {
  name: 'Ward 12',
  zone: 'Central Delhi',
  riskLabel: 'High Risk',
  wsi: 0.87,
  population: '240,000',
  rainfall: '520 mm',
  demand: '124 MLD',
}

/** Water Stress Index trend (Overview tab chart). */
export const WSI_TREND = [
  { year: '2020', value: 0.42 },
  { year: '2021', value: 0.6 },
  { year: '2022', value: 0.61 },
  { year: '2023', value: 0.8 },
  { year: '2024', value: 0.87 },
]

export const WSI_TREND_RANGE_OPTIONS = [
  { value: '5', label: 'Last 5 years' },
  { value: '3', label: 'Last 3 years' },
]

/** Key insights shown under the Overview chart. */
export const WARD_INSIGHTS = [
  { id: 'wsi-rise', icon: 'trending-up', tone: 'danger', text: '18% increase in WSI in the last 3 years' },
  { id: 'rainfall', icon: 'cloud-rain', tone: 'info', text: 'Lower than average rainfall' },
  { id: 'demand', icon: 'droplets', tone: 'warning', text: 'High and growing water demand' },
  { id: 'groundwater', icon: 'trending-down', tone: 'moderate', text: 'Groundwater levels declining' },
]

/** Risk factors (Risk Factors tab). `weight` is an illustrative percent. */
export const WARD_RISK_FACTORS = [
  {
    id: 'low-rainfall',
    icon: 'cloud-rain',
    tone: 'info',
    title: 'Low annual rainfall',
    severity: 'High',
    severityTone: 'danger',
    weight: 25,
    description: 'Annual rainfall is 520 mm, about 15% below the city average of 612 mm.',
  },
  {
    id: 'high-demand',
    icon: 'droplets',
    tone: 'warning',
    title: 'High water demand',
    severity: 'High',
    severityTone: 'danger',
    weight: 30,
    description: 'Demand of 124 MLD has grown ~6% per year, outpacing supply additions.',
  },
  {
    id: 'groundwater',
    icon: 'arrow-down',
    tone: 'moderate',
    title: 'Groundwater depletion',
    severity: 'Moderate',
    severityTone: 'moderate',
    weight: 25,
    description: 'Water table has declined steadily, reaching about -18.4 m below ground level.',
  },
  {
    id: 'population',
    icon: 'users',
    tone: 'low',
    title: 'Population pressure',
    severity: 'Moderate',
    severityTone: 'moderate',
    weight: 20,
    description: 'A population of 240,000 concentrates demand in a compact service area.',
  },
]

/** Historical summary used by the Trends tab. */
export const WARD_HISTORY = [
  { year: '2020', wsi: 0.42, rainfall: 610 },
  { year: '2021', wsi: 0.6, rainfall: 585 },
  { year: '2022', wsi: 0.61, rainfall: 640 },
  { year: '2023', wsi: 0.8, rainfall: 545 },
  { year: '2024', wsi: 0.87, rainfall: 520 },
]

export const WARD_HISTORY_SUMMARY = [
  { id: 'wsi', label: 'Water Stress Index', change: '0.42 → 0.87', note: '+107% since 2020', tone: 'danger' },
  { id: 'rainfall', label: 'Annual rainfall', change: '610 → 520 mm', note: '−15% since 2020', tone: 'info' },
  { id: 'groundwater', label: 'Groundwater level', change: '−14.2 → −18.4 m', note: '−4.2 m since 2020', tone: 'moderate' },
]

/** Illustrative recommendations (Recommendations tab). */
export const WARD_RECOMMENDATIONS = [
  {
    id: 'rainwater-harvesting',
    icon: 'droplets',
    tone: 'low',
    title: 'Rainwater harvesting',
    priority: 'High',
    priorityTone: 'danger',
    description: 'Rooftop harvesting across public buildings could recharge up to 8 MLD seasonally.',
  },
  {
    id: 'groundwater-monitoring',
    icon: 'gauge',
    tone: 'info',
    title: 'Groundwater monitoring',
    priority: 'High',
    priorityTone: 'danger',
    description: 'Install quarterly monitoring wells to track the declining water table.',
  },
  {
    id: 'leak-detection',
    icon: 'wrench',
    tone: 'warning',
    title: 'Leak detection',
    priority: 'Medium',
    priorityTone: 'moderate',
    description: 'Non-revenue water audits in the distribution network can recover ~6 MLD.',
  },
  {
    id: 'demand-management',
    icon: 'ruler',
    tone: 'moderate',
    title: 'Demand management',
    priority: 'Medium',
    priorityTone: 'moderate',
    description: 'Tiered tariffs and public awareness campaigns to curb per-capita demand.',
  },
]

/** Legend entries for the (future) ward layer on the city map. */
export const CITY_MAP_LEGEND_ITEMS = [
  { label: 'Low (0 – 0.3)', color: '#45BD9B' },
  { label: 'Moderate (0.3 – 0.6)', color: '#FFCC59' },
  { label: 'High (0.6 – 1.0)', color: '#EF4444' },
]

/** Note displayed with the ward panel values. */
export const DEMO_DATA_NOTE =
  'Illustrative demonstration data — not live government or sensor readings.'
