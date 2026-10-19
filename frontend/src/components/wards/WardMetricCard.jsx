import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { WARD_ICONS } from './wardIcons.js'

/**
 * Small red circular progress ring for the Water Stress Index.
 * Draws an SVG arc sized to `percent` of the circle; the dash offset
 * animates once on mount so the ring renders smoothly without a chart
 * library (same approach as the City Map ward panel).
 */
const ProgressRing = ({ percent, label }) => {
  const radius = 15
  const circumference = 2 * Math.PI * radius
  const [dashOffset, setDashOffset] = useState(circumference)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDashOffset(circumference * (1 - percent / 100))
    }, 30)
    return () => clearTimeout(timeout)
  }, [circumference, percent])

  return (
    <span className="ward-kpi-card__ring" role="img" aria-label={label}>
      <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true" focusable="false">
        <circle className="ward-kpi-card__ring-track" cx="20" cy="20" r={radius} />
        <circle
          className="ward-kpi-card__ring-value"
          cx="20"
          cy="20"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <span className="ward-kpi-card__ring-text">{percent}%</span>
    </span>
  )
}

/**
 * Compact KPI tile used at the top of the Ward Details Overview tab.
 * Shows a circular progress indicator or a tone-styled icon, the metric
 * value and a year-over-year change row.
 */
const WardMetricCard = ({ title, value, unit, icon, tone = 'blue', progress, change, changeDirection = 'up' }) => {
  const Icon = WARD_ICONS[icon]

  return (
    <article className="card ward-kpi-card">
      {progress ? (
        <ProgressRing percent={progress.percent} label={progress.label} />
      ) : Icon ? (
        <span className={`ward-kpi-card__icon ward-kpi-card__icon--${tone}`}>
          <Icon size={17} aria-hidden="true" />
        </span>
      ) : null}
      <div className="ward-kpi-card__body">
        <p className="ward-kpi-card__title">{title}</p>
        <p className="ward-kpi-card__value">
          {value}
          {unit ? <span className="ward-kpi-card__unit">{unit}</span> : null}
        </p>
      </div>
      {change ? (
        <p
          className={`ward-kpi-card__change ward-kpi-card__change--${changeDirection}`}
        >
          {changeDirection === 'down' ? (
            <ArrowDown size={13} aria-hidden="true" />
          ) : (
            <ArrowUp size={13} aria-hidden="true" />
          )}
          {change}
        </p>
      ) : null}
    </article>
  )
}

export default WardMetricCard
