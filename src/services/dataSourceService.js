import {
  DATA_QUALITY_METRICS,
  DATA_SOURCES_SUMMARY_METRICS,
  DATA_SOURCES_TABLE_RECORDS,
  DATA_TRENDS_DATA,
  KEY_INDICATORS,
} from '../data/dataSourcesData.js'

/**
 * Data source catalogue access service.
 * Returns local sample datasets formatted for dashboard consumption.
 */
export async function fetchDataSources() {
  return DATA_SOURCES_TABLE_RECORDS
}

export async function fetchDataSourceMetrics() {
  return DATA_SOURCES_SUMMARY_METRICS
}

export async function fetchKeyIndicators() {
  return KEY_INDICATORS
}

export async function fetchDataTrends(category = 'rainfall') {
  return DATA_TRENDS_DATA[category] || DATA_TRENDS_DATA.rainfall
}

export async function fetchDataQuality() {
  return DATA_QUALITY_METRICS
}
