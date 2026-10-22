import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronDown, Check } from 'lucide-react'
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
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const activeLabel =
    CITY_DASHBOARD_HEADER.dateRanges.find((r) => r.value === currentRange)?.label ||
    'Last 30 days'

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (val) => {
    setCurrentRange(val)
    setIsOpen(false)
    onDateRangeChange?.(val)
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
        <div className="city-dashboard-header__filter-wrap" ref={dropdownRef}>
          <button
            type="button"
            className="city-dashboard-header__filter-btn"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-label={`Filter timeline: currently ${activeLabel}`}
          >
            <Calendar className="city-dashboard-header__calendar-icon" size={16} aria-hidden="true" />
            <span className="city-dashboard-header__filter-label">{activeLabel}</span>
            <ChevronDown
              className={`city-dashboard-header__chevron ${isOpen ? 'city-dashboard-header__chevron--open' : ''}`}
              size={14}
              aria-hidden="true"
            />
          </button>

          {/* Custom Dropdown Menu */}
          {isOpen && (
            <div className="city-dashboard-header__dropdown-menu" role="listbox">
              {CITY_DASHBOARD_HEADER.dateRanges.map((range) => {
                const isSelected = range.value === currentRange
                return (
                  <button
                    key={range.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`city-dashboard-header__dropdown-item ${
                      isSelected ? 'city-dashboard-header__dropdown-item--active' : ''
                    }`}
                    onClick={() => handleSelect(range.value)}
                  >
                    <span>{range.label}</span>
                    {isSelected && <Check size={14} className="city-dashboard-header__check-icon" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default CityDashboardHeader
