/**
 * Popup shown when a ward is selected on a map. Renders nothing until a
 * ward is provided. Optional props: `badge` (node), `metrics`
 * (`[{ label, value }]`) and `action` (node); `onOpenDetails` keeps the
 * button fallback used by callers without a router link.
 */
const WardPopup = ({ ward = null, badge = null, metrics = [], action = null, onOpenDetails }) => {
  if (!ward) {
    return null
  }

  return (
    <div className="ward-popup" role="dialog" aria-label={`Ward: ${ward.name}`}>
      <div className="ward-popup__head">
        <h4 className="ward-popup__name">{ward.name}</h4>
        {badge}
      </div>
      {ward.summary ? <p className="ward-popup__summary">{ward.summary}</p> : null}
      {metrics.length > 0 ? (
        <dl className="ward-popup__metrics">
          {metrics.map((metric) => (
            <div className="ward-popup__metric" key={metric.label}>
              <dt className="ward-popup__metric-label">{metric.label}</dt>
              <dd className="ward-popup__metric-value">{metric.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {action ? (
        action
      ) : onOpenDetails ? (
        <button type="button" className="ward-popup__button" onClick={() => onOpenDetails(ward)}>
          View details
        </button>
      ) : null}
    </div>
  )
}

export default WardPopup
