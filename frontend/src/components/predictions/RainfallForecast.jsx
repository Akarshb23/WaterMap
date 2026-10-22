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

const REGIONAL_RAINFALL_DATA = {
  'State Wide': [
    { year: '2020', rain: 920, trend: 920 },
    { year: '2022', rain: 870, trend: 850 },
    { year: '2024', rain: 780, trend: 780 },
    { year: '2026', rain: 720, trend: 720 },
    { year: '2028', rain: 680, trend: 660 },
    { year: '2030', rain: 610, trend: 610 },
  ],
  'Coastal / West Zone': [
    { year: '2020', rain: 3450, trend: 3400 },
    { year: '2022', rain: 3320, trend: 3280 },
    { year: '2024', rain: 3100, trend: 3120 },
    { year: '2026', rain: 2950, trend: 2980 },
    { year: '2028', rain: 2880, trend: 2850 },
    { year: '2030', rain: 2750, trend: 2720 },
  ],
  'North Zone (Dry Semi-Arid)': [
    { year: '2020', rain: 620, trend: 620 },
    { year: '2022', rain: 580, trend: 570 },
    { year: '2024', rain: 510, trend: 510 },
    { year: '2026', rain: 480, trend: 475 },
    { year: '2028', rain: 450, trend: 440 },
    { year: '2030', rain: 410, trend: 410 },
  ],
  'South Zone': [
    { year: '2020', rain: 860, trend: 860 },
    { year: '2022', rain: 810, trend: 790 },
    { year: '2024', rain: 740, trend: 740 },
    { year: '2026', rain: 690, trend: 685 },
    { year: '2028', rain: 640, trend: 630 },
    { year: '2030', rain: 590, trend: 580 },
  ],
  'Central Zone (Malnad/Plains)': [
    { year: '2020', rain: 1150, trend: 1150 },
    { year: '2022', rain: 1080, trend: 1060 },
    { year: '2024', rain: 990, trend: 990 },
    { year: '2026', rain: 920, trend: 915 },
    { year: '2028', rain: 860, trend: 850 },
    { year: '2030', rain: 800, trend: 790 },
  ],
}

const RainfallForecast = ({ data }) => {
  const [selectedArea, setSelectedArea] = useState('State Wide')
  const chartData = (data && data.length > 0 && selectedArea === 'State Wide') 
    ? data 
    : (REGIONAL_RAINFALL_DATA[selectedArea] || REGIONAL_RAINFALL_DATA['State Wide'])

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
          <option value="State Wide">State Wide</option>
          <option value="Coastal / West Zone">Coastal / West Zone</option>
          <option value="North Zone (Dry Semi-Arid)">North Zone (Dry Semi-Arid)</option>
          <option value="South Zone">South Zone</option>
          <option value="Central Zone (Malnad/Plains)">Central Zone (Malnad/Plains)</option>
        </select>
      </div>

      {!chartData || chartData.length === 0 ? (
        <div className="forecast-card__chart forecast-card__chart--empty" style={{ height: 165 }}>
          <p role="status">Not available</p>
        </div>
      ) : (
        <div className="forecast-card__chart" style={{ height: 165 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
            >
              <CartesianGrid stroke="#f1f5f9" vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey={chartData[0]?.year ? 'year' : 'month'}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <YAxis
                domain={[0, selectedArea.includes('Coastal') ? 4000 : 1400]}
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