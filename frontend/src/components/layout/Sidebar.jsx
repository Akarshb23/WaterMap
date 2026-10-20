import {
  Database,

  Sprout,
  Info,
  LayoutDashboard,
  Map,
  MapPinned,
  ShieldCheck,
  TrendingUp,
  X,
} from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import BrandMark from '../common/BrandMark.jsx'
import cityscape from '../../assets/watermap-cityscape.png'
import { SIDEBAR_NAV_ITEMS } from '../../constants/navigation.js'
import { ROUTES } from '../../constants/routes.js'

/** Lucide icon for each sidebar route. */
const NAV_ICONS = {
  [ROUTES.DASHBOARD]: LayoutDashboard,
  [ROUTES.CITY_MAP]: Map,
  [ROUTES.DISTRICT_DETAILS_HOME]: MapPinned,
  [ROUTES.PREDICTIONS]: TrendingUp,
  [ROUTES.SIMULATION]: Sprout,
  [ROUTES.RECOMMENDATIONS]: ShieldCheck,
  [ROUTES.DATA_SOURCES]: Database,
  [ROUTES.ABOUT]: Info,
}

/**
 * Fixed app sidebar: brand, primary navigation and a CSS-only promo panel.
 * `isOpen` drives the mobile drawer state owned by `AppLayout`.
 */
const Sidebar = ({ isOpen = false, onClose }) => {
  const location = useLocation()

  return (
  <>
    {isOpen ? (
      <button
        type="button"
        className="sidebar__backdrop"
        aria-label="Close navigation"
        onClick={onClose}
      />
    ) : null}
    <aside className={`sidebar${isOpen ? ' sidebar--open' : ''}`} id="app-sidebar">
      <div className="sidebar__brand">
        <Link to="/" className="sidebar__brand-link" aria-label="WaterMap home">
          <span className="sidebar__logo">
          <BrandMark id="wm-drop-sidebar" size={26} />
        </span>
          <span className="sidebar__name">WaterMap</span>
        </Link>
        <button
          type="button"
          className="sidebar__close"
          onClick={onClose}
          aria-label="Close navigation menu"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Primary navigation">
        <ul className="sidebar__list">
          {SIDEBAR_NAV_ITEMS.map((item) => {
            const Icon = NAV_ICONS[item.path] ?? Info
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === ROUTES.HOME}
                  onClick={onClose}
                  className={({ isActive }) => {
                    // `matchPrefix` items stay active for every route under
                    // the prefix (e.g. any /wards/:wardId details page).
                    const active =
                      isActive ||
                      (item.path === ROUTES.CITY_MAP && (location.pathname === '/map' || location.pathname === '/city-map')) ||
                      (item.matchPrefix ? location.pathname.startsWith(item.matchPrefix) : false)
                    return `sidebar__link${active ? ' sidebar__link--active' : ''}`
                  }}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="sidebar__promo">
        <div
          className="sidebar__illustration-placeholder"
          style={{ backgroundImage: `linear-gradient(180deg, rgba(238, 251, 248, 0.05) 0%, rgba(7, 93, 76, 0.10) 42%, rgba(7, 93, 76, 0.88) 100%), url(${cityscape})` }}
          role="img"
          aria-label="Green city skyline beside water"
        />
        <span className="sidebar__promo-bubble sidebar__promo-bubble--one" aria-hidden="true" />
        <span className="sidebar__promo-bubble sidebar__promo-bubble--two" aria-hidden="true" />
        <span className="sidebar__promo-drop" aria-hidden="true" />
        <p>
          Smarter Cities.
          <br />
          Water Secure.
        </p>
      </div>
    </aside>
  </>
  )
}

export default Sidebar
