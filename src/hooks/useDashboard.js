/**
 * Dashboard data hook placeholder.
 *
 * Returns a stable state shape so callers can be written against it; data
 * fetching is wired to `dashboardService` later.
 */
export function useDashboard() {
  return {
    overview: null,
    metrics: [],
    isLoading: false,
    error: null,
  }
}
