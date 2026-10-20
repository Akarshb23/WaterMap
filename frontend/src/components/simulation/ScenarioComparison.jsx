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

const AXIS_TICK = { fontSize: 11, fill: '#64748b' }
const TOOLTIP_STYLE = {
  borderRadius: 8,
  border: '1px solid #e2e8f0',
  fontSize: 12,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
}

const BASELINE_BLUE = '#93c5fd'
const SIMULATED_GREEN = '#34d399'

const formatValue = (metric, value) => {
  if (metric === 'demand') return `${Math.round(value)} MLD`
  if (metric === 'groundwater') return `${Number(value).toFixed(1)} m`
  return `${value} Wards`
}

/**
 * City-wide Comparison card:
 * Side-by-side grouped bars (Baseline 2024 blue vs Simulated 2030 green)
 * with numbers directly on top of each bar, Y-axis "Number of Wards", and metric dropdown.
 */
const ScenarioComparison = ({ result }) => {
  const [metric, setMetric] = useState('wsi')
  const data = useMemo(() => buildCitywideData(result, metric), [result, metric])

  return (
    <section className="card citywide-comparison" aria-label="City-wide comparison">
      <div className="card__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="card__title">City-wide Comparison</h2>
        <div className="citywide-comparison__select">
          <select
            id="citywide-metric-select"
            className="native-select"
            value={metric}
            onChange={(event) => setMetric(event.target.value)}
            style={{
              padding: '4px 10px',
              fontSize: '12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#fff',
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            {CITYWIDE_METRIC_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="forecast-card__legend" style={{ display: 'flex', gap: '14px', marginTop: 4, marginBottom: 8 }}>
        <span className="forecast-card__legend-item" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '11px', color: '#64748b' }}>
          <span
            style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: BASELINE_BLUE }}
            aria-hidden="true"
          />
          Baseline (2024)
        </span>
        <span className="forecast-card__legend-item" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '11px', color: '#64748b' }}>
          <span
            style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: SIMULATED_GREEN }}
            aria-hidden="true"
          />
          Simulated (2030)
        </span>
      </div>

      <div className="citywide-comparison__chart" style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 16, right: 10, bottom: 0, left: -10 }} barGap={3}>
            <CartesianGrid stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="category"
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              interval={0}
            />
            <YAxis
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
              domain={[0, 60]}
              ticks={[0, 20, 40, 60]}
              label={{
                value: 'Number of Wards',
                angle: -90,
                position: 'insideLeft',
                offset: 2,
                style: { fontSize: 10, fill: '#64748b' },
              }}
            />
            <ChartTooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(value, name) => [formatValue(metric, value), name]}
            />
            <Bar
              dataKey="baseline"
              name="Baseline (2024)"
              fill={BASELINE_BLUE}
              radius={[3, 3, 0, 0]}
              barSize={20}
              label={{ position: 'top', fill: '#475569', fontSize: 10.5, fontWeight: 600 }}
              isAnimationActive={false}
            />
            <Bar
              dataKey="simulated"
              name="Simulated (2030)"
              fill={SIMULATED_GREEN}
              radius={[3, 3, 0, 0]}
              barSize={20}
              label={{ position: 'top', fill: '#475569', fontSize: 10.5, fontWeight: 600 }}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default ScenarioComparison