import { useState } from 'react'
import { Layers, Minus, Plus } from 'lucide-react'
import MapLegend from '../map/MapLegend.jsx'
import WardRiskIllustration from '../map/WardRiskIllustration.jsx'

const WARD_LEGEND_ITEMS = [
  { label: 'High Risk', color: '#EF4444' },
  { label: 'Moderate Risk', color: '#FFCC59' },
  { label: 'Low Risk', color: '#45BD9B' },
]

/**
 * Ward Map panel for the Ward Details page.
 *
 * The geographical map area is intentionally left EMPTY in this version:
 * a pale, neutral canvas hosts ready-to-wire placeholder controls (zoom,
 * layers), the ward marker label, a risk legend and a 0–2 km scale bar so
 * a real map library can be dropped in later without touching the
 * surrounding UI.
 *
 * FUTURE MAP INTEGRATION
 * ----------------------
 * Replace `.ward-map-canvas__placeholder` with the real map component
 * (e.g. react-leaflet + OpenStreetMap/Mapbox), keeping `.ward-map-canvas`
 * as its sized container; wire `onZoomIn`/`onZoomOut`/`onToggleLayers`
 * to the map instance's zoom/layer APIs and render the Ward 12 boundary
 * GeoJSON layer beneath the marker. The controls below are UI placeholders
 * only — they do NOT manipulate a real map in this build.
 */
const WardMapCanvas = ({ wardName = 'Ward 12' }) => {
  const [zoomLevel, setZoomLevel] = useState(1)
  const [layersOn, setLayersOn] = useState(true)

  const handleZoomIn = () => setZoomLevel((level) => Math.min(4, level + 0.5))
  const handleZoomOut = () => setZoomLevel((level) => Math.max(1, level - 0.5))
  const handleToggleLayers = () => setLayersOn((on) => !on)

  return (
    <section className="card ward-map" aria-labelledby="ward-map-title">
      <div className="card__header">
        <h2 className="card__title" id="ward-map-title">
          Ward Map
        </h2>
      </div>

      <div
        className="ward-map-canvas"
        role="group"
        aria-label={`${wardName} map (map area placeholder)`}
      >
        <WardRiskIllustration satellite={layersOn} />

        {/* Placeholder controls — UI only, they do not move a real map. */}
        <div className="ward-map-controls">
          <button
            type="button"
            className="ward-map-controls__button"
            onClick={handleZoomIn}
            aria-label="Zoom in"
          >
            <Plus size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="ward-map-controls__button"
            onClick={handleZoomOut}
            aria-label="Zoom out"
          >
            <Minus size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="ward-map-controls__button"
            onClick={handleToggleLayers}
            aria-label="Map layers"
            aria-pressed={layersOn}
          >
            <Layers size={15} aria-hidden="true" />
          </button>
        </div>
        <span className="ward-map-canvas__zoom" aria-hidden="true">
          {zoomLevel.toFixed(1)}×
        </span>

        {/* Selected-ward marker label (static in this build). */}
        <span className="ward-map-marker">
          <span className="ward-map-marker__pin" aria-hidden="true" />
          {wardName} · High Risk
        </span>

        <MapLegend title="Risk Level" items={WARD_LEGEND_ITEMS} />

        <div className="ward-map-scale" aria-label="Map scale: 0 to 2 kilometres">
          <div className="ward-map-scale__bar" aria-hidden="true">
            <span className="ward-map-scale__segment" />
            <span className="ward-map-scale__segment ward-map-scale__segment--alt" />
          </div>
          <div className="ward-map-scale__labels" aria-hidden="true">
            <span>0</span>
            <span>2 km</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WardMapCanvas
