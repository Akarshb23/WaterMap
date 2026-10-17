/**
 * Projected Results card (soft green treatment) on the predictions page.
 * `rows` is `[{ id, label, value, meta }]`.
 */
const ForecastSummary = ({ title = 'Projected Results', subtitle, rows = [], note }) => (
  <section className="card forecast-summary forecast-summary--projected" aria-label={title}>
    <div className="card__header">
      <div>
        <h2 className="card__title">{title}</h2>
        {subtitle ? <p className="card__subtitle">{subtitle}</p> : null}
      </div>
      <span className="badge badge--low">2030 outlook</span>
    </div>

    <ul className="forecast-summary__list">
      {rows.map((row) => (
        <li key={row.id} className="forecast-summary__row">
          <span className="forecast-summary__label">{row.label}</span>
          <span className="forecast-summary__value">{row.value}</span>
          {row.meta ? <span className="forecast-summary__meta">{row.meta}</span> : null}
        </li>
      ))}
    </ul>

    {note ? <p className="forecast-summary__note">{note}</p> : null}
  </section>
)

export default ForecastSummary