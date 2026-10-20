import { ROUTES } from './routes.js'

/**
 * Navigation items shared by navbar, sidebar and mobile nav.
 */
export const NAV_ITEMS = [
  { label: 'Home', path: ROUTES.HOME },
  { label: 'Dashboard', path: ROUTES.DASHBOARD },
  { label: 'City Map', path: ROUTES.CITY_MAP },
  { label: 'District Details', path: ROUTES.DISTRICT_DETAILS_HOME, matchPrefix: '/districts' },
  { label: 'Predictions', path: ROUTES.PREDICTIONS },
  { label: 'Simulation', path: ROUTES.SIMULATION },
  { label: 'Recommendations', path: ROUTES.RECOMMENDATIONS },
  { label: 'Data Sources', path: ROUTES.DATA_SOURCES },
  { label: 'About', path: ROUTES.ABOUT },
]

export const SIDEBAR_NAV_ITEMS = NAV_ITEMS.filter(
  (item) => item.path !== ROUTES.HOME && item.path !== ROUTES.DISTRICT_DETAILS_HOME,
)
