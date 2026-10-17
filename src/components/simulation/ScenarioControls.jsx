import { ArrowRight } from 'lucide-react'
import Select from '../common/Select.jsx'
import {
  AREA_OPTIONS,
  HORIZON_OPTIONS,
  LEVEL_OPTIONS,
  SCENARIO_SELECT_OPTIONS,
  SIMULATION_NOTE,
} from '../../data/simulationData.js'

/**
 * Full-width controls bar: Select Scenario, Target Area, Implementation
 * Level and Time Horizon in one horizontal row (they wrap at smaller
 * widths), plus the green "Run Simulation →" button at the far right.
 * All four selectors are controlled by the caller's state; `onRun`
 * recalculates the results without a page reload.
 */
const ScenarioControls = ({ value, onChange, onRun }) => {
  const update = (key) => (event) => onChange({ ...value, [key]: event.target.value })

  return (
    <section className="card sim-controls" aria-label="Simulation controls">
      <div className="sim-controls__row">
        <Select
          className="sim-controls__field"
          label="Select Scenario"
          options={SCENARIO_SELECT_OPTIONS}
          value={value.scenario}
          onChange={update('scenario')}
        />
        <Select
          className="sim-controls__field"
          label="Target Area"
          options={AREA_OPTIONS}
          value={value.area}
          onChange={update('area')}
        />
        <Select
          className="sim-controls__field"
          label="Implementation Level"
          options={LEVEL_OPTIONS}
          value={value.level}
          onChange={update('level')}
        />
        <Select
          className="sim-controls__field"
          label="Time Horizon"
          options={HORIZON_OPTIONS}
          value={value.horizon}
          onChange={update('horizon')}
        />
        <button type="button" className="btn btn--primary sim-controls__run" onClick={onRun}>
          Run Simulation
          <ArrowRight size={15} aria-hidden="true" />
        </button>
      </div>
      <p className="sim-controls__note">{SIMULATION_NOTE}</p>
    </section>
  )
}

export default ScenarioControls