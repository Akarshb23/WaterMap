import { useState } from 'react'
import {
  CITY_MAP_LEGEND_ITEMS,
  CITY_MAP_PERIOD_OPTIONS,
  CITY_MAP_ZONE_OPTIONS,
  WARD_METRIC_SERIES,
} from '../../data/cityMapData.js'
import MapControls from '../map/MapControls.jsx'
import MapLegend from '../map/MapLegend.jsx'
import ToggleSwitch from '../common/ToggleSwitch.jsx'
import WardRiskIllustration from '../map/WardRiskIllustration.jsx'
import { isApiMode } from '../../services/apiClient.js'

const ZOOM_MIN = 1
const ZOOM_MAX = 4
const ZOOM_STEP = 0.5

/**
 * Format the demo value for the selected View + Time Period combination,
 * e.g. "0.87", "520 mm".
 */
const formatMetricValue = (view, period, activeWard) => {
  if (isApiMode()) return view === 'wsi' ? Number(activeWard?.wsi ?? 0).toFixed(2) : '—'
  const series = WARD_METRIC_SERIES[view]
  if (!series) {
    return '—'
  }
  const raw = series.values[period]
  if (raw === undefined) {
    return '—'
  }
  return `${raw.toFixed(series.decimals)}${series.unit}`
}

const optionLabel = (options, value) =>
  options.find((option) => option.value === value)?.label ?? value

/**
 * City map workspace using the shared district polygon illustration. Controls,
 * view readout, legend and district details stay in their existing layout.
 */
const CityMapCanvas = ({ filters, matchedDistricts, matchedWards = [], selectedDistrictId = 'district-12', selectedWardId, onDistrictSelect, onWardSelect, isPanelOpen = true, onRestorePanel }) => {
  const [zoomLevel, setZoomLevel] = useState(1)
  const [showBoundaries, setShowBoundaries] = useState(true)
  const [satelliteView, setSatelliteView] = useState(false)

  // Zoom and layer toggles drive the illustrated map until a real GIS layer is connected.
  const handleZoomIn = () => setZoomLevel((level) => Math.min(ZOOM_MAX, level + ZOOM_STEP))
  const handleZoomOut = () => setZoomLevel((level) => Math.max(ZOOM_MIN, level - ZOOM_STEP))
  const handleLocate = () => setZoomLevel(1)

  const districts = matchedDistricts || matchedWards
  const handleSelect = onDistrictSelect || onWardSelect
  const selId = selectedDistrictId || selectedWardId || 'district-12'

  const metricSeries = WARD_METRIC_SERIES[filters.view]
  const matchedNames = districts.map((district) => district.name)
  const activeDistrict = districts.find((district) => String(district.id) === String(selId)) ?? districts[0]

  return (
    <div
      className="city-map-canvas"
      role="group"
      aria-label="Interactive district-level water stress map of Bangalore"
    >
      <WardRiskIllustration
        satellite={satelliteView}
        wards={districts}
        zoom={zoomLevel}
        showBoundaries={showBoundaries}
        selectedWardId={selId}
        onWardSelect={handleSelect}
      />

      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleLocate}
        resetLabel="Locate me"
      />
      {zoomLevel !== 1 ? (
        <span className="city-map-zoom-level">{zoomLevel.toFixed(1)}×</span>
      ) : null}

      {/* Filter readout: keeps View / Time Period / Zone visible and current. */}
      <aside className="city-map-view-card" aria-label="Current map view">
        <p className="city-map-view-card__title">Current view</p>
        <p className="city-map-view-card__value">
          {formatMetricValue(filters.view, filters.period, activeDistrict)}
        </p>
        <p className="city-map-view-card__meta">{metricSeries?.label ?? 'Water Stress Index'}</p>
        <p className="city-map-view-card__meta">
          {isApiMode() ? 'Latest backend record' : optionLabel(CITY_MAP_PERIOD_OPTIONS, filters.period)} ·{' '}
          {optionLabel(CITY_MAP_ZONE_OPTIONS, filters.zone)}
        </p>
        <div className="city-map-view-card__wards">
          <p className="city-map-view-card__count">
            {districts.length} {districts.length === 1 ? 'district matches' : 'districts match'}
          </p>
          {matchedNames.length > 0 ? (
            <ul className="city-map-view-card__list">
              {matchedNames.slice(0, 3).map((name) => (
                <li key={name}>{name}</li>
              ))}
              {matchedNames.length > 3 ? <li>+{matchedNames.length - 3} more</li> : null}
            </ul>
          ) : (
            <p className="city-map-view-card__empty">No districts match the filters.</p>
          )}
        </div>
      </aside>

      {/* Placeholder for the selected-district marker: restores the details panel. */}
      {!isPanelOpen ? (
        <button
          type="button"
          className="city-map-ward-marker"
          onClick={onRestorePanel}
          aria-label={`Open ${activeDistrict?.name ?? 'selected district'} details`}
        >
          <span className="city-map-ward-marker__pin" aria-hidden="true" />
          {activeDistrict?.name ?? 'Selected district'} · {activeDistrict?.riskLabel ?? 'Risk unavailable'}
        </button>
      ) : null}

      <MapLegend title="Water Stress Index" items={isApiMode() ? [{ label: 'Low (0–0.34)', color: '#3ebf9e' }, { label: 'Moderate (0.35–0.54)', color: '#ffc94f' }, { label: 'High (0.55–0.74)', color: '#ff7b45' }, { label: 'Critical (0.75–1.0)', color: '#ef4444' }] : CITY_MAP_LEGEND_ITEMS}>
        <div className="city-map-legend__switches">
          <ToggleSwitch
            id="city-map-boundaries-toggle"
            label="District Boundaries"
            checked={showBoundaries}
            onChange={setShowBoundaries}
          />
          <ToggleSwitch
            id="city-map-satellite-toggle"
            label="Satellite View"
            checked={satelliteView}
            onChange={setSatelliteView}
          />
        </div>
      </MapLegend>

      <div className="city-map-scale" aria-label="Map scale: 0 to 10 kilometres">
        <div className="city-map-scale__bar" aria-hidden="true">
          <span className="city-map-scale__segment" />
          <span className="city-map-scale__segment city-map-scale__segment--alt" />
        </div>
        <div className="city-map-scale__labels" aria-hidden="true">
          <span>0</span>
          <span>5</span>
          <span>10 km</span>
        </div>
      </div>
    </div>
  )
}

export default CityMapCanvas
