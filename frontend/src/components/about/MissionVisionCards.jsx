import {
  Eye,
  Leaf,
  Target,
  Users,
} from 'lucide-react'
import { MISSION_VISION_CARDS } from '../../data/aboutData.js'

const ICONS = {
  Target,
  Eye,
  Users,
  Leaf,
}

/**
 * Four equal-width cards displaying Mission, Vision, Approach, and Impact.
 */
const MissionVisionCards = () => (
  <section className="about-pillars-grid" aria-label="Core values and strategic pillars">
    {MISSION_VISION_CARDS.map((item) => {
      const Icon = ICONS[item.iconName] || Target
      return (
        <article key={item.id} className="card about-pillar-card">
          <div className={`about-pillar-card__icon about-pillar-card__icon--${item.tone}`}>
            <Icon size={20} aria-hidden="true" />
          </div>
          <div className="about-pillar-card__content">
            <h3 className="about-pillar-card__title">{item.title}</h3>
            <p className="about-pillar-card__desc">{item.description}</p>
          </div>
        </article>
      )
    })}
  </section>
)

export default MissionVisionCards
