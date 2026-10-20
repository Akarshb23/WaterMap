import { WARD_ICONS } from './wardIcons.js'

/**
 * Compact "Key Risk Factors" card for the Overview tab: one row per
 * factor with an icon, the factor name and a severity badge.
 */
const KeyRiskFactors = ({ factors = [] }) => (
  <section className="card dashboard-card" aria-labelledby="key-risk-factors-title">
    <div className="card__header">
      <h2 className="card__title" id="key-risk-factors-title">
        Key Risk Factors
      </h2>
    </div>

    {factors.length === 0 ? (
      <p className="ward-card__empty">No risk factor data available for this district.</p>
    ) : (
      <ul className="ward-risk-rows">
        {factors.map((factor) => {
          const Icon = WARD_ICONS[factor.icon]
          return (
            <li key={factor.id} className="ward-risk-rows__item">
              <span className={`ward-risk-rows__icon ward-risk-rows__icon--${factor.tone}`}>
                {Icon ? <Icon size={14} aria-hidden="true" /> : null}
              </span>
              <span className="ward-risk-rows__name">{factor.title}</span>
              <span className={`badge badge--${factor.severityTone}`}>{factor.severity}</span>
            </li>
          )
        })}
      </ul>
    )}
  </section>
)

export default KeyRiskFactors
