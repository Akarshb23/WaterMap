import { INTERVENTION_TYPE_IMPACT } from '../../data/recommendationsData.js'

/**
 * Horizontal bar breakdown showing projected impact share by intervention type.
 */
const InterventionTypeChart = ({ data = INTERVENTION_TYPE_IMPACT }) => (
  <article className="card intervention-type-card" aria-labelledby="intervention-type-title">
    <header className="intervention-type-card__header">
      <h3 className="intervention-type-card__title" id="intervention-type-title">
        Impact by Intervention Type
      </h3>
    </header>

    <div className="intervention-type-card__body">
      <ul className="intervention-type-card__list" aria-label="Intervention type impact percentages">
        {data.map((item) => (
          <li key={item.name} className="intervention-type-card__item">
            <span className="intervention-type-card__label">{item.name}</span>
            <div className="intervention-type-card__track">
              <div
                className="intervention-type-card__fill"
                style={{
                  width: `${item.percent}%`,
                  backgroundColor: item.color,
                }}
                role="progressbar"
                aria-valuenow={item.percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${item.name}: ${item.percent}%`}
              />
            </div>
            <span className="intervention-type-card__value">{item.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  </article>
)

export default InterventionTypeChart
