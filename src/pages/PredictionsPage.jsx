import { ChartLine, Droplet, TriangleAlert, Users } from 'lucide-react'
import MetricCard from '../components/dashboard/MetricCard.jsx'
import PageHeader from '../components/layout/PageHeader.jsx'
import ForecastChart from '../components/predictions/ForecastChart.jsx'
import ForecastSummary from '../components/predictions/ForecastSummary.jsx'
import PredictedRiskMap from '../components/predictions/PredictedRiskMap.jsx'
import RainfallForecast from '../components/predictions/RainfallForecast.jsx'
import RiskDrivers from '../components/predictions/RiskDrivers.jsx'
import ScenarioAnalysis from '../components/predictions/ScenarioAnalysis.jsx'
import TrendComparison from '../components/predictions/TrendComparison.jsx'
import {
  DEMAND_FORECAST_SERIES,
  PREDICTION_DISCLAIMER,
  PREDICTION_INFO,
  PREDICTION_KPIS,
  PROJECTED_RESULTS,
  RISK_DRIVERS,
} from '../data/predictionsData.js'

/** Icon per KPI id (presentation stays out of the demo data module). */
const KPI_ICONS = {
  'current-wsi': Droplet,
  'predicted-wsi': ChartLine,
  'high-risk-wards': TriangleAlert,
  'demand-increase': Users,
}

/**
 * Prediction & Analysis page: illustrative forecast KPIs, a predicted
 * stress map (empty map canvas reserved for a future map integration),
 * demand/trend/rainfall charts and scenario outlooks. All values are
 * local demo data — no APIs, ML models or GIS services are involved.
 */
const PredictionsPage = () => (
  <div className="predictions-page">
    <header className="dashboard-heading">
      <PageHeader
        title="Prediction & Analysis"
        description="Understand future water risks with data-driven forecasts and scenario analysis."
      />
      <aside className="page-info-card page-info-card--blue">
        <span className="page-info-card__icon" aria-hidden="true">
          <ChartLine size={16} />
        </span>
        <p>{PREDICTION_INFO}</p>
      </aside>
    </header>

    <section className="kpi-grid" aria-label="Prediction key performance indicators">
      {PREDICTION_KPIS.map((kpi) => (
        <MetricCard
          key={kpi.id}
          title={kpi.title}
          value={kpi.value}
          icon={KPI_ICONS[kpi.id]}
          tone={kpi.tone}
          trend={kpi.trend}
          trendTone={kpi.trendTone}
          visual={kpi.visual}
        />
      ))}
    </section>

    <div className="pred-layout">
      {/* Left column (~43%): predicted stress map + water demand forecast */}
      <div className="pred-col pred-col--left">
        <PredictedRiskMap />

        <ForecastChart
          title="Water Demand Forecast"
          subtitle="Projected city-wide demand under current growth trends."
          legend={[{ label: 'Water demand (MLD)', color: '#2589e9' }]}
          data={DEMAND_FORECAST_SERIES}
          series={[{ key: 'demand', label: 'Water demand', color: '#2589e9', fill: true }]}
          yAxis={{ label: 'MLD', domain: ['auto', 'auto'], tickFormatter: (value) => `${value}` }}
          unit="MLD"
          chartHeight={175}
          note="Demand rises ~24% by 2030 vs 2024 — illustrative only."
        />
      </div>

      {/* Middle column (~24%): trend comparison, key drivers, rainfall */}
      <div className="pred-col pred-col--middle">
        <TrendComparison />
        <RiskDrivers
          title="Key Drivers"
          subtitle="Share of the projected WSI increase by 2030."
          drivers={RISK_DRIVERS}
        />
        <RainfallForecast />
      </div>

      {/* Right column (~33%): scenario analysis + projected results */}
      <div className="pred-col pred-col--right">
        <ScenarioAnalysis />
        <ForecastSummary
          subtitle="Where the city lands if current trends continue."
          rows={PROJECTED_RESULTS}
          note={PREDICTION_DISCLAIMER}
        />
      </div>
    </div>
  </div>
)

export default PredictionsPage