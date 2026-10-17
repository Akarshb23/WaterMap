import axios from 'axios'

/**
 * Shared HTTP client for all WaterMap API calls.
 *
 * The base URL comes from `VITE_API_BASE_URL` (see `.env.example`); no
 * credentials or secrets are baked into the source.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default apiClient
