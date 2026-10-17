import { useState } from 'react'
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

/** Small styled tooltip matching the dashboard chart tooltip. */
const TrendTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) {
    return null
  }
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>
      <p className="chart-tooltip__value">WSI {Number(payload[0].value).toFixed(2)}</p>
    </div>
  )
}

/**
 * Water Stress Index trend for the selected ward: red line with circular
 * points and a pale red area fill. The dropdown slices the demo series
 * (last 3 or last 5 years).
 */
const WaterStressTrendChart = () => {
  const [range, setRange] = useState('5')
  const data = WSI_TREND.slice(-Number(range))

  return (
    <div className="ward-trend">
      <div className="ward-trend__head">
        <h4 className="ward-section-title ward-trend__title">Water Stress Index Trend</h4>
        <div>
          <label className="sr-only" htmlFor="ward-trend-range-select">
            Trend period
          </label>
          <select
            id="ward-trend-range-select"
            className="native-select native-select--compact"
            value={range}
            onChange={(event) => setRange(event.target.value)}
          >
            {WSI_TREND_RANGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="ward-trend__chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
            <defs>
              <linearGradient id="wardWsiAreaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF4444" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#EF4444" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#E2ECEF" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#637783' }}
            />
            <YAxis
              domain={[0, 1]}
              ticks={[0, 0.5, 1]}
              tickFormatter={(value) => value.toFixed(1)}
              tickLine={false}
              axisLine={false}
              width={40}
              tick={{ fontSize: 11, fill: '#637783' }}
            />
            <Tooltip content={<TrendTooltip />} cursor={{ stroke: '#F3C2C2' }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#EF4444"
              strokeWidth={2.5}
              fill="url(#wardWsiAreaFill)"
              dot={{ r: 3.5, fill: '#EF4444', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default WaterStressTrendChart
