import { useState } from 'react'
import { Locate, Minus, Plus } from 'lucide-react'

// 42 District polygons tessellating the geographical boundary of Bangalore
// Exactly matching the required layout:
// 12 High Priority (Red), 18 Medium Priority (Orange/Amber), 12 Low Priority (Green)
export const BANGALORE_PRIORITY_DISTRICTS = [
  // --- 12 HIGH PRIORITY (Red) - High Stress Core & Tech Corridors ---
  { id: 'D12', name: 'Koramangala', region: 'Central', priority: 'high', priorityLabel: 'High Priority', wsi: 0.87, shape: '298,185 330,180 342,212 308,218 296,200' },
  { id: 'D13', name: 'Indiranagar', region: 'Central', priority: 'high', priorityLabel: 'High Priority', wsi: 0.78, shape: '268,202 296,200 306,232 278,236' },
  { id: 'D14', name: 'Whitefield', region: 'East', priority: 'high', priorityLabel: 'High Priority', wsi: 0.85, shape: '296,200 326,196 332,228 306,232' },
  { id: 'D15', name: 'Electronic City', region: 'South', priority: 'high', priorityLabel: 'High Priority', wsi: 0.88, shape: '326,196 358,190 366,220 332,228' },
  { id: 'D20', name: 'Bellandur', region: 'East', priority: 'high', priorityLabel: 'High Priority', wsi: 0.79, shape: '368,172 402,168 412,198 376,204' },
  { id: 'D21', name: 'HSR Layout', region: 'South', priority: 'high', priorityLabel: 'High Priority', wsi: 0.76, shape: '376,204 412,198 420,232 382,238' },
  { id: 'D22', name: 'Marathahalli', region: 'East', priority: 'high', priorityLabel: 'High Priority', wsi: 0.86, shape: '352,228 382,238 388,272 356,268' },
  { id: 'D25', name: 'BTM Layout', region: 'South', priority: 'high', priorityLabel: 'High Priority', wsi: 0.83, shape: '278,236 306,232 312,266 284,270' },
  { id: 'D26', name: 'Jayanagar', region: 'South', priority: 'high', priorityLabel: 'High Priority', wsi: 0.77, shape: '306,232 342,228 348,266 312,266' },
  { id: 'D08', name: 'Hebbal', region: 'North', priority: 'high', priorityLabel: 'High Priority', wsi: 0.82, shape: '298,155 338,150 330,180 298,185' },
  { id: 'D17', name: 'Yelahanka', region: 'North', priority: 'high', priorityLabel: 'High Priority', wsi: 0.71, shape: '246,236 278,236 284,270 248,268' },
  { id: 'D29', name: 'Rajajinagar', region: 'West', priority: 'high', priorityLabel: 'High Priority', wsi: 0.76, shape: '312,266 348,266 342,302 306,300' },

  // --- 18 MEDIUM PRIORITY (Orange/Amber) - Buffer Ring around Urban Core ---
  { id: 'D04', name: 'Banashankari', region: 'South', priority: 'medium', priorityLabel: 'Medium Priority', wsi: 0.58, shape: '254,122 296,118 298,155 258,158' },
  { id: 'D06', name: 'Malleshwaram', region: 'North', priority: 'medium', priorityLabel: 'Medium Priority', wsi: 0.52, shape: '296,118 342,112 338,150 298,155' },
  { id: 'D07', name: 'Basavanagudi', region: 'South', priority: 'medium', priorityLabel: 'Medium Priority', wsi: 0.54, shape: '342,112 384,120 374,158 338,150' },
  { id: 'D10', name: 'Frazer Town', region: 'Central', priority: 'medium', priorityLabel: 'Medium Priority', wsi: 0.49, shape: '216,160 258,158 258,198 214,196' },
  { id: 'D11', name: 'RT Nagar', region: 'North', priority: 'medium', priorityLabel: 'Medium Priority', wsi: 0.58, shape: '214,196 258,198 252,234 210,230' },
  { id: 'D24', name: 'Domlur', region: 'East', priority: 'medium', priorityLabel: 'Medium Priority', wsi: 0.56, shape: '382,238 426,234 432,274 388,272' },
  { id: 'D23', name: 'Ulsoor', region: 'Central', priority: 'medium', priorityLabel: 'Medium Priority', wsi: 0.59, shape: '388,272 432,274 424,312 378,308' },
  { id: 'D27', name: 'Yeshwanthpur', region: 'West', priority: 'medium', priorityLabel: 'Medium Priority', wsi: 0.45, shape: '244,268 284,270 278,312 236,306' },
  { id: 'D28', name: 'Peenya', region: 'West', priority: 'medium', priorityLabel: 'Medium Priority', wsi: 0.51, shape: '284,270 306,300 298,338 274,318' },
  { id: 'D30', name: 'Kengeri', region: 'West', priority: 'medium', priorityLabel: 'Medium Priority', wsi: 0.57, shape: '348,266 384,264 378,308 342,302' },
  { id: 'D32', name: 'Vijayanagar', region: 'West', priority: 'medium', priorityLabel: 'Medium Priority', wsi: 0.49, shape: '274,318 316,334 310,374 266,364' },
  { id: 'D33', name: 'Nagarbhavi', region: 'West', priority: 'medium', priorityLabel: 'Medium Priority', wsi: 0.53, shape: '316,334 356,334 350,374 310,374' },
  { id: 'D34', name: 'KR Puram', region: 'East', priority: 'medium', priorityLabel: 'Medium Priority', wsi: 0.58, shape: '356,334 396,330 390,370 350,374' },
  { id: 'D35', name: 'Mahadevapura', region: 'East', priority: 'medium', priorityLabel: 'Medium Priority', wsi: 0.52, shape: '378,308 418,306 412,350 374,352' },
  { id: 'D39', name: 'CV Raman Nagar', region: 'East', priority: 'medium', priorityLabel: 'Medium Priority', wsi: 0.55, shape: '390,370 432,364 424,408 382,410' },
  { id: 'D40', name: 'Sarjapur Road', region: 'East', priority: 'medium', priorityLabel: 'Medium Priority', wsi: 0.51, shape: '206,230 248,236 244,268 202,264' },
  { id: 'D41', name: 'Bommanahalli', region: 'South', priority: 'medium', priorityLabel: 'Medium Priority', wsi: 0.53, shape: '374,308 418,306 410,348 368,348' },
  { id: 'D42', name: 'JP Nagar', region: 'South', priority: 'medium', priorityLabel: 'Medium Priority', wsi: 0.48, shape: '266,364 310,374 300,412 254,398' },

  // --- 12 LOW PRIORITY (Green) - Outer Perimeter & Watershed Districts ---
  { id: 'D01', name: 'Devanahalli', region: 'North', priority: 'low', priorityLabel: 'Low Priority', wsi: 0.28, shape: '272,42 334,36 346,84 286,88' },
  { id: 'D02', name: 'Vidyaranyapura', region: 'North', priority: 'low', priorityLabel: 'Low Priority', wsi: 0.25, shape: '334,36 384,48 380,100 338,92' },
  { id: 'D03', name: 'Thanisandra', region: 'North', priority: 'low', priorityLabel: 'Low Priority', wsi: 0.31, shape: '212,62 272,42 284,92 222,118' },
  { id: 'D05', name: 'Sahakara Nagar', region: 'North', priority: 'low', priorityLabel: 'Low Priority', wsi: 0.30, shape: '346,84 402,96 392,138 342,128' },
  { id: 'D09', name: 'Rajarajeshwari Nagar', region: 'West', priority: 'low', priorityLabel: 'Low Priority', wsi: 0.29, shape: '168,148 216,160 210,210 162,198' },
  { id: 'D16', name: 'Banaswadi', region: 'East', priority: 'low', priorityLabel: 'Low Priority', wsi: 0.28, shape: '162,204 210,210 204,256 156,246' },
  { id: 'D18', name: 'Kalyan Nagar', region: 'East', priority: 'low', priorityLabel: 'Low Priority', wsi: 0.26, shape: '156,252 204,258 196,304 150,296' },
  { id: 'D19', name: 'HBR Layout', region: 'North', priority: 'low', priorityLabel: 'Low Priority', wsi: 0.27, shape: '150,300 196,306 188,352 144,342' },
  { id: 'D31', name: 'Horamavu', region: 'East', priority: 'low', priorityLabel: 'Low Priority', wsi: 0.28, shape: '212,324 262,336 250,388 200,372' },
  { id: 'D36', name: 'Hennur', region: 'North', priority: 'low', priorityLabel: 'Low Priority', wsi: 0.26, shape: '254,398 300,412 288,454 242,438' },
  { id: 'D37', name: 'Varthur', region: 'East', priority: 'low', priorityLabel: 'Low Priority', wsi: 0.29, shape: '300,412 352,408 342,458 288,454' },
  { id: 'D38', name: 'Begur', region: 'South', priority: 'low', priorityLabel: 'Low Priority', wsi: 0.30, shape: '352,408 408,402 398,452 342,458' },
]

const PRIORITY_COLORS = {
  high: { fill: '#ef4444', stroke: '#ffffff', label: 'High Priority (12)' },
  medium: { fill: '#f59e0b', stroke: '#ffffff', label: 'Medium Priority (18)' },
  low: { fill: '#48bb78', stroke: '#ffffff', label: 'Low Priority (12)' },
}

const PriorityWardMap = ({ onSelectDistrict, onSelectWard }) => {
  const handleSelect = onSelectDistrict || onSelectWard
  const [zoom, setZoom] = useState(1)
  const [selectedDistrict, setSelectedDistrict] = useState(null)

  const handleZoomIn = () => setZoom((z) => Math.min(1.8, +(z + 0.15).toFixed(2)))
  const handleZoomOut = () => setZoom((z) => Math.max(0.85, +(z - 0.15).toFixed(2)))
  const handleResetZoom = () => {
    setZoom(1)
    setSelectedDistrict(null)
  }

  const handleDistrictClick = (district) => {
    setSelectedDistrict(district)
    handleSelect?.(district)
  }

  return (
    <article className="card priority-wards-map" aria-label="Priority Districts Map">
      <div className="priority-wards-map__header">
        <h3 className="priority-wards-map__title">Priority Districts Map</h3>
        <p className="priority-wards-map__subtitle">
          Districts recommended for immediate intervention.
        </p>
      </div>

      <div className="priority-wards-map__canvas" role="region" aria-label="Priority districts map">
        {/* Floating Controls (top-left) */}
        <div className="priority-wards-map__controls" role="toolbar" aria-label="Map navigation controls">
          <button
            type="button"
            className="priority-wards-map__ctrl-btn"
            onClick={handleZoomIn}
            aria-label="Zoom in"
            title="Zoom in"
          >
            <Plus size={16} />
          </button>
          <button
            type="button"
            className="priority-wards-map__ctrl-btn"
            onClick={handleZoomOut}
            aria-label="Zoom out"
            title="Zoom out"
          >
            <Minus size={16} />
          </button>
          <button
            type="button"
            className="priority-wards-map__ctrl-btn"
            onClick={handleResetZoom}
            aria-label="Reset zoom"
            title="Reset map view"
          >
            <Locate size={16} />
          </button>
        </div>

        {/* SVG Interactive Bangalore Map */}
        <div
          className="priority-wards-map__svg-wrapper"
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
            className="priority-wards-map__svg"
            role="img"
            aria-label="Map of Bangalore showing priority districts for immediate intervention"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            {/* Soft map canvas background */}
            <rect x="130" y="20" width="320" height="450" fill="#f1f5f3" />

            {/* Subtle arterial roads behind districts */}
            <g stroke="#ffffff" strokeWidth="2.5" fill="none" opacity="0.9" strokeLinecap="round">
              <path d="M 140 180 Q 280 190 440 175" />
              <path d="M 140 310 Q 280 290 440 315" />
              <path d="M 310 25 Q 320 240 325 465" />
              <path d="M 230 70 Q 240 260 220 420" />
              <path d="M 390 60 Q 380 250 400 440" />
            </g>

            {/* Faint valley stream corridor along East Bangalore */}
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
              <text x="312" y="254" textAnchor="middle" fill="#1f2937" fontWeight="800">CENTRAL BANGALORE</text>
              <text x="402" y="235" textAnchor="middle">EAST BANGALORE</text>
              <text x="315" y="445" textAnchor="middle">SOUTH BANGALORE</text>
            </g>

            {/* 42 District Polygons */}
            <g className="priority-wards-map__polygons">
              {BANGALORE_PRIORITY_DISTRICTS.map((w) => {
                const colorInfo = PRIORITY_COLORS[w.priority] || PRIORITY_COLORS.medium
                const isSelected = selectedDistrict?.id === w.id

                return (
                  <polygon
                    key={w.id}
                    points={w.shape}
                    fill={colorInfo.fill}
                    stroke={isSelected ? '#0f172a' : '#ffffff'}
                    strokeWidth={isSelected ? 2.2 : 1.2}
                    className="priority-wards-map__poly"
                    opacity={isSelected ? 1 : 0.9}
                    onClick={() => handleDistrictClick(w)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${w.name}: ${w.priorityLabel}, WSI ${w.wsi}`}
                    style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                  />
                )
              })}
            </g>

            {/* Selected District Indicator */}
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

        {/* Priority Legend Overlay (bottom-left) */}
        <div className="priority-wards-map__legend" aria-label="Priority districts legend">
          <ul className="priority-wards-map__legend-list">
            <li className="priority-wards-map__legend-item">
              <span className="priority-wards-map__legend-dot priority-wards-map__legend-dot--red" />
              <span>High Priority (12)</span>
            </li>
            <li className="priority-wards-map__legend-item">
              <span className="priority-wards-map__legend-dot priority-wards-map__legend-dot--amber" />
              <span>Medium Priority (18)</span>
            </li>
            <li className="priority-wards-map__legend-item">
              <span className="priority-wards-map__legend-dot priority-wards-map__legend-dot--green" />
              <span>Low Priority (12)</span>
            </li>
          </ul>
        </div>

        {/* Map Scale Bar (bottom-right) */}
        <div className="priority-wards-map__scale" aria-label="Map scale: 0 to 10 kilometers">
          <div className="priority-wards-map__scale-bar" aria-hidden="true" />
          <div className="priority-wards-map__scale-labels" aria-hidden="true">
            <span>0</span>
            <span>5</span>
            <span>10 km</span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default PriorityWardMap
