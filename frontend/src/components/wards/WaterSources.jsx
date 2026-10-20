/**
 * Water supply mix for a ward, shown as horizontal progress bars on a
 * light neutral track: category names on the left, percentages on the
 * right. `sources` is `[{ id, name, percent }]` summing to 100.
 */
const WaterSources = ({ sources = [] }) => (
  <section className="card dashboard-card" aria-labelledby="water-sources-title">
    <div className="card__header">
      <h2 className="card__title" id="water-sources-title">
        Water Sources
      </h2>
    </div>

    {sources.length === 0 ? (
      <p className="ward-card__empty">No water source data available for this district.</p>
    ) : (
      <ul className="ward-sources">
        {sources.map((source) => (
          <li key={source.id} className="ward-sources__item">
            <div className="ward-sources__row">
              <span className="ward-sources__name">{source.name}</span>
              <span className="ward-sources__percent">{source.percent}%</span>
            </div>
            <div
              className="ward-sources__track"
              role="img"
              aria-label={`${source.name}: ${source.percent}% of supply`}
            >
              <div
                className="ward-sources__fill"
                style={{ width: `${source.percent}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    )}
  </section>
)

export default WaterSources
