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

/** Tooltip showing both the WSI and rainfall values for a year. */
const HistoryTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) {
    return null
  }
  const wsi = payload.find((entry) => entry.dataKey === 'wsi')
  const rainfall = payload.find((entry) => entry.dataKey === 'rainfall')
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>
      {wsi ? <p className="chart-tooltip__value">WSI {Number(wsi.value).toFixed(2)}</p> : null}
      {rainfall ? (
        <p className="chart-tooltip__value chart-tooltip__value--blue">
          Rainfall {Number(rainfall.value)} mm
        </p>
      ) : null}
    </div>
  )
}

/**
 * Combined history chart for the Trends tab: annual rainfall as blue bars
 * with the Water Stress Index as a red line on its own 0–1 axis.
 */
const WardTrendsChart = ({ data = [] }) => (
  <div className="ward-history-chart">
    <div className="ward-history-chart__legend" aria-hidden="true">
      <span className="ward-history-chart__key">
        <span className="ward-history-chart__swatch ward-history-chart__swatch--wsi" />
        Water Stress Index
      </span>
      <span className="ward-history-chart__key">
        <span className="ward-history-chart__swatch ward-history-chart__swatch--rain" />
        Annual rainfall
      </span>
    </div>
    <div className="ward-history-chart__plot">
      <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -18 }}>
        <CartesianGrid stroke="#E2ECEF" strokeDasharray="4 4" vertical={false} />
        <XAxis
          dataKey="year"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: '#637783' }}
        />
        <YAxis
          yAxisId="wsi"
          domain={[0, 1]}
          ticks={[0, 0.5, 1]}
          tickFormatter={(value) => value.toFixed(1)}
          tickLine={false}
          axisLine={false}
          width={40}
          tick={{ fontSize: 11, fill: '#637783' }}
        />
        <YAxis
          yAxisId="rainfall"
          orientation="right"
          domain={[0, 800]}
          ticks={[0, 400, 800]}
          tickLine={false}
          axisLine={false}
          width={38}
          tick={{ fontSize: 11, fill: '#637783' }}
        />
        <Tooltip content={<HistoryTooltip />} cursor={{ fill: 'rgba(37, 137, 233, 0.06)' }} />
        <Bar
          yAxisId="rainfall"
          dataKey="rainfall"
          fill="#2589E9"
          fillOpacity={0.35}
          radius={[3, 3, 0, 0]}
          barSize={22}
          isAnimationActive={false}
        />
        <Line
          yAxisId="wsi"
          type="monotone"
          dataKey="wsi"
          stroke="#EF4444"
          strokeWidth={2.5}
          dot={{ r: 3.5, fill: '#EF4444', strokeWidth: 0 }}
          activeDot={{ r: 5 }}
          isAnimationActive={false}
        />
      </ComposedChart>
      </ResponsiveContainer>
    </div>
  </div>
)

export default WardTrendsChart
