import { useState } from 'react'
import { Locate, Minus, Plus } from 'lucide-react'
import { COVERAGE_MAP_LEGEND, DATA_COVERAGE_SOURCES } from '../../data/dataSourcesData.js'

// Polygons tessellating the geographical boundary of Delhi
// Colored in greens (North/West) and blues (Central/East/South) matching the mockup
const DELHI_COVERAGE_WARDS = [
  // Northern Region - Mint & Light Green tones (DJB & Groundwater)
  { id: 'W01', name: 'Ward 1 (Narela)', region: 'North', source: 'djb', fill: '#34d399', shape: '272,42 334,36 346,84 286,88' },
  { id: 'W02', name: 'Ward 2 (Alipur)', region: 'North', source: 'djb', fill: '#6ee7b7', shape: '334,36 384,48 380,100 338,92' },
  { id: 'W03', name: 'Ward 3 (Bawana)', region: 'North', source: 'cgwb', fill: '#10b981', shape: '212,62 272,42 284,92 222,118' },
  { id: 'W04', name: 'Ward 4 (Rohini N)', region: 'North', source: 'cgwb', fill: '#34d399', shape: '254,122 296,118 298,155 258,158' },
  { id: 'W05', name: 'Ward 5 (Burari)', region: 'North', source: 'djb', fill: '#86efac', shape: '346,84 402,96 392,138 342,128' },
  { id: 'W06', name: 'Ward 6 (Rohini S)', region: 'North', source: 'cgwb', fill: '#34d399', shape: '296,118 342,112 338,150 298,155' },
  { id: 'W07', name: 'Ward 7 (Adarsh Nagar)', region: 'North', source: 'djb', fill: '#6ee7b7', shape: '342,112 384,120 374,158 338,150' },
  { id: 'W08', name: 'Ward 8 (Civil Lines)', region: 'North', source: 'djb', fill: '#10b981', shape: '298,155 338,150 330,180 298,185' },

  // Western Region - Green to Cyan Transition (Population & Groundwater)
  { id: 'W09', name: 'Ward 9 (Paschim Vihar W)', region: 'West', source: 'census', fill: '#6ee7b7', shape: '168,148 216,160 210,210 162,198' },
  { id: 'W10', name: 'Ward 10 (Punjabi Bagh)', region: 'West', source: 'cgwb', fill: '#34d399', shape: '216,160 258,158 258,198 214,196' },
  { id: 'W11', name: 'Ward 11 (Rajouri Garden)', region: 'West', source: 'census', fill: '#86efac', shape: '214,196 258,198 252,234 210,230' },
  { id: 'W16', name: 'Ward 16 (Uttam Nagar)', region: 'West', source: 'census', fill: '#6ee7b7', shape: '162,204 210,210 204,256 156,246' },
  { id: 'W17', name: 'Ward 17 (Tilak Nagar)', region: 'West', source: 'cgwb', fill: '#34d399', shape: '246,236 278,236 284,270 248,268' },
  { id: 'W18', name: 'Ward 18 (Dwarka N)', region: 'West', source: 'census', fill: '#86efac', shape: '156,252 204,258 196,304 150,296' },
  { id: 'W19', name: 'Ward 19 (Dwarka S)', region: 'West', source: 'djb', fill: '#34d399', shape: '150,300 196,306 188,352 144,342' },
  { id: 'W40', name: 'Ward 40 (Janakpuri E)', region: 'West', source: 'cgwb', fill: '#10b981', shape: '206,230 248,236 244,268 202,264' },

  // Central Region - Blue shades (Rainfall & IMD)
  { id: 'W12', name: 'Ward 12 (Central)', region: 'Central', source: 'imd', fill: '#60a5fa', shape: '298,185 330,180 342,212 308,218 296,200' },
  { id: 'W13', name: 'Ward 13 (Karol Bagh)', region: 'Central', source: 'imd', fill: '#38bdf8', shape: '268,202 296,200 306,232 278,236' },
  { id: 'W14', name: 'Ward 14 (Paharganj)', region: 'Central', source: 'imd', fill: '#60a5fa', shape: '296,200 326,196 332,228 306,232' },
  { id: 'W15', name: 'Ward 15 (Chandni Chowk)', region: 'Central', source: 'imd', fill: '#93c5fd', shape: '326,196 358,190 366,220 332,228' },
  { id: 'W25', name: 'Ward 25 (Connaught Place)', region: 'Central', source: 'imd', fill: '#3b82f6', shape: '278,236 306,232 312,266 284,270' },
  { id: 'W26', name: 'Ward 26 (India Gate)', region: 'Central', source: 'imd', fill: '#60a5fa', shape: '306,232 342,228 348,266 312,266' },

  // Eastern Region - Blue / Sky shades (Rainfall & Land Use)
  { id: 'W20', name: 'Ward 20 (Shahdara N)', region: 'East', source: 'imd', fill: '#38bdf8', shape: '368,172 402,168 412,198 376,204' },
  { id: 'W21', name: 'Ward 21 (Shahdara S)', region: 'East', source: 'imd', fill: '#60a5fa', shape: '376,204 412,198 420,232 382,238' },
  { id: 'W22', name: 'Ward 22 (Laxmi Nagar)', region: 'East', source: 'imd', fill: '#93c5fd', shape: '352,228 382,238 388,272 356,268' },
  { id: 'W24', name: 'Ward 24 (Patparganj)', region: 'East', source: 'imd', fill: '#38bdf8', shape: '382,238 426,234 432,274 388,272' },
  { id: 'W23', name: 'Ward 23 (Mayur Vihar N)', region: 'East', source: 'imd', fill: '#60a5fa', shape: '388,272 432,274 424,312 378,308' },
  { id: 'W41', name: 'Ward 41 (Mayur Vihar S)', region: 'East', source: 'imd', fill: '#93c5fd', shape: '374,308 418,306 410,348 368,348' },

  // Southern Region - Blue & Cyan Shades (Rainfall & DJB)
  { id: 'W27', name: 'Ward 27 (Delhi Cantt)', region: 'South', source: 'cgwb', fill: '#34d399', shape: '244,268 284,270 278,312 236,306' },
  { id: 'W28', name: 'Ward 28 (Chanakyapuri)', region: 'South', source: 'imd', fill: '#60a5fa', shape: '284,270 306,300 298,338 274,318' },
  { id: 'W29', name: 'Ward 29 (Lajpat Nagar)', region: 'South', source: 'imd', fill: '#3b82f6', shape: '312,266 348,266 342,302 306,300' },
  { id: 'W30', name: 'Ward 30 (Defence Colony)', region: 'South', source: 'imd', fill: '#60a5fa', shape: '348,266 384,264 378,308 342,302' },
  { id: 'W31', name: 'Ward 31 (Vasant Kunj)', region: 'South', source: 'cgwb', fill: '#34d399', shape: '212,324 262,336 250,388 200,372' },
  { id: 'W32', name: 'Ward 32 (Hauz Khas)', region: 'South', source: 'imd', fill: '#38bdf8', shape: '274,318 316,334 310,374 266,364' },
  { id: 'W33', name: 'Ward 33 (Saket)', region: 'South', source: 'imd', fill: '#60a5fa', shape: '316,334 356,334 350,374 310,374' },
  { id: 'W34', name: 'Ward 34 (Greater Kailash)', region: 'South', source: 'imd', fill: '#93c5fd', shape: '356,334 396,330 390,370 350,374' },
  { id: 'W35', name: 'Ward 35 (Kalkaji)', region: 'South', source: 'imd', fill: '#60a5fa', shape: '378,308 418,306 412,350 374,352' },
  { id: 'W36', name: 'Ward 36 (Mehrauli)', region: 'South', source: 'cgwb', fill: '#10b981', shape: '254,398 300,412 288,454 242,438' },
  { id: 'W37', name: 'Ward 37 (Sangam Vihar)', region: 'South', source: 'cgwb', fill: '#34d399', shape: '300,412 352,408 342,458 288,454' },
  { id: 'W38', name: 'Ward 38 (Badarpur)', region: 'South', source: 'cgwb', fill: '#10b981', shape: '352,408 408,402 398,452 342,458' },
  { id: 'W39', name: 'Ward 39 (Okhla)', region: 'South', source: 'imd', fill: '#38bdf8', shape: '390,370 432,364 424,408 382,410' },
  { id: 'W42', name: 'Ward 42 (Malviya Nagar)', region: 'South', source: 'imd', fill: '#60a5fa', shape: '266,364 310,374 300,412 254,398' },
]

/**
 * Data Coverage Map showing spatial coverage of different data sources across Delhi.
 * Matches the reference mockup with zoom controls, dropdown, region labels, and legend.
 */
const DataCoverageMap = ({
  coverageSource = 'all',
  onCoverageSourceChange,
}) => {
  const [zoom, setZoom] = useState(1)
  const [selectedWard, setSelectedWard] = useState(null)

  const handleZoomIn = () => setZoom((z) => Math.min(1.8, +(z + 0.15).toFixed(2)))
  const handleZoomOut = () => setZoom((z) => Math.max(0.85, +(z - 0.15).toFixed(2)))
  const handleResetZoom = () => {
    setZoom(1)
    setSelectedWard(null)
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
            aria-label="Map of Delhi showing spatial data coverage by source"
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

            {/* Subtle Yamuna River along East Delhi */}
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
              <text x="290" y="60" textAnchor="middle">NORTH DELHI</text>
              <text x="195" y="210" textAnchor="middle">WEST DELHI</text>
              <text x="402" y="235" textAnchor="middle">EAST DELHI</text>
              <text x="315" y="445" textAnchor="middle">SOUTH DELHI</text>
            </g>

            {/* Ward Polygons */}
            <g className="data-coverage-map__polygons">
              {DELHI_COVERAGE_WARDS.map((w) => {
                const isMatched = coverageSource === 'all' || w.source === coverageSource
                const isSelected = selectedWard?.id === w.id

                return (
                  <polygon
                    key={w.id}
                    points={w.shape}
                    fill={w.fill}
                    stroke={isSelected ? '#0f172a' : '#ffffff'}
                    strokeWidth={isSelected ? 2.2 : 1.2}
                    className={`ds-map-poly ${!isMatched ? 'ds-map-poly--muted' : ''}`}
                    opacity={isMatched ? (isSelected ? 1 : 0.9) : 0.3}
                    onClick={() => setSelectedWard(w)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${w.name}: ${w.source}`}
                    style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                  />
                )
              })}
            </g>

            {/* Active Selection Pin */}
            {selectedWard && (
              <circle
                cx={selectedWard.shape.split(' ')[0].split(',')[0]}
                cy={selectedWard.shape.split(' ')[0].split(',')[1]}
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