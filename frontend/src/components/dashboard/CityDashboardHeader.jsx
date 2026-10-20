import { useState } from 'react'
import { Calendar, ChevronDown } from 'lucide-react'
import cityscape from '../../assets/watermap-cityscape.png'
import { CITY_DASHBOARD_HEADER } from '../../data/bangaloreDashboardData.js'

/**
 * Header for City Dashboard featuring scenic river skyline background
 * and active date range filter dropdown.
 */
const CityDashboardHeader = ({
  dateRange = '12m',
  onDateRangeChange,
}) => {
  const [currentRange, setCurrentRange] = useState(dateRange)

  const handleChange = (e) => {
    const value = e.target.value
    setCurrentRange(value)
    onDateRangeChange?.(value)
  }

  return (
    <header className="city-dashboard-header">
      <div className="city-dashboard-header__intro">
        <h1 className="city-dashboard-header__title">{CITY_DASHBOARD_HEADER.title}</h1>
        <p className="city-dashboard-header__subtitle">{CITY_DASHBOARD_HEADER.subtitle}</p>
      </div>

      <div className="city-dashboard-header__banner" role="region" aria-label="City skyline banner">
        {/* Scenic photographic river and skyline background with left side completely blurred */}
        <div
          className="city-dashboard-header__backdrop"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(242, 250, 247, 1) 0%, rgba(242, 250, 247, 0.35) 25%, rgba(242, 250, 247, 0) 55%), url(${cityscape})`,
          }}
          aria-hidden="true"
        />
        <div className="city-dashboard-header__blur-veil" aria-hidden="true" />

        {/* Date Filter Card on Top Right */}
        <div className="city-dashboard-header__filter-wrap">
          <Calendar className="city-dashboard-header__calendar-icon" size={16} aria-hidden="true" />
          <select
            id="city-dashboard-date-range"
            className="native-select city-dashboard-header__select"
            value={currentRange}
            onChange={handleChange}
            aria-label="Filter timeline"
          >
            {CITY_DASHBOARD_HEADER.dateRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <ChevronDown className="city-dashboard-header__chevron" size={14} aria-hidden="true" />
        </div>
      </div>
    </header>
  )
}

export default CityDashboardHeader
