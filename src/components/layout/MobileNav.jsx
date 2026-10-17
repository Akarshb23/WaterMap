/**
 * Compact navigation for small screens. Renders the same items as the
 * sidebar/navbar once navigation data is wired up.
 */
const MobileNav = ({ items = [] }) => (
  <nav className="mobile-nav" aria-label="Mobile navigation">
    <ul className="mobile-nav__list">
      {items.map((item) => (
        <li key={item.path} className="mobile-nav__item">
          <a href={item.path}>{item.label}</a>
        </li>
      ))}
    </ul>
  </nav>
)

export default MobileNav
