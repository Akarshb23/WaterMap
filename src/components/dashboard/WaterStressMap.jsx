import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.js'
import {
  DEFAULT_MAP_WARD_ID,
  MAP_DISCLAIMER,
  MAP_LEGEND,
  MAP_METRIC_OPTIONS,
  MAP_REGIONS,
  MAP_WARD_FILTER_OPTIONS,
  MAP_WARDS,
  MAP_ZONE_OPTIONS,
} from '../../data/demoData.js'
import MapControls from '../map/MapControls.jsx'
import MapLegend from '../map/MapLegend.jsx'
import WardPopup from '../map/WardPopup.jsx'

const ZOOM_MIN = 0.9
const ZOOM_MAX = 1.5
const ZOOM_STEP = 0.15

const RISK_TONES = {
  high: 'danger',
  moderate: 'moderate',
  low: 'low',
}

const wardDetailsPath = (ward) => `${ROUTES.WARD_DETAILS.replace(':wardId', ward.id.replace('ward-', ''))}`

const FilterSelect = ({ id, label, options, value, onChange }) => (
  <>
    <label className="sr-only" htmlFor={id}>
      {label}
    </label>
    <select id={id} className="native-select" value={value} onChange={onChange}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </>
)

/**
 * Water Stress Map panel: a CSS/SVG illustrative city map (no tiles, no GIS
 * service, no image assets) with ward tiles, zoom controls, legend and a
 * floating popup, plus the selected ward details card on the right.
 */
const WaterStressMap = () => {
  const [selectedWardId, setSelectedWardId] = useState(DEFAULT_MAP_WARD_ID)
  const [zoom, setZoom] = useState(1)
  const [metric, setMetric] = useState('wsi')
  const [zone, setZone] = useState('all')
  const [wardFilter, setWardFilter] = useState('all')

  const selectedWard = MAP_WARDS.find((ward) => ward.id === selectedWardId) ?? MAP_WARDS[0]

  const isWardVisible = (ward) =>
    (zone === 'all' || ward.zoneKey === zone) &&
    (wardFilter === 'all' || ward.risk === wardFilter)

  const handleZoomIn = () =>
    setZoom((current) => Math.min(ZOOM_MAX, Number((current + ZOOM_STEP).toFixed(2))))
  const handleZoomOut = () =>
    setZoom((current) => Math.max(ZOOM_MIN, Number((current - ZOOM_STEP).toFixed(2))))
  const handleLocate = () => {
    setZoom(1)
    setSelectedWardId(DEFAULT_MAP_WARD_ID)
  }

  /* The viewport scales around its centre, so the popup (which stays
     screen-sized) is anchored using the ward's zoomed canvas position;
     map.css clamps it horizontally so it never leaves the map. */
  const popupLeft = 50 + (selectedWard.x - 50) * zoom
  const popupTop = 50 + (selectedWard.y - 50) * zoom
  const popupBelow = popupTop < 36

  return (
    <section className="card map-panel" aria-labelledby="water-stress-map-title">
      <div className="map-panel__header">
        <div>
          <h2 className="map-panel__title" id="water-stress-map-title">
            Water Stress Map
          </h2>
          <p className="map-panel__subtitle">Ward-level water stress across New Delhi</p>
        </div>
        <div className="map-panel__filters">
          <FilterSelect
            id="map-metric-select"
            label="Map metric"
            options={MAP_METRIC_OPTIONS}
            value={metric}
            onChange={(event) => setMetric(event.target.value)}
          />
          <FilterSelect
            id="map-zone-select"
            label="Zone filter"
            options={MAP_ZONE_OPTIONS}
            value={zone}
            onChange={(event) => setZone(event.target.value)}
          />
          <FilterSelect
            id="map-ward-select"
            label="Ward filter"
            options={MAP_WARD_FILTER_OPTIONS}
            value={wardFilter}
            onChange={(event) => setWardFilter(event.target.value)}
          />
        </div>
      </div>

      <div className="map-panel__grid">
        <div
          className="map-canvas"
          role="group"
          aria-label="Illustrative water stress map of New Delhi"
        >
          <div
            className="map-canvas__viewport"
            style={{ transform: `scale(${zoom})` }}
          >
            <div className="map-canvas__streets" aria-hidden="true" />
            <div className="map-canvas__avenue map-canvas__avenue--one" aria-hidden="true" />
            <div className="map-canvas__avenue map-canvas__avenue--two" aria-hidden="true" />
            <div className="map-canvas__ring" aria-hidden="true" />
            <svg
              className="map-canvas__river"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M58 -2 C 56 14, 65 24, 62 38 C 59 52, 71 62, 68 76 C 66 88, 75 96, 73 102"
                fill="none"
                stroke="#A6CBF1"
                strokeWidth="15"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M58 -2 C 56 14, 65 24, 62 38 C 59 52, 71 62, 68 76 C 66 88, 75 96, 73 102"
                fill="none"
                stroke="#CADEF6"
                strokeWidth="7"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {MAP_REGIONS.map((region) => (
              <span
                key={region.id}
                className="map-region-label"
                style={{ left: `${region.x}%`, top: `${region.y}%` }}
              >
                {region.label}
              </span>
            ))}

            {MAP_WARDS.map((ward) => {
              const visible = isWardVisible(ward)
              const selected = ward.id === selectedWardId
              return (
                <button
                  key={ward.id}
                  type="button"
                  className={[
                    'map-ward',
                    `map-ward--shape-${ward.shape}`,
                    `map-ward--${ward.risk}`,
                    selected ? 'map-ward--selected' : '',
                    visible ? '' : 'map-ward--dimmed',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{
                    left: `${ward.x}%`,
                    top: `${ward.y}%`,
                    width: `${ward.w}%`,
                    height: `${ward.h}%`,
                  }}
                  onClick={() => setSelectedWardId(ward.id)}
                  aria-pressed={selected}
                  aria-label={`${ward.name}, ${ward.zone}, ${ward.riskLabel}, water stress index ${ward.wsi}`}
                  title={`${ward.name} — ${ward.riskLabel}`}
                >
                  <span className="map-ward__fill" aria-hidden="true" />
                  <span className="map-ward__label" aria-hidden="true">
                    {ward.name.replace('Ward ', '')}
                  </span>
                </button>
              )
            })}

            <span
              className={`map-marker map-marker--${selectedWard.risk}`}
              style={{ left: `${selectedWard.x}%`, top: `${selectedWard.y}%` }}
              aria-hidden="true"
            />
          </div>

          <div
            className={`map-popup-anchor${popupBelow ? ' map-popup-anchor--below' : ''}`}
            style={{ '--popup-left': `${popupLeft}%`, top: `${popupTop}%` }}
          >
            <WardPopup
              ward={{ name: selectedWard.name, summary: selectedWard.zone }}
              badge={
                <span className={`badge badge--${RISK_TONES[selectedWard.risk]}`}>
                  {selectedWard.riskLabel}
                </span>
              }
              metrics={[
                { label: 'WSI', value: selectedWard.wsi },
                { label: 'Population', value: selectedWard.population },
              ]}
              action={
                <Link className="ward-popup__details" to={wardDetailsPath(selectedWard)}>
                  View Details
                </Link>
              }
            />
          </div>

          <MapControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onReset={handleLocate} />
          <MapLegend title={null} items={MAP_LEGEND} />
          <p className="map-disclaimer">{MAP_DISCLAIMER}</p>
        </div>

        <aside className="card ward-panel" aria-label={`Selected ward: ${selectedWard.name}`}>
          <div className="ward-panel__head">
            <div>
              <h3 className="ward-panel__name">{selectedWard.name}</h3>
              <p className="ward-panel__zone">{selectedWard.zone}</p>
            </div>
            <span className={`badge badge--${RISK_TONES[selectedWard.risk]}`}>
              {selectedWard.riskLabel}
            </span>
          </div>

          <div
            className="ward-visual"
            role="img"
            aria-label={`Water-themed illustration for ${selectedWard.name}`}
          >
            <span className="ward-visual__bubble ward-visual__bubble--one" aria-hidden="true" />
            <span className="ward-visual__bubble ward-visual__bubble--two" aria-hidden="true" />
            <span className="ward-visual__drop" aria-hidden="true" />
            <span className="ward-visual__wave ward-visual__wave--back" aria-hidden="true" />
            <span className="ward-visual__wave ward-visual__wave--front" aria-hidden="true" />
          </div>

          <dl className="ward-panel__stats">
            <div className="ward-panel__stat">
              <dt className="ward-panel__stat-label">Water Stress Index</dt>
              <dd className="ward-panel__stat-value">{selectedWard.wsi}</dd>
            </div>
            <div className="ward-panel__stat">
              <dt className="ward-panel__stat-label">Population</dt>
              <dd className="ward-panel__stat-value">{selectedWard.population}</dd>
            </div>
            <div className="ward-panel__stat">
              <dt className="ward-panel__stat-label">Annual Rainfall</dt>
              <dd className="ward-panel__stat-value">{selectedWard.rainfall}</dd>
            </div>
            <div className="ward-panel__stat">
              <dt className="ward-panel__stat-label">Water Demand</dt>
              <dd className="ward-panel__stat-value">{selectedWard.demand}</dd>
            </div>
            <div className="ward-panel__stat">
              <dt className="ward-panel__stat-label">Groundwater Level</dt>
              <dd className="ward-panel__stat-value">{selectedWard.groundwater}</dd>
            </div>
          </dl>

          <div className="ward-panel__action">
            <Link className="btn btn--primary" to={wardDetailsPath(selectedWard)}>
              View Full Details
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default WaterStressMap
