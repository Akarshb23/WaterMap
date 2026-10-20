/**
 * Local demo data for the WaterMap dashboard.
 *
 * Everything here is illustrative sample data for the dashboard-only
 * implementation — no backend, API or GIS service is involved.
 */

/** Cities offered by the top-bar city selector. */
export const CITY_OPTIONS = [
  { value: 'new-delhi', label: 'New Delhi' },
  { value: 'mumbai', label: 'Mumbai' },
  { value: 'bengaluru', label: 'Bengaluru' },
  { value: 'chennai', label: 'Chennai' },
]

/** Date ranges offered by the dashboard date filter. */
export const DATE_RANGE_OPTIONS = [
  { value: '12m', label: 'Last 12 months' },
  { value: '6m', label: 'Last 6 months' },
  { value: '90d', label: 'Last 90 days' },
  { value: '30d', label: 'Last 30 days' },
]

/**
 * KPI metric cards. `icon` is supplied by the page (presentation),
 * while values and series live here.
 */
export const DASHBOARD_KPIS = [
  {
    id: 'water-stress',
    title: 'Avg. Water Stress Index',
    value: '0.68',
    tone: 'blue',
    trend: '12% vs last year',
    trendDirection: 'up',
    trendTone: 'negative',
    visual: {
      type: 'sparkline',
      color: '#2589E9',
      data: [
        { label: 'Q1', value: 0.58 },
        { label: 'Q2', value: 0.59 },
        { label: 'Q3', value: 0.61 },
        { label: 'Q4', value: 0.6 },
        { label: 'Q5', value: 0.63 },
        { label: 'Q6', value: 0.64 },
        { label: 'Q7', value: 0.65 },
        { label: 'Q8', value: 0.67 },
        { label: 'Q9', value: 0.68 },
      ],
    },
  },
  {
    id: 'high-risk-wards',
    title: 'High Risk Wards',
    value: '12',
    tone: 'red',
    note: 'of 42 total',
    visual: { type: 'progress', color: '#EF4444', percent: 28.6 },
  },
  {
    id: 'annual-rainfall',
    title: 'Annual Rainfall',
    value: '612',
    unit: 'mm',
    tone: 'blue',
    trend: '14% vs last year',
    trendDirection: 'up',
    trendTone: 'positive',
    visual: {
      type: 'bars',
      color: '#2589E9',
      data: [
        { label: 'Jan', value: 38 },
        { label: 'Feb', value: 24 },
        { label: 'Mar', value: 14 },
        { label: 'Apr', value: 10 },
        { label: 'May', value: 20 },
        { label: 'Jun', value: 58 },
        { label: 'Jul', value: 132 },
        { label: 'Aug', value: 168 },
        { label: 'Sep', value: 76 },
        { label: 'Oct', value: 30 },
        { label: 'Nov', value: 18 },
        { label: 'Dec', value: 24 },
      ],
    },
  },
  {
    id: 'population',
    title: 'Population',
    value: '12.5M',
    tone: 'green',
    trend: '2.3% vs last year',
    trendDirection: 'up',
    trendTone: 'positive',
    visual: {
      type: 'sparkline',
      color: '#45BD9B',
      data: [
        { label: 'A', value: 12.1 },
        { label: 'B', value: 12.15 },
        { label: 'C', value: 12.2 },
        { label: 'D', value: 12.26 },
        { label: 'E', value: 12.3 },
        { label: 'F', value: 12.34 },
        { label: 'G', value: 12.38 },
        { label: 'H', value: 12.42 },
        { label: 'I', value: 12.46 },
        { label: 'J', value: 12.5 },
      ],
    },
  },
]

/** Donut chart: ward counts by water-stress risk band. */
export const RISK_DISTRIBUTION = [
  { name: 'High Risk', value: 12, percent: '29%', color: '#EF4444' },
  { name: 'Moderate Risk', value: 18, percent: '43%', color: '#FFCC59' },
  { name: 'Low Risk', value: 12, percent: '28%', color: '#45BD9B' },
]

export const RISK_DISTRIBUTION_TOTAL = { value: 42, label: 'Wards' }

/** Monthly average water-stress index (WSI) across a calendar year. */
export const WATER_STRESS_TREND = [
  { month: 'Jan', value: 0.38 },
  { month: 'Feb', value: 0.37 },
  { month: 'Mar', value: 0.42 },
  { month: 'Apr', value: 0.40 },
  { month: 'May', value: 0.42 },
  { month: 'Jun', value: 0.48 },
  { month: 'Jul', value: 0.49 },
  { month: 'Aug', value: 0.53 },
  { month: 'Sep', value: 0.55 },
  { month: 'Oct', value: 0.52 },
  { month: 'Nov', value: 0.61 },
  { month: 'Dec', value: 0.62 },
]

export const TREND_RANGE_OPTIONS = [
  { value: '12', label: 'Last 12 months' },
  { value: '6', label: 'Last 6 months' },
  { value: '3', label: 'Last 3 months' },
]

/** Ranked highest-risk wards shown in the bottom table. */
export const TOP_HIGH_RISK_WARDS = [
  { rank: 1, name: 'Ward 12', wsi: '0.87', population: '240,000', trend: '18%' },
  { rank: 2, name: 'Ward 8', wsi: '0.82', population: '198,000', trend: '11%' },
  { rank: 3, name: 'Ward 21', wsi: '0.76', population: '175,000', trend: '9%' },
  { rank: 4, name: 'Ward 4', wsi: '0.73', population: '210,000', trend: '7%' },
  { rank: 5, name: 'Ward 17', wsi: '0.71', population: '190,000', trend: '6%' },
]

/**
 * Recent alerts. `icon` is a lucide icon key resolved by the component;
 * the first four are shown until the feed is expanded.
 */
export const RECENT_ALERTS = [
  {
    id: 'alert-stress-ward-12',
    icon: 'alert-triangle',
    tone: 'danger',
    title: 'High water stress in Ward 12',
    description: 'WSI increased by 18% in the last 3 months.',
    timestamp: '2 hours ago',
  },
  {
    id: 'alert-low-rainfall',
    icon: 'cloud-rain',
    tone: 'info',
    title: 'Lower than average rainfall',
    description: 'Monsoon rainfall is 24% below normal.',
    timestamp: '5 hours ago',
  },
  {
    id: 'alert-rising-demand',
    icon: 'trending-up',
    tone: 'warning',
    title: 'Rising water demand',
    description: 'Demand increased by 12% in East Delhi.',
    timestamp: '1 day ago',
  },
  {
    id: 'alert-groundwater',
    icon: 'arrow-down',
    tone: 'positive',
    title: 'Groundwater levels declining',
    description: 'Average decline of 1.2 m in 6 months.',
    timestamp: '2 days ago',
  },
  {
    id: 'alert-pipeline',
    icon: 'droplets',
    tone: 'info',
    title: 'Pipe leakage reported in Rohini',
    description: 'Approx. 6 MLD lost in Sector 7 distribution line.',
    timestamp: '3 days ago',
  },
  {
    id: 'alert-tanker',
    icon: 'clock',
    tone: 'moderate',
    title: 'Tanker supply delays in Shahdara',
    description: 'Supply lag of 3 hours across 4 wards.',
    timestamp: '4 days ago',
  },
]

/** Map filter controls (the dashboard map is illustrative, not GIS). */
export const MAP_METRIC_OPTIONS = [
  { value: 'wsi', label: 'Water Stress Index' },
  { value: 'groundwater', label: 'Groundwater Level' },
  { value: 'demand', label: 'Water Demand' },
  { value: 'supply', label: 'Per Capita Supply' },
]

export const MAP_ZONE_OPTIONS = [
  { value: 'all', label: 'All Zones' },
  { value: 'north', label: 'North Zone' },
  { value: 'west', label: 'West Zone' },
  { value: 'central', label: 'Central Zone' },
  { value: 'east', label: 'East Zone' },
  { value: 'south', label: 'South Zone' },
]

export const MAP_WARD_FILTER_OPTIONS = [
  { value: 'all', label: 'All Wards' },
  { value: 'high', label: 'High Risk Wards' },
  { value: 'moderate', label: 'Moderate Risk Wards' },
  { value: 'low', label: 'Low Risk Wards' },
]

/** Region labels placed on the illustrative city map (percent coords). */
export const MAP_REGIONS = [
  { id: 'rohini', label: 'Rohini', x: 15, y: 13 },
  { id: 'north-delhi', label: 'North Delhi', x: 45, y: 7 },
  { id: 'shahdara', label: 'Shahdara', x: 79, y: 15 },
  { id: 'west-delhi', label: 'West Delhi', x: 12, y: 47 },
  { id: 'central-delhi', label: 'Central Delhi', x: 45, y: 47 },
  { id: 'east-delhi', label: 'East Delhi', x: 81, y: 49 },
  { id: 'south-delhi', label: 'South Delhi', x: 45, y: 85 },
]

/**
 * Ward tiles on the illustrative map.
 * `x`/`y` mark the tile centre and `w`/`h` its size, all in percent of the
 * map canvas; `shape` picks one of the CSS polygon silhouettes in map.css.
 */
export const MAP_WARDS = [
  {
    id: 'ward-12',
    name: 'Ward 12',
    zone: 'Central Delhi',
    zoneKey: 'central',
    risk: 'high',
    riskLabel: 'High Risk',
    wsi: '0.87',
    population: '240,000',
    rainfall: '520 mm',
    demand: '124 MLD',
    groundwater: '-18.4 m',
    x: 44,
    y: 44,
    w: 14,
    h: 13,
    shape: 1,
  },
  {
    id: 'ward-8',
    name: 'Ward 8',
    zone: 'North Delhi',
    zoneKey: 'north',
    risk: 'high',
    riskLabel: 'High Risk',
    wsi: '0.82',
    population: '198,000',
    rainfall: '498 mm',
    demand: '108 MLD',
    groundwater: '-16.9 m',
    x: 36,
    y: 17,
    w: 13,
    h: 12,
    shape: 2,
  },
  {
    id: 'ward-21',
    name: 'Ward 21',
    zone: 'East Delhi',
    zoneKey: 'east',
    risk: 'high',
    riskLabel: 'High Risk',
    wsi: '0.76',
    population: '175,000',
    rainfall: '505 mm',
    demand: '96 MLD',
    groundwater: '-15.2 m',
    x: 73,
    y: 43,
    w: 13,
    h: 12,
    shape: 3,
  },
  {
    id: 'ward-4',
    name: 'Ward 4',
    zone: 'West Delhi',
    zoneKey: 'west',
    risk: 'high',
    riskLabel: 'High Risk',
    wsi: '0.73',
    population: '210,000',
    rainfall: '541 mm',
    demand: '112 MLD',
    groundwater: '-14.6 m',
    x: 17,
    y: 39,
    w: 13,
    h: 12,
    shape: 4,
  },
  {
    id: 'ward-17',
    name: 'Ward 17',
    zone: 'South Delhi',
    zoneKey: 'south',
    risk: 'high',
    riskLabel: 'High Risk',
    wsi: '0.71',
    population: '190,000',
    rainfall: '566 mm',
    demand: '101 MLD',
    groundwater: '-17.1 m',
    x: 47,
    y: 68,
    w: 13,
    h: 12,
    shape: 2,
  },
  {
    id: 'ward-5',
    name: 'Ward 5',
    zone: 'Rohini',
    zoneKey: 'north',
    risk: 'moderate',
    riskLabel: 'Moderate Risk',
    wsi: '0.54',
    population: '164,000',
    rainfall: '588 mm',
    demand: '78 MLD',
    groundwater: '-12.8 m',
    x: 15,
    y: 23,
    w: 13,
    h: 11,
    shape: 3,
  },
  {
    id: 'ward-9',
    name: 'Ward 9',
    zone: 'Shahdara',
    zoneKey: 'east',
    risk: 'moderate',
    riskLabel: 'Moderate Risk',
    wsi: '0.58',
    population: '152,000',
    rainfall: '512 mm',
    demand: '74 MLD',
    groundwater: '-13.4 m',
    x: 81,
    y: 25,
    w: 13,
    h: 11,
    shape: 1,
  },
  {
    id: 'ward-30',
    name: 'Ward 30',
    zone: 'East Delhi',
    zoneKey: 'east',
    risk: 'moderate',
    riskLabel: 'Moderate Risk',
    wsi: '0.47',
    population: '143,000',
    rainfall: '549 mm',
    demand: '69 MLD',
    groundwater: '-11.9 m',
    x: 79,
    y: 66,
    w: 13,
    h: 11,
    shape: 4,
  },
  {
    id: 'ward-26',
    name: 'Ward 26',
    zone: 'South Delhi',
    zoneKey: 'south',
    risk: 'moderate',
    riskLabel: 'Moderate Risk',
    wsi: '0.45',
    population: '137,000',
    rainfall: '601 mm',
    demand: '66 MLD',
    groundwater: '-12.2 m',
    x: 63,
    y: 83,
    w: 13,
    h: 11,
    shape: 2,
  },
  {
    id: 'ward-2',
    name: 'Ward 2',
    zone: 'North Delhi',
    zoneKey: 'north',
    risk: 'low',
    riskLabel: 'Low Risk',
    wsi: '0.26',
    population: '121,000',
    rainfall: '634 mm',
    demand: '54 MLD',
    groundwater: '-9.6 m',
    x: 63,
    y: 13,
    w: 12,
    h: 11,
    shape: 4,
  },
  {
    id: 'ward-33',
    name: 'Ward 33',
    zone: 'West Delhi',
    zoneKey: 'west',
    risk: 'low',
    riskLabel: 'Low Risk',
    wsi: '0.22',
    population: '118,000',
    rainfall: '658 mm',
    demand: '49 MLD',
    groundwater: '-8.8 m',
    x: 14,
    y: 65,
    w: 13,
    h: 11,
    shape: 1,
  },
  {
    id: 'ward-38',
    name: 'Ward 38',
    zone: 'South Delhi',
    zoneKey: 'south',
    risk: 'low',
    riskLabel: 'Low Risk',
    wsi: '0.18',
    population: '109,000',
    rainfall: '672 mm',
    demand: '44 MLD',
    groundwater: '-7.9 m',
    x: 30,
    y: 83,
    w: 13,
    h: 11,
    shape: 3,
  },
]

export const DEFAULT_MAP_WARD_ID = 'ward-12'

/** Legend entries for the illustrative map. */
export const MAP_LEGEND = [
  { label: 'Low (0–0.3)', color: '#45BD9B' },
  { label: 'Moderate (0.3–0.6)', color: '#FFCC59' },
  { label: 'High (0.6–1.0)', color: '#EF4444' },
]

export const MAP_DISCLAIMER =
  'Illustrative map for demonstration only — not an actual GIS map.'

// ---------------------------------------------------------------------------
// Legacy placeholders kept so earlier scaffolding imports stay valid.
// ---------------------------------------------------------------------------

export const demoCities = CITY_OPTIONS
export const demoWards = MAP_WARDS
export const demoAlerts = RECENT_ALERTS
export const demoForecasts = []
