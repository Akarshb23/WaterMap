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

const KARNATAKA_DISTRICT_ZONES = {
  bagalkote: 'north',
  ballari: 'north',
  belagavi: 'north',
  bidar: 'north',
  dharwad: 'north',
  gadag: 'north',
  haveri: 'north',
  kalaburagi: 'north',
  koppal: 'north',
  raichur: 'north',
  vijayanagara: 'north',
  vijayapura: 'north',
  yadgir: 'north',

  'bengaluru urban': 'south',
  'bengaluru rural': 'south',
  'bengaluru south': 'south',
  chamarajanagara: 'south',
  chikkaballapura: 'south',
  hassan: 'south',
  kodagu: 'south',
  kolar: 'south',
  mandya: 'south',
  mysuru: 'south',
  ramanagara: 'south',
  tumakuru: 'south',

  chikkamagaluru: 'central',
  chitradurga: 'central',
  davanagere: 'central',
  shivamogga: 'central',

  'dakshina kannada': 'west',
  udupi: 'west',
  'uttara kannada': 'west',
}

const BANGALORE_EAST_DISTRICTS = ['whitefield', 'bellandur', 'varthur', 'mahadevapura', 'marathahalli', 'hal', 'kr puram']
const BANGALORE_NORTH_DISTRICTS = ['hebbal', 'yelahanka', 'thanisandra', 'sahakarnagar', 'peenya', 'jalahalli']
const BANGALORE_SOUTH_DISTRICTS = ['koramangala', 'electronic city', 'jayanagar', 'jp nagar', 'btm layout', 'bannerghatta', 'banashankari']
const BANGALORE_WEST_DISTRICTS = ['rajajinagar', 'malleshwaram', 'vijayanagar', 'basaveshwaranagar', 'yeshwanthpur']
const BANGALORE_CENTRAL_DISTRICTS = ['indiranagar', 'shanthi nagar', 'shivajinagar', 'chickpet', 'mg road']

function getZoneForDistrict(props) {
  if (props.zoneKey) return props.zoneKey.toLowerCase()
  if (props.zone) {
    const z = props.zone.toLowerCase()
    if (z.includes('north')) return 'north'
    if (z.includes('south')) return 'south'
    if (z.includes('west')) return 'west'
    if (z.includes('east')) return 'east'
    if (z.includes('central')) return 'central'
  }
  const name = (props.district_name || props.name || '').toLowerCase().trim()
  if (KARNATAKA_DISTRICT_ZONES[name]) return KARNATAKA_DISTRICT_ZONES[name]
  if (BANGALORE_EAST_DISTRICTS.some((d) => name.includes(d))) return 'east'
  if (BANGALORE_NORTH_DISTRICTS.some((d) => name.includes(d))) return 'north'
  if (BANGALORE_WEST_DISTRICTS.some((d) => name.includes(d))) return 'west'
  if (BANGALORE_CENTRAL_DISTRICTS.some((d) => name.includes(d))) return 'central'
  return 'south'
}

function getMetricValue(props, metricKey) {
  const scores = props.indicator_scores || {}
  if (metricKey === 'groundwater') {
    return scores.groundwater != null ? Number(scores.groundwater) : (props.groundwater_score ?? 0.55)
  }
  if (metricKey === 'demand') {
    return scores.tanker_reliance != null ? Number(scores.tanker_reliance) : (props.demand_score ?? 0.45)
  }
  if (metricKey === 'supply') {
    return scores.piped_supply != null ? Number(scores.piped_supply) : (props.supply_score ?? 0.40)
  }
  return props.water_stress_index != null ? Number(props.water_stress_index) : (props.wsi ?? 0.50)
}

function getMetricColor(value, metricKey) {
  if (metricKey === 'groundwater') {
    if (value >= 0.70) return '#ef4444'
    if (value >= 0.40) return '#f59e0b'
    return '#10b981'
  }
  if (metricKey === 'demand') {
    if (value >= 0.55) return '#ef4444'
    if (value >= 0.35) return '#f59e0b'
    return '#10b981'
  }
  if (metricKey === 'supply') {
    if (value >= 0.55) return '#ef4444'
    if (value >= 0.35) return '#f59e0b'
    return '#10b981'
  }
  if (value >= 0.55) return '#ef4444'
  if (value >= 0.35) return '#f59e0b'
  return '#10b981'
}

const LEGEND_CONFIGS = {
  wsi: {
    title: 'Water Stress Index',
    items: [
      { color: '#10b981', label: 'Low (0 – 0.35)' },
      { color: '#f59e0b', label: 'Moderate (0.35 – 0.55)' },
      { color: '#ef4444', label: 'High (0.55 – 1.0)' },
    ],
  },
  groundwater: {
    title: 'Groundwater Stage',
    items: [
      { color: '#10b981', label: 'Safe Extraction (< 40%)' },
      { color: '#f59e0b', label: 'Semi-Critical (40 – 70%)' },
      { color: '#ef4444', label: 'Critical / Over-exploited (> 70%)' },
    ],
  },
  demand: {
    title: 'Water Demand Pressure',
    items: [
      { color: '#10b981', label: 'Low Demand (< 35%)' },
      { color: '#f59e0b', label: 'Moderate Demand (35 – 55%)' },
      { color: '#ef4444', label: 'High Tanker / Demand (> 55%)' },
    ],
  },
  supply: {
    title: 'Per Capita Supply Deficit',
    items: [
      { color: '#10b981', label: 'Adequate Coverage (< 35% Deficit)' },
      { color: '#f59e0b', label: 'Moderate Deficit (35 – 55%)' },
      { color: '#ef4444', label: 'Severe Supply Deficit (> 55%)' },
    ],
  },
}

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
      const dZone = getZoneForDistrict(props)
      const risk = (props.risk_category || 'moderate').toLowerCase()

      if (zone && zone !== 'all') {
        if (dZone !== zone.toLowerCase()) return false
      }

      if (districtFilter !== 'all') {
        if (risk !== districtFilter) return false
      }

      return true
    })

    return { ...geoJsonData, features: features.length > 0 ? features : geoJsonData.features }
  }, [geoJsonData, zone, districtFilter])

  // When zone or filter changes, auto-select a valid district
  useEffect(() => {
    if (filteredData?.features?.length) {
      const firstId = getDistrictId(filteredData.features[0])
      if (firstId) {
        setSelectedDistrictId(firstId)
      }
    }
  }, [zone, districtFilter, filteredData])

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
        const gwVal = p.indicator_scores?.groundwater != null ? `${(p.indicator_scores.groundwater * 100).toFixed(0)}% stage` : '-18.4 m'
        const demandVal = p.indicator_scores?.tanker_reliance != null ? `${(p.indicator_scores.tanker_reliance * 100).toFixed(0)}% demand stress` : '124 MLD'

        return {
          id: getDistrictId(match),
          districtNumber: p.ward_id || p.district_id || 12,
          wardNumber: p.ward_id || 12,
          name,
          zone: p.zone ? `${p.zone}` : `${getZoneForDistrict(p).toUpperCase()} Karnataka`,
          risk,
          riskLabel: `${risk[0].toUpperCase()}${risk.slice(1)} Risk`,
          wsi,
          population: p.population ? Number(p.population).toLocaleString('en-IN') : '240,000',
          rainfall: p.indicator_scores?.rainfall != null
            ? `${(p.indicator_scores.rainfall * 100).toFixed(0)}% deficit`
            : '520 mm',
          demand: demandVal,
          groundwater: gwVal,
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
    if (mapRef.current && filteredData) {
      const bounds = L.geoJSON(filteredData).getBounds()
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds, { padding: [20, 20], maxZoom: 8 })
      }
    }
  }

  const onEachFeature = useCallback(
    (feature, layer) => {
      const props = feature.properties || {}
      const dId = getDistrictId(feature)
      const name = props.name || props.district_name || 'Unnamed District'
      const mVal = getMetricValue(props, metric)
      const metricLabel = MAP_METRIC_OPTIONS.find((o) => o.value === metric)?.label || 'Metric'
      const formattedVal = (mVal * (metric === 'wsi' ? 1 : 100)).toFixed(metric === 'wsi' ? 2 : 1) + (metric === 'wsi' ? '' : '%')
      const risk = props.risk_category || 'Moderate'

      layer.bindTooltip(
        `<div style="font-weight:700;font-size:12px;color:#0f172a">${name}</div><div style="font-size:11px;color:#475569">${metricLabel}: <strong>${formattedVal}</strong> · ${risk}</div>`,
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
            const val = getMetricValue(props, metric)
            const color = getMetricColor(val, metric)
            l.setStyle({
              weight: 1.5,
              color: '#ffffff',
              fillColor: color,
              fillOpacity: 0.82,
            })
          }
        },
      })
    },
    [selectedDistrictId, metric, handleSelect]
  )

  const featureStyle = useCallback(
    (feature) => {
      const isSelected = String(getDistrictId(feature)) === String(selectedDistrictId)
      const val = getMetricValue(feature.properties || {}, metric)
      const color = getMetricColor(val, metric)

      return {
        fillColor: color,
        fillOpacity: isSelected ? 0.95 : 0.82,
        color: isSelected ? '#075f50' : '#ffffff',
        weight: isSelected ? 3.2 : 1.4,
      }
    },
    [selectedDistrictId, metric]
  )

  const geoJsonKey = useMemo(() => {
    return `${metric}-${zone}-${districtFilter}-${(filteredData?.features ?? []).map((f) => getDistrictId(f)).join('-')}`
  }, [metric, zone, districtFilter, filteredData])

  const activeLegend = LEGEND_CONFIGS[metric] || LEGEND_CONFIGS.wsi

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

          {/* Floating Dynamic Legend: Bottom-Left */}
          <div className="city-map-legend" aria-label="Risk category legend">
            <h4 className="city-map-legend__title">{activeLegend.title}</h4>
            <ul className="city-map-legend__list">
              {activeLegend.items.map((item, idx) => (
                <li key={idx} className="city-map-legend__item">
                  <span className="city-map-legend__dot" style={{ backgroundColor: item.color }} />
                  <span>{item.label}</span>
                </li>
              ))}
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
            <div className={`city-ward-panel__stat-row ${metric === 'wsi' ? 'city-ward-panel__stat-row--highlighted' : ''}`}>
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
            <div className={`city-ward-panel__stat-row ${metric === 'demand' ? 'city-ward-panel__stat-row--highlighted' : ''}`}>
              <dt className="city-ward-panel__stat-label">Water Demand</dt>
              <dd className="city-ward-panel__stat-val">{selectedDistrict.demand}</dd>
            </div>
            <div className={`city-ward-panel__stat-row ${metric === 'groundwater' ? 'city-ward-panel__stat-row--highlighted' : ''}`}>
              <dt className="city-ward-panel__stat-label">Groundwater Level</dt>
              <dd className="city-ward-panel__stat-val">{selectedDistrict.groundwater}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </article>
  )
}

export default CityWaterStressMap
