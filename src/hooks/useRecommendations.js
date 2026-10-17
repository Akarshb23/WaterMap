import { useState } from 'react'
import {
  CUMULATIVE_IMPACT_PROJECTION,
  INTERVENTION_TYPE_IMPACT,
  RECOMMENDATION_METRICS,
  RECOMMENDATIONS_LIST,
  TOP_PRIORITY_WARDS_DATA,
} from '../data/recommendationsData.js'

/**
 * Hook providing recommendations data and planner state.
 */
export function useRecommendations() {
  const [recommendations] = useState(RECOMMENDATIONS_LIST)
  const [metrics] = useState(RECOMMENDATION_METRICS)
  const [cumulativeImpact] = useState(CUMULATIVE_IMPACT_PROJECTION)
  const [interventionImpact] = useState(INTERVENTION_TYPE_IMPACT)
  const [topWards] = useState(TOP_PRIORITY_WARDS_DATA)
  const [selectedId, setSelectedId] = useState('rainwater-harvesting')
  const [activeTab, setActiveTab] = useState('overview')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('impact')
  const [plannedIds, setPlannedIds] = useState(new Set())

  const selectedRecommendation =
    recommendations.find((item) => item.id === selectedId) || recommendations[0]

  const togglePlanned = (id) => {
    setPlannedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Filter and sort items
  const filteredRecommendations = recommendations
    .filter((item) => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false
      if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'impact') return b.impactScore - a.impactScore
      if (sortBy === 'cost-desc') return b.costNum - a.costNum
      if (sortBy === 'cost-asc') return a.costNum - b.costNum
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      if (sortBy === 'savings') return b.savingsNum - a.savingsNum
      return 0
    })

  return {
    recommendations: filteredRecommendations,
    allRecommendations: recommendations,
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
    topWards,
    isLoading: false,
    error: null,
  }
}
