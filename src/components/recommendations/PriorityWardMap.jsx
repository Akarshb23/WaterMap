import { useState } from 'react'
import { LocateFixed, MapPinned, Minus, Plus } from 'lucide-react'
import { PRIORITY_MAP_LEGEND } from '../../data/recommendationsData.js'

/**
 * Priority Wards Map card.
 *
 * Provides zoom and reset controls, a priority legend, and a map scale bar.
 * The map canvas is intentionally kept empty as a correctly-sized placeholder
 * with pale neutral background and clean CSS classes, ready for real GIS/Leaflet
 * integration without generating fake map artwork.
 */
const PriorityWardMap = () => {
  const [zoomLevel, setZoomLevel] = useState(1.0)

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(3.0, Number((prev + 0.25).toFixed(2))))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(0.75, Number((prev - 0.25).toFixed(2))))
  }

  const handleReset = () => {
    setZoomLevel(1.0)
  }

  return (
    <div className="card priority-wards-map">
      <div className="priority-wards-map__header">
        <h3 className="priority-wards-map__title">Priority Wards Map</h3>
        <p className="priority-wards-map__subtitle">
          Wards recommended for immediate intervention.
        </p>
      </div>

      <div
        className="priority-wards-map__canvas priority-map-canvas-placeholder"
        role="region"
        aria-label="Priority Wards Map placeholder canvas"
      >
        {/* Floating Zoom & Locate Controls (top-left) */}
        <div className="priority-wards-map__controls" aria-label="Map navigation controls">
          <button
            type="button"
            className="priority-wards-map__ctrl-btn"
            onClick={handleZoomIn}
            aria-label="Zoom in map"
            title="Zoom in"
          >
            <Plus size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="priority-wards-map__ctrl-btn"
            onClick={handleZoomOut}
            aria-label="Zoom out map"
            title="Zoom out"
          >
            <Minus size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="priority-wards-map__ctrl-btn"
            onClick={handleReset}
            aria-label="Reset map view"
            title="Centre map"
          >
            <LocateFixed size={15} aria-hidden="true" />
          </button>
        </div>

        {/* Zoom level indicator */}
        <span className="priority-wards-map__zoom-indicator" aria-hidden="true">
          {zoomLevel.toFixed(1)}×
        </span>

        {/* Empty canvas message for real map library */}
        <div className="priority-wards-map__placeholder-body" aria-hidden="true">
          <MapPinned size={32} strokeWidth={1.5} className="priority-wards-map__placeholder-icon" />
          <p className="priority-wards-map__placeholder-title">Priority Wards GIS Canvas</p>
          <p className="priority-wards-map__placeholder-text">
            Empty canvas reserved for Leaflet / GIS ward polygon layer.
          </p>
        </div>

        {/* Priority Legend Overlay (bottom-left) */}
        <div className="priority-wards-map__legend" aria-label="Priority wards legend">
          <ul className="priority-wards-map__legend-list">
            {PRIORITY_MAP_LEGEND.map((item) => (
              <li key={item.label} className="priority-wards-map__legend-item">
                <span
                  className="priority-wards-map__legend-swatch"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Map Scale Bar (bottom-right) */}
        <div className="priority-wards-map__scale" aria-label="Map scale: 0 to 10 kilometers">
          <div className="priority-wards-map__scale-bar" aria-hidden="true">
            <span />
            <span />
          </div>
          <div className="priority-wards-map__scale-labels" aria-hidden="true">
            <span>0</span>
            <span>5</span>
            <span>10 km</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PriorityWardMap
