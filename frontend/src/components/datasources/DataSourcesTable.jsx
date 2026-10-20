import {
  BookOpen,
  Building2,
  CloudRain,
  Compass,
  Droplet,
  Layers,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-react'

const SOURCE_ICONS = {
  Building2,
  CloudRain,
  Droplet,
  Compass,
  Users,
  BookOpen,
  Layers,
  ShieldCheck,
  TrendingUp,
}

/**
 * Data Sources Overview table matching the reference design.
 * Features 8 verified data sources, clean typography, category tags, and active status pills.
 */
const DataSourcesTable = ({ records = [] }) => (
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
    </header>

    <div className="datasources-table__wrapper">
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
    </div>
  </article>
)

export default DataSourcesTable
