import { useId } from 'react'
import { isApiMode } from '../../services/apiClient.js'
import LeafletWardMap from './LeafletWardMap.jsx'
import { MAP_DISTRICTS } from '../../data/demoData.js'

/**
 * Reusable illustrated Bangalore district-risk map.
 * This remains a front-end demonstration layer; real district GeoJSON can replace
 * it later without changing the map toolbars, legends, markers, or API hooks.
 */
import {
  BANGALORE_DASHBOARD_REGIONS,
  BANGALORE_DASHBOARD_DISTRICTS,
} from '../../data/bangaloreDashboardData.js'

/**
 * Reusable Bangalore district-risk map matching the City Map standard.
 * Renders the authentic 42-district layout, roads, parks, and lake corridor.
 */
const WardRiskIllustration = ({
  variant = 'city',
  satellite = false,
  wards,
  zoom = 1,
  showBoundaries = true,
  selectedWardId = null,
  onWardSelect,
  riskMode = 'baseline',
}) => {
  if (isApiMode()) {
    return (
      <LeafletWardMap
        wards={wards ?? []}
        showAllWhenEmpty={!Array.isArray(wards)}
        selectedWardId={selectedWardId}
        onWardSelect={onWardSelect}
        satellite={satellite}
        showBoundaries={showBoundaries}
        riskMode={variant === 'prediction' ? 'prediction' : riskMode}
        className={`ward-risk-illustration ward-risk-illustration--${variant}`}
      />
    )
  }

  const activeId = selectedWardId || 'district-12'
  const activeDistrict =
    BANGALORE_DASHBOARD_DISTRICTS.find((d) => d.id === activeId || d.legacyId === activeId) ||
    BANGALORE_DASHBOARD_DISTRICTS[0]

  return (
    <div
      className={`ward-risk-illustration ward-risk-illustration--${variant}${satellite ? ' ward-risk-illustration--satellite' : ''}${onWardSelect ? ' ward-risk-illustration--interactive' : ''}`}
      style={{ '--ward-map-zoom': zoom }}
      aria-hidden={onWardSelect ? undefined : true}
      role={onWardSelect ? 'group' : undefined}
      aria-label={onWardSelect ? 'District risk map. Select a district to inspect its details.' : undefined}
    >
      <svg
        viewBox="120 20 340 450"
        preserveAspectRatio="xMidYMid meet"
        role="presentation"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        {/* 1. Basemap Canvas */}
        <rect
          x="120"
          y="20"
          width="340"
          height="450"
          fill={satellite ? '#1e293b' : '#f2f6f4'}
        />

        {/* 2. Soft Green Parks */}
        {!satellite && (
          <g fill="#dcefdc" opacity="0.85">
            <path d="M 230 45 Q 255 75 260 115 Q 240 125 220 85 Z" />
            <path d="M 205 195 Q 235 205 245 245 Q 220 265 200 235 Z" />
            <path d="M 225 375 Q 260 385 275 435 Q 235 455 215 415 Z" />
            <path d="M 335 30 Q 360 85 355 135 Q 370 195 380 245 Q 370 245 355 175 Q 345 115 330 45 Z" fill="#d8edd9" />
            <path d="M 415 125 Q 445 145 435 185 Q 405 175 415 125 Z" />
            <path d="M 395 355 Q 435 375 425 415 Q 385 395 395 355 Z" />
          </g>
        )}

        {/* 3. Secondary Street Network */}
        <g
          stroke={satellite ? '#334155' : '#ffffff'}
          strokeWidth="1.6"
          fill="none"
          opacity={satellite ? 0.6 : 0.9}
          strokeLinecap="round"
        >
          <path d="M 125 70 Q 280 65 455 75" />
          <path d="M 125 110 Q 280 115 455 105" />
          <path d="M 125 150 Q 280 155 455 145" />
          <path d="M 125 210 Q 280 215 455 205" />
          <path d="M 125 260 Q 280 255 455 265" />
          <path d="M 125 310 Q 280 305 455 315" />
          <path d="M 125 355 Q 280 360 455 350" />
          <path d="M 125 400 Q 280 395 455 405" />
          <path d="M 125 440 Q 280 445 455 435" />

          <path d="M 155 25 Q 160 235 150 465" />
          <path d="M 195 25 Q 200 235 190 465" />
          <path d="M 235 25 Q 240 235 230 465" />
          <path d="M 275 25 Q 270 235 275 465" />
          <path d="M 315 25 Q 320 235 315 465" />
          <path d="M 355 25 Q 360 235 355 465" />
          <path d="M 395 25 Q 390 235 395 465" />
          <path d="M 435 25 Q 440 235 435 465" />
        </g>

        {/* 4. Primary Arterials & Expressways */}
        <g fill="none" strokeLinecap="round">
          <g stroke={satellite ? '#1e293b' : '#d6e2db'} strokeWidth="4.6" opacity="0.8">
            <ellipse cx="270" cy="230" rx="120" ry="142" />
            <ellipse cx="282" cy="225" rx="74" ry="80" />
            <path d="M 125 180 Q 280 190 455 175" />
            <path d="M 125 315 Q 280 290 455 320" />
            <path d="M 305 25 Q 315 240 320 465" />
            <path d="M 215 65 Q 235 260 210 425" />
            <path d="M 395 55 Q 380 250 410 445" />
          </g>
          <g stroke={satellite ? '#475569' : '#ffffff'} strokeWidth="3.2">
            <ellipse cx="270" cy="230" rx="120" ry="142" />
            <ellipse cx="282" cy="225" rx="74" ry="80" />
            <path d="M 125 180 Q 280 190 455 175" />
            <path d="M 125 315 Q 280 290 455 320" />
            <path d="M 305 25 Q 315 240 320 465" />
            <path d="M 215 65 Q 235 260 210 425" />
            <path d="M 395 55 Q 380 250 410 445" />
          </g>
        </g>

        {/* 5. Valley Stream Ribbon with Crossings */}
        <g fill="none">
          <path
            d="M 342 20 Q 365 110 360 160 Q 375 215 382 280 Q 408 360 440 465"
            stroke={satellite ? '#1e3a8a' : '#90cdf4'}
            strokeWidth="14"
            opacity="0.92"
            strokeLinecap="round"
          />
          <path
            d="M 342 20 Q 365 110 360 160 Q 375 215 382 280 Q 408 360 440 465"
            stroke={satellite ? '#2563eb' : '#63b3ed'}
            strokeWidth="5"
            opacity="0.9"
            strokeLinecap="round"
          />
          <g stroke="#ffffff" strokeWidth="2.5" strokeDasharray="3 2" opacity="0.95">
            <line x1="350" y1="105" x2="368" y2="108" />
            <line x1="352" y1="160" x2="370" y2="162" />
            <line x1="365" y1="215" x2="385" y2="218" />
            <line x1="375" y1="275" x2="395" y2="278" />
            <line x1="395" y1="345" x2="415" y2="348" />
            <line x1="420" y1="415" x2="442" y2="418" />
          </g>
        </g>

        {/* 6. Regional Geographic Labels */}
        <g
          fill={satellite ? '#cbd5e1' : '#4b5563'}
          fontSize="8.5"
          fontWeight="700"
          letterSpacing="1.1"
          opacity="0.75"
          pointerEvents="none"
        >
          {BANGALORE_DASHBOARD_REGIONS.map((r) => (
            <text key={r.id} x={r.x} y={r.y} textAnchor="middle">
              {r.label}
            </text>
          ))}
        </g>

        {/* 7. 42 Seamless Interlocking District Polygons */}
        <g strokeLinejoin="round">
          {BANGALORE_DASHBOARD_DISTRICTS.map((district) => {
            const isSelected = String(district.id) === String(activeDistrict?.id)
            let fillColor = district.fill
            if (riskMode === 'simulation' && district.risk === 'high') {
              fillColor = '#34d399'
            }

            return (
              <polygon
                key={district.id}
                points={district.shape}
                fill={fillColor}
                stroke={isSelected ? '#ffffff' : showBoundaries ? '#ffffff' : 'none'}
                strokeWidth={isSelected ? 2.5 : showBoundaries ? 1.2 : 0}
                strokeDasharray={isSelected ? '4 3' : 'none'}
                opacity={satellite ? 0.82 : (isSelected ? 1 : 0.9)}
                onClick={onWardSelect ? () => onWardSelect(district) : undefined}
                role={onWardSelect ? 'button' : undefined}
                tabIndex={onWardSelect ? 0 : undefined}
                aria-label={`${district.name}: ${district.riskLabel}`}
                style={{ cursor: onWardSelect ? 'pointer' : 'default', transition: 'all 0.15s ease' }}
              />
            )
          })}
        </g>

        {/* 8. Active District Pin */}
        {activeDistrict && (
          <g
            transform={`translate(${activeDistrict.center[0]}, ${activeDistrict.center[1]})`}
            pointerEvents="none"
          >
            <circle r="9" fill="none" stroke="#ffffff" strokeWidth="2.8" opacity="0.95" />
            <circle r="6" fill="#0f172a" />
            <circle r="3.2" fill="#ffffff" />
            <circle r="1.6" fill="#0f172a" />
          </g>
        )}
      </svg>
    </div>
  )
}

export default WardRiskIllustration
