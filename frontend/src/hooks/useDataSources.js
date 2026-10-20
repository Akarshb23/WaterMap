import { useEffect, useMemo, useState } from 'react'
import {
  DATA_QUALITY_METRICS,
  DATA_SOURCES_SUMMARY_METRICS,
  DATA_SOURCES_TABLE_RECORDS,
  DATA_TRENDS_DATA,
  KEY_INDICATORS,
} from '../data/dataSourcesData.js'
import {
  fetchDataQuality,
  fetchDataSourceMetrics,
  fetchDataSources,
  fetchDataTrends,
  fetchKeyIndicators,
} from '../services/dataSourceService.js'

export function useDataSources() {
  const [selectedType, setSelectedType] = useState('all')
  const [coverageSource, setCoverageSource] = useState('all')
  const [trendTab, setTrendTab] = useState('rainfall')
  const [selectedIndicator, setSelectedIndicator] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const [state, setState] = useState({
    sources: DATA_SOURCES_TABLE_RECORDS,
    summaryMetrics: DATA_SOURCES_SUMMARY_METRICS,
    indicators: KEY_INDICATORS,
    qualityMetrics: DATA_QUALITY_METRICS,
    trendData: DATA_TRENDS_DATA.rainfall,
    isLoading: false,
    error: null,
  })

  useEffect(() => {
    let isCurrent = true
    Promise.all([
      fetchDataSources(),
      fetchDataSourceMetrics(),
      fetchKeyIndicators(),
      fetchDataTrends(trendTab),
      fetchDataQuality(),
    ])
      .then(([sources, summaryMetrics, indicators, trendData, qualityMetrics]) => {
        if (isCurrent) {
          setState({
            sources: sources && sources.length > 0 ? sources : DATA_SOURCES_TABLE_RECORDS,
            summaryMetrics: summaryMetrics && summaryMetrics.length > 0 ? summaryMetrics : DATA_SOURCES_SUMMARY_METRICS,
            indicators: indicators && indicators.length > 0 ? indicators : KEY_INDICATORS,
            qualityMetrics: qualityMetrics && qualityMetrics.length > 0 ? qualityMetrics : DATA_QUALITY_METRICS,
            trendData: trendData && trendData.length > 0 ? trendData : DATA_TRENDS_DATA[trendTab] || DATA_TRENDS_DATA.rainfall,
            isLoading: false,
            error: null,
          })
        }
      })
      .catch(() => {
        if (isCurrent) {
          setState((curr) => ({
            ...curr,
            trendData: DATA_TRENDS_DATA[trendTab] || DATA_TRENDS_DATA.rainfall,
            isLoading: false,
            error: null,
          }))
        }
      })

    return () => {
      isCurrent = false
    }
  }, [trendTab])

  const filteredSources = useMemo(() => {
    return state.sources.filter((record) => {
      if (selectedType !== 'all' && record.typeKey !== selectedType) return false
      if (searchQuery?.trim()) {
        const q = searchQuery.toLowerCase().trim()
        return [record.name, record.type, record.indicators, record.coverage].some(
          (value) => String(value ?? '').toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [state.sources, selectedType, searchQuery])

  return {
    allSources: state.sources,
    filteredSources,
    summaryMetrics: state.summaryMetrics,
    keyIndicators: state.indicators,
    filteredIndicators: state.indicators,
    trendData: state.trendData,
    qualityMetrics: state.qualityMetrics,
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
    isLoading: state.isLoading,
    error: state.error,
  }
}
