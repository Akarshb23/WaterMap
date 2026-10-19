import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { useFilters } from '../../context/FilterContext.jsx'
import { useCity } from '../../context/CityContext.jsx'

const Topbar = () => {
  const location = useLocation()
  const { searchQuery, setSearchQuery } = useFilters()
  const { selectedCityId, setSelectedCityId } = useCity()

  const isDistrictView =
    location.pathname === '/dashboard' ||
    location.pathname === '/map'

  // Keep shared state consistent with the active view.
  useEffect(() => {
    if (isDistrictView && selectedCityId !== 'karnataka') {
      setSelectedCityId('karnataka')
    } else if (!isDistrictView && selectedCityId === 'karnataka') {
      setSelectedCityId('bengaluru')
    }
  }, [isDistrictView, selectedCityId, setSelectedCityId])

  const city = isDistrictView ? 'karnataka' : selectedCityId || 'bengaluru'

  const cityOptions = isDistrictView
    ? [{ label: 'Karnataka', value: 'karnataka' }]
    : [{ label: 'Bengaluru', value: 'bengaluru' }]

  return (
    <header className="topbar">
      <div className="topbar__left">
        <h1 className="topbar__title">WaterMap</h1>
      </div>

      <div className="topbar__search">
        <input
          type="search"
          placeholder="Search districts, wards, or metrics..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="search-bar"
          aria-label="Search districts, wards, or metrics"
        />
      </div>

      <div className="topbar__actions">
        <div className="topbar__city">
          <MapPin
            className="topbar__city-icon"
            size={16}
            aria-hidden="true"
          />

          <select
            id="city-select"
            className="native-select topbar__city-select"
            value={city}
            onChange={(event) => setSelectedCityId(event.target.value)}
            aria-label={isDistrictView ? 'Select state' : 'Select city'}
          >
            {cityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  )
}

export default Topbar
