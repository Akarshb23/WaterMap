import { apiGet, isApiMode } from './apiClient.js'
import {
  CUMULATIVE_IMPACT_PROJECTION,
  INTERVENTION_TYPE_IMPACT,
  RECOMMENDATION_METRICS,
  RECOMMENDATIONS_LIST,
  TOP_PRIORITY_WARDS_DATA,
} from '../data/recommendationsData.js'

export async function fetchRecommendations({ signal, category, priority, sortBy, cityId = 'bengaluru' } = {}) {
  if (!isApiMode()) return RECOMMENDATIONS_LIST
  const data = await apiGet('/recommendations', { params: { city_id: cityId }, signal })
  const rows = Array.isArray(data) ? data : data.results ?? data.items ?? data.recommendations ?? []
  return rows.map((item, index) => {
    const actionType = item.action_type ?? item.intervention_type ?? 'monitoring'
    const categoryMap = { groundwater_recharge: 'nature', leakage_reduction: 'infrastructure', demand_management: 'demand', rainwater_harvesting: 'nature', lake_restoration: 'nature', monitoring: 'policy' }
    const iconMap = { groundwater_recharge: 'Sprout', leakage_reduction: 'Wrench', demand_management: 'Users', rainwater_harvesting: 'CloudRain', lake_restoration: 'Sprout', monitoring: 'FileText' }
    const priority = typeof item.priority === 'number' ? (item.priority >= 3 ? 'high' : item.priority >= 2 ? 'medium' : 'low') : (item.priority ?? 'medium')
    const title = item.title ?? item.recommended_action ?? item.intervention_label ?? actionType.replaceAll('_', ' ')
    const rationale = item.rationale ?? item.description ?? 'The backend did not provide a rationale.'
    const wardId = item.ward_id ?? ''
    return {
      ...item,
      id: item.recommendation_id ?? item.id ?? `${wardId || 'city'}-${actionType}-${index}`,
      title, name: title, shortTitle: title, actionType,
      description: rationale, summary: rationale,
      category: item.category ?? categoryMap[actionType] ?? 'policy', priority,
      priorityLabel: `${priority[0].toUpperCase()}${priority.slice(1)} Priority`, badgeLabel: priority[0].toUpperCase() + priority.slice(1),
      scope: wardId || 'City-wide', targetWards: wardId || 'Not specified', targetWardIds: wardId ? [wardId] : [],
      implementationLevel: 'Not specified by backend', timeHorizon: 'Not specified by backend',
      estimatedCost: 'Not provided', potentialWsiReduction: 'Not estimated', annualWaterSavings: 'Not estimated',
      wsiReductionNum: 0, impactScore: Number(item.priority ?? 0), costNum: 0, savingsNum: 0,
      iconName: iconMap[actionType] ?? 'FileText', tone: priority === 'high' ? 'blue' : priority === 'medium' ? 'green' : 'purple',
      keyBenefits: [], overview: { description: rationale, targetSectors: [], leadAgency: 'Not specified by backend', keyObjective: title },
      expectedImpact: { headline: 'The backend does not currently estimate quantified impact for recommendations.', metrics: [] },
      wardIds: wardId ? [wardId] : [], wardId, riskCategory: item.risk_category, evidenceMetrics: item.evidence_metrics ?? [],
    }
  })
}

export async function fetchRecommendationImpact({ signal } = {}) {
  if (!isApiMode()) {
    return {
      cumulative: CUMULATIVE_IMPACT_PROJECTION,
      interventions: INTERVENTION_TYPE_IMPACT,
      topWards: TOP_PRIORITY_WARDS_DATA,
    }
  }
  return { cumulative: [], interventions: [], topWards: [] }
}

export async function fetchRecommendationMetrics({ signal, cityId = 'bengaluru' } = {}) {
  if (!isApiMode()) return RECOMMENDATION_METRICS
  const recommendations = await fetchRecommendations({ signal, cityId })
  return [{ id: 'recommended-actions', title: 'Recommended Actions', value: recommendations.length, unit: '', tone: 'green', note: 'Returned by backend rules' }, { id: 'priority-wards', title: 'Priority Wards', value: new Set(recommendations.flatMap((item) => item.wardIds ?? [])).size, unit: '', tone: 'blue', note: 'Distinct wards with actions' }, { id: 'potential-reduction', title: 'Potential WSI Reduction', value: '—', unit: '', tone: 'blue', note: 'Not provided by current endpoint' }, { id: 'investment', title: 'Estimated Investment', value: '—', unit: '', tone: 'green', note: 'Not provided by current endpoint' }]
}

export async function saveRecommendationPlan(payload, { signal } = {}) {
  if (!isApiMode()) return { ...payload, saved: true, demo: true }
  // Backend currently exposes recommendations as read-only; plan persistence is not implemented.
  return { ...payload, saved: false, unsupported: true, message: 'Plan persistence is not implemented by the backend yet.' }
}
