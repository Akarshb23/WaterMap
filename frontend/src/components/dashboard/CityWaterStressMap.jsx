import { useState } from 'react'
import { ArrowRight, Droplet, Locate, Minus, Plus, Users } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import cityscape from '../../assets/watermap-cityscape.png'
import {
  DELHI_DASHBOARD_REGIONS,
  DELHI_DASHBOARD_WARDS,
} from '../../data/delhiDashboardData.js'

const MAP_METRIC_OPTIONS = [
  { value: 'wsi', label: 'Water Stress Index' },
  { value: 'groundwater', label: 'Groundwater Level' },
  { value: 'demand', label: 'Water Demand' },
  { value: 'supply', label: 'Per Capita Supply' },
]

const MAP_ZONE_OPTIONS = [
  { value: 'all', label: 'All Zones' },
  { value: 'north', label: 'North Zone' },
  { value: 'west', label: 'West Zone' },
  { value: 'central', label: 'Central Zone' },
  { value: 'east', label: 'East Zone' },
  { value: 'south', label: 'South Zone' },
]

const MAP_WARD_FILTER_OPTIONS = [
  { value: 'all', label: 'All Wards' },
  { value: 'high', label: 'High Risk Wards' },
  { value: 'moderate', label: 'Moderate Risk Wards' },
  { value: 'low', label: 'Low Risk Wards' },
]

/**
 * Interactive Water Stress Map component matching the New Delhi city dashboard reference mockup:
 * - Top-right filter dropdowns (Metric, Zone, Ward)
 * - Map canvas with Yamuna River, Ring Roads, region names, colored interlocking ward polygons, and scale bar
 * - Floating top-left zoom controls (+, -, locate)
 * - Floating bottom-left risk legend
 * - Interactive Ward 12 concentric pin & attached popup card
 * - Right-hand Ward details panel with photographic hero and "View Full Details →" button
 */
const CityWaterStressMap = ({ onSelectWard }) => {
  const navigate = useNavigate()
  const [selectedWardId, setSelectedWardId] = useState('ward-12')
  const [zoom, setZoom] = useState(1)
  const [metric, setMetric] = useState('wsi')
  const [zone, setZone] = useState('all')
  const [wardFilter, setWardFilter] = useState('all')

  const selectedWard =
    DELHI_DASHBOARD_WARDS.find((w) => w.id === selectedWardId) ||
    DELHI_DASHBOARD_WARDS[0]

  const handleZoomIn = () => setZoom((z) => Math.min(1.5, +(z + 0.15).toFixed(2)))
  const handleZoomOut = () => setZoom((z) => Math.max(0.85, +(z - 0.15).toFixed(2)))
  const handleResetZoom = () => {
    setZoom(1)
    setSelectedWardId('ward-12')
  }

  const handleWardClick = (ward) => {
    setSelectedWardId(ward.id)
    onSelectWard?.(ward)
  }

  const isWardVisible = (ward) => {
    if (zone !== 'all' && ward.zoneKey !== zone) return false
    if (wardFilter !== 'all' && ward.risk !== wardFilter) return false
    return true
  }

  return (
    <article className="card city-map-card" aria-labelledby="city-water-stress-map-title">
      <header className="city-map-card__header">
        <div className="city-map-card__title-wrap">
          <h2 className="city-map-card__title" id="city-water-stress-map-title">
            Water Stress Map
          </h2>
          <p className="city-map-card__subtitle">
            Ward-level water stress across New Delhi
          </p>
        </div>

        <div className="city-map-card__filters">
          <label className="sr-only" htmlFor="dashboard-metric-select">Select Metric</label>
          <select
            id="dashboard-metric-select"
            className="native-select city-map-card__select"
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
          >
            {MAP_METRIC_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <label className="sr-only" htmlFor="dashboard-zone-select">Select Zone</label>
          <select
            id="dashboard-zone-select"
            className="native-select city-map-card__select"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
          >
            {MAP_ZONE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <label className="sr-only" htmlFor="dashboard-ward-filter-select">Filter Wards</label>
          <select
            id="dashboard-ward-filter-select"
            className="native-select city-map-card__select"
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
          >
            {MAP_WARD_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="city-map-layout">
        {/* Main Map Viewport */}
        <div className="city-map-viewport" role="region" aria-label="Interactive water stress map of New Delhi">
          {/* Controls: Top-Left */}
          <div className="city-map-controls" role="toolbar" aria-label="Map zoom controls">
            <button
              type="button"
              className="city-map-ctrl-btn"
              onClick={handleZoomIn}
              aria-label="Zoom in"
              title="Zoom in"
            >
              <Plus size={16} />
            </button>
            <button
              type="button"
              className="city-map-ctrl-btn"
              onClick={handleZoomOut}
              aria-label="Zoom out"
              title="Zoom out"
            >
              <Minus size={16} />
            </button>
            <button
              type="button"
              className="city-map-ctrl-btn"
              onClick={handleResetZoom}
              aria-label="Reset map"
              title="Reset view"
            >
              <Locate size={16} />
            </button>
          </div>

          {/* Floating Legend: Bottom-Left */}
          <div className="city-map-legend" aria-label="Risk category legend">
            <h4 className="city-map-legend__title">Water Stress Index</h4>
            <ul className="city-map-legend__list">
              <li className="city-map-legend__item">
                <span className="city-map-legend__dot" style={{ backgroundColor: '#10b981' }} />
                <span>Low (0 – 0.3)</span>
              </li>
              <li className="city-map-legend__item">
                <span className="city-map-legend__dot" style={{ backgroundColor: '#f59e0b' }} />
                <span>Moderate (0.3 – 0.6)</span>
              </li>
              <li className="city-map-legend__item">
                <span className="city-map-legend__dot" style={{ backgroundColor: '#ef4444' }} />
                <span>High (0.6 – 1.0)</span>
              </li>
            </ul>
          </div>

          {/* Scale Bar: Bottom-Right */}
          <div className="city-map-scale-bar" aria-label="Map scale">
            <div className="city-map-scale-bar__ticks">
              <span>0</span>
              <span>5</span>
              <span>10 km</span>
            </div>
            <div className="city-map-scale-bar__rule" />
          </div>

          {/* SVG Map Canvas */}
          <div
            className="city-map-canvas"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
              transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <svg
              viewBox="120 20 340 450"
              className="city-map-svg"
              role="img"
              aria-label="Map of New Delhi wards showing water stress index"
            >
              {/* Basemap Canvas Background */}
              <rect x="120" y="20" width="340" height="450" fill="#f4f7f6" />

              {/* Arterial Road Network & Highways */}
              <g stroke="#ffffff" strokeWidth="2.8" fill="none" opacity="0.95" strokeLinecap="round">
                {/* Outer Ring Road loop */}
                <ellipse cx="270" cy="230" rx="115" ry="135" strokeDasharray="none" />
                {/* Inner Ring Road loop */}
                <ellipse cx="285" cy="225" rx="72" ry="78" strokeDasharray="none" />
                {/* Major Highways */}
                <path d="M 130 180 Q 280 190 450 175" />
                <path d="M 130 310 Q 280 290 450 315" />
                <path d="M 310 25 Q 320 240 325 465" />
                <path d="M 220 70 Q 240 260 215 425" />
                <path d="M 390 60 Q 375 250 405 440" />
                {/* Secondary connecting streets */}
                <path d="M 160 120 Q 260 140 360 110" strokeWidth="1.5" strokeDasharray="3 3" />
                <path d="M 170 380 Q 290 360 410 390" strokeWidth="1.5" strokeDasharray="3 3" />
              </g>

              {/* Yamuna River (Light blue wide ribbon + ripple line) */}
              <path
                d="M 345 20 Q 365 110 360 160 Q 375 215 382 280 Q 410 360 435 460"
                fill="none"
                stroke="#a0d2eb"
                strokeWidth="12"
                opacity="0.88"
                strokeLinecap="round"
              />
              <path
                d="M 345 20 Q 365 110 360 160 Q 375 215 382 280 Q 410 360 435 460"
                fill="none"
                stroke="#7bc5eb"
                strokeWidth="4.5"
                opacity="0.9"
                strokeLinecap="round"
              />

              {/* Regional Geographic Labels */}
              <g fill="#4b5563" fontSize="8.5" fontWeight="700" letterSpacing="0.8" opacity="0.8">
                {DELHI_DASHBOARD_REGIONS.map((r) => (
                  <text key={r.id} x={r.x} y={r.y} textAnchor="middle">
                    {r.label}
                  </text>
                ))}
              </g>

              {/* All 42 Seamless Interlocking Ward Polygons */}
              <g className="city-map-polygons">
                {DELHI_DASHBOARD_WARDS.map((w) => {
                  const visible = isWardVisible(w)
                  const isSelected = selectedWard.id === w.id

                  return (
                    <polygon
                      key={w.id}
                      points={w.shape}
                      fill={w.fill}
                      stroke={isSelected ? '#0f172a' : '#ffffff'}
                      strokeWidth={isSelected ? 2.5 : 1.2}
                      strokeLinejoin="round"
                      opacity={visible ? 1 : 0.22}
                      className={`city-map-poly ${isSelected ? 'city-map-poly--selected' : ''}`}
                      onClick={() => handleWardClick(w)}
                      role="button"
                      tabIndex={0}
                      aria-label={`${w.name}: ${w.riskLabel}, WSI ${w.wsi}`}
                      style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                    />
                  )
                })}
              </g>

              {/* Selected Ward Concentric Marker on Ward 12 */}
              <g
                className="city-map-pin"
                transform={`translate(${selectedWard.center[0]}, ${selectedWard.center[1]})`}
                pointerEvents="none"
              >
                <circle r="12" fill="none" stroke="#ffffff" strokeWidth="2.8" opacity="0.95" />
                <circle r="7.5" fill="none" stroke="#0f172a" strokeWidth="2.2" />
                <circle r="3.2" fill="#ffffff" />
                <circle r="1.6" fill="#0f172a" />
              </g>
            </svg>

            {/* Attached Ward 12 Interactive Popup Card */}
            <div
              className="city-map-popup"
              style={{
                left: `${((selectedWard.center[0] - 120) / 340) * 100}%`,
                top: `${((selectedWard.center[1] - 20) / 450) * 100}%`,
              }}
            >
              <div className="city-map-popup__inner">
                <div className="city-map-popup__top">
                  <span className="city-map-popup__name">
                    <span className="city-map-popup__dot" style={{ backgroundColor: '#10b981' }} />
                    {selectedWard.name}
                  </span>
                  <span className={`city-map-popup__badge city-map-popup__badge--${selectedWard.risk}`}>
                    ● {selectedWard.riskLabel}
                  </span>
                </div>

                <div className="city-map-popup__metrics">
                  <div className="city-map-popup__metric-row">
                    <span className="city-map-popup__metric-label">
                      <Droplet size={12} className="city-map-popup__metric-icon" />
                      WSI
                    </span>
                    <strong className="city-map-popup__metric-val">{selectedWard.wsi.toFixed(2)}</strong>
                  </div>
                  <div className="city-map-popup__metric-row">
                    <span className="city-map-popup__metric-label">
                      <Users size={12} className="city-map-popup__metric-icon" />
                      Population
                    </span>
                    <strong className="city-map-popup__metric-val">{selectedWard.population}</strong>
                  </div>
                </div>

                <Link
                  to={`/wards/${selectedWard.wardNumber}`}
                  className="city-map-popup__link"
                >
                  View Details <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Ward Detail Panel */}
        <aside className="city-ward-panel" aria-label={`Details for ${selectedWard.name}`}>
          <div className="city-ward-panel__head">
            <div>
              <h3 className="city-ward-panel__title">{selectedWard.name}</h3>
              <p className="city-ward-panel__zone">{selectedWard.zone}</p>
            </div>
            <span className={`city-ward-panel__badge city-ward-panel__badge--${selectedWard.risk}`}>
              ● {selectedWard.riskLabel}
            </span>
          </div>

          {/* Cityscape Photographic Visual */}
          <div
            className="city-ward-panel__hero-img"
            style={{
              backgroundImage: `url(${cityscape})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 35%',
            }}
            role="img"
            aria-label={`Panoramic river view of ${selectedWard.name}`}
          />

          {/* Stats List */}
          <dl className="city-ward-panel__stats">
            <div className="city-ward-panel__stat-row">
              <dt className="city-ward-panel__stat-label">Water Stress Index</dt>
              <dd className="city-ward-panel__stat-val city-ward-panel__stat-val--danger">
                {selectedWard.wsi.toFixed(2)}
              </dd>
            </div>
            <div className="city-ward-panel__stat-row">
              <dt className="city-ward-panel__stat-label">Population</dt>
              <dd className="city-ward-panel__stat-val">{selectedWard.population}</dd>
            </div>
            <div className="city-ward-panel__stat-row">
              <dt className="city-ward-panel__stat-label">Annual Rainfall</dt>
              <dd className="city-ward-panel__stat-val">{selectedWard.rainfall}</dd>
            </div>
            <div className="city-ward-panel__stat-row">
              <dt className="city-ward-panel__stat-label">Water Demand</dt>
              <dd className="city-ward-panel__stat-val">{selectedWard.demand}</dd>
            </div>
            <div className="city-ward-panel__stat-row">
              <dt className="city-ward-panel__stat-label">Groundwater Level</dt>
              <dd className="city-ward-panel__stat-val">{selectedWard.groundwater}</dd>
            </div>
          </dl>

          {/* Action Button */}
          <div className="city-ward-panel__action">
            <button
              type="button"
              className="city-ward-panel__btn"
              onClick={() => navigate(`/wards/${selectedWard.wardNumber}`)}
            >
              View Full Details <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        </aside>
      </div>
    </article>
  )
}

export default CityWaterStressMap
