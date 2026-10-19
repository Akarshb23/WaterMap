import { apiGet, isApiMode } from './apiClient.js'
import { CITY_OPTIONS } from '../data/demoData.js'

/** Returns cities for which the backend actually has ward data. */
export async function fetchCities({ signal } = {}) {
  if (!isApiMode()) return CITY_OPTIONS
  const data = await apiGet('/cities', { signal })
  const items = Array.isArray(data) ? data : data.items ?? data.cities ?? []
  return items.map((city) => ({ value: city.city_id ?? city.id, label: city.name ?? city.label }))
}
