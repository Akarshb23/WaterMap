import { useMemo } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { buildWsiForecastSeries } from '../../data/simulationData.js'

const AXIS_TICK = { fontSize: 11, fill: '#637783' }
const TOOLTIP_STYLE = {
  borderRadius: 10,
  border: '1px solid #e2ecef',
  fontSize: 12,
  boxShadow: '0 6px 18px rgba(20, 46, 59, 0.12)',
}

const BASELINE_COLOR = '#ef4444'
const SIMULATED_COLOR = '#0f9d6e'

/** Tooltip dot colour per series key. */
const COLOR_BY_KEY = { baseline: BASELINE_COLOR, simulated: SIMULATED_COLOR }

/** De-duplicate tooltip rows (areas share their dataKey with their line). */
const ForecastTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null
  }
  const seen = new Set()
  const rows = payload.filter((item) => {
    if (!item?.dataKey || seen.has(item.dataKey)) {
      return false
    }
    seen.add(item.dataKey)
    return true
  })
  return (
    <div className="impact-tooltip">
      <p className="impact-tooltip__title">{label}</p>
      {rows.map((row) => (
        <p key={row.dataKey}>
          <span
            className="impact-tooltip__dot"
            style={{ backgroundColor: COLOR_BY_KEY[row.dataKey] ?? '#637783' }}
          />
          {row.name}: <strong>{Number(row.value).toFixed(2)}</strong>
        </p>
      ))}
    </div>
  )
}

/**
 * Water Stress Index Forecast: red baseline line vs green simulated line,
 * circular points, soft shaded areas beneath both lines, Y axis 0–1 and
 * X axis 2020–2030. The final values are shown as small labels near the
 * right edge (ReferenceLine labels with a hidden guide line).
 * The simulated series is recomputed from the last run's WSI reduction.
 */
const WaterStressForecast = ({ result }) => {
  const data = useMemo(() => buildWsiForecastSeries(result.wardReduction), [
    result.wardReduction,
  ])
  const last = data[data.length - 1]
  const valuesConverged = Math.abs(last.baseline - last.simulated) < 0.07

  return (
    <section
      className="card forecast-card water-stress-forecast"
      aria-label={`Water stress index forecast for ${result.area.label}`}
    >
      <div className="card__header">
        <div>
          <h2 className="card__title">Water Stress Index Forecast ({result.area.label})</h2>
          <p className="card__subtitle">Baseline vs the selected simulated scenario.</p>
        </div>
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
          {result.scenario.label} (simulated)
        </span>
      </div>

      <div className="forecast-card__chart" style={{ height: 215 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 40, bottom: 0, left: -12 }}>
            <CartesianGrid stroke="#eef4f6" vertical={false} />
            <XAxis dataKey="year" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: '#e2ecef' }} />
            <YAxis
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
              domain={[0, 1]}
              ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]}
              tickFormatter={(value) => value.toFixed(1)}
            />
            <Tooltip content={<ForecastTooltip />} contentStyle={TOOLTIP_STYLE} />

            {/* Soft shaded areas beneath both lines. */}
            <Area
              dataKey="baseline"
              stroke="none"
              fill={BASELINE_COLOR}
              fillOpacity={0.07}
              isAnimationActive={false}
              activeDot={false}
            />
            <Area
              dataKey="simulated"
              stroke="none"
              fill={SIMULATED_COLOR}
              fillOpacity={0.09}
              isAnimationActive={false}
              activeDot={false}
            />

            {/* Lines with circular data points. */}
            <Line
              dataKey="baseline"
              name="Baseline"
              stroke={BASELINE_COLOR}
              strokeWidth={2.25}
              dot={{ r: 3, fill: BASELINE_COLOR, strokeWidth: 0 }}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
            <Line
              dataKey="simulated"
              name={`${result.scenario.label} (simulated)`}
              stroke={SIMULATED_COLOR}
              strokeWidth={2.25}
              dot={{ r: 3, fill: SIMULATED_COLOR, strokeWidth: 0 }}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />

            {/* Final values as small labels near the right edge. */}
            {valuesConverged ? (
              <ReferenceLine
                y={last.baseline}
                stroke="none"
                label={{
                  value: `${last.baseline.toFixed(2)} / ${last.simulated.toFixed(2)}`,
                  position: 'right',
                  fill: '#3d5764',
                  fontSize: 10,
                  fontWeight: 600,
                }}
              />
            ) : (
              <>
                <ReferenceLine
                  y={last.baseline}
                  stroke="none"
                  label={{
                    value: last.baseline.toFixed(2),
                    position: 'right',
                    fill: BASELINE_COLOR,
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                />
                <ReferenceLine
                  y={last.simulated}
                  stroke="none"
                  label={{
                    value: last.simulated.toFixed(2),
                    position: 'right',
                    fill: SIMULATED_COLOR,
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <p className="forecast-card__note">
        Simulated series reflects the last run — illustrative only.
      </p>
    </section>
  )
}

export default WaterStressForecast