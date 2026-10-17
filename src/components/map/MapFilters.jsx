/**
 * Filter panel overlaid on the city map (risk level, layer toggles).
 * State will live in `FilterContext` once implemented.
 */
const MapFilters = ({ children }) => (
  <aside className="map-filters" aria-label="Map filters">
    <h3 className="map-filters__title">Filters</h3>
    <div className="map-filters__body">{children}</div>
  </aside>
)

export default MapFilters
