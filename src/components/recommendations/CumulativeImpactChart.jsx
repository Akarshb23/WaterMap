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
import { CUMULATIVE_IMPACT_PROJECTION } from '../../data/recommendationsData.js'

const SCOPE_OPTIONS = [
  { value: 'all', label: 'All Recommendations' },
  { value: 'infrastructure', label: 'Infrastructure Focus' },
  { value: 'nature', label: 'Nature-based Focus' },
  { value: 'policy', label: 'Policy Enforced' },
]

/** Custom tooltip for the impact projection chart */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const withoutVal = payload.find((p) => p.dataKey === 'withoutInterventions')?.value
    const withVal = payload.find((p) => p.dataKey === 'withInterventions')?.value
    const delta = withoutVal && withVal ? (((withoutVal - withVal) / withoutVal) * 100).toFixed(0) : 0

    return (
      <div className="impact-chart-tooltip">
        <p className="impact-chart-tooltip__year">{label}</p>
        <div className="impact-chart-tooltip__row">
          <span className="impact-chart-tooltip__dot impact-chart-tooltip__dot--red" />
          <span className="impact-chart-tooltip__label">Without Interventions:</span>
          <span className="impact-chart-tooltip__val">{withoutVal?.toFixed(2)}</span>
        </div>
        <div className="impact-chart-tooltip__row">
          <span className="impact-chart-tooltip__dot impact-chart-tooltip__dot--teal" />
          <span className="impact-chart-tooltip__label">With Interventions:</span>
          <span className="impact-chart-tooltip__val">{withVal?.toFixed(2)}</span>
        </div>
        {delta > 0 && (
          <p className="impact-chart-tooltip__reduction">
            ↓ {delta}% Projected Stress Reduction
          </p>
        )}
      </div>
    )
  }
  return null
}

/**
 * Cumulative Impact Projection line chart for 2024–2030.
 * Plots BAU (Business As Usual) water stress vs water stress with recommended interventions.
 */
const CumulativeImpactChart = () => {
  const [scope, setScope] = useState('all')

  // Modulate data slightly based on selected scope for responsive interaction
  const chartData = CUMULATIVE_IMPACT_PROJECTION.map((point) => {
    if (scope === 'nature') {
      return {
        ...point,
        withInterventions: Number((point.withInterventions * 1.05).toFixed(2)),
      }
    }
    if (scope === 'infrastructure') {
      return {
        ...point,
        withInterventions: Number((point.withInterventions * 1.02).toFixed(2)),
      }
    }
    return point
  })

  return (
    <article className="card cumulative-impact-card" aria-labelledby="cumulative-impact-title">
      <header className="cumulative-impact-card__header">
        <h3 className="cumulative-impact-card__title" id="cumulative-impact-title">
          Cumulative Impact Projection
        </h3>
        <div className="cumulative-impact-card__select-wrap">
          <label className="sr-only" htmlFor="cumulative-impact-scope">
            Projection scope
          </label>
          <select
            id="cumulative-impact-scope"
            className="native-select cumulative-impact-card__select"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
          >
            {SCOPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Chart Legend */}
      <div className="cumulative-impact-card__legend" aria-hidden="true">
        <div className="cumulative-impact-card__legend-item">
          <span className="cumulative-impact-card__legend-dot cumulative-impact-card__legend-dot--red" />
          <span>Without Interventions</span>
        </div>
        <div className="cumulative-impact-card__legend-item">
          <span className="cumulative-impact-card__legend-dot cumulative-impact-card__legend-dot--teal" />
          <span>With Interventions</span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="cumulative-impact-card__chart-wrapper">
        <span className="cumulative-impact-card__y-label" aria-hidden="true">
          Water Stress Index
        </span>
        <ResponsiveContainer width="100%" height={210}>
          <ComposedChart
            data={chartData}
            margin={{ top: 15, right: 15, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="interventionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0f9d6e" stopOpacity={0.16} />
                <stop offset="100%" stopColor="#0f9d6e" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaf0f2" />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={{ stroke: '#e2ecef' }}
              tick={{ fill: '#637783', fontSize: 11 }}
            />
            <YAxis
              domain={[0.0, 1.0]}
              ticks={[0.0, 0.5, 1.0]}
              tickLine={false}
              axisLine={{ stroke: '#e2ecef' }}
              tick={{ fill: '#637783', fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Soft gradient fill under withInterventions */}
            <Area
              type="monotone"
              dataKey="withInterventions"
              fill="url(#interventionGradient)"
              stroke="none"
              isAnimationActive={false}
            />
            {/* Red BAU line */}
            <Line
              type="monotone"
              dataKey="withoutInterventions"
              name="Without Interventions"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#ef4444' }}
              isAnimationActive={false}
            />
            {/* Teal Intervention line */}
            <Line
              type="monotone"
              dataKey="withInterventions"
              name="With Interventions"
              stroke="#0f9d6e"
              strokeWidth={2}
              dot={{ r: 4, fill: '#0f9d6e', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#0f9d6e' }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}

export default CumulativeImpactChart
