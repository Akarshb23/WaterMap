/**
 * Route paths for the WaterMap app. `WARD_DETAILS` contains a path
 * parameter consumed via `useParams()`; `WARD_DETAILS_HOME` is the
 * concrete link target used by the sidebar (Ward 12 details).
 */
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  CITY_MAP: '/map',
  WARD_DETAILS: '/wards/:wardId',
  WARD_DETAILS_HOME: '/wards/12',
  PREDICTIONS: '/predictions',
  SIMULATION: '/simulation',
  RECOMMENDATIONS: '/recommendations',
  DATA_SOURCES: '/data-sources',
  ABOUT: '/about',
}
