import { useNavigate } from 'react-router-dom'
import { RISK_CATEGORIES } from '../../data/aboutData.js'

/**
 * Risk Categories card showing classification based on WSI.
 * Displays risk levels, index ranges, and operational guidance.
 */
const RiskCategoriesCard = () => {
  const navigate = useNavigate()

  return (
    <article className="card about-risk-card" aria-labelledby="risk-categories-title">
      <header className="about-risk-card__header">
        <h3 className="about-risk-card__title" id="risk-categories-title">
          Risk Categories
        </h3>
        <p className="about-risk-card__subtitle">
          Wards are classified into risk levels based on WSI.
        </p>
      </header>

      <div className="about-risk-card__table" role="table" aria-label="Water Stress Index risk levels">
        {RISK_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="about-risk-row"
            role="button"
            tabIndex={0}
            aria-label={`${cat.level} (${cat.range}): ${cat.description}. Click to view on map.`}
            onClick={() => navigate('/map')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                navigate('/map')
              }
            }}
          >
            <div className="about-risk-row__level" role="cell">
              <span
                className="about-risk-row__dot"
                style={{ backgroundColor: cat.color }}
                aria-hidden="true"
              />
              <span className="about-risk-row__name">{cat.level}</span>
            </div>
            <div className="about-risk-row__range" role="cell">
              <span
                className={`about-risk-badge about-risk-badge--${cat.id}`}
                style={{
                  color: cat.color,
                  backgroundColor: `${cat.color}15`,
                  borderColor: `${cat.color}35`,
                }}
              >
                {cat.range}
              </span>
            </div>
            <div className="about-risk-row__desc" role="cell">
              {cat.description}
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

export default RiskCategoriesCard
