/**
 * Display formatting helpers shared across the app.
 */

export function formatNumber(value, options = {}) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return '—'
  }
  return new Intl.NumberFormat('en-US', options).format(value)
}

export function formatPercent(value, digits = 1) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return '—'
  }
  return `${value.toFixed(digits)}%`
}

export function formatDate(value) {
  if (!value) {
    return '—'
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date)
}
