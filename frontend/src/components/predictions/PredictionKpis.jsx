import {
  AlertTriangle,
  ArrowUp,
  BarChart2,
  Droplet,
  Users,
} from 'lucide-react'

const PredictionKpis = () => {
  return (
    <section className="pred-kpis-grid" aria-label="Key Prediction Indicators">
      {/* Card 1: Current WSI */}
      <article className="pred-kpi-card">
        <div className="pred-kpi-card__left">
          <div className="pred-kpi-icon pred-kpi-icon--blue">
            <Droplet size={19} className="pred-kpi-icon-svg" />
          </div>
          <div className="pred-kpi-info">
            <span className="pred-kpi-value">0.68</span>
            <span className="pred-kpi-label">Current WSI</span>
            <div className="pred-kpi-trend pred-kpi-trend--red">
              <ArrowUp size={13} strokeWidth={2.5} />
              <span>12% vs last year</span>
            </div>
          </div>
        </div>

        {/* Wavy blue line rising */}
        <div className="pred-kpi-visual">
          <svg
            viewBox="0 0 120 46"
            className="pred-kpi-chart-svg"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M 4 39 C 16 34, 22 42, 34 38 C 46 34, 54 42, 66 36 C 78 30, 86 38, 96 28 C 104 18, 108 22, 114 12"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </article>

      {/* Card 2: Predicted WSI (2030) */}
      <article className="pred-kpi-card">
        <div className="pred-kpi-card__left">
          <div className="pred-kpi-icon pred-kpi-icon--green">
            <BarChart2 size={19} className="pred-kpi-icon-svg" />
          </div>
          <div className="pred-kpi-info">
            <span className="pred-kpi-value">0.79</span>
            <span className="pred-kpi-label">Predicted WSI (2030)</span>
            <div className="pred-kpi-trend pred-kpi-trend--red">
              <ArrowUp size={13} strokeWidth={2.5} />
              <span>16% vs 2024</span>
            </div>
          </div>
        </div>

        {/* Smooth rising red curve with red gradient area */}
        <div className="pred-kpi-visual">
          <svg
            viewBox="0 0 120 46"
            className="pred-kpi-chart-svg"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="redAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M 4 40 C 22 38, 38 37, 54 34 C 70 31, 84 25, 98 21 C 106 18, 110 15, 114 10 L 114 46 L 4 46 Z"
              fill="url(#redAreaGrad)"
            />
            <path
              d="M 4 40 C 22 38, 38 37, 54 34 C 70 31, 84 25, 98 21 C 106 18, 110 15, 114 10"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </article>

      {/* Card 3: High Risk Wards (2030) */}
      <article className="pred-kpi-card">
        <div className="pred-kpi-card__left">
          <div className="pred-kpi-icon pred-kpi-icon--red">
            <AlertTriangle size={19} className="pred-kpi-icon-svg" />
          </div>
          <div className="pred-kpi-info">
            <span className="pred-kpi-value">12</span>
            <span className="pred-kpi-label">High Risk Wards (2030)</span>
            <div className="pred-kpi-trend pred-kpi-trend--red">
              <ArrowUp size={13} strokeWidth={2.5} />
              <span>5 more than 2024</span>
            </div>
          </div>
        </div>

        {/* Stepped colored mini bars (red to light blue) */}
        <div className="pred-kpi-visual">
          <svg
            viewBox="0 0 120 46"
            className="pred-kpi-chart-svg"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <rect x="36" y="42" width="6.5" height="4" rx="1.5" fill="#ef4444" />
            <rect x="46" y="38" width="6.5" height="8" rx="1.5" fill="#ef4444" />
            <rect x="56" y="32" width="6.5" height="14" rx="1.5" fill="#f87171" />
            <rect x="66" y="26" width="6.5" height="20" rx="1.5" fill="#fca5a5" />
            <rect x="76" y="20" width="6.5" height="26" rx="1.5" fill="#fecaca" />
            <rect x="86" y="27" width="6.5" height="19" rx="1.5" fill="#bfdbfe" />
            <rect x="96" y="16" width="6.5" height="30" rx="1.5" fill="#93c5fd" />
            <rect x="106" y="9" width="6.5" height="37" rx="1.5" fill="#60a5fa" />
          </svg>
        </div>
      </article>

      {/* Card 4: Increase in Water Demand */}
      <article className="pred-kpi-card">
        <div className="pred-kpi-card__left">
          <div className="pred-kpi-icon pred-kpi-icon--teal">
            <Users size={19} className="pred-kpi-icon-svg" />
          </div>
          <div className="pred-kpi-info">
            <span className="pred-kpi-value">24%</span>
            <span className="pred-kpi-label">Increase in Water Demand</span>
            <div className="pred-kpi-trend pred-kpi-trend--red">
              <ArrowUp size={13} strokeWidth={2.5} />
              <span>by 2030</span>
            </div>
          </div>
        </div>

        {/* Rising green curve with soft gradient fill, perfectly bounded */}
        <div className="pred-kpi-visual">
          <svg
            viewBox="0 0 120 46"
            className="pred-kpi-chart-svg"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="greenAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M 4 40 C 22 40, 36 37, 50 37 C 64 37, 76 30, 88 30 C 98 30, 104 20, 114 10 L 114 46 L 4 46 Z"
              fill="url(#greenAreaGrad)"
            />
            <path
              d="M 4 40 C 22 40, 36 37, 50 37 C 64 37, 76 30, 88 30 C 98 30, 104 20, 114 10"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </article>
    </section>
  )
}

export default PredictionKpis
