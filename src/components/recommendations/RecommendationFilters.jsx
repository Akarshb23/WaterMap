/**
 * Filter bar for recommendations (priority, ward, category).
 * Controlled by the caller.
 */
const RecommendationFilters = ({ children }) => (
  <aside className="recommendation-filters" aria-label="Recommendation filters">
    <h3 className="recommendation-filters__title">Filters</h3>
    <div className="recommendation-filters__body">{children}</div>
  </aside>
)

export default RecommendationFilters
