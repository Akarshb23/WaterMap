import { useState } from 'react'
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BarChart2,
  CloudRain,
  Droplet,
  Users,
  X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { WSI_TREND, WSI_TREND_RANGE_OPTIONS } from '../../data/cityMapData.js'
import WardRecommendationsTab from './WardRecommendationsTab.jsx'
import WardRiskFactorsTab from './WardRiskFactorsTab.jsx'
import WardTrendsTab from './WardTrendsTab.jsx'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'risk-factors', label: 'Risk Factors' },
  { id: 'trends', label: 'Trends' },
  { id: 'recommendations', label: 'Recommendations' },
]

/** Circular red gauge arc for the Water Stress Index */
const GaugeRingArc = ({ percent = 87 }) => {
  const radius = 15
  const circumference = 2 * Math.PI * radius // ~94.25
  const totalArc = circumference * 0.78 // ~73.5
  const fillArc = totalArc * (percent / 100)

  return (
    <div className="ward-gauge-wrap" aria-hidden="true">
      <svg viewBox="0 0 38 38" width="34" height="34">
        <circle
          cx="19"
          cy="19"
          r={radius}
          fill="none"
          stroke="#fee2e2"
          strokeWidth="3.2"
          strokeDasharray={`${totalArc} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(130 19 19)"
        />
        <circle
          cx="19"
          cy="19"
          r={radius}
          fill="none"
          stroke="#ef4444"
          strokeWidth="3.2"
          strokeDasharray={`${fillArc} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(130 19 19)"
        />
      </svg>
    </div>
  )
}

const TrendChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>
      <p className="chart-tooltip__value">WSI {Number(payload[0].value).toFixed(2)}</p>
    </div>
  )
}

/**
 * Right-hand District Details Panel matching Bangalore context:
 * - Koramangala, South Bangalore, High Risk badge, Close button
 * - Overview, Risk Factors, Trends, Recommendations tabs
 * - 2x2 Metric tiles (WSI, Population, Annual Rainfall, Water Demand)
 * - Water Stress Index Trend chart (Last 5 years)
 * - Key Insights with colored icons
 * - Two action buttons: "View Detailed Analysis →" & "📊 Compare Districts"
 */
const InteractiveWardPanel = ({
  district,
  ward,
  onClose,
  onCompare,
}) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [trendRange, setTrendRange] = useState('5')

  const currentDistrict = district || ward || {
    id: 'district-12',
    name: 'Koramangala',
    zone: 'South Bangalore',
    risk: 'high',
    riskLabel: 'High Risk',
    wsi: 0.87,
    population: '240,000',
    rainfall: '520 mm',
    demand: '124 MLD',
  }

  const trendData = WSI_TREND.slice(-Number(trendRange))

  return (
    <aside className="interactive-ward-panel" aria-label={`Details for ${currentDistrict.name}`}>
      {/* Header */}
      <div className="interactive-ward-panel__head">
        <div className="interactive-ward-panel__head-info">
          <h2 className="interactive-ward-panel__title">{currentDistrict.name}</h2>
          <p className="interactive-ward-panel__zone">{currentDistrict.zone}</p>
        </div>

        <div className="interactive-ward-panel__head-actions">
          <span className={`interactive-ward-panel__badge interactive-ward-panel__badge--${currentDistrict.risk}`}>
            <AlertTriangle size={12} aria-hidden="true" />
            <span>{currentDistrict.riskLabel}</span>
          </span>
          <button
            type="button"
            className="interactive-ward-panel__close-btn"
            onClick={onClose}
            aria-label="Close panel"
            title="Close details"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <nav className="interactive-ward-panel__tabs" aria-label="District details sections">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`interactive-ward-panel__tab ${
              activeTab === tab.id ? 'interactive-ward-panel__tab--active' : ''
            }`}
            onClick={() => setActiveTab(tab.id)}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="interactive-ward-panel__content">
        {activeTab === 'overview' && (
          <div className="interactive-ward-overview">
            {/* 2x2 Metric Cards Grid */}
            <div className="interactive-ward-metrics-grid">
              {/* Card 1: Water Stress Index */}
              <div className="interactive-ward-metric-card">
                <GaugeRingArc percent={Math.round((currentDistrict.wsi || 0.87) * 100)} />
                <div className="interactive-ward-metric-card__info">
                  <span className="interactive-ward-metric-card__val">
                    {currentDistrict.wsi ? currentDistrict.wsi.toFixed(2) : '0.87'}
                  </span>
                  <span className="interactive-ward-metric-card__lbl">Water Stress Index</span>
                </div>
              </div>

              {/* Card 2: Population */}
              <div className="interactive-ward-metric-card">
                <div className="interactive-ward-metric-card__icon interactive-ward-metric-card__icon--green">
                  <Users size={17} aria-hidden="true" />
                </div>
                <div className="interactive-ward-metric-card__info">
                  <span className="interactive-ward-metric-card__val">{currentDistrict.population || '240,000'}</span>
                  <span className="interactive-ward-metric-card__lbl">Population</span>
                </div>
              </div>

              {/* Card 3: Annual Rainfall */}
              <div className="interactive-ward-metric-card">
                <div className="interactive-ward-metric-card__icon interactive-ward-metric-card__icon--blue">
                  <CloudRain size={17} aria-hidden="true" />
                </div>
                <div className="interactive-ward-metric-card__info">
                  <span className="interactive-ward-metric-card__val">{currentDistrict.rainfall || '520 mm'}</span>
                  <span className="interactive-ward-metric-card__lbl">Annual Rainfall</span>
                </div>
              </div>

              {/* Card 4: Water Demand */}
              <div className="interactive-ward-metric-card">
                <div className="interactive-ward-metric-card__icon interactive-ward-metric-card__icon--blue">
                  <Droplet size={17} aria-hidden="true" />
                </div>
                <div className="interactive-ward-metric-card__info">
                  <span className="interactive-ward-metric-card__val">{currentDistrict.demand || '124 MLD'}</span>
                  <span className="interactive-ward-metric-card__lbl">Water Demand</span>
                </div>
              </div>
            </div>

            {/* Water Stress Index Trend Chart Section */}
            <div className="interactive-ward-trend-sec">
              <div className="interactive-ward-trend-sec__head">
                <h4 className="interactive-ward-trend-sec__title">Water Stress Index Trend</h4>
                <div className="interactive-ward-trend-sec__select-wrap">
                  <select
                    className="native-select interactive-ward-trend-sec__select"
                    value={trendRange}
                    onChange={(e) => setTrendRange(e.target.value)}
                    aria-label="Select trend range"
                  >
                    {WSI_TREND_RANGE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="interactive-ward-trend-sec__chart">
                <ResponsiveContainer width="100%" height={92}>
                  <AreaChart data={trendData} margin={{ top: 6, right: 8, bottom: 0, left: -4 }}>
                    <defs>
                      <linearGradient id="wardTrendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity={0.22} />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="year"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 9.5, fill: '#64748b' }}
                    />
                    <YAxis
                      domain={[0, 1]}
                      ticks={[0, 0.5, 1]}
                      tickFormatter={(v) => v.toFixed(1)}
                      tickLine={false}
                      axisLine={false}
                      width={28}
                      tick={{ fontSize: 9.5, fill: '#64748b' }}
                    />
                    <Tooltip content={<TrendChartTooltip />} cursor={{ stroke: '#fca5a5' }} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#ef4444"
                      strokeWidth={2.2}
                      fill="url(#wardTrendGrad)"
                      dot={{ r: 3, fill: '#ef4444', stroke: '#ffffff', strokeWidth: 1.4 }}
                      activeDot={{ r: 4.5, fill: '#ef4444' }}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Key Insights List */}
            <div className="interactive-ward-insights-sec">
              <h4 className="interactive-ward-insights-sec__title">Key Insights</h4>
              <ul className="interactive-ward-insights-list">
                <li className="interactive-ward-insight-item">
                  <span className="interactive-ward-insight-item__icon interactive-ward-insight-item__icon--red">
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </span>
                  <span className="interactive-ward-insight-item__text">
                    18% increase in WSI in the last 3 years
                  </span>
                </li>

                <li className="interactive-ward-insight-item">
                  <span className="interactive-ward-insight-item__icon interactive-ward-insight-item__icon--blue">
                    <CloudRain size={13} aria-hidden="true" />
                  </span>
                  <span className="interactive-ward-insight-item__text">
                    Lower than average rainfall
                  </span>
                </li>

                <li className="interactive-ward-insight-item">
                  <span className="interactive-ward-insight-item__icon interactive-ward-insight-item__icon--blue">
                    <Droplet size={13} aria-hidden="true" />
                  </span>
                  <span className="interactive-ward-insight-item__text">
                    High and growing water demand
                  </span>
                </li>

                <li className="interactive-ward-insight-item">
                  <span className="interactive-ward-insight-item__icon interactive-ward-insight-item__icon--red">
                    <ArrowDown size={13} aria-hidden="true" />
                  </span>
                  <span className="interactive-ward-insight-item__text">
                    Groundwater levels declining
                  </span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="interactive-ward-actions">
              <button
                type="button"
                className="interactive-ward-btn interactive-ward-btn--primary"
                onClick={() => onCompare?.(currentDistrict)}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <BarChart2 size={15} aria-hidden="true" />
                Compare Districts
              </button>
            </div>
          </div>
        )}

        {activeTab === 'risk-factors' && <WardRiskFactorsTab />}
        {activeTab === 'trends' && <WardTrendsTab />}
        {activeTab === 'recommendations' && <WardRecommendationsTab />}
      </div>
    </aside>
  )
}

export default InteractiveWardPanel
