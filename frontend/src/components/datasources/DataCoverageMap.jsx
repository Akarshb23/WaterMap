import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Locate, Maximize2, Minimize2, Minus, Plus } from 'lucide-react'
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { COVERAGE_MAP_LEGEND, DATA_COVERAGE_SOURCES } from '../../data/dataSourcesData.js'
import { fetchDistrictsGeoJSON } from '../../services/districtMapService.js'
import { fetchWardsGeoJSON } from '../../services/mapService.js'

// Deterministic source mapping based on ward ID or index
const SOURCES = ['bwssb', 'cgwb', 'imd', 'census']
const SOURCE_COLORS = {
  bwssb: '#34d399',
  cgwb: '#10b981',
  imd: '#60a5fa',
  census: '#86efac',
}

const getFeatureSource = (feature, index) => {
  const p = feature.properties || {}
  const idStr = String(p.id || p.district_id || p.ward_id || p.name || index)
  let hash = 0
  for (let i = 0; i < idStr.length; i++) {
    hash = (hash << 5) - hash + idStr.charCodeAt(i)
    hash |= 0
  }
  return SOURCES[Math.abs(hash) % SOURCES.length]
}

function FitDistrictsBounds({ data }) {
  const map = useMap()
  useEffect(() => {
    if (!data || !data.features || data.features.length === 0) return
    try {
      const geoLayer = L.geoJSON(data)
      const bounds = geoLayer.getBounds()
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [25, 25], maxZoom: 7, animate: false })
      }
    } catch (e) {
      console.warn('Could not fit bounds:', e)
    }
  }, [data, map])
  return null
}

/**
 * Data Coverage Map showing spatial coverage of different data sources across Bangalore.
 * Uses interactive Leaflet GeoJSON polygons, maintaining exact existing UI typography,
 * controls, and surrounding layout cards.
 */
const DataCoverageMap = ({
  coverageSource = 'all',
  onCoverageSourceChange,
}) => {
  const [geoJsonData, setGeoJsonData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDistrict, setSelectedDistrict] = useState(null)
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
    let isMounted = true

    async function loadData() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchDistrictsGeoJSON()

        if (isMounted) {
          if (data && data.features && data.features.length > 0) {
            setGeoJsonData(data)
          } else {
            setError('No Karnataka boundary polygons found.')
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || 'Failed to load spatial boundaries')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadData()
    return () => {
      isMounted = false
    }
  }, [])

  const handleZoomIn = () => {
    if (mapRef.current) mapRef.current.zoomIn()
  }

  const handleZoomOut = () => {
    if (mapRef.current) mapRef.current.zoomOut()
  }

  const handleResetZoom = () => {
    setSelectedDistrict(null)
    if (mapRef.current && geoJsonData) {
      try {
        const geoLayer = L.geoJSON(geoJsonData)
        const bounds = geoLayer.getBounds()
        if (bounds.isValid()) {
          mapRef.current.fitBounds(bounds, { padding: [16, 16], maxZoom: 13 })
        }
      } catch (e) {
        console.warn(e)
      }
    }
  }

  const featureStyle = useCallback(
    (feature) => {
      const idx = geoJsonData?.features ? geoJsonData.features.indexOf(feature) : 0
      const source = getFeatureSource(feature, idx)
      const isMatched = coverageSource === 'all' || source === coverageSource
      const color = SOURCE_COLORS[source] || '#60a5fa'
      const p = feature.properties || {}
      const id = p.id || p.district_id || p.name
      const isSelected = selectedDistrict?.id === id

      return {
        fillColor: color,
        fillOpacity: isMatched ? (isSelected ? 0.9 : 0.65) : 0.15,
        color: isSelected ? '#0f172a' : '#ffffff',
        weight: isSelected ? 2.5 : 1.2,
        dashArray: isSelected ? '' : '2, 2',
      }
    },
    [coverageSource, selectedDistrict, geoJsonData]
  )

  const onEachFeature = useCallback(
    (feature, layer) => {
      const p = feature.properties || {}
      const name = p.name || p.district_name || p.ward_name || 'Bangalore District'
      const idx = geoJsonData?.features ? geoJsonData.features.indexOf(feature) : 0
      const source = getFeatureSource(feature, idx)
      const sourceName = source.toUpperCase()

      layer.bindTooltip(
        `<div style="font-family: inherit; font-size: 11px; padding: 2px 4px;">
          <strong style="color: #0f172a;">${name}</strong><br/>
          <span style="color: #475569;">Coverage: <strong>${sourceName}</strong></span>
        </div>`,
        { sticky: true, direction: 'auto', opacity: 0.95 }
      )

      layer.on({
        click: () => {
          setSelectedDistrict({
            id: p.id || p.district_id || p.name,
            name,
            source,
          })
        },
        mouseover: (e) => {
          const l = e.target
          l.setStyle({
            weight: 2,
            color: '#0f172a',
            fillOpacity: 0.85,
          })
          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            l.bringToFront()
          }
        },
        mouseout: (e) => {
          const l = e.target
          const isMatched = coverageSource === 'all' || source === coverageSource
          const isSelected = selectedDistrict?.id === (p.id || p.district_id || p.name)
          l.setStyle({
            fillColor: SOURCE_COLORS[source] || '#60a5fa',
            fillOpacity: isMatched ? (isSelected ? 0.9 : 0.65) : 0.15,
            color: isSelected ? '#0f172a' : '#ffffff',
            weight: isSelected ? 2.5 : 1.2,
            dashArray: isSelected ? '' : '2, 2',
          })
        },
      })
    },
    [coverageSource, selectedDistrict, geoJsonData]
  )

  const geoJsonKey = useMemo(() => {
    return `cov-map-${coverageSource}-${selectedDistrict?.id || 'none'}-${geoJsonData ? geoJsonData.features?.length : 0}`
  }, [coverageSource, selectedDistrict, geoJsonData])

  return (
    <article className="card data-coverage-map-card" aria-labelledby="coverage-map-title">
      <header className="data-coverage-map-card__header">
        <div className="data-coverage-map-card__title-wrap">
          <h3 className="data-coverage-map-card__title" id="coverage-map-title">
            Data Coverage Map
          </h3>
          <p className="data-coverage-map-card__subtitle">
            Spatial coverage of different data sources.
          </p>
        </div>

        <div className="data-coverage-map-card__selector-wrap">
          <label className="data-coverage-map-card__select-label" htmlFor="coverage-source-select">
            Select Source
          </label>
          <select
            id="coverage-source-select"
            className="native-select data-coverage-map-card__select"
            value={coverageSource}
            onChange={(e) => onCoverageSourceChange?.(e.target.value)}
          >
            {DATA_COVERAGE_SOURCES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className={`data-coverage-map__canvas ${isFullscreen ? 'map-viewport--fullscreen' : ''}`} role="region" aria-label="Data coverage map" style={{ position: 'relative' }}>
        {/* Floating Controls (top-left) */}
        <div className="data-coverage-map__controls" role="toolbar" aria-label="Map navigation controls" style={{ zIndex: 1000 }}>
          <button
            type="button"
            className="data-coverage-map__ctrl-btn"
            onClick={handleZoomIn}
            aria-label="Zoom in"
            title="Zoom in"
          >
            <Plus size={16} />
          </button>
          <button
            type="button"
            className="data-coverage-map__ctrl-btn"
            onClick={handleZoomOut}
            aria-label="Zoom out"
            title="Zoom out"
          >
            <Minus size={16} />
          </button>
          <button
            type="button"
            className="data-coverage-map__ctrl-btn"
            onClick={handleResetZoom}
            aria-label="Reset zoom"
            title="Reset map view"
          >
            <Locate size={16} />
          </button>
          <button
            type="button"
            className="data-coverage-map__ctrl-btn"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit full screen' : 'Full screen view'}
            title={isFullscreen ? 'Exit full screen' : 'Full screen view'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>

        {/* Floating Legend Overlay (top-right) */}
        <div className="data-coverage-map__legend" aria-label="Data coverage layers legend" style={{ zIndex: 1000 }}>
          <ul className="data-coverage-map__legend-list">
            {COVERAGE_MAP_LEGEND.map((item) => (
              <li
                key={item.id}
                className={`data-coverage-map__legend-item ${coverageSource === item.id ? 'data-coverage-map__legend-item--active' : ''}`}
                onClick={() => onCoverageSourceChange?.(coverageSource === item.id ? 'all' : item.id)}
                role="button"
                tabIndex={0}
              >
                <span
                  className="data-coverage-map__legend-swatch"
                  style={{ backgroundColor: item.color }}
                />
                <span className="data-coverage-map__legend-text">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Leaflet GeoJSON Polygon Map Container */}
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
            style={{ width: '100%', height: '100%', background: '#f0f7f8' }}
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
              </>
            )}
          </MapContainer>
        </div>
      </div>
    </article>
  )
}

export default DataCoverageMap