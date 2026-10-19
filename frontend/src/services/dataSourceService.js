import { apiGet, isApiMode } from './apiClient.js'
import {
  DATA_QUALITY_METRICS,
  DATA_SOURCES_SUMMARY_METRICS,
  DATA_SOURCES_TABLE_RECORDS,
  DATA_TRENDS_DATA,
  KEY_INDICATORS,
} from '../data/dataSourcesData.js'

export async function fetchDataSources({ signal } = {}) {
  if (!isApiMode()) return DATA_SOURCES_TABLE_RECORDS
  const data = await apiGet('/data-sources', { signal })
  return (Array.isArray(data) ? data : data.items ?? data.sources ?? []).map((item) => ({ ...item, id: item.id ?? item.source_id, name: item.name ?? item.source_id, title: item.title ?? item.name ?? item.source_id, type: item.type ?? 'dataset', typeKey: String(item.type ?? 'dataset').toLowerCase(), status: item.is_active === false ? 'inactive' : 'active', description: item.description ?? '', url: item.url ?? '', refreshInterval: item.refresh_interval_hours }))
}

export async function fetchDataSourceMetrics({ signal } = {}) {
  if (!isApiMode()) return DATA_SOURCES_SUMMARY_METRICS
  const sources = await fetchDataSources({ signal })
  return [{ id: 'source-count', label: 'Registered data sources', title: 'Registered data sources', value: sources.length, unit: '', status: 'available' }]
}

export async function fetchKeyIndicators({ signal } = {}) {
  if (!isApiMode()) return KEY_INDICATORS
  const data = await apiGet('/methodology', { signal })
  return data.indicators ?? data.weights ?? data.components ?? []
}

export async function fetchDataTrends(category = 'rainfall', { signal } = {}) {
  if (!isApiMode()) return DATA_TRENDS_DATA[category] || DATA_TRENDS_DATA.rainfall
  return [] // The current backend does not expose historical source trends.
}

export async function fetchDataQuality({ signal } = {}) {
  if (!isApiMode()) return DATA_QUALITY_METRICS
  const sources = await fetchDataSources({ signal })
  return [{ id: 'active-sources', label: 'Active sources', value: sources.filter((item) => item.is_active).length, status: 'available' }]
}
