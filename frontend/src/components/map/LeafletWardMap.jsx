import { useEffect, useMemo, useRef, useState } from 'react'
import { GeoJSON, MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { fetchWardsGeoJSON } from '../../services/mapService.js'
import { isApiMode } from '../../services/apiClient.js'
import { useCity } from '../../context/CityContext.jsx'

const COLORS = { low: '#3ebf9e', moderate: '#ffc94f', high: '#ff7b45', critical: '#ef4444' }
const fillFor = (risk) => COLORS[String(risk ?? 'moderate').toLowerCase()] ?? COLORS.moderate

function FitBounds({ data }) {
  const map = useMap()
  useEffect(() => {
    if (!data?.features?.length) return
    try { const layer = L.geoJSON(data); const bounds = layer.getBounds(); if (bounds.isValid()) map.fitBounds(bounds.pad(0.08), { maxZoom: 12 }) } catch { /* invalid/empty GIS data: retain default view */ }
  }, [data, map])
  return null
}

/** Real Leaflet + GeoJSON ward layer in API mode; demo mode remains illustrative. */
export default function LeafletWardMap({ wards = [], showAllWhenEmpty = false, selectedWardId, onWardSelect, satellite = false, showBoundaries = true, riskMode = 'baseline', className = '' }) {
  const { selectedCityId } = useCity()
  const cityId = selectedCityId || 'bengaluru'
  const [geojson, setGeojson] = useState(null)
  const [error, setError] = useState(null)
  const layerRef = useRef(null)

  useEffect(() => {
    if (!isApiMode()) return undefined
    const controller = new AbortController()
    fetchWardsGeoJSON({ signal: controller.signal, cityId }).then((data) => { if (!controller.signal.aborted) { setGeojson(data); setError(null) } }).catch((err) => { if (!controller.signal.aborted) setError(err.message || 'Could not load district boundaries.') })
    return () => controller.abort()
  }, [cityId])

  const visibleIds = useMemo(() => new Set(wards.map((ward) => String(ward.id ?? ward.ward_id))), [wards])
  const data = useMemo(() => {
    if (!geojson) return null
    return { ...geojson, features: (geojson.features ?? []).filter((feature) => showAllWhenEmpty || visibleIds.has(String(feature.properties?.ward_id ?? feature.id))) }
  }, [geojson, visibleIds, showAllWhenEmpty])

  const styleFeature = (feature) => {
    const props = feature?.properties ?? {}
    const wardId = String(props.ward_id ?? feature?.id ?? '')
    const isSelected = wardId === String(selectedWardId)
    const risk = riskMode === 'simulation' ? (props.simulated_risk_category ?? props.risk_category) : props.risk_category
    return { color: isSelected ? '#075d4c' : (showBoundaries ? '#ffffff' : fillFor(risk)), weight: isSelected ? 3 : (showBoundaries ? 1.4 : 0.4), opacity: 1, fillColor: fillFor(risk), fillOpacity: satellite ? 0.72 : 0.82 }
  }
  useEffect(() => {
    if (layerRef.current) layerRef.current.setStyle(styleFeature)
  }, [selectedWardId, showBoundaries, satellite, riskMode, data])

  const onEachFeature = (feature, layer) => {
    const props = feature.properties ?? {}
    const wardId = String(props.ward_id ?? feature.id ?? '')
    const name = props.name ?? `District ${wardId}`
    const wsi = Number(props.water_stress_index ?? 0)
    layer.bindPopup(`<strong>${name}</strong><br/>WSI: ${wsi.toFixed(2)}<br/>Risk: ${props.risk_category ?? 'unclassified'}<br/>Population: ${Number(props.population ?? 0).toLocaleString()}`)
    layer.on({ click: () => { const ward = wards.find((item) => String(item.id ?? item.ward_id) === wardId) ?? { ...props, id: wardId, ward_id: wardId, name, wsi, risk: props.risk_category ?? 'moderate', zone: props.zone ?? props.district ?? '' }; onWardSelect?.(ward) } })
  }

  if (!isApiMode()) return null
  return <div className={`leaflet-ward-map ${className}`} style={{ minHeight: '100%', height: '100%', width: '100%' }}>
    <MapContainer center={[12.9716, 77.5946]} zoom={11} scrollWheelZoom className="leaflet-ward-map__map">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url={import.meta.env.VITE_MAP_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'} />
      {data ? <><FitBounds data={data} /><GeoJSON key={(data.features ?? []).map((feature) => feature.id ?? feature.properties?.ward_id).join('|')} ref={layerRef} data={data} style={styleFeature} onEachFeature={onEachFeature} /></> : null}
    </MapContainer>
    {error ? <div className="leaflet-ward-map__error" role="status">{error}</div> : null}
    {!data && !error ? <div className="leaflet-ward-map__loading" role="status">Loading real district boundaries…</div> : null}
  </div>
}
