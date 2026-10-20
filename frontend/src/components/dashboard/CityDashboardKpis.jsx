import { AlertTriangle, ArrowDown, ArrowUp, CloudRain, Droplet, Users } from 'lucide-react'
import { DASHBOARD_KPIS } from '../../data/demoData.js'

const KPI_ICONS = {
  'water-stress': Droplet,
  'high-risk-districts': AlertTriangle,
  'annual-rainfall': CloudRain,
  population: Users,
}

const RAINFALL_BAR_HEIGHTS = [12, 18, 14, 28, 20, 16, 32, 24, 16, 24, 16, 20]

/**
 * 4 KPI Metric Summary Cards matching the City Dashboard:
 * - Icon on the left
 * - Value, units, trend or note on the right
 * - Distinct visualizations at bottom:
 *   1. WSI: Smooth undulating blue wave
 *   2. High Risk Districts: Red horizontal progress bar with soft gradient track
 *   3. Annual Rainfall: 12-bar mini histogram
 *   4. Population: Upward green curve
 */
const CityDashboardKpis = ({ kpis = DASHBOARD_KPIS }) => {
  return (
    <section className="city-kpi-grid" aria-label="Key Performance Indicators">
      {kpis.map((kpi) => {
        const Icon = KPI_ICONS[kpi.id] || Droplet
        const isNegative = kpi.trendTone === 'negative' || kpi.trendDirection === 'down'

        return (
          <article key={kpi.id} className="card city-kpi-card">
            <div className="city-kpi-card__head">
              <div className={`city-kpi-card__icon city-kpi-card__icon--${kpi.tone}`}>
                <Icon size={20} aria-hidden="true" />
              </div>

              <div className="city-kpi-card__info">
                <h3 className="city-kpi-card__title">{kpi.title}</h3>
                <div className="city-kpi-card__value-wrap">
                  <span className="city-kpi-card__value">{kpi.value}</span>
                  {kpi.unit ? <span className="city-kpi-card__unit">{kpi.unit}</span> : null}
                </div>
                {kpi.trend ? (
                  <p
                    className={`city-kpi-card__trend ${
                      isNegative ? 'city-kpi-card__trend--negative' : 'city-kpi-card__trend--positive'
                    }`}
                  >
                    {kpi.trendDirection === 'down' ? (
                      <ArrowDown size={13} aria-hidden="true" />
                    ) : (
                      <ArrowUp size={13} aria-hidden="true" />
                    )}
                    <span>{kpi.trend}</span>
                  </p>
                ) : null}
                {kpi.note ? <p className="city-kpi-card__note">{kpi.note}</p> : null}
              </div>
            </div>

            {/* Visualisation at the bottom of the card */}
            <div className="city-kpi-card__visual">
              {kpi.id === 'water-stress' ? (
                <div className="city-kpi-card__spark-wrap" aria-hidden="true">
                  <svg viewBox="0 0 200 24" width="100%" height="26" preserveAspectRatio="none">
                    <path
                      d="M 0 16 C 15 10, 30 20, 45 15 C 60 10, 75 20, 90 15 C 105 10, 120 20, 135 15 C 150 10, 165 20, 180 15 C 190 12, 196 17, 200 14"
                      fill="none"
                      stroke="#2589e9"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              ) : null}

              {kpi.id === 'high-risk-districts' ? (
                <div
                  className="city-kpi-card__progress-track"
                  role="progressbar"
                  aria-valuenow={29}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="city-kpi-card__progress-fill"
                    style={{
                      width: '29%',
                      backgroundColor: '#ef4444',
                    }}
                  />
                </div>
              ) : null}

              {kpi.id === 'annual-rainfall' ? (
                <div className="city-kpi-card__bars-wrap" aria-hidden="true">
                  {RAINFALL_BAR_HEIGHTS.map((height, i) => (
                    <div
                      key={i}
                      className="city-kpi-card__mini-bar"
                      style={{ height: `${height}px` }}
                    />
                  ))}
                </div>
              ) : null}

              {kpi.id === 'population' ? (
                <div className="city-kpi-card__spark-wrap" aria-hidden="true">
                  <svg viewBox="0 0 200 24" width="100%" height="26" preserveAspectRatio="none">
                    <path
                      d="M 0 21 C 25 20, 45 15, 70 16 C 95 17, 120 10, 145 12 C 170 14, 185 7, 200 4"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              ) : null}
            </div>
          </article>
        )
      })}
    </section>
  )
}

export default CityDashboardKpis
