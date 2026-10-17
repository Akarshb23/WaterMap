import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DATA_TRENDS_DATA } from '../../data/dataSourcesData.js'

const TABS = [
  { id: 'rainfall', label: 'Rainfall' },
  { id: 'groundwater', label: 'Groundwater' },
  { id: 'waterDemand', label: 'Water Demand' },
]

/** Custom tooltip for the Data Trends dual-axis chart */
const TrendsTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="ds-trends-tooltip">
        <p className="ds-trends-tooltip__year">{label}</p>
        {payload.map((entry) => (
          <div key={entry.name || entry.dataKey} className="ds-trends-tooltip__row">
            <span
              className="ds-trends-tooltip__dot"
              style={{ backgroundColor: entry.color }}
            />
            <span className="ds-trends-tooltip__label">{entry.name}:</span>
            <span className="ds-trends-tooltip__val">
              {entry.value}
              {entry.dataKey === 'temperature' ? ' °C' : ''}
              {entry.dataKey === 'rainfall' ? ' mm' : ''}
              {entry.dataKey === 'depth' ? ' m bgl' : ''}
              {entry.dataKey === 'recharge' ? ' MLD' : ''}
              {entry.dataKey === 'demand' || entry.dataKey === 'supply' ? ' MLD' : ''}
              {entry.dataKey === 'deficit' ? '%' : ''}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

/**
 * Data Trends dual-axis chart card with interactive tabs.
 */
const DataTrendsChart = ({
  activeTab = 'rainfall',
  onTabChange,
}) => {
  const currentData = DATA_TRENDS_DATA[activeTab] || DATA_TRENDS_DATA.rainfall

  return (
    <article className="card datasources-trends-card" aria-labelledby="trends-title">
      <header className="datasources-trends-card__header">
        <div className="datasources-trends-card__title-wrap">
          <h3 className="datasources-trends-card__title" id="trends-title">
            Data Trends
          </h3>
          <p className="datasources-trends-card__subtitle">
            Sample historical trends from key data sources.
          </p>
        </div>

        {/* Tab Switcher (Rainfall / Groundwater / Water Demand) */}
        <div className="datasources-trends-card__tabs" role="tablist" aria-label="Select trend dataset">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`datasources-trends-card__tab-btn ${
                activeTab === tab.id ? 'datasources-trends-card__tab-btn--active' : ''
              }`}
              onClick={() => onTabChange(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Chart Canvas */}
      <div className="datasources-trends-card__chart-wrapper">
        {/* Left Y Axis Label */}
        <span className="ds-chart-axis-label ds-chart-axis-label--left">
          {activeTab === 'rainfall' && 'Rainfall (mm)'}
          {activeTab === 'groundwater' && 'Depth (m bgl)'}
          {activeTab === 'waterDemand' && 'Water Flow (MLD)'}
        </span>

        {/* Right Y Axis Label */}
        <span className="ds-chart-axis-label ds-chart-axis-label--right">
          {activeTab === 'rainfall' && 'Temperature (°C)'}
          {activeTab === 'groundwater' && 'Recharge (MLD)'}
          {activeTab === 'waterDemand' && 'Deficit (%)'}
        </span>

        <ResponsiveContainer width="100%" height={210}>
          <ComposedChart
            data={currentData}
            margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf2f4" />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={{ stroke: '#e2ecef' }}
              tick={{ fill: '#637783', fontSize: 11 }}
            />

            {/* Left Y-Axis */}
            {activeTab === 'rainfall' && (
              <YAxis
                yAxisId="left"
                domain={[0, 500]}
                ticks={[0, 100, 200, 300, 400, 500]}
                tickLine={false}
                axisLine={{ stroke: '#e2ecef' }}
                tick={{ fill: '#637783', fontSize: 11 }}
              />
            )}
            {activeTab === 'groundwater' && (
              <YAxis
                yAxisId="left"
                domain={[0, 30]}
                ticks={[0, 10, 20, 30]}
                tickLine={false}
                axisLine={{ stroke: '#e2ecef' }}
                tick={{ fill: '#637783', fontSize: 11 }}
              />
            )}
            {activeTab === 'waterDemand' && (
              <YAxis
                yAxisId="left"
                domain={[0, 1500]}
                ticks={[0, 500, 1000, 1500]}
                tickLine={false}
                axisLine={{ stroke: '#e2ecef' }}
                tick={{ fill: '#637783', fontSize: 11 }}
              />
            )}

            {/* Right Y-Axis */}
            {activeTab === 'rainfall' && (
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 40]}
                ticks={[0, 10, 20, 30, 40]}
                tickLine={false}
                axisLine={{ stroke: '#e2ecef' }}
                tick={{ fill: '#637783', fontSize: 11 }}
              />
            )}
            {activeTab === 'groundwater' && (
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickLine={false}
                axisLine={{ stroke: '#e2ecef' }}
                tick={{ fill: '#637783', fontSize: 11 }}
              />
            )}
            {activeTab === 'waterDemand' && (
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 30]}
                ticks={[0, 10, 20, 30]}
                tickLine={false}
                axisLine={{ stroke: '#e2ecef' }}
                tick={{ fill: '#637783', fontSize: 11 }}
              />
            )}

            <Tooltip content={<TrendsTooltip />} />

            {/* Series based on active tab */}
            {activeTab === 'rainfall' && (
              <>
                <Bar
                  yAxisId="left"
                  dataKey="rainfall"
                  name="Annual Rainfall (mm)"
                  fill="#93c5fd"
                  radius={[3, 3, 0, 0]}
                  barSize={18}
                  isAnimationActive={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="temperature"
                  name="Average Temperature (°C)"
                  stroke="#0f9d6e"
                  strokeWidth={2}
                  dot={{ r: 3.5, fill: '#0f9d6e', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#0f9d6e' }}
                  isAnimationActive={false}
                />
              </>
            )}

            {activeTab === 'groundwater' && (
              <>
                <Bar
                  yAxisId="left"
                  dataKey="depth"
                  name="Depth to Water (m bgl)"
                  fill="#60a5fa"
                  radius={[3, 3, 0, 0]}
                  barSize={18}
                  isAnimationActive={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="recharge"
                  name="Annual Recharge (MLD)"
                  stroke="#0f9d6e"
                  strokeWidth={2}
                  dot={{ r: 3.5, fill: '#0f9d6e', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#0f9d6e' }}
                  isAnimationActive={false}
                />
              </>
            )}

            {activeTab === 'waterDemand' && (
              <>
                <Bar
                  yAxisId="left"
                  dataKey="demand"
                  name="Water Demand (MLD)"
                  fill="#93c5fd"
                  radius={[3, 3, 0, 0]}
                  barSize={14}
                  isAnimationActive={false}
                />
                <Bar
                  yAxisId="left"
                  dataKey="supply"
                  name="Water Supply (MLD)"
                  fill="#34d399"
                  radius={[3, 3, 0, 0]}
                  barSize={14}
                  isAnimationActive={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="deficit"
                  name="Supply Deficit (%)"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 3.5, fill: '#ef4444', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#ef4444' }}
                  isAnimationActive={false}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>

        {/* Legend at bottom matching screenshot */}
        <div className="datasources-trends-card__legend" aria-hidden="true">
          {activeTab === 'rainfall' && (
            <>
              <div className="datasources-trends-card__legend-item">
                <span className="ds-legend-bar ds-legend-bar--blue" />
                <span>Annual Rainfall (mm)</span>
              </div>
              <div className="datasources-trends-card__legend-item">
                <span className="ds-legend-line ds-legend-line--green" />
                <span>Average Temperature (°C)</span>
              </div>
            </>
          )}

          {activeTab === 'groundwater' && (
            <>
              <div className="datasources-trends-card__legend-item">
                <span className="ds-legend-bar ds-legend-bar--blue" />
                <span>Depth to Water (m bgl)</span>
              </div>
              <div className="datasources-trends-card__legend-item">
                <span className="ds-legend-line ds-legend-line--green" />
                <span>Annual Recharge (MLD)</span>
              </div>
            </>
          )}

          {activeTab === 'waterDemand' && (
            <>
              <div className="datasources-trends-card__legend-item">
                <span className="ds-legend-bar ds-legend-bar--blue" />
                <span>Water Demand (MLD)</span>
              </div>
              <div className="datasources-trends-card__legend-item">
                <span className="ds-legend-bar ds-legend-bar--mint" />
                <span>Water Supply (MLD)</span>
              </div>
              <div className="datasources-trends-card__legend-item">
                <span className="ds-legend-line ds-legend-line--red" />
                <span>Supply Deficit (%)</span>
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  )
}

export default DataTrendsChart
