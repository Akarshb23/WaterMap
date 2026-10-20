import { useState } from 'react'
import { TriangleAlert, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.js'
import { FEATURED_WARD } from '../../data/cityMapData.js'
import Tabs from '../common/Tabs.jsx'
import WardOverviewTab from './WardOverviewTab.jsx'
import WardRecommendationsTab from './WardRecommendationsTab.jsx'
import WardRiskFactorsTab from './WardRiskFactorsTab.jsx'
import WardTrendsTab from './WardTrendsTab.jsx'

const WARD_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'risk-factors', label: 'Risk Factors' },
  { id: 'trends', label: 'Trends' },
  { id: 'recommendations', label: 'Recommendations' },
]

/**
 * Right-hand Ward 12 detail panel: header (name, zone, risk badge, close),
 * a four-tab strip and one distinct content view per tab. The close button
 * is owned by the page (which also offers the marker to restore it); the
 * panel keeps its own tab and notice state.
 */
const WardDetailsPanel = ({ onClose, ward = FEATURED_WARD }) => {
  const selectedWard = { ...FEATURED_WARD, ...ward }
  const riskLabel = selectedWard.riskLabel ?? (selectedWard.risk === 'low' ? 'Low Risk' : selectedWard.risk === 'moderate' ? 'Moderate Risk' : 'High Risk')
  const riskBadgeClass = selectedWard.risk === 'low' ? 'badge--low' : selectedWard.risk === 'moderate' ? 'badge--moderate' : 'badge--danger'
  const [activeTab, setActiveTab] = useState('overview')
  const [notice, setNotice] = useState(null)
  const navigate = useNavigate()

  /** Placeholder action for destinations that do not exist yet. */
  const showNotice = (message) => setNotice(message)

  return (
    <aside className="ward-detail" aria-label={`${selectedWard.name} details`}>
      <div className="ward-detail__head">
        <div className="ward-detail__titles">
          <h2 className="ward-detail__name">{selectedWard.name}</h2>
          <p className="ward-detail__zone">{selectedWard.zone}</p>
          <span className={`badge ${riskBadgeClass} ward-detail__badge`}>
            <TriangleAlert size={12} aria-hidden="true" />
            {riskLabel}
          </span>
        </div>
        <button
          type="button"
          className="ward-detail__close"
          onClick={onClose}
          aria-label="Close district details"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      <Tabs tabs={WARD_TABS} activeTab={activeTab} onChange={setActiveTab} />

      {notice ? (
        <div className="ward-detail__notice" role="status">
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

      <div className="ward-detail__body">
        {activeTab === 'overview' ? (
          <WardOverviewTab
            ward={selectedWard}
            onViewAnalysis={() => navigate(ROUTES.DISTRICT_DETAILS_HOME || ROUTES.WARD_DETAILS_HOME)}
            onCompareWards={() =>
              showNotice('District comparison is not available in this demo yet — it will open on its own page in a future update.')
            }
          />
        ) : null}
        {activeTab === 'risk-factors' ? <WardRiskFactorsTab /> : null}
        {activeTab === 'trends' ? <WardTrendsTab /> : null}
        {activeTab === 'recommendations' ? <WardRecommendationsTab /> : null}
      </div>
    </aside>
  )
}

export default WardDetailsPanel
