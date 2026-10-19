import { Lightbulb } from 'lucide-react'
import { WARD_RECOMMENDATIONS } from '../../data/cityMapData.js'
import { CITY_MAP_ICONS } from './cityMapIcons.js'

/**
 * Recommendations tab: compact illustrative suggestion cards with an icon,
 * priority chip and short description.
 */
const WardRecommendationsTab = () => (
  <div className="ward-tab-panel">
    <p className="ward-tab-panel__intro">Practical next steps to reduce water stress:</p>
    <ul className="recommendation-list">
      {WARD_RECOMMENDATIONS.map((item) => {
        const Icon = CITY_MAP_ICONS[item.icon]
        return (
          <li key={item.id} className="recommendation-card">
            <span className={`recommendation-card__icon recommendation-card__icon--${item.tone}`}>
              {Icon ? <Icon size={15} aria-hidden="true" /> : null}
            </span>
            <div className="recommendation-card__body">
              <div className="recommendation-card__head">
                <p className="recommendation-card__title">{item.title}</p>
                <span className={`badge badge--${item.priorityTone}`}>{item.priority}</span>
              </div>
              <p className="recommendation-card__description">{item.description}</p>
            </div>
          </li>
        )
      })}
    </ul>

    <p className="ward-detail__disclaimer">
      <Lightbulb size={12} aria-hidden="true" /> Illustrative demonstration suggestions — not
      official policy guidance.
    </p>
  </div>
)

export default WardRecommendationsTab
