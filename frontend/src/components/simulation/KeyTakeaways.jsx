import { MapPin, MapPinned, TrendingDown, Waves } from 'lucide-react'

/** Icon + tone per takeaway id (presentation stays out of the data module). */
const TAKEAWAY_META = {
  wards: { icon: MapPinned, tone: 'blue' },
  wsi: { icon: TrendingDown, tone: 'green' },
  groundwater: { icon: Waves, tone: 'teal' },
  impact: { icon: MapPin, tone: 'orange' },
}

/**
 * Key Takeaways card: compact insight list derived from the last
 * simulation run. Each item carries a small coloured icon.
 */
const KeyTakeaways = ({ items = [] }) => (
  <section className="card key-takeaways" aria-label="Key takeaways">
    <div className="card__header">
      <h2 className="card__title">Key Takeaways</h2>
    </div>

    <ul className="key-takeaways__list">
      {items.map((item) => {
        const meta = TAKEAWAY_META[item.id] ?? { icon: MapPin, tone: 'blue' }
        const Icon = meta.icon
        return (
          <li key={item.id} className="key-takeaways__item">
            <span
              className={`key-takeaways__icon key-takeaways__icon--${meta.tone}`}
              aria-hidden="true"
            >
              <Icon size={13} />
            </span>
            <span className="key-takeaways__text">{item.text}</span>
          </li>
        )
      })}
    </ul>

    <p className="key-takeaways__note">Demonstration insights tied to the last run.</p>
  </section>
)

export default KeyTakeaways