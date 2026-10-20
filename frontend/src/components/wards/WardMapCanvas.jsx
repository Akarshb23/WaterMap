import { useState } from 'react'
import { Layers, Minus, Plus } from 'lucide-react'
import MapLegend from '../map/MapLegend.jsx'
import WardRiskIllustration from '../map/WardRiskIllustration.jsx'
import { isApiMode } from '../../services/apiClient.js'

const WARD_LEGEND_ITEMS = [
  { label: 'High Risk', color: '#EF4444' },
  { label: 'Moderate Risk', color: '#FFCC59' },
  { label: 'Low Risk', color: '#45BD9B' },
]

/**
 * Ward Map panel for the Ward Details page.
 *
 * Shows the shared illustrated ward polygons with zoom/layer controls and
 * a selected-ward label, keeping map presentation consistent across pages.
 */
const WardMapCanvas = ({ wardName, districtName = 'Koramangala' }) => {
  const name = districtName || wardName || 'Koramangala'
  const [zoomLevel, setZoomLevel] = useState(1)
  const [layersOn, setLayersOn] = useState(true)

  const handleZoomIn = () => setZoomLevel((level) => Math.min(4, level + 0.5))
  const handleZoomOut = () => setZoomLevel((level) => Math.max(1, level - 0.5))
  const handleToggleLayers = () => setLayersOn((on) => !on)

  return (
    <section className="card ward-map" aria-labelledby="ward-map-title">
      <div className="card__header">
        <h2 className="card__title" id="ward-map-title">
          District Map
        </h2>
      </div>

      <div
        className="ward-map-canvas"
        role="group"
        aria-label={`${name} illustrative district map`}
      >
        <WardRiskIllustration satellite={layersOn} zoom={zoomLevel} />

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

        {/* Selected-district marker label (static in this build). */}
        <span className="ward-map-marker">
          <span className="ward-map-marker__pin" aria-hidden="true" />
          {name} · High Risk
        </span>

        <MapLegend title="Risk Level" items={isApiMode() ? [{ label: 'Low (0–0.34)', color: '#45BD9B' }, { label: 'Moderate (0.35–0.54)', color: '#FFCC59' }, { label: 'High (0.55–0.74)', color: '#FF7B45' }, { label: 'Critical (0.75–1.0)', color: '#EF4444' }] : WARD_LEGEND_ITEMS} />

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
