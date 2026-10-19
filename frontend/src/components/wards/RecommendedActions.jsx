import { ArrowRight } from 'lucide-react'
import { WARD_ICONS } from './wardIcons.js'

/**
 * "Recommended Actions" card for the Overview tab: the top actionable
 * recommendations with an icon, short description and an impact badge.
 * The "View All" control switches to the Recommendations tab (owned by
 * the page) instead of navigating to a separate route.
 */
const RecommendedActions = ({ actions = [], onViewAll }) => (
  <section className="card dashboard-card" aria-labelledby="recommended-actions-title">
    <div className="card__header">
      <h2 className="card__title" id="recommended-actions-title">
        Recommended Actions
      </h2>
      <button type="button" className="link-action" onClick={onViewAll}>
        View All
        <ArrowRight size={13} aria-hidden="true" />
      </button>
    </div>

    {actions.length === 0 ? (
      <p className="ward-card__empty">No recommendations available for this ward.</p>
    ) : (
      <ul className="ward-actions">
        {actions.map((action) => {
          const Icon = WARD_ICONS[action.icon]
          return (
            <li key={action.id} className="ward-actions__item">
              <span className={`ward-actions__icon ward-actions__icon--${action.tone}`}>
                {Icon ? <Icon size={15} aria-hidden="true" /> : null}
              </span>
              <div className="ward-actions__body">
                <div className="ward-actions__head">
                  <p className="ward-actions__title">{action.title}</p>
                  <span className={`badge badge--${action.impactTone}`}>{action.impact}</span>
                </div>
                <p className="ward-actions__description">{action.description}</p>
              </div>
            </li>
          )
        })}
      </ul>
    )}
  </section>
)

export default RecommendedActions
