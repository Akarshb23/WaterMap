import { ArrowRight, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.js'
import { TOP_HIGH_RISK_WARDS } from '../../data/demoData.js'
import Badge from '../common/Badge.jsx'

const SparklineTrend = () => (
  <svg width="48" height="18" viewBox="0 0 48 18" fill="none" aria-hidden="true">
    <path
      d="M2 13 C 8 7, 14 16, 20 10 C 26 4, 32 14, 38 8 C 42 5, 45 4, 46 3"
      stroke="#ef4444"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

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
                <span className="ward-trend" title={`${ward.trend} increase`}>
                  <SparklineTrend />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="dashboard-card__footer dashboard-card__footer--left">
      <Link className="link-action" to={ROUTES.CITY_MAP}>
        View All Wards
        <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </div>
  </section>
)

export default HighRiskWards
