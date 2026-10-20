import { WARD_RISK_FACTORS } from '../../data/cityMapData.js'
import { CITY_MAP_ICONS } from './cityMapIcons.js'

/**
 * Risk Factors tab: a structured list of the illustrative factors driving
 * the ward's high-risk rating, each with a severity chip, short
 * description and an indicative contribution bar.
 */
const WardRiskFactorsTab = () => (
  <div className="ward-tab-panel">
    <p className="ward-tab-panel__intro">
      What is driving the high water stress rating for this district:
    </p>
    <ul className="factor-list">
      {WARD_RISK_FACTORS.map((factor) => {
        const Icon = CITY_MAP_ICONS[factor.icon]
        return (
          <li key={factor.id} className="factor-item">
            <div className="factor-item__head">
              <span className={`factor-item__icon factor-item__icon--${factor.tone}`}>
                {Icon ? <Icon size={15} aria-hidden="true" /> : null}
              </span>
              <div className="factor-item__titles">
                <p className="factor-item__title">{factor.title}</p>
                <span className={`badge badge--${factor.severityTone}`}>{factor.severity}</span>
              </div>
            </div>
            <p className="factor-item__description">{factor.description}</p>
            <div className="factor-item__contribution">
              <span className="factor-item__contribution-label">Contribution</span>
              <span className="factor-item__contribution-bar" aria-hidden="true">
                <span
                  className={`factor-item__contribution-fill factor-item__contribution-fill--${factor.severityTone}`}
                  style={{ width: `${factor.weight}%` }}
                />
              </span>
              <span className="factor-item__contribution-value">{factor.weight}%</span>
            </div>
          </li>
        )
      })}
    </ul>
  </div>
)

export default WardRiskFactorsTab
