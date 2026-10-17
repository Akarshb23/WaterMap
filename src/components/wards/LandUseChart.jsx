import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

/**
 * Land-use composition donut chart for a ward. Percentages sum to 100;
 * the ward's total area share is shown in the centre and a colour legend
 * lists each category with its percentage. Illustrative data only.
 */
const LandUseChart = ({
  data = [],
  total = { value: '100%', label: 'Area' },
}) => (
  <section className="card dashboard-card" aria-labelledby="land-use-title">
    <div className="card__header">
      <h2 className="card__title" id="land-use-title">
        Land Use Distribution
      </h2>
    </div>

    {data.length === 0 ? (
      <p className="ward-card__empty">No land-use data available for this ward.</p>
    ) : (
      <>
        <div className="donut-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={92}
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
              <span className="risk-legend__count">{entry.percent}</span>
            </li>
          ))}
        </ul>
      </>
    )}
  </section>
)

export default LandUseChart
