
import axios from 'axios'

const DEFAULT_TIMEOUT = Number(
  import.meta.env.VITE_API_TIMEOUT_MS || 15000,
)

const apiClient = axios.create({
  baseURL: (
    import.meta.env.VITE_API_BASE_URL ||
    'http://127.0.0.1:8000/api/v1'
  ).replace(/\/$/, ''),
  timeout: DEFAULT_TIMEOUT,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail =
      error.response?.data?.message ??
      error.response?.data?.detail

    const message =
      (typeof detail === 'string'
        ? detail
        : detail?.message ??
          (detail ? JSON.stringify(detail) : null)) ??
      error.message ??
      'The API request failed.'

    error.userMessage = message
    return Promise.reject(error)
  },
)

export const isApiMode = () =>
  import.meta.env.VITE_DATA_MODE === 'api'

export async function apiGet(
  path,
  { params, signal, timeout } = {},
) {
  const response = await apiClient.get(path, {
    params,
    signal,
    timeout: timeout ?? DEFAULT_TIMEOUT,
  })

  return response.data?.data ?? response.data
}

export async function apiPost(
  path,
  payload,
  { signal, timeout } = {},
) {
  const response = await apiClient.post(path, payload, {
    signal,
    timeout: timeout ?? DEFAULT_TIMEOUT,
  })

  return response.data?.data ?? response.data
}

export function getApiErrorMessage(error) {
  if (
    error?.code === 'ERR_CANCELED' ||
    error?.name === 'CanceledError'
  ) {
    return null
  }

  if (error?.response?.status === 404) {
    return 'This endpoint is not available on the backend yet.'
  }

  if (
    error?.code === 'ECONNABORTED' ||
    error?.code === 'ETIMEDOUT'
  ) {
    return 'The API request timed out. Please try again.'
  }

  if (!error?.response) {
    return 'Cannot reach the WaterMap API. Check that the backend is running and the API URL is correct.'
  }

  return (
    error.userMessage ||
    'Something went wrong while loading WaterMap data.'
  )
}

export default apiClient
