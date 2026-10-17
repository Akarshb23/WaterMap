import { WARD_ICONS } from './wardIcons.js'

/**
 * Detailed risk factor cards for the Risk Factors tab: each factor shows
 * an icon, its name, a severity badge, a concise explanation and an
 * indicative contribution bar. Illustrative data only.
 */
const RiskFactors = ({ factors = [] }) => (
  <section className="card dashboard-card" aria-labelledby="risk-factors-title">
    <div className="card__header">
      <h2 className="card__title" id="risk-factors-title">
        Risk Factors
      </h2>
    </div>
    <p className="ward-tab-panel__intro">
      What is driving the high water-stress rating for this ward:
    </p>

    {factors.length === 0 ? (
      <p className="ward-card__empty">No risk factor data available for this ward.</p>
    ) : (
      <ul className="factor-list">
        {factors.map((factor) => {
          const Icon = WARD_ICONS[factor.icon]
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
    )}
  </section>
)

export default RiskFactors
