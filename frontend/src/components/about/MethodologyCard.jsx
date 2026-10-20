import {
  Droplet,
  SlidersHorizontal,
  Target,
  TrendingUp,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { METHODOLOGY_ITEMS } from '../../data/aboutData.js'

const ICONS = {
  Droplet,
  TrendingUp,
  SlidersHorizontal,
  Target,
}

const METHODOLOGY_ROUTES = {
  wsi: '/map',
  modeling: '/predictions',
  scenario: '/simulation',
  engine: '/recommendations',
}

/**
 * Methodology Overview card listing the 4 core pillars of WaterMap's analytics.
 */
const MethodologyCard = () => {
  const navigate = useNavigate()

  return (
    <article className="card about-methodology-card" aria-labelledby="methodology-title">
      <header className="about-methodology-card__header">
        <h3 className="about-methodology-card__title" id="methodology-title">
          Methodology Overview
        </h3>
        <p className="about-methodology-card__subtitle">
          A combination of domain knowledge, data analytics and scenario modelling.
        </p>
      </header>

      <div className="about-methodology-card__list">
        {METHODOLOGY_ITEMS.map((item) => {
          const Icon = ICONS[item.iconName] || Droplet
          const targetRoute = METHODOLOGY_ROUTES[item.id]

          return (
            <div
              key={item.id}
              className="about-methodology-item"
              role="button"
              tabIndex={0}
              aria-label={`${item.title}: ${item.description}. Click to open.`}
              onClick={() => targetRoute && navigate(targetRoute)}
              onKeyDown={(e) => {
                if (targetRoute && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  navigate(targetRoute)
                }
              }}
            >
              <span className={`about-methodology-item__icon about-methodology-item__icon--${item.tone}`}>
                <Icon size={18} aria-hidden="true" />
              </span>
              <div className="about-methodology-item__info">
                <h4 className="about-methodology-item__title">{item.title}</h4>
                <p className="about-methodology-item__desc">{item.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </article>
  )
}

export default MethodologyCard
