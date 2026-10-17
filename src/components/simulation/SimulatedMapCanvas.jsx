import { useState } from 'react'
import { MapPinned } from 'lucide-react'
import MapControls from '../map/MapControls.jsx'
import MapLegend from '../map/MapLegend.jsx'
import { RISK_LEVELS } from '../../constants/riskLevels.js'

const MAP_LEGEND_ITEMS = [
  { label: 'Low (0 – 0.3)', color: RISK_LEVELS.LOW.color },
  { label: 'Moderate (0.3 – 0.6)', color: RISK_LEVELS.MODERATE.color },
  { label: 'High (0.6 – 1.0)', color: RISK_LEVELS.HIGH.color },
]

/**
 * Simulated Water Stress Map (2030) card.
 *
 * The geographical map area is intentionally left EMPTY in this version:
 * a pale, neutral canvas hosts the Current (2024) / Simulated (2030)
 * toggle buttons in the header, placeholder map controls (zoom, locate)
 * in the top-left, the target-area marker with its WSI value, the stress
 * legend bottom-left and a scale bar along the bottom — so a real map
 * library (Leaflet/Mapbox/etc.) can be dropped in later without
 * redesigning the surrounding UI.
 *
 * FUTURE MAP INTEGRATION
 * ----------------------
 * Replace `.sim-map-canvas__placeholder` with the real map component,
 * keeping `.sim-map-canvas` as its sized container; wire the zoom/locate
 * callbacks and the Current/Simulated toggle to the map instance's view
 * and layer state. The controls below are UI placeholders only.
 */
const SimulatedMapCanvas = ({ areaLabel = 'Ward 12', currentWsi, simulatedWsi }) => {
  const [mode, setMode] = useState('simulated')
  const [zoomLevel, setZoomLevel] = useState(1)

  const markerWsi = mode === 'current' ? currentWsi : simulatedWsi

  return (
    <section className="card sim-map" aria-labelledby="sim-map-title">
      <div className="card__header">
        <div>
          <h2 className="card__title" id="sim-map-title">
            Simulated Water Stress Map (2030)
          </h2>
          <p className="card__subtitle">
            Compare projected water stress index under different scenarios.
          </p>
        </div>
        <div className="sim-map__toggle" role="group" aria-label="Map view mode">
          <button
            type="button"
            className={`sim-map__toggle-btn${mode === 'current' ? ' sim-map__toggle-btn--active' : ''}`}
            aria-pressed={mode === 'current'}
            onClick={() => setMode('current')}
          >
            Current (2024)
          </button>
          <button
            type="button"
            className={`sim-map__toggle-btn${mode === 'simulated' ? ' sim-map__toggle-btn--active' : ''}`}
            aria-pressed={mode === 'simulated'}
            onClick={() => setMode('simulated')}
          >
            Simulated (2030)
          </button>
        </div>
      </div>

      <div
        className="sim-map-canvas"
        role="group"
        aria-label={`Simulated water stress map (map area placeholder, ${mode} view)`}
      >
        {/* Empty placeholder — the real geographical map is integrated later. */}
        <div className="sim-map-canvas__placeholder" aria-hidden="true">
          <MapPinned size={26} strokeWidth={1.6} />
          <p className="sim-map-canvas__placeholder-title">Reserved map area</p>
          <p className="sim-map-canvas__placeholder-text">
            The interactive scenario map will be integrated here.
          </p>
        </div>

        {/* Placeholder controls (top-left) — UI only, no real map. */}
        <MapControls
          onZoomIn={() => setZoomLevel((level) => Math.min(4, level + 0.5))}
          onZoomOut={() => setZoomLevel((level) => Math.max(1, level - 0.5))}
          onReset={() => setZoomLevel(1)}
          resetLabel="Centre map on selected area"
        />

        {/* Marker with mini information tooltip (UI overlay). */}
        <span className="sim-map-marker" title={`${areaLabel} — illustrative WSI`}>
          <span className="sim-map-marker__pin" aria-hidden="true" />
          {areaLabel}
          <span className="sim-map-marker__value">
            WSI {typeof markerWsi === 'number' ? markerWsi.toFixed(2) : '—'}
          </span>
        </span>

        <MapLegend title="Water Stress Index" items={MAP_LEGEND_ITEMS} />

        {/* Scale indicator along the bottom. */}
        <div className="sim-map-scale" aria-label="Map scale: 0 to 10 kilometres">
          <div className="sim-map-scale__bar" aria-hidden="true">
            <span />
            <span />
          </div>
          <div className="sim-map-scale__labels" aria-hidden="true">
            <span>0</span>
            <span>5</span>
            <span>10 km</span>
          </div>
        </div>

        <span className="sim-map-zoom" aria-hidden="true">
          {zoomLevel.toFixed(1)}×
        </span>
      </div>
    </section>
  )
}

export default SimulatedMapCanvas