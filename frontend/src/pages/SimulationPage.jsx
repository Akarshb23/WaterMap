import { useEffect, useMemo, useState } from 'react'
import { Lightbulb } from 'lucide-react'
import predictionBanner from '../assets/prediction-banner.jpg'
import ScenarioControls from '../components/simulation/ScenarioControls.jsx'
import SimulatedMapCanvas from '../components/simulation/SimulatedMapCanvas.jsx'
import ScenarioImpactChart from '../components/simulation/ScenarioImpactChart.jsx'
import ScenarioComparison from '../components/simulation/ScenarioComparison.jsx'
import SimulationResults from '../components/simulation/SimulationResults.jsx'
import KeyTakeaways from '../components/simulation/KeyTakeaways.jsx'
import WaterStressForecast from '../components/simulation/WaterStressForecast.jsx'
import InterventionEffectiveness from '../components/simulation/InterventionEffectiveness.jsx'
import ScenarioOptions from '../components/simulation/ScenarioOptions.jsx'
import {
  DEFAULT_SIMULATION_INPUT,
  SCENARIOS,
  SIMULATION_INFO,
  runScenarioSimulation,
  buildKeyTakeaways,
} from '../data/simulationData.js'

/**
 * Scenario Simulation page matching the reference screenshot pixel-for-pixel:
 * - Panoramic banner with city skyline and lightbulb info badge
 * - Scenario controls bar with Select Scenario, Target Area, Implementation Level, Time Horizon, Run Simulation
 * - 3x3 dashboard grid:
 *     Left: Simulated Water Stress Map (with Current / Simulated toggle and Koramangala pinpoint callout)
 *     Center: Scenario Impact (Koramangala) + City-wide Comparison
 *     Right: Summary metrics cards + Key Takeaways
 *     Bottom: Water Stress Index Forecast + Intervention Effectiveness + Try Different Scenarios
 * - Fully interactive: changing scenarios or clicking Run Simulation recalculates all metrics and charts dynamically.
 */
const SimulationPage = () => {
  const [draft, setDraft] = useState(DEFAULT_SIMULATION_INPUT)
  const [result, setResult] = useState(() => runScenarioSimulation(DEFAULT_SIMULATION_INPUT))
  const [isLoading, setIsLoading] = useState(false)

  const takeaways = useMemo(() => buildKeyTakeaways(result), [result])

  const handleRun = () => {
    setIsLoading(true)
    setTimeout(() => {
      setResult(runScenarioSimulation(draft))
      setIsLoading(false)
    }, 150)
  }

  const handleScenarioSelect = (scenarioId) => {
    const nextDraft = { ...draft, scenario: scenarioId }
    setDraft(nextDraft)
    setResult(runScenarioSimulation(nextDraft))
  }

  return (
    <div className="simulation-page">
      {/* Page Header matching reference banner */}
      <header className="simulation-header">
        <div className="simulation-header__left">
          <h1 className="simulation-header__title">Scenario Simulation</h1>
          <p className="simulation-header__subtitle">
            Test different interventions to see how they can reduce water stress and improve urban water security.
          </p>
        </div>

        <div
          className="simulation-header__banner"
          role="region"
          aria-label="Simulation scenario banner"
        >
          <div
            className="simulation-header__banner-bg"
            style={{
              backgroundImage: `linear-gradient(90deg, #f1f6f8 0%, rgba(241, 246, 248, 0.75) 16%, rgba(241, 246, 248, 0.1) 38%, rgba(241, 246, 248, 0) 55%), url(${predictionBanner})`,
            }}
            aria-hidden="true"
          />
          <div className="simulation-header__blur-veil" aria-hidden="true" />

          <div className="simulation-header__badge">
            <div className="simulation-header__badge-icon">
              <Lightbulb size={18} />
            </div>
            <p className="simulation-header__badge-text">
              {SIMULATION_INFO}
            </p>
          </div>
        </div>
      </header>

      {/* Controls Bar */}
      <ScenarioControls
        value={draft}
        onChange={setDraft}
        onRun={handleRun}
        isLoading={isLoading}
      />

      {/* Main 3x3 Simulation Grid */}
      <div className="sim-grid">
        <div className="sim-grid__map">
          <SimulatedMapCanvas
            areaLabel={result.area.label}
            currentWsi={result.baseline.wsi}
            simulatedWsi={result.simulated.wsi}
            reductionPct={result.wardReductionPct}
            horizon={result.horizon.label}
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
            onSelect={handleScenarioSelect}
          />
        </div>
      </div>
    </div>
  )
}

export default SimulationPage