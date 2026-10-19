import { ShieldCheck, MapPinned, Database, Droplet } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader.jsx'
import DistrictChoropleth from '../components/map/DistrictChoropleth.jsx'

/** District-first dashboard. It deliberately avoids presenting ward/demo metrics as district facts. */
export default function DashboardPage() {
  return (
    <div className="dashboard-page district-dashboard">
      <header className="dashboard-heading">
        <PageHeader
          title="District Water Dashboard"
          description="Explore district boundaries and the availability of verified water-stress data for Karnataka."
        />
        <span className="data-source-badge data-source-badge--mock" title="District-level measurements are not yet verified">
          <span aria-hidden="true" className="data-source-badge__dot" />
          Data validation required
        </span>
      </header>

      <section className="district-overview-grid" aria-label="Data status">
        <article className="district-overview-card">
          <span className="district-overview-card__icon"><MapPinned size={20} /></span>
          <div><p>Geographic level</p><strong>District</strong><small>Karnataka administrative boundaries</small></div>
        </article>
        <article className="district-overview-card">
          <span className="district-overview-card__icon"><Droplet size={20} /></span>
          <div><p>Water Stress Index</p><strong>Not available</strong><small>No verified district score connected</small></div>
        </article>
        <article className="district-overview-card">
          <span className="district-overview-card__icon"><Database size={20} /></span>
          <div><p>Data coverage</p><strong>Under validation</strong><small>Source and geography matching required</small></div>
        </article>
        <article className="district-overview-card">
          <span className="district-overview-card__icon"><ShieldCheck size={20} /></span>
          <div><p>Data integrity</p><strong>Missing ≠ zero</strong><small>Unsupported districts stay unclassified</small></div>
        </article>
      </section>

      <DistrictChoropleth />

      <section className="district-dashboard-note" aria-label="Data methodology note">
        <strong>Why some districts may be grey</strong>
        <p>Grey means the application does not currently have sufficient verified district-level evidence to assign a water-stress category. It does not mean low stress. Existing ward records and synthetic demo rows are not automatically treated as district observations.</p>
      </section>
      <footer className="dashboard-footer"><p>WaterMap · District-level water intelligence · Boundary availability and water-stress evidence are validated separately.</p></footer>
    </div>
  )
}
