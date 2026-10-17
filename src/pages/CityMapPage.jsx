import { useMemo, useState } from 'react'
import CityMapCanvas from '../components/citymap/CityMapCanvas.jsx'
import CityMapFilters from '../components/citymap/CityMapFilters.jsx'
import WardDetailsPanel from '../components/citymap/WardDetailsPanel.jsx'
import PageHeader from '../components/layout/PageHeader.jsx'
import { CITY_MAP_WARDS, DEMO_DATA_NOTE, DEFAULT_PERIOD } from '../data/cityMapData.js'

const INITIAL_FILTERS = { view: 'wsi', period: DEFAULT_PERIOD, zone: 'all', query: '' }

/**
 * Interactive City Map page: filter toolbar, an empty (yet) map canvas
 * with ready-to-wire overlays, and the Ward 12 detail panel. All values are
 * local demonstration data — the geographical map will be integrated
 * later inside `CityMapCanvas`.
 */
const CityMapPage = () => {
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [isPanelOpen, setPanelOpen] = useState(true)

  /** Demo wards matching the Zone filter and the ward/area search query. */
  const matchedWards = useMemo(() => {
    const query = filters.query.trim().toLowerCase()
    return CITY_MAP_WARDS.filter((ward) => {
      const matchesZone = filters.zone === 'all' || ward.zoneKey === filters.zone
      const matchesQuery =
        query === '' ||
        ward.name.toLowerCase().includes(query) ||
        ward.zone.toLowerCase().includes(query)
      return matchesZone && matchesQuery
    })
  }, [filters.zone, filters.query])

  return (
    <div className="city-map-page">
      <div className="city-map-heading">
        <PageHeader
          title="Interactive City Map"
          description="Explore ward-level water stress, compare areas, and understand key risk factors."
        />
        <span className="city-map-heading__accent" aria-hidden="true">
          <span className="city-map-heading__bubble city-map-heading__bubble--one" />
          <span className="city-map-heading__bubble city-map-heading__bubble--two" />
          <span className="city-map-heading__drop" />
        </span>
      </div>

      <CityMapFilters filters={filters} onChange={setFilters} />

      <section className="card city-map-workspace" aria-label="City map workspace">
        <div
          className={`city-map-workspace__grid${
            isPanelOpen ? '' : ' city-map-workspace__grid--full'
          }`}
        >
          <CityMapCanvas
            filters={filters}
            matchedWards={matchedWards}
            isPanelOpen={isPanelOpen}
            onRestorePanel={() => setPanelOpen(true)}
          />
          {isPanelOpen ? <WardDetailsPanel onClose={() => setPanelOpen(false)} /> : null}
        </div>
      </section>

      <footer className="dashboard-footer">
        <p>WaterMap · Urban Water Intelligence — {DEMO_DATA_NOTE.toLowerCase()}</p>
      </footer>
    </div>
  )
}

export default CityMapPage
