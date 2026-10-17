import { LocateFixed, Minus, Plus } from 'lucide-react'

/**
 * Map control cluster: zoom in, zoom out and locate/reset. Behaviour is
 * provided by the host map (e.g. the dashboard's illustrative map).
 */
const MapControls = ({ onZoomIn, onZoomOut, onReset, resetLabel = 'Locate selected ward' }) => (
  <div className="map-controls">
    <button
      type="button"
      className="map-controls__button"
      onClick={onZoomIn}
      aria-label="Zoom in"
    >
      <Plus size={16} aria-hidden="true" />
    </button>
    <button
      type="button"
      className="map-controls__button"
      onClick={onZoomOut}
      aria-label="Zoom out"
    >
      <Minus size={16} aria-hidden="true" />
    </button>
    <button
      type="button"
      className="map-controls__button"
      onClick={onReset}
      aria-label={resetLabel}
    >
      <LocateFixed size={16} aria-hidden="true" />
    </button>
  </div>
)

export default MapControls
