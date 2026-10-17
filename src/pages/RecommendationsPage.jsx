import { useState } from 'react'
import {
  ArrowUp,
  CircleDot,
  Droplets,
  Leaf,
  Users,
} from 'lucide-react'
import CumulativeImpactChart from '../components/recommendations/CumulativeImpactChart.jsx'
import ImplementationPlanModal from '../components/recommendations/ImplementationPlanModal.jsx'
import InterventionTypeChart from '../components/recommendations/InterventionTypeChart.jsx'
import PriorityWardMap from '../components/recommendations/PriorityWardMap.jsx'
import RecommendationCard from '../components/recommendations/RecommendationCard.jsx'
import RecommendationDetailPanel from '../components/recommendations/RecommendationDetailPanel.jsx'
import RecommendationFilters from '../components/recommendations/RecommendationFilters.jsx'
import TopPriorityWardsTable from '../components/recommendations/TopPriorityWardsTable.jsx'
import { useRecommendations } from '../hooks/useRecommendations.js'

/**
 * Recommendations Page.
 *
 * Implements a complete, polished, water-management recommendations dashboard
 * matching the reference design:
 * - Header with subtitle and skyline banner placeholder
 * - 4 Key metric cards
 * - Category filter pills and risk/impact sort selectors
 * - Main 3-column layout:
 *     1. Priority Wards Map (with empty placeholder canvas for real GIS map integration)
 *     2. Recommended Actions list
 *     3. Detailed spec & tabs panel for selected recommendation
 * - Bottom analytics row:
 *     1. Cumulative Impact Projection (2024-2030)
 *     2. Impact by Intervention Type
 *     3. Top Priority Wards table
 */
const RecommendationsPage = () => {
  const {
    recommendations,
    allRecommendations,
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
            Data-driven, actionable solutions for a more water secure New Delhi.
          </p>
        </div>

        {/* Top-Right Skyline Banner Placeholder */}
        <div className="recommendations-banner">
          <div
            className="recommendations-banner__image-placeholder header-skyline-banner-placeholder"
            role="img"
            aria-label="Header skyline and nature banner placeholder"
          />
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
        {/* Metric 1 */}
        <article className="card rec-metric-card">
          <div className="rec-metric-card__icon rec-metric-card__icon--mint">
            <Leaf size={20} aria-hidden="true" />
          </div>
          <div className="rec-metric-card__content">
            <p className="rec-metric-card__value">24</p>
            <h3 className="rec-metric-card__title">Recommended Actions</h3>
            <p className="rec-metric-card__trend rec-metric-card__trend--positive">
              <ArrowUp size={13} aria-hidden="true" />
              <span>8 new this month</span>
            </p>
          </div>
        </article>

        {/* Metric 2 */}
        <article className="card rec-metric-card">
          <div className="rec-metric-card__icon rec-metric-card__icon--blue">
            <CircleDot size={20} aria-hidden="true" />
          </div>
          <div className="rec-metric-card__content">
            <p className="rec-metric-card__value">12</p>
            <h3 className="rec-metric-card__title">High Priority Wards</h3>
            <p className="rec-metric-card__trend rec-metric-card__trend--negative">
              <ArrowUp size={13} aria-hidden="true" />
              <span>3 more than last month</span>
            </p>
          </div>
        </article>

        {/* Metric 3 */}
        <article className="card rec-metric-card">
          <div className="rec-metric-card__icon rec-metric-card__icon--blue">
            <Droplets size={20} aria-hidden="true" />
          </div>
          <div className="rec-metric-card__content">
            <p className="rec-metric-card__value">38%</p>
            <h3 className="rec-metric-card__title">Potential WSI Reduction</h3>
            <p className="rec-metric-card__subtext">with full implementation</p>
          </div>
        </article>

        {/* Metric 4 */}
        <article className="card rec-metric-card">
          <div className="rec-metric-card__icon rec-metric-card__icon--mint">
            <Users size={20} aria-hidden="true" />
          </div>
          <div className="rec-metric-card__content">
            <p className="rec-metric-card__value">₹ 520 Cr</p>
            <h3 className="rec-metric-card__title">Estimated Investment</h3>
            <p className="rec-metric-card__subtext">2025 – 2030</p>
          </div>
        </article>
      </section>

      {/* Working Category & Priority Filters */}
      <section className="recommendations-filters-section" aria-label="Filters">
        <RecommendationFilters
          category={categoryFilter}
          onCategoryChange={setCategoryFilter}
          priority={priorityFilter}
          onPriorityChange={setPriorityFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </section>

      {/* Main 3-Column Layout */}
      <section className="recommendations-main-grid" aria-label="Recommendations interactive explorer">
        {/* Left Column: Priority Wards Map */}
        <div className="recommendations-main-col recommendations-main-col--map">
          <PriorityWardMap />
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
                        // Reset tab to overview on new item selection
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
          <RecommendationDetailPanel
            recommendation={selectedRecommendation}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            isPlanned={plannedIds.has(selectedRecommendation?.id)}
            onTogglePlanned={handleTogglePlan}
            onViewPlan={handleViewPlan}
            onClose={() => {
              // Could deselect or keep first
            }}
          />
        </div>
      </section>

      {/* Bottom Analytics Section */}
      <section className="recommendations-bottom-grid" aria-label="Projections and ward analytics">
        <CumulativeImpactChart />
        <InterventionTypeChart />
        <TopPriorityWardsTable />
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
