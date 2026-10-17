import { useState } from 'react'
import { Expand, MapPinned } from 'lucide-react'
import MapControls from '../map/MapControls.jsx'
import MapLegend from '../map/MapLegend.jsx'
import { RISK_LEVELS } from '../../constants/riskLevels.js'
import { WSI_YEAR_OPTIONS } from '../../data/predictionsData.js'

const MAP_LEGEND_ITEMS = [
  { label: 'Low (0 – 0.3)', color: RISK_LEVELS.LOW.color },
  { label: 'Moderate (0.3 – 0.6)', color: RISK_LEVELS.MODERATE.color },
  { label: 'High (0.6 – 1.0)', color: RISK_LEVELS.HIGH.color },
]

/**
 * Predicted Water Stress Map (2030) card.
 *
 * The geographical map area is intentionally left EMPTY in this version:
 * a pale, neutral canvas hosts ready-to-wire placeholder controls (year
 * selector, expand, zoom, locate), the Ward 12 marker, the WSI legend and
 * a 0–10 km scale bar, so a real map library can be dropped in later
 * without touching the surrounding UI.
 *
 * FUTURE MAP INTEGRATION
 * ----------------------
 * Replace `.pred-map-canvas__placeholder` with the real map component
 * (e.g. react-leaflet + OpenStreetMap/Mapbox), keeping `.pred-map-canvas`
 * as its sized container; wire the MapControls callbacks to the map
 * instance's zoom APIs and render forecast GeoJSON layers beneath the
 * marker. The controls below are UI placeholders only — they do NOT
 * manipulate a real map in this build.
 */
const PredictedRiskMap = () => {
  const [year, setYear] = useState('2030')
  const [zoomLevel, setZoomLevel] = useState(1)

  const handleZoomIn = () => setZoomLevel((level) => Math.min(4, level + 0.5))
  const handleZoomOut = () => setZoomLevel((level) => Math.max(1, level - 0.5))
  const handleReset = () => setZoomLevel(1)

  return (
    <section className="card pred-map" aria-labelledby="pred-map-title">
      <div className="card__header">
        <div>
          <h2 className="card__title" id="pred-map-title">
            Predicted Water Stress Map ({year})
          </h2>
          <p className="card__subtitle">
            Ward-level forecast of water stress index based on current trends.
          </p>
        </div>
        <div className="pred-map__head-actions">
          <label className="sr-only" htmlFor="pred-map-year">
            Forecast year
          </label>
          <select
            id="pred-map-year"
            className="native-select"
            value={year}
            onChange={(event) => setYear(event.target.value)}
          >
            {WSI_YEAR_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="icon-btn pred-map__expand"
            aria-label="Expand map view"
          >
            <Expand size={15} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        className="pred-map-canvas"
        role="group"
        aria-label={`Predicted water stress map for ${year} (map area placeholder)`}
      >
        {/* Empty placeholder — the real geographical map is integrated later. */}
        <div className="pred-map-canvas__placeholder" aria-hidden="true">
          <MapPinned size={26} strokeWidth={1.6} />
          <p className="pred-map-canvas__placeholder-title">Reserved map area</p>
          <p className="pred-map-canvas__placeholder-text">
            The interactive ward map will be integrated here.
          </p>
        </div>

        {/* Placeholder controls — UI only, they do not move a real map. */}
        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleReset}
          resetLabel="Centre map on Ward 12"
        />
        <span className="pred-map-zoom" aria-hidden="true">
          {zoomLevel.toFixed(1)}×
        </span>

        {/* Selected-ward marker (static in this build). */}
        <span className="pred-map-marker">
          <span className="pred-map-marker__pin" aria-hidden="true" />
          Ward 12
        </span>

        <MapLegend title="Water Stress Index" items={MAP_LEGEND_ITEMS} />

        <div className="pred-map-scale" aria-label="Map scale: 0 to 10 kilometres">
          <div className="pred-map-scale__bar" aria-hidden="true">
            <span />
            <span />
          </div>
          <div className="pred-map-scale__labels" aria-hidden="true">
            <span>0</span>
            <span>5</span>
            <span>10 km</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PredictedRiskMap