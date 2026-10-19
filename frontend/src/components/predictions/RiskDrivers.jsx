/**
 * "Key Drivers" card on the predictions page: ranked drivers behind the
 * projected risk change.
 * `drivers` is `[{ id, label, detail, share, color }]` where `share` is the
 * driver's illustrative contribution in percent (shares sum to 100).
 */
const RiskDrivers = ({ title = 'Key Drivers', subtitle, drivers = [], note }) => (
  <section className="card risk-drivers" aria-label={title}>
    <div className="card__header">
      <div>
        <h2 className="card__title">{title}</h2>
        {subtitle ? <p className="card__subtitle">{subtitle}</p> : null}
      </div>
    </div>

    {drivers.length === 0 ? (
      <p className="risk-drivers__empty">No driver data yet.</p>
    ) : (
      <ul className="risk-drivers__list">
        {drivers.map((driver) => (
          <li key={driver.id} className="risk-drivers__item">
            <div className="risk-drivers__row">
              <span className="risk-drivers__label">{driver.label}</span>
              <span className="risk-drivers__strength">{driver.share}%</span>
            </div>
            {driver.detail ? <p className="risk-drivers__detail">{driver.detail}</p> : null}
            <div
              className="risk-drivers__bar"
              role="img"
              aria-label={`${driver.label}: ${driver.share} percent contribution`}
            >
              <div
                className="risk-drivers__bar-fill"
                style={{ width: `${driver.share}%`, backgroundColor: driver.color }}
              />
            </div>
          </li>
        ))}
      </ul>
    )}

    {note ? <p className="risk-drivers__note">{note}</p> : null}
  </section>
)

export default RiskDrivers