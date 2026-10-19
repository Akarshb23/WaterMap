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

const AXIS_TICK = { fontSize: 11, fill: '#637783' }
const TOOLTIP_STYLE = {
  borderRadius: 10,
  border: '1px solid #e2ecef',
  fontSize: 12,
  boxShadow: '0 6px 18px rgba(20, 46, 59, 0.12)',
}

/**
 * Generic forecast chart card (title, legend, line/area series, note)
 * shared by the Predictions page: Water Demand Forecast, Trend
 * Comparison, Rainfall Forecast etc.
 *
 * Props are data-driven so every card keeps the same compact anatomy:
 * - `series` is `[{ key, label, color, dashed?, fill?, dots?, connectNulls? }]`
 * - `data` is an array of point objects keyed by `xKey` (default `year`)
 * - `yAxis` is `{ label?, domain?, tickFormatter? }`
 * - `headerRight` slots a selector or badge into the card header
 */
const ForecastChart = ({
  title,
  subtitle,
  headerRight = null,
  legend = [],
  data = [],
  series = [],
  xKey = 'year',
  yAxis = {},
  unit,
  note,
  chartHeight = 195,
  className = '',
  emptyMessage = 'Not available',
}) => {
  const classes = ['card', 'forecast-card', className].filter(Boolean).join(' ')

  return (
    <section className={classes} aria-label={title}>
      <div className="card__header">
        <div>
          <h2 className="card__title">{title}</h2>
          {subtitle ? <p className="card__subtitle">{subtitle}</p> : null}
        </div>
        {headerRight}
      </div>

      {legend.length > 0 ? (
        <div className="forecast-card__legend">
          {legend.map((item) => (
            <span className="forecast-card__legend-item" key={item.label}>
              <span
                className={
                  item.dashed
                    ? 'forecast-card__legend-swatch forecast-card__legend-swatch--dashed'
                    : 'forecast-card__legend-swatch'
                }
                style={
                  item.dashed
                    ? { borderTop: `2.5px dashed ${item.color}` }
                    : { backgroundColor: item.color }
                }
                aria-hidden="true"
              />
              {item.label}
            </span>
          ))}
        </div>
      ) : null}

      {/* An empty chart axis would imply data exists. When the backend
          supplies no series, show an explicit gap instead. */}
      {data.length === 0 ? (
        <div
          className="forecast-card__chart forecast-card__chart--empty"
          style={{ height: chartHeight }}
        >
          <p role="status">{emptyMessage}</p>
        </div>
      ) : (
      <div className="forecast-card__chart" style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 10, bottom: 0, left: yAxis.label ? 30 : -8 }}
          >
            <CartesianGrid stroke="#eef4f6" vertical={false} />
            <XAxis
              dataKey={xKey}
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={{ stroke: '#e2ecef' }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
              domain={yAxis.domain ?? ['auto', 'auto']}
              tickFormatter={yAxis.tickFormatter}
              label={
                yAxis.label
                  ? {
                      value: yAxis.label,
                      angle: -90,
                      position: 'insideLeft',
                      offset: 6,
                      style: { fontSize: 11, fill: '#637783' },
                    }
                  : undefined
              }
            />
            <Tooltip
              cursor={{ stroke: '#c8dde2', strokeDasharray: '4 4' }}
              contentStyle={TOOLTIP_STYLE}
              formatter={unit ? (value, name) => [`${value} ${unit}`, name] : undefined}
            />
            {series.map((item) =>
              item.fill ? (
                <Area
                  key={item.key}
                  type="monotone"
                  dataKey={item.key}
                  name={item.label}
                  stroke={item.color}
                  strokeWidth={2}
                  fill={item.color}
                  fillOpacity={0.12}
                  strokeDasharray={item.dashed ? '6 4' : undefined}
                  dot={item.dots ? { r: 2.5, fill: item.color, strokeWidth: 0 } : false}
                  activeDot={{ r: 3.5 }}
                  connectNulls={Boolean(item.connectNulls)}
                  isAnimationActive={false}
                />
              ) : (
                <Line
                  key={item.key}
                  type="monotone"
                  dataKey={item.key}
                  name={item.label}
                  stroke={item.color}
                  strokeWidth={2.25}
                  strokeDasharray={item.dashed ? '6 4' : undefined}
                  dot={item.dots ? { r: 2.5, fill: item.color, strokeWidth: 0 } : false}
                  activeDot={{ r: 3.5 }}
                  connectNulls={Boolean(item.connectNulls)}
                  isAnimationActive={false}
                />
              ),
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      )}

      {note ? <p className="forecast-card__note">{note}</p> : null}
    </section>
  )
}

export default ForecastChart