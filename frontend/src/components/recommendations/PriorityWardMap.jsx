import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Locate, Maximize2, Minimize2, Minus, Plus } from 'lucide-react'
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

// Priority colors for the recommendations map
const PRIORITY_COLORS = {
  high: { fill: '#ef4444', label: 'High Priority (12)' },
  moderate: { fill: '#f59e0b', label: 'Medium Priority (18)' },
  medium: { fill: '#f59e0b', label: 'Medium Priority (18)' },
  low: { fill: '#10b981', label: 'Low Priority (12)' },
}

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

const PriorityWardMap = ({ onSelectDistrict, onSelectWard }) => {
  const handleSelect = onSelectDistrict || onSelectWard
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
      const wsi = props.water_stress_index != null ? Number(props.water_stress_index).toFixed(2) : '0.50'
      const risk = props.risk_category || 'Moderate'

      layer.bindTooltip(
        `<div style="font-weight:700;font-size:12px;color:#0f172a">${name}</div><div style="font-size:11px;color:#475569">Priority: ${risk} · WSI: ${wsi}</div>`,
        {
          sticky: true,
          direction: 'auto',
          className: 'district-map-tooltip',
        }
      )

      layer.on({
        click: () => {
          setSelectedDistrictId(dId)
          const districtObj = {
            id: dId,
            district_id: dId,
            name,
            district_name: name,
            risk: String(risk).toLowerCase(),
            riskLabel: `${risk[0].toUpperCase()}${risk.slice(1)} Priority`,
            wsi: Number(props.water_stress_index ?? 0.5),
            water_stress_index: props.water_stress_index,
            zone: props.zone || 'Karnataka Region',
            properties: props,
          }
          handleSelect?.(districtObj)
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
    [selectedDistrictId, handleSelect]
  )

  const featureStyle = useCallback(
    (feature) => {
      const base = getFeatureStyle(feature, selectedDistrictId)
      return {
        ...base,
        stroke: true,
        weight: String(getDistrictId(feature)) === String(selectedDistrictId) ? 3 : 1.5,
        fillOpacity: 0.85,
      }
    },
    [selectedDistrictId]
  )

  const geoJsonKey = useMemo(() => {
    return (geoJsonData?.features ?? []).map((f) => getDistrictId(f)).join('-')
  }, [geoJsonData])

  return (
    <article className="card priority-wards-map" aria-label="Priority Districts Map">
      <div className="priority-wards-map__header">
        <h3 className="priority-wards-map__title">Priority Districts Map</h3>
        <p className="priority-wards-map__subtitle">
          Districts recommended for immediate intervention.
        </p>
      </div>

      <div className={`priority-wards-map__canvas ${isFullscreen ? 'map-viewport--fullscreen' : ''}`} role="region" aria-label="Priority districts map">
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
          <button
            type="button"
            className="priority-wards-map__ctrl-btn"
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
