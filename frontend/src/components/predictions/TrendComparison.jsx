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

const TREND_DATA = [
  { year: '2020', historical: 0.28, predicted: null, historicalArea: 0.28, predictedArea: null },
  { year: '2022', historical: 0.31, predicted: null, historicalArea: 0.31, predictedArea: null },
  { year: '2024', historical: 0.34, predicted: 0.34, historicalArea: 0.34, predictedArea: 0.34 },
  { year: '2026', historical: null, predicted: 0.38, historicalArea: null, predictedArea: 0.38 },
  { year: '2028', historical: null, predicted: 0.42, historicalArea: null, predictedArea: 0.42 },
  { year: '2030', historical: null, predicted: 0.46, historicalArea: null, predictedArea: 0.46 },
]

const TrendComparison = ({ forecastSeries }) => {
  const chartData = Array.isArray(forecastSeries) && forecastSeries.length > 0 ? forecastSeries : TREND_DATA

  return (
    <section className="card trend-comparison-card" aria-label="Trend Comparison">
      <div className="card__header trend-comparison-card__header">
        <h2 className="card__title">Trend Comparison</h2>
      </div>

      <div className="trend-comparison-legend">
        <span className="trend-legend-item">
          <span className="trend-legend-symbol trend-legend-symbol--historical" />
          <span>Historical</span>
        </span>
        <span className="trend-legend-item">
          <span className="trend-legend-symbol trend-legend-symbol--predicted" />
          <span>Predicted</span>
        </span>
      </div>

      <div className="trend-comparison-chart-wrap" style={{ height: 165 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="histGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2589e9" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2589e9" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="predGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
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
              domain={[0, 1.0]}
              ticks={[0.0, 0.5, 1.0]}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fontSize: 11, fill: '#64748b' }}
              label={{
                value: 'WSI',
                angle: -90,
                position: 'insideLeft',
                offset: 28,
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
              formatter={(value, name) => [value, name === 'historical' ? 'Historical WSI' : 'Predicted WSI']}
            />

            {/* Historical Area */}
            <Area
              type="monotone"
              dataKey="historicalArea"
              fill="url(#histGradient)"
              stroke="none"
              isAnimationActive={false}
            />

            {/* Predicted Area */}
            <Area
              type="monotone"
              dataKey="predictedArea"
              fill="url(#predGradient)"
              stroke="none"
              isAnimationActive={false}
            />

            {/* Historical Line */}
            <Line
              type="monotone"
              dataKey="historical"
              name="Historical"
              stroke="#2589e9"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#2589e9', stroke: '#ffffff', strokeWidth: 1.5 }}
              connectNulls={false}
              isAnimationActive={false}
            />

            {/* Predicted Line */}
            <Line
              type="monotone"
              dataKey="predicted"
              name="Predicted"
              stroke="#ef4444"
              strokeWidth={2.5}
              strokeDasharray="4 4"
              dot={{ r: 4, fill: '#ffffff', stroke: '#ef4444', strokeWidth: 2 }}
              connectNulls={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default TrendComparison