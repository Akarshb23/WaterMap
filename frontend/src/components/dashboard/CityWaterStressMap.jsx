import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Locate, Maximize2, Minimize2, Minus, Plus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { GeoJSON, MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import cityscape from '../../assets/watermap-cityscape.png'
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

const MAP_METRIC_OPTIONS = [
  { value: 'wsi', label: 'Water Stress Index' },
  { value: 'groundwater', label: 'Groundwater Level' },
  { value: 'demand', label: 'Water Demand' },
  { value: 'supply', label: 'Per Capita Supply' },
]

const MAP_ZONE_OPTIONS = [
  { value: 'all', label: 'All Zones' },
  { value: 'north', label: 'North Zone' },
  { value: 'west', label: 'West Zone' },
  { value: 'central', label: 'Central Zone' },
  { value: 'east', label: 'East Zone' },
  { value: 'south', label: 'South Zone' },
]

const MAP_DISTRICT_FILTER_OPTIONS = [
  { value: 'all', label: 'All Districts' },
  { value: 'high', label: 'High Risk Districts' },
  { value: 'moderate', label: 'Moderate Risk Districts' },
  { value: 'low', label: 'Low Risk Districts' },
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
 * Interactive Water Stress Map component matching the Bangalore city dashboard:
 * - Top-right filter dropdowns (Metric, Zone, District)
 * - Map canvas rendering real Leaflet GeoJSON polygons
 * - Floating top-left zoom controls (+, -, locate)
 * - Floating bottom-left risk legend
 * - Right-hand District details panel with photographic hero and "View Full Details →" button
 */
const CityWaterStressMap = ({ onSelectWard, onSelectDistrict }) => {
  const navigate = useNavigate()
  const handleSelect = onSelectDistrict || onSelectWard
  const [selectedDistrictId, setSelectedDistrictId] = useState('district-12')
  const [metric, setMetric] = useState('wsi')
  const [zone, setZone] = useState('all')
  const [districtFilter, setDistrictFilter] = useState('all')

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

  const filteredData = useMemo(() => {
    if (!geoJsonData?.features) return null

    const features = geoJsonData.features.filter((f) => {
      const props = f.properties || {}
      const zName = (props.zone || props.state_name || '').toLowerCase()
      const risk = (props.risk_category || 'moderate').toLowerCase()

      if (zone && zone !== 'all') {
        const targetZone = zone.toLowerCase().replace(' zone', '').trim()
        if (!zName.includes(targetZone)) return false
      }

      if (districtFilter !== 'all') {
        if (risk !== districtFilter) return false
      }

      return true
    })

    return { ...geoJsonData, features: features.length > 0 ? features : geoJsonData.features }
  }, [geoJsonData, zone, districtFilter])

  const selectedDistrict = useMemo(() => {
    if (geoJsonData?.features?.length) {
      const match = geoJsonData.features.find((f) => {
        const dId = String(getDistrictId(f))
        const pName = (f.properties?.name || f.properties?.district_name || '').toLowerCase()
        return (
          dId === String(selectedDistrictId) ||
          pName === String(selectedDistrictId).toLowerCase() ||
          (pName.includes('koramangala') && String(selectedDistrictId) === 'district-12')
        )
      })

      if (match) {
        const p = match.properties || {}
        const name = p.name || p.district_name || 'Koramangala'
        const risk = (p.risk_category || 'high').toLowerCase()
        const wsi = Number(p.water_stress_index ?? 0.87)

        return {
          id: getDistrictId(match),
          districtNumber: p.ward_id || p.district_id || 12,
          wardNumber: p.ward_id || 12,
          name,
          zone: p.zone ? `${p.zone} Bangalore` : 'Central Bangalore',
          risk,
          riskLabel: `${risk[0].toUpperCase()}${risk.slice(1)} Risk`,
          wsi,
          population: p.population ? Number(p.population).toLocaleString('en-IN') : '240,000',
          rainfall: p.indicators?.rainfall_deficit_pct?.raw_value
            ? `${Math.abs(p.indicators.rainfall_deficit_pct.raw_value)} mm`
            : '520 mm',
          demand: p.indicators?.piped_water_supply_lpcd?.raw_value
            ? `${Math.round(p.indicators.piped_water_supply_lpcd.raw_value)} MLD`
            : '124 MLD',
          groundwater: p.indicators?.groundwater_depth_mbgl?.raw_value
            ? `-${p.indicators.groundwater_depth_mbgl.raw_value} m`
            : '-18.4 m',
        }
      }
    }

    return (
      BANGALORE_DASHBOARD_DISTRICTS.find((w) => w.id === selectedDistrictId || w.legacyId === selectedDistrictId) ||
      BANGALORE_DASHBOARD_DISTRICTS[0]
    )
  }, [geoJsonData, selectedDistrictId])

  const handleZoomIn = () => {
    if (mapRef.current) mapRef.current.zoomIn()
  }

  const handleZoomOut = () => {
    if (mapRef.current) mapRef.current.zoomOut()
  }

  const handleResetZoom = () => {
    setSelectedDistrictId('district-12')
    if (mapRef.current) {
      if (filteredData) {
        const bounds = L.geoJSON(filteredData).getBounds()
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
        `<div style="font-weight:700;font-size:12px;color:#0f172a">${name}</div><div style="font-size:11px;color:#475569">WSI: ${wsi} · ${risk}</div>`,
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
    return (filteredData?.features ?? []).map((f) => getDistrictId(f)).join('-')
  }, [filteredData])

  return (
    <article className="card city-map-card" aria-labelledby="city-water-stress-map-title">
      <header className="city-map-card__header">
        <div className="city-map-card__title-wrap">
          <h2 className="city-map-card__title" id="city-water-stress-map-title">
            Water Stress Map
          </h2>
          <p className="city-map-card__subtitle">
            District-level water stress across Bangalore
          </p>
        </div>

        <div className="city-map-card__filters">
          <label className="sr-only" htmlFor="dashboard-metric-select">Select Metric</label>
          <select
            id="dashboard-metric-select"
            className="native-select city-map-card__select"
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
          >
            {MAP_METRIC_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <label className="sr-only" htmlFor="dashboard-zone-select">Select Zone</label>
          <select
            id="dashboard-zone-select"
            className="native-select city-map-card__select"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
          >
            {MAP_ZONE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <label className="sr-only" htmlFor="dashboard-district-filter-select">Filter Districts</label>
          <select
            id="dashboard-district-filter-select"
            className="native-select city-map-card__select"
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
          >
            {MAP_DISTRICT_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="city-map-layout">
        {/* Main Map Viewport */}
        <div className={`city-map-viewport ${isFullscreen ? 'map-viewport--fullscreen' : ''}`} role="region" aria-label="Interactive water stress map of Karnataka">
          {/* Controls: Top-Left */}
          <div className="city-map-controls" role="toolbar" aria-label="Map zoom controls">
            <button
              type="button"
              className="city-map-ctrl-btn"
              onClick={handleZoomIn}
              aria-label="Zoom in"
              title="Zoom in"
            >
              <Plus size={16} />
            </button>
            <button
              type="button"
              className="city-map-ctrl-btn"
              onClick={handleZoomOut}
              aria-label="Zoom out"
              title="Zoom out"
            >
              <Minus size={16} />
            </button>
            <button
              type="button"
              className="city-map-ctrl-btn"
              onClick={handleResetZoom}
              aria-label="Reset map"
              title="Reset view"
            >
              <Locate size={16} />
            </button>
            <button
              type="button"
              className="city-map-ctrl-btn"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit full screen' : 'Full screen view'}
              title={isFullscreen ? 'Exit full screen' : 'Full screen view'}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>

          {/* Floating Legend: Bottom-Left */}
          <div className="city-map-legend" aria-label="Risk category legend">
            <h4 className="city-map-legend__title">Water Stress Index</h4>
            <ul className="city-map-legend__list">
              <li className="city-map-legend__item">
                <span className="city-map-legend__dot" style={{ backgroundColor: '#10b981' }} />
                <span>Low (0 – 0.3)</span>
              </li>
              <li className="city-map-legend__item">
                <span className="city-map-legend__dot" style={{ backgroundColor: '#f59e0b' }} />
                <span>Moderate (0.3 – 0.6)</span>
              </li>
              <li className="city-map-legend__item">
                <span className="city-map-legend__dot" style={{ backgroundColor: '#ef4444' }} />
                <span>High (0.6 – 1.0)</span>
              </li>
            </ul>
          </div>

          {/* Scale Bar: Bottom-Right */}
          <div className="city-map-scale-bar" aria-label="Map scale">
            <div className="city-map-scale-bar__ticks">
              <span>0</span>
              <span>5</span>
              <span>10 km</span>
            </div>
            <div className="city-map-scale-bar__rule" />
          </div>

          <div className="city-map-canvas" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
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
                Loading Bangalore boundaries…
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

              {filteredData && (
                <>
                  <FitDistrictsBounds data={filteredData} />
                  <GeoJSON
                    key={geoJsonKey}
                    data={filteredData}
                    style={featureStyle}
                    onEachFeature={onEachFeature}
                  />
                  <SelectionSynchronizer selectedDistrictId={selectedDistrictId} />
                </>
              )}
            </MapContainer>
          </div>
        </div>

        {/* Right District Detail Panel */}
        <aside className="city-ward-panel" aria-label={`Details for ${selectedDistrict.name}`}>
          <div className="city-ward-panel__head">
            <div>
              <h3 className="city-ward-panel__title">{selectedDistrict.name}</h3>
              <p className="city-ward-panel__zone">{selectedDistrict.zone}</p>
            </div>
            <span className={`city-ward-panel__badge city-ward-panel__badge--${selectedDistrict.risk}`}>
              ● {selectedDistrict.riskLabel}
            </span>
          </div>

          {/* Cityscape Photographic Visual */}
          <div
            className="city-ward-panel__hero-img"
            style={{
              backgroundImage: `url(${cityscape})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 35%',
            }}
            role="img"
            aria-label={`Panoramic view of ${selectedDistrict.name}`}
          />

          {/* Stats List */}
          <dl className="city-ward-panel__stats">
            <div className="city-ward-panel__stat-row">
              <dt className="city-ward-panel__stat-label">Water Stress Index</dt>
              <dd className="city-ward-panel__stat-val city-ward-panel__stat-val--danger">
                {selectedDistrict.wsi.toFixed(2)}
              </dd>
            </div>
            <div className="city-ward-panel__stat-row">
              <dt className="city-ward-panel__stat-label">Population</dt>
              <dd className="city-ward-panel__stat-val">{selectedDistrict.population}</dd>
            </div>
            <div className="city-ward-panel__stat-row">
              <dt className="city-ward-panel__stat-label">Annual Rainfall</dt>
              <dd className="city-ward-panel__stat-val">{selectedDistrict.rainfall}</dd>
            </div>
            <div className="city-ward-panel__stat-row">
              <dt className="city-ward-panel__stat-label">Water Demand</dt>
              <dd className="city-ward-panel__stat-val">{selectedDistrict.demand}</dd>
            </div>
            <div className="city-ward-panel__stat-row">
              <dt className="city-ward-panel__stat-label">Groundwater Level</dt>
              <dd className="city-ward-panel__stat-val">{selectedDistrict.groundwater}</dd>
            </div>
          </dl>

          {/* Action Button */}
          <div className="city-ward-panel__action">
            <button
              type="button"
              className="city-ward-panel__btn"
              onClick={() => navigate(`/districts/${selectedDistrict.districtNumber || selectedDistrict.wardNumber || 12}`)}
            >
              View Full Details <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        </aside>
      </div>
    </article>
  )
}

export default CityWaterStressMap
