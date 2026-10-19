import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { WARD_HISTORY, WARD_HISTORY_SUMMARY } from '../../data/wardDetailsData.js'

/**
 * Chart configuration for each historical metric shown on the Trends tab.
 * Each series gets its own small line chart with a matching colour.
 */
const TREND_SERIES = [
  { id: 'wsi', title: 'Water Stress Index', dataKey: 'wsi', color: '#EF4444', decimals: 2 },
  { id: 'rainfall', title: 'Annual Rainfall (mm)', dataKey: 'rainfall', color: '#2589E9', decimals: 0 },
  { id: 'groundwater', title: 'Groundwater Level (m)', dataKey: 'groundwater', color: '#45BD9B', decimals: 1 },
  { id: 'demand', title: 'Water Demand (MLD)', dataKey: 'demand', color: '#F59E0B', decimals: 0 },
]

/** Small styled tooltip matching the dashboard chart tooltip. */
const SeriesTooltip = ({ active, payload, label, decimals, title }) => {
  if (!active || !payload || payload.length === 0) {
    return null
  }
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>
      <p className="chart-tooltip__value">
        {title}: {Number(payload[0].value).toFixed(decimals)}
      </p>
    </div>
  )
}

/** One compact line chart per historical metric. */
const TrendSeriesChart = ({ series, data }) => (
  <div className="ward-series">
    <h3 className="ward-series__title">{series.title}</h3>
    <div className="ward-series__plot">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid stroke="#E2ECEF" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="year"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: '#637783' }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={44}
            tick={{ fontSize: 11, fill: '#637783' }}
          />
          <Tooltip
            content={<SeriesTooltip decimals={series.decimals} title={series.title} />}
            cursor={{ stroke: '#C8DDE3' }}
          />
          <Line
            type="monotone"
            dataKey={series.dataKey}
            stroke={series.color}
            strokeWidth={2.5}
            dot={{ r: 3, fill: series.color, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
)

/**
 * Trends tab: historical summary chips plus a small line chart for each
 * metric (Water Stress Index, rainfall, groundwater level, water demand).
 * All series are illustrative demonstration data.
 */
const WardTrendsTab = () => (
  <section className="card dashboard-card" aria-labelledby="ward-trends-title">
    <div className="card__header">
      <h2 className="card__title" id="ward-trends-title">
        Historical Trends
      </h2>
    </div>

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

    <div className="ward-series-grid">
      {TREND_SERIES.map((series) => (
        <TrendSeriesChart key={series.id} series={series} data={WARD_HISTORY} />
      ))}
    </div>

    <p className="ward-detail__disclaimer">
      Illustrative demonstration data — not live government or sensor readings.
    </p>
  </section>
)

export default WardTrendsTab
