import { useState } from 'react'
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Clock,
  CloudRain,
  Droplets,
  TrendingUp,
} from 'lucide-react'
import { RECENT_ALERTS } from '../../data/demoData.js'

/** lucide icon key -> component, resolved from the alert data. */
const ALERT_ICONS = {
  'alert-triangle': AlertTriangle,
  'cloud-rain': CloudRain,
  'trending-up': TrendingUp,
  'arrow-down': ArrowDown,
  droplets: Droplets,
  clock: Clock,
}

const VISIBLE_ALERT_COUNT = 4

/**
 * Recent alerts feed. The four most recent alerts are always shown; the
 * heading link expands or collapses the remaining demo alerts instead of
 * navigating to a page that does not exist.
 */
const RecentAlerts = ({ alerts = RECENT_ALERTS }) => {
  const [expanded, setExpanded] = useState(false)
  const visibleAlerts = expanded ? alerts : alerts.slice(0, VISIBLE_ALERT_COUNT)
  const hasMore = alerts.length > VISIBLE_ALERT_COUNT

  return (
    <section className="card dashboard-card" aria-labelledby="recent-alerts-title">
      <div className="card__header">
        <h2 className="card__title" id="recent-alerts-title">
          Recent Alerts
        </h2>
        {hasMore ? (
          <button
            type="button"
            className="link-action"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? 'Show Less' : 'View All'}
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <ul className="alerts-list">
        {visibleAlerts.map((alert) => {
          const Icon = ALERT_ICONS[alert.icon] ?? AlertTriangle
          return (
            <li className="alert-item" key={alert.id}>
              <span className={`alert-item__icon alert-item__icon--${alert.tone}`}>
                <Icon size={16} aria-hidden="true" />
              </span>
              <div className="alert-item__body">
                <p className="alert-item__title">{alert.title}</p>
                <p className="alert-item__description">{alert.description}</p>
                <span className="alert-item__time">{alert.timestamp}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default RecentAlerts
