
import { apiGet } from './apiClient.js'

// District boundaries are API-backed.
// Never substitute ward GeoJSON for district boundaries.
export async function fetchDistrictsGeoJSON({ signal } = {}) {
  return apiGet('/map/districts/geojson', { signal })
}
