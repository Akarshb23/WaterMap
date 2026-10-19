import { Lightbulb } from 'lucide-react'
import { WARD_INSIGHTS } from '../../data/wardDetailsData.js'

/**
 * "Quick Insights" card for the Overview tab: short illustrative
 * observations, each with a small blue icon bullet.
 */
const QuickInsights = () => (
  <section className="card dashboard-card" aria-labelledby="quick-insights-title">
    <div className="card__header">
      <h2 className="card__title" id="quick-insights-title">
        Quick Insights
      </h2>
    </div>

    <ul className="ward-insight-list">
      {WARD_INSIGHTS.map((insight) => (
        <li key={insight.id} className="ward-insight-list__item">
          <span className="ward-insight-list__icon" aria-hidden="true">
            <Lightbulb size={12} />
          </span>
          <span className="ward-insight-list__text">{insight.text}</span>
        </li>
      ))}
    </ul>
  </section>
)

export default QuickInsights
