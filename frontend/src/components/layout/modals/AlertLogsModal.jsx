import { useState, useMemo } from 'react'
import {
  Bell,
  Trash2,
  Check,
  Search,
  Filter,
  ShieldAlert,
  CloudRain,
  Database,
  CheckCircle2,
  Clock,
  RotateCcw,
  X,
  BellOff,
  Layers,
  Sparkles,
} from 'lucide-react'

const AlertLogsModal = ({
  isOpen,
  onClose,
  notifications = [],
  onRemoveNotification,
  onClearAll,
  onMarkAllRead,
  onRestoreDefaults,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all') // 'all' | 'alert' | 'success' | 'info' | 'system'
  const [selectedIds, setSelectedIds] = useState([])

  // Filter logs by tab and search
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchesType = filterType === 'all' || n.type === filterType
      const query = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !query ||
        n.title.toLowerCase().includes(query) ||
        n.description.toLowerCase().includes(query) ||
        (n.source && n.source.toLowerCase().includes(query)) ||
        (n.time && n.time.toLowerCase().includes(query))
      return matchesType && matchesSearch
    })
  }, [notifications, filterType, searchQuery])

  if (!isOpen) return null

  const unreadCount = notifications.filter((n) => n.unread).length

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredNotifications.map((n) => n.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return
    selectedIds.forEach((id) => {
      onRemoveNotification(id)
    })
    onShowToast?.(`Deleted ${selectedIds.length} notification log${selectedIds.length > 1 ? 's' : ''}`)
    setSelectedIds([])
  }

  const handleDeleteSingle = (id, title) => {
    onRemoveNotification(id)
    setSelectedIds((prev) => prev.filter((item) => item !== id))
    onShowToast?.(`Removed log: "${title.slice(0, 24)}..."`)
  }

  return (
    <div className="wm-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="wm-modal wm-logs-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="logs-modal-title"
      >
        <header className="wm-modal__header">
          <div className="wm-modal__title-wrap">
            <div className="wm-modal__title-icon wm-modal__title-icon--emerald">
              <Bell size={18} />
            </div>
            <div>
              <div className="wm-logs-title-row">
                <h2 id="logs-modal-title" className="wm-modal__title">
                  Activity & Alert Logs
                </h2>
                <span className="wm-logs-count-badge">
                  {notifications.length} {notifications.length === 1 ? 'Event' : 'Events'}
                </span>
                {unreadCount > 0 && (
                  <span className="wm-logs-unread-badge">{unreadCount} New</span>
                )}
              </div>
              <span className="wm-modal__subtitle">
                Historical Municipal Telemetry Ingestion & Real-Time Alert Events
              </span>
            </div>
          </div>
          <button
            type="button"
            className="wm-modal__close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </header>

        {/* Toolbar: Search, Filters, & Batch Actions */}
        <div className="wm-logs-toolbar">
          <div className="wm-logs-toolbar__search-row">
            <div className="wm-logs-search">
              <Search size={15} className="wm-logs-search-icon" />
              <input
                type="search"
                placeholder="Search across alert logs, districts, sensors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="wm-logs-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="wm-logs-search-clear"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="wm-logs-toolbar__actions">
              {selectedIds.length > 0 && (
                <button
                  type="button"
                  className="wm-btn wm-btn--sm wm-btn--danger"
                  onClick={handleDeleteSelected}
                >
                  <Trash2 size={13} />
                  <span>Delete Selected ({selectedIds.length})</span>
                </button>
              )}

              {unreadCount > 0 && (
                <button
                  type="button"
                  className="wm-btn wm-btn--sm wm-btn--secondary"
                  onClick={onMarkAllRead}
                >
                  <Check size={13} />
                  <span>Mark All Read</span>
                </button>
              )}

              {notifications.length > 0 && (
                <button
                  type="button"
                  className="wm-btn wm-btn--sm wm-btn--ghost wm-text-rose"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all notification logs?')) {
                      onClearAll()
                      setSelectedIds([])
                    }
                  }}
                  title="Remove all notifications"
                >
                  <Trash2 size={13} />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="wm-logs-filter-tabs">
            {[
              { id: 'all', label: 'All Logs', count: notifications.length },
              {
                id: 'alert',
                label: 'Critical Alerts',
                count: notifications.filter((n) => n.type === 'alert').length,
              },
              {
                id: 'success',
                label: 'Resilience Updates',
                count: notifications.filter((n) => n.type === 'success').length,
              },
              {
                id: 'info',
                label: 'Telemetry Feeds',
                count: notifications.filter((n) => n.type === 'info').length,
              },
              {
                id: 'system',
                label: 'System Diagnostics',
                count: notifications.filter((n) => n.type === 'system').length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`wm-logs-tab ${filterType === tab.id ? 'wm-logs-tab--active' : ''}`}
                onClick={() => setFilterType(tab.id)}
              >
                <span>{tab.label}</span>
                <span className="wm-logs-tab__count">{tab.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Logs List Area */}
        <div className="wm-modal__body wm-logs-body">
          {filteredNotifications.length === 0 ? (
            <div className="wm-logs-empty">
              <div className="wm-logs-empty__icon">
                <BellOff size={36} />
              </div>
              <h3 className="wm-logs-empty__title">
                {notifications.length === 0
                  ? 'No Notification Logs'
                  : 'No Matching Logs Found'}
              </h3>
              <p className="wm-logs-empty__desc">
                {notifications.length === 0
                  ? 'All municipal alert logs and telemetry events have been cleared or removed.'
                  : `No logs matched the current search query "${searchQuery}".`}
              </p>
              {notifications.length === 0 && onRestoreDefaults && (
                <button
                  type="button"
                  className="wm-btn wm-btn--primary wm-btn--sm"
                  onClick={onRestoreDefaults}
                >
                  <RotateCcw size={13} />
                  <span>Restore Sample Alert Logs</span>
                </button>
              )}
            </div>
          ) : (
            <div className="wm-logs-list" role="list">
              <div className="wm-logs-list-header">
                <label className="wm-logs-select-all-label">
                  <input
                    type="checkbox"
                    className="wm-checkbox"
                    checked={
                      filteredNotifications.length > 0 &&
                      selectedIds.length === filteredNotifications.length
                    }
                    onChange={handleSelectAll}
                  />
                  <span>Select All ({filteredNotifications.length})</span>
                </label>
                <span className="wm-logs-list-header__meta">
                  Sorted by most recent events
                </span>
              </div>

              {filteredNotifications.map((n) => {
                const isSelected = selectedIds.includes(n.id)
                return (
                  <div
                    key={n.id}
                    role="listitem"
                    className={`wm-logs-item ${n.unread ? 'wm-logs-item--unread' : ''} ${
                      isSelected ? 'wm-logs-item--selected' : ''
                    }`}
                  >
                    <div className="wm-logs-item__select">
                      <input
                        type="checkbox"
                        className="wm-checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(n.id)}
                        aria-label={`Select log ${n.title}`}
                      />
                    </div>

                    <div
                      className={`topbar__notif-icon-wrap topbar__notif-icon-wrap--${n.type} wm-logs-item__icon`}
                    >
                      {n.type === 'alert' && <ShieldAlert size={15} />}
                      {n.type === 'success' && <CloudRain size={15} />}
                      {n.type === 'info' && <Database size={15} />}
                      {n.type === 'system' && <Check size={15} />}
                    </div>

                    <div className="wm-logs-item__content">
                      <div className="wm-logs-item__top-row">
                        <span className="wm-logs-item__title">{n.title}</span>
                        {n.unread && <span className="wm-logs-item__new-dot" />}
                        <span className="wm-logs-item__time">
                          <Clock size={11} />
                          <span>{n.time}</span>
                        </span>
                      </div>

                      <p className="wm-logs-item__desc">{n.description}</p>

                      <div className="wm-logs-item__meta-row">
                        <span className="wm-logs-tag wm-logs-tag--source">
                          {n.source || 'Bangalore Municipal Hydrology'}
                        </span>
                        <span
                          className={`wm-logs-tag wm-logs-tag--${
                            n.type === 'alert' ? 'danger' : 'normal'
                          }`}
                        >
                          {n.type === 'alert'
                            ? 'Critical Priority'
                            : n.type === 'success'
                            ? 'Plan Committed'
                            : n.type === 'info'
                            ? 'Telemetry'
                            : 'System'}
                        </span>
                      </div>
                    </div>

                    <div className="wm-logs-item__actions">
                      <button
                        type="button"
                        className="wm-logs-item__remove-btn"
                        onClick={() => handleDeleteSingle(n.id, n.title)}
                        title="Remove notification"
                        aria-label={`Remove notification ${n.title}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <footer className="wm-modal__footer">
          <div className="wm-logs-footer-info">
            <span>
              Showing {filteredNotifications.length} of {notifications.length} logged events
            </span>
          </div>

          <div className="wm-profile-form__footer-right">
            {notifications.length === 0 && onRestoreDefaults && (
              <button
                type="button"
                className="wm-btn wm-btn--ghost"
                onClick={onRestoreDefaults}
              >
                <RotateCcw size={14} />
                <span>Restore Sample Logs</span>
              </button>
            )}
            <button type="button" className="wm-btn wm-btn--secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default AlertLogsModal
