import { ArrowLeft, BarChart3, MapPin, TriangleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.js'

/**
 * Ward details page header: "Back to Map" link, ward name with risk badge,
 * location meta (zone, population, area) and a "Compare Ward" action.
 *
 * The compare feature has no page in this build, so the button calls
 * `onCompare` and the page shows an informational message instead of
 * navigating to a broken route. A subtle decorative accent (the same
 * bubbles/drop motif used by the City Map heading) sits behind the actions.
 */
const WardHeader = ({ ward = {}, onCompare }) => (
  <header className="ward-page-header">
    <div className="ward-page-header__top">
      <Link className="btn btn--secondary ward-page-header__back" to={ROUTES.CITY_MAP}>
        <ArrowLeft size={15} aria-hidden="true" />
        Back to Map
      </Link>
      <button type="button" className="btn btn--primary ward-page-header__compare" onClick={onCompare}>
        <BarChart3 size={15} aria-hidden="true" />
        Compare District
      </button>
    </div>

    <div className="ward-page-header__identity">
      <div className="ward-page-header__titles">
        <h1 className="ward-page-header__name">{ward.name ?? 'District'}</h1>
        {ward.riskLabel ? (
          <span className="badge badge--danger ward-page-header__badge">
            <TriangleAlert size={12} aria-hidden="true" />
            {ward.riskLabel}
          </span>
        ) : null}
      </div>
      <ul className="ward-page-header__meta">
        <li className="ward-page-header__meta-item">
          <MapPin size={13} aria-hidden="true" />
          {ward.zone}
        </li>
        <li className="ward-page-header__meta-item">Population: {ward.population}</li>
        <li className="ward-page-header__meta-item">Area: {ward.area}</li>
      </ul>
    </div>

    <span className="ward-page-header__accent" aria-hidden="true">
      <span className="ward-page-header__bubble ward-page-header__bubble--one" />
      <span className="ward-page-header__bubble ward-page-header__bubble--two" />
      <span className="ward-page-header__drop" />
    </span>
  </header>
)

export default WardHeader
