import { Database } from 'lucide-react'
import DataCoverageMap from '../components/datasources/DataCoverageMap.jsx'
import DataQualityCard from '../components/datasources/DataQualityCard.jsx'
import DataSourcesSummaryCards from '../components/datasources/DataSourcesSummaryCards.jsx'
import DataSourcesTable from '../components/datasources/DataSourcesTable.jsx'
import DataTrendsChart from '../components/datasources/DataTrendsChart.jsx'
import KeyIndicatorsGrid from '../components/datasources/KeyIndicatorsGrid.jsx'
import { DATA_SOURCES_HEADER } from '../data/dataSourcesData.js'
import { useDataSources } from '../hooks/useDataSources.js'
import cityscape from '../assets/watermap-cityscape.png'

/**
 * Data Sources Page.
 *
 * Implements a pixel-perfect, responsive WaterMap Data Sources catalogue
 * matching the reference mockup:
 * - Header with subtitle and green skyline banner ("Reliable data. Better decisions. More resilient cities.")
 * - 4 Summary KPI cards (8 Data Sources, 25+ Indicators, 2015-2024 Time Range, Last Updated Oct 15, 2026)
 * - Data Sources Overview table with 8 active data sources
 * - Interactive Data Coverage Map of Bangalore with spatial coverage layers, legend, and controls
 * - Key Indicators from Data Sources (3-column grid of 8 indicators)
 * - Data Trends dual-axis chart with tabs (Rainfall, Groundwater, Water Demand)
 * - Data Quality & Completeness assessment with validation message
 */
const DataSourcesPage = () => {
  const {
    filteredSources,
    summaryMetrics,
    keyIndicators,
    qualityMetrics,
    trendData,
    coverageSource,
    setCoverageSource,
    trendTab,
    setTrendTab,
  } = useDataSources()

  return (
    <div className="datasources-page">
      {/* Page Header */}
      <header className="datasources-header">
        <div className="datasources-header__title-block">
          <h1 className="datasources-header__title">{DATA_SOURCES_HEADER.title}</h1>
          <p className="datasources-header__subtitle">{DATA_SOURCES_HEADER.subtitle}</p>
        </div>

        {/* Top-Right Skyline Banner with left side completely blurred */}
        <div className="datasources-banner" role="region" aria-label="WaterMap data sources banner">
          <div
            className="datasources-banner__backdrop"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(242, 250, 247, 1) 0%, rgba(242, 250, 247, 0.35) 25%, rgba(242, 250, 247, 0) 55%), url(${cityscape})`,
            }}
            aria-hidden="true"
          />
          <div className="datasources-banner__blur-veil" aria-hidden="true" />
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
          <DataSourcesTable records={filteredSources} />
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
          <KeyIndicatorsGrid indicators={keyIndicators} />
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
