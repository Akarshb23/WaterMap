import { useState } from 'react'
import { Locate, Minus, Plus } from 'lucide-react'
import { BANGALORE_DASHBOARD_DISTRICTS } from '../../data/bangaloreDashboardData.js'

/**
 * 5 Regional geographic labels matching Bangalore zones:
 * NORTH BANGALORE, WEST BANGALORE, CENTRAL BANGALORE, EAST BANGALORE, SOUTH BANGALORE.
 */
const CITY_MAP_REGIONS = [
  { id: 'north-bangalore', label: 'NORTH BANGALORE', x: 288, y: 92 },
  { id: 'west-bangalore', label: 'WEST BANGALORE', x: 172, y: 242 },
  { id: 'central-bangalore', label: 'CENTRAL BANGALORE', x: 282, y: 295 },
  { id: 'east-bangalore', label: 'EAST BANGALORE', x: 422, y: 285 },
  { id: 'south-bangalore', label: 'SOUTH BANGALORE', x: 292, y: 436 },
]

/**
 * Interactive City Map component matching Bangalore geography:
 * - Basemap with arterial road grid, green reserves (Cubbon Park, Lalbagh), and lake valleys
 * - 42 interlocking district polygons with risk-color choropleth
 * - Selected district dashed boundary, concentric pin, and attached tooltip popup
 * - Top-left zoom controls (+, -, locate) in grouped container
 * - Bottom-left floating legend & toggle switches (District Boundaries, Satellite View)
 * - Bottom-left cartographic scale bar (0, 5, 10 km)
 */
const InteractiveCityMap = ({
  selectedDistrictId = 'district-12',
  selectedWardId,
  onSelectDistrict,
  onSelectWard,
  zone = 'all',
  searchQuery = '',
}) => {
  const [zoom, setZoom] = useState(1)
  const [showBoundaries, setShowBoundaries] = useState(true)
  const [satelliteView, setSatelliteView] = useState(false)

  const activeId = selectedDistrictId || selectedWardId || 'district-12'
  const handleSelect = onSelectDistrict || onSelectWard

  const selectedDistrict =
    BANGALORE_DASHBOARD_DISTRICTS.find((d) => d.id === activeId || d.legacyId === activeId) ||
    BANGALORE_DASHBOARD_DISTRICTS[0]

  const handleZoomIn = () => setZoom((z) => Math.min(1.4, +(z + 0.12).toFixed(2)))
  const handleZoomOut = () => setZoom((z) => Math.max(0.85, +(z - 0.12).toFixed(2)))
  const handleResetZoom = () => {
    setZoom(1)
    handleSelect?.(BANGALORE_DASHBOARD_DISTRICTS.find((d) => d.id === 'district-12') || BANGALORE_DASHBOARD_DISTRICTS[0])
  }

  const isDistrictVisible = (district) => {
    if (zone !== 'all' && district.zoneKey !== zone) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      const matchName = district.name.toLowerCase().includes(q)
      const matchZone = district.zone.toLowerCase().includes(q)
      if (!matchName && !matchZone) return false
    }
    return true
  }

  return (
    <div
      className={`interactive-map-viewport ${satelliteView ? 'interactive-map-viewport--satellite' : ''}`}
      role="region"
      aria-label="Interactive city map of Bangalore"
    >
      {/* Zoom Controls: Top-Left Grouped Container */}
      <div className="interactive-map-controls" role="toolbar" aria-label="Map zoom controls">
        <div className="interactive-map-ctrl-group">
          <button
            type="button"
            className="interactive-map-ctrl-btn interactive-map-ctrl-btn--top"
            onClick={handleZoomIn}
            aria-label="Zoom in"
            title="Zoom in"
          >
            <Plus size={16} />
          </button>
          <div className="interactive-map-ctrl-divider" />
          <button
            type="button"
            className="interactive-map-ctrl-btn interactive-map-ctrl-btn--bottom"
            onClick={handleZoomOut}
            aria-label="Zoom out"
            title="Zoom out"
          >
            <Minus size={16} />
          </button>
        </div>
        <button
          type="button"
          className="interactive-map-ctrl-btn interactive-map-ctrl-btn--standalone"
          onClick={handleResetZoom}
          aria-label="Reset view"
          title="Reset view"
        >
          <Locate size={15} />
        </button>
      </div>

      {/* Floating Legend & Layer Toggles Card: Bottom-Left */}
      <div className="interactive-map-legend-card" aria-label="Map legend and layer switches">
        <h4 className="interactive-map-legend-card__title">Water Stress Index</h4>
        <ul className="interactive-map-legend-card__list">
          <li className="interactive-map-legend-card__item">
            <span className="interactive-map-legend-card__dot" style={{ backgroundColor: '#10b981' }} />
            <span>Low (0 – 0.3)</span>
          </li>
          <li className="interactive-map-legend-card__item">
            <span className="interactive-map-legend-card__dot" style={{ backgroundColor: '#f59e0b' }} />
            <span>Moderate (0.3 – 0.6)</span>
          </li>
          <li className="interactive-map-legend-card__item">
            <span className="interactive-map-legend-card__dot" style={{ backgroundColor: '#ef4444' }} />
            <span>High (0.6 – 1.0)</span>
          </li>
        </ul>

        <div className="interactive-map-legend-card__divider" />

        {/* Toggles */}
        <div className="interactive-map-toggles">
          <label className="interactive-map-switch">
            <input
              type="checkbox"
              checked={showBoundaries}
              onChange={(e) => setShowBoundaries(e.target.checked)}
              className="interactive-map-switch__input"
            />
            <span className="interactive-map-switch__slider" />
            <span className="interactive-map-switch__label">District Boundaries</span>
          </label>

          <label className="interactive-map-switch">
            <input
              type="checkbox"
              checked={satelliteView}
              onChange={(e) => setSatelliteView(e.target.checked)}
              className="interactive-map-switch__input"
            />
            <span className="interactive-map-switch__slider" />
            <span className="interactive-map-switch__label">Satellite View</span>
          </label>
        </div>
      </div>

      {/* Cartographic Scale Bar: Bottom-Left (under legend) */}
      <div className="interactive-map-scale-bar" aria-label="Map scale">
        <div className="interactive-map-scale-bar__ticks">
          <span>0</span>
          <span>5</span>
          <span>10 km</span>
        </div>
        <div className="interactive-map-scale-bar__line-container">
          <div className="interactive-map-scale-bar__rule" />
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div
        className="interactive-map-canvas"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <svg
          viewBox="120 20 340 450"
          className="interactive-map-svg"
          role="img"
          aria-label="Choropleth map of Bangalore districts"
        >
          {/* 1. Basemap Land Fill */}
          <rect
            x="120"
            y="20"
            width="340"
            height="450"
            fill={satelliteView ? '#1e293b' : '#f2f6f4'}
          />

          {/* 2. Soft Green Parks & Forest Belts (Cubbon Park, Lalbagh, Turahalli) */}
          {!satelliteView && (
            <g fill="#dcefdc" opacity="0.85">
              {/* Northern Ridge */}
              <path d="M 230 45 Q 255 75 260 115 Q 240 125 220 85 Z" />
              {/* Central Greenery / Cubbon Park */}
              <path d="M 205 195 Q 235 205 245 245 Q 220 265 200 235 Z" />
              {/* Lalbagh Botanical Gardens */}
              <path d="M 225 375 Q 260 385 275 435 Q 235 455 215 415 Z" />
              {/* Bellandur-Varthur wetland corridor */}
              <path d="M 335 30 Q 360 85 355 135 Q 370 195 380 245 Q 370 245 355 175 Q 345 115 330 45 Z" fill="#d8edd9" />
              {/* Ulsoor Lake Park */}
              <path d="M 415 125 Q 445 145 435 185 Q 405 175 415 125 Z" />
              {/* Bannerghatta reserve buffer */}
              <path d="M 395 355 Q 435 375 425 415 Q 385 395 395 355 Z" />
            </g>
          )}

          {/* 3. Intricate Road Network matching OpenStreetMap Basemap */}
          {/* Secondary streets grid */}
          <g
            stroke={satelliteView ? '#334155' : '#ffffff'}
            strokeWidth="1.6"
            fill="none"
            opacity={satelliteView ? 0.6 : 0.9}
            strokeLinecap="round"
          >
            {/* Horizontal / West-East secondary roads */}
            <path d="M 125 70 Q 280 65 455 75" />
            <path d="M 125 110 Q 280 115 455 105" />
            <path d="M 125 150 Q 280 155 455 145" />
            <path d="M 125 210 Q 280 215 455 205" />
            <path d="M 125 260 Q 280 255 455 265" />
            <path d="M 125 310 Q 280 305 455 315" />
            <path d="M 125 355 Q 280 360 455 350" />
            <path d="M 125 400 Q 280 395 455 405" />
            <path d="M 125 440 Q 280 445 455 435" />

            {/* Vertical / North-South secondary roads */}
            <path d="M 155 25 Q 160 235 150 465" />
            <path d="M 195 25 Q 200 235 190 465" />
            <path d="M 235 25 Q 240 235 230 465" />
            <path d="M 275 25 Q 270 235 275 465" />
            <path d="M 315 25 Q 320 235 315 465" />
            <path d="M 355 25 Q 360 235 355 465" />
            <path d="M 395 25 Q 390 235 395 465" />
            <path d="M 435 25 Q 440 235 435 465" />
          </g>

          {/* Primary Arterials & Expressways with Casing */}
          <g fill="none" strokeLinecap="round">
            {/* Casing (subtle grey border) */}
            <g stroke={satelliteView ? '#1e293b' : '#d6e2db'} strokeWidth="4.6" opacity="0.8">
              {/* Outer Ring Road */}
              <ellipse cx="270" cy="230" rx="120" ry="142" />
              {/* Inner Ring Road */}
              <ellipse cx="282" cy="225" rx="74" ry="80" />
              {/* Radials */}
              <path d="M 125 180 Q 280 190 455 175" />
              <path d="M 125 315 Q 280 290 455 320" />
              <path d="M 305 25 Q 315 240 320 465" />
              <path d="M 215 65 Q 235 260 210 425" />
              <path d="M 395 55 Q 380 250 410 445" />
            </g>

            {/* Core Road Lines (Clean White) */}
            <g stroke={satelliteView ? '#475569' : '#ffffff'} strokeWidth="3.2">
              <ellipse cx="270" cy="230" rx="120" ry="142" />
              <ellipse cx="282" cy="225" rx="74" ry="80" />
              <path d="M 125 180 Q 280 190 455 175" />
              <path d="M 125 315 Q 280 290 455 320" />
              <path d="M 305 25 Q 315 240 320 465" />
              <path d="M 215 65 Q 235 260 210 425" />
              <path d="M 395 55 Q 380 250 410 445" />
            </g>
          </g>

          {/* 4. Valley Stream Ribbon with Crossings */}
          <g fill="none">
            {/* Water flow ribbon */}
            <path
              d="M 342 20 Q 365 110 360 160 Q 375 215 382 280 Q 408 360 440 465"
              stroke={satelliteView ? '#1e3a8a' : '#90cdf4'}
              strokeWidth="14"
              opacity="0.92"
              strokeLinecap="round"
            />
            {/* Stream center line */}
            <path
              d="M 342 20 Q 365 110 360 160 Q 375 215 382 280 Q 408 360 440 465"
              stroke={satelliteView ? '#2563eb' : '#63b3ed'}
              strokeWidth="5"
              opacity="0.9"
              strokeLinecap="round"
            />
            {/* Bridge crossings */}
            <g stroke="#ffffff" strokeWidth="2.5" strokeDasharray="3 2" opacity="0.95">
              <line x1="350" y1="105" x2="368" y2="108" />
              <line x1="352" y1="160" x2="370" y2="162" />
              <line x1="365" y1="215" x2="385" y2="218" />
              <line x1="375" y1="275" x2="395" y2="278" />
              <line x1="395" y1="345" x2="415" y2="348" />
              <line x1="420" y1="415" x2="442" y2="418" />
            </g>
          </g>

          {/* 5. Regional Geographic Labels (Exactly 5 Bangalore zones) */}
          <g
            fill={satelliteView ? '#cbd5e1' : '#4b5563'}
            fontSize="8.5"
            fontWeight="700"
            letterSpacing="1.1"
            opacity="0.75"
          >
            {CITY_MAP_REGIONS.map((r) => (
              <text key={r.id} x={r.x} y={r.y} textAnchor="middle">
                {r.label}
              </text>
            ))}
          </g>

          {/* 6. 42 Seamless Interlocking District Polygons */}
          <g className="interactive-map-polygons">
            {BANGALORE_DASHBOARD_DISTRICTS.map((w) => {
              const visible = isDistrictVisible(w)
              const isSelected = selectedDistrict.id === w.id

              return (
                <polygon
                  key={w.id}
                  points={w.shape}
                  fill={w.fill}
                  fillOpacity={satelliteView ? 0.82 : 1}
                  stroke={
                    isSelected
                      ? '#ffffff'
                      : showBoundaries
                      ? '#ffffff'
                      : 'none'
                  }
                  strokeWidth={isSelected ? 2.5 : showBoundaries ? 1.2 : 0}
                  strokeDasharray={isSelected ? '4 3' : 'none'}
                  strokeLinejoin="round"
                  opacity={visible ? 1 : 0.22}
                  className={`interactive-map-poly ${isSelected ? 'interactive-map-poly--selected' : ''}`}
                  onClick={() => handleSelect?.(w)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${w.name}: ${w.riskLabel}, WSI ${w.wsi}`}
                  style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                />
              )
            })}
          </g>

          {/* 7. Selected District Concentric Bullseye Marker Pin */}
          <g
            className="interactive-map-pin"
            transform={`translate(${selectedDistrict.center[0]}, ${selectedDistrict.center[1]})`}
            pointerEvents="none"
          >
            {/* White outer halo */}
            <circle r="9" fill="none" stroke="#ffffff" strokeWidth="2.8" opacity="0.95" />
            {/* Black outer circle */}
            <circle r="6" fill="#0f172a" />
            {/* White inner ring */}
            <circle r="3.2" fill="#ffffff" />
            {/* Black center dot */}
            <circle r="1.6" fill="#0f172a" />
          </g>
        </svg>

        {/* 8. Attached Popup Card on Active District */}
        <div
          className="interactive-map-popup"
          style={{
            left: `${((selectedDistrict.center[0] - 120) / 340) * 100}%`,
            top: `${((selectedDistrict.center[1] - 20) / 450) * 100}%`,
          }}
        >
          <div className="interactive-map-popup__inner">
            <div className="interactive-map-popup__line">
              <span className="interactive-map-popup__name">
                <span className="interactive-map-popup__dot" style={{ backgroundColor: '#f59e0b' }} />
                {selectedDistrict.name}
              </span>
            </div>
            <div className="interactive-map-popup__line">
              <span className="interactive-map-popup__risk">
                <span className="interactive-map-popup__dot" style={{ backgroundColor: '#ef4444' }} />
                {selectedDistrict.riskLabel}
              </span>
            </div>
            <div className="interactive-map-popup__line">
              <span className="interactive-map-popup__wsi">
                WSI: <strong>{selectedDistrict.wsi.toFixed(2)}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InteractiveCityMap
