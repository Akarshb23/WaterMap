import { ArrowDown, ArrowUp } from 'lucide-react'
import { Area, AreaChart, Bar, BarChart, Cell, ResponsiveContainer, YAxis } from 'recharts'

/** Tiny Recharts area used as a KPI sparkline. */
const Sparkline = ({ data, color }) => (
  <div className="metric-card__spark">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={color}
          fillOpacity={0.12}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
)

/** Tiny Recharts bar chart used for the rainfall metric. */
const MiniBars = ({ data, color }) => (
  <div className="metric-card__spark">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }} barCategoryGap="25%">
        <YAxis type="number" hide domain={[0, 'dataMax']} />
        <Bar dataKey="value" fill={color} radius={[2, 2, 0, 0]} isAnimationActive={false}>
          {/* Optional per-bar colours (e.g. historical blue vs projected red). */}
          {data.map((entry, index) => (
            <Cell key={entry.label ?? index} fill={entry.color ?? color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
)

/** Simple CSS progress indicator (used by the high-risk wards metric). */
const Progress = ({ percent, color, label }) => (
  <div className="metric-card__progress" role="img" aria-label={label}>
    <div
      className="metric-card__progress-fill"
      style={{ width: `${percent}%`, backgroundColor: color }}
    />
  </div>
)

/**
 * KPI tile: title, prominent value, icon, trend/note and a small
 * bottom visualisation (sparkline, mini bars or progress bar).
 */
const MetricCard = ({
  title,
  value,
  unit,
  icon: Icon,
  tone = 'blue',
  trend,
  trendDirection = 'up',
  trendTone,
  note,
  visual,
}) => {
  /* An increase can still be a negative signal (e.g. rising water stress),
     so `trendTone="negative"` colours an up-trend red. */
  const isNegativeTrend = trendDirection === 'down' || trendTone === 'negative'

  return (
  <article className="card metric-card">
    <div className="metric-card__head">
      <h3 className="metric-card__title">{title}</h3>
      {Icon ? (
        <span className={`metric-card__icon metric-card__icon--${tone}`}>
          <Icon size={18} aria-hidden="true" />
        </span>
      ) : null}
    </div>

    <p className="metric-card__value">
      {value}
      {unit ? <span className="metric-card__unit">{unit}</span> : null}
    </p>

    {trend ? (
      <p
        className={`metric-card__trend${
          isNegativeTrend ? ' metric-card__trend--down' : ''
        }`}
      >
        {trendDirection === 'down' ? (
          <ArrowDown size={14} aria-hidden="true" />
        ) : (
          <ArrowUp size={14} aria-hidden="true" />
        )}
        {trend}
      </p>
    ) : null}
    {note ? <p className="metric-card__note">{note}</p> : null}

    <div className="metric-card__visual">
      {visual?.type === 'sparkline' ? (
        <Sparkline data={visual.data} color={visual.color} />
      ) : null}
      {visual?.type === 'bars' ? <MiniBars data={visual.data} color={visual.color} /> : null}
      {visual?.type === 'progress' ? (
        <Progress
          percent={visual.percent}
          color={visual.color}
          label={`${visual.percent}% of wards are high risk`}
        />
      ) : null}
    </div>
    </article>
  )
}

export default MetricCard
