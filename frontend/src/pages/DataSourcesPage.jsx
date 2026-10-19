import { Database } from 'lucide-react'
import DataCoverageMap from '../components/datasources/DataCoverageMap.jsx'
import DataQualityCard from '../components/datasources/DataQualityCard.jsx'
import DataSourcesSummaryCards from '../components/datasources/DataSourcesSummaryCards.jsx'
import DataSourcesTable from '../components/datasources/DataSourcesTable.jsx'
import DataTrendsChart from '../components/datasources/DataTrendsChart.jsx'
import KeyIndicatorsGrid from '../components/datasources/KeyIndicatorsGrid.jsx'
import { DATA_SOURCES_HEADER } from '../data/dataSourcesData.js'
import { useDataSources } from '../hooks/useDataSources.js'

/**
 * Data Sources Page.
 *
 * Implements a complete, responsive WaterMap Data Sources catalogue:
 * - Header with subtitle and skyline banner placeholder
 * - 4 Summary KPI cards
 * - Data Sources Overview table with type filter and search
 * - Interactive illustrative Data Coverage Map of Delhi with Yamuna river
 * - Key Indicators grid
 * - Data Trends dual-axis chart with tabs
 * - Data Quality & Completeness assessment
 */
const DataSourcesPage = () => {
  const {
    filteredSources,
    summaryMetrics,
    filteredIndicators,
    qualityMetrics,
    trendData,
    selectedType,
    setSelectedType,
    coverageSource,
    setCoverageSource,
    trendTab,
    setTrendTab,
    searchQuery,
    setSearchQuery,
    selectedIndicator,
    setSelectedIndicator,
    isLoading,
    error,
  } = useDataSources()

  return (
    <div className="datasources-page">
      {error ? <div className="dashboard-api-notice" role="status"><div><strong>Data sources could not be refreshed.</strong><p>{error}</p></div></div> : null}
      {isLoading ? <p className="dashboard-loading" role="status">Loading data source information…</p> : null}
      {/* Page Header */}
      <header className="datasources-header">
        <div className="datasources-header__title-block">
          <h1 className="datasources-header__title">{DATA_SOURCES_HEADER.title}</h1>
          <p className="datasources-header__subtitle">{DATA_SOURCES_HEADER.subtitle}</p>
        </div>

        {/* Top-Right Skyline Banner Placeholder */}
        <div className="datasources-banner">
          <div
            className="datasources-banner__image-placeholder"
            role="img"
            aria-label="Header skyline and river landscape banner placeholder"
          />
          <div className="datasources-banner__card">
            <span className="datasources-banner__icon">
              <Database size={18} aria-hidden="true" />
            </span>
            <div className="datasources-banner__text">
              <h2 className="datasources-banner__heading">{DATA_SOURCES_HEADER.bannerBadge}</h2>
              <p className="datasources-banner__caption">
                {DATA_SOURCES_HEADER.bannerTitle}
                <br />
                {DATA_SOURCES_HEADER.bannerSubtitle}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Four Summary Cards */}
      <DataSourcesSummaryCards metrics={summaryMetrics} />

      {/* Middle Grid: Data Sources Overview Table (Left) + Data Coverage Map (Right) */}
      <section className="datasources-middle-grid" aria-label="Data sources overview and coverage">
        <div className="datasources-middle-col datasources-middle-col--table">
          <DataSourcesTable
            records={filteredSources}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onResetFilters={() => {
              setSelectedType('all')
              setSearchQuery('')
            }}
          />
        </div>

        <div className="datasources-middle-col datasources-middle-col--map">
          <DataCoverageMap
            coverageSource={coverageSource}
            onCoverageSourceChange={setCoverageSource}
          />
        </div>
      </section>

      {/* Bottom Grid: Key Indicators (Left) + Data Trends Chart (Center) + Data Quality (Right) */}
      <section className="datasources-bottom-grid" aria-label="Key indicators, trends and quality assessment">
        <div className="datasources-bottom-col datasources-bottom-col--indicators">
          <KeyIndicatorsGrid
            indicators={filteredIndicators}
            selectedIndicator={selectedIndicator}
            onSelectIndicator={setSelectedIndicator}
          />
        </div>

        <div className="datasources-bottom-col datasources-bottom-col--trends">
          <DataTrendsChart
            activeTab={trendTab}
            onTabChange={setTrendTab}
            data={trendData}
          />
        </div>

        <div className="datasources-bottom-col datasources-bottom-col--quality">
          <DataQualityCard metrics={qualityMetrics} />
        </div>
      </section>
    </div>
  )
}

export default DataSourcesPage
