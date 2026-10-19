import { useEffect, useMemo, useState } from 'react'
import { useFilters } from '../context/FilterContext.jsx'
import {
  DATA_QUALITY_METRICS, DATA_SOURCES_SUMMARY_METRICS, DATA_SOURCES_TABLE_RECORDS,
  DATA_TRENDS_DATA, KEY_INDICATORS,
} from '../data/dataSourcesData.js'
import {
  fetchDataSources, fetchDataSourceMetrics, fetchKeyIndicators, fetchDataTrends, fetchDataQuality,
} from '../services/dataSourceService.js'
import { getApiErrorMessage, isApiMode } from '../services/apiClient.js'

export function useDataSources() {
  const { searchQuery, setSearchQuery } = useFilters()
  const [selectedType, setSelectedType] = useState('all')
  const [coverageSource, setCoverageSource] = useState('all')
  const [trendTab, setTrendTab] = useState('rainfall')
  const [selectedIndicator, setSelectedIndicator] = useState(null)
  const [state, setState] = useState({
    sources: isApiMode() ? [] : DATA_SOURCES_TABLE_RECORDS,
    summaryMetrics: isApiMode() ? [] : DATA_SOURCES_SUMMARY_METRICS,
    indicators: isApiMode() ? [] : KEY_INDICATORS,
    qualityMetrics: isApiMode() ? [] : DATA_QUALITY_METRICS,
    trendData: isApiMode() ? [] : DATA_TRENDS_DATA.rainfall,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()
    setState((current) => ({ ...current, isLoading: true, error: null }))
    Promise.all([
      fetchDataSources({ signal: controller.signal }),
      fetchDataSourceMetrics({ signal: controller.signal }),
      fetchKeyIndicators({ signal: controller.signal }),
      fetchDataTrends(trendTab, { signal: controller.signal }),
      fetchDataQuality({ signal: controller.signal }),
    ])
      .then(([sources, summaryMetrics, indicators, trendData, qualityMetrics]) => {
        if (!controller.signal.aborted) {
          setState({ sources, summaryMetrics, indicators, qualityMetrics, trendData, isLoading: false, error: null })
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) setState((current) => ({ ...current, isLoading: false, error: getApiErrorMessage(error) }))
      })
    return () => controller.abort()
  }, [trendTab])

  const filteredSources = useMemo(() => state.sources.filter((record) => {
    if (selectedType !== 'all' && record.typeKey !== selectedType) return false
    if (searchQuery?.trim()) {
      const q = searchQuery.toLowerCase().trim()
      return [record.name, record.type, record.indicators, record.coverage].some((value) => String(value ?? '').toLowerCase().includes(q))
    }
    return true
  }), [state.sources, selectedType, searchQuery])

  const filteredIndicators = useMemo(() => {
    if (!searchQuery?.trim()) return state.indicators
    const q = searchQuery.toLowerCase().trim()
    return state.indicators.filter((item) => [item.name, item.unit, item.description].some((value) => String(value ?? '').toLowerCase().includes(q)))
  }, [state.indicators, searchQuery])

  return {
    allSources: state.sources, filteredSources,
    summaryMetrics: state.summaryMetrics, keyIndicators: state.indicators, filteredIndicators,
    trendData: state.trendData, qualityMetrics: state.qualityMetrics,
    selectedType, setSelectedType, coverageSource, setCoverageSource,
    trendTab, setTrendTab, searchQuery, setSearchQuery, selectedIndicator, setSelectedIndicator,
    isLoading: state.isLoading, error: state.error,
  }
}
