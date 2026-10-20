import {
  CloudRain,
  Droplet,
  Leaf,
  Users,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { KEY_COMPONENTS } from '../../data/aboutData.js'

const COMPONENT_ICONS = {
  Droplet,
  Users,
  CloudRain,
  Leaf,
}

/**
 * Key Components card displaying a 2x2 grid of factors driving urban water stress.
 */
const KeyComponentsCard = () => {
  const navigate = useNavigate()

  return (
    <article className="card about-key-components-card" aria-labelledby="components-title">
      <header className="about-key-components-card__header">
        <h3 className="about-key-components-card__title" id="components-title">
          Key Components
        </h3>
        <p className="about-key-components-card__subtitle">
          Multiple factors are combined to assess urban water stress.
        </p>
      </header>

      <div className="about-key-components-card__grid">
        {KEY_COMPONENTS.map((item) => {
          const Icon = COMPONENT_ICONS[item.iconName] || Droplet
          return (
            <div
              key={item.id}
              className="about-key-component-tile"
              role="button"
              tabIndex={0}
              aria-label={`${item.title}: ${item.description}. Click to explore data sources.`}
              onClick={() => navigate('/data-sources')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  navigate('/data-sources')
                }
              }}
            >
              <span className={`about-key-component-tile__icon about-key-component-tile__icon--${item.tone}`}>
                <Icon size={18} aria-hidden="true" />
              </span>
              <div className="about-key-component-tile__info">
                <h4 className="about-key-component-tile__title">{item.title}</h4>
                <p className="about-key-component-tile__desc">{item.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </article>
  )
}

export default KeyComponentsCard
