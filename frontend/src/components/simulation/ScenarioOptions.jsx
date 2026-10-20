import { BarChart3, Droplet, Gauge, Leaf, Waves } from 'lucide-react'

const SCENARIO_ICONS = {
  rainwater: BarChart3,
  recycled: Droplet,
  demand: Gauge,
  green: Leaf,
  supply: Waves,
}

const BADGE_THEMES = {
  rainwater: { bg: '#e8f8f0', color: '#10b981' },
  recycled: { bg: '#f3e8ff', color: '#8b5cf6' },
  demand: { bg: '#fef3c7', color: '#f59e0b' },
  green: { bg: '#dcfce7', color: '#16a34a' },
  supply: { bg: '#e2e8f0', color: '#64748b' },
}

/**
 * "Try Different Scenarios" card:
 * Radio list with 5 options, colored badge icons, bold titles, and subtitles.
 */
const ScenarioOptions = ({ scenarios = [], selected, onSelect }) => (
  <section className="card scenario-options" aria-label="Try different scenarios">
    <div className="card__header">
      <h2 className="card__title">Try Different Scenarios</h2>
    </div>

    <ul className="scenario-options__list">
      {scenarios.map((scenario) => {
        const Icon = SCENARIO_ICONS[scenario.id] ?? Leaf
        const theme = BADGE_THEMES[scenario.id] ?? { bg: '#f1f5f9', color: '#64748b' }
        const active = scenario.id === selected
        return (
          <li key={scenario.id}>
            <label className={`scenario-options__item${active ? ' scenario-options__item--active' : ''}`}>
              <span className="scenario-options__radio-wrapper">
                <input
                  type="radio"
                  name="scenario-quick-pick"
                  className="scenario-options__radio"
                  value={scenario.id}
                  checked={active}
                  onChange={() => onSelect?.(scenario.id)}
                />
                <span className="scenario-options__radio-custom" aria-hidden="true">
                  <span className="scenario-options__radio-dot" />
                </span>
              </span>
              <span
                className="scenario-options__icon"
                style={{ backgroundColor: theme.bg, color: theme.color }}
                aria-hidden="true"
              >
                <Icon size={16} />
              </span>
              <span className="scenario-options__body">
                <span className="scenario-options__label">{scenario.label}</span>
                <span className="scenario-options__description">{scenario.description}</span>
              </span>
            </label>
          </li>
        )
      })}
    </ul>
  </section>
)

export default ScenarioOptions