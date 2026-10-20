/**
 * Filters for the predictions page (horizon, district, scenario).
 * Controlled by the caller; state wiring comes with page implementation.
 */
const ForecastFilters = ({ children }) => (
  <aside className="forecast-filters" aria-label="Forecast filters">
    <h3 className="forecast-filters__title">Forecast filters</h3>
    <div className="forecast-filters__body">{children}</div>
  </aside>
)

export default ForecastFilters
