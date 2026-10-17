/**
 * Forecast data hook placeholder.
 *
 * Returns a stable state shape so callers can be written against it; data
 * fetching is wired to `predictionService` later.
 */
export function usePredictions() {
  return {
    forecast: null,
    drivers: [],
    isLoading: false,
    error: null,
  }
}
