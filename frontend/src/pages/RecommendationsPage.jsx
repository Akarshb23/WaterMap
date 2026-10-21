import { useState } from 'react'
import {
  ArrowUp,
  Droplets,
  Leaf,
  Users,
  Target,
} from 'lucide-react'
import PriorityWardMap from '../components/recommendations/PriorityWardMap.jsx'
import CumulativeImpactChart from '../components/recommendations/CumulativeImpactChart.jsx'
import ImplementationPlanModal from '../components/recommendations/ImplementationPlanModal.jsx'
import InterventionTypeChart from '../components/recommendations/InterventionTypeChart.jsx'
import RecommendationCard from '../components/recommendations/RecommendationCard.jsx'
import RecommendationDetailPanel from '../components/recommendations/RecommendationDetailPanel.jsx'
import RecommendationFilters from '../components/recommendations/RecommendationFilters.jsx'
import TopPriorityWardsTable from '../components/recommendations/TopPriorityWardsTable.jsx'
import { useRecommendations } from '../hooks/useRecommendations.js'
import cityscape from '../assets/watermap-cityscape.png'

const RECOMMENDATION_METRIC_ICONS = { Leaf, Target, Droplets, Users }

/**
 * Recommendations Page.
 *
 * Implements a high-fidelity, polished, water-management recommendations dashboard
 * matching the reference mockup:
 * - Header with subtitle and green skyline banner
 * - 4 Key metric cards
 * - Category filter pills and risk/impact sort selectors
 * - Main 3-column layout:
 *     1. Priority Districts Map (Bangalore SVG map with controls & legend)
 *     2. Recommended Actions list (24)
 *     3. Detailed spec & tabs panel with infrastructure image for selected recommendation
 * - Bottom analytics row:
 *     1. Cumulative Impact Projection (2024-2030)
 *     2. Impact by Intervention Type
 *     3. Top Priority Districts table
 */
const RecommendationsPage = () => {
  const {
    recommendations,
    allRecommendations,
    categoryCounts,
    selectedRecommendation,
    selectedId,
    setSelectedId,
    activeTab,
    setActiveTab,
    categoryFilter,
    setCategoryFilter,
    priorityFilter,
    setPriorityFilter,
    sortBy,
    setSortBy,
    plannedIds,
    togglePlanned,
    metrics,
    cumulativeImpact,
    interventionImpact,
    topDistricts,
    topWards,
  } = useRecommendations()

  const [modalOpen, setModalOpen] = useState(false)
  const [modalRecommendation, setModalRecommendation] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(null)
    }, 3200)
  }

  const handleTogglePlan = (id) => {
    togglePlanned(id)
    const item = allRecommendations.find((r) => r.id === id)
    const isNowPlanned = !plannedIds.has(id)
    if (item) {
      showToast(
        isNowPlanned
          ? `Added "${item.shortTitle}" to city resilience plan.`
          : `Removed "${item.shortTitle}" from city plan.`
      )
    }
  }

  const handleViewPlan = (recommendation) => {
    setModalRecommendation(recommendation)
    setModalOpen(true)
  }

  return (
    <div className="recommendations-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="recommendations-toast" role="status" aria-live="polite">
          <Leaf size={16} className="recommendations-toast__icon" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <header className="recommendations-header">
        <div className="recommendations-header__title-block">
          <h1 className="recommendations-header__title">Recommendations</h1>
          <p className="recommendations-header__subtitle">
            Data-driven, actionable solutions for a more water secure Karnataka.
          </p>
        </div>

        {/* Top-Right Skyline Banner with left side completely blurred */}
        <div className="recommendations-banner" role="region" aria-label="WaterMap recommendations banner">
          <div
            className="recommendations-banner__backdrop"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(242, 250, 247, 1) 0%, rgba(242, 250, 247, 0.35) 25%, rgba(242, 250, 247, 0) 55%), url(${cityscape})`,
            }}
            aria-hidden="true"
          />
          <div className="recommendations-banner__blur-veil" aria-hidden="true" />
          <div className="recommendations-banner__card">
            <span className="recommendations-banner__icon">
              <Leaf size={18} aria-hidden="true" />
            </span>
            <div className="recommendations-banner__text">
              <h2 className="recommendations-banner__heading">From insights to impact</h2>
              <p className="recommendations-banner__caption">
                Practical interventions for resilient cities.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 4 Metric Cards */}
      <section className="recommendations-metrics-grid" aria-label="Key recommendation metrics">
        {metrics.map((metric) => {
          const Icon = RECOMMENDATION_METRIC_ICONS[metric.iconName] ?? Leaf
          const tone = metric.tone === 'green' ? 'mint' : (metric.tone ?? 'blue')
          return (
            <article className="card rec-metric-card" key={metric.id}>
              <div className={`rec-metric-card__icon rec-metric-card__icon--${tone}`}>
                <Icon size={20} aria-hidden="true" />
              </div>
              <div className="rec-metric-card__content">
                <p className="rec-metric-card__value">{metric.value}</p>
                <h3 className="rec-metric-card__title">{metric.title}</h3>
                {metric.trend ? (
                  <p className={`rec-metric-card__trend${metric.trendTone === 'negative' ? ' rec-metric-card__trend--negative' : ' rec-metric-card__trend--positive'}`}>
                    <ArrowUp size={13} aria-hidden="true" />
                    <span>{metric.trend}</span>
                  </p>
                ) : metric.note ? <p className="rec-metric-card__subtext">{metric.note}</p> : null}
              </div>
            </article>
          )
        })}
      </section>

      {/* Category & Priority Filters */}
      <section className="recommendations-filters-section" aria-label="Filters">
        <RecommendationFilters
          category={categoryFilter}
          onCategoryChange={setCategoryFilter}
          priority={priorityFilter}
          onPriorityChange={setPriorityFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          categoryCounts={categoryCounts}
        />
      </section>

      {/* Main 3-Column Layout */}
      <section className="recommendations-main-grid" aria-label="Recommendations interactive explorer">
        {/* Left Column: Priority Districts Map (Bangalore SVG map with controls & legend) */}
        <div className="recommendations-main-col recommendations-main-col--map">
          <PriorityWardMap onSelectDistrict={(district) => {
            const num = district.id.replace('D', '').replace('W', '')
            const matching = allRecommendations.find(
              (r) => r.targetDistrictIds?.includes(num) || r.targetDistricts?.includes(district.name) || r.targetWardIds?.includes(num)
            )
            if (matching) setSelectedId(matching.id)
          }} />
        </div>

        {/* Center Column: Selectable Recommendation Cards */}
        <div className="recommendations-main-col recommendations-main-col--list">
          <div className="recommendations-list-card card">
            <header className="recommendations-list-card__header">
              <h3 className="recommendations-list-card__title">
                Recommended Actions ({recommendations.length})
              </h3>
            </header>
            <div className="recommendations-list-card__body">
              {recommendations.length === 0 ? (
                <div className="recommendations-list-card__empty">
                  <p>No recommendations match the selected filters.</p>
                  <button
                    type="button"
                    className="btn btn--outline btn--sm"
                    onClick={() => {
                      setCategoryFilter('all')
                      setPriorityFilter('all')
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="recommendations-list-card__items">
                  {recommendations.map((rec) => (
                    <RecommendationCard
                      key={rec.id}
                      recommendation={rec}
                      isSelected={rec.id === selectedId}
                      onSelect={(id) => {
                        setSelectedId(id)
                        if (id !== selectedId) {
                          setActiveTab('overview')
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Details Panel for Selected Recommendation */}
        <div className="recommendations-main-col recommendations-main-col--detail">
          {selectedRecommendation ? (
            <RecommendationDetailPanel
              recommendation={selectedRecommendation}
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              isPlanned={plannedIds.has(selectedRecommendation.id)}
              onTogglePlanned={handleTogglePlan}
              onViewPlan={handleViewPlan}
              onClose={() => {}}
            />
          ) : (
            <div className="card"><p className="dashboard-empty-state">No recommendations are available for this city yet.</p></div>
          )}
        </div>
      </section>

      {/* Bottom Analytics Section */}
      <section className="recommendations-bottom-grid" aria-label="Intervention projections">
        <CumulativeImpactChart data={cumulativeImpact} />
        <InterventionTypeChart data={interventionImpact} />
        <TopPriorityWardsTable districts={topDistricts} data={topDistricts} />
      </section>

      {/* Implementation Plan Roadmap Modal */}
      <ImplementationPlanModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        recommendation={modalRecommendation}
        isPlanned={plannedIds.has(modalRecommendation?.id)}
        onTogglePlanned={handleTogglePlan}
      />
    </div>
  )
}

export default RecommendationsPage
