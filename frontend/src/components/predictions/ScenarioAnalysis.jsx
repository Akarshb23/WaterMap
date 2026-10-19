import { Link } from 'react-router-dom'
import { SCENARIO_BASELINE_WSI, SCENARIO_OUTLOOK } from '../../data/predictionsData.js'
import { isApiMode } from '../../services/apiClient.js'



/**
 * Scenario Analysis card — projected 2030 WSI if each intervention is
 * adopted city-wide, against the 0.79 baseline. Bars are proportional to
 * each scenario's WSI reduction. Links through to the Simulation page.
 */
const ScenarioAnalysis = ({ outlook = SCENARIO_OUTLOOK, baseline = SCENARIO_BASELINE_WSI }) => {
  const maxReduction = Math.max(1, ...outlook.map((item) => Number(item.reduction) || 0))
  return (
  <section className="card scenario-analysis" aria-label="Scenario analysis">
    <div className="card__header">
      <div>
        <h2 className="card__title">Scenario Analysis</h2>
        <p className="card__subtitle">
          {isApiMode() ? `Scenario-specific estimates are not available from the current API (baseline ${Number(baseline).toFixed(2)}).` : `Projected 2030 WSI if adopted city wide (baseline ${Number(baseline).toFixed(2)}).`}
        </p>
      </div>
    </div>

    <ul className="scenario-analysis__list">
      {outlook.length === 0 ? (
        <li className="scenario-analysis__item" role="status">
          <p className="dashboard-empty-state">Not available — the backend does not yet provide scenario estimates.</p>
        </li>
      ) : outlook.map((item) => (
        <li key={item.id} className="scenario-analysis__item">
          <div className="scenario-analysis__row">
            <span className="scenario-analysis__label">{item.label}</span>
            <span className="scenario-analysis__stats">
              <strong>{item.wsi.toFixed(2)}</strong>
              <span className="scenario-analysis__delta">−{item.reduction}%</span>
            </span>
          </div>
          <div className="scenario-analysis__bar">
            <div
              className="scenario-analysis__bar-fill"
              style={{ width: `${Math.round((item.reduction / maxReduction) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>

    <div className="scenario-analysis__footer">
      <Link className="link-action" to="/simulation">
        Test scenarios in Simulation →
      </Link>
      <span className="scenario-analysis__note">{isApiMode() ? 'No intervention forecast supplied' : 'Illustrative outlook'}</span>
    </div>
  </section>
  )
}

export default ScenarioAnalysis