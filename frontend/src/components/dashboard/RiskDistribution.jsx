import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { RISK_DISTRIBUTION, RISK_DISTRIBUTION_TOTAL } from '../../data/demoData.js'

/**
 * Water stress distribution donut chart with the ward total in the centre
 * and a colour legend underneath.
 */
const RiskDistribution = ({ data = RISK_DISTRIBUTION, total = RISK_DISTRIBUTION_TOTAL }) => (
  <section className="card dashboard-card" aria-labelledby="risk-distribution-title">
    <div className="card__header">
      <h2 className="card__title" id="risk-distribution-title">
        Water Stress Distribution
      </h2>
    </div>

    <div className="risk-distribution-content">
      <div className="donut-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={52}
              outerRadius={74}
              paddingAngle={2}
              startAngle={90}
              endAngle={-270}
              stroke="none"
              isAnimationActive={false}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="donut-center">
          <span className="donut-center__value">{total.value}</span>
          <span className="donut-center__label">{total.label}</span>
        </div>
      </div>

      <ul className="risk-legend">
        {data.map((entry) => (
          <li className="risk-legend__item" key={entry.name}>
            <span
              className="risk-legend__swatch"
              style={{ backgroundColor: entry.color }}
              aria-hidden="true"
            />
            <span className="risk-legend__name">{entry.name}</span>
            <span className="risk-legend__count">{entry.value}</span>
            <span className="risk-legend__percent">({entry.percent})</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
)

export default RiskDistribution
