import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.js'
import { TOP_PRIORITY_DISTRICTS_DATA } from '../../data/recommendationsData.js'

/**
 * Top Priority Districts table showing current vs projected Water Stress Index
 * and key intervention actions.
 */
const TopPriorityWardsTable = ({ data, districts }) => {
  const tableData = data || districts || TOP_PRIORITY_DISTRICTS_DATA

  return (
    <article className="card top-priority-wards-card" aria-labelledby="top-priority-districts-title">
      <header className="top-priority-wards-card__header">
        <h3 className="top-priority-wards-card__title" id="top-priority-districts-title">
          Top Priority Districts
        </h3>
      </header>

      <div className="top-priority-wards-card__table-wrapper">
        <table className="top-priority-wards-table">
          <thead>
            <tr>
              <th scope="col" className="top-priority-wards-table__th-rank">Rank</th>
              <th scope="col">District</th>
              <th scope="col" className="top-priority-wards-table__th-center">Current WSI</th>
              <th scope="col" className="top-priority-wards-table__th-center">Projected WSI</th>
              <th scope="col">Key Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => {
              const districtId = row.districtId || row.rank || 12
              const districtLink = `/districts/${districtId}`
              const districtName = row.district || row.name
              return (
                <tr key={row.rank} className="top-priority-wards-table__row">
                  <td className="top-priority-wards-table__td-rank">{row.rank}</td>
                  <td className="top-priority-wards-table__td-ward">
                    <Link
                      to={districtLink}
                      className="top-priority-wards-table__ward-link"
                      title={`View detailed analytics for ${districtName}`}
                    >
                      {districtName}
                    </Link>
                  </td>
                  <td className="top-priority-wards-table__td-center">
                    <span className="top-priority-wards-table__badge-curr">
                      {row.currentWsi.toFixed(2)}
                    </span>
                  </td>
                  <td className="top-priority-wards-table__td-center">
                    <span className="top-priority-wards-table__badge-proj">
                      {row.projectedWsi.toFixed(2)}
                    </span>
                  </td>
                  <td className="top-priority-wards-table__td-actions">
                    <span className="top-priority-wards-table__actions-text">
                      {row.keyActions}
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
}

export default TopPriorityWardsTable
