import { useEffect, useMemo, useState } from 'react'
import {
  CUMULATIVE_IMPACT_PROJECTION, INTERVENTION_TYPE_IMPACT, RECOMMENDATION_METRICS,
  RECOMMENDATIONS_LIST, TOP_PRIORITY_DISTRICTS_DATA,
} from '../data/recommendationsData.js'
import { fetchRecommendations, fetchRecommendationImpact, fetchRecommendationMetrics, saveRecommendationPlan } from '../services/recommendationService.js'
import { getApiErrorMessage } from '../services/apiClient.js'
import { useCity } from '../context/CityContext.jsx'
import { isApiMode } from '../services/apiClient.js'

export function useRecommendations() {
  const { selectedCityId } = useCity()
  const cityId = selectedCityId || 'bengaluru'
  const [data, setData] = useState({
    recommendations: RECOMMENDATIONS_LIST,
    metrics: RECOMMENDATION_METRICS,
    cumulativeImpact: CUMULATIVE_IMPACT_PROJECTION,
    interventionImpact: INTERVENTION_TYPE_IMPACT,
    topDistricts: TOP_PRIORITY_DISTRICTS_DATA,
    isLoading: false,
    error: null,
  })
  const [selectedId, setSelectedId] = useState('rainwater-harvesting')
  const [activeTab, setActiveTab] = useState('overview')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('impact')
  const [plannedIds, setPlannedIds] = useState(new Set())

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      fetchRecommendations({ signal: controller.signal, cityId }),
      fetchRecommendationImpact({ signal: controller.signal }),
      fetchRecommendationMetrics({ signal: controller.signal, cityId }),
    ])
      .then(([recommendations, impact, metrics]) => {
        if (!controller.signal.aborted) setData({
          recommendations: recommendations && recommendations.length > 0 ? recommendations : RECOMMENDATIONS_LIST,
          metrics: metrics && metrics.length > 0 ? metrics : RECOMMENDATION_METRICS,
          cumulativeImpact: impact?.cumulative ?? CUMULATIVE_IMPACT_PROJECTION,
          interventionImpact: impact?.interventions ?? INTERVENTION_TYPE_IMPACT,
          topDistricts: impact?.topDistricts ?? TOP_PRIORITY_DISTRICTS_DATA,
          isLoading: false,
          error: null,
        })
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setData((current) => ({
            ...current,
            isLoading: false,
            error: null, // Gracefully use rich demo dataset
          }))
        }
      })
    return () => controller.abort()
  }, [cityId])

  const selectedRecommendation = data.recommendations.find((item) => item.id === selectedId) || data.recommendations[0] || null

  const togglePlanned = async (id) => {
    const currentlyPlanned = plannedIds.has(id)
    const nextPlanned = !currentlyPlanned
    const recommendation = data.recommendations.find((item) => item.id === id)
    setPlannedIds((previous) => {
      const next = new Set(previous)
      nextPlanned ? next.add(id) : next.delete(id)
      return next
    })
    try {
      const saveResult = await saveRecommendationPlan({ recommendationId: id, planned: nextPlanned, recommendation })
      if (saveResult?.unsupported) {
        setPlannedIds((previous) => { const next = new Set(previous); nextPlanned ? next.delete(id) : next.add(id); return next })
        setData((current) => ({ ...current, error: saveResult.message }))
      }
    } catch (error) {
      setPlannedIds((previous) => {
        const next = new Set(previous)
        nextPlanned ? next.delete(id) : next.add(id)
        return next
      })
      setData((current) => ({ ...current, error: getApiErrorMessage(error) }))
    }
  }

  const filteredRecommendations = useMemo(() => data.recommendations
    .filter((item) => (categoryFilter === 'all' || item.category === categoryFilter) && (priorityFilter === 'all' || item.priority === priorityFilter))
    .sort((a, b) => {
      if (sortBy === 'impact') return (b.impactScore ?? 0) - (a.impactScore ?? 0)
      if (sortBy === 'cost-desc') return (b.costNum ?? 0) - (a.costNum ?? 0)
      if (sortBy === 'cost-asc') return (a.costNum ?? 0) - (b.costNum ?? 0)
      if (sortBy === 'priority') {
        const order = { high: 3, medium: 2, low: 1 }
        return (order[b.priority] ?? 0) - (order[a.priority] ?? 0)
      }
      if (sortBy === 'savings') return (b.savingsNum ?? 0) - (a.savingsNum ?? 0)
      return 0
    }), [data.recommendations, categoryFilter, priorityFilter, sortBy])

  const categoryCounts = useMemo(() => {
    const counts = {
      all: data.recommendations.length,
      infrastructure: 0,
      policy: 0,
      demand: 0,
      nature: 0,
    }
    data.recommendations.forEach((item) => {
      if (counts[item.category] !== undefined) {
        counts[item.category] += 1
      }
    })
    return counts
  }, [data.recommendations])

  const dynamicMetrics = useMemo(() => {
    return data.metrics.map((metric) => {
      if (metric.id === 'recommended-actions') {
        return {
          ...metric,
          value: categoryCounts.all.toString(),
        }
      }
      return metric
    })
  }, [data.metrics, categoryCounts])

  return {
    recommendations: filteredRecommendations,
    allRecommendations: data.recommendations,
    categoryCounts,
    selectedRecommendation, selectedId, setSelectedId,
    activeTab, setActiveTab, categoryFilter, setCategoryFilter,
    priorityFilter, setPriorityFilter, sortBy, setSortBy,
    plannedIds, togglePlanned, metrics: dynamicMetrics,
    cumulativeImpact: data.cumulativeImpact, interventionImpact: data.interventionImpact,
    topDistricts: data.topDistricts, isLoading: data.isLoading, error: data.error,
  }
}
