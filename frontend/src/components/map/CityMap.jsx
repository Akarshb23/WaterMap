/**
 * Interactive city map placeholder.
 * A react-leaflet map (tiles + ward layers) will be rendered here once the
 * map data and tile configuration are wired up.
 */
const CityMap = ({ height = 480 }) => (
  <div className="city-map" style={{ minHeight: `${height}px` }} role="img" aria-label="City map placeholder">
    <p className="city-map__placeholder">Interactive map pending implementation.</p>
  </div>
)

export default CityMap
