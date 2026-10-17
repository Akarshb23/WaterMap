import { useEffect, useRef, useState } from 'react'
import { Bell, ChevronDown, MapPin, Menu, Search } from 'lucide-react'
import { CITY_OPTIONS, RECENT_ALERTS } from '../../data/demoData.js'

/**
 * Top navigation bar: mobile menu toggle, city selector, search field,
 * notifications popover and profile popover. All state is local — the
 * selectors only change what is displayed in this dashboard-only build.
 */
const Topbar = ({ onToggleSidebar, isSidebarOpen = false }) => {
  const [city, setCity] = useState('new-delhi')
  const [query, setQuery] = useState('')
  const [openMenu, setOpenMenu] = useState(null)
  const actionsRef = useRef(null)

  useEffect(() => {
    if (!openMenu) {
      return undefined
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenMenu(null)
      }
    }
    const handleClickOutside = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openMenu])

  const toggleMenu = (menu) => {
    setOpenMenu((current) => (current === menu ? null : menu))
  }

  return (
    <header className="topbar">
      <button
        type="button"
        className="topbar__menu"
        onClick={onToggleSidebar}
        aria-expanded={isSidebarOpen}
        aria-controls="app-sidebar"
        aria-label="Toggle navigation menu"
      >
        <Menu size={20} aria-hidden="true" />
      </button>

      <div className="topbar__city">
        <MapPin size={15} className="topbar__city-icon" aria-hidden="true" />
        <label className="sr-only" htmlFor="topbar-city-select">
          Select city
        </label>
        <select
          id="topbar-city-select"
          className="native-select topbar__city-select"
          value={city}
          onChange={(event) => setCity(event.target.value)}
        >
          {CITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="topbar__search">
        <Search size={15} className="topbar__search-icon" aria-hidden="true" />
        <label className="sr-only" htmlFor="topbar-search-input">
          Search wards and areas
        </label>
        <input
          id="topbar-search-input"
          type="search"
          className="search-bar"
          placeholder="Search wards, areas, landmarks..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="topbar__actions" ref={actionsRef}>
        <div className="topbar__bell">
          <button
            type="button"
            className="icon-btn"
            aria-expanded={openMenu === 'notifications'}
            aria-controls="topbar-notifications"
            aria-label={`Notifications, ${RECENT_ALERTS.length} alerts`}
            onClick={() => toggleMenu('notifications')}
          >
            <Bell size={17} aria-hidden="true" />
            <span className="topbar__bell-dot" aria-hidden="true" />
          </button>
          {openMenu === 'notifications' ? (
            <div className="topbar__popover" id="topbar-notifications">
              <p className="topbar__popover-title">Notifications</p>
              {RECENT_ALERTS.slice(0, 4).map((alert) => (
                <div className="topbar__popover-item" key={alert.id}>
                  <div>
                    <p className="topbar__popover-item-title">{alert.title}</p>
                    <p className="topbar__popover-item-text">{alert.description}</p>
                    <p className="topbar__popover-item-time">{alert.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <button
            type="button"
            className="topbar__profile"
            aria-expanded={openMenu === 'profile'}
            aria-controls="topbar-profile"
            onClick={() => toggleMenu('profile')}
          >
            <span className="topbar__avatar" aria-hidden="true">
              A
            </span>
            <span className="topbar__profile-name">Akarsh</span>
            <ChevronDown size={15} className="topbar__profile-chevron" aria-hidden="true" />
          </button>
          {openMenu === 'profile' ? (
            <div className="topbar__popover" id="topbar-profile">
              <p className="topbar__popover-title">Account</p>
              <div className="topbar__popover-item">
                <div>
                  <p className="topbar__popover-item-title">Akarsh</p>
                  <p className="topbar__popover-item-text">City Water Analyst</p>
                  <p className="topbar__popover-item-time">New Delhi</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}

export default Topbar
