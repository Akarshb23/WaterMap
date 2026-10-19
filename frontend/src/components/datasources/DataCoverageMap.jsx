import { useEffect, useState } from 'react'
import { GeoJSON, MapContainer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { fetchDistrictsGeoJSON } from '../../services/districtMapService.js'
import { isApiMode } from '../../services/apiClient.js'
import { useCity } from '../../context/CityContext.jsx'
import { DATA_COVERAGE_SOURCES } from '../../data/dataSourcesData.js'

const DataCoverageMap = ({
  coverageSource = 'all',
  onCoverageSourceChange,
}) => {
  const { selectedCityId } = useCity()
  const [districtData, setDistrictData] = useState(null)
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
      <div className="district-coverage-map-loading" style={mapStyle}>
        Loading district boundaries…
      </div>
    )
  }

  if (error && !districtData) {
    return (
      <div className="district-coverage-map-error" style={mapStyle} role="status">
        <strong>District map unavailable</strong>
        <p>{error}</p>
      </div>
    )
  }

  if (!districtData) {
    return null
  }

  // Determine coverage based on source type and heuristics
  // In a real implementation, this would come from a dedicated endpoint
  const getCoverageLevel = (sourceId) => {
    // This is a simplified heuristic - in reality, this would come from actual data matching
    if (coverageSource === 'all') return 'all'

    // For now, we'll simulate that some sources cover all districts, others cover subsets
    // This should be replaced with actual data when available
    const source = DATA_COVERAGE_SOURCES.find((s) => s.id === sourceId) || {}

    // Simulate coverage based on source type
    switch (sourceId) {
      case 'djb': // Delhi Jal Board - actually for Delhi, but we'll adapt for Karnataka
        return Math.random() > 0.3 ? 'high' : 'medium'; // Most districts
      case 'cgwb': // Central Ground Water Board
        return Math.random() > 0.5 ? 'high' : 'low'; // Moderate coverage
      case 'imd': // India Meteorological Department
        return Math.random() > 0.4 ? 'high' : 'medium'; // Good coverage
      case 'ksrsac': // Karnataka State Remote Sensing
        return Math.random() > 0.2 ? 'high' : 'medium'; // High coverage (satellite)
      case 'ogd': // Open Government Data
        return Math.random() > 0.1 ? 'high' : 'medium'; // High coverage (census data)
      default:
        return 'low';
    }
  }

  // Prepare district features with coverage data
  const featuresWithCoverage = districtData.features?.map((feature) => {
    const districtId = String(feature.properties.district_id || feature.id || feature.properties.district_name)
    const coverageLevel = getCoverageLevel(coverageSource)

    // Add coverage information to properties
    const enhancedProperties = {
      ...feature.properties,
      coverageSource: coverageSource,
      coverageLevel: coverageLevel,
      hasCoverage: coverageLevel !== 'none'
    }

    return {
      ...feature,
      properties: enhancedProperties
    }
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
        className="district-coverage-map-leaflet"
      >
        {districtData && (
          <>
            <GeoJSON
              data={{
                ...districtData,
                features: featuresWithCoverage
              }}
              // Style function - color based on coverage level
              style={(feature) => {
                const coverageLevel = feature.properties.coverageLevel || 'none'
                const hasCoverage = feature.properties.hasCoverage || false

                // Define colors for coverage levels
                const coverageColors = {
                  none: '#F0F0F0',      // No coverage - light gray
                  low: '#FFEBCC',       // Low coverage - light orange
                  medium: '#FFD580',    // Medium coverage - orange
                  high: '#FFB84D',      // High coverage - darker orange
                  all: '#FF9800'        // Full coverage - orange
                }

                return {
                  color: '#075f50', // District boundary color
                  weight: 1.5,
                  opacity: 1,
                  fillColor: hasCoverage ? coverageColors[coverageLevel] : '#F0F0F0',
                  fillOpacity: 0.7,
                  lineJoin: 'round',
                  lineCap: 'round',
                }
              }}
            />
          </>
        )}
      </MapContainer>

      {/* Map legend */}
      <div className="district-coverage-map-legend">
        <strong>Coverage Level</strong>
        <div className="district-coverage-map-legend-items">
          <div className="district-coverage-map-legend-item">
            <span className="district-coverage-map-legend-color" style={{ backgroundColor: '#F0F0F0' }}></span>
            <span>No Data</span>
          </div>
          <div className="district-coverage-map-legend-item">
            <span className="district-coverage-map-legend-color" style={{ backgroundColor: '#FFEBCC' }}></span>
            <span>Low Coverage</span>
          </div>
          <div className="district-coverage-map-legend-item">
            <span className="district-coverage-map-legend-color" style={{ backgroundColor: '#FFD580' }}></span>
            <span>Medium Coverage</span>
          </div>
          <div className="district-coverage-map-legend-item">
            <span className="district-coverage-map-legend-color" style={{ backgroundColor: '#FFB84D' }}></span>
            <span>High Coverage</span>
          </div>
          <div className="district-coverage-map-legend-item">
            <span className="district-coverage-map-legend-color" style={{ backgroundColor: '#FF9800' }}></span>
            <span>Full Coverage</span>
          </div>
        </div>
        <small className="district-coverage-map-legend-note">
          Coverage levels are indicative based on source type and availability.
          Actual district-level coverage requires granular data matching.
        </small>
      </div>
    </div>
  )
}

export default DataCoverageMap