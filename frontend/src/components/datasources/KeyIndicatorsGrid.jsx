import {
  Activity,
  Building2,
  Droplet,
  Droplets,
  Layers,
  Leaf,
  Thermometer,
  Users,
} from 'lucide-react'

const INDICATOR_ICONS = {
  Droplet,
  Activity,
  Users,
  Building2,
  Droplets,
  Leaf,
  Thermometer,
  Layers,
}

/**
 * Key Indicators from Data Sources card.
 * Displays an 8-item compact grid with icons, units, and descriptions.
 */
const KeyIndicatorsGrid = ({
  indicators = [],
  selectedIndicator,
  onSelectIndicator,
}) => (
  <article className="card key-indicators-card" aria-labelledby="indicators-title">
    <header className="key-indicators-card__header">
      <h3 className="key-indicators-card__title" id="indicators-title">
        Key Indicators from Data Sources
      </h3>
      <p className="key-indicators-card__subtitle">
        Major indicators used in analysis.
      </p>
    </header>

    <div className="key-indicators-card__grid">
      {indicators.map((ind) => {
        const IconComponent = INDICATOR_ICONS[ind.iconName] || Droplet
        const isSelected = selectedIndicator === ind.id

        return (
          <div
            key={ind.id}
            className={`key-indicator-item ${isSelected ? 'key-indicator-item--selected' : ''}`}
            onClick={() => onSelectIndicator(isSelected ? null : ind.id)}
            role="button"
            tabIndex={0}
            title={ind.description}
            aria-pressed={isSelected}
            aria-label={`${ind.name} ${ind.unit}`}
          >
            <span className={`key-indicator-item__icon key-indicator-item__icon--${ind.tone}`}>
              <IconComponent size={17} aria-hidden="true" />
            </span>
            <div className="key-indicator-item__info">
              <span className="key-indicator-item__name">{ind.name}</span>
              <span className="key-indicator-item__unit">{ind.unit}</span>
            </div>
          </div>
        )
      })}
    </div>
  </article>
)

export default KeyIndicatorsGrid
