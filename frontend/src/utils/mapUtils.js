/**
 * Map helpers. Default view coordinates are intentionally neutral — real
 * city centre/zoom values are configuration, not hard-coded data.
 */

export const DEFAULT_MAP_VIEW = { center: [0, 0], zoom: 2 }

export function isFeatureCollection(data) {
  return (
    typeof data === 'object' &&
    data !== null &&
    data.type === 'FeatureCollection' &&
    Array.isArray(data.features)
  )
}
