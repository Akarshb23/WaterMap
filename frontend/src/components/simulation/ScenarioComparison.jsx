import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { buildCitywideData, CITYWIDE_METRIC_OPTIONS } from '../../data/simulationData.js'

const AXIS_TICK = { fontSize: 10, fill: '#637783' }
const TOOLTIP_STYLE = {
  borderRadius: 10,
  border: '1px solid #e2ecef',
  fontSize: 12,
  boxShadow: '0 6px 18px rgba(20, 46, 59, 0.12)',
}

const BASELINE_BLUE = '#2589e9'
const SIMULATED_GREEN = '#0f9d6e'

/** Unit-aware value formatting per selectable metric. */
const formatValue = (metric, value) => {
  if (metric === 'demand') {
    return `${Math.round(value)} MLD`
  }
  if (metric === 'groundwater') {
    return `${Number(value).toFixed(1)} m`
  }
  return `${value}% of wards`
}

/**
 * City-wide Comparison card: grouped bars (Baseline 2024 blue vs
 * Simulated 2030 green) with a working metric selector. Every dataset is
 * derived from the last run, so the chart updates when "Run Simulation"
 * is clicked. Values are illustrative.
 */
const ScenarioComparison = ({ result }) => {
  const [metric, setMetric] = useState('wsi')

  const data = useMemo(() => buildCitywideData(result, metric), [result, metric])

  return (
    <section className="card citywide-comparison" aria-label="City-wide comparison">
      <div className="card__header">
        <div>
          <h2 className="card__title">City-wide Comparison</h2>
          <p className="card__subtitle">Baseline vs simulated outlook across Delhi.</p>
        </div>
        <div className="citywide-comparison__select">
          <label className="sr-only" htmlFor="citywide-metric-select">
            Comparison metric
          </label>
          <select
            id="citywide-metric-select"
            className="native-select"
            value={metric}
            onChange={(event) => setMetric(event.target.value)}
          >
            {CITYWIDE_METRIC_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="forecast-card__legend">
        <span className="forecast-card__legend-item">
          <span
            className="forecast-card__legend-swatch"
            style={{ backgroundColor: BASELINE_BLUE }}
            aria-hidden="true"
          />
          Baseline (2024)
        </span>
        <span className="forecast-card__legend-item">
          <span
            className="forecast-card__legend-swatch"
            style={{ backgroundColor: SIMULATED_GREEN }}
            aria-hidden="true"
          />
          Simulated (2030)
        </span>
      </div>

      <div className="citywide-comparison__chart" style={{ height: 185 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: -22 }} barGap={2}>
            <CartesianGrid stroke="#eef4f6" vertical={false} />
            <XAxis
              dataKey="category"
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={{ stroke: '#e2ecef' }}
              interval={0}
              height={46}
              tickMargin={6}
            />
            <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} domain={[0, 'auto']} />
            <ChartTooltip
              cursor={{ fill: 'rgba(37, 137, 233, 0.05)' }}
              contentStyle={TOOLTIP_STYLE}
              formatter={(value, name) => [formatValue(metric, value), name]}
            />
            <Bar
              dataKey="baseline"
              name="Baseline (2024)"
              fill={BASELINE_BLUE}
              radius={[3, 3, 0, 0]}
              barPercentage={0.72}
              categoryPercentage={0.66}
              isAnimationActive={false}
            />
            <Bar
              dataKey="simulated"
              name="Simulated (2030)"
              fill={SIMULATED_GREEN}
              radius={[3, 3, 0, 0]}
              barPercentage={0.72}
              categoryPercentage={0.66}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="forecast-card__note">Illustrative ward-category distribution for the last run.</p>
    </section>
  )
}

export default ScenarioComparison