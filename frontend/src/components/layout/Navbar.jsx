import { Link } from 'react-router-dom'
import BrandMark from '../common/BrandMark.jsx'

/**
 * Public site navbar with official WaterMap brand mark.
 */
const Navbar = () => (
  <header className="navbar">
    <Link className="navbar__brand" to="/" aria-label="WaterMap home">
      <span className="navbar__logo">
        <BrandMark id="wm-drop-navbar" size={26} />
      </span>
      <span>WaterMap</span>
    </Link>
    <nav className="navbar__links" aria-label="Public navigation">
      {/* Navigation items pending implementation */}
    </nav>
  </header>
)

export default Navbar
