import { Outlet } from 'react-router-dom'
import Footer from './Footer.jsx'
import Navbar from './Navbar.jsx'

/**
 * Public marketing/guest layout: navbar, routed content and footer.
 */
const PublicLayout = () => (
  <div className="public-layout">
    <Navbar />
    <main className="public-layout__content">
      <Outlet />
    </main>
    <Footer />
  </div>
)

export default PublicLayout
