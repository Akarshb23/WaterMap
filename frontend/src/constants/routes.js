/**
 * Route paths for the WaterMap app.
 */
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  CITY_MAP: '/map',
  DISTRICT_DETAILS: '/districts/:districtId',
  DISTRICT_DETAILS_HOME: '/districts/12',
  // Backward compatibility alias
  WARD_DETAILS: '/districts/:districtId',
  WARD_DETAILS_HOME: '/districts/12',
  PREDICTIONS: '/predictions',
  SIMULATION: '/simulation',
  RECOMMENDATIONS: '/recommendations',
  DATA_SOURCES: '/data-sources',
  ABOUT: '/about',
}
