import { Search } from 'lucide-react'
import {
  CITY_MAP_PERIOD_OPTIONS,
  CITY_MAP_VIEW_OPTIONS,
  CITY_MAP_ZONE_OPTIONS,
} from '../../data/cityMapData.js'

/** One labelled select inside the filter toolbar. */
const FilterSelect = ({ id, label, options, value, onChange }) => (
  <div className="city-map-filter">
    <label className="city-map-filter__label" htmlFor={id}>
      {label}
    </label>
    <select id={id} className="native-select" value={value} onChange={onChange}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
)

/**
 * Filter toolbar above the map: View, Time Period and Zone selects plus a
 * district/area search box. All values are controlled by the parent page, which
 * uses them to update the map overlays and the filtered district readout.
 */
const CityMapFilters = ({ filters, onChange }) => {
  const { view, period, zone, query } = filters

  const update = (field) => (event) => onChange({ ...filters, [field]: event.target.value })

  return (
    <section className="city-map-filters" aria-label="City map filters">
      <FilterSelect
        id="city-map-view-select"
        label="View"
        options={CITY_MAP_VIEW_OPTIONS}
        value={view}
        onChange={update('view')}
      />
      <FilterSelect
        id="city-map-period-select"
        label="Time Period"
        options={CITY_MAP_PERIOD_OPTIONS}
        value={period}
        onChange={update('period')}
      />
      <FilterSelect
        id="city-map-zone-select"
        label="Zone"
        options={CITY_MAP_ZONE_OPTIONS}
        value={zone}
        onChange={update('zone')}
      />

      <div className="city-map-filter">
        <label className="city-map-filter__label" htmlFor="city-map-district-search">
          Search
        </label>
        <div className="city-map-filter__search">
          <Search size={15} className="city-map-filter__search-icon" aria-hidden="true" />
          <input
            id="city-map-district-search"
            type="search"
            className="search-bar"
            placeholder="Search district or area..."
            value={query}
            onChange={update('query')}
          />
        </div>
      </div>
    </section>
  )
}

export default CityMapFilters
