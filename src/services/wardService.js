/**
 * Ward data access.
 *
 * Placeholder: no API calls are implemented yet. Each function fails
 * loudly so that wiring it up is an explicit, deliberate step.
 */
const notImplemented = (name) => {
  throw new Error(`[watermap] ${name} is not implemented yet.`)
}

export async function fetchWards() {
  notImplemented('wardService.fetchWards')
}

export async function fetchWardById(wardId) {
  notImplemented(`wardService.fetchWardById(${wardId})`)
}
