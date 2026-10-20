import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bookmark,
  Building2,
  Check,
  CloudRain,
  Coins,
  Droplets,
  FileImage,
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
  if (!recommendation) {
    return (
      <div className="card recommendation-detail-panel recommendation-detail-panel--empty">
        <p>Select a recommendation from the list to view its complete action profile.</p>
      </div>
    )
  }

  const MainIcon = ICON_MAP[recommendation.iconName] || ShieldCheck

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
            <div className="recommendation-detail__overview-grid">
              {/* Left Specifications List */}
              <div className="recommendation-detail__specs">
                <div className="recommendation-detail__spec-row">
                  <span className="recommendation-detail__spec-label">Target Districts</span>
                  <span className="recommendation-detail__spec-value">{recommendation.targetDistricts || recommendation.targetWards}</span>
                </div>
                <div className="recommendation-detail__spec-row">
                  <span className="recommendation-detail__spec-label">Implementation Level</span>
                  <span className="recommendation-detail__spec-value">{recommendation.implementationLevel}</span>
                </div>
                <div className="recommendation-detail__spec-row">
                  <span className="recommendation-detail__spec-label">Time Horizon</span>
                  <span className="recommendation-detail__spec-value">{recommendation.timeHorizon}</span>
                </div>
                <div className="recommendation-detail__spec-row">
                  <span className="recommendation-detail__spec-label">Estimated Cost</span>
                  <span className="recommendation-detail__spec-value recommendation-detail__spec-value--cost">
                    {recommendation.estimatedCost}
                  </span>
                </div>
                <div className="recommendation-detail__spec-row">
                  <span className="recommendation-detail__spec-label">Potential WSI Reduction</span>
                  <span className="recommendation-detail__spec-value">{recommendation.potentialWsiReduction}</span>
                </div>
                <div className="recommendation-detail__spec-row">
                  <span className="recommendation-detail__spec-label">Annual Water Savings</span>
                  <span className="recommendation-detail__spec-value">{recommendation.annualWaterSavings}</span>
                </div>
              </div>

              {/* Right Detail Image */}
              <div className="recommendation-detail__image-box">
                <img
                  src={rainwaterHarvestingImg}
                  alt={`${recommendation.shortTitle} system`}
                  className="recommendation-detail__image"
                />
              </div>
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
