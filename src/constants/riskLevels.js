/**
 * Canonical risk levels used across map colours, badges and charts.
 * Colours are design tokens, not data.
 */
export const RISK_LEVELS = {
  LOW: { key: 'LOW', label: 'Low', color: '#2f9e44' },
  MODERATE: { key: 'MODERATE', label: 'Moderate', color: '#f59f00' },
  HIGH: { key: 'HIGH', label: 'High', color: '#e8590c' },
  CRITICAL: { key: 'CRITICAL', label: 'Critical', color: '#e03131' },
}

export const RISK_LEVEL_ORDER = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL']
