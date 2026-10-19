import { useEffect, useState } from 'react'
import { fetchWardById } from '../services/wardService.js'
import { getApiErrorMessage } from '../services/apiClient.js'

export function useWardDetails(wardId) {
  const [state, setState] = useState({ ward: null, isLoading: Boolean(wardId), error: null })

  useEffect(() => {
    if (!wardId) {
      setState({ ward: null, isLoading: false, error: 'A ward ID is required.' })
      return undefined
    }
    const controller = new AbortController()
    setState({ ward: null, isLoading: true, error: null })
    fetchWardById(wardId, { signal: controller.signal })
      .then((ward) => {
        if (!controller.signal.aborted) setState({ ward, isLoading: false, error: null })
      })
      .catch((error) => {
        if (!controller.signal.aborted) setState({ ward: null, isLoading: false, error: getApiErrorMessage(error) })
      })
    return () => controller.abort()
  }, [wardId])

  return state
}
