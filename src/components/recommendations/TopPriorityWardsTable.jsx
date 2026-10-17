import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.js'
import { TOP_PRIORITY_WARDS_DATA } from '../../data/recommendationsData.js'

/**
 * Top Priority Wards table showing current vs projected Water Stress Index
 * and key intervention actions.
 */
const TopPriorityWardsTable = () => (
  <article className="card top-priority-wards-card" aria-labelledby="top-priority-wards-title">
    <header className="top-priority-wards-card__header">
      <h3 className="top-priority-wards-card__title" id="top-priority-wards-title">
        Top Priority Wards
      </h3>
    </header>

    <div className="top-priority-wards-card__table-wrapper">
      <table className="top-priority-wards-table">
        <thead>
          <tr>
            <th scope="col" className="top-priority-wards-table__th-rank">Rank</th>
            <th scope="col">Ward</th>
            <th scope="col" className="top-priority-wards-table__th-center">Current WSI</th>
            <th scope="col" className="top-priority-wards-table__th-center">Projected WSI</th>
            <th scope="col">Key Actions</th>
          </tr>
        </thead>
        <tbody>
          {TOP_PRIORITY_WARDS_DATA.map((row) => {
            const wardLink = ROUTES.WARD_DETAILS.replace(':wardId', row.wardId)
            return (
              <tr key={row.rank} className="top-priority-wards-table__row">
                <td className="top-priority-wards-table__td-rank">{row.rank}</td>
                <td className="top-priority-wards-table__td-ward">
                  <Link
                    to={wardLink}
                    className="top-priority-wards-table__ward-link"
                    title={`View detailed analytics for ${row.ward}`}
                  >
                    {row.ward}
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

export default TopPriorityWardsTable
