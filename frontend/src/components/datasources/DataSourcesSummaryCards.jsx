import {
  Calendar,
  Database,
  FileText,
  RotateCcw,
  RotateCw,
} from 'lucide-react'

const ICON_MAP = {
  Database,
  FileText,
  Calendar,
  RotateCcw,
  RotateCw,
}

/**
 * Four summary cards at the top of the Data Sources page.
 */
const DataSourcesSummaryCards = ({ metrics = [] }) => (
  <section className="datasources-metrics-grid" aria-label="Data sources summary metrics">
    {metrics.map((metric) => {
      const Icon = ICON_MAP[metric.iconName] || Database
      const isLastUpdatedCard = metric.id === 'last-updated'

      return (
        <article key={metric.id} className="card ds-metric-card">
          <div className={`ds-metric-card__icon ds-metric-card__icon--${metric.tone}`}>
            <Icon size={20} aria-hidden="true" />
          </div>
          <div className="ds-metric-card__content">
            {isLastUpdatedCard ? (
              <>
                <p className="ds-metric-card__label">{metric.label}</p>
                <h3 className="ds-metric-card__value ds-metric-card__value--date">
                  {metric.value}
                </h3>
              </>
            ) : (
              <>
                <p className="ds-metric-card__value">{metric.value}</p>
                <h3 className="ds-metric-card__title">{metric.title}</h3>
              </>
            )}
            <p className="ds-metric-card__subtitle">{metric.subtitle}</p>
          </div>
        </article>
      )
    })}
  </section>
)

export default DataSourcesSummaryCards
