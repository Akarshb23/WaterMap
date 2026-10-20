import { apiGet, isApiMode } from './apiClient.js'

export async function fetchWardsGeoJSON({ signal, cityId = 'bengaluru' } = {}) {
  if (isApiMode()) return apiGet('/map/geojson', { params: { layer: 'ward_boundaries', city_id: cityId }, signal })
  const response = await fetch('/mock-data/wards.geojson', { signal })
  if (!response.ok) throw new Error(`Could not load local district GeoJSON (${response.status}).`)
  return response.json()
}
