import { CloudRain, Gauge, Leaf, Recycle, Waves } from 'lucide-react'

/** Lucide icon per scenario id. */
const SCENARIO_ICONS = {
  rainwater: CloudRain,
  recycled: Recycle,
  demand: Gauge,
  green: Leaf,
  supply: Waves,
}

/**
 * "Try Different Scenarios" card: radio-style options with icon, title
 * and description. Selecting an option calls `onSelect(scenarioId)`,
 * which the page feeds back into the main Select Scenario control so
 * both stay synchronised through shared React state.
 */
const ScenarioOptions = ({ scenarios = [], selected, onSelect }) => (
  <section className="card scenario-options" aria-label="Try different scenarios">
    <div className="card__header">
      <div>
        <h2 className="card__title">Try Different Scenarios</h2>
        <p className="card__subtitle">Updates the Select Scenario control above.</p>
      </div>
    </div>

    <ul className="scenario-options__list">
      {scenarios.map((scenario) => {
        const Icon = SCENARIO_ICONS[scenario.id] ?? Leaf
        const active = scenario.id === selected
        return (
          <li key={scenario.id}>
            <label
              className={`scenario-options__item${active ? ' scenario-options__item--active' : ''}`}
            >
              <input
                type="radio"
                name="scenario-quick-pick"
                className="scenario-options__radio"
                value={scenario.id}
                checked={active}
                onChange={() => onSelect?.(scenario.id)}
              />
              <span
                className="scenario-options__icon"
                style={{ backgroundColor: `${scenario.color}22`, color: scenario.color }}
                aria-hidden="true"
              >
                <Icon size={15} />
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