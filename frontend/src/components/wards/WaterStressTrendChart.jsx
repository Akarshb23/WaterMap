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
import { WSI_TREND, WSI_TREND_RANGE_OPTIONS } from '../../data/wardDetailsData.js'

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
 * Water Stress Index trend chart card: red line with circular points and
 * a light red area fill, years on the x-axis and a 0–1 y-axis. The range
 * dropdown slices the illustrative 5-year series (last 3 or last 5 years)
 * — it does not fabricate data for other periods.
 */
const WaterStressTrendChart = () => {
  const [range, setRange] = useState('5')
  const data = WSI_TREND.slice(-Number(range))

  return (
    <section className="card dashboard-card" aria-labelledby="ward-wsi-trend-title">
      <div className="card__header">
        <h2 className="card__title" id="ward-wsi-trend-title">
          Water Stress Index Trend
        </h2>
        <div>
          <label className="sr-only" htmlFor="ward-wsi-trend-range">
            Trend period
          </label>
          <select
            id="ward-wsi-trend-range"
            className="native-select"
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

      <div className="ward-wsi-trend__chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: -18 }}>
            <defs>
              <linearGradient id="wardWsiPageAreaFill" x1="0" y1="0" x2="0" y2="1">
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
              ticks={[0, 0.25, 0.5, 0.75, 1]}
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
              fill="url(#wardWsiPageAreaFill)"
              dot={{ r: 3.5, fill: '#EF4444', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default WaterStressTrendChart
