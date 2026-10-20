import { useState } from 'react'
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

const DEFAULT_RAINFALL_YEARS = [
  { year: '2020', rain: 920, trend: 920 },
  { year: '2022', rain: 870, trend: 850 },
  { year: '2024', rain: 780, trend: 780 },
  { year: '2026', rain: 720, trend: 720 },
  { year: '2028', rain: 680, trend: 660 },
  { year: '2030', rain: 610, trend: 610 },
]

const RainfallForecast = ({ data = DEFAULT_RAINFALL_YEARS }) => {
  const [selectedArea, setSelectedArea] = useState('City Wide')
  const hasData = Array.isArray(data) && data.length > 0

  return (
    <section className="card forecast-card rainfall-card" aria-label="Rainfall Forecast">
      <div className="card__header rainfall-card__header">
        <h2 className="card__title">Rainfall Forecast</h2>
        <select
          className="native-select pred-small-select"
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          aria-label="Select area for rainfall forecast"
        >
          <option value="City Wide">City Wide</option>
          <option value="North Bangalore">North Bangalore</option>
          <option value="South Bangalore">South Bangalore</option>
          <option value="Central Bangalore">Central Bangalore</option>
          <option value="East Bangalore">East Bangalore</option>
          <option value="West Bangalore">West Bangalore</option>
        </select>
      </div>

      {!hasData ? (
        <div className="forecast-card__chart forecast-card__chart--empty" style={{ height: 165 }}>
          <p role="status">Not available</p>
        </div>
      ) : (
        <div className="forecast-card__chart" style={{ height: 165 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
            >
              <CartesianGrid stroke="#f1f5f9" vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey={data[0]?.year ? 'year' : 'month'}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <YAxis
                domain={[0, 1200]}
                ticks={[0, 400, 800, 1200]}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fontSize: 11, fill: '#64748b' }}
                label={{
                  value: 'Rainfall (mm)',
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
                formatter={(val) => [`${val} mm`, 'Rainfall']}
              />
              <Bar
                dataKey="rain"
                name="Rainfall"
                fill="#86efac"
                radius={[3, 3, 0, 0]}
                barSize={18}
                isAnimationActive={false}
              />
              <Line
                dataKey="trend"
                name="Trend"
                stroke="#22c55e"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}

export default RainfallForecast