import {
  Activity,
  Building2,
  ChevronRight,
  CloudRain,
  Coins,
  Droplets,
  FileText,
  Filter,
  Gauge,
  Layers,
  Leaf,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sprout,
  Users,
  Waves,
  Wrench,
} from 'lucide-react'

const ICON_MAP = {
  Activity,
  Building2,
  CloudRain,
  Coins,
  Droplets,
  FileText,
  Filter,
  Gauge,
  Layers,
  Leaf,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sprout,
  Users,
  Waves,
  Wrench,
}

/**
 * Single recommendation card in the center list.
 * Supports selectable state, keyboard accessibility, priority badges, and icons.
 */
const RecommendationCard = ({
  recommendation,
  isSelected = false,
  onSelect,
}) => {
  const IconComponent = ICON_MAP[recommendation.iconName] || ShieldCheck

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(recommendation.id)
    }
  }

  const priorityClass = `recommendation-card__badge--${recommendation.priority}`

  return (
    <article
      className={`recommendation-card${isSelected ? ' recommendation-card--selected' : ''}`}
      onClick={() => onSelect(recommendation.id)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`${recommendation.title}, ${recommendation.badgeLabel} priority`}
    >
      <div className={`recommendation-card__icon-wrapper recommendation-card__icon-wrapper--${recommendation.tone}`}>
        <IconComponent size={20} aria-hidden="true" />
      </div>

      <div className="recommendation-card__content">
        <h4 className="recommendation-card__title">{recommendation.title}</h4>
        <p className="recommendation-card__summary">{recommendation.summary}</p>
        <p className="recommendation-card__scope">{recommendation.scope}</p>
      </div>

      <div className="recommendation-card__meta">
        <span className={`recommendation-card__badge ${priorityClass}`}>
          {recommendation.badgeLabel}
        </span>
        <ChevronRight
          size={16}
          className="recommendation-card__chevron"
          aria-hidden="true"
        />
      </div>
    </article>
  )
}

export default RecommendationCard
