import { createContext, useContext } from 'react'

/**
 * Shared filter context (risk level, search query, ...).
 *
 * Only the context object and its consumer hook are exported here; the
 * provider state is composed in `src/app/providers.jsx`. This split keeps the
 * module compatible with the ESLint `react-refresh/only-export-components`
 * rule, which forbids mixing component exports with context/hook exports.
 */
export const FilterContext = createContext(null)

export function useFilters() {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('useFilters must be used within the app providers (src/app/providers.jsx)')
  }
  return context
}
