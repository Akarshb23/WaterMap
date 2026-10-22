import { Search } from 'lucide-react'

const VIEW_OPTIONS = [
  { value: 'wsi', label: 'Water Stress Index' },
  { value: 'rainfall', label: 'Annual Rainfall' },
  { value: 'demand', label: 'Water Demand' },
  { value: 'groundwater', label: 'Groundwater Level' },
]

const PERIOD_OPTIONS = [
  { value: '2024', label: 'Latest (2024)' },
  { value: '2023', label: '2023' },
  { value: '2022', label: '2022' },
  { value: '2021', label: '2021' },
  { value: '2020', label: '2020' },
]

const ZONE_OPTIONS = [
  { value: 'all', label: 'All Zones' },
  { value: 'north', label: 'North Zone' },
  { value: 'central', label: 'Central Zone' },
  { value: 'south', label: 'South Zone' },
  { value: 'west', label: 'West Zone' },
]

/**
 * Filter bar above the interactive city map matching Bangalore geography:
 * - 3 Selects on the left: View, Time Period, Zone
 * - Search bar on the right: Search district or area...
 */
const CityMapFilterBar = ({
  view = 'wsi',
  onViewChange,
  period = '2024',
  onPeriodChange,
  zone = 'all',
  onZoneChange,
  searchQuery = '',
  onSearchChange,
}) => {
  return (
    <section className="city-map-filter-bar" aria-label="Map filters">
      <div className="city-map-filter-bar__left">
        {/* View Select */}
        <div className="city-map-filter-group">
          <label htmlFor="city-map-view" className="city-map-filter-group__label">
            View
          </label>
          <div className="city-map-filter-group__select-wrap">
            <select
              id="city-map-view"
              className="native-select city-map-filter-group__select"
              value={view}
              onChange={(e) => onViewChange?.(e.target.value)}
            >
              {VIEW_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Time Period Select */}
        <div className="city-map-filter-group">
          <label htmlFor="city-map-period" className="city-map-filter-group__label">
            Time Period
          </label>
          <div className="city-map-filter-group__select-wrap">
            <select
              id="city-map-period"
              className="native-select city-map-filter-group__select"
              value={period}
              onChange={(e) => onPeriodChange?.(e.target.value)}
            >
              {PERIOD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Zone Select */}
        <div className="city-map-filter-group">
          <label htmlFor="city-map-zone" className="city-map-filter-group__label">
            Zone
          </label>
          <div className="city-map-filter-group__select-wrap">
            <select
              id="city-map-zone"
              className="native-select city-map-filter-group__select"
              value={zone}
              onChange={(e) => onZoneChange?.(e.target.value)}
            >
              {ZONE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Search Input on the Right */}
      <div className="city-map-filter-bar__right">
        <div className="city-map-search">
          <Search size={15} className="city-map-search__icon" aria-hidden="true" />
          <input
            id="city-map-search-input"
            type="search"
            className="city-map-search__input"
            placeholder="Search district or area..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            aria-label="Search district or area"
          />
        </div>
      </div>
    </section>
  )
}

export default CityMapFilterBar
