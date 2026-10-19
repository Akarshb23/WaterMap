import { ROUTES } from './routes.js'

/**
 * Navigation items shared by navbar, sidebar and mobile nav.
 */
export const NAV_ITEMS = [
  { label: 'Home', path: ROUTES.HOME },
  { label: 'Dashboard', path: ROUTES.DASHBOARD },
  { label: 'City Map', path: ROUTES.CITY_MAP },
  // Ward Details links to the concrete Ward 12 route; `matchPrefix` keeps
  // the sidebar item highlighted for any /wards/:wardId route.
  { label: 'Ward Details', path: ROUTES.WARD_DETAILS_HOME, matchPrefix: '/wards' },
  { label: 'Predictions', path: ROUTES.PREDICTIONS },
  { label: 'Simulation', path: ROUTES.SIMULATION },
  { label: 'Recommendations', path: ROUTES.RECOMMENDATIONS },
  { label: 'Data Sources', path: ROUTES.DATA_SOURCES },
  { label: 'About', path: ROUTES.ABOUT },
]

export const SIDEBAR_NAV_ITEMS = NAV_ITEMS.filter(
  (item) => item.path !== ROUTES.HOME && item.path !== ROUTES.WARD_DETAILS_HOME,
)
