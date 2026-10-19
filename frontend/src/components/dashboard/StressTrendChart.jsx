import { useState } from 'react'
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { TREND_RANGE_OPTIONS, WATER_STRESS_TREND } from '../../data/demoData.js'

const TrendTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>
      <p className="chart-tooltip__value">WSI {Number(payload[0].value).toFixed(2)}</p>
    </div>
  )
}

const StressTrendChart = ({ data: trendData = WATER_STRESS_TREND }) => {
  const [range, setRange] = useState('12')
  const data = (Array.isArray(trendData) ? trendData : []).slice(-Number(range))

  return (
    <section className="card dashboard-card" aria-labelledby="stress-trend-title">
      <div className="card__header">
        <h2 className="card__title" id="stress-trend-title">Trend: Average Water Stress Index</h2>
        <div>
          <label className="sr-only" htmlFor="trend-range-select">Trend period</label>
          <select id="trend-range-select" className="native-select" value={range} onChange={(event) => setRange(event.target.value)}>
            {TREND_RANGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="trend-chart">
        {data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: -14 }}>
              <defs>
                <linearGradient id="stressAreaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2589E9" stopOpacity={0.24} />
                  <stop offset="100%" stopColor="#2589E9" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#E2ECEF" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#637783' }} interval="preserveStartEnd" />
              <YAxis domain={[0, 1]} ticks={[0, 0.5, 1]} tickFormatter={(value) => value.toFixed(1)} tickLine={false} axisLine={false} width={40} tick={{ fontSize: 11, fill: '#637783' }} />
              <Tooltip content={<TrendTooltip />} cursor={{ stroke: '#C8DDE3' }} />
              <Area type="monotone" dataKey="value" stroke="#2589E9" strokeWidth={2.5} fill="url(#stressAreaFill)" dot={{ r: 3.5, fill: '#2589E9', strokeWidth: 0 }} activeDot={{ r: 5 }} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        ) : <p className="dashboard-empty-state">No trend data is available for this period.</p>}
      </div>
    </section>
  )
}

export default StressTrendChart
