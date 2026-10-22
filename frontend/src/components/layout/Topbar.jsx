import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Bell,
  BellOff,
  Check,
  ChevronDown,
  CloudRain,
  Database,
  Download,
  LogIn,
  LogOut,
  MapPin,
  Menu,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  Trash2,
  User,
} from 'lucide-react'
import { useFilters } from '../../context/FilterContext.jsx'
import { useCity } from '../../context/CityContext.jsx'
import PlannerProfileModal from './modals/PlannerProfileModal.jsx'
import PreferencesModal from './modals/PreferencesModal.jsx'
import ExportReportModal from './modals/ExportReportModal.jsx'
import SignOutModal from './modals/SignOutModal.jsx'

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'alert',
    title: 'High Stress Alert: Koramangala',
    description: 'Composite WSI calculated at 0.87. Immediate rainwater harvesting & aquifer recharge prioritized.',
    time: '10m ago',
    unread: true,
    source: 'NWIC Hydrology Sensor BLR-04',
  },
  {
    id: 'notif-2',
    type: 'success',
    title: 'Resilience Plan Updated',
    description: 'Rooftop and community rainwater harvesting system committed to Karnataka roadmap.',
    time: '42m ago',
    unread: true,
    source: 'Karnataka Resilience Authority',
  },
  {
    id: 'notif-3',
    type: 'info',
    title: 'Karnataka District Telemetry Sync',
    description: 'NWIC and IMD rainfall dataset synchronized with 42 city boundary zones.',
    time: '2h ago',
    unread: true,
    source: 'IMD Doppler Radar Grid',
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'Cauvery Basin Inflow Forecast',
    description: 'Monsoon simulation completed with +34% peak stormwater mitigation projection.',
    time: '1d ago',
    unread: false,
    source: 'Simulation Engine CMIP6',
  },
  {
    id: 'notif-5',
    type: 'alert',
    title: 'Aquifer Depletion Alert: Whitefield',
    description: 'Observation piezometer reports groundwater level dropped 1.8m below seasonal mean.',
    time: '2d ago',
    unread: false,
    source: 'CGWB Piezometer Node 18',
  },
  {
    id: 'notif-6',
    type: 'info',
    title: 'Cauvery Stage V Flow Operational',
    description: '775 MLD pipeline flow telemetry successfully calibrated into municipal water model.',
    time: '3d ago',
    unread: false,
    source: 'BWSSB Bulk Meter SCADA',
  },
]

const Topbar = ({ isSidebarOpen = false, onToggleSidebar }) => {
  const location = useLocation()
  const { searchQuery, setSearchQuery } = useFilters()
  const { selectedCityId, setSelectedCityId } = useCity()

  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('watermap_notifications')
      return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS
    } catch {
      return DEFAULT_NOTIFICATIONS
    }
  })
  const [toastMessage, setToastMessage] = useState(null)

  // Profile Action Modals State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false)

  // User Profile / Auth State
  const [user, setUser] = useState(() => {
    try {
      const isGuest = localStorage.getItem('watermap_auth_state') === 'guest'
      const saved = localStorage.getItem('watermap_planner_profile')
      if (saved) {
        const p = JSON.parse(saved)
        return {
          name: isGuest ? 'Guest User' : p.name || 'Akarsh',
          fullName: isGuest ? 'Guest Municipal Viewer' : p.fullName || 'Akarsh B.',
          role: isGuest ? 'Public Observer Mode' : p.title || 'City Water Planner • Admin',
          email: isGuest ? 'guest@watermap.org' : p.email || 'akarsh@watermap.org',
          isGuest,
        }
      }
      return {
        name: isGuest ? 'Guest User' : 'Akarsh',
        fullName: isGuest ? 'Guest Municipal Viewer' : 'Akarsh B.',
        role: isGuest ? 'Public Observer Mode' : 'City Water Planner • Admin',
        email: isGuest ? 'guest@watermap.org' : 'akarsh@watermap.org',
        isGuest,
      }
    } catch {
      return {
        name: 'Akarsh',
        fullName: 'Akarsh B.',
        role: 'City Water Planner • Admin',
        email: 'akarsh@watermap.org',
        isGuest: false,
      }
    }
  })

  const notifRef = useRef(null)

  const unreadCount = notifications.filter((n) => n.unread).length

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsNotifOpen(false)
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
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, unread: false }))
      try {
        localStorage.setItem('watermap_notifications', JSON.stringify(updated))
      } catch {
        // storage fallback
      }
      return updated
    })
  }

  const handleNotificationClick = (id) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
      try {
        localStorage.setItem('watermap_notifications', JSON.stringify(updated))
      } catch {
        // storage fallback
      }
      return updated
    })
  }

  const handleRemoveNotification = (id) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id)
      try {
        localStorage.setItem('watermap_notifications', JSON.stringify(updated))
      } catch {
        // storage fallback
      }
      return updated
    })
  }

  const handleClearAllNotifications = () => {
    setNotifications([])
    try {
      localStorage.setItem('watermap_notifications', JSON.stringify([]))
    } catch {
      // storage fallback
    }
  }

  const handleRestoreDefaultNotifications = () => {
    setNotifications(DEFAULT_NOTIFICATIONS)
    try {
      localStorage.setItem('watermap_notifications', JSON.stringify(DEFAULT_NOTIFICATIONS))
    } catch {
      // storage fallback
    }
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
    { label: 'Karnataka', value: 'bangalore' },
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
                    Mark as read
                  </button>
                )}
              </header>

              <div className="topbar__notif-list" role="list">
                {notifications.length === 0 ? (
                  <div className="topbar__notif-empty">
                    <BellOff size={26} className="topbar__notif-empty-icon" />
                    <div className="topbar__notif-empty-title">All caught up!</div>
                    <div className="topbar__notif-empty-desc">No new alert logs or notifications.</div>
                  </div>
                ) : (
                  notifications.map((n) => (
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
                      <button
                        type="button"
                        className="topbar__notif-remove-btn"
                        title="Remove notification"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveNotification(n.id)
                        }}
                        aria-label={`Remove notification ${n.title}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile & Settings Modals */}
      <PlannerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSaveProfile={(newProfile) => {
          setUser((prev) => ({
            ...prev,
            name: newProfile.name || 'Akarsh',
            fullName: newProfile.fullName || 'Akarsh B.',
            role: newProfile.title || 'City Water Planner • Admin',
            email: newProfile.email || 'akarsh@watermap.org',
          }))
        }}
        onShowToast={showToast}
      />

      <PreferencesModal
        isOpen={isPreferencesModalOpen}
        onClose={() => setIsPreferencesModalOpen(false)}
        onShowToast={showToast}
      />

      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onShowToast={showToast}
      />

      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        userName={user.name}
        onConfirmSignOut={() => {
          localStorage.setItem('watermap_auth_state', 'guest')
          setUser({
            name: 'Guest User',
            fullName: 'Guest Municipal Viewer',
            role: 'Public Observer Mode',
            email: 'guest@watermap.org',
            isGuest: true,
          })
          showToast('Signed out of WaterMap (Guest Mode active)')
        }}
      />
    </header>
  )
}

export default Topbar
