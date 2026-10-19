import { useEffect, useState } from 'react'

/**
 * Small red circular progress ring for the Water Stress Index.
 * Draws an SVG arc sized to `percent` of the circle.
 */
const ProgressRing = ({ percent, label }) => {
  /* The radius is fixed; the dash offset animates from empty to the target
     once on mount so the ring renders smoothly without a chart library. */
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
    <span className="ward-metric-card__ring" role="img" aria-label={label}>
      <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true" focusable="false">
        <circle className="ward-metric-card__ring-track" cx="20" cy="20" r={radius} />
        <circle
          className="ward-metric-card__ring-value"
          cx="20"
          cy="20"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <span className="ward-metric-card__ring-text">{percent}%</span>
    </span>
  )
}

/**
 * Compact metric tile used in the ward panel's Overview tab.
 * Either a leading icon (tone-styled circle) or a circular progress
 * indicator for index-style values.
 */
const WardMetricCard = ({ label, value, unit, icon: Icon, tone = 'blue', progress }) => (
  <article className="ward-metric-card">
    {progress ? (
      <ProgressRing percent={progress.percent} label={progress.label} />
    ) : Icon ? (
      <span className={`ward-metric-card__icon ward-metric-card__icon--${tone}`}>
        <Icon size={16} aria-hidden="true" />
      </span>
    ) : null}
    <div className="ward-metric-card__body">
      <p className="ward-metric-card__label">{label}</p>
      <p className="ward-metric-card__value">
        {value}
        {unit ? <span className="ward-metric-card__unit">{unit}</span> : null}
      </p>
    </div>
  </article>
)

export default WardMetricCard
