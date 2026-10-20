import { useMemo, useState } from 'react'
import { CityContext } from '../context/CityContext.jsx'
import { FilterContext } from '../context/FilterContext.jsx'

const Providers = ({ children }) => {
  const [selectedCityId, setSelectedCityId] = useState('bangalore')

  const [riskLevel, setRiskLevel] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const cityValue = useMemo(
    () => ({
      selectedCityId,
      setSelectedCityId,
    }),
    [selectedCityId],
  )

  const filterValue = useMemo(
    () => ({
      riskLevel,
      setRiskLevel,
      searchQuery,
      setSearchQuery,
    }),
    [riskLevel, searchQuery],
  )

  return (
    <CityContext.Provider value={cityValue}>
      <FilterContext.Provider value={filterValue}>
        {children}
      </FilterContext.Provider>
    </CityContext.Provider>
  )
}

export default Providers
