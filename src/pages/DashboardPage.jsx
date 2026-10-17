import { useState } from 'react'
import { Calendar, CloudRain, Droplet, TriangleAlert, Users } from 'lucide-react'
import HighRiskWards from '../components/dashboard/HighRiskWards.jsx'
import MetricCard from '../components/dashboard/MetricCard.jsx'
import RecentAlerts from '../components/dashboard/RecentAlerts.jsx'
import RiskDistribution from '../components/dashboard/RiskDistribution.jsx'
import StressTrendChart from '../components/dashboard/StressTrendChart.jsx'
import WaterStressMap from '../components/dashboard/WaterStressMap.jsx'
import PageHeader from '../components/layout/PageHeader.jsx'
import { DASHBOARD_KPIS, DATE_RANGE_OPTIONS } from '../data/demoData.js'

/** Icon per KPI id (presentation stays out of the demo data module). */
const KPI_ICONS = {
  'water-stress': Droplet,
  'high-risk-wards': TriangleAlert,
  'annual-rainfall': CloudRain,
  population: Users,
}

/**
 * City dashboard: KPI tiles, illustrative water-stress map, distribution
 * and trend charts, high-risk ward table and recent alerts. All values are
 * local demo data — no APIs or GIS services are involved.
 */
const DashboardPage = () => {
  const [dateRange, setDateRange] = useState('12m')

  return (
    <div className="dashboard-page">
      <header className="dashboard-heading">
        <PageHeader
          title="City Dashboard"
          description="An overview of urban water stress and key insights for New Delhi."
        />
        <div className="field-with-icon">
          <Calendar size={15} className="field-with-icon__icon" aria-hidden="true" />
          <label className="sr-only" htmlFor="dashboard-date-range">
            Date range
          </label>
          <select
            id="dashboard-date-range"
            className="native-select"
            value={dateRange}
            onChange={(event) => setDateRange(event.target.value)}
          >
            {DATE_RANGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <section className="kpi-grid" aria-label="Key performance indicators">
        {DASHBOARD_KPIS.map((kpi) => (
          <MetricCard
            key={kpi.id}
            title={kpi.title}
            value={kpi.value}
            unit={kpi.unit}
            icon={KPI_ICONS[kpi.id]}
            tone={kpi.tone}
            trend={kpi.trend}
            trendDirection={kpi.trendDirection}
            note={kpi.note}
            visual={kpi.visual}
          />
        ))}
      </section>

      <WaterStressMap />

      <div className="dashboard-row">
        <RiskDistribution />
        <StressTrendChart />
      </div>

      <div className="dashboard-row">
        <HighRiskWards />
        <RecentAlerts />
      </div>

      <footer className="dashboard-footer">
        <p>WaterMap · Urban Water Intelligence</p>
      </footer>
    </div>
  )
}

export default DashboardPage
