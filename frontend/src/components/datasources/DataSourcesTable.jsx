import {
  Building2,
  CloudRain,
  Compass,
  Droplet,
  Filter,
  Layers,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-react'
import { DATA_SOURCE_TYPE_FILTERS } from '../../data/dataSourcesData.js'

const SOURCE_ICONS = {
  Building2,
  CloudRain,
  Droplet,
  Compass,
  Users,
  Layers,
  ShieldCheck,
  TrendingUp,
}

/**
 * Data Sources Overview table with search and type filter.
 */
const DataSourcesTable = ({
  records = [],
  selectedType,
  onTypeChange,
  searchQuery,
  onSearchChange,
  onResetFilters,
}) => (
  <article className="card datasources-table-card" aria-labelledby="ds-table-title">
    <header className="datasources-table-card__header">
      <div className="datasources-table-card__title-wrap">
        <h3 className="datasources-table-card__title" id="ds-table-title">
          Data Sources Overview
        </h3>
        <p className="datasources-table-card__subtitle">
          Different datasets used for WaterMap's analysis and predictions.
        </p>
      </div>

      <div className="datasources-table-card__actions">
        {/* Type Filter Select */}
        <div className="datasources-table-card__filter-wrap">
          <Filter size={14} className="datasources-table-card__filter-icon" aria-hidden="true" />
          <label className="sr-only" htmlFor="ds-type-filter">
            Filter by data source type
          </label>
          <select
            id="ds-type-filter"
            className="native-select datasources-table-card__select"
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
          >
            {DATA_SOURCE_TYPE_FILTERS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Local Search Input (Supplements Topbar) */}
        <div className="datasources-table-card__search-wrap">
          <Search size={14} className="datasources-table-card__search-icon" aria-hidden="true" />
          <label className="sr-only" htmlFor="ds-table-search">
            Search datasets
          </label>
          <input
            id="ds-table-search"
            type="search"
            className="datasources-table-card__search-input"
            placeholder="Filter datasets..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </header>

    <div className="datasources-table__wrapper">
      {records.length === 0 ? (
        <div className="datasources-table__empty">
          <p>No data sources match the current filter criteria.</p>
          <button
            type="button"
            className="btn btn--outline btn--sm"
            onClick={onResetFilters}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <table className="datasources-table">
          <thead>
            <tr>
              <th scope="col" className="datasources-table__th-num">#</th>
              <th scope="col" className="datasources-table__th-source">Data Source</th>
              <th scope="col">Type</th>
              <th scope="col">Key Indicators</th>
              <th scope="col">Coverage</th>
              <th scope="col">Last Updated</th>
              <th scope="col" className="datasources-table__th-status">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((row) => {
              const SourceIcon = SOURCE_ICONS[row.iconName] || Layers
              return (
                <tr key={row.id} className="datasources-table__row">
                  <td className="datasources-table__td-num">{row.index}</td>
                  <td className="datasources-table__td-source">
                    <div className="datasources-table__source-cell">
                      <span className={`datasources-table__source-icon datasources-table__source-icon--${row.iconTone}`}>
                        <SourceIcon size={15} aria-hidden="true" />
                      </span>
                      <span className="datasources-table__source-name">{row.name}</span>
                    </div>
                  </td>
                  <td className="datasources-table__td-type">
                    <span className="datasources-table__type-text">{row.type}</span>
                  </td>
                  <td className="datasources-table__td-indicators">
                    <span className="datasources-table__indicators-text">
                      {row.indicators}
                    </span>
                  </td>
                  <td className="datasources-table__td-coverage">
                    <span className="datasources-table__coverage-text">{row.coverage}</span>
                  </td>
                  <td className="datasources-table__td-updated">
                    <span className="datasources-table__updated-text">{row.lastUpdated}</span>
                  </td>
                  <td className="datasources-table__td-status">
                    <span className="datasources-table__status-pill">
                      {row.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  </article>
)

export default DataSourcesTable
