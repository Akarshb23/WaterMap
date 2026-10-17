import { useMemo, useState } from 'react'
import { CityContext } from '../context/CityContext.jsx'
import { FilterContext } from '../context/FilterContext.jsx'

/**
 * Application-wide providers.
 *
 * The context objects live in `src/context`; this module owns the provider
 * state and composes them around the app tree. Provider components are kept
 * local to this file because the ESLint react-refresh rule only allows a
 * module to export components, not components mixed with context objects.
 */
const Providers = ({ children }) => {
  const [selectedCityId, setSelectedCityId] = useState(null)
  const [riskLevel, setRiskLevel] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const cityValue = useMemo(
    () => ({ selectedCityId, setSelectedCityId }),
    [selectedCityId],
  )
  const filterValue = useMemo(
    () => ({ riskLevel, setRiskLevel, searchQuery, setSearchQuery }),
    [riskLevel, searchQuery],
  )

  return (
    <CityContext.Provider value={cityValue}>
      <FilterContext.Provider value={filterValue}>{children}</FilterContext.Provider>
    </CityContext.Provider>
  )
}

export default Providers
