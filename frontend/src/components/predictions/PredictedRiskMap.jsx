import { useState } from 'react'
import { Expand } from 'lucide-react'
import MapControls from '../map/MapControls.jsx'
import MapLegend from '../map/MapLegend.jsx'
import WardRiskIllustration from '../map/WardRiskIllustration.jsx'
import { isApiMode } from '../../services/apiClient.js'
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
 * The forecast view uses the shared illustrative district polygons with
 * adjustable zoom and consistent risk controls across map-based screens.
 */
const PredictedRiskMap = () => {
  const [year, setYear] = useState('2030')
  const [zoomLevel, setZoomLevel] = useState(1)

  // This card always renders the static illustrative district layer; the
  // backend supplies no forecast geometry. Labels must never claim
  // backend-provided boundaries or categories for these polygons.

  const handleZoomIn = () => setZoomLevel((level) => Math.min(4, level + 0.5))
  const handleZoomOut = () => setZoomLevel((level) => Math.max(1, level - 0.5))
  const handleReset = () => setZoomLevel(1)

  return (
    <section className="card pred-map" aria-labelledby="pred-map-title">
      <div className="card__header">
        <div>
          <h2 className="card__title" id="pred-map-title">
            {isApiMode() ? 'Current District Risk Map' : `Predicted Water Stress Map (${year})`}
          </h2>
          <p className="card__subtitle">
            {isApiMode() ? 'Illustrative district view — the backend provides no forecast polygons.' : 'District-level forecast of water stress index based on current trends.'}
          </p>
        </div>
        {!isApiMode() ? (
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
        ) : null}
      </div>

      <div
        className="pred-map-canvas"
        role="group"
        aria-label={`Illustrative predicted water stress map for ${year}`}
      >
        <WardRiskIllustration variant="prediction" zoom={zoomLevel} />

        {/* Placeholder controls — UI only, they do not move a real map. */}
        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleReset}
          resetLabel="Centre map on Koramangala"
        />
        <span className="pred-map-zoom" aria-hidden="true">
          {zoomLevel.toFixed(1)}×
        </span>

        {/* Selected-district marker (static in this build). */}
        <span className="pred-map-marker">
          <span className="pred-map-marker__pin" aria-hidden="true" />
          Koramangala
        </span>

        <MapLegend title="Water Stress Index" items={isApiMode() ? [{ label: 'Low (0–0.34)', color: '#45BD9B' }, { label: 'Moderate (0.35–0.54)', color: '#FFCC59' }, { label: 'High (0.55–0.74)', color: '#FF7B45' }, { label: 'Critical (0.75–1.0)', color: '#EF4444' }] : MAP_LEGEND_ITEMS} />

        <p className="map-disclaimer">Illustrative district map — not verified GIS boundaries; values shown are placeholders, not backend data.</p>

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