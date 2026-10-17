import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  WARD_DETAILS,
  WARD_FEATURED_ACTIONS,
  WARD_KPIS,
  WARD_LAND_USE,
  WARD_LAND_USE_TOTAL,
  WARD_RISK_FACTORS,
  WARD_RECOMMENDATIONS,
  WARD_WATER_SOURCES,
} from '../data/wardDetailsData.js'
import KeyRiskFactors from '../components/wards/KeyRiskFactors.jsx'
import LandUseChart from '../components/wards/LandUseChart.jsx'
import QuickInsights from '../components/wards/QuickInsights.jsx'
import RecommendedActions from '../components/wards/RecommendedActions.jsx'
import RiskFactors from '../components/wards/RiskFactors.jsx'
import WardHeader from '../components/wards/WardHeader.jsx'
import WardMapCanvas from '../components/wards/WardMapCanvas.jsx'
import WardMetricCard from '../components/wards/WardMetricCard.jsx'
import WardRawDataTab from '../components/wards/WardRawDataTab.jsx'
import WardRecommendations from '../components/wards/WardRecommendations.jsx'
import WardTabs from '../components/wards/WardTabs.jsx'
import WardTrendsTab from '../components/wards/WardTrendsTab.jsx'
import WaterSources from '../components/wards/WaterSources.jsx'
import WaterStressTrendChart from '../components/wards/WaterStressTrendChart.jsx'

/**
 * Ward Details page (Ward 12). Renders the ward header, a five-tab strip
 * (Overview by default) and one distinct view per tab — all client-side
 * via React state, no reloads. The Overview tab is a responsive dashboard
 * grid: Ward Map + WSI trend (left), Land Use + Water Sources (middle),
 * Key Risk Factors + Quick Insights + Recommended Actions (right).
 * All values are local demo data — the geographical map will be
 * integrated later inside `WardMapCanvas`.
 */
const WardDetailsPage = () => {
  const { wardId } = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [notice, setNotice] = useState(null)

  const ward = { ...WARD_DETAILS, name: `Ward ${wardId ?? WARD_DETAILS.id}` }

  return (
    <div className="ward-page">
      <WardHeader
        ward={ward}
        onCompare={() =>
          setNotice(
            'Ward comparison is not available in this demo yet — it will open on its own page in a future update.',
          )
        }
      />

      {notice ? (
        <div className="ward-detail__notice ward-page__notice" role="status">
          <span>{notice}</span>
          <button
            type="button"
            className="ward-detail__notice-dismiss"
            onClick={() => setNotice(null)}
            aria-label="Dismiss message"
          >
            &times;
          </button>
        </div>
      ) : null}

      <WardTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' ? (
        <div className="ward-tab-panel">
          <section className="ward-kpi-grid" aria-label="Ward key metrics">
            {WARD_KPIS.map((kpi) => (
              <WardMetricCard
                key={kpi.id}
                title={kpi.title}
                value={kpi.value}
                unit={kpi.unit}
                icon={kpi.icon}
                tone={kpi.tone}
                progress={kpi.progress}
                change={kpi.change}
                changeDirection={kpi.changeDirection}
              />
            ))}
          </section>

          <div className="ward-overview-grid">
            <div className="ward-overview-grid__col ward-overview-grid__col--left">
              <WardMapCanvas wardName={ward.name} />
              <WaterStressTrendChart />
            </div>
            <div className="ward-overview-grid__col ward-overview-grid__col--middle">
              <LandUseChart data={WARD_LAND_USE} total={WARD_LAND_USE_TOTAL} />
              <WaterSources sources={WARD_WATER_SOURCES} />
            </div>
            <div className="ward-overview-grid__col ward-overview-grid__col--right">
              <KeyRiskFactors factors={WARD_RISK_FACTORS} />
              <QuickInsights />
              <RecommendedActions
                actions={WARD_FEATURED_ACTIONS}
                onViewAll={() => setActiveTab('recommendations')}
              />
            </div>
          </div>
        </div>
      ) : null}

      {activeTab === 'risk-factors' ? (
        <div className="ward-tab-panel">
          <RiskFactors factors={WARD_RISK_FACTORS} />
        </div>
      ) : null}

      {activeTab === 'trends' ? (
        <div className="ward-tab-panel">
          <WardTrendsTab />
        </div>
      ) : null}

      {activeTab === 'recommendations' ? (
        <div className="ward-tab-panel">
          <WardRecommendations recommendations={WARD_RECOMMENDATIONS} />
        </div>
      ) : null}

      {activeTab === 'raw-data' ? (
        <div className="ward-tab-panel">
          <WardRawDataTab />
        </div>
      ) : null}

      <footer className="dashboard-footer">
        <p>WaterMap · Urban Water Intelligence</p>
      </footer>
    </div>
  )
}

export default WardDetailsPage
