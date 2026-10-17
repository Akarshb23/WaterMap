import { ArrowRight, CloudRain, Droplet, Users } from 'lucide-react'
import { DEMO_DATA_NOTE, FEATURED_WARD, WARD_INSIGHTS } from '../../data/cityMapData.js'
import { CITY_MAP_ICONS } from './cityMapIcons.js'
import WaterStressTrendChart from './WaterStressTrendChart.jsx'
import WardMetricCard from './WardMetricCard.jsx'

/**
 * Overview tab of the ward panel: compact metric grid, WSI trend chart,
 * key insights and the two action buttons. The action callbacks are owned
 * by the panel, which shows an informational notice (the destination
 * pages do not exist in this build).
 */
const WardOverviewTab = ({ onViewAnalysis, onCompareWards }) => (
  <div className="ward-tab-panel">
    <div className="ward-metric-grid" aria-label="Ward metrics">
      <WardMetricCard
        label="Water Stress Index"
        value={FEATURED_WARD.wsi.toFixed(2)}
        progress={{
          percent: Math.round(FEATURED_WARD.wsi * 100),
          label: `Water stress index ${FEATURED_WARD.wsi.toFixed(2)} out of 1`,
        }}
      />
      <WardMetricCard label="Population" value={FEATURED_WARD.population} icon={Users} tone="green" />
      <WardMetricCard
        label="Annual Rainfall"
        value={FEATURED_WARD.rainfall}
        icon={CloudRain}
        tone="blue"
      />
      <WardMetricCard
        label="Water Demand"
        value={FEATURED_WARD.demand}
        icon={Droplet}
        tone="blue"
      />
    </div>

    <WaterStressTrendChart />

    <h4 className="ward-section-title">Key Insights</h4>
    <ul className="insight-list">
      {WARD_INSIGHTS.map((insight) => {
        const Icon = CITY_MAP_ICONS[insight.icon]
        return (
          <li key={insight.id} className="insight-item">
            <span className={`insight-item__icon insight-item__icon--${insight.tone}`}>
              {Icon ? <Icon size={14} aria-hidden="true" /> : null}
            </span>
            <span className="insight-item__text">{insight.text}</span>
          </li>
        )
      })}
    </ul>

    <div className="ward-detail__actions">
      <button type="button" className="btn btn--primary" onClick={onViewAnalysis}>
        View Detailed Analysis
        <ArrowRight size={14} aria-hidden="true" />
      </button>
      <button type="button" className="btn btn--secondary" onClick={onCompareWards}>
        Compare Wards
      </button>
    </div>

    <p className="ward-detail__disclaimer">{DEMO_DATA_NOTE}</p>
  </div>
)

export default WardOverviewTab
