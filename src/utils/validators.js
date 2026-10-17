/**
 * Generic input validation helpers.
 */

export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

export function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value)
}

export function isInRange(value, min, max) {
  return isFiniteNumber(value) && value >= min && value <= max
}
