// Shared setup for the district map vitest suites.
// Leaflet never reaches a real browser in jsdom; the react-leaflet
// components are mocked per suite instead, so only Leaflet's global
// namespace (used by L.geoJSON in FitDistricts) needs stubbing.
import '@testing-library/jest-dom/vitest'

import L from 'leaflet'

if (typeof window !== 'undefined') {
  window.L = L
}
