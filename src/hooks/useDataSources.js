import { useMemo, useState } from 'react'
import { useFilters } from '../context/FilterContext.jsx'
import {
  DATA_QUALITY_METRICS,
  DATA_SOURCES_SUMMARY_METRICS,
  DATA_SOURCES_TABLE_RECORDS,
  DATA_TRENDS_DATA,
  KEY_INDICATORS,
} from '../data/dataSourcesData.js'

/**
 * Hook providing data sources state, filtering, search, and tab switching.
 */
export function useDataSources() {
  const { searchQuery, setSearchQuery } = useFilters()
  const [selectedType, setSelectedType] = useState('all')
  const [coverageSource, setCoverageSource] = useState('all')
  const [trendTab, setTrendTab] = useState('rainfall')
  const [selectedIndicator, setSelectedIndicator] = useState(null)

  // Filter table records by search query and type
  const filteredSources = useMemo(() => {
    return DATA_SOURCES_TABLE_RECORDS.filter((record) => {
      // Type filter
      if (selectedType !== 'all' && record.typeKey !== selectedType) {
        return false
      }
      // Search query filter
      if (searchQuery && searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim()
        const matchesName = record.name.toLowerCase().includes(q)
        const matchesType = record.type.toLowerCase().includes(q)
        const matchesIndicators = record.indicators.toLowerCase().includes(q)
        const matchesCoverage = record.coverage.toLowerCase().includes(q)
        return matchesName || matchesType || matchesIndicators || matchesCoverage
      }
      return true
    })
  }, [selectedType, searchQuery])

  // Filter or highlight key indicators based on search
  const filteredIndicators = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      return KEY_INDICATORS
    }
    const q = searchQuery.toLowerCase().trim()
    return KEY_INDICATORS.filter(
      (ind) =>
        ind.name.toLowerCase().includes(q) ||
        ind.unit.toLowerCase().includes(q) ||
        ind.description.toLowerCase().includes(q)
    )
  }, [searchQuery])

  return {
    allSources: DATA_SOURCES_TABLE_RECORDS,
    filteredSources,
    summaryMetrics: DATA_SOURCES_SUMMARY_METRICS,
    keyIndicators: KEY_INDICATORS,
    filteredIndicators,
    trendData: DATA_TRENDS_DATA[trendTab] || DATA_TRENDS_DATA.rainfall,
    qualityMetrics: DATA_QUALITY_METRICS,
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
  }
}
