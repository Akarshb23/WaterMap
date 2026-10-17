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
import { RAINFALL_FORECAST } from '../../data/predictionsData.js'

const AXIS_TICK = { fontSize: 11, fill: '#637783' }
const TOOLTIP_STYLE = {
  borderRadius: 10,
  border: '1px solid #e2ecef',
  fontSize: 12,
  boxShadow: '0 6px 18px rgba(20, 46, 59, 0.12)',
}

const TOTAL_FORECAST_MM = RAINFALL_FORECAST.reduce((total, month) => total + month.rain, 0)

/**
 * Compact monsoon outlook: forecast rainfall bars against the 10-year
 * normal (dashed line). Illustrative demo values in millimetres.
 */
const RainfallForecast = () => (
  <section className="card forecast-card rainfall-card" aria-label="Rainfall forecast">
    <div className="card__header">
      <div>
        <h2 className="card__title">Rainfall Forecast</h2>
        <p className="card__subtitle">Monsoon outlook vs 10-year average.</p>
      </div>
      <span className="badge badge--info">{TOTAL_FORECAST_MM} mm expected</span>
    </div>

    <div className="forecast-card__legend">
      <span className="forecast-card__legend-item">
        <span
          className="forecast-card__legend-swatch"
          style={{ backgroundColor: '#2589e9' }}
          aria-hidden="true"
        />
        Forecast
      </span>
      <span className="forecast-card__legend-item">
        <span
          className="forecast-card__legend-swatch forecast-card__legend-swatch--dashed"
          style={{ borderTop: '2.5px dashed #8aa6bf' }}
          aria-hidden="true"
        />
        10-yr average
      </span>
    </div>

    <div className="forecast-card__chart" style={{ height: 165 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={RAINFALL_FORECAST} margin={{ top: 8, right: 6, bottom: 0, left: -18 }}>
          <CartesianGrid stroke="#eef4f6" vertical={false} />
          <XAxis
            dataKey="month"
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={{ stroke: '#e2ecef' }}
          />
          <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: 'rgba(37, 137, 233, 0.06)' }}
            contentStyle={TOOLTIP_STYLE}
            formatter={(value, name) => [`${value} mm`, name]}
          />
          <Bar
            dataKey="rain"
            name="Forecast"
            fill="#2589e9"
            radius={[4, 4, 0, 0]}
            barSize={20}
            isAnimationActive={false}
          />
          <Line
            dataKey="normal"
            name="10-yr average"
            stroke="#8aa6bf"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  </section>
)

export default RainfallForecast