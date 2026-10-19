import { useEffect, useMemo, useState } from 'react'
import { Lightbulb } from 'lucide-react'
import { useSimulation } from '../hooks/useSimulation.js'
import { isApiMode } from '../services/apiClient.js'
import { useCity } from '../context/CityContext.jsx'
import { useWards } from '../hooks/useWards.js'
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
} from '../data/simulationData.js'

/**
 * Scenario Simulation page: scenario selectors, a shared ward-polygon map,
 * and illustrative result cards. `draft` mirrors the selectors and the result
 * cards recalculate on Run Simulation.
 * All values come from `simulationData.js` — see the documented formula
 * there. Demo only: not a validated water-resource forecast.
 */
const SimulationPage = () => {
  const [draft, setDraft] = useState(DEFAULT_SIMULATION_INPUT)
  const { selectedCityId } = useCity()
  const { wards: availableWards } = useWards({ cityId: selectedCityId || 'bengaluru' })
  const { result, run, isLoading, error } = useSimulation()
  const takeaways = useMemo(() => result && !isApiMode() ? buildKeyTakeaways(result) : [], [result])
  const simulationAreaOptions = isApiMode() && availableWards.length ? availableWards.map((ward) => ({ value: String(ward.id), label: ward.name })) : undefined
  const selectedAreaExists = simulationAreaOptions?.some((option) => option.value === String(draft.area))
  useEffect(() => {
    if (!isApiMode() || !simulationAreaOptions?.length || selectedAreaExists) return
    setDraft((current) => simulationAreaOptions.some((option) => option.value === String(current.area)) ? current : { ...current, area: simulationAreaOptions[0].value })
  }, [simulationAreaOptions, selectedAreaExists])

  const handleRun = () => run(draft, { cityId: selectedCityId || 'bengaluru' })

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

      {error ? (
        <div className="dashboard-api-notice" role="alert">
          <div><strong>Simulation failed.</strong><p>{error}</p></div>
        </div>
      ) : null}
      <ScenarioControls value={draft} onChange={setDraft} onRun={handleRun} isLoading={isLoading} areaOptions={simulationAreaOptions} />

      {isApiMode() ? (
        <section className="card simulation-api-result" aria-live="polite">
          {!result?.backendResult ? (
            <div className="simulation-api-result__empty"><h2>Ready to run a backend simulation</h2><p>Select a real ward, intervention, and implementation level, then run the simulation to retrieve a result from FastAPI.</p></div>
          ) : (
            <><header><h2>Simulation result · {result.area.label}</h2><p>{result.scenario.label}</p></header><div className="simulation-api-result__metrics"><article><span>Baseline WSI</span><strong>{Number(result.backendResult.baseline_wsi).toFixed(2)}</strong></article><article><span>Projected WSI</span><strong>{Number(result.backendResult.projected_wsi).toFixed(2)}</strong></article><article><span>Absolute reduction</span><strong>{Number(result.backendResult.absolute_reduction).toFixed(3)}</strong></article><article><span>Relative reduction</span><strong>{Number(result.backendResult.relative_reduction_pct).toFixed(1)}%</strong></article></div><p className="simulation-api-result__disclaimer">{result.backendResult.assumptions}</p></>
          )}
        </section>
      ) : <div className="sim-grid">
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
      </div>}
    </div>
  )
}

export default SimulationPage