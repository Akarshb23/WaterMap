/**
 * Forecast/prediction data access.
 *
 * Placeholder: no API calls are implemented yet. Each function fails
 * loudly so that wiring it up is an explicit, deliberate step.
 */
const notImplemented = (name) => {
  throw new Error(`[watermap] ${name} is not implemented yet.`)
}

export async function fetchForecasts() {
  notImplemented('predictionService.fetchForecasts')
}

export async function fetchRiskDrivers() {
  notImplemented('predictionService.fetchRiskDrivers')
}
