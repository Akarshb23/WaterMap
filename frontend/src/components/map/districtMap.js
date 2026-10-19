// Pure helpers for the district choropleth.
// Keeping them free of DOM/Leaflet dependencies makes selection, coloring,
// and data-integrity rules directly unit-testable.

// Risk palette used for source-backed scores and clearly labelled model estimates.
export const RISK_COLORS = {
  low: '#58C98D',
  moderate: '#FFD166',
  high: '#FF8C42',
  critical: '#EF5350',
  insufficient_data: '#DCE3E8',
}

// Administrative-boundary palette.
// These hues are assigned per district by a stable hash and are
// explicitly NOT water-stress classifications.
export const ADMINISTRATIVE_COLORS = ['#58C98D', '#FFD166', '#FF8C42', '#EF5350']

export const UNVERIFIED_FILL = '#DCE3E8'
export const SELECTED_STROKE = '#075f50'

const VALID_RISKS = new Set(Object.keys(RISK_COLORS))

export function normalizeRisk(value) {
  const risk = String(value ?? '').trim().toLowerCase().replaceAll(' ', '_')

  return VALID_RISKS.has(risk) ? risk : null
}

export function hasVerifiedScore(properties) {
  const score = properties?.water_stress_index
  const risk = normalizeRisk(properties?.risk_category)
  const status = String(properties?.data_status ?? '').toLowerCase()

  return (
    typeof score === 'number' &&
    Number.isFinite(score) &&
    risk !== null &&
    status === 'verified_district_metrics'
  )
}

export function hasEstimatedScore(properties) {
  const score = properties?.water_stress_index
  const risk = normalizeRisk(properties?.risk_category)
  const status = String(properties?.data_status ?? '').toLowerCase()

  return (
    typeof score === 'number' &&
    Number.isFinite(score) &&
    risk !== null &&
    status === 'estimated_model'
  )
}

export function hasUsableScore(properties) {
  return hasVerifiedScore(properties) || hasEstimatedScore(properties)
}

export function getAdministrativeColor(feature) {
  const properties = feature?.properties ?? {}
  const key = String(
    properties.district_id ?? feature?.id ?? properties.district_name ?? 'district',
  )

  // Stable color per district; never depends on selection, map state,
  // or feature array order.
  let hash = 0

  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  }

  return ADMINISTRATIVE_COLORS[hash % ADMINISTRATIVE_COLORS.length]
}

export function getFeatureFill(feature) {
  const properties = feature?.properties ?? {}

  if (hasUsableScore(properties)) {
    const risk = normalizeRisk(properties.risk_category)

    if (risk && RISK_COLORS[risk]) {
      return RISK_COLORS[risk]
    }
  }

  // Colors distinguish administrative polygons only.
  return getAdministrativeColor(feature)
}

// The district_id is the single source of truth for selection identity;
// the API guarantees it for every boundary feature it emits.
export function getDistrictId(feature) {
  const id = feature?.properties?.district_id ?? feature?.id

  return id === undefined || id === null ? null : String(id)
}

export function getSelectedDistrictId(selected) {
  if (!selected) return null

  const id = selected.districtId ?? selected.district_id ?? selected.id

  return id === undefined || id === null ? null : String(id)
}

// Leaflet vector layer style; called for both initial render and
// subsequent setStyle() updates so selection cannot change geometry
// or imply a risk category where no usable score exists.
export function styleFeature(feature, selectedDistrictId) {
  const featureId = getDistrictId(feature)
  const isSelected = selectedDistrictId !== null && featureId !== null && featureId === selectedDistrictId
  const verified = hasUsableScore(feature?.properties)

  return {
    color: isSelected ? SELECTED_STROKE : '#ffffff', // Selected: dark green, unselected: white
    weight: isSelected ? 3 : 2.0, // Selected: 3px, non-selected: 2.0px (increased from 1.4 for better visibility)
    opacity: 1,
    fillColor: getFeatureFill(feature),
    fillOpacity: isSelected ? 0.98 : verified ? 0.88 : 0.82,
    lineJoin: 'round',
    lineCap: 'round',
  }
}