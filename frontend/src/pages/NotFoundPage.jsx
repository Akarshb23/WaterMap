import { Link } from 'react-router-dom'
import BrandMark from '../components/common/BrandMark.jsx'

/**
 * 404 page rendered for unmatched routes.
 */
const NotFoundPage = () => (
  <section className="page page--not-found" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
    <Link
      to="/"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.55rem',
        textDecoration: 'none',
        color: '#0e2937',
        fontSize: '1.4rem',
        fontWeight: '800',
        letterSpacing: '-0.035em',
        marginBottom: '2rem',
      }}
      aria-label="WaterMap home"
    >
      <BrandMark id="wm-drop-404" size={32} />
      <span>WaterMap</span>
    </Link>
    <h1>404 — Page not found</h1>
    <p style={{ margin: '1rem 0 1.5rem', color: '#55707d' }}>The page you are looking for does not exist.</p>
    <Link
      to="/"
      style={{
        display: 'inline-block',
        padding: '0.65rem 1.4rem',
        borderRadius: '999px',
        backgroundColor: '#0ba984',
        color: '#ffffff',
        fontWeight: '600',
        textDecoration: 'none',
      }}
    >
      Back to home
    </Link>
  </section>
)

export default NotFoundPage
