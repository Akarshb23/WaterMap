import { useState } from 'react'
import CityDashboardHeader from '../components/dashboard/CityDashboardHeader.jsx'
import CityDashboardKpis from '../components/dashboard/CityDashboardKpis.jsx'
import CityWaterStressMap from '../components/dashboard/CityWaterStressMap.jsx'
import RiskDistribution from '../components/dashboard/RiskDistribution.jsx'
import StressTrendChart from '../components/dashboard/StressTrendChart.jsx'
import HighRiskWards from '../components/dashboard/HighRiskWards.jsx'
import RecentAlerts from '../components/dashboard/RecentAlerts.jsx'
import '../styles/city-dashboard.css'

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState('12m')

  return (
    <div className="city-dashboard-page">
      <CityDashboardHeader
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <CityDashboardKpis />

      <CityWaterStressMap />

      <section className="city-analytics-grid" aria-label="Risk analytics and historical trend">
        <RiskDistribution />
        <StressTrendChart />
      </section>

      <section className="city-bottom-grid" aria-label="High risk districts and recent alerts">
        <HighRiskWards />
        <RecentAlerts />
      </section>
    </div>
  )
}
