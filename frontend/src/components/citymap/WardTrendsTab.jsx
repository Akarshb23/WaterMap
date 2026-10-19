import { WARD_HISTORY, WARD_HISTORY_SUMMARY } from '../../data/cityMapData.js'
import WardTrendsChart from './WardTrendsChart.jsx'

/**
 * Trends tab: a compact historical summary (key changes since 2020) plus
 * a combined chart of Water Stress Index and annual rainfall.
 */
const WardTrendsTab = () => (
  <div className="ward-tab-panel">
    <ul className="trend-summary">
      {WARD_HISTORY_SUMMARY.map((item) => (
        <li key={item.id} className="trend-summary__item">
          <div className="trend-summary__head">
            <span className="trend-summary__label">{item.label}</span>
            <span className={`badge badge--${item.tone}`}>{item.note}</span>
          </div>
          <p className="trend-summary__value">{item.change}</p>
        </li>
      ))}
    </ul>

    <WardTrendsChart data={WARD_HISTORY} />

    <p className="ward-detail__disclaimer">
      Illustrative demonstration data — not live government or sensor readings.
    </p>
  </div>
)

export default WardTrendsTab
