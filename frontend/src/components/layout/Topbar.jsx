import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Bell,
  Check,
  ChevronDown,
  CloudRain,
  Database,
  Download,
  HelpCircle,
  LogOut,
  MapPin,
  Menu,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  User,
} from 'lucide-react'
import { useFilters } from '../../context/FilterContext.jsx'
import { useCity } from '../../context/CityContext.jsx'

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'alert',
    title: 'High Stress Alert: Koramangala',
    description: 'Composite WSI calculated at 0.87. Immediate rainwater harvesting & aquifer recharge prioritized.',
    time: '10m ago',
    unread: true,
  },
  {
    id: 'notif-2',
    type: 'success',
    title: 'Resilience Plan Updated',
    description: 'Rooftop and community rainwater harvesting system committed to Bangalore Urban roadmap.',
    time: '42m ago',
    unread: true,
  },
  {
    id: 'notif-3',
    type: 'info',
    title: 'Karnataka District Telemetry Sync',
    description: 'NWIC and IMD rainfall dataset synchronized with 42 city boundary zones.',
    time: '2h ago',
    unread: true,
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'Cauvery Basin Inflow Forecast',
    description: 'Monsoon simulation completed with +34% peak stormwater mitigation projection.',
    time: '1d ago',
    unread: false,
  },
]

const Topbar = ({ isSidebarOpen = false, onToggleSidebar }) => {
  const location = useLocation()
  const { searchQuery, setSearchQuery } = useFilters()
  const { selectedCityId, setSelectedCityId } = useCity()

  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS)
  const [toastMessage, setToastMessage] = useState(null)

  const notifRef = useRef(null)
  const profileRef = useRef(null)

  const unreadCount = notifications.filter((n) => n.unread).length

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsNotifOpen(false)
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
    showToast('All notifications marked as read')
  }

  const handleNotificationClick = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    )
  }

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
      selectedCityId !== 'bangalore'
    ) {
      setSelectedCityId('bangalore')
    }
  }, [location.pathname, selectedCityId, setSelectedCityId])

  const city = selectedCityId || 'bangalore'

  const cityOptions = [
    { label: 'Bangalore', value: 'bangalore' },
    { label: 'Bengaluru Urban', value: 'bengaluru-urban' },
    { label: 'Bengaluru Rural', value: 'bengaluru-rural' },
  ]

  return (
    <header className="topbar">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="topbar__toast" role="status" aria-live="polite">
          <Sparkles size={14} className="topbar__toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="topbar__left">
        {onToggleSidebar && (
          <button
            type="button"
            className="topbar__menu"
            onClick={onToggleSidebar}
            aria-label={isSidebarOpen ? 'Close navigation' : 'Open navigation'}
          >
            <Menu size={18} />
          </button>
        )}
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
              ? 'Search districts, indicators, methodology...'
              : location.pathname === '/city-map' || location.pathname === '/map'
              ? 'Search districts, areas, landmarks...'
              : 'Search districts, areas, indicators...'
          }
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="search-bar"
          aria-label={
            location.pathname === '/about'
              ? 'Search districts, indicators, methodology'
              : location.pathname === '/city-map' || location.pathname === '/map'
              ? 'Search districts, areas, landmarks'
              : 'Search districts, areas, indicators'
          }
        />
      </div>

      <div className="topbar__actions">
        {/* Functional Notification Button with popover */}
        <div className="topbar__action-wrapper" ref={notifRef}>
          <button
            type="button"
            className={`topbar__bell${isNotifOpen ? ' topbar__bell--active' : ''}`}
            onClick={() => {
              setIsNotifOpen((prev) => !prev)
              setIsProfileOpen(false)
            }}
            aria-label={`Notifications (${unreadCount} unread)`}
            aria-expanded={isNotifOpen}
            aria-haspopup="true"
          >
            <Bell size={19} className="topbar__bell-icon" />
            {unreadCount > 0 && <span className="topbar__bell-dot" />}
          </button>

          {isNotifOpen && (
            <div className="topbar__notifications-popover" role="dialog" aria-label="Notifications panel">
              <header className="topbar__notif-header">
                <div className="topbar__notif-title-wrap">
                  <span className="topbar__notif-title">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="topbar__notif-count-badge">{unreadCount} new</span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="topbar__notif-clear-btn"
                    onClick={handleMarkAllRead}
                  >
                    Mark all as read
                  </button>
                )}
              </header>

              <div className="topbar__notif-list" role="list">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    role="listitem"
                    className={`topbar__notif-item${n.unread ? ' topbar__notif-item--unread' : ''}`}
                    onClick={() => handleNotificationClick(n.id)}
                  >
                    <div className={`topbar__notif-icon-wrap topbar__notif-icon-wrap--${n.type}`}>
                      {n.type === 'alert' && <ShieldAlert size={14} />}
                      {n.type === 'success' && <CloudRain size={14} />}
                      {n.type === 'info' && <Database size={14} />}
                      {n.type === 'system' && <Check size={14} />}
                    </div>
                    <div className="topbar__notif-content">
                      <div className="topbar__notif-item-title">{n.title}</div>
                      <div className="topbar__notif-item-desc">{n.description}</div>
                      <span className="topbar__notif-item-time">{n.time}</span>
                    </div>
                    {n.unread && <span className="topbar__notif-unread-dot" />}
                  </div>
                ))}
              </div>

              <footer className="topbar__notif-footer">
                <button
                  type="button"
                  className="topbar__notif-view-all"
                  onClick={() => {
                    setIsNotifOpen(false)
                    showToast('All activity logs up to date')
                  }}
                >
                  View All Alert Logs
                </button>
              </footer>
            </div>
          )}
        </div>

        {/* Functional Profile Button with popover */}
        <div className="topbar__action-wrapper" ref={profileRef}>
          <button
            type="button"
            className={`topbar__profile${isProfileOpen ? ' topbar__profile--active' : ''}`}
            onClick={() => {
              setIsProfileOpen((prev) => !prev)
              setIsNotifOpen(false)
            }}
            aria-label="User profile Akarsh"
            aria-expanded={isProfileOpen}
            aria-haspopup="true"
          >
            <span className="topbar__avatar">A</span>
            <span className="topbar__profile-name">Akarsh</span>
            <ChevronDown
              size={14}
              className={`topbar__profile-chevron${isProfileOpen ? ' topbar__profile-chevron--open' : ''}`}
            />
          </button>

          {isProfileOpen && (
            <div className="topbar__profile-popover" role="dialog" aria-label="User profile menu">
              <div className="topbar__profile-header">
                <div className="topbar__profile-avatar-large">A</div>
                <div className="topbar__profile-info">
                  <div className="topbar__profile-user-name">Akarsh</div>
                  <div className="topbar__profile-user-role">City Water Planner • Admin</div>
                  <div className="topbar__profile-user-email">akarsh@watermap.org</div>
                </div>
              </div>

              <div className="topbar__profile-menu">
                <button
                  type="button"
                  className="topbar__profile-menu-item"
                  onClick={() => {
                    setIsProfileOpen(false)
                    showToast('Planner Profile: Bangalore Resilience Authority')
                  }}
                >
                  <User size={15} />
                  <span>Planner Profile</span>
                </button>

                <button
                  type="button"
                  className="topbar__profile-menu-item"
                  onClick={() => {
                    setIsProfileOpen(false)
                    showToast('City Preferences: Bangalore (Urban Core)')
                  }}
                >
                  <Settings size={15} />
                  <span>City & Model Preferences</span>
                </button>

                <button
                  type="button"
                  className="topbar__profile-menu-item"
                  onClick={() => {
                    setIsProfileOpen(false)
                    showToast('Exporting Bangalore Resilience Summary PDF...')
                  }}
                >
                  <Download size={15} />
                  <span>Export Resilience Report</span>
                </button>

                <button
                  type="button"
                  className="topbar__profile-menu-item"
                  onClick={() => {
                    setIsProfileOpen(false)
                    showToast('Opening WaterMap Platform Documentation')
                  }}
                >
                  <HelpCircle size={15} />
                  <span>Platform Documentation</span>
                </button>

                <div className="topbar__profile-divider" />

                <button
                  type="button"
                  className="topbar__profile-menu-item topbar__profile-menu-item--danger"
                  onClick={() => {
                    setIsProfileOpen(false)
                    showToast('Logged out of WaterMap session')
                  }}
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Topbar
