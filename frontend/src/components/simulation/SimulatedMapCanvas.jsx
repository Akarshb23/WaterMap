import { useState } from 'react'
import { Plus, Minus, Crosshair } from 'lucide-react'

const MAP_LEGEND_ITEMS = [
  { label: 'Low (0 – 0.3)', color: '#34d399' },
  { label: 'Moderate (0.3 – 0.6)', color: '#facc15' },
  { label: 'High (0.6 – 1.0)', color: '#f87171' },
]

/**
 * Contiguous polygon definitions for Bangalore districts cluster.
 * Centered on Central Bangalore with the Bellandur lake valley system running along eastern corridor.
 */
const BANGALORE_DISTRICT_POLYGONS = [
  // North Bangalore (Greens & Yellows)
  { id: 'd1', name: 'Yelahanka', points: '270,180 320,170 345,210 310,240 260,220', baselineRisk: 'low', simRisk: 'low' },
  { id: 'd2', name: 'Hebbal', points: '320,170 380,165 410,205 375,235 345,210', baselineRisk: 'moderate', simRisk: 'low' },
  { id: 'd3', name: 'Thanisandra', points: '380,165 435,175 445,225 410,245 410,205', baselineRisk: 'moderate', simRisk: 'low' },
  { id: 'd4', name: 'Vidyaranyapura', points: '260,220 310,240 300,290 240,280 235,240', baselineRisk: 'low', simRisk: 'low' },
  { id: 'd5', name: 'Kodigehalli', points: '310,240 375,235 370,285 300,290', baselineRisk: 'moderate', simRisk: 'low' },
  { id: 'd6', name: 'Peenya', points: '375,235 410,245 425,290 370,285', baselineRisk: 'moderate', simRisk: 'low' },

  // West & Central Bangalore (Yellows, Oranges & Reds)
  { id: 'd7', name: 'Rajajinagar', points: '240,280 300,290 290,340 220,330', baselineRisk: 'low', simRisk: 'low' },
  { id: 'd8', name: 'Malleshwaram', points: '300,290 370,285 360,335 290,340', baselineRisk: 'moderate', simRisk: 'low' },
  { id: 'd9', name: 'Vijayanagar', points: '370,285 425,290 420,335 360,335', baselineRisk: 'moderate', simRisk: 'moderate' },
  { id: 'd10', name: 'Kengeri', points: '220,330 290,340 280,390 205,380', baselineRisk: 'low', simRisk: 'low' },
  { id: 'd11', name: 'Yeshwanthpur', points: '290,340 360,335 350,385 280,390', baselineRisk: 'moderate', simRisk: 'low' },

  // KORAMANGALA (Target Area - Central Core along lake corridor)
  { id: 'district-12', name: 'Koramangala', points: '360,335 420,335 440,365 415,395 350,385', baselineRisk: 'high', simRisk: 'simulated-target', isTarget: true },

  // Central Core High Risk Districts (Surrounding Koramangala)
  { id: 'd13', name: 'Indiranagar', points: '420,335 455,330 475,370 440,365', baselineRisk: 'high', simRisk: 'high' },
  { id: 'd14', name: 'Shanthi Nagar', points: '415,395 440,365 475,370 470,415 410,430', baselineRisk: 'high', simRisk: 'high' },
  { id: 'd15', name: 'Domlur', points: '350,385 415,395 410,430 360,435', baselineRisk: 'high', simRisk: 'moderate' },
  { id: 'd16', name: 'Ulsoor', points: '280,390 350,385 360,435 300,445', baselineRisk: 'moderate', simRisk: 'low' },
  { id: 'd17', name: 'Basavanagudi', points: '205,380 280,390 300,445 230,440', baselineRisk: 'low', simRisk: 'low' },

  // East Bangalore (Across the Bellandur Lake Valley)
  { id: 'd18', name: 'Whitefield', points: '495,300 550,290 565,340 510,350', baselineRisk: 'moderate', simRisk: 'low' },
  { id: 'd19', name: 'Bellandur', points: '510,350 565,340 580,390 520,405', baselineRisk: 'high', simRisk: 'moderate' },
  { id: 'd20', name: 'Varthur', points: '520,405 580,390 570,450 510,455', baselineRisk: 'moderate', simRisk: 'low' },

  // South Bangalore (Lush Low-Risk Greens)
  { id: 'd21', name: 'Electronic City', points: '230,440 300,445 290,500 215,490', baselineRisk: 'low', simRisk: 'low' },
  { id: 'd22', name: 'HSR Layout', points: '300,445 360,435 350,495 290,500', baselineRisk: 'low', simRisk: 'low' },
  { id: 'd23', name: 'BTM Layout', points: '360,435 410,430 405,490 350,495', baselineRisk: 'moderate', simRisk: 'low' },
  { id: 'd24', name: 'Jayanagar', points: '410,430 470,415 460,480 405,490', baselineRisk: 'high', simRisk: 'moderate' },
  { id: 'd25', name: 'JP Nagar', points: '290,500 350,495 340,555 275,545', baselineRisk: 'low', simRisk: 'low' },
  { id: 'd26', name: 'Banashankari', points: '350,495 405,490 395,550 340,555', baselineRisk: 'low', simRisk: 'low' },
  { id: 'd27', name: 'Padmanabhanagar', points: '405,490 460,480 445,540 395,550', baselineRisk: 'low', simRisk: 'low' },
  { id: 'd28', name: 'Bommanahalli', points: '340,555 395,550 380,610 320,600', baselineRisk: 'low', simRisk: 'low' },
]

const RISK_COLOR_MAP = {
  low: '#4ade80',              // Crisp mint green
  moderate: '#fbbf24',         // Warm amber
  high: '#ef4444',             // Vivid coral red
  'simulated-target': '#f97316' // Orange / improved moderate-high
}

/**
 * Simulated Water Stress Map (2030) component.
 * Exact replication of reference mockup.
 */
const SimulatedMapCanvas = ({
  areaLabel = 'Koramangala',
  currentWsi = 0.82,
  simulatedWsi = 0.46,
  reductionPct = 44,
  horizon = '2030',
}) => {
  const [mode, setMode] = useState('simulated')
  const [zoomLevel, setZoomLevel] = useState(1)

  const handleZoomIn = () => setZoomLevel((z) => Math.min(1.8, Number((z + 0.15).toFixed(2))))
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.85, Number((z - 0.15).toFixed(2))))
  const handleReset = () => setZoomLevel(1)

  return (
    <section className="card sim-map" aria-labelledby="sim-map-title">
      <div
        className="card__header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '8px 12px',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h2 className="card__title" id="sim-map-title" style={{ fontSize: '0.96rem', margin: 0 }}>
            Simulated Water Stress Map ({horizon})
          </h2>
          <p className="card__subtitle" style={{ margin: '2px 0 0 0' }}>
            Compare projected water stress index under different scenarios.
          </p>
        </div>

        {/* Current vs Simulated Toggle */}
        <div className="sim-map__toggle" role="group" aria-label="Map view mode" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
          <button
            type="button"
            className={`sim-map__toggle-btn${mode === 'current' ? ' sim-map__toggle-btn--active' : ''}`}
            onClick={() => setMode('current')}
          >
            Current (2024)
          </button>
          <button
            type="button"
            className={`sim-map__toggle-btn${mode === 'simulated' ? ' sim-map__toggle-btn--active' : ''}`}
            onClick={() => setMode('simulated')}
          >
            Simulated ({horizon})
          </button>
        </div>
      </div>

      <div className="sim-map-canvas" style={{ position: 'relative', width: '100%', height: '415px', overflow: 'hidden', backgroundColor: '#eef5f3' }}>
        {/* Zoom & Navigation Controls (top-left) */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 14,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            borderRadius: 6,
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}
        >
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom in"
            style={{ width: 30, height: 30, border: 'none', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #f1f5f9' }}
          >
            <Plus size={15} color="#475569" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom out"
            style={{ width: 30, height: 30, border: 'none', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #f1f5f9' }}
          >
            <Minus size={15} color="#475569" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            title="Center map"
            style={{ width: 30, height: 30, border: 'none', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Crosshair size={14} color="#475569" />
          </button>
        </div>

        {/* SVG Map Canvas */}
        <svg
          viewBox="0 0 700 680"
          style={{
            width: '100%',
            height: '100%',
            transform: `scale(${zoomLevel})`,
            transformOrigin: '50% 50%',
            transition: 'transform 0.2s ease',
          }}
        >
          <defs>
            {/* Grid pattern representing city streets */}
            <pattern id="streetGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill="#f4f7f4" />
              <line x1="0" y1="0" x2="40" y2="0" stroke="#e6ede6" strokeWidth="1.2" />
              <line x1="0" y1="0" x2="0" y2="40" stroke="#e6ede6" strokeWidth="1.2" />
              <line x1="20" y1="0" x2="20" y2="40" stroke="#edf3ed" strokeWidth="0.8" />
              <line x1="0" y1="20" x2="40" y2="20" stroke="#edf3ed" strokeWidth="0.8" />
            </pattern>
            {/* Soft valley gradient */}
            <linearGradient id="valleyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>

          {/* Background Map Tiles / Grid */}
          <rect width="700" height="680" fill="url(#streetGrid)" />

          {/* Road Network Overlays */}
          <g stroke="#ffffff" strokeWidth="3" opacity="0.9" fill="none">
            <path d="M-20,150 Q200,120 400,140 T720,130" />
            <path d="M-20,270 Q250,260 500,280 T720,290" />
            <path d="M-20,440 Q300,430 550,460 T720,450" />
            <path d="M180,-20 Q160,250 190,500 T210,700" strokeWidth="4" />
            <path d="M350,-20 Q330,300 370,550 T390,700" strokeWidth="4" />
            <path d="M530,-20 Q500,200 520,500 T510,700" strokeWidth="3" />
          </g>

          {/* Bellandur / Vrishabhavathi Lake Valley System (Flowing North to South-East) */}
          <path
            d="M450,-30 C430,90 495,170 470,260 S495,350 480,440 S530,550 540,710 L575,710 C565,550 525,440 535,350 S505,260 540,170 S475,90 495,-30 Z"
            fill="url(#valleyGradient)"
            opacity="0.95"
          />
          <path
            d="M472,-30 C452,90 517,170 492,260 S517,350 502,440 S552,550 562,710"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            opacity="0.6"
          />

          {/* Contiguous District Polygons */}
          <g stroke="#ffffff" strokeWidth="1.8" strokeLinejoin="round">
            {BANGALORE_DISTRICT_POLYGONS.map((district) => {
              const risk = mode === 'simulated' ? district.simRisk : district.baselineRisk
              const fillColor = RISK_COLOR_MAP[risk] || '#fbbf24'
              return (
                <polygon
                  key={district.id}
                  points={district.points}
                  fill={fillColor}
                  opacity="0.88"
                  style={{
                    transition: 'fill 0.3s ease, opacity 0.2s ease',
                  }}
                />
              )
            })}
          </g>

          {/* Regional Text Labels */}
          <g fill="#475569" fontSize="13" fontWeight="800" letterSpacing="1.5" opacity="0.75" pointerEvents="none">
            <text x="340" y="145" textAnchor="middle">NORTH BANGALORE</text>
            <text x="210" y="325" textAnchor="middle">WEST BANGALORE</text>
            <text x="340" y="315" textAnchor="middle">CENTRAL BANGALORE</text>
            <text x="590" y="320" textAnchor="middle">EAST BANGALORE</text>
            <text x="365" y="475" textAnchor="middle">SOUTH BANGALORE</text>
          </g>

          {/* Target Pinpoint on Koramangala (Coordinates at x=395, y=360) */}
          <g>
            {/* Outer Target Circle */}
            <circle cx="395" cy="360" r="7.5" fill="#0f172a" stroke="#ffffff" strokeWidth="2.5" />
            <circle cx="395" cy="360" r="3" fill="#ffffff" />

            {/* Tooltip Callout Box */}
            <g>
              {/* Pointer Triangle connecting to pin */}
              <polygon points="405,338 395,360 422,338" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              {/* Tooltip Card Rect */}
              <rect
                x="405"
                y="298"
                width="142"
                height="46"
                rx="6"
                fill="#ffffff"
                stroke="#cbd5e1"
                strokeWidth="1"
                filter="drop-shadow(0 4px 10px rgba(0,0,0,0.12))"
              />
              {/* Tooltip Content */}
              <text x="418" y="316" fill="#0f172a" fontSize="12" fontWeight="700">
                {areaLabel}
              </text>
              <text x="418" y="333" fill="#334155" fontSize="11" fontWeight="600">
                WSI:{' '}
                {mode === 'simulated' ? (
                  <>
                    <tspan fill="#0f172a">{Number(simulatedWsi).toFixed(2)} </tspan>
                    <tspan fill="#10b981" fontWeight="700">(↓ {reductionPct}%)</tspan>
                  </>
                ) : (
                  <tspan fill="#ef4444" fontWeight="700">{Number(currentWsi).toFixed(2)}</tspan>
                )}
              </text>
            </g>
          </g>
        </svg>

        {/* Floating Legend (Bottom-Left) */}
        <div
          style={{
            position: 'absolute',
            bottom: 14,
            left: 14,
            zIndex: 10,
            backgroundColor: '#ffffff',
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
            Water Stress Index
          </div>
          {MAP_LEGEND_ITEMS.map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '2px 0' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.color }} />
              <span style={{ fontSize: '10.5px', color: '#475569' }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Floating Distance Scale (Bottom-Right) */}
        <div
          style={{
            position: 'absolute',
            bottom: 14,
            right: 14,
            zIndex: 10,
            backgroundColor: '#ffffff',
            padding: '6px 10px',
            borderRadius: 4,
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ display: 'flex', width: 90, height: 4, border: '1px solid #94a3b8', borderRadius: 1, overflow: 'hidden' }}>
            <div style={{ flex: 1, backgroundColor: '#0f172a' }} />
            <div style={{ flex: 1, backgroundColor: '#ffffff' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#64748b', marginTop: 2 }}>
            <span>0</span>
            <span>5</span>
            <span>10 km</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SimulatedMapCanvas