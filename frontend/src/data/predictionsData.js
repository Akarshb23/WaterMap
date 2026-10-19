/**
 * Illustrative data for the Prediction & Analysis page.
 *
 * Everything here is planning-grade demo data — these are NOT verified live
 * forecasts, trained-model outputs or validated hydrological projections.
 * Replace the arrays with `predictionService` responses once a backend
 * exists; the shapes are deliberately kept chart-ready.
 */

export const PREDICTION_INFO =
  'Using historical data, climate trends and geospatial analysis to predict urban water stress.'

export const PREDICTION_DISCLAIMER =
  'Illustrative projections based on historical trends — not verified live forecasts.'

/** Years offered by the predicted stress map selector (default 2030). */
export const WSI_YEAR_OPTIONS = [
  { value: '2026', label: '2026' },
  { value: '2028', label: '2028' },
  { value: '2030', label: '2030' },
  { value: '2035', label: '2035' },
]

/**
 * KPI tiles for the top row. Icons are mapped in the page component so the
 * data module stays presentation-free (same convention as DASHBOARD_KPIS).
 */
export const PREDICTION_KPIS = [
  {
    id: 'current-wsi',
    title: 'Current WSI',
    value: '0.68',
    tone: 'blue',
    trend: '12% vs last year',
    trendTone: 'negative',
    visual: {
      type: 'sparkline',
      color: '#2589e9',
      data: [
        { label: '2019', value: 0.52 },
        { label: '2020', value: 0.55 },
        { label: '2021', value: 0.58 },
        { label: '2022', value: 0.61 },
        { label: '2023', value: 0.64 },
        { label: '2024', value: 0.66 },
        { label: 'Now', value: 0.68 },
      ],
    },
  },
  {
    id: 'predicted-wsi',
    title: 'Predicted WSI (2030)',
    value: '0.79',
    tone: 'red',
    trend: '16% vs 2024',
    trendTone: 'negative',
    visual: {
      type: 'sparkline',
      color: '#ef4444',
      data: [
        { label: '2024', value: 0.68 },
        { label: '2025', value: 0.7 },
        { label: '2026', value: 0.72 },
        { label: '2027', value: 0.74 },
        { label: '2028', value: 0.76 },
        { label: '2029', value: 0.78 },
        { label: '2030', value: 0.79 },
      ],
    },
  },
  {
    id: 'high-risk-wards',
    title: 'High Risk Wards (2030)',
    value: '12',
    tone: 'red',
    trend: '5 more than 2024',
    trendTone: 'negative',
    visual: {
      type: 'bars',
      color: '#ef4444',
      data: [
        { label: '2019', value: 5, color: '#2589e9' },
        { label: '2020', value: 6, color: '#2589e9' },
        { label: '2021', value: 7, color: '#2589e9' },
        { label: '2024', value: 7, color: '#ef4444' },
        { label: '2026', value: 9, color: '#ef4444' },
        { label: '2028', value: 11, color: '#ef4444' },
        { label: '2030', value: 12, color: '#ef4444' },
      ],
    },
  },
  {
    id: 'demand-increase',
    title: 'Increase in Water Demand',
    value: '24%',
    tone: 'green',
    trend: 'by 2030',
    visual: {
      type: 'sparkline',
      color: '#0f9d6e',
      data: [
        { label: '2024', value: 124 },
        { label: '2025', value: 128 },
        { label: '2026', value: 133 },
        { label: '2027', value: 138 },
        { label: '2028', value: 143 },
        { label: '2029', value: 149 },
        { label: '2030', value: 154 },
      ],
    },
  },
]

/** Ward selector options for the trend-comparison chart (`factor` scales WSI). */
export const TREND_WARD_OPTIONS = [
  { value: 'ward-4', label: 'Ward 4', factor: 0.88 },
  { value: 'ward-12', label: 'Ward 12', factor: 1 },
  { value: 'ward-19', label: 'Ward 19', factor: 1.13 },
  { value: 'ward-27', label: 'Ward 27', factor: 0.95 },
]

export const DEFAULT_TREND_WARD = 'ward-12'

export const TREND_YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]

/** Observed WSI, 2018–2024 (index-aligned with TREND_YEARS). */
export const WSI_HISTORICAL_SERIES = [0.42, 0.45, 0.47, 0.5, 0.55, 0.61, 0.68]

/** Projected WSI, 2024–2030; `null` before 2024 (index-aligned with TREND_YEARS). */
export const WSI_PREDICTED_SERIES = [null, null, null, null, null, null, 0.68, 0.7, 0.72, 0.74, 0.76, 0.78, 0.79]

/** City-wide water demand forecast in MLD (24% growth by 2030 vs 2024). */
export const DEMAND_FORECAST_SERIES = [
  { year: 2020, demand: 106 },
  { year: 2022, demand: 115 },
  { year: 2024, demand: 124 },
  { year: 2026, demand: 133 },
  { year: 2028, demand: 143 },
  { year: 2030, demand: 154 },
]

/** Monthly monsoon outlook vs the 10-year normal (mm) — sums to 520 mm. */
export const RAINFALL_FORECAST = [
  { month: 'Jun', rain: 72, normal: 65 },
  { month: 'Jul', rain: 146, normal: 135 },
  { month: 'Aug', rain: 164, normal: 155 },
  { month: 'Sep', rain: 98, normal: 92 },
  { month: 'Oct', rain: 40, normal: 33 },
]

/**
 * "Key Drivers" — each driver's illustrative share of the projected WSI
 * increase by 2030 (shares sum to 100).
 */
export const RISK_DRIVERS = [
  {
    id: 'population',
    label: 'Population growth',
    detail: '+2.4 M residents since 2018',
    share: 34,
    color: '#ef4444',
  },
  {
    id: 'groundwater',
    label: 'Groundwater depletion',
    detail: 'Levels falling ~1.1 m each year',
    share: 26,
    color: '#f59e0b',
  },
  {
    id: 'urban',
    label: 'Urban expansion',
    detail: 'Impervious cover up 12% since 2015',
    share: 18,
    color: '#2589e9',
  },
  {
    id: 'rainfall',
    label: 'Rainfall variability',
    detail: 'Erratic monsoon onset and breaks',
    share: 14,
    color: '#2589e9',
  },
  {
    id: 'pollution',
    label: 'Source pollution',
    detail: 'Reduced usable inflow in the Yamuna',
    share: 8,
    color: '#8aa6bf',
  },
]

/**
 * Scenario Analysis — projected 2030 WSI if each intervention is adopted
 * city-wide, versus the 0.79 baseline. `reduction` is the percent WSI drop.
 */
export const SCENARIO_OUTLOOK = [
  { id: 'rainwater', label: 'Rainwater harvesting', wsi: 0.7, reduction: 11 },
  { id: 'demand', label: 'Demand management', wsi: 0.66, reduction: 16 },
  { id: 'recycled', label: 'Recycled water', wsi: 0.73, reduction: 8 },
  { id: 'green', label: 'Green infrastructure', wsi: 0.74, reduction: 6 },
  { id: 'supply', label: 'New water supply', wsi: 0.71, reduction: 10 },
]

export const SCENARIO_BASELINE_WSI = 0.79

/** Rows for the Projected Results card. */
export const PROJECTED_RESULTS = [
  { id: 'wsi', label: 'Water Stress Index (2030)', value: '0.79', meta: '+0.11 vs 2024' },
  { id: 'wards', label: 'High-risk wards', value: '12', meta: 'of 42 wards' },
  { id: 'demand', label: 'Water demand', value: '154 MLD', meta: '+24% vs 2024' },
  { id: 'groundwater', label: 'Groundwater level', value: '−21.2 m', meta: 'falling ~1.1 m per year' },
  { id: 'rainfall', label: 'Monsoon rainfall', value: '520 mm', meta: '−6% vs 10-year normal' },
]