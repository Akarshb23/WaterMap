import { SCENARIOS } from '../../data/simulationData.js'

const SCALE_MAX_PERCENT = 30

const INTERVENTION_COLORS = {
  rainwater: '#34d399',
  recycled: '#60a5fa',
  demand: '#facc15',
  green: '#a78bfa',
  supply: '#94a3b8',
}

const LABEL_MAP = {
  rainwater: 'Rainwater Harvesting',
  recycled: 'Increase Recycling',
  demand: 'Demand Management',
  green: 'Green Infrastructure',
  supply: 'New Water Supply',
}

/**
 * Intervention Effectiveness (City Wide):
 * 5 horizontal progress bars showing projected WSI reduction across interventions.
 */
const InterventionEffectiveness = ({ result, selectedScenario }) => (
  <section className="card effectiveness" aria-label="Intervention effectiveness">
    <div className="card__header">
      <h2 className="card__title">Intervention Effectiveness (City Wide)</h2>
    </div>

    <ul className="effectiveness__list">
      {SCENARIOS.map((scenario) => {
        const pct = Math.round(scenario.cityEfficacy * result.adjustment * 100)
        const width = Math.min(100, Math.max(12, (pct / SCALE_MAX_PERCENT) * 100))
        const color = INTERVENTION_COLORS[scenario.id] || scenario.color
        const label = LABEL_MAP[scenario.id] || scenario.label
        return (
          <li key={scenario.id} className="effectiveness__row">
            <span className="effectiveness__label">{label}</span>
            <div
              className="effectiveness__track"
              role="img"
              aria-label={`${label}: minus ${pct} percent WSI`}
            >
              <div
                className="effectiveness__fill"
                style={{ width: `${width}%`, backgroundColor: color }}
              />
            </div>
            <span className="effectiveness__value">-{pct}%</span>
          </li>
        )
      })}
    </ul>
  </section>
)

export default InterventionEffectiveness