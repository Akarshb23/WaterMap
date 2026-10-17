/**
 * Recommendations hook placeholder.
 *
 * Returns a stable state shape so callers can be written against it; data
 * fetching is wired to `recommendationService` later.
 */
export function useRecommendations() {
  return {
    recommendations: [],
    isLoading: false,
    error: null,
  }
}
