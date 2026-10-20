import { useState } from 'react'
import { AlertTriangle, Locate, Maximize2, Minus, Plus } from 'lucide-react'

// Ward polygon definitions covering Delhi's sectors with realistic geometry
const DELHI_WARDS = [
  // North Delhi (Mostly Low/Moderate)
  { id: 'W01', name: 'Ward 1 (Narela)', region: 'North', risk: 'low', wsi: 0.28, trend: '+8%', shape: '310,40 360,35 390,70 350,95 300,75' },
  { id: 'W02', name: 'Ward 2 (Alipur)', region: 'North', risk: 'low', wsi: 0.25, trend: '+6%', shape: '360,35 410,45 425,85 390,70' },
  { id: 'W03', name: 'Ward 3 (Bawana)', region: 'North', risk: 'moderate', wsi: 0.42, trend: '+14%', shape: '260,70 310,40 300,75 270,110' },
  { id: 'W04', name: 'Ward 4 (Rohini N)', region: 'North', risk: 'low', wsi: 0.29, trend: '+11%', shape: '300,75 350,95 340,140 280,125' },
  { id: 'W05', name: 'Ward 5 (Burari)', region: 'North', risk: 'low', wsi: 0.30, trend: '+9%', shape: '350,95 390,70 425,85 415,135 370,145' },
  { id: 'W06', name: 'Ward 6 (Rohini S)', region: 'North', risk: 'moderate', wsi: 0.48, trend: '+15%', shape: '280,125 340,140 330,185 270,170' },
  { id: 'W07', name: 'Ward 7 (Adarsh Nagar)', region: 'North', risk: 'moderate', wsi: 0.52, trend: '+18%', shape: '340,140 370,145 385,190 330,185' },
  { id: 'W08', name: 'Ward 8 (Civil Lines)', region: 'North', risk: 'moderate', wsi: 0.55, trend: '+17%', shape: '370,145 415,135 425,185 385,190' },

  // West Delhi (Moderate to High)
  { id: 'W09', name: 'Ward 9 (Paschim Vihar)', region: 'West', risk: 'low', wsi: 0.29, trend: '+10%', shape: '220,150 270,170 260,220 205,195' },
  { id: 'W10', name: 'Ward 10 (Punjabi Bagh)', region: 'West', risk: 'moderate', wsi: 0.49, trend: '+16%', shape: '270,170 330,185 320,230 260,220' },
  { id: 'W11', name: 'Ward 11 (Rajouri Garden)', region: 'West', risk: 'moderate', wsi: 0.58, trend: '+20%', shape: '260,220 320,230 310,275 250,265' },
  { id: 'W12', name: 'Ward 12', region: 'Central', risk: 'high', wsi: 0.82, trend: '+24%', shape: '320,230 375,225 380,270 335,280 310,275' },
  { id: 'W13', name: 'Ward 13 (Karol Bagh)', region: 'Central', risk: 'high', wsi: 0.78, trend: '+22%', shape: '330,185 385,190 395,230 375,225 320,230' },
  { id: 'W14', name: 'Ward 14 (Pahar Ganj)', region: 'Central', risk: 'high', wsi: 0.85, trend: '+26%', shape: '375,225 415,220 420,265 380,270' },
  { id: 'W15', name: 'Ward 15 (Chandni Chowk)', region: 'Central', risk: 'high', wsi: 0.88, trend: '+28%', shape: '385,190 425,185 435,225 415,220 375,225' },
  { id: 'W16', name: 'Ward 16 (Janakpuri)', region: 'West', risk: 'low', wsi: 0.28, trend: '+8%', shape: '205,195 260,220 250,265 195,245' },
  { id: 'W17', name: 'Ward 17 (Tilak Nagar)', region: 'West', risk: 'moderate', wsi: 0.54, trend: '+18%', shape: '250,265 310,275 300,320 240,310' },
  { id: 'W18', name: 'Ward 18 (Dwarka N)', region: 'West', risk: 'low', wsi: 0.26, trend: '+6%', shape: '195,245 250,265 240,310 180,290' },
  { id: 'W19', name: 'Ward 19 (Dwarka S)', region: 'West', risk: 'low', wsi: 0.27, trend: '+7%', shape: '180,290 240,310 230,360 170,335' },

  // East Delhi (Across Yamuna - High / Moderate)
  { id: 'W20', name: 'Ward 20 (Shahdara N)', region: 'East', risk: 'high', wsi: 0.79, trend: '+21%', shape: '445,160 495,155 510,195 460,205' },
  { id: 'W21', name: 'Ward 21 (Shahdara S)', region: 'East', risk: 'high', wsi: 0.81, trend: '+23%', shape: '460,205 510,195 520,245 470,250' },
  { id: 'W22', name: 'Ward 22 (Laxmi Nagar)', region: 'East', risk: 'high', wsi: 0.86, trend: '+27%', shape: '435,225 470,250 460,295 425,275' },
  { id: 'W23', name: 'Ward 23 (Mayur Vihar)', region: 'East', risk: 'moderate', wsi: 0.59, trend: '+19%', shape: '460,295 515,290 520,345 465,340' },
  { id: 'W24', name: 'Ward 24 (Patparganj)', region: 'East', risk: 'moderate', wsi: 0.56, trend: '+16%', shape: '470,250 520,245 515,290 460,295' },

  // Central / South Transition
  { id: 'W25', name: 'Ward 25 (Connaught Place)', region: 'Central', risk: 'high', wsi: 0.83, trend: '+25%', shape: '335,280 380,270 385,320 330,325' },
  { id: 'W26', name: 'Ward 26 (India Gate)', region: 'Central', risk: 'high', wsi: 0.77, trend: '+22%', shape: '380,270 425,275 420,325 385,320' },
  { id: 'W27', name: 'Ward 27 (Delhi Cantt)', region: 'South', risk: 'moderate', wsi: 0.45, trend: '+13%', shape: '240,310 300,320 290,375 230,360' },
  { id: 'W28', name: 'Ward 28 (Chanakyapuri)', region: 'South', risk: 'moderate', wsi: 0.51, trend: '+15%', shape: '300,320 345,325 340,380 290,375' },
  { id: 'W29', name: 'Ward 29 (Lajpat Nagar)', region: 'South', risk: 'high', wsi: 0.76, trend: '+23%', shape: '345,325 390,325 395,385 340,380' },
  { id: 'W30', name: 'Ward 30 (Defence Colony)', region: 'South', risk: 'moderate', wsi: 0.57, trend: '+17%', shape: '390,325 435,325 430,385 395,385' },

  // South Delhi
  { id: 'W31', name: 'Ward 31 (Vasant Kunj)', region: 'South', risk: 'low', wsi: 0.28, trend: '+9%', shape: '230,360 290,375 280,430 215,410' },
  { id: 'W32', name: 'Ward 32 (Hauz Khas)', region: 'South', risk: 'moderate', wsi: 0.49, trend: '+14%', shape: '290,375 340,380 335,440 280,430' },
  { id: 'W33', name: 'Ward 33 (Saket)', region: 'South', risk: 'moderate', wsi: 0.53, trend: '+16%', shape: '340,380 395,385 390,445 335,440' },
  { id: 'W34', name: 'Ward 34 (Greater Kailash)', region: 'South', risk: 'moderate', wsi: 0.58, trend: '+18%', shape: '395,385 440,385 435,445 390,445' },
  { id: 'W35', name: 'Ward 35 (Kalkaji)', region: 'South', risk: 'moderate', wsi: 0.52, trend: '+15%', shape: '440,385 480,385 475,440 435,445' },
  { id: 'W36', name: 'Ward 36 (Mehrauli)', region: 'South', risk: 'low', wsi: 0.26, trend: '+7%', shape: '280,430 335,440 325,490 270,475' },
  { id: 'W37', name: 'Ward 37 (Sangam Vihar)', region: 'South', risk: 'low', wsi: 0.29, trend: '+10%', shape: '335,440 390,445 385,495 325,490' },
  { id: 'W38', name: 'Ward 38 (Badarpur)', region: 'South', risk: 'low', wsi: 0.30, trend: '+11%', shape: '390,445 445,445 435,495 385,495' },
]

const RISK_COLORS = {
  low: { fill: '#48bb78', stroke: '#38a169', text: 'Low (0 – 0.3)' },
  moderate: { fill: '#f6ad55', stroke: '#dd6b20', text: 'Moderate (0.3 – 0.6)' },
  high: { fill: '#f56565', stroke: '#e53e3e', text: 'High (0.6 – 1.0)' },
}

const PredictedWaterStressMap = () => {
  const [selectedYear, setSelectedYear] = useState('2030')
  const [selectedWard, setSelectedWard] = useState(
    DELHI_WARDS.find((w) => w.id === 'W12') || DELHI_WARDS[11]
  )
  const [zoom, setZoom] = useState(1)

  const handleZoomIn = () => setZoom((z) => Math.min(1.8, +(z + 0.15).toFixed(2)))
  const handleZoomOut = () => setZoom((z) => Math.max(0.85, +(z - 0.15).toFixed(2)))
  const handleResetZoom = () => {
    setZoom(1)
    const w12 = DELHI_WARDS.find((w) => w.id === 'W12')
    if (w12) setSelectedWard(w12)
  }

  return (
    <section className="card pred-map-card" aria-label="Predicted Water Stress Map">
      <div className="card__header pred-map-card__header">
        <div>
          <h2 className="card__title">Predicted Water Stress Map ({selectedYear})</h2>
          <p className="card__subtitle">
            Ward-level forecast of water stress index based on current trends.
          </p>
        </div>
        <div className="pred-map-card__actions">
          <select
            className="native-select pred-year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            aria-label="Select forecast year"
          >
            <option value="2026">Year: 2026</option>
            <option value="2028">Year: 2028</option>
            <option value="2030">Year: 2030</option>
            <option value="2035">Year: 2035</option>
          </select>

          <button
            type="button"
            className="icon-btn pred-map-expand-btn"
            aria-label="Expand map"
            title="Toggle fullscreen"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      <div className="pred-map-viewport">
        {/* Map Controls */}
        <div className="pred-map-controls" role="toolbar" aria-label="Map controls">
          <button
            type="button"
            className="pred-map-ctrl-btn"
            onClick={handleZoomIn}
            aria-label="Zoom in"
            title="Zoom in"
          >
            <Plus size={16} />
          </button>
          <button
            type="button"
            className="pred-map-ctrl-btn"
            onClick={handleZoomOut}
            aria-label="Zoom out"
            title="Zoom out"
          >
            <Minus size={16} />
          </button>
          <button
            type="button"
            className="pred-map-ctrl-btn"
            onClick={handleResetZoom}
            aria-label="Recenter map"
            title="Center on Ward 12"
          >
            <Locate size={16} />
          </button>
        </div>

        {/* SVG Interactive Map */}
        <div
          className="pred-map-svg-container"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          <svg
            viewBox="140 10 440 510"
            className="pred-map-svg"
            role="img"
            aria-label="Map of Delhi showing ward-level predicted water stress"
          >
            <defs>
              {/* Subtle road / city block grid texture */}
              <pattern id="city-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path
                  d="M 24 0 L 0 0 0 24"
                  fill="none"
                  stroke="rgba(180, 205, 215, 0.35)"
                  strokeWidth="0.8"
                />
              </pattern>

              {/* Yamuna River Gradient */}
              <linearGradient id="yamuna-water" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#93c5fd" />
                <stop offset="50%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>

              {/* Red marker glow filter */}
              <filter id="marker-shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.25)" />
              </filter>
            </defs>

            {/* Background base */}
            <rect x="140" y="10" width="440" height="510" fill="#eaf3f5" />
            <rect x="140" y="10" width="440" height="510" fill="url(#city-grid)" opacity="0.7" />

            {/* Major Arterial Roads (subtle white tracks) */}
            <g stroke="#ffffff" strokeWidth="3" fill="none" opacity="0.85" strokeLinecap="round">
              <path d="M 150 180 Q 280 200 420 180 T 560 210" />
              <path d="M 160 300 Q 300 280 430 310 T 560 330" />
              <path d="M 330 30 Q 340 250 350 490" />
              <path d="M 230 100 Q 250 300 240 450" />
              <path d="M 430 80 Q 420 280 440 470" />
            </g>

            {/* Yamuna River (Flows North to South-East) */}
            <path
              d="M 410 10 Q 425 90 415 150 T 435 240 T 425 330 Q 450 420 530 510 L 550 510 Q 470 410 445 320 T 455 230 T 435 140 Q 445 80 430 10 Z"
              fill="url(#yamuna-water)"
              opacity="0.95"
            />
            {/* River shimmer highlights */}
            <path
              d="M 420 20 Q 435 95 425 155 T 445 245 T 435 335 Q 460 425 540 510"
              fill="none"
              stroke="#dbeafe"
              strokeWidth="2.5"
              strokeDasharray="12 8"
              opacity="0.75"
            />

            {/* Regional Name Labels */}
            <g fill="#718096" fontSize="11" fontWeight="700" letterSpacing="0.8">
              <text x="310" y="65" textAnchor="middle">NORTH DELHI</text>
              <text x="220" y="220" textAnchor="middle">WEST DELHI</text>
              <text x="345" y="270" textAnchor="middle">CENTRAL DELHI</text>
              <text x="495" y="255" textAnchor="middle">EAST DELHI</text>
              <text x="360" y="440" textAnchor="middle">SOUTH DELHI</text>
            </g>

            {/* Ward Polygons */}
            <g className="pred-map-wards-group">
              {DELHI_WARDS.map((w) => {
                const colorInfo = RISK_COLORS[w.risk] || RISK_COLORS.moderate
                const isSelected = selectedWard?.id === w.id

                return (
                  <polygon
                    key={w.id}
                    points={w.shape}
                    fill={colorInfo.fill}
                    stroke={isSelected ? '#1e293b' : '#ffffff'}
                    strokeWidth={isSelected ? 2.5 : 1.2}
                    className="pred-map-polygon"
                    opacity={isSelected ? 1 : 0.88}
                    onClick={() => setSelectedWard(w)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${w.name}: WSI ${w.wsi}, ${w.risk} risk`}
                  />
                )
              })}
            </g>

            {/* Selected Ward 12 Pin & Tooltip */}
            {selectedWard && (
              <g className="pred-map-callout-group">
                {/* Pin Target on Ward center approx 345, 252 */}
                <circle cx="348" cy="252" r="7" fill="#dc2626" filter="url(#marker-shadow)" />
                <circle cx="348" cy="252" r="3.5" fill="#ffffff" />
                <line
                  x1="348"
                  y1="245"
                  x2="400"
                  y2="200"
                  stroke="#1e293b"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />

                {/* ForeignObject / SVG Card for the Callout */}
                <foreignObject x="390" y="140" width="165" height="110">
                  <div className="pred-ward-tooltip">
                    <div className="pred-ward-tooltip__header">
                      <strong>{selectedWard.name}</strong>
                    </div>
                    <div className="pred-ward-tooltip__wsi">
                      Predicted WSI: <span>{selectedWard.wsi.toFixed(2)}</span>
                    </div>
                    <div className="pred-ward-tooltip__badge">
                      <AlertTriangle size={12} />
                      <span>High Risk (2030)</span>
                    </div>
                    <div className="pred-ward-tooltip__trend">
                      <span>↑ {selectedWard.trend} vs 2024</span>
                    </div>
                  </div>
                </foreignObject>
              </g>
            )}
          </svg>
        </div>

        {/* Bottom Left Legend */}
        <div className="pred-map-legend-card" aria-label="Predicted Water Stress Index Legend">
          <span className="pred-map-legend-card__title">Predicted Water Stress Index</span>
          <div className="pred-map-legend-card__items">
            <div className="pred-map-legend-card__item">
              <span className="pred-legend-dot pred-legend-dot--low" />
              <span>Low (0 – 0.3)</span>
            </div>
            <div className="pred-map-legend-card__item">
              <span className="pred-legend-dot pred-legend-dot--mod" />
              <span>Moderate (0.3 – 0.6)</span>
            </div>
            <div className="pred-map-legend-card__item">
              <span className="pred-legend-dot pred-legend-dot--high" />
              <span>High (0.6 – 1.0)</span>
            </div>
          </div>
        </div>

        {/* Bottom Right Scale */}
        <div className="pred-map-scale-bar" aria-label="Scale: 0 to 10 kilometers">
          <div className="pred-map-scale-segments">
            <span className="pred-map-scale-seg pred-map-scale-seg--dark" />
            <span className="pred-map-scale-seg pred-map-scale-seg--light" />
          </div>
          <div className="pred-map-scale-labels">
            <span>0</span>
            <span>5</span>
            <span>10 km</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PredictedWaterStressMap
