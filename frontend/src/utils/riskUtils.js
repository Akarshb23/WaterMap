import { RISK_LEVELS } from '../constants/riskLevels.js'

/**
 * Risk helpers. Deliberately avoids inventing scoring thresholds — the
 * mapping from score to level belongs to the backend/domain layer.
 */

export function clampRiskScore(score) {
  if (typeof score !== 'number' || !Number.isFinite(score)) {
    return 0
  }
  return Math.min(100, Math.max(0, score))
}

export function resolveRiskLevel(key) {
  return RISK_LEVELS[key] ?? null
}
