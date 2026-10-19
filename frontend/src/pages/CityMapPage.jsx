import PageHeader from '../components/layout/PageHeader.jsx'
import DistrictChoropleth from '../components/map/DistrictChoropleth.jsx'

/** District-level water intelligence map; no ward polygons or road basemap. */
export default function CityMapPage() {
  return (
    <main className="district-map-page">
      <PageHeader
        title="District Water Map"
        description="Explore administrative districts across Karnataka. Water-stress colors are shown only when verified district-level evidence is available."
      />
      <DistrictChoropleth />
      <footer className="dashboard-footer">
        <p>WaterMap · District-level water intelligence · Boundary data and analytical observations are validated separately.</p>
      </footer>
    </main>
  )
}
