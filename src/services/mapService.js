/**
 * Map/GeoJSON data access.
 *
 * Placeholder: no API calls are implemented yet. Each function fails
 * loudly so that wiring it up is an explicit, deliberate step. A local
 * empty FeatureCollection is available at `public/mock-data/wards.geojson`.
 */
const notImplemented = (name) => {
  throw new Error(`[watermap] ${name} is not implemented yet.`)
}

export async function fetchWardsGeoJSON() {
  notImplemented('mapService.fetchWardsGeoJSON')
}
