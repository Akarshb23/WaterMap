import { useState } from 'react'
import { Info } from 'lucide-react'

const BASELINE_COLOR = '#94a3b8'
const SIMULATED_COLOR = '#52b788'

/**
 * Scenario Impact (Koramangala):
 * Grouped bar chart comparing Baseline (2024) vs Simulated (2030)
 * across Water Stress Index, Annual Rainfall, Water Demand, and Groundwater Level.
 * Exactly matches the reference screenshot with data labels above bars.
 */
const ScenarioImpactChart = ({ result }) => {
  const [hoveredItem, setHoveredItem] = useState(null)

  const areaLabel = result?.area?.label ?? 'Koramangala'
  const baselineWsi = Number(result?.baseline?.wsi ?? 0.82)
  const simulatedWsi = Number(result?.simulated?.wsi ?? 0.46)
  const baselineRainfall = Number(result?.baseline?.rainfall ?? 520)
  const simulatedRainfall = Number(result?.simulated?.rainfall ?? 520)
  const baselineDemand = Number(result?.baseline?.demand ?? 124)
  const simulatedDemand = Number(result?.simulated?.demand ?? 98)
  const baselineGroundwater = Number(result?.baseline?.groundwater ?? -18.4)
  const simulatedGroundwater = Number(result?.simulated?.groundwater ?? -15.1)

  const categories = [
    {
      label: 'Water Stress Index',
      baselineVal: baselineWsi.toFixed(2),
      simulatedVal: simulatedWsi.toFixed(2),
      baselineH: Math.max(18, baselineWsi * 58),
      simulatedH: Math.max(12, simulatedWsi * 58),
    },
    {
      label: 'Annual Rainfall (mm)',
      baselineVal: `${Math.round(baselineRainfall)}`,
      simulatedVal: `${Math.round(simulatedRainfall)}`,
      baselineH: Math.min(115, (baselineRainfall / 600) * 125),
      simulatedH: Math.min(115, (simulatedRainfall / 600) * 125),
    },
    {
      label: 'Water Demand (MLD)',
      baselineVal: `${Math.round(baselineDemand)}`,
      simulatedVal: `${Math.round(simulatedDemand)}`,
      baselineH: Math.min(65, Math.max(15, (baselineDemand / 600) * 125 + 14)),
      simulatedH: Math.min(65, Math.max(12, (simulatedDemand / 600) * 125 + 10)),
    },
    {
      label: 'Groundwater Level (m)',
      baselineVal: `${baselineGroundwater.toFixed(1)}`,
      simulatedVal: `${simulatedGroundwater.toFixed(1)}`,
      baselineH: Math.min(50, Math.max(16, Math.abs(baselineGroundwater) * 1.8)),
      simulatedH: Math.min(50, Math.max(12, Math.abs(simulatedGroundwater) * 1.8)),
    },
  ]

  const yTicks = [
    { value: 600, y: 25 },
    { value: 400, y: 66 },
    { value: 200, y: 108 },
    { value: 0, y: 150 },
  ]

  const barW = 20
  const barGap = 3
  const catWidth = 100
  const startX = 65

  return (
    <section className="card impact-chart" aria-label={`Scenario impact chart for ${areaLabel}`}>
      <div
        className="card__header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '6px 8px',
          marginBottom: '4px',
        }}
      >
        <h2
          className="card__title"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontSize: '0.86rem',
            fontWeight: 700,
            margin: 0,
            minWidth: 0,
          }}
        >
          Scenario Impact ({areaLabel})
          <span title="Compare projected water stress indicators under selected interventions" style={{ cursor: 'help', color: '#94a3b8' }}>
            <Info size={13} />
          </span>
        </h2>
        <div
          className="forecast-card__legend"
          style={{
            display: 'inline-flex',
            gap: '8px',
            alignItems: 'center',
            flexWrap: 'wrap',
            margin: 0,
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '10.5px', color: '#64748b', whiteSpace: 'nowrap' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: BASELINE_COLOR, flexShrink: 0 }} />
            Baseline (2024)
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '10.5px', color: '#64748b', whiteSpace: 'nowrap' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: SIMULATED_COLOR, flexShrink: 0 }} />
            Simulated (2030)
          </span>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', height: 185, marginTop: 6 }}>
        <svg viewBox="0 0 490 185" width="100%" height="100%" preserveAspectRatio="none">
          {/* Y Axis gridlines and ticks */}
          {yTicks.map((tick) => (
            <g key={tick.value}>
              <text x="32" y={tick.y + 4} fill="#64748b" fontSize="10.5" textAnchor="end">
                {tick.value}
              </text>
              <line x1="42" y1={tick.y} x2="475" y2={tick.y} stroke="#f1f5f9" strokeWidth="1" />
            </g>
          ))}

          {/* Baseline horizontal axis line */}
          <line x1="42" y1="150" x2="475" y2="150" stroke="#e2e8f0" strokeWidth="1" />

          {/* Bars & Labels per Category */}
          {categories.map((cat, idx) => {
            const centerX = startX + idx * catWidth + 30
            const bX = centerX - barW - barGap / 2
            const sX = centerX + barGap / 2

            const bY = 150 - cat.baselineH
            const sY = 150 - cat.simulatedH

            return (
              <g
                key={cat.label}
                onMouseEnter={() => setHoveredItem(cat)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Baseline Bar */}
                <rect
                  x={bX}
                  y={bY}
                  width={barW}
                  height={cat.baselineH}
                  rx="2"
                  fill={BASELINE_COLOR}
                />
                {/* Value above Baseline Bar */}
                <text
                  x={bX + barW / 2}
                  y={bY - 4}
                  fill="#475569"
                  fontSize="9.5"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {cat.baselineVal}
                </text>

                {/* Simulated Bar */}
                <rect
                  x={sX}
                  y={sY}
                  width={barW}
                  height={cat.simulatedH}
                  rx="2"
                  fill={SIMULATED_COLOR}
                />
                {/* Value above Simulated Bar */}
                <text
                  x={sX + barW / 2}
                  y={sY - 4}
                  fill="#475569"
                  fontSize="9.5"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {cat.simulatedVal}
                </text>

                {/* Category label below baseline */}
                <text
                  x={centerX}
                  y="166"
                  fill="#64748b"
                  fontSize="9.5"
                  textAnchor="middle"
                >
                  {cat.label.includes('(') ? cat.label.split(' (')[0] : cat.label}
                </text>
                {cat.label.includes('(') && (
                  <text
                    x={centerX}
                    y="178"
                    fill="#94a3b8"
                    fontSize="8.5"
                    textAnchor="middle"
                  >
                    ({cat.label.split('(')[1]}
                  </text>
                )}
              </g>
            )
          })}
        </svg>

        {hoveredItem && (
          <div
            style={{
              position: 'absolute',
              top: 10,
              right: 15,
              padding: '6px 10px',
              backgroundColor: 'rgba(255,255,255,0.96)',
              border: '1px solid #e2e8f0',
              borderRadius: 6,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              fontSize: 11,
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: 2 }}>{hoveredItem.label}</div>
            <div style={{ color: BASELINE_COLOR }}>Baseline (2024): <strong>{hoveredItem.baselineVal}</strong></div>
            <div style={{ color: SIMULATED_COLOR }}>Simulated (2030): <strong>{hoveredItem.simulatedVal}</strong></div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ScenarioImpactChart