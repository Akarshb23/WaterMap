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

const ZOOM_MIN = 1
const ZOOM_MAX = 4
const ZOOM_STEP = 0.5

/**
 * Format the demo value for the selected View + Time Period combination,
 * e.g. "0.87", "520 mm".
 */
const formatMetricValue = (view, period) => {
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
 * The city map workspace. The geographical map area is intentionally left
 * EMPTY in this version: a pale, neutral canvas hosts the ready-to-wire
 * controls (zoom, locate, legend, layer switches, scale) so a real map
 * library can be dropped in later without touching the surrounding UI.
 */
const CityMapCanvas = ({ filters, matchedWards = [], isPanelOpen = true, onRestorePanel }) => {
  const [zoomLevel, setZoomLevel] = useState(1)
  const [showBoundaries, setShowBoundaries] = useState(true)
  const [satelliteView, setSatelliteView] = useState(false)

  /*
   * FUTURE MAP INTEGRATION
   * ----------------------
   * Mount the real map here (e.g. react-leaflet + OpenStreetMap/Mapbox):
   * - replace the `.city-map-canvas__placeholder` block with the map
   *   component, keeping `.city-map-canvas` as its sized container;
   * - wire `onZoomIn`/`onZoomOut`/`onLocate` to the map instance's zoom API;
   * - render the ward boundary GeoJSON layer as children, toggled by
   *   `showBoundaries`, and swap the base tiles using `satelliteView`.
   * The toolbar filters, legend and ward panel stay outside this component.
   */
  const handleZoomIn = () => setZoomLevel((level) => Math.min(ZOOM_MAX, level + ZOOM_STEP))
  const handleZoomOut = () => setZoomLevel((level) => Math.max(ZOOM_MIN, level - ZOOM_STEP))
  const handleLocate = () => setZoomLevel(1)

  const metricSeries = WARD_METRIC_SERIES[filters.view]
  const matchedNames = matchedWards.map((ward) => ward.name)

  return (
    <div
      className="city-map-canvas"
      role="group"
      aria-label="Interactive city map of New Delhi (map area placeholder)"
    >
      <WardRiskIllustration satellite={satelliteView} />

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
          {formatMetricValue(filters.view, filters.period)}
        </p>
        <p className="city-map-view-card__meta">{metricSeries?.label ?? 'Water Stress Index'}</p>
        <p className="city-map-view-card__meta">
          {optionLabel(CITY_MAP_PERIOD_OPTIONS, filters.period)} ·{' '}
          {optionLabel(CITY_MAP_ZONE_OPTIONS, filters.zone)}
        </p>
        <div className="city-map-view-card__wards">
          <p className="city-map-view-card__count">
            {matchedWards.length} {matchedWards.length === 1 ? 'ward matches' : 'wards match'}
          </p>
          {matchedNames.length > 0 ? (
            <ul className="city-map-view-card__list">
              {matchedNames.slice(0, 3).map((name) => (
                <li key={name}>{name}</li>
              ))}
              {matchedNames.length > 3 ? <li>+{matchedNames.length - 3} more</li> : null}
            </ul>
          ) : (
            <p className="city-map-view-card__empty">No wards match the filters.</p>
          )}
        </div>
      </aside>

      {/* Placeholder for the selected-ward marker: restores the details panel. */}
      {!isPanelOpen ? (
        <button
          type="button"
          className="city-map-ward-marker"
          onClick={onRestorePanel}
          aria-label="Open Ward 12 details"
        >
          <span className="city-map-ward-marker__pin" aria-hidden="true" />
          Ward 12 · High Risk
        </button>
      ) : null}

      <MapLegend title="Water Stress Index" items={CITY_MAP_LEGEND_ITEMS}>
        <div className="city-map-legend__switches">
          <ToggleSwitch
            id="city-map-boundaries-toggle"
            label="Ward Boundaries"
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
