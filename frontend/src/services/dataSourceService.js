import {
  DATA_QUALITY_METRICS,
  DATA_SOURCES_SUMMARY_METRICS,
  DATA_SOURCES_TABLE_RECORDS,
  DATA_TRENDS_DATA,
  KEY_INDICATORS,
} from '../data/dataSourcesData.js'

/**
 * Fetch all verified data sources.
 * Returns the high-fidelity catalogue of 8 primary data sources for Bangalore.
 */
export async function fetchDataSources() {
  return DATA_SOURCES_TABLE_RECORDS
}

/**
 * Fetch the 4 summary metrics for the top KPI row.
 */
export async function fetchDataSourceMetrics() {
  return DATA_SOURCES_SUMMARY_METRICS
}

/**
 * Fetch the 8 key indicators used in WaterMap analysis.
 */
export async function fetchKeyIndicators() {
  return KEY_INDICATORS
}

/**
 * Fetch historical data trends for the dual-axis chart.
 * Supports 'rainfall', 'groundwater', and 'waterDemand'.
 */
export async function fetchDataTrends(category = 'rainfall') {
  return DATA_TRENDS_DATA[category] || DATA_TRENDS_DATA.rainfall
}

/**
 * Fetch dataset completeness & quality assessment metrics.
 */
export async function fetchDataQuality() {
  return DATA_QUALITY_METRICS
}
