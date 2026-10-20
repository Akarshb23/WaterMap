import { CATEGORY_FILTERS, PRIORITY_FILTERS, SORT_OPTIONS } from '../../data/recommendationsData.js'

/**
 * Filter bar for recommendations: category pills on the left,
 * risk priority level select and sort select on the right.
 */
const RecommendationFilters = ({
  category,
  onCategoryChange,
  priority,
  onPriorityChange,
  sortBy,
  onSortChange,
  categoryCounts = {},
}) => (
  <div className="recommendation-filters-bar" aria-label="Recommendation filters and sorting">
    {/* Category Pills */}
    <div className="recommendation-filters-bar__pills" role="tablist" aria-label="Filter by category">
      {CATEGORY_FILTERS.map((cat) => {
        const count = categoryCounts[cat.id]
        return (
          <button
            key={cat.id}
            type="button"
            className={`recommendation-filters-bar__pill${
              category === cat.id ? ' recommendation-filters-bar__pill--active' : ''
            }`}
            onClick={() => onCategoryChange(cat.id)}
            role="tab"
            aria-selected={category === cat.id}
          >
            <span>{cat.label}</span>
            {typeof count === 'number' && (
              <span className="recommendation-filters-bar__pill-count">
                ({count})
              </span>
            )}
          </button>
        )
      })}
    </div>

    {/* Dropdowns on the right */}
    <div className="recommendation-filters-bar__selects">
      <div className="recommendation-filters-bar__select-wrap">
        <label className="sr-only" htmlFor="recommendations-priority-select">
          Filter by risk level
        </label>
        <select
          id="recommendations-priority-select"
          className="native-select recommendation-filters-bar__select"
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
        >
          {PRIORITY_FILTERS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="recommendation-filters-bar__select-wrap">
        <label className="sr-only" htmlFor="recommendations-sort-select">
          Sort recommendations
        </label>
        <select
          id="recommendations-sort-select"
          className="native-select recommendation-filters-bar__select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>
)

export default RecommendationFilters
