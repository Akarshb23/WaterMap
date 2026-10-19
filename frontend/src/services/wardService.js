import { apiGet, isApiMode } from './apiClient.js'
import { MAP_WARDS } from '../data/demoData.js'

const normalizeWard = (ward) => ({ ...ward, id: ward.id ?? ward.ward_id, ward_id: ward.ward_id ?? ward.id, name: ward.name ?? ward.ward_id, zone: ward.zone ?? ward.district ?? 'Bengaluru Urban', zoneKey: String(ward.zone ?? ward.district ?? 'bengaluru').toLowerCase().replaceAll(' ', '-'), wsi: Number(ward.wsi ?? ward.water_stress_index ?? 0), risk: String(ward.risk ?? ward.risk_category ?? 'low').toLowerCase(), riskLabel: String(ward.riskLabel ?? ward.risk_category ?? 'low').replace(/^./, (letter) => letter.toUpperCase()), population: Number(ward.population ?? 0), rainfall: ward.rainfall ?? '—', demand: ward.demand ?? '—', groundwater: ward.groundwater ?? '—', x: ward.x ?? 50, y: ward.y ?? 50, shape: ward.shape ?? 1 })
import {
  WARD_DETAILS, WARD_KPIS, WARD_LAND_USE, WARD_LAND_USE_TOTAL,
  WARD_WATER_SOURCES, WARD_RISK_FACTORS, WARD_INSIGHTS, WSI_TREND,
  WARD_RECOMMENDATIONS, WARD_HISTORY, WARD_HISTORY_SUMMARY, WARD_RAW_DATA,
} from '../data/wardDetailsData.js'

export async function fetchWards({ signal, zone, risk, cityId = 'bengaluru' } = {}) {
  if (!isApiMode()) {
    return MAP_WARDS.filter((ward) => (!zone || zone === 'all' || ward.zoneKey === zone) && (!risk || risk === 'all' || ward.risk === risk))
  }
  const data = await apiGet('/wards', { params: { zone: zone === 'all' ? undefined : zone, risk_category: risk === 'all' ? undefined : risk, city_id: cityId }, signal })
  return (Array.isArray(data) ? data : data.items ?? data.wards ?? []).map(normalizeWard)
}

export async function fetchWardById(wardId, { signal } = {}) {
  if (!isApiMode()) {
    const numericId = String(wardId).replace(/^ward-/, '')
    const mapWard = MAP_WARDS.find((ward) => String(ward.id).replace(/^ward-/, '') === numericId) || MAP_WARDS[0]
    return {
      ...WARD_DETAILS,
      ...mapWard,
      id: numericId,
      name: mapWard.name || `Ward ${numericId}`,
      kpis: WARD_KPIS,
      landUse: WARD_LAND_USE,
      landUseTotal: WARD_LAND_USE_TOTAL,
      waterSources: WARD_WATER_SOURCES,
      riskFactors: WARD_RISK_FACTORS,
      insights: WARD_INSIGHTS,
      trend: WSI_TREND,
      recommendations: WARD_RECOMMENDATIONS,
      history: WARD_HISTORY,
      historySummary: WARD_HISTORY_SUMMARY,
      rawData: WARD_RAW_DATA,
    }
  }
  const ward = await apiGet(`/wards/${encodeURIComponent(wardId)}`, { signal })
  const normalized = normalizeWard(ward)
  const indicators = (ward.indicators ?? []).map((indicator) => ({ ...indicator, label: indicator.metric, value: indicator.value, unit: indicator.unit }))
  return { ...normalized, id: normalized.id, kpis: indicators, indicators, riskFactors: indicators, insights: [], trend: [], recommendations: [], history: [], historySummary: {}, rawData: indicators, landUse: [], waterSources: [] }
}
