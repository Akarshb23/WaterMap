import { useEffect, useState } from 'react'
import { fetchDashboardOverview } from '../services/dashboardService.js'
import { getApiErrorMessage, isApiMode } from '../services/apiClient.js'

export function useDashboard({ cityId = 'bangalore', range = '12m' } = {}) {
  const [state, setState] = useState({
    overview: null,
    isLoading: true,
    error: null,
    source: isApiMode() ? 'api' : 'mock',
  })

  useEffect(() => {
    const controller = new AbortController()
    setState((current) => ({ ...current, isLoading: true, error: null }))

    fetchDashboardOverview({ cityId, range, signal: controller.signal })
      .then((overview) => {
        if (!controller.signal.aborted) {
          setState({ overview, isLoading: false, error: null, source: overview?.source || (isApiMode() ? 'api' : 'mock') })
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setState((current) => ({
            ...current,
            isLoading: false,
            error: getApiErrorMessage(error),
          }))
        }
      })

    return () => controller.abort()
  }, [cityId, range])

  return {
    overview: state.overview,
    metrics: state.overview?.metrics ?? [],
    isLoading: state.isLoading,
    error: state.error,
    source: state.source,
    refreshKey: `${cityId}:${range}`,
  }
}
