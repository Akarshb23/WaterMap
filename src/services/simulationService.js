/**
 * Scenario simulation access.
 *
 * Placeholder: no API calls are implemented yet. Each function fails
 * loudly so that wiring it up is an explicit, deliberate step.
 */
const notImplemented = (name) => {
  throw new Error(`[watermap] ${name} is not implemented yet.`)
}

export async function runSimulation(scenario) {
  notImplemented(`simulationService.runSimulation(${scenario?.id ?? 'new scenario'})`)
}

export async function fetchSimulationRun(runId) {
  notImplemented(`simulationService.fetchSimulationRun(${runId})`)
}
