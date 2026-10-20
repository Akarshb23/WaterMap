import { WARD_RAW_DATA } from '../../data/wardDetailsData.js'

/**
 * Raw Data tab: a structured table of the illustrative ward metrics
 * (metric, value, unit, year). Metrics without data render an empty
 * state row instead of a fabricated value. All values are illustrative
 * demonstration data — not live sensor readings.
 */
const WardRawDataTab = () => (
  <section className="card dashboard-card" aria-labelledby="ward-raw-data-title">
    <div className="card__header">
      <h2 className="card__title" id="ward-raw-data-title">
        Raw Data
      </h2>
    </div>

    <div className="wards-table-wrap">
      <table className="wards-table">
        <caption className="sr-only">Illustrative raw metrics for this district</caption>
        <thead>
          <tr>
            <th scope="col">Metric</th>
            <th scope="col">Value</th>
            <th scope="col">Unit</th>
            <th scope="col">Year</th>
          </tr>
        </thead>
        <tbody>
          {WARD_RAW_DATA.map((row) => (
            <tr key={row.id}>
              <td className="ward-name">{row.metric}</td>
              {row.value === null ? (
                <td colSpan={3}>
                  <span className="ward-raw-empty">No data available</span>
                </td>
              ) : (
                <>
                  <td>{row.value}</td>
                  <td>{row.unit}</td>
                  <td>{row.year}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <p className="ward-detail__disclaimer">
      Illustrative demonstration data — not live government or sensor readings.
    </p>
  </section>
)

export default WardRawDataTab
