/**
 * Grid of key ward metrics. `metrics` is `[{ id, label, value, unit }]`.
 */
const WardMetricGrid = ({ metrics = [] }) => (
  <div className="ward-metric-grid">
    {metrics.map((metric) => (
      <div key={metric.id} className="ward-metric-grid__item">
        <span className="ward-metric-grid__label">{metric.label}</span>
        <span className="ward-metric-grid__value">
          {metric.value}
          {metric.unit ? <span className="ward-metric-grid__unit">{metric.unit}</span> : null}
        </span>
      </div>
    ))}
  </div>
)

export default WardMetricGrid
