/**
 * Wards list hook placeholder.
 *
 * Returns a stable state shape so callers can be written against it; data
 * fetching is wired to `wardService` later.
 */
export function useWards() {
  return {
    wards: [],
    isLoading: false,
    error: null,
  }
}
