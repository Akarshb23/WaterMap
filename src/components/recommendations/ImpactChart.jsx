/**
 * Expected impact of recommendations chart placeholder.
 * A Recharts visualisation will replace this once impact data exists.
 */
const ImpactChart = ({ data = [] }) => (
  <section className="impact-chart" aria-label="Impact chart">
    <h2 className="impact-chart__title">Expected impact</h2>
    {data.length === 0 ? (
      <p className="impact-chart__empty">No impact data yet.</p>
    ) : (
      <ul className="impact-chart__list">
        {data.map((entry) => (
          <li key={entry.label} className="impact-chart__item">
            <span>{entry.label}</span>
            <span>{entry.value}</span>
          </li>
        ))}
      </ul>
    )}
  </section>
)

export default ImpactChart
