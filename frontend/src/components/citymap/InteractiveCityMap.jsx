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
  getSelectedDistrictId,
  hasUsableScore,
  styleFeature as getFeatureStyle,
} from '../map/districtMap.js'
import { BANGALORE_DASHBOARD_DISTRICTS } from '../../data/bangaloreDashboardData.js'

function FitDistrictsBounds({ data }) {
  const map = useMap()

  useEffect(() => {
    if (!data?.features?.length) return

    try {
      const bounds = L.geoJSON(data).getBounds()
      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [30, 30],
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
 * Interactive City Map component rendering the authentic Leaflet GeoJSON district polygons:
 * - Fetches GeoJSON from /api/v1/map/districts/geojson via districtMapService
 * - Renders every district polygon via React-Leaflet
 * - Supports hover highlighting, tooltips, click selection, and bounds fitting
 * - Preserves map controls (+, -, reset), floating legend, layer toggles, and scale bar
 */
const InteractiveCityMap = ({
  selectedDistrictId = 'district-12',
  selectedWardId,
  onSelectDistrict,
  onSelectWard,
  zone = 'all',
  searchQuery = '',
}) => {
  const [geoJsonData, setGeoJsonData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showBoundaries, setShowBoundaries] = useState(true)
  const [satelliteView, setSatelliteView] = useState(false)
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

  const activeId = selectedDistrictId || selectedWardId || 'district-12'
  const handleSelect = onSelectDistrict || onSelectWard

  const fallbackDistrict =
    BANGALORE_DASHBOARD_DISTRICTS.find((d) => d.id === activeId || d.legacyId === activeId) ||
    BANGALORE_DASHBOARD_DISTRICTS[0]

  // Fetch real Bangalore GeoJSON on mount
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

  // Filter features based on zone and search query if supplied
  const filteredData = useMemo(() => {
    if (!geoJsonData?.features) return null

    const features = geoJsonData.features.filter((f) => {
      const props = f.properties || {}
      const name = (props.district_name || props.name || '').toLowerCase()
      const zName = (props.zone || props.state_name || '').toLowerCase()

      if (zone && zone !== 'all') {
        const targetZone = zone.toLowerCase().replace(' bangalore', '').trim()
        if (!zName.includes(targetZone)) return false
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        if (!name.includes(q) && !zName.includes(q)) return false
      }
      return true
    })

    return { ...geoJsonData, features: features.length > 0 ? features : geoJsonData.features }
  }, [geoJsonData, zone, searchQuery])

  // Locate/Center Reset
  const handleResetZoom = () => {
    if (mapRef.current) {
      if (filteredData) {
        const bounds = L.geoJSON(filteredData).getBounds()
        if (bounds.isValid()) {
          mapRef.current.fitBounds(bounds, { padding: [30, 30] })
        }
      } else {
        mapRef.current.setView([13.0, 77.6], 9)
      }
    }
  }

  const handleZoomIn = () => {
    if (mapRef.current) mapRef.current.zoomIn()
  }

  const handleZoomOut = () => {
    if (mapRef.current) mapRef.current.zoomOut()
  }

  const onEachFeature = useCallback(
    (feature, layer) => {
      const props = feature.properties || {}
      const dId = getDistrictId(feature)
      const name = props.district_name || props.name || 'Unnamed District'
      const wsi = props.water_stress_index != null ? Number(props.water_stress_index).toFixed(2) : 'N/A'
      const risk = props.risk_category || 'Moderate'

      layer.bindTooltip(
        `<div style="font-weight:700;font-size:12px;color:#0f172a">${name}</div><div style="font-size:11px;color:#475569">WSI: ${wsi} · ${risk}</div>`,
        {
          sticky: true,
          direction: 'auto',
          className: 'district-map-tooltip',
        }
      )

      layer.on({
        click: () => {
          // Normalize to district object expected by parent panel
          const districtObj = {
            id: dId,
            district_id: dId,
            name,
            district_name: name,
            risk: String(risk).toLowerCase(),
            riskLabel: `${risk[0].toUpperCase()}${risk.slice(1)} Risk`,
            wsi: Number(props.water_stress_index ?? 0.5),
            water_stress_index: props.water_stress_index,
            zone: props.zone || 'Bangalore Region',
            properties: props,
          }
          handleSelect?.(districtObj)
        },
        mouseover: (e) => {
          const l = e.target
          if (dId !== String(activeId)) {
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
          if (dId !== String(activeId)) {
            l.setStyle(getFeatureStyle(feature, activeId))
          }
        },
      })
    },
    [activeId, handleSelect]
  )

  const featureStyle = useCallback(
    (feature) => {
      const base = getFeatureStyle(feature, activeId)
      return {
        ...base,
        stroke: showBoundaries,
        weight: String(getDistrictId(feature)) === String(activeId) ? 3 : showBoundaries ? 1.5 : 0,
        fillOpacity: satelliteView ? 0.72 : 0.85,
      }
    },
    [activeId, showBoundaries, satelliteView]
  )

  const geoJsonKey = useMemo(() => {
    return `${(filteredData?.features ?? []).map((f) => getDistrictId(f)).join('-')}-${showBoundaries}-${satelliteView}`
  }, [filteredData, showBoundaries, satelliteView])

  return (
    <div
      className={`interactive-map-viewport ${satelliteView ? 'interactive-map-viewport--satellite' : ''} ${isFullscreen ? 'map-viewport--fullscreen' : ''}`}
      role="region"
      aria-label="Interactive city map of Bangalore"
    >
      {/* Zoom Controls: Top-Left Grouped Container */}
      <div className="interactive-map-controls" role="toolbar" aria-label="Map zoom controls">
        <div className="interactive-map-ctrl-group">
          <button
            type="button"
            className="interactive-map-ctrl-btn interactive-map-ctrl-btn--top"
            onClick={handleZoomIn}
            aria-label="Zoom in"
            title="Zoom in"
          >
            <Plus size={16} />
          </button>
          <div className="interactive-map-ctrl-divider" />
          <button
            type="button"
            className="interactive-map-ctrl-btn interactive-map-ctrl-btn--bottom"
            onClick={handleZoomOut}
            aria-label="Zoom out"
            title="Zoom out"
          >
            <Minus size={16} />
          </button>
        </div>
        <button
          type="button"
          className="interactive-map-ctrl-btn interactive-map-ctrl-btn--standalone"
          onClick={handleResetZoom}
          aria-label="Reset view"
          title="Reset view"
        >
          <Locate size={15} />
        </button>
        <button
          type="button"
          className="interactive-map-ctrl-btn interactive-map-ctrl-btn--standalone"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Exit full screen' : 'Full screen view'}
          title={isFullscreen ? 'Exit full screen' : 'Full screen view'}
        >
          {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>
      </div>

      {/* Floating Legend & Layer Toggles Card: Bottom-Left */}
      <div className="interactive-map-legend-card" aria-label="Map legend and layer switches">
        <h4 className="interactive-map-legend-card__title">Water Stress Index</h4>
        <ul className="interactive-map-legend-card__list">
          <li className="interactive-map-legend-card__item">
            <span className="interactive-map-legend-card__dot" style={{ backgroundColor: RISK_COLORS.low }} />
            <span>Low (0 – 0.3)</span>
          </li>
          <li className="interactive-map-legend-card__item">
            <span className="interactive-map-legend-card__dot" style={{ backgroundColor: RISK_COLORS.moderate }} />
            <span>Moderate (0.3 – 0.6)</span>
          </li>
          <li className="interactive-map-legend-card__item">
            <span className="interactive-map-legend-card__dot" style={{ backgroundColor: RISK_COLORS.high }} />
            <span>High (0.6 – 1.0)</span>
          </li>
        </ul>

        <div className="interactive-map-legend-card__divider" />

        {/* Toggles */}
        <div className="interactive-map-toggles">
          <label className="interactive-map-switch">
            <input
              type="checkbox"
              checked={showBoundaries}
              onChange={(e) => setShowBoundaries(e.target.checked)}
              className="interactive-map-switch__input"
            />
            <span className="interactive-map-switch__slider" />
            <span className="interactive-map-switch__label">District Boundaries</span>
          </label>

          <label className="interactive-map-switch">
            <input
              type="checkbox"
              checked={satelliteView}
              onChange={(e) => setSatelliteView(e.target.checked)}
              className="interactive-map-switch__input"
            />
            <span className="interactive-map-switch__slider" />
            <span className="interactive-map-switch__label">Satellite View</span>
          </label>
        </div>
      </div>

      {/* Cartographic Scale Bar: Bottom-Left (under legend) */}
      <div className="interactive-map-scale-bar" aria-label="Map scale">
        <div className="interactive-map-scale-bar__ticks">
          <span>0</span>
          <span>5</span>
          <span>10 km</span>
        </div>
        <div className="interactive-map-scale-bar__line-container">
          <div className="interactive-map-scale-bar__rule" />
        </div>
      </div>

      {/* Leaflet GeoJSON Map Container */}
      <div className="interactive-map-canvas">
        {loading && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '12px 20px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              fontSize: '13px',
              fontWeight: 600,
              color: '#075d4c',
            }}
          >
            Loading district GeoJSON boundaries…
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
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '13px',
            }}
            role="alert"
          >
            <strong>District GeoJSON Error: </strong>
            {error}
          </div>
        )}

        <MapContainer
          ref={mapRef}
          center={[13.0, 77.6]}
          zoom={8}
          minZoom={5}
          maxZoom={14}
          scrollWheelZoom
          zoomControl={false}
          preferCanvas
          style={{ width: '100%', height: '100%', background: satelliteView ? '#1e293b' : '#f2f6f4' }}
        >
          {satelliteView ? (
            <TileLayer
              attribution="&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          ) : (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          )}

          {filteredData && (
            <>
              <FitDistrictsBounds data={filteredData} />
              <GeoJSON
                key={geoJsonKey}
                data={filteredData}
                style={featureStyle}
                onEachFeature={onEachFeature}
              />
              <SelectionSynchronizer selectedDistrictId={activeId} />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  )
}

export default InteractiveCityMap
