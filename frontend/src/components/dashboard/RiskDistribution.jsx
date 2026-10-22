import { useEffect, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { RISK_DISTRIBUTION, RISK_DISTRIBUTION_TOTAL } from '../../data/demoData.js'
import { fetchDistrictsGeoJSON } from '../../services/districtMapService.js'

/**
 * Water stress distribution donut chart showing authentic Karnataka district data:
 * 31 Districts (19 Low Risk, 7 Moderate Risk, 5 High Risk).
 */
const RiskDistribution = ({ data: initialData = RISK_DISTRIBUTION, total: initialTotal = RISK_DISTRIBUTION_TOTAL }) => {
  const [data, setData] = useState(initialData)
  const [total, setTotal] = useState(initialTotal)

  useEffect(() => {
    let isMounted = true

    async function loadLiveDistribution() {
      try {
        const geojson = await fetchDistrictsGeoJSON()
        if (!isMounted || !geojson?.features?.length) return

        let high = 0
        let moderate = 0
        let low = 0

        geojson.features.forEach((f) => {
          const risk = String(f.properties?.risk_category || 'moderate').toLowerCase()
          if (risk === 'high' || risk === 'critical') high += 1
          else if (risk === 'moderate') moderate += 1
          else low += 1
        })

        const count = high + moderate + low
        if (count > 0) {
          setData([
            { name: 'High Risk', value: high, percent: `${((high / count) * 100).toFixed(1)}%`, color: '#EF4444' },
            { name: 'Moderate Risk', value: moderate, percent: `${((moderate / count) * 100).toFixed(1)}%`, color: '#F59E0B' },
            { name: 'Low Risk', value: low, percent: `${((low / count) * 100).toFixed(1)}%`, color: '#10B981' },
          ])
          setTotal({ value: count, label: 'Districts' })
        }
      } catch {
        // Keep Karnataka default state
      }
    }

    loadLiveDistribution()
    return () => {
      isMounted = false
    }
  }, [])

  return (
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
              <Tooltip
                formatter={(val, name) => [`${val} districts`, name]}
                contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }}
              />
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
}

export default RiskDistribution
