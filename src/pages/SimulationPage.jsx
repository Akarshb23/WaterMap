import { useMemo, useState } from 'react'
import { Lightbulb } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader.jsx'
import InterventionEffectiveness from '../components/simulation/InterventionEffectiveness.jsx'
import KeyTakeaways from '../components/simulation/KeyTakeaways.jsx'
import ScenarioComparison from '../components/simulation/ScenarioComparison.jsx'
import ScenarioControls from '../components/simulation/ScenarioControls.jsx'
import ScenarioImpactChart from '../components/simulation/ScenarioImpactChart.jsx'
import ScenarioOptions from '../components/simulation/ScenarioOptions.jsx'
import SimulatedMapCanvas from '../components/simulation/SimulatedMapCanvas.jsx'
import SimulationResults from '../components/simulation/SimulationResults.jsx'
import WaterStressForecast from '../components/simulation/WaterStressForecast.jsx'
import {
  DEFAULT_SIMULATION_INPUT,
  SCENARIOS,
  SIMULATION_INFO,
  buildKeyTakeaways,
  runScenarioSimulation,
} from '../data/simulationData.js'

/**
 * Scenario Simulation page: controlled selectors + Run Simulation button,
 * empty map placeholder reserved for a future map integration, and a
 * deterministic set of illustrative result cards. `draft` mirrors the
 * selectors; `applied` is the input of the last "Run Simulation" click,
 * so every result card recalculates on run (never on page load/refresh).
 * All values come from `simulationData.js` — see the documented formula
 * there. Demo only: not a validated water-resource forecast.
 */
const SimulationPage = () => {
  const [draft, setDraft] = useState(DEFAULT_SIMULATION_INPUT)
  const [applied, setApplied] = useState(DEFAULT_SIMULATION_INPUT)

  const result = useMemo(() => runScenarioSimulation(applied), [applied])
  const takeaways = useMemo(() => buildKeyTakeaways(result), [result])

  const handleRun = () => setApplied(draft)

  return (
    <div className="simulation-page">
      <header className="dashboard-heading">
        <PageHeader
          title="Scenario Simulation"
          description="Test different interventions to see how they can reduce water stress and improve urban water security."
        />
        <aside className="page-info-card">
          <span className="page-info-card__icon" aria-hidden="true">
            <Lightbulb size={16} />
          </span>
          <p>{SIMULATION_INFO}</p>
        </aside>
      </header>

      <ScenarioControls value={draft} onChange={setDraft} onRun={handleRun} />

      <div className="sim-grid">
        <div className="sim-grid__map">
          <SimulatedMapCanvas
            areaLabel={result.area.label}
            currentWsi={result.baseline.wsi}
            simulatedWsi={result.simulated.wsi}
          />
        </div>

        <div className="sim-grid__impact">
          <ScenarioImpactChart result={result} />
        </div>

        <div className="sim-grid__summary">
          <SimulationResults result={result} />
        </div>

        <div className="sim-grid__citywide">
          <ScenarioComparison result={result} />
        </div>

        <div className="sim-grid__takeaways">
          <KeyTakeaways items={takeaways} />
        </div>

        <div className="sim-grid__forecast">
          <WaterStressForecast result={result} />
        </div>

        <div className="sim-grid__effect">
          <InterventionEffectiveness result={result} selectedScenario={draft.scenario} />
        </div>

        <div className="sim-grid__options">
          <ScenarioOptions
            scenarios={SCENARIOS}
            selected={draft.scenario}
            onSelect={(id) => setDraft((current) => ({ ...current, scenario: id }))}
          />
        </div>
      </div>
    </div>
  )
}

export default SimulationPage