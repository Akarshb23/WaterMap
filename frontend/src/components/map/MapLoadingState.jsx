import LoadingSpinner from '../common/LoadingSpinner.jsx'

/**
 * Overlay shown while map data or tiles are loading.
 * Renders nothing when the map is ready.
 */
const MapLoadingState = ({ isLoading, label = 'Loading map' }) => {
  if (!isLoading) {
    return null
  }

  return (
    <div className="map-loading-state" role="status" aria-live="polite">
      <LoadingSpinner label={label} />
    </div>
  )
}

export default MapLoadingState
