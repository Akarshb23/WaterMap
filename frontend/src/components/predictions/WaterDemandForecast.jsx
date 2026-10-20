import { useState } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const DEFAULT_DEMAND_DATA = [
  { year: '2020', demand: 105 },
  { year: '2022', demand: 140 },
  { year: '2024', demand: 170 },
  { year: '2026', demand: 205 },
  { year: '2028', demand: 240 },
  { year: '2030', demand: 250 },
]

const WaterDemandForecast = ({ data = DEFAULT_DEMAND_DATA }) => {
  const [selectedArea, setSelectedArea] = useState('City Wide')
  const chartData = data && data.length > 0 ? data : DEFAULT_DEMAND_DATA

  return (
    <section className="card forecast-card demand-card" aria-label="Water Demand Forecast">
      <div className="card__header demand-card__header">
        <h2 className="card__title">Water Demand Forecast</h2>
        <select
          className="native-select pred-small-select"
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          aria-label="Select area for demand forecast"
        >
          <option value="City Wide">City Wide</option>
          <option value="North Delhi">North Delhi</option>
          <option value="South Delhi">South Delhi</option>
          <option value="Central Delhi">Central Delhi</option>
        </select>
      </div>

      <div className="forecast-card__chart" style={{ height: 165 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2589e9" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2589e9" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#f1f5f9" vertical={false} strokeDasharray="3 3" />

            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fontSize: 11, fill: '#64748b' }}
            />
            <YAxis
              domain={[0, 300]}
              ticks={[0, 100, 200, 300]}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fontSize: 11, fill: '#64748b' }}
              label={{
                value: 'Demand (MLD)',
                angle: -90,
                position: 'insideLeft',
                offset: 20,
                fontSize: 10,
                fill: '#64748b',
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
              formatter={(val) => [`${val} MLD`, 'Water Demand']}
            />

            <Area
              type="monotone"
              dataKey="demand"
              fill="url(#demandGradient)"
              stroke="none"
              isAnimationActive={false}
            />

            <Line
              type="monotone"
              dataKey="demand"
              name="Water Demand"
              stroke="#2589e9"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#2589e9', stroke: '#ffffff', strokeWidth: 1.5 }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default WaterDemandForecast
