import { useState } from 'react'
import { LocateFixed, Minus, Plus } from 'lucide-react'
import { COVERAGE_MAP_LEGEND, DATA_COVERAGE_SOURCES } from '../../data/dataSourcesData.js'

/**
 * Data Coverage Map card.
 *
 * Lightweight, illustrative SVG map showing spatial coverage of datasets
 * across Delhi's administrative zones and wards, featuring the Yamuna River,
 * regional labels, zoom controls, and a dynamic coverage source filter.
 */
const DataCoverageMap = ({
  coverageSource = 'all',
  onCoverageSourceChange,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1.0)

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(2.2, Number((prev + 0.2).toFixed(2))))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(0.8, Number((prev - 0.2).toFixed(2))))
  }

  const handleReset = () => {
    setZoomLevel(1.0)
  }

  // Determine which polygons get highlighted or muted based on selected coverage source
  const isHighlighted = (sourceId) => {
    if (coverageSource === 'all') return true
    return coverageSource === sourceId
  }

  return (
    <article className="card data-coverage-map-card" aria-labelledby="coverage-map-title">
      <header className="data-coverage-map-card__header">
        <div className="data-coverage-map-card__title-wrap">
          <h3 className="data-coverage-map-card__title" id="coverage-map-title">
            Data Coverage Map
          </h3>
          <p className="data-coverage-map-card__subtitle">
            Spatial coverage of different data sources.
          </p>
        </div>

        <div className="data-coverage-map-card__selector-wrap">
          <label className="data-coverage-map-card__select-label" htmlFor="coverage-source-select">
            Select Source
          </label>
          <select
            id="coverage-source-select"
            className="native-select data-coverage-map-card__select"
            value={coverageSource}
            onChange={(e) => onCoverageSourceChange(e.target.value)}
          >
            {DATA_COVERAGE_SOURCES.map((src) => (
              <option key={src.id} value={src.id}>
                {src.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div
        className="data-coverage-map__canvas"
        role="region"
        aria-label="Interactive illustrative map of Delhi data coverage"
      >
        {/* Navigation Controls (Top-Left) */}
        <div className="data-coverage-map__controls" aria-label="Map navigation controls">
          <button
            type="button"
            className="data-coverage-map__ctrl-btn"
            onClick={handleZoomIn}
            aria-label="Zoom in map"
            title="Zoom in"
          >
            <Plus size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="data-coverage-map__ctrl-btn"
            onClick={handleZoomOut}
            aria-label="Zoom out map"
            title="Zoom out"
          >
            <Minus size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="data-coverage-map__ctrl-btn"
            onClick={handleReset}
            aria-label="Reset map view"
            title="Centre map"
          >
            <LocateFixed size={15} aria-hidden="true" />
          </button>
        </div>

        {/* Zoom indicator */}
        <span className="data-coverage-map__zoom-indicator" aria-hidden="true">
          {zoomLevel.toFixed(1)}×
        </span>

        {/* Map Vector Visualization */}
        <div
          className="data-coverage-map__viewport"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox="0 0 540 460"
            className="data-coverage-map__svg"
            role="img"
            aria-label="Map of Delhi highlighting data coverage zones"
          >
            <defs>
              {/* Subtle background terrain pattern */}
              <pattern id="ds-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e1ecf0" strokeWidth="0.6" />
              </pattern>

              {/* Yamuna river gradient */}
              <linearGradient id="yamuna-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="60%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>

              {/* Drop shadows for map polygons */}
              <filter id="map-poly-shadow" x="-4%" y="-4%" width="108%" height="108%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#142e3b" floodOpacity="0.08" />
              </filter>
            </defs>

            {/* Background Grid */}
            <rect width="100%" height="100%" fill="url(#ds-grid)" />

            {/* Delhi Outer Outline Shadow */}
            <path
              d="M 245 42 Q 285 48 318 80 Q 365 145 350 205 Q 365 240 375 285 Q 355 350 325 385 Q 260 410 215 365 Q 155 320 140 270 Q 125 210 160 140 Q 190 75 245 42 Z"
              fill="#dbeef2"
              opacity="0.35"
            />

            {/* Region / Ward Polygon Groups */}
            <g filter="url(#map-poly-shadow)">
              {/* NORTH DELHI CLUSTER (Mint / Green - DJB & Land Use) */}
              <polygon
                points="245,46 295,58 315,95 275,108 235,85"
                className={`ds-map-poly ds-map-poly--djb ${isHighlighted('djb') ? '' : 'ds-map-poly--muted'}`}
              />
              <polygon
                points="235,85 275,108 260,150 210,135 200,98"
                className={`ds-map-poly ds-map-poly--cgwb ${isHighlighted('cgwb') ? '' : 'ds-map-poly--muted'}`}
              />
              <polygon
                points="275,108 320,118 335,165 285,160 260,150"
                className={`ds-map-poly ds-map-poly--djb ${isHighlighted('djb') ? '' : 'ds-map-poly--muted'}`}
              />
              <polygon
                points="175,115 210,135 200,185 155,165"
                className={`ds-map-poly ds-map-poly--cgwb ${isHighlighted('cgwb') ? '' : 'ds-map-poly--muted'}`}
              />

              {/* CENTRAL DELHI CLUSTER (Green & Teal) */}
              <polygon
                points="210,135 260,150 255,200 200,185"
                className={`ds-map-poly ds-map-poly--djb ${isHighlighted('djb') ? '' : 'ds-map-poly--muted'}`}
              />
              <polygon
                points="260,150 285,160 305,205 255,200"
                className={`ds-map-poly ds-map-poly--cgwb ${isHighlighted('cgwb') ? '' : 'ds-map-poly--muted'}`}
              />
              <polygon
                points="200,185 255,200 245,255 180,240 175,195"
                className={`ds-map-poly ds-map-poly--djb ${isHighlighted('djb') ? '' : 'ds-map-poly--muted'}`}
              />
              <polygon
                points="255,200 305,205 295,260 245,255"
                className={`ds-map-poly ds-map-poly--cgwb ${isHighlighted('cgwb') ? '' : 'ds-map-poly--muted'}`}
              />

              {/* WEST DELHI CLUSTER (Sky Blue & District Rain) */}
              <polygon
                points="155,165 200,185 180,240 135,225"
                className={`ds-map-poly ds-map-poly--imd ${isHighlighted('imd') ? '' : 'ds-map-poly--muted'}`}
              />
              <polygon
                points="135,225 180,240 170,295 125,275"
                className={`ds-map-poly ds-map-poly--imd ${isHighlighted('imd') ? '' : 'ds-map-poly--muted'}`}
              />
              <polygon
                points="170,295 220,305 210,355 160,340"
                className={`ds-map-poly ds-map-poly--imd ${isHighlighted('imd') ? '' : 'ds-map-poly--muted'}`}
              />

              {/* SOUTH DELHI CLUSTER (Soft Blue & Cyan) */}
              <polygon
                points="245,255 295,260 285,320 225,310"
                className={`ds-map-poly ds-map-poly--imd ${isHighlighted('imd') ? '' : 'ds-map-poly--muted'}`}
              />
              <polygon
                points="225,310 285,320 270,375 215,360"
                className={`ds-map-poly ds-map-poly--imd ${isHighlighted('imd') ? '' : 'ds-map-poly--muted'}`}
              />
              <polygon
                points="285,320 330,325 320,380 270,375"
                className={`ds-map-poly ds-map-poly--cgwb ${isHighlighted('cgwb') ? '' : 'ds-map-poly--muted'}`}
              />

              {/* EAST DELHI CLUSTER (Across River - Mint & Cyan) */}
              <polygon
                points="335,165 370,190 365,245 325,235 320,185"
                className={`ds-map-poly ds-map-poly--djb ${isHighlighted('djb') ? '' : 'ds-map-poly--muted'}`}
              />
              <polygon
                points="325,235 365,245 360,295 315,285"
                className={`ds-map-poly ds-map-poly--cgwb ${isHighlighted('cgwb') ? '' : 'ds-map-poly--muted'}`}
              />
              <polygon
                points="315,285 360,295 345,340 305,335"
                className={`ds-map-poly ds-map-poly--djb ${isHighlighted('djb') ? '' : 'ds-map-poly--muted'}`}
              />
            </g>

            {/* YAMUNA RIVER (Flowing curves cutting from north to southeast) */}
            <path
              d="M 320 45 C 330 90, 310 135, 318 175 C 324 210, 305 240, 312 280 C 320 330, 375 390, 425 435"
              fill="none"
              stroke="url(#yamuna-grad)"
              strokeWidth="11"
              strokeLinecap="round"
              className="ds-map-river"
            />
            {/* River highlight shimmer */}
            <path
              d="M 320 45 C 330 90, 310 135, 318 175 C 324 210, 305 240, 312 280 C 320 330, 375 390, 425 435"
              fill="none"
              stroke="#93c5fd"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.8"
            />

            {/* Regional Labels */}
            <text x="290" y="70" className="ds-map-label ds-map-label--north">
              NORTH DELHI
            </text>
            <text x="75" y="245" className="ds-map-label ds-map-label--west">
              WEST DELHI
            </text>
            <text x="400" y="245" className="ds-map-label ds-map-label--east">
              EAST DELHI
            </text>
            <text x="275" y="415" className="ds-map-label ds-map-label--south">
              SOUTH DELHI
            </text>
          </svg>
        </div>

        {/* Legend Overlay (Right-Aligned) */}
        <div className="data-coverage-map__legend" aria-label="Coverage map legend">
          <ul className="data-coverage-map__legend-list">
            {COVERAGE_MAP_LEGEND.map((item) => (
              <li
                key={item.id}
                className={`data-coverage-map__legend-item ${
                  coverageSource === item.id ? 'data-coverage-map__legend-item--active' : ''
                }`}
                onClick={() =>
                  onCoverageSourceChange(coverageSource === item.id ? 'all' : item.id)
                }
                role="button"
                tabIndex={0}
                title={`Filter to ${item.label}`}
              >
                <span
                  className="data-coverage-map__legend-swatch"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
                <span className="data-coverage-map__legend-text">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}

export default DataCoverageMap
