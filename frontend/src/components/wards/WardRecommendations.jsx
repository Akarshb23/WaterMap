import { Lightbulb } from 'lucide-react'
import { WARD_ICONS } from './wardIcons.js'

/**
 * Recommendations tab: actionable ward suggestions with an icon, impact
 * badge and short description on subtle backgrounds with dividers.
 * Illustrative demonstration suggestions — not official policy guidance.
 */
const WardRecommendations = ({ recommendations = [] }) => (
  <section className="card dashboard-card" aria-labelledby="ward-recommendations-title">
    <div className="card__header">
      <h2 className="card__title" id="ward-recommendations-title">
        Recommendations
      </h2>
    </div>
    <p className="ward-tab-panel__intro">Practical next steps to reduce water stress:</p>

    {recommendations.length === 0 ? (
      <p className="ward-card__empty">No recommendations available for this district.</p>
    ) : (
      <ul className="ward-actions ward-actions--divided">
        {recommendations.map((item) => {
          const Icon = WARD_ICONS[item.icon]
          return (
            <li key={item.id} className="ward-actions__item">
              <span className={`ward-actions__icon ward-actions__icon--${item.tone}`}>
                {Icon ? <Icon size={15} aria-hidden="true" /> : null}
              </span>
              <div className="ward-actions__body">
                <div className="ward-actions__head">
                  <p className="ward-actions__title">{item.title}</p>
                  <span className={`badge badge--${item.impactTone}`}>{item.impact}</span>
                </div>
                <p className="ward-actions__description">{item.description}</p>
              </div>
            </li>
          )
        })}
      </ul>
    )}

    <p className="ward-detail__disclaimer">
      <Lightbulb size={12} aria-hidden="true" /> Illustrative demonstration suggestions — not
      official policy guidance.
    </p>
  </section>
)

export default WardRecommendations
