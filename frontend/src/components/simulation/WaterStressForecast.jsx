import { useMemo } from 'react'
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
import { buildWsiForecastSeries } from '../../data/simulationData.js'

const AXIS_TICK = { fontSize: 11, fill: '#64748b' }
const TOOLTIP_STYLE = {
  borderRadius: 8,
  border: '1px solid #e2e8f0',
  fontSize: 12,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
}

const BASELINE_COLOR = '#ef4444'
const SIMULATED_COLOR = '#10b981'

const ForecastTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ padding: '8px 12px', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}>
      <p style={{ fontWeight: 700, marginBottom: 4 }}>{label}</p>
      {payload.map((item) => (
        <p key={item.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '2px 0' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.color }} />
          <span>{item.name}:</span>
          <strong>{Number(item.value).toFixed(2)}</strong>
        </p>
      ))}
    </div>
  )
}

/**
 * Water Stress Index Forecast:
 * Baseline (red) vs Simulated (green) line chart with circular points,
 * soft green gradient under the simulated curve, and end badges (0.82 & 0.46).
 */
const WaterStressForecast = ({ result }) => {
  const data = useMemo(
    () => buildWsiForecastSeries(result.districtReduction ?? result.wardReduction ?? 0.44),
    [result.districtReduction, result.wardReduction],
  )
  const last = data[data.length - 1]

  const renderBaselineEndLabel = (props) => {
    const { index, x, y } = props
    if (index !== data.length - 1) return null
    return (
      <g transform={`translate(${x + 4}, ${y - 10})`}>
        <rect width="32" height="19" rx="4" fill={BASELINE_COLOR} />
        <text x="16" y="13.5" fill="#ffffff" fontSize="10.5" fontWeight="700" textAnchor="middle">
          {Number(last.baseline).toFixed(2)}
        </text>
      </g>
    )
  }

  const renderSimulatedEndLabel = (props) => {
    const { index, x, y } = props
    if (index !== data.length - 1) return null
    return (
      <g transform={`translate(${x + 4}, ${y - 10})`}>
        <rect width="32" height="19" rx="4" fill={SIMULATED_COLOR} />
        <text x="16" y="13.5" fill="#ffffff" fontSize="10.5" fontWeight="700" textAnchor="middle">
          {Number(last.simulated).toFixed(2)}
        </text>
      </g>
    )
  }

  return (
    <section
      className="card forecast-card water-stress-forecast"
      aria-label={`Water stress index forecast for ${result.area.label}`}
    >
      <div className="card__header">
        <h2 className="card__title">
          Water Stress Index Forecast ({result.area.label})
        </h2>
      </div>

      <div className="forecast-card__legend">
        <span className="forecast-card__legend-item">
          <span
            className="forecast-card__legend-swatch"
            style={{ backgroundColor: BASELINE_COLOR }}
            aria-hidden="true"
          />
          Baseline
        </span>
        <span className="forecast-card__legend-item">
          <span
            className="forecast-card__legend-swatch"
            style={{ backgroundColor: SIMULATED_COLOR }}
            aria-hidden="true"
          />
          {result.scenario.label} (Simulated)
        </span>
      </div>

      <div className="forecast-card__chart" style={{ height: 185, marginTop: 8 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 12, right: 42, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="forecastGreenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="year"
              ticks={[2020, 2022, 2024, 2026, 2028, 2030]}
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
              domain={[0, 1]}
              ticks={[0.0, 0.5, 1.0]}
              tickFormatter={(value) => value.toFixed(1)}
            />
            <Tooltip content={<ForecastTooltip />} />

            <Area
              type="monotone"
              dataKey="simulated"
              stroke="none"
              fill="url(#forecastGreenGrad)"
              isAnimationActive={false}
            />

            <Line
              type="monotone"
              dataKey="baseline"
              name="Baseline"
              stroke={BASELINE_COLOR}
              strokeWidth={2.2}
              dot={{ r: 3.5, fill: BASELINE_COLOR, stroke: '#fff', strokeWidth: 1 }}
              activeDot={{ r: 5 }}
              label={renderBaselineEndLabel}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="simulated"
              name={`${result.scenario.label} (Simulated)`}
              stroke={SIMULATED_COLOR}
              strokeWidth={2.2}
              dot={{ r: 3.5, fill: SIMULATED_COLOR, stroke: '#fff', strokeWidth: 1 }}
              activeDot={{ r: 5 }}
              label={renderSimulatedEndLabel}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default WaterStressForecast