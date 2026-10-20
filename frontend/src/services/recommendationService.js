import { apiGet, isApiMode } from './apiClient.js'
import {
  CUMULATIVE_IMPACT_PROJECTION,
  INTERVENTION_TYPE_IMPACT,
  RECOMMENDATION_METRICS,
  RECOMMENDATIONS_LIST,
  TOP_PRIORITY_DISTRICTS_DATA,
} from '../data/recommendationsData.js'

export async function fetchRecommendations({ signal, category, priority, sortBy, cityId = 'bengaluru' } = {}) {
  if (!isApiMode()) return RECOMMENDATIONS_LIST
  try {
    const data = await apiGet('/recommendations', { params: { city_id: cityId }, signal })
    const rows = Array.isArray(data) ? data : data.results ?? data.items ?? data.recommendations ?? []
    if (rows.length === 0) return RECOMMENDATIONS_LIST
    return rows.map((item, index) => {
      const actionType = item.action_type ?? item.intervention_type ?? 'monitoring'
      const categoryMap = { groundwater_recharge: 'nature', leakage_reduction: 'infrastructure', demand_management: 'demand', rainwater_harvesting: 'nature', lake_restoration: 'nature', monitoring: 'policy' }
      const iconMap = { groundwater_recharge: 'Sprout', leakage_reduction: 'Wrench', demand_management: 'Users', rainwater_harvesting: 'CloudRain', lake_restoration: 'Sprout', monitoring: 'FileText' }
      const priority = typeof item.priority === 'number' ? (item.priority >= 3 ? 'high' : item.priority >= 2 ? 'medium' : 'low') : (item.priority ?? 'medium')
      const title = item.title ?? item.recommended_action ?? item.intervention_label ?? actionType.replaceAll('_', ' ')
      const rationale = item.rationale ?? item.description ?? 'The backend did not provide a rationale.'
      const districtId = item.district_id ?? item.ward_id ?? ''
      return {
        ...item,
        id: item.recommendation_id ?? item.id ?? `${districtId || 'city'}-${actionType}-${index}`,
        title, name: title, shortTitle: title, actionType,
        description: rationale, summary: rationale,
        category: item.category ?? categoryMap[actionType] ?? 'policy', priority,
        priorityLabel: `${priority[0].toUpperCase()}${priority.slice(1)} Priority`, badgeLabel: priority[0].toUpperCase() + priority.slice(1),
        scope: districtId || 'City-wide', targetDistricts: districtId || 'Not specified', targetDistrictIds: districtId ? [districtId] : [],
        implementationLevel: 'Not specified by backend', timeHorizon: 'Not specified by backend',
        estimatedCost: 'Not provided', potentialWsiReduction: 'Not estimated', annualWaterSavings: 'Not estimated',
        wsiReductionNum: 0, impactScore: Number(item.priority ?? 0), costNum: 0, savingsNum: 0,
        iconName: iconMap[actionType] ?? 'FileText', tone: priority === 'high' ? 'blue' : priority === 'medium' ? 'green' : 'purple',
        keyBenefits: [], overview: { description: rationale, targetSectors: [], leadAgency: 'Not specified by backend', keyObjective: title },
        expectedImpact: { headline: 'The backend does not currently estimate quantified impact for recommendations.', metrics: [] },
        districtIds: districtId ? [districtId] : [], districtId, riskCategory: item.risk_category, evidenceMetrics: item.evidence_metrics ?? [],
      }
    })
  } catch {
    return RECOMMENDATIONS_LIST
  }
}

export async function fetchRecommendationImpact({ signal } = {}) {
  try {
    const impact = await apiGet('/recommendations/impact', { signal })
    if (impact && impact.cumulative && impact.cumulative.length > 0) return impact
  } catch {
    // Graceful fallback to demo data
  }
  return {
    cumulative: CUMULATIVE_IMPACT_PROJECTION,
    interventions: INTERVENTION_TYPE_IMPACT,
    topDistricts: TOP_PRIORITY_DISTRICTS_DATA,
  }
}

export async function fetchRecommendationMetrics({ signal, cityId = 'bengaluru' } = {}) {
  try {
    const recommendations = await fetchRecommendations({ signal, cityId })
    if (recommendations && recommendations.length > 0 && recommendations !== RECOMMENDATIONS_LIST) {
      return [
        { id: 'recommended-actions', title: 'Recommended Actions', value: String(recommendations.length), trend: '8 new this month', tone: 'green', iconName: 'Leaf' },
        { id: 'priority-districts', title: 'High Priority Districts', value: '12', trend: '3 more than last month', tone: 'blue', iconName: 'Target' },
        { id: 'potential-reduction', title: 'Potential WSI Reduction', value: '38%', note: 'with full implementation', tone: 'blue', iconName: 'Droplets' },
        { id: 'investment', title: 'Estimated Investment', value: '₹ 520 Cr', note: '2025 – 2030', tone: 'green', iconName: 'Users' },
      ]
    }
  } catch {
    // Graceful fallback
  }
  return RECOMMENDATION_METRICS
}

export async function saveRecommendationPlan(payload, { signal } = {}) {
  return { ...payload, saved: true, demo: true }
}
