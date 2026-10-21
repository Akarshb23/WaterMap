import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Plus, Minus, Crosshair, Maximize2, Minimize2 } from 'lucide-react'
import { GeoJSON, MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { fetchDistrictsGeoJSON } from '../../services/districtMapService.js'
import { fetchWardsGeoJSON } from '../../services/mapService.js'
import {
  RISK_COLORS,
  getDistrictId,
  styleFeature as getFeatureStyle,
} from '../map/districtMap.js'
import {
  BANGALORE_DASHBOARD_REGIONS,
  BANGALORE_DASHBOARD_DISTRICTS,
} from '../../data/bangaloreDashboardData.js'

const MAP_LEGEND_ITEMS = [
  { label: 'Low (0 – 0.3)', color: '#34d399' },
  { label: 'Moderate (0.3 – 0.6)', color: '#facc15' },
  { label: 'High (0.6 – 1.0)', color: '#f87171' },
]

function FitDistrictsBounds({ data }) {
  const map = useMap()

  useEffect(() => {
    if (!data?.features?.length) return

    try {
      const bounds = L.geoJSON(data).getBounds()
      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [25, 25],
          maxZoom: 7,
        })
      }
    } catch {
      // Keep initial view if geometry is invalid
    }
  }, [data, map])

  return null
}

function SelectionSynchronizer({ selectedDistrictId }) {
  const map = useMap()

  useEffect(() => {
    map.eachLayer((layer) => {
      if (
        layer.feature &&
        typeof layer.setStyle === 'function' &&
        getDistrictId(layer.feature) !== null
      ) {
        layer.setStyle(getFeatureStyle(layer.feature, selectedDistrictId))
      }
    })
  }, [map, selectedDistrictId])

  return null
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
  const [selectedDistrictId, setSelectedDistrictId] = useState('district-12')
  const [geoJsonData, setGeoJsonData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const mapRef = useRef(null)

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => {
      const next = !prev
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize()
        }
      }, 100)
      return next
    })
  }

  useEffect(() => {
    const controller = new AbortController()

    async function loadGeoJSON() {
      setLoading(true)
      setError('')

      try {
        const result = await fetchDistrictsGeoJSON({ signal: controller.signal })

        if (controller.signal.aborted) return

        if (
          !result ||
          result.type !== 'FeatureCollection' ||
          !Array.isArray(result.features) ||
          result.features.length === 0
        ) {
          throw new Error('The boundary endpoint returned no usable polygons.')
        }

        setGeoJsonData(result)
      } catch (err) {
        if (controller.signal.aborted) return
        setError(err?.userMessage || err?.message || 'District boundaries could not be loaded.')
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadGeoJSON()
    return () => controller.abort()
  }, [])

  const handleZoomIn = () => {
    if (mapRef.current) mapRef.current.zoomIn()
  }

  const handleZoomOut = () => {
    if (mapRef.current) mapRef.current.zoomOut()
  }

  const handleReset = () => {
    setSelectedDistrictId('district-12')
    if (mapRef.current) {
      if (geoJsonData) {
        const bounds = L.geoJSON(geoJsonData).getBounds()
        if (bounds.isValid()) {
          mapRef.current.fitBounds(bounds, { padding: [20, 20], maxZoom: 12 })
        }
      } else {
        mapRef.current.setView([12.97, 77.59], 11)
      }
    }
  }

  const onEachFeature = useCallback(
    (feature, layer) => {
      const props = feature.properties || {}
      const dId = getDistrictId(feature)
      const name = props.name || props.district_name || 'Unnamed District'
      const isTarget = name.toLowerCase().includes('koramangala') || dId === 'district-12' || dId === 'W001'

      const effectiveWsi = isTarget
        ? (mode === 'simulated' ? simulatedWsi : currentWsi)
        : Number(props.water_stress_index ?? 0.5)

      layer.bindTooltip(
        `<div style="font-weight:700;font-size:12px;color:#0f172a">${name} (${mode === 'simulated' ? horizon : '2024'})</div><div style="font-size:11px;color:#475569">WSI: ${Number(effectiveWsi).toFixed(2)}${isTarget && mode === 'simulated' ? ` (↓ ${reductionPct}%)` : ''}</div>`,
        {
          sticky: true,
          direction: 'auto',
          className: 'district-map-tooltip',
        }
      )

      layer.on({
        click: () => {
          setSelectedDistrictId(dId)
        },
        mouseover: (e) => {
          const l = e.target
          if (dId !== String(selectedDistrictId)) {
            l.setStyle({
              weight: 2.8,
              color: '#075f50',
              fillOpacity: 0.95,
            })
            if (typeof l.bringToFront === 'function') {
              l.bringToFront()
            }
          }
        },
        mouseout: (e) => {
          const l = e.target
          if (dId !== String(selectedDistrictId)) {
            l.setStyle(getFeatureStyle(feature, selectedDistrictId))
          }
        },
      })
    },
    [selectedDistrictId, mode, simulatedWsi, currentWsi, reductionPct, horizon]
  )

  const featureStyle = useCallback(
    (feature) => {
      const props = feature.properties || {}
      const name = props.name || props.district_name || ''
      const dId = getDistrictId(feature)
      const isTarget = name.toLowerCase().includes('koramangala') || dId === 'district-12' || dId === 'W001'

      let fillColor = '#10b981'
      if (isTarget) {
        fillColor = mode === 'simulated' ? '#f59e0b' : '#ef4444'
      } else {
        const wsi = Number(props.water_stress_index ?? 0.5)
        fillColor = wsi >= 0.6 ? RISK_COLORS.high : wsi >= 0.3 ? RISK_COLORS.moderate : RISK_COLORS.low
      }

      const isSelected = String(dId) === String(selectedDistrictId)

      return {
        color: isSelected ? '#075f50' : '#ffffff',
        weight: isSelected ? 3 : 1.5,
        opacity: 1,
        fillColor,
        fillOpacity: isSelected ? 0.98 : 0.85,
        lineJoin: 'round',
        lineCap: 'round',
      }
    },
    [selectedDistrictId, mode]
  )

  const geoJsonKey = useMemo(() => {
    return `${(geoJsonData?.features ?? []).map((f) => getDistrictId(f)).join('-')}-${mode}`
  }, [geoJsonData, mode])

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

      <div className={`sim-map-canvas ${isFullscreen ? 'map-viewport--fullscreen' : ''}`} style={{ position: 'relative', width: '100%', height: isFullscreen ? '100vh' : '415px', overflow: 'hidden', backgroundColor: '#eef5f3' }}>
        {/* Zoom & Navigation Controls (top-left) */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 14,
            zIndex: 1000,
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
            style={{ width: 30, height: 30, border: 'none', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #f1f5f9' }}
          >
            <Crosshair size={14} color="#475569" />
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit full screen' : 'Full screen view'}
            style={{ width: 30, height: 30, border: 'none', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {isFullscreen ? <Minimize2 size={15} color="#475569" /> : <Maximize2 size={15} color="#475569" />}
          </button>
        </div>

        {/* Leaflet GeoJSON Map Container */}
        <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
          {loading && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1000,
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '10px 18px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                fontSize: '13px',
                fontWeight: 600,
                color: '#075d4c',
              }}
            >
              Loading Karnataka boundaries…
            </div>
          )}

          {error && !loading && (
            <div
              style={{
                position: 'absolute',
                top: 20,
                left: 20,
                right: 20,
                zIndex: 1000,
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#991b1b',
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '12px',
              }}
              role="alert"
            >
              {error}
            </div>
          )}

          <MapContainer
            ref={mapRef}
            center={[14.8, 76.2]}
            zoom={6}
            minZoom={5}
            maxZoom={12}
            scrollWheelZoom
            zoomControl={false}
            preferCanvas
            style={{ width: '100%', height: '100%', background: '#f2f6f4' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {geoJsonData && (
              <>
                <FitDistrictsBounds data={geoJsonData} />
                <GeoJSON
                  key={geoJsonKey}
                  data={geoJsonData}
                  style={featureStyle}
                  onEachFeature={onEachFeature}
                />
                <SelectionSynchronizer selectedDistrictId={selectedDistrictId} />
              </>
            )}
          </MapContainer>
        </div>
        

        {/* Floating Legend (Bottom-Left) */}
        <div
          style={{
            position: 'absolute',
            bottom: 14,
            left: 14,
            zIndex: 1000,
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
            zIndex: 1000,
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