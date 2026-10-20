import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Bell, ChevronDown, MapPin, Search } from 'lucide-react'
import { useFilters } from '../../context/FilterContext.jsx'
import { useCity } from '../../context/CityContext.jsx'

const Topbar = () => {
  const location = useLocation()
  const { searchQuery, setSearchQuery } = useFilters()
  const { selectedCityId, setSelectedCityId } = useCity()

  const isDistrictView = false

  // Keep shared state consistent with the active view.
  useEffect(() => {
    if (
      (location.pathname === '/dashboard' ||
        location.pathname === '/map' ||
        location.pathname === '/city-map' ||
        location.pathname === '/predictions' ||
        location.pathname === '/simulation' ||
        location.pathname === '/about' ||
        location.pathname === '/recommendations' ||
        location.pathname === '/data-sources') &&
      selectedCityId !== 'new-delhi'
    ) {
      setSelectedCityId('new-delhi')
    }
  }, [location.pathname, selectedCityId, setSelectedCityId])

  const city = selectedCityId || 'new-delhi'

  const cityOptions = [
    { label: 'New Delhi', value: 'new-delhi' },
    { label: 'Bengaluru', value: 'bengaluru' },
    { label: 'Mumbai', value: 'mumbai' },
  ]

  return (
    <header className="topbar">
      <div className="topbar__left">
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

      <div className="topbar__search">
        <Search className="topbar__search-icon" size={16} aria-hidden="true" />
        <input
          type="search"
          placeholder={
            location.pathname === '/about'
              ? 'Search wards, indicators, methodology...'
              : location.pathname === '/city-map' || location.pathname === '/map'
              ? 'Search wards, areas, landmarks...'
              : 'Search wards, areas, indicators...'
          }
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="search-bar"
          aria-label={
            location.pathname === '/about'
              ? 'Search wards, indicators, methodology'
              : location.pathname === '/city-map' || location.pathname === '/map'
              ? 'Search wards, areas, landmarks'
              : 'Search wards, areas, indicators'
          }
        />
      </div>

      <div className="topbar__actions">
        <button
          type="button"
          className="topbar__bell"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="topbar__bell-dot" />
        </button>

        <div className="topbar__profile" tabIndex={0} role="button" aria-label="User profile Akarsh">
          <span className="topbar__avatar">A</span>
          <span className="topbar__profile-name">Akarsh</span>
          <ChevronDown size={14} className="topbar__profile-chevron" />
        </div>
      </div>
    </header>
  )
}

export default Topbar
