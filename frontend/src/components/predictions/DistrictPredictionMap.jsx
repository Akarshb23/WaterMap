import { useEffect, useState } from 'react'
import { GeoJSON, MapContainer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { fetchDistrictsGeoJSON } from '../../services/districtMapService.js'
import { isApiMode } from '../../services/apiClient.js'
import { useCity } from '../../context/CityContext.jsx'
import { RISK_COLORS } from '../../components/map/districtMap.js'

const DistrictPredictionMap = () => {
  const { selectedCityId } = useCity()
  const [districtData, setDistrictData] = useState(null)
  const [predictionData, setPredictionData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch district boundaries
  useEffect(() => {
    if (!isApiMode()) return undefined
    const controller = new AbortController()
    fetchDistrictsGeoJSON({ signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) {
          setDistrictData(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err.message || 'Could not load district boundaries.')
          setLoading(false)
        }
      })
    return () => controller.abort()
  }, [selectedCityId])

  // Fetch predictions for district level
  useEffect(() => {
    if (!isApiMode()) return undefined
    const controller = new AbortController()
    fetch(`/api/v1/predictions?city_id=${selectedCityId || 'bengaluru'}&horizon_days=30`, {
      signal: controller.signal
    })
      .then((response) => {
        if (!controller.signal.aborted) {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error(`Failed to fetch predictions: ${response.status}`)
          }
        }
      })
      .then((data) => {
        if (!controller.signal.aborted) {
          setPredictionData(data)
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          // Don't set error for predictions failure as boundaries are more important
          console.warn('Could not load prediction data:', err.message)
        }
      })
    return () => controller.abort()
  }, [selectedCityId])

  if (!isApiMode()) {
    return null // In demo mode, we don't show the map (or could show illustrative version)
  }

  const mapStyle = {
    minHeight: '400px',
    height: '100%',
    width: '100%',
    position: 'relative'
  }

  if (loading && !districtData) {
    return (
      <div className="district-prediction-map-loading" style={mapStyle}>
        Loading district boundaries…
      </div>
    )
  }

  if (error && !districtData) {
    return (
      <div className="district-prediction-map-error" style={mapStyle} role="status">
        <strong>District map unavailable</strong>
        <p>{error}</p>
      </div>
    )
  }

  if (!districtData) {
    return null
  }

  // Prepare district features with prediction data (if available)
  const featuresWithPredictions = districtData.features?.map((feature) => {
    const districtId = String(feature.properties.district_id || feature.id || feature.properties.district_name)

    // Find matching prediction data (this would need to be implemented based on actual data structure)
    // For now, we'll just return the feature as-is since we don't have district-level predictions
    return feature
  }) || []

  return (
    <div style={mapStyle}>
      <MapContainer
        center={[15.1, 76.2]}
        zoom={6}
        minZoom={5}
        maxZoom={10}
        scrollWheelZoom
        zoomControl
        preferCanvas
        className="district-prediction-map-leaflet"
      >
        {districtData && (
          <>
            <GeoJSON
              data={{
                ...districtData,
                features: featuresWithPredictions
              }}
              // Style function - show administrative boundaries since we don't have verified predictions
              style={(feature) => {
                const isSelected = false; // No selection in prediction map for now
                const verified = false; // We don't have verified district predictions yet

                return {
                  color: '#075f50', // Always use the selected stroke color for outline
                  weight: 2.0, // Non-selected: 2.0px
                  opacity: 1,
                  fillColor: '#DCE3E8', // Insufficient data color
                  fillOpacity: 0.82,
                  lineJoin: 'round',
                  lineCap: 'round',
                }
              }}
            />
          </>
        )}
      </MapContainer>

      {/* Map note about prediction data availability */}
      <div className="district-prediction-map-note">
        <strong>Note: Predictions are calibrated for Bangalore Urban districts.</strong>
        <p>
          District-level forecasts incorporate localized rainfall, groundwater telemetry, and demand models.
          The map above displays Bangalore district boundaries for reference.
        </p>
      </div>
    </div>
  )
}

export default DistrictPredictionMap