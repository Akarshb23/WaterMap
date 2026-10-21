import { Fragment, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bookmark,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  CloudRain,
  Coins,
  Droplets,
  FileImage,
  FileText,
  Filter,
  Gauge,
  Heart,
  Info,
  Layers,
  Leaf,
  MapPin,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sparkles,
  Sprout,
  TrendingUp,
  Users,
  Waves,
  Wrench,
  X,
} from 'lucide-react'
import rainwaterHarvestingImg from '../../assets/images/rainwater-harvesting-concept.jpg'

const ICON_MAP = {
  Activity,
  Building2,
  CloudRain,
  Coins,
  Droplets,
  FileText,
  Filter,
  Gauge,
  Heart,
  Layers,
  Leaf,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sprout,
  TrendingUp,
  Users,
  Waves,
  Wrench,
}

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'impact', label: 'Expected Impact' },
  { id: 'implementation', label: 'Implementation' },
  { id: 'cost', label: 'Cost' },
  { id: 'case-studies', label: 'Case Studies' },
]

/**
 * Right details panel for the currently selected recommendation.
 * Displays key metadata, image placeholder, 5 selectable tabs, and primary action buttons.
 */
const RecommendationDetailPanel = ({
  recommendation,
  activeTab,
  onSelectTab,
  isPlanned = false,
  onTogglePlanned,
  onViewPlan,
  onClose,
}) => {
  const [tableMode, setTableMode] = useState('specs') // 'specs' | 'environment'
  const [expandedRow, setExpandedRow] = useState(null)

  const toggleRow = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id))
  }

  if (!recommendation) {
    return (
      <div className="card recommendation-detail-panel recommendation-detail-panel--empty">
        <p>Select a recommendation from the list to view its complete action profile.</p>
      </div>
    )
  }

  const MainIcon = ICON_MAP[recommendation.iconName] || ShieldCheck

  const specsData = [
    {
      id: 'target-districts',
      icon: MapPin,
      label: 'Target Districts',
      value: recommendation.targetDistricts || recommendation.targetWards,
      badge: '3 Priority Zones',
      badgeTone: 'blue',
      detail: `Catchment Connectivity: ${recommendation.overview?.targetSectors?.join(' • ') || 'Key urban corridors across high-stress zones'} with direct link to local drainage valleys and lakes.`,
    },
    {
      id: 'implementation-level',
      icon: Layers,
      label: 'Implementation Level',
      value: recommendation.implementationLevel || 'Moderate',
      badge: 'Mandated Retrofit',
      badgeTone: 'purple',
      detail: 'Institutional buildings, commercial IT parks, and residential complexes with rooftop surface >250 sq.m.',
    },
    {
      id: 'time-horizon',
      icon: Calendar,
      label: 'Time Horizon',
      value: recommendation.timeHorizon || '2025 – 2028',
      badge: '3-Year Horizon',
      badgeTone: 'neutral',
      detail: 'Phase 1: DPR & institutional retrofits (Y1). Phase 2: Commercial hubs (Y2). Phase 3: Community mandates (Y3).',
    },
    {
      id: 'estimated-cost',
      icon: Coins,
      label: 'Estimated Cost',
      value: recommendation.estimatedCost,
      badge: 'Capital Outlay',
      badgeTone: 'green',
      detail: `Financial Profile: ${recommendation.cost?.total || recommendation.estimatedCost} funded via BBMP Urban Green Infrastructure Fund & PPP co-finance.`,
    },
    {
      id: 'potential-wsi-reduction',
      icon: TrendingUp,
      label: 'Potential WSI Reduction',
      value: recommendation.potentialWsiReduction,
      badge: 'High Impact',
      badgeTone: 'green',
      detail: 'Lowers baseline Water Stress Index by 0.12–0.25 points and curtails peak monsoon urban flooding.',
    },
    {
      id: 'annual-water-savings',
      icon: Droplets,
      label: 'Annual Water Savings',
      value: recommendation.annualWaterSavings,
      badge: 'Direct Recharge',
      badgeTone: 'teal',
      detail: 'Captures and recharges 45–90 MLD, equivalent to replacing 32,000 commercial water tanker trips annually.',
    },
  ]

  const nearbyDistricts = recommendation.expectedImpact?.districtBreakdown || [
    { district: 'Koramangala', current: 0.87, projected: 0.46, reduction: '-47%', zone: 'Valley Catchment' },
    { district: 'Bellandur', current: 0.71, projected: 0.44, reduction: '-38%', zone: 'Lake Drainage Basin' },
    { district: 'Indiranagar', current: 0.76, projected: 0.45, reduction: '-41%', zone: 'Commercial Ridge' },
    { district: 'Electronic City', current: 0.88, projected: 0.49, reduction: '-44%', zone: 'South Tech Corridor' },
  ]

  return (
    <article className="card recommendation-detail-panel" aria-labelledby="detail-panel-title">
      {/* Panel Header matching mockup */}
      <header className="recommendation-detail__header">
        <div className="recommendation-detail__header-left">
          <div className={`recommendation-detail__icon-badge recommendation-detail__icon-badge--${recommendation.tone}`}>
            <MainIcon size={20} aria-hidden="true" />
          </div>
          <div className="recommendation-detail__title-wrap">
            <h3 className="recommendation-detail__title" id="detail-panel-title">
              {recommendation.shortTitle || recommendation.title}
            </h3>
            <span className={`recommendation-detail__priority-pill recommendation-detail__priority-pill--${recommendation.priority}`}>
              <AlertTriangle size={12} aria-hidden="true" />
              <span>{recommendation.priorityLabel || `${recommendation.badgeLabel} Priority`}</span>
            </span>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            className="recommendation-detail__close-btn"
            onClick={onClose}
            aria-label="Close details panel"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </header>

      {/* Subtitle description */}
      <p className="recommendation-detail__subtitle-text">{recommendation.summary}</p>

      {/* Navigation Tabs */}
      <nav className="recommendation-detail__tabs" aria-label="Recommendation details navigation">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`recommendation-detail__tab-btn${activeTab === tab.id ? ' recommendation-detail__tab-btn--active' : ''}`}
            onClick={() => onSelectTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab Panels */}
      <div className="recommendation-detail__tab-content">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="recommendation-detail__overview-tab" role="tabpanel">
            {/* Visual Concept Banner */}
            <div className="recommendation-detail__hero-banner">
              <img
                src={rainwaterHarvestingImg}
                alt={`${recommendation.shortTitle} system`}
                className="recommendation-detail__hero-image"
              />
              <div className="recommendation-detail__hero-overlay">
                <span className="recommendation-detail__hero-tag">
                  <CloudRain size={13} aria-hidden="true" />
                  <span>{recommendation.shortTitle} Concept System</span>
                </span>
                <span className="recommendation-detail__hero-subtag">
                  {recommendation.category === 'nature' ? 'Nature-Based Solution' : 'Resilience Infrastructure'} • Decentralized Storage
                </span>
              </div>
            </div>

            {/* Interactive Table Section */}
            <div className="rec-interactive-table-card">
              <div className="rec-table-toolbar">
                <div className="rec-table-toolbar__title">
                  <Sparkles size={13} className="rec-table-toolbar__sparkle" aria-hidden="true" />
                  <span>
                    {tableMode === 'specs'
                      ? 'Implementation Specifications'
                      : 'Nearby Environment & Basin Impact'}
                  </span>
                </div>
                <div className="rec-table-toolbar__toggle" role="tablist" aria-label="Table view selector">
                  <button
                    type="button"
                    className={`rec-table-toggle-btn${tableMode === 'specs' ? ' rec-table-toggle-btn--active' : ''}`}
                    onClick={() => setTableMode('specs')}
                    role="tab"
                    aria-selected={tableMode === 'specs'}
                  >
                    Specifications
                  </button>
                  <button
                    type="button"
                    className={`rec-table-toggle-btn${tableMode === 'environment' ? ' rec-table-toggle-btn--active' : ''}`}
                    onClick={() => setTableMode('environment')}
                    role="tab"
                    aria-selected={tableMode === 'environment'}
                  >
                    Nearby Environment
                  </button>
                </div>
              </div>

              {tableMode === 'specs' ? (
                <div className="rec-table-wrapper">
                  <table className="rec-interactive-table">
                    <thead>
                      <tr>
                        <th scope="col" style={{ width: '42%' }}>Parameter</th>
                        <th scope="col" style={{ width: '48%' }}>Target Value</th>
                        <th scope="col" style={{ width: '10%', textAlign: 'center' }}>
                          <span className="sr-only">Details</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {specsData.map((row) => {
                        const Icon = row.icon
                        const isExpanded = expandedRow === row.id
                        return (
                          <Fragment key={row.id}>
                            <tr
                              className={`rec-interactive-row${isExpanded ? ' rec-interactive-row--expanded' : ''}`}
                              onClick={() => toggleRow(row.id)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault()
                                  toggleRow(row.id)
                                }
                              }}
                              aria-expanded={isExpanded}
                            >
                              <td className="rec-interactive-td rec-interactive-td--param">
                                <span className="rec-interactive-icon-wrap">
                                  <Icon size={13} aria-hidden="true" />
                                </span>
                                <span className="rec-interactive-label">{row.label}</span>
                              </td>
                              <td className="rec-interactive-td rec-interactive-td--value">
                                <div className="rec-interactive-val-box">
                                  <span className={`rec-interactive-val-text${row.id === 'estimated-cost' ? ' rec-interactive-val-text--cost' : ''}`}>
                                    {row.value}
                                  </span>
                                  <span className={`rec-interactive-badge rec-interactive-badge--${row.badgeTone}`}>
                                    {row.badge}
                                  </span>
                                </div>
                              </td>
                              <td className="rec-interactive-td rec-interactive-td--action">
                                {isExpanded ? <ChevronUp size={13} aria-hidden="true" /> : <ChevronDown size={13} aria-hidden="true" />}
                              </td>
                            </tr>
                            {isExpanded && (
                              <tr className="rec-interactive-drawer-row">
                                <td colSpan={3} className="rec-interactive-drawer-cell">
                                  <div className="rec-interactive-drawer-content">
                                    <Info size={13} className="rec-interactive-drawer-icon" aria-hidden="true" />
                                    <span>{row.detail}</span>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rec-table-wrapper">
                  <table className="rec-interactive-table">
                    <thead>
                      <tr>
                        <th scope="col" style={{ width: '42%' }}>District / Catchment</th>
                        <th scope="col" style={{ width: '32%', textAlign: 'center' }}>WSI Change</th>
                        <th scope="col" style={{ width: '26%', textAlign: 'right' }}>Net Delta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nearbyDistricts.map((item) => (
                        <tr key={item.district} className="rec-interactive-row rec-interactive-row--env">
                          <td className="rec-interactive-td rec-interactive-td--param">
                            <span className="rec-interactive-icon-wrap rec-interactive-icon-wrap--pin">
                              <MapPin size={12} aria-hidden="true" />
                            </span>
                            <div className="rec-interactive-district-info">
                              <span className="rec-interactive-district-title">{item.district}</span>
                              <span className="rec-interactive-district-sub">{item.zone || 'Catchment Basin'}</span>
                            </div>
                          </td>
                          <td className="rec-interactive-td rec-interactive-td--wsi">
                            <div className="rec-interactive-wsi-flow">
                              <span className="badge-wsi-curr">{item.current?.toFixed(2) || '0.82'}</span>
                              <span className="rec-interactive-arrow">→</span>
                              <span className="badge-wsi-proj">{item.projected?.toFixed(2) || '0.45'}</span>
                            </div>
                          </td>
                          <td className="rec-interactive-td rec-interactive-td--delta">
                            <span className="rec-interactive-delta-badge">{item.reduction || '-42%'}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Key Benefits */}
            <div className="recommendation-detail__benefits-section">
              <h4 className="recommendation-detail__benefits-title">Key Benefits</h4>
              <div className="recommendation-detail__benefits-grid">
                {recommendation.keyBenefits.map((benefit) => {
                  const BenefitIcon = ICON_MAP[benefit.iconName] || Droplets
                  return (
                    <div key={benefit.id} className="recommendation-detail__benefit-card">
                      <span className="recommendation-detail__benefit-icon">
                        <BenefitIcon size={16} aria-hidden="true" />
                      </span>
                      <span className="recommendation-detail__benefit-text">{benefit.text}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* EXPECTED IMPACT TAB */}
        {activeTab === 'impact' && (
          <div className="recommendation-detail__impact-tab" role="tabpanel">
            <p className="recommendation-detail__impact-headline">
              {recommendation.expectedImpact?.headline}
            </p>
            <div className="recommendation-detail__impact-metrics">
              {recommendation.expectedImpact?.metrics.map((item) => (
                <div key={item.label} className="recommendation-detail__impact-metric-card">
                  <span className="recommendation-detail__impact-metric-val">{item.value}</span>
                  <span className="recommendation-detail__impact-metric-lbl">{item.label}</span>
                </div>
              ))}
            </div>
            {(recommendation.expectedImpact?.districtBreakdown || recommendation.expectedImpact?.wardBreakdown) && (
              <div className="recommendation-detail__subtable-wrap">
                <h5 className="recommendation-detail__subtable-title">Target District WSI Projections</h5>
                <table className="recommendation-detail__subtable">
                  <thead>
                    <tr>
                      <th>District</th>
                      <th>Current</th>
                      <th>Projected</th>
                      <th>Delta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(recommendation.expectedImpact.districtBreakdown || recommendation.expectedImpact.wardBreakdown).map((row) => (
                      <tr key={row.district || row.ward}>
                        <td>{row.district || row.ward}</td>
                        <td><span className="badge-wsi-curr">{row.current.toFixed(2)}</span></td>
                        <td><span className="badge-wsi-proj">{row.projected.toFixed(2)}</span></td>
                        <td className="recommendation-detail__delta-positive">{row.reduction}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* IMPLEMENTATION TAB */}
        {activeTab === 'implementation' && (
          <div className="recommendation-detail__impl-tab" role="tabpanel">
            <div className="recommendation-detail__impl-meta">
              <div>
                <span className="recommendation-detail__impl-meta-label">Duration:</span>
                <span className="recommendation-detail__impl-meta-val">{recommendation.implementation?.duration}</span>
              </div>
              <div>
                <span className="recommendation-detail__impl-meta-label">Lead Agency:</span>
                <span className="recommendation-detail__impl-meta-val">{recommendation.implementation?.leadAgency}</span>
              </div>
            </div>
            <div className="recommendation-detail__phases">
              {recommendation.implementation?.phases.map((ph, idx) => (
                <div key={ph.phase} className="recommendation-detail__phase-card">
                  <div className="recommendation-detail__phase-number">{idx + 1}</div>
                  <div className="recommendation-detail__phase-info">
                    <span className="recommendation-detail__phase-time">{ph.phase}</span>
                    <h5 className="recommendation-detail__phase-title">{ph.title}</h5>
                    <p className="recommendation-detail__phase-desc">{ph.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COST TAB */}
        {activeTab === 'cost' && (
          <div className="recommendation-detail__cost-tab" role="tabpanel">
            <div className="recommendation-detail__cost-hero">
              <span className="recommendation-detail__cost-hero-label">Total Outlay</span>
              <span className="recommendation-detail__cost-hero-value">{recommendation.cost?.total}</span>
              <span className="recommendation-detail__cost-sources">{recommendation.cost?.fundingSources}</span>
            </div>
            <h5 className="recommendation-detail__subtable-title">Capital Expenditure Breakdown</h5>
            <div className="recommendation-detail__cost-list">
              {recommendation.cost?.breakdown.map((item) => (
                <div key={item.item} className="recommendation-detail__cost-row">
                  <div className="recommendation-detail__cost-row-info">
                    <span className="recommendation-detail__cost-item-name">{item.item}</span>
                    <span className="recommendation-detail__cost-item-amount">{item.cost}</span>
                  </div>
                  <div className="recommendation-detail__cost-bar-track">
                    <div
                      className="recommendation-detail__cost-bar-fill"
                      style={{ width: item.percent }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="recommendation-detail__cost-roi">
              <strong>ROI & Economic Benefit:</strong> {recommendation.cost?.roi}
            </p>
          </div>
        )}

        {/* CASE STUDIES TAB */}
        {activeTab === 'case-studies' && (
          <div className="recommendation-detail__cases-tab" role="tabpanel">
            <div className="recommendation-detail__cases-list">
              {recommendation.caseStudies?.map((cs) => (
                <div key={cs.title} className="recommendation-detail__case-card">
                  <div className="recommendation-detail__case-header">
                    <h5 className="recommendation-detail__case-title">{cs.title}</h5>
                    <span className="recommendation-detail__case-year">{cs.year}</span>
                  </div>
                  <span className="recommendation-detail__case-loc">{cs.location}</span>
                  <p className="recommendation-detail__case-result">{cs.result}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <footer className="recommendation-detail__actions">
        <button
          type="button"
          className="btn btn--primary recommendation-detail__action-plan-btn"
          onClick={() => onViewPlan(recommendation)}
        >
          <span>View Implementation Plan</span>
          <ArrowRight size={15} aria-hidden="true" />
        </button>

        <button
          type="button"
          className={`btn btn--outline recommendation-detail__add-plan-btn${
            isPlanned ? ' recommendation-detail__add-plan-btn--added' : ''
          }`}
          onClick={() => onTogglePlanned(recommendation.id)}
          aria-pressed={isPlanned}
        >
          {isPlanned ? (
            <>
              <Check size={16} aria-hidden="true" />
              <span>Added to Plan</span>
            </>
          ) : (
            <>
              <Bookmark size={15} aria-hidden="true" />
              <span>Add to Plan</span>
            </>
          )}
        </button>
      </footer>
    </article>
  )
}

export default RecommendationDetailPanel
