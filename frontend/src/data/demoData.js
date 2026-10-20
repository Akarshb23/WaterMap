/**
 * Local demo data for the WaterMap dashboard (Bangalore).
 *
 * Everything here is illustrative sample data for the dashboard-only
 * implementation — no backend, API or GIS service is involved.
 */

/** Cities offered by the top-bar city selector. */
export const CITY_OPTIONS = [
  { value: 'bengaluru', label: 'Bangalore' },
  { value: 'bengaluru-urban', label: 'Bengaluru Urban' },
  { value: 'bengaluru-rural', label: 'Bengaluru Rural' },
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
    id: 'high-risk-districts',
    title: 'High Risk Districts',
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
    value: '13.6M',
    tone: 'green',
    trend: '2.3% vs last year',
    trendDirection: 'up',
    trendTone: 'positive',
    visual: {
      type: 'sparkline',
      color: '#45BD9B',
      data: [
        { label: 'A', value: 13.1 },
        { label: 'B', value: 13.15 },
        { label: 'C', value: 13.2 },
        { label: 'D', value: 13.26 },
        { label: 'E', value: 13.3 },
        { label: 'F', value: 13.34 },
        { label: 'G', value: 13.38 },
        { label: 'H', value: 13.42 },
        { label: 'I', value: 13.46 },
        { label: 'J', value: 13.6 },
      ],
    },
  },
]

/** Donut chart: district counts by water-stress risk band. */
export const RISK_DISTRIBUTION = [
  { name: 'High Risk', value: 12, percent: '29%', color: '#EF4444' },
  { name: 'Moderate Risk', value: 18, percent: '43%', color: '#FFCC59' },
  { name: 'Low Risk', value: 12, percent: '28%', color: '#45BD9B' },
]

export const RISK_DISTRIBUTION_TOTAL = { value: 42, label: 'Districts' }

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

/** Ranked highest-risk districts shown in the bottom table. */
export const TOP_HIGH_RISK_DISTRICTS = [
  { rank: 1, name: 'Koramangala', wsi: '0.87', population: '240,000', trend: '18%' },
  { rank: 2, name: 'Whitefield', wsi: '0.82', population: '198,000', trend: '11%' },
  { rank: 3, name: 'Indiranagar', wsi: '0.76', population: '175,000', trend: '9%' },
  { rank: 4, name: 'Electronic City', wsi: '0.73', population: '210,000', trend: '7%' },
  { rank: 5, name: 'Bellandur', wsi: '0.71', population: '190,000', trend: '6%' },
]

export const TOP_HIGH_RISK_WARDS = TOP_HIGH_RISK_DISTRICTS

/**
 * Recent alerts.
 */
export const RECENT_ALERTS = [
  {
    id: 'alert-stress-koramangala',
    icon: 'alert-triangle',
    tone: 'danger',
    title: 'High water stress in Koramangala',
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
    description: 'Demand increased by 12% in East Bangalore.',
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
    title: 'Pipe leakage reported in Malleshwaram',
    description: 'Approx. 6 MLD lost in 8th Main distribution line.',
    timestamp: '3 days ago',
  },
  {
    id: 'alert-tanker',
    icon: 'clock',
    tone: 'moderate',
    title: 'Tanker supply delays in Mahadevapura',
    description: 'Supply lag of 3 hours across 4 districts.',
    timestamp: '4 days ago',
  },
]

/** Map filter controls. */
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

export const MAP_DISTRICT_FILTER_OPTIONS = [
  { value: 'all', label: 'All Districts' },
  { value: 'high', label: 'High Risk Districts' },
  { value: 'moderate', label: 'Moderate Risk Districts' },
  { value: 'low', label: 'Low Risk Districts' },
]

export const MAP_WARD_FILTER_OPTIONS = MAP_DISTRICT_FILTER_OPTIONS

/** Region labels placed on the illustrative city map (percent coords). */
export const MAP_REGIONS = [
  { id: 'north-bangalore', label: 'North Bangalore', x: 45, y: 7 },
  { id: 'west-bangalore', label: 'West Bangalore', x: 12, y: 47 },
  { id: 'central-bangalore', label: 'Central Bangalore', x: 45, y: 47 },
  { id: 'east-bangalore', label: 'East Bangalore', x: 81, y: 49 },
  { id: 'south-bangalore', label: 'South Bangalore', x: 45, y: 85 },
]

/**
 * District tiles on the illustrative map.
 */
export const MAP_DISTRICTS = [
  {
    id: 'district-12',
    name: 'Koramangala',
    zone: 'Central Bangalore',
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
    id: 'district-8',
    name: 'Whitefield',
    zone: 'East Bangalore',
    zoneKey: 'east',
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
    id: 'district-21',
    name: 'Indiranagar',
    zone: 'Central Bangalore',
    zoneKey: 'central',
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
    id: 'district-4',
    name: 'Electronic City',
    zone: 'South Bangalore',
    zoneKey: 'south',
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
    id: 'district-17',
    name: 'Bellandur',
    zone: 'East Bangalore',
    zoneKey: 'east',
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
    id: 'district-5',
    name: 'Malleshwaram',
    zone: 'West Bangalore',
    zoneKey: 'west',
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
    id: 'district-9',
    name: 'KR Puram',
    zone: 'East Bangalore',
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
    id: 'district-30',
    name: 'Marathahalli',
    zone: 'East Bangalore',
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
    id: 'district-26',
    name: 'BTM Layout',
    zone: 'South Bangalore',
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
    id: 'district-2',
    name: 'Hebbal',
    zone: 'North Bangalore',
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
    id: 'district-33',
    name: 'Rajajinagar',
    zone: 'West Bangalore',
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
    id: 'district-38',
    name: 'Jayanagar',
    zone: 'South Bangalore',
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

export const MAP_WARDS = MAP_DISTRICTS

export const DEFAULT_MAP_DISTRICT_ID = 'district-12'
export const DEFAULT_MAP_WARD_ID = DEFAULT_MAP_DISTRICT_ID

/** Legend entries for the illustrative map. */
export const MAP_LEGEND = [
  { label: 'Low (0–0.3)', color: '#45BD9B' },
  { label: 'Moderate (0.3–0.6)', color: '#FFCC59' },
  { label: 'High (0.6–1.0)', color: '#EF4444' },
]

export const MAP_DISCLAIMER =
  'Illustrative map for demonstration only — not an actual GIS map.'

// ---------------------------------------------------------------------------
// Backward compatibility placeholders
// ---------------------------------------------------------------------------

export const demoCities = CITY_OPTIONS
export const demoDistricts = MAP_DISTRICTS
export const demoWards = MAP_DISTRICTS
export const demoAlerts = RECENT_ALERTS
export const demoForecasts = []

