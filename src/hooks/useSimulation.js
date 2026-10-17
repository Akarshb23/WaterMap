/**
 * Simulation hook placeholder.
 *
 * Returns a stable state shape so callers can be written against it;
 * `runScenario` is wired to `simulationService` later.
 */
export function useSimulation() {
  return {
    scenario: null,
    results: null,
    isRunning: false,
    error: null,
    runScenario: null,
  }
}
