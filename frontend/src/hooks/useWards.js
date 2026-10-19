import { useEffect, useState } from 'react'
import { fetchWards } from '../services/wardService.js'
import { getApiErrorMessage } from '../services/apiClient.js'

export function useWards(filters = {}) {
  const [state, setState] = useState({ wards: [], isLoading: true, error: null })
  const zone = filters.zone ?? 'all'
  const risk = filters.risk ?? 'all'
  const cityId = filters.cityId ?? 'bengaluru'

  useEffect(() => {
    const controller = new AbortController()
    setState((current) => ({ ...current, isLoading: true, error: null }))
    fetchWards({ zone, risk, cityId, signal: controller.signal })
      .then((wards) => {
        if (!controller.signal.aborted) setState({ wards, isLoading: false, error: null })
      })
      .catch((error) => {
        if (!controller.signal.aborted) setState((current) => ({ ...current, isLoading: false, error: getApiErrorMessage(error) }))
      })
    return () => controller.abort()
  }, [zone, risk, cityId])

  return state
}
