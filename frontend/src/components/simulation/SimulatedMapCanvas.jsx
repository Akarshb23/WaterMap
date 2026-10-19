import { useState } from 'react'
import MapControls from '../map/MapControls.jsx'
import MapLegend from '../map/MapLegend.jsx'
import WardRiskIllustration from '../map/WardRiskIllustration.jsx'
import { RISK_LEVELS } from '../../constants/riskLevels.js'

const MAP_LEGEND_ITEMS = [
  { label: 'Low (0 – 0.3)', color: RISK_LEVELS.LOW.color },
  { label: 'Moderate (0.3 – 0.6)', color: RISK_LEVELS.MODERATE.color },
  { label: 'High (0.6 – 1.0)', color: RISK_LEVELS.HIGH.color },
]

/**
 * Simulated Water Stress Map (2030) card.
 *
 * Illustrative polygon map mirrors the shared city-map canvas while keeping
 * the scenario controls, selected-area marker and risk legend interactive.
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
        aria-label={`Illustrative simulated water stress map (${mode} view)`}
      >
        <WardRiskIllustration variant="simulation" zoom={zoomLevel} riskMode={mode} />

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

        <p className="map-disclaimer">Illustrative simulation map — not a live GIS layer.</p>

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