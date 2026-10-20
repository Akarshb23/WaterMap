import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.js'
import {
  DEFAULT_MAP_DISTRICT_ID,
  MAP_DISCLAIMER,
  MAP_LEGEND,
  MAP_METRIC_OPTIONS,
  MAP_REGIONS,
  MAP_DISTRICT_FILTER_OPTIONS,
  MAP_DISTRICTS,
  MAP_ZONE_OPTIONS,
} from '../../data/demoData.js'
import MapControls from '../map/MapControls.jsx'
import MapLegend from '../map/MapLegend.jsx'
import WardPopup from '../map/WardPopup.jsx'
import LeafletWardMap from '../map/LeafletWardMap.jsx'
import { isApiMode } from '../../services/apiClient.js'

const ZOOM_MIN = 0.9
const ZOOM_MAX = 1.5
const ZOOM_STEP = 0.15

const RISK_TONES = {
  high: 'danger',
  moderate: 'moderate',
  low: 'low',
}

const districtDetailsPath = (district) => `/districts/${district.id.replace('district-', '').replace('ward-', '')}`

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
 * service, no image assets) with district tiles, zoom controls, legend and a
 * floating popup, plus the selected district details card on the right.
 */
const WaterStressMap = ({ districts: districtsProp, regions: regionsProp }) => {
  const districts = Array.isArray(districtsProp) ? districtsProp : MAP_DISTRICTS
  const regions = Array.isArray(regionsProp) && regionsProp.length ? regionsProp : MAP_REGIONS
  const [selectedDistrictId, setSelectedDistrictId] = useState(DEFAULT_MAP_DISTRICT_ID)
  const [zoom, setZoom] = useState(1)
  const [metric, setMetric] = useState('wsi')
  const [zone, setZone] = useState('all')
  const [districtFilter, setDistrictFilter] = useState('all')

  const selectedDistrict = districts.find((district) => String(district.id) === String(selectedDistrictId)) ?? districts[0] ?? MAP_DISTRICTS[0]

  const isDistrictVisible = (district) =>
    (zone === 'all' || district.zoneKey === zone) &&
    (districtFilter === 'all' || district.risk === districtFilter)

  const handleZoomIn = () =>
    setZoom((current) => Math.min(ZOOM_MAX, Number((current + ZOOM_STEP).toFixed(2))))
  const handleZoomOut = () =>
    setZoom((current) => Math.max(ZOOM_MIN, Number((current - ZOOM_STEP).toFixed(2))))
  const handleLocate = () => {
    setZoom(1)
    setSelectedDistrictId(DEFAULT_MAP_DISTRICT_ID)
  }

  /* The viewport scales around its centre, so the popup (which stays
     screen-sized) is anchored using the district's zoomed canvas position;
     map.css clamps it horizontally so it never leaves the map. */
  const popupLeft = 50 + (selectedDistrict.x - 50) * zoom
  const popupTop = 50 + (selectedDistrict.y - 50) * zoom
  const popupBelow = popupTop < 36

  return (
    <section className="card map-panel" aria-labelledby="water-stress-map-title">
      <div className="map-panel__header">
        <div>
          <h2 className="map-panel__title" id="water-stress-map-title">
            Water Stress Map
          </h2>
          <p className="map-panel__subtitle">District-level water stress across Bangalore</p>
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
            id="map-district-select"
            label="District filter"
            options={MAP_DISTRICT_FILTER_OPTIONS}
            value={districtFilter}
            onChange={(event) => setDistrictFilter(event.target.value)}
          />
        </div>
      </div>

      <div className="map-panel__grid">
        <div
          className={`map-canvas${isApiMode() ? ' map-canvas--live' : ''}`}
          role="group"
          aria-label="District water stress map of Bangalore"
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

            {regions.map((region) => (
              <span
                key={region.id}
                className="map-region-label"
                style={{ left: `${region.x}%`, top: `${region.y}%` }}
              >
                {region.label}
              </span>
            ))}

            {districts.map((district) => {
              const visible = isDistrictVisible(district)
              const selected = district.id === selectedDistrictId
              return (
                <button
                  key={district.id}
                  type="button"
                  className={[
                    'map-ward',
                    `map-ward--shape-${district.shape}`,
                    `map-ward--${district.risk}`,
                    selected ? 'map-ward--selected' : '',
                    visible ? '' : 'map-ward--dimmed',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{
                    left: `${district.x}%`,
                    top: `${district.y}%`,
                    width: `${district.w}%`,
                    height: `${district.h}%`,
                  }}
                  onClick={() => setSelectedDistrictId(district.id)}
                  aria-pressed={selected}
                  aria-label={`${district.name}, ${district.zone}, ${district.riskLabel}, water stress index ${district.wsi}`}
                  title={`${district.name} — ${district.riskLabel}`}
                >
                  <span className="map-ward__fill" aria-hidden="true" />
                  <span className="map-ward__label" aria-hidden="true">
                    {district.name.replace('District ', '')}
                  </span>
                </button>
              )
            })}

            <span
              className={`map-marker map-marker--${selectedDistrict.risk}`}
              style={{ left: `${selectedDistrict.x}%`, top: `${selectedDistrict.y}%` }}
              aria-hidden="true"
            />
          </div>

          <div
            className={`map-popup-anchor${popupBelow ? ' map-popup-anchor--below' : ''}`}
            style={{ '--popup-left': `${popupLeft}%`, top: `${popupTop}%` }}
          >
            <WardPopup
              ward={{ name: selectedDistrict.name, summary: selectedDistrict.zone }}
              badge={
                <span className={`badge badge--${RISK_TONES[selectedDistrict.risk]}`}>
                  {selectedDistrict.riskLabel}
                </span>
              }
              metrics={[
                { label: 'WSI', value: selectedDistrict.wsi },
                { label: 'Population', value: selectedDistrict.population },
              ]}
              action={
                <Link className="ward-popup__details" to={districtDetailsPath(selectedDistrict)}>
                  View Details
                </Link>
              }
            />
          </div>

          <MapControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onReset={handleLocate} />
          <MapLegend title={null} items={isApiMode() ? [{ label: 'Low (0–0.34)', color: '#45BD9B' }, { label: 'Moderate (0.35–0.54)', color: '#FFCC59' }, { label: 'High (0.55–0.74)', color: '#FF7B45' }, { label: 'Critical (0.75–1.0)', color: '#EF4444' }] : MAP_LEGEND} />
          <p className="map-disclaimer">{MAP_DISCLAIMER}</p>
        </div>

        <aside className="card ward-panel" aria-label={`Selected district: ${selectedDistrict.name}`}>
          <div className="ward-panel__head">
            <div>
              <h3 className="ward-panel__name">{selectedDistrict.name}</h3>
              <p className="ward-panel__zone">{selectedDistrict.zone}</p>
            </div>
            <span className={`badge badge--${RISK_TONES[selectedDistrict.risk]}`}>
              {selectedDistrict.riskLabel}
            </span>
          </div>

          <div
            className="ward-visual"
            role="img"
            aria-label={`Water-themed illustration for ${selectedDistrict.name}`}
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
              <dd className="ward-panel__stat-value">{selectedDistrict.wsi}</dd>
            </div>
            <div className="ward-panel__stat">
              <dt className="ward-panel__stat-label">Population</dt>
              <dd className="ward-panel__stat-value">{selectedDistrict.population}</dd>
            </div>
            <div className="ward-panel__stat">
              <dt className="ward-panel__stat-label">Annual Rainfall</dt>
              <dd className="ward-panel__stat-value">{selectedDistrict.rainfall}</dd>
            </div>
            <div className="ward-panel__stat">
              <dt className="ward-panel__stat-label">Water Demand</dt>
              <dd className="ward-panel__stat-value">{selectedDistrict.demand}</dd>
            </div>
            <div className="ward-panel__stat">
              <dt className="ward-panel__stat-label">Groundwater Level</dt>
              <dd className="ward-panel__stat-value">{selectedDistrict.groundwater}</dd>
            </div>
          </dl>

          <div className="ward-panel__action">
            <Link className="btn btn--primary" to={districtDetailsPath(selectedDistrict)}>
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
