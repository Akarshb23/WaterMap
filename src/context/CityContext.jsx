import { createContext, useContext } from 'react'

/**
 * City selection context.
 *
 * Only the context object and its consumer hook are exported here; the
 * provider state is composed in `src/app/providers.jsx`. This split keeps the
 * module compatible with the ESLint `react-refresh/only-export-components`
 * rule, which forbids mixing component exports with context/hook exports.
 */
export const CityContext = createContext(null)

export function useCity() {
  const context = useContext(CityContext)
  if (!context) {
    throw new Error('useCity must be used within the app providers (src/app/providers.jsx)')
  }
  return context
}
