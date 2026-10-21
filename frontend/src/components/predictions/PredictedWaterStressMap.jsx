import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, Locate, Maximize2, Minimize2, Minus, Plus } from 'lucide-react'
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

const PredictedWaterStressMap = () => {
  const [selectedYear, setSelectedYear] = useState('2030')
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

  const yearMultiplier =
    selectedYear === '2026' ? 1.06 :
    selectedYear === '2028' ? 1.14 :
    selectedYear === '2030' ? 1.22 : 1.35
  const trendPct = Math.round((yearMultiplier - 1) * 100)

  const handleZoomIn = () => {
    if (mapRef.current) mapRef.current.zoomIn()
  }

  const handleZoomOut = () => {
    if (mapRef.current) mapRef.current.zoomOut()
  }

  const handleResetZoom = () => {
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
      const baseWsi = Number(props.water_stress_index ?? 0.5)
      const pWsi = Math.min(0.98, +(baseWsi * yearMultiplier).toFixed(2))
      const risk = pWsi >= 0.6 ? 'high' : pWsi >= 0.3 ? 'moderate' : 'low'

      layer.bindTooltip(
        `<div style="font-weight:700;font-size:12px;color:#0f172a">${name} (${selectedYear})</div><div style="font-size:11px;color:#475569">Forecast WSI: ${pWsi} · +${trendPct}% vs 2024</div>`,
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
    [selectedDistrictId, selectedYear, yearMultiplier, trendPct]
  )

  const featureStyle = useCallback(
    (feature) => {
      const props = feature.properties || {}
      const baseWsi = Number(props.water_stress_index ?? 0.5)
      const pWsi = Math.min(0.98, +(baseWsi * yearMultiplier).toFixed(2))
      const fillColor = pWsi >= 0.6 ? RISK_COLORS.high : pWsi >= 0.3 ? RISK_COLORS.moderate : RISK_COLORS.low

      const isSelected = String(getDistrictId(feature)) === String(selectedDistrictId)

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
    [selectedDistrictId, yearMultiplier]
  )

  const geoJsonKey = useMemo(() => {
    return `${(geoJsonData?.features ?? []).map((f) => getDistrictId(f)).join('-')}-${selectedYear}`
  }, [geoJsonData, selectedYear])

  return (
    <section className="card pred-map-card" aria-label="Predicted Water Stress Map">
      <div className="card__header pred-map-card__header">
        <div>
          <h2 className="card__title">Predicted Water Stress Map ({selectedYear})</h2>
          <p className="card__subtitle">
            District-level forecast of water stress index based on current trends.
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
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit full screen' : 'Expand map'}
            title={isFullscreen ? 'Exit full screen' : 'Toggle fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      <div className={`pred-map-viewport ${isFullscreen ? 'map-viewport--fullscreen' : ''}`}>
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
            aria-label="Reset zoom"
            title="Reset map view"
          >
            <Locate size={16} />
          </button>
          <button
            type="button"
            className="pred-map-ctrl-btn"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit full screen' : 'Full screen view'}
            title={isFullscreen ? 'Exit full screen' : 'Full screen view'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
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
