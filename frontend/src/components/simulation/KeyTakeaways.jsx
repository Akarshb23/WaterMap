import { BarChart3, Droplet, MapPin, Waves } from 'lucide-react'

const TAKEAWAY_META = {
  wards: { icon: BarChart3, tone: 'green' },
  wsi: { icon: Droplet, tone: 'blue' },
  groundwater: { icon: Waves, tone: 'blue' },
  impact: { icon: MapPin, tone: 'red' },
}

/**
 * Key Takeaways card:
 * 4 key takeaway bullets with distinct colored circle icon badges.
 * Matches reference mockup pixel-for-pixel.
 */
const KeyTakeaways = ({ items = [] }) => (
  <section className="card key-takeaways" aria-label="Key takeaways">
    <div className="card__header">
      <h2 className="card__title">Key Takeaways</h2>
    </div>

    <ul className="key-takeaways__list">
      {items.map((item) => {
        const meta = TAKEAWAY_META[item.id] ?? { icon: BarChart3, tone: 'blue' }
        const Icon = meta.icon
        return (
          <li key={item.id} className="key-takeaways__item">
            <span
              className={`key-takeaways__icon key-takeaways__icon--${meta.tone}`}
              aria-hidden="true"
            >
              <Icon size={14} />
            </span>
            <span className="key-takeaways__text">{item.text}</span>
          </li>
        )
      })}
    </ul>
  </section>
)

export default KeyTakeaways