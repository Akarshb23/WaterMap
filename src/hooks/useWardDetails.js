/**
 * Single ward details hook placeholder.
 *
 * Returns a stable state shape so callers can be written against it; data
 * fetching is wired to `wardService` later.
 */
export function useWardDetails(wardId) {
  return {
    wardId,
    ward: null,
    isLoading: false,
    error: null,
  }
}
