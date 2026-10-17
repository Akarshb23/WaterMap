import { ArrowRight, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.js'
import { TOP_HIGH_RISK_WARDS } from '../../data/demoData.js'
import Badge from '../common/Badge.jsx'

/**
 * Ranked table of the highest water-stress wards with WSI badges and
 * red trend indicators.
 */
const HighRiskWards = ({ wards = TOP_HIGH_RISK_WARDS }) => (
  <section className="card dashboard-card" aria-labelledby="high-risk-wards-title">
    <div className="card__header">
      <h2 className="card__title" id="high-risk-wards-title">
        Top High-Risk Wards
      </h2>
    </div>

    <div className="wards-table-wrap">
      <table className="wards-table">
        <caption className="sr-only">Wards ranked by water stress index</caption>
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Ward</th>
            <th scope="col">WSI</th>
            <th scope="col">Population</th>
            <th scope="col">Trend</th>
          </tr>
        </thead>
        <tbody>
          {wards.map((ward) => (
            <tr key={ward.rank}>
              <td>
                <span className="ward-rank">{ward.rank}</span>
              </td>
              <td className="ward-name">{ward.name}</td>
              <td>
                <Badge tone="danger">{ward.wsi}</Badge>
              </td>
              <td>{ward.population}</td>
              <td>
                <span className="ward-trend">
                  <TrendingUp size={13} aria-hidden="true" />
                  {ward.trend}
                  <span className="sr-only"> increase</span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="dashboard-card__footer">
      <Link className="link-action" to={ROUTES.CITY_MAP}>
        View All Wards
        <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </div>
  </section>
)

export default HighRiskWards
