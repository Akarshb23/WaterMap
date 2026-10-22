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

const REGIONAL_DEMAND_DATA = {
  'State Wide': [
    { year: '2020', demand: 112 },
    { year: '2022', demand: 118 },
    { year: '2024', demand: 124 },
    { year: '2026', demand: 132 },
    { year: '2028', demand: 142 },
    { year: '2030', demand: 151 },
  ],
  'North Zone': [
    { year: '2020', demand: 88 },
    { year: '2022', demand: 94 },
    { year: '2024', demand: 101 },
    { year: '2026', demand: 109 },
    { year: '2028', demand: 118 },
    { year: '2030', demand: 126 },
  ],
  'South Zone': [
    { year: '2020', demand: 145 },
    { year: '2022', demand: 156 },
    { year: '2024', demand: 168 },
    { year: '2026', demand: 182 },
    { year: '2028', demand: 198 },
    { year: '2030', demand: 215 },
  ],
  'Central Zone': [
    { year: '2020', demand: 102 },
    { year: '2022', demand: 108 },
    { year: '2024', demand: 115 },
    { year: '2026', demand: 123 },
    { year: '2028', demand: 131 },
    { year: '2030', demand: 140 },
  ],
  'West Zone': [
    { year: '2020', demand: 92 },
    { year: '2022', demand: 98 },
    { year: '2024', demand: 104 },
    { year: '2026', demand: 110 },
    { year: '2028', demand: 117 },
    { year: '2030', demand: 125 },
  ],
}

const WaterDemandForecast = ({ data }) => {
  const [selectedArea, setSelectedArea] = useState('State Wide')
  const chartData = (data && data.length > 0 && selectedArea === 'State Wide') 
    ? data 
    : (REGIONAL_DEMAND_DATA[selectedArea] || REGIONAL_DEMAND_DATA['State Wide'])

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
          <option value="State Wide">State Wide</option>
          <option value="North Zone">North Zone</option>
          <option value="South Zone">South Zone</option>
          <option value="Central Zone">Central Zone</option>
          <option value="West Zone">West Zone</option>
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
