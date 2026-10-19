import Tabs from '../common/Tabs.jsx'

const WARD_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'risk-factors', label: 'Risk Factors' },
  { id: 'trends', label: 'Trends' },
  { id: 'recommendations', label: 'Recommendations' },
  { id: 'raw-data', label: 'Raw Data' },
]

/**
 * Tab strip for the Ward Details page. Controlled by the page, which owns
 * the active tab so other controls (e.g. "View All" on the Recommended
 * Actions card) can switch tabs.
 */
const WardTabs = ({ activeTab, onChange }) => (
  <div className="ward-page-tabs">
    <Tabs tabs={WARD_TABS} activeTab={activeTab} onChange={onChange} />
  </div>
)

export default WardTabs
