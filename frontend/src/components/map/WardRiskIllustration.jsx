import { useId } from 'react'
import { isApiMode } from '../../services/apiClient.js'
import LeafletWardMap from './LeafletWardMap.jsx'
import { MAP_WARDS } from '../../data/demoData.js'

/**
 * Reusable illustrated New Delhi ward-risk map.
 * This remains a front-end demonstration layer; real ward GeoJSON can replace
 * it later without changing the map toolbars, legends, markers, or API hooks.
 */
const WardRiskIllustration = ({ variant = 'city', satellite = false, wards, zoom = 1, showBoundaries = true, selectedWardId = null, onWardSelect, riskMode = 'baseline' }) => {
  const id = useId().replace(/:/g, '')
  if (isApiMode()) return <LeafletWardMap wards={wards ?? []} showAllWhenEmpty={!Array.isArray(wards)} selectedWardId={selectedWardId} onWardSelect={onWardSelect} satellite={satellite} showBoundaries={showBoundaries} riskMode={variant === 'prediction' ? 'prediction' : riskMode} className={`ward-risk-illustration ward-risk-illustration--${variant}`} />
  const areas = Array.isArray(wards) ? wards : MAP_WARDS
  const mapAreas = areas
  const riskColors = {
    low: { edge: '#3ebf9e', fill: '#b9eadb' },
    moderate: { edge: '#ffc94f', fill: '#ffdf8f' },
    high: { edge: '#ff494f', fill: '#ffb0a1' },
  }
  const shapePoints = {
    1: '4,8 62,0 100,22 92,78 46,100 0,62',
    2: '0,18 38,0 88,8 100,58 72,100 12,86',
    3: '12,0 82,6 100,44 84,96 22,100 0,48',
    4: '0,0 70,4 100,34 96,84 40,100 6,70',
  }

  return (
    <div
      className={`ward-risk-illustration ward-risk-illustration--${variant}${satellite ? ' ward-risk-illustration--satellite' : ''}${onWardSelect ? ' ward-risk-illustration--interactive' : ''}`}
      style={{ '--ward-map-zoom': zoom }}
      aria-hidden={onWardSelect ? undefined : true}
      role={onWardSelect ? 'group' : undefined}
      aria-label={onWardSelect ? 'Ward risk map. Select a ward to inspect its details.' : undefined}
    >
      <svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice" role="presentation">
        <defs>
          <pattern id={`${id}-blocks`} width="48" height="42" patternUnits="userSpaceOnUse" patternTransform="rotate(-10)">
            <rect width="48" height="42" fill={satellite ? '#dce5d5' : '#f4f5ec'} />
            <path d="M0 12H48 M18 0V42 M38 12V42 M0 32H38" stroke={satellite ? '#b7c8b5' : '#dce5dc'} strokeWidth="2" />
          </pattern>
          <linearGradient id={`${id}-river`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#9bd8f4" />
            <stop offset="1" stopColor="#60b6e9" />
          </linearGradient>
        </defs>
        <rect width="1000" height="560" fill={satellite ? '#e4eadc' : '#eaf3f1'} />
        <rect width="1000" height="560" fill={`url(#${id}-blocks)`} />
        <g fill="none" stroke="#ffffff" strokeLinecap="round" opacity=".95">
          <path d="M-60 120 C160 80 280 170 440 120 S760 40 1060 160" strokeWidth="17" />
          <path d="M-50 270 C170 240 315 300 475 258 S790 215 1050 285" strokeWidth="10" opacity=".78" />
          <path d="M-30 390 C170 330 260 440 460 378 S780 300 1050 430" strokeWidth="21" />
          <path d="M120 -30 C150 110 80 180 160 275 S230 440 190 600" strokeWidth="15" />
          <path d="M730 -30 C680 130 780 190 730 300 S790 460 760 590" strokeWidth="20" />
        </g>
        <path d="M628 -30 C600 55 666 105 638 175 S672 260 642 330 S678 440 640 590 L740 590 C790 450 748 402 782 322 S740 220 776 150 S728 35 774 -30Z" fill={`url(#${id}-river)`} opacity=".98" />
        <path d="M684 -30 C656 58 722 110 694 176 S728 260 698 330 S734 440 696 590" fill="none" stroke="#e8f8ff" strokeWidth="8" />
        <path d="M700 -30 C672 58 738 110 710 176 S744 260 714 330 S750 440 712 590" fill="none" stroke="#8ec9f2" strokeWidth="3" />
        <g strokeLinejoin="round">
          {mapAreas.map((ward, index) => {
            const color = riskMode === 'simulation' && ward.risk === 'high'
              ? { edge: '#3ebf9e', fill: '#74d3b7' }
              : riskColors[ward.risk] || riskColors.moderate
            const centerX = (Number(ward.x ?? 50) / 100) * 1000
            const centerY = (Number(ward.y ?? 50) / 100) * 560
            const width = (Number(ward.w ?? 12) / 100) * 1000
            const height = (Number(ward.h ?? 12) / 100) * 560
            return (
              <g
                key={ward.id ?? ward.name}
                role={onWardSelect ? 'button' : undefined}
                tabIndex={onWardSelect ? 0 : undefined}
                aria-label={onWardSelect ? `${ward.name || `Ward ${ward.id}`} — ${ward.riskLabel || ward.risk || 'risk unknown'}` : undefined}
                aria-pressed={onWardSelect ? String(ward.id) === String(selectedWardId) : undefined}
                onClick={onWardSelect ? () => onWardSelect(ward) : undefined}
                onKeyDown={onWardSelect ? (event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onWardSelect(ward)
                  }
                } : undefined}
              >
                <polygon
                  points={shapePoints[ward.shape] || shapePoints[(index % 4) + 1]}
                  transform={`translate(${centerX - width / 2} ${centerY - height / 2}) scale(${width / 100} ${height / 100})`}
                  fill={color.fill}
                  stroke={String(ward.id) === String(selectedWardId) && onWardSelect ? '#075d4c' : (showBoundaries ? color.edge : '#ffffff')}
                  strokeWidth={String(ward.id) === String(selectedWardId) && onWardSelect ? 5.5 : (showBoundaries ? 3.5 : 1.2)}
                  vectorEffect="non-scaling-stroke"
                  opacity={satellite ? 0.84 : 0.95}
                />
                <text
                  pointerEvents="none"
                  x={centerX}
                  y={centerY + 5}
                  textAnchor="middle"
                  fill="#38515a"
                  stroke="none"
                  fontSize="18"
                  fontWeight="700"
                  opacity=".9"
                >
                  {String(ward.name || ward.id).replace(/\D/g, '')}
                </text>
              </g>
            )
          })}
        </g>
        {onWardSelect && mapAreas.find((ward) => String(ward.id) === String(selectedWardId)) ? (() => {
          const ward = mapAreas.find((item) => String(item.id) === String(selectedWardId))
          const x = (Number(ward.x ?? 50) / 100) * 1000
          const y = (Number(ward.y ?? 50) / 100) * 560
          return <g transform={`translate(${x} ${y - 18})`} pointerEvents="none"><path d="M0 -17 C-11 -17 -16 -8 -16 0 C-16 10 0 25 0 25 S16 10 16 0 C16 -8 11 -17 0 -17Z" fill="#ef4444" stroke="#fff" strokeWidth="3"/><circle cx="0" cy="0" r="5" fill="#fff"/></g>
        })() : null}
        <g fill="#59747b" fontSize="21" fontWeight="700" letterSpacing="4" opacity=".8" pointerEvents="none">
          <text x="350" y="64">NORTH DELHI</text>
          <text x="65" y="295">WEST DELHI</text>
          <text x="815" y="290">EAST DELHI</text>
          <text x="420" y="510">SOUTH DELHI</text>
          <text x="405" y="300">CENTRAL DELHI</text>
          <text x="120" y="128" fontSize="15" letterSpacing="3">ROHINI</text>
          <text x="820" y="128" fontSize="15" letterSpacing="3">SHAHDARA</text>
        </g>
      </svg>
    </div>
  )
}

export default WardRiskIllustration
