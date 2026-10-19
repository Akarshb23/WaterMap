import { useEffect, useState } from 'react'
import { fetchForecasts, fetchRiskDrivers } from '../services/predictionService.js'
import { getApiErrorMessage } from '../services/apiClient.js'

export function usePredictions({ cityId = 'new-delhi', horizon = 2030 } = {}) {
  const [state, setState] = useState({ forecasts: null, riskDrivers: [], isLoading: true, error: null })

  useEffect(() => {
    const controller = new AbortController()
    setState((current) => ({ ...current, isLoading: true, error: null }))
    Promise.all([
      fetchForecasts({ cityId, horizon, signal: controller.signal }),
      fetchRiskDrivers({ cityId, signal: controller.signal }),
    ])
      .then(([forecasts, riskDrivers]) => {
        if (!controller.signal.aborted) setState({ forecasts, riskDrivers, isLoading: false, error: null })
      })
      .catch((error) => {
        if (!controller.signal.aborted) setState((current) => ({ ...current, isLoading: false, error: getApiErrorMessage(error) }))
      })
    return () => controller.abort()
  }, [cityId, horizon])

  return state
}
