import { Info } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from 'recharts'
import InfoTooltip from '../common/Tooltip.jsx'

const AXIS_TICK = { fontSize: 11, fill: '#637783' }
const TOOLTIP_STYLE = {
  borderRadius: 10,
  border: '1px solid #e2ecef',
  fontSize: 12,
  boxShadow: '0 6px 18px rgba(20, 46, 59, 0.12)',
}

const BASELINE_COLOR = '#8aa6bf'
const SIMULATED_COLOR = '#0f9d6e'

/** Tooltip showing the real values behind the indexed bars. */
const ImpactTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length || !payload[0]?.payload) {
    return null
  }
  const row = payload[0].payload
  return (
    <div className="impact-tooltip">
      <p className="impact-tooltip__title">{row.indicator}</p>
      <p>
        <span className="impact-tooltip__dot" style={{ backgroundColor: BASELINE_COLOR }} />
        Baseline (2024): <strong>{row.baselineText}</strong>
      </p>
      <p>
        <span className="impact-tooltip__dot" style={{ backgroundColor: SIMULATED_COLOR }} />
        Simulated (2030): <strong>{row.simulatedText}</strong>
      </p>
      <p className="impact-tooltip__label">{label}</p>
    </div>
  )
}

/**
 * Scenario Impact card: grouped bars for the four indicators. The metrics
 * use different units and scales, so each indicator is INDEXED to its own
 * baseline (baseline = 100); the legend/tooltip/labels keep the real
 * values visible. Rainfall is a context metric and is unchanged by design.
 */
const ScenarioImpactChart = ({ result }) => {
  const rows = [
    {
      key: 'wsi',
      indicator: 'Water Stress Index',
      short: 'WSI',
      baseline: result.baseline.wsi,
      simulated: result.simulated.wsi,
      baselineText: result.baseline.wsi.toFixed(2),
      simulatedText: result.simulated.wsi.toFixed(2),
    },
    {
      key: 'rainfall',
      indicator: 'Annual Rainfall (mm)',
      short: 'Rainfall',
      baseline: result.baseline.rainfall,
      simulated: result.simulated.rainfall,
      baselineText: `${result.baseline.rainfall} mm`,
      simulatedText: `${result.simulated.rainfall} mm`,
    },
    {
      key: 'demand',
      indicator: 'Water Demand (MLD)',
      short: 'Demand',
      baseline: result.baseline.demand,
      simulated: result.simulated.demand,
      baselineText: `${result.baseline.demand} MLD`,
      simulatedText: `${result.simulated.demand} MLD`,
    },
    {
      key: 'groundwater',
      indicator: 'Groundwater Level (m)',
      short: 'GW Level',
      baseline: result.baseline.groundwater,
      simulated: result.simulated.groundwater,
      baselineText: `${result.baseline.groundwater.toFixed(1)} m`,
      simulatedText: `${result.simulated.groundwater.toFixed(1)} m`,
    },
  ].map((row) => ({
    ...row,
    baselineIdx: 100,
    simulatedIdx: Math.round((row.simulated / row.baseline) * 1000) / 10,
  }))

  return (
    <section className="card impact-chart" aria-label={`Scenario impact chart for ${result.area.label}`}>
      <div className="card__header">
        <div>
          <h2 className="card__title">
            Scenario Impact ({result.area.label})
            <InfoTooltip label="Each bar is indexed to its own baseline (baseline = 100), so indicators with different units and scales are never plotted on one unadjusted scale. Hover for real values.">
              <Info size={13} className="chart-info" aria-hidden="true" />
            </InfoTooltip>
          </h2>
          <p className="card__subtitle">
            Baseline vs {result.scenario.label.toLowerCase()} at {result.level.label}, horizon{' '}
            {result.horizon.label}.
          </p>
        </div>
        <div className="forecast-card__legend impact-chart__legend">
          <span className="forecast-card__legend-item">
            <span
              className="forecast-card__legend-swatch"
              style={{ backgroundColor: BASELINE_COLOR }}
              aria-hidden="true"
            />
            Baseline (2024)
          </span>
          <span className="forecast-card__legend-item">
            <span
              className="forecast-card__legend-swatch"
              style={{ backgroundColor: SIMULATED_COLOR }}
              aria-hidden="true"
            />
            Simulated (2030)
          </span>
        </div>
      </div>

      <div className="impact-chart__canvas" style={{ height: 215 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 10, right: 8, bottom: 0, left: -14 }} barGap={2}>
            <CartesianGrid stroke="#eef4f6" vertical={false} />
            <XAxis
              dataKey="short"
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={{ stroke: '#e2ecef' }}
              interval={0}
            />
            <YAxis
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
              domain={[0, 110]}
              ticks={[0, 25, 50, 75, 100]}
              label={{
                value: 'Indexed (baseline = 100)',
                angle: -90,
                position: 'insideLeft',
                offset: 6,
                style: { fontSize: 10, fill: '#637783' },
              }}
            />
            <ChartTooltip
              cursor={{ fill: 'rgba(37, 137, 233, 0.05)' }}
              contentStyle={TOOLTIP_STYLE}
              content={<ImpactTooltip />}
            />
            <Bar
              dataKey="baselineIdx"
              name="Baseline (2024)"
              fill={BASELINE_COLOR}
              radius={[3, 3, 0, 0]}
              barPercentage={0.72}
              categoryPercentage={0.68}
              isAnimationActive={false}
            />
            <Bar
              dataKey="simulatedIdx"
              name="Simulated (2030)"
              fill={SIMULATED_COLOR}
              radius={[3, 3, 0, 0]}
              barPercentage={0.72}
              categoryPercentage={0.68}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="forecast-card__note">
        Bars are indexed to each indicator&apos;s baseline; labels and tooltips show real values.
        Rainfall is unchanged by design.
      </p>
    </section>
  )
}

export default ScenarioImpactChart