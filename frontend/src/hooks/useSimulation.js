import { useCallback, useState } from 'react'
import { DEFAULT_SIMULATION_INPUT, runScenarioSimulation } from '../data/simulationData.js'
import { runSimulation as submitSimulation } from '../services/simulationService.js'
import { getApiErrorMessage, isApiMode } from '../services/apiClient.js'

export function useSimulation() {
  const [result, setResult] = useState(() => isApiMode() ? null : runScenarioSimulation(DEFAULT_SIMULATION_INPUT))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const run = useCallback(async (input, options = {}) => {
    setIsLoading(true)
    setError(null)
    try {
      const nextResult = await submitSimulation(input, options)
      setResult(nextResult)
      return nextResult
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { result, run, isLoading, error }
}
