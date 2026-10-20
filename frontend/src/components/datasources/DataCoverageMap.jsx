import { useState } from 'react'
import { Locate, Minus, Plus } from 'lucide-react'
import { COVERAGE_MAP_LEGEND, DATA_COVERAGE_SOURCES } from '../../data/dataSourcesData.js'

// Polygons tessellating the geographical boundary of Bangalore
// Colored in greens (North/West) and blues (Central/East/South) matching the mockup
const BANGALORE_COVERAGE_DISTRICTS = [
  // Northern Region - Mint & Light Green tones (BWSSB & Groundwater)
  { id: 'D01', name: 'Yelahanka', region: 'North', source: 'bwssb', fill: '#34d399', shape: '272,42 334,36 346,84 286,88' },
  { id: 'D02', name: 'Hebbal', region: 'North', source: 'bwssb', fill: '#6ee7b7', shape: '334,36 384,48 380,100 338,92' },
  { id: 'D03', name: 'Thanisandra', region: 'North', source: 'cgwb', fill: '#10b981', shape: '212,62 272,42 284,92 222,118' },
  { id: 'D04', name: 'Vidyaranyapura', region: 'North', source: 'cgwb', fill: '#34d399', shape: '254,122 296,118 298,155 258,158' },
  { id: 'D05', name: 'Kodigehalli', region: 'North', source: 'bwssb', fill: '#86efac', shape: '346,84 402,96 392,138 342,128' },
  { id: 'D06', name: 'Peenya', region: 'North', source: 'cgwb', fill: '#34d399', shape: '296,118 342,112 338,150 298,155' },
  { id: 'D07', name: 'Jalahalli', region: 'North', source: 'bwssb', fill: '#6ee7b7', shape: '342,112 384,120 374,158 338,150' },
  { id: 'D08', name: 'RT Nagar', region: 'North', source: 'bwssb', fill: '#10b981', shape: '298,155 338,150 330,180 298,185' },

  // Western Region - Green to Cyan Transition (Population & Groundwater)
  { id: 'D09', name: 'Rajajinagar', region: 'West', source: 'census', fill: '#6ee7b7', shape: '168,148 216,160 210,210 162,198' },
  { id: 'D10', name: 'Malleshwaram', region: 'West', source: 'cgwb', fill: '#34d399', shape: '216,160 258,158 258,198 214,196' },
  { id: 'D11', name: 'Vijayanagar', region: 'West', source: 'census', fill: '#86efac', shape: '214,196 258,198 252,234 210,230' },
  { id: 'D16', name: 'Basaveshwaranagar', region: 'West', source: 'census', fill: '#6ee7b7', shape: '162,204 210,210 204,256 156,246' },
  { id: 'D17', name: 'Kengeri', region: 'West', source: 'cgwb', fill: '#34d399', shape: '246,236 278,236 284,270 248,268' },
  { id: 'D18', name: 'Nagarbhavi', region: 'West', source: 'census', fill: '#86efac', shape: '156,252 204,258 196,304 150,296' },
  { id: 'D19', name: 'Mahalakshmi Layout', region: 'West', source: 'bwssb', fill: '#34d399', shape: '150,300 196,306 188,352 144,342' },
  { id: 'D40', name: 'Yeshwanthpur', region: 'West', source: 'cgwb', fill: '#10b981', shape: '206,230 248,236 244,268 202,264' },

  // Central Region - Blue shades (Rainfall & IMD)
  { id: 'D12', name: 'Koramangala', region: 'Central', source: 'imd', fill: '#60a5fa', shape: '298,185 330,180 342,212 308,218 296,200' },
  { id: 'D13', name: 'Indiranagar', region: 'Central', source: 'imd', fill: '#38bdf8', shape: '268,202 296,200 306,232 278,236' },
  { id: 'D14', name: 'Shanthi Nagar', region: 'Central', source: 'imd', fill: '#60a5fa', shape: '296,200 326,196 332,228 306,232' },
  { id: 'D15', name: 'Shivaji Nagar', region: 'Central', source: 'imd', fill: '#93c5fd', shape: '326,196 358,190 366,220 332,228' },
  { id: 'D25', name: 'Richmond Town', region: 'Central', source: 'imd', fill: '#3b82f6', shape: '278,236 306,232 312,266 284,270' },
  { id: 'D26', name: 'Domlur', region: 'Central', source: 'imd', fill: '#60a5fa', shape: '306,232 342,228 348,266 312,266' },

  // Eastern Region - Blue / Sky shades (Rainfall & Land Use)
  { id: 'D20', name: 'Whitefield', region: 'East', source: 'imd', fill: '#38bdf8', shape: '368,172 402,168 412,198 376,204' },
  { id: 'D21', name: 'Bellandur', region: 'East', source: 'imd', fill: '#60a5fa', shape: '376,204 412,198 420,232 382,238' },
  { id: 'D22', name: 'Marathahalli', region: 'East', source: 'imd', fill: '#93c5fd', shape: '352,228 382,238 388,272 356,268' },
  { id: 'D24', name: 'Varthur', region: 'East', source: 'imd', fill: '#38bdf8', shape: '382,238 426,234 432,274 388,272' },
  { id: 'D23', name: 'Mahadevapura', region: 'East', source: 'imd', fill: '#60a5fa', shape: '388,272 432,274 424,312 378,308' },
  { id: 'D41', name: 'CV Raman Nagar', region: 'East', source: 'imd', fill: '#93c5fd', shape: '374,308 418,306 410,348 368,348' },

  // Southern Region - Blue & Cyan Shades (Rainfall & BWSSB)
  { id: 'D27', name: 'Electronic City', region: 'South', source: 'cgwb', fill: '#34d399', shape: '244,268 284,270 278,312 236,306' },
  { id: 'D28', name: 'HSR Layout', region: 'South', source: 'imd', fill: '#60a5fa', shape: '284,270 306,300 298,338 274,318' },
  { id: 'D29', name: 'BTM Layout', region: 'South', source: 'imd', fill: '#3b82f6', shape: '312,266 348,266 342,302 306,300' },
  { id: 'D30', name: 'Jayanagar', region: 'South', source: 'imd', fill: '#60a5fa', shape: '348,266 384,264 378,308 342,302' },
  { id: 'D31', name: 'JP Nagar', region: 'South', source: 'cgwb', fill: '#34d399', shape: '212,324 262,336 250,388 200,372' },
  { id: 'D32', name: 'Basavanagudi', region: 'South', source: 'imd', fill: '#38bdf8', shape: '274,318 316,334 310,374 266,364' },
  { id: 'D33', name: 'Banashankari', region: 'South', source: 'imd', fill: '#60a5fa', shape: '316,334 356,334 350,374 310,374' },
  { id: 'D34', name: 'Padmanabhanagar', region: 'South', source: 'imd', fill: '#93c5fd', shape: '356,334 396,330 390,370 350,374' },
  { id: 'D35', name: 'Bommanahalli', region: 'South', source: 'imd', fill: '#60a5fa', shape: '378,308 418,306 412,350 374,352' },
  { id: 'D36', name: 'Uttarahalli', region: 'South', source: 'cgwb', fill: '#10b981', shape: '254,398 300,412 288,454 242,438' },
  { id: 'D37', name: 'Arekere', region: 'South', source: 'cgwb', fill: '#34d399', shape: '300,412 352,408 342,458 288,454' },
  { id: 'D38', name: 'Gottigere', region: 'South', source: 'cgwb', fill: '#10b981', shape: '352,408 408,402 398,452 342,458' },
  { id: 'D39', name: 'Begur', region: 'South', source: 'imd', fill: '#38bdf8', shape: '390,370 432,364 424,408 382,410' },
  { id: 'D42', name: 'Hulimavu', region: 'South', source: 'imd', fill: '#60a5fa', shape: '266,364 310,374 300,412 254,398' },
]

/**
 * Data Coverage Map showing spatial coverage of different data sources across Bangalore.
 * Matches the reference mockup with zoom controls, dropdown, region labels, and legend.
 */
const DataCoverageMap = ({
  coverageSource = 'all',
  onCoverageSourceChange,
}) => {
  const [zoom, setZoom] = useState(1)
  const [selectedDistrict, setSelectedDistrict] = useState(null)

  const handleZoomIn = () => setZoom((z) => Math.min(1.8, +(z + 0.15).toFixed(2)))
  const handleZoomOut = () => setZoom((z) => Math.max(0.85, +(z - 0.15).toFixed(2)))
  const handleResetZoom = () => {
    setZoom(1)
    setSelectedDistrict(null)
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
            onChange={(e) => onCoverageSourceChange?.(e.target.value)}
          >
            {DATA_COVERAGE_SOURCES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="data-coverage-map__canvas" role="region" aria-label="Data coverage map">
        {/* Floating Controls (top-left) */}
        <div className="data-coverage-map__controls" role="toolbar" aria-label="Map navigation controls">
          <button
            type="button"
            className="data-coverage-map__ctrl-btn"
            onClick={handleZoomIn}
            aria-label="Zoom in"
            title="Zoom in"
          >
            <Plus size={16} />
          </button>
          <button
            type="button"
            className="data-coverage-map__ctrl-btn"
            onClick={handleZoomOut}
            aria-label="Zoom out"
            title="Zoom out"
          >
            <Minus size={16} />
          </button>
          <button
            type="button"
            className="data-coverage-map__ctrl-btn"
            onClick={handleResetZoom}
            aria-label="Reset zoom"
            title="Reset map view"
          >
            <Locate size={16} />
          </button>
        </div>

        {/* Floating Legend Overlay (top-right) */}
        <div className="data-coverage-map__legend" aria-label="Data coverage layers legend">
          <ul className="data-coverage-map__legend-list">
            {COVERAGE_MAP_LEGEND.map((item) => (
              <li
                key={item.id}
                className={`data-coverage-map__legend-item ${coverageSource === item.id ? 'data-coverage-map__legend-item--active' : ''}`}
                onClick={() => onCoverageSourceChange?.(coverageSource === item.id ? 'all' : item.id)}
                role="button"
                tabIndex={0}
              >
                <span
                  className="data-coverage-map__legend-swatch"
                  style={{ backgroundColor: item.color }}
                />
                <span className="data-coverage-map__legend-text">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Interactive SVG Canvas */}
        <div
          className="data-coverage-map__viewport"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            width: '100%',
            height: '100%',
          }}
        >
          <svg
            viewBox="130 20 320 450"
            className="data-coverage-map__svg"
            role="img"
            aria-label="Map of Bangalore showing spatial data coverage by source"
          >
            {/* Background canvas */}
            <rect x="130" y="20" width="320" height="450" fill="#f4f7f6" />

            {/* Subtle arterial roads */}
            <g stroke="#ffffff" strokeWidth="2.5" fill="none" opacity="0.9" strokeLinecap="round">
              <path d="M 140 180 Q 280 190 440 175" />
              <path d="M 140 310 Q 280 290 440 315" />
              <path d="M 310 25 Q 320 240 325 465" />
              <path d="M 230 70 Q 240 260 220 420" />
              <path d="M 390 60 Q 380 250 400 440" />
            </g>

            {/* Subtle Vrishabhavathi Valley / Bellandur Lake System along East Bangalore */}
            <path
              d="M 358 20 Q 380 90 370 150 Q 365 200 376 250 Q 385 300 420 370 Q 435 410 445 465"
              fill="none"
              stroke="#b9dff2"
              strokeWidth="5"
              opacity="0.75"
              strokeLinecap="round"
            />

            {/* Regional Name Labels */}
            <g fill="#4b5563" fontSize="9.5" fontWeight="700" letterSpacing="0.9">
              <text x="290" y="60" textAnchor="middle">NORTH BANGALORE</text>
              <text x="195" y="210" textAnchor="middle">WEST BANGALORE</text>
              <text x="402" y="235" textAnchor="middle">EAST BANGALORE</text>
              <text x="315" y="445" textAnchor="middle">SOUTH BANGALORE</text>
            </g>

            {/* District Polygons */}
            <g className="data-coverage-map__polygons">
              {BANGALORE_COVERAGE_DISTRICTS.map((d) => {
                const isMatched = coverageSource === 'all' || d.source === coverageSource
                const isSelected = selectedDistrict?.id === d.id

                return (
                  <polygon
                    key={d.id}
                    points={d.shape}
                    fill={d.fill}
                    stroke={isSelected ? '#0f172a' : '#ffffff'}
                    strokeWidth={isSelected ? 2.2 : 1.2}
                    className={`ds-map-poly ${!isMatched ? 'ds-map-poly--muted' : ''}`}
                    opacity={isMatched ? (isSelected ? 1 : 0.9) : 0.3}
                    onClick={() => setSelectedDistrict(d)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${d.name}: ${d.source}`}
                    style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                  />
                )
              })}
            </g>

            {/* Active Selection Pin */}
            {selectedDistrict && (
              <circle
                cx={selectedDistrict.shape.split(' ')[0].split(',')[0]}
                cy={selectedDistrict.shape.split(' ')[0].split(',')[1]}
                r="4.5"
                fill="#ffffff"
                stroke="#0f172a"
                strokeWidth="2"
              />
            )}
          </svg>
        </div>
      </div>
    </article>
  )
}

export default DataCoverageMap