import {
  CUMULATIVE_IMPACT_PROJECTION,
  INTERVENTION_TYPE_IMPACT,
  RECOMMENDATION_METRICS,
  RECOMMENDATIONS_LIST,
  TOP_PRIORITY_WARDS_DATA,
} from '../data/recommendationsData.js'

/**
 * Recommendations data access service.
 * Returns local sample data formatted for dashboard consumption.
 */
export async function fetchRecommendations() {
  return RECOMMENDATIONS_LIST
}

export async function fetchRecommendationImpact() {
  return {
    cumulative: CUMULATIVE_IMPACT_PROJECTION,
    interventions: INTERVENTION_TYPE_IMPACT,
    topWards: TOP_PRIORITY_WARDS_DATA,
  }
}

export async function fetchRecommendationMetrics() {
  return RECOMMENDATION_METRICS
}
