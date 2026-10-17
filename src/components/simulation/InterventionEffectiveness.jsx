import { SCENARIOS } from '../../data/simulationData.js'

/**
 * Track width represents the full scale; bars are proportional to the
 * displayed percentages and capped at the track maximum.
 */
const SCALE_MAX_PERCENT = 40

/**
 * Intervention Effectiveness (City Wide): horizontal progress bars with
 * the projected WSI reduction of each intervention under the last run's
 * implementation level, target area and time horizon. The currently
 * selected intervention is highlighted; each bar keeps its own colour.
 */
const InterventionEffectiveness = ({ result, selectedScenario }) => (
  <section className="card effectiveness" aria-label="Intervention effectiveness">
    <div className="card__header">
      <div>
        <h2 className="card__title">Intervention Effectiveness (City Wide)</h2>
        <p className="card__subtitle">Projected city-wide WSI reduction at the last run&apos;s settings.</p>
      </div>
    </div>

    <ul className="effectiveness__list">
      {SCENARIOS.map((scenario) => {
        const pct = Math.round(scenario.cityEfficacy * result.adjustment * 100)
        const width = Math.min(100, (pct / SCALE_MAX_PERCENT) * 100)
        const active = scenario.id === selectedScenario
        return (
          <li
            key={scenario.id}
            className={`effectiveness__row${active ? ' effectiveness__row--active' : ''}`}
          >
            <span className="effectiveness__label">{scenario.label}</span>
            <div
              className="effectiveness__track"
              role="img"
              aria-label={`${scenario.label}: minus ${pct} percent WSI`}
            >
              <div
                className="effectiveness__fill"
                style={{ width: `${width}%`, backgroundColor: scenario.color }}
              />
            </div>
            <span className="effectiveness__value">−{pct}%</span>
          </li>
        )
      })}
    </ul>

    <p className="effectiveness__note">
      Bars scale with the implementation level, target area and time horizon of the last run.
    </p>
  </section>
)

export default InterventionEffectiveness