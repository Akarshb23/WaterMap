import { apiGet, isApiMode } from './apiClient.js'
import { DASHBOARD_KPIS, RISK_DISTRIBUTION, RISK_DISTRIBUTION_TOTAL, WATER_STRESS_TREND, TOP_HIGH_RISK_WARDS, RECENT_ALERTS, MAP_WARDS, MAP_REGIONS } from '../data/demoData.js'
import { fetchWards } from './wardService.js'
import { fetchWardsGeoJSON } from './mapService.js'

const numberMetric = (id, title, value, unit = '', tone = 'blue', note = '') => ({ id, title, value, unit, tone, note })

export async function fetchDashboardOverview({ cityId = 'bengaluru', range = '12m', signal } = {}) {
  if (!isApiMode()) return { cityName: 'Bangalore', updatedAt: new Date().toISOString(), metrics: DASHBOARD_KPIS, riskDistribution: RISK_DISTRIBUTION, riskDistributionTotal: RISK_DISTRIBUTION_TOTAL, waterStressTrend: WATER_STRESS_TREND, highRiskWards: TOP_HIGH_RISK_WARDS, alerts: RECENT_ALERTS, mapWards: MAP_WARDS, mapRegions: MAP_REGIONS, source: 'mock' }
  const [summary, wards, geojson] = await Promise.all([
    apiGet('/dashboard', { params: { city_id: cityId, range }, signal }),
    fetchWards({ signal }),
    fetchWardsGeoJSON({ signal, cityId }),
  ])
  const avg = Number(summary.city_avg_stress_index ?? 0)
  const high = Number(summary.warning_wards ?? 0) + Number(summary.critical_wards ?? 0)
  const population = wards.reduce((sum, ward) => sum + Number(ward.population ?? 0), 0)
  const totalWards = wards.length
  const riskColors = { low: '#45BD9B', moderate: '#FFCC59', high: '#FF7B45', critical: '#EF4444' }
  const riskDistribution = Object.entries(summary.risk_distribution ?? {}).map(([name, value]) => ({ name: `${name[0].toUpperCase()}${name.slice(1)} Risk`, value: Number(value), percent: totalWards ? `${Math.round(Number(value) / totalWards * 100)}%` : '0%', color: riskColors[name] ?? '#94a3b8' }))
  const highRiskWards = (summary.top_critical_wards ?? []).map((ward) => ({ id: ward.ward_id, name: ward.name, wsi: Number(ward.water_stress_index), risk: ward.risk_category, population: Number(ward.population ?? 0), zone: ward.district ?? 'Bengaluru Urban' }))
  const metrics = [numberMetric('water-stress', 'Average Water Stress Index', avg.toFixed(2), '/ 1.0', avg >= .7 ? 'red' : avg >= .4 ? 'yellow' : 'green', 'Calculated from loaded district data'), numberMetric('high-risk-districts', 'At-risk Districts', high, '', high ? 'red' : 'green', `${summary.critical_wards ?? 0} critical`), numberMetric('annual-rainfall', 'District Records', wards.length, '', 'blue', 'Districts in current dataset'), numberMetric('population', 'Population Covered', population.toLocaleString('en-IN'), '', 'green', 'Sum of district population records')]
  const mapWards = (geojson.features ?? []).map((feature) => { const props = feature.properties ?? {}; const ward = wards.find((item) => String(item.id) === String(props.ward_id ?? feature.id)); return ward ?? { id: props.ward_id ?? feature.id, name: props.name ?? 'District', risk: props.risk_category ?? 'moderate', wsi: Number(props.water_stress_index ?? 0), zone: props.zone ?? props.district ?? 'Bengaluru Urban' } })
  return { cityName: 'Bangalore', updatedAt: summary.last_updated, metrics, riskDistribution, riskDistributionTotal: { value: wards.length, label: 'districts' }, waterStressTrend: [], highRiskWards, alerts: [], mapWards, mapRegions: [], geojson, source: 'api', methodology: 'Backend-calculated WSI. Historical trend and rainfall metrics are not available from the current API.' }
}

export async function fetchDashboardMetrics({ cityId = 'bengaluru', range = '12m', signal } = {}) {
  const overview = await fetchDashboardOverview({ cityId, range, signal })
  return overview.metrics ?? []
}
