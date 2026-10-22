import { useState } from 'react'
import { MapPin } from 'lucide-react'
import CityMapFilterBar from '../components/citymap/CityMapFilterBar.jsx'
import InteractiveCityMap from '../components/citymap/InteractiveCityMap.jsx'
import InteractiveWardPanel from '../components/citymap/InteractiveWardPanel.jsx'
import { BANGALORE_DASHBOARD_DISTRICTS } from '../data/bangaloreDashboardData.js'
import cityscape from '../assets/watermap-cityscape.png'
import CompareDistrictsModal from '../components/citymap/CompareDistrictsModal.jsx'
import '../styles/modals.css'
import '../styles/interactive-city-map.css'

export default function CityMapPage() {
  const [view, setView] = useState('wsi')
  const [period, setPeriod] = useState('2024')
  const [zone, setZone] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState(
    () => BANGALORE_DASHBOARD_DISTRICTS.find((w) => w.id === 'district-12') || BANGALORE_DASHBOARD_DISTRICTS[0]
  )
  const [isPanelOpen, setIsPanelOpen] = useState(true)
  const [isCompareOpen, setIsCompareOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const handleSelectDistrict = (district) => {
    setSelectedDistrict(district)
    setIsPanelOpen(true)
  }

  const handleCompareDistricts = () => {
    setIsCompareOpen(true)
  }

  return (
    <div className="interactive-city-map-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification" role="status" style={{
          position: 'fixed',
          top: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          backgroundColor: '#075d4c',
          color: '#ffffff',
          padding: '0.75rem 1.25rem',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          fontSize: '0.85rem',
          fontWeight: '500',
        }}>
          {toastMessage}
        </div>
      )}

      {/* Page Header with Skyline Banner matching Dashboard, Predictions, Simulations, About */}
      <header className="city-map-page-header">
        <div className="city-map-page-header__intro">
          <h1 className="city-map-page-header__title">Interactive City Map</h1>
          <p className="city-map-page-header__subtitle">
            Explore district-level water stress, compare areas, and understand key risk factors.
          </p>
        </div>

        {/* Top-Right Skyline Banner with left side completely blurred */}
        <div className="city-map-header__banner" role="region" aria-label="City geospatial telemetry banner">
          <div
            className="city-map-header__backdrop"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(242, 250, 247, 1) 0%, rgba(242, 250, 247, 0.35) 25%, rgba(242, 250, 247, 0) 55%), url(${cityscape})`,
            }}
            aria-hidden="true"
          />
          <div className="city-map-header__blur-veil" aria-hidden="true" />
          <div className="city-map-header__card">
            <span className="city-map-header__icon">
              <MapPin size={18} aria-hidden="true" />
            </span>
            <div className="city-map-header__text">
              <h2 className="city-map-header__heading">Karnataka Urban Basin</h2>
              <p className="city-map-header__caption">High-resolution geospatial water telemetry.</p>
            </div>
          </div>
        </div>
      </header>

      {/* Filter Toolbar: View, Time Period, Zone + Search */}
      <CityMapFilterBar
        view={view}
        onViewChange={setView}
        period={period}
        onPeriodChange={setPeriod}
        zone={zone}
        onZoneChange={setZone}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Grid: Interactive Map (Left) + District Details (Right) */}
      <div className={`city-map-main-layout ${!isPanelOpen ? 'city-map-main-layout--collapsed' : ''}`}>
        <div style={{ position: 'relative' }}>
          <InteractiveCityMap
            selectedDistrictId={selectedDistrict?.id || 'district-12'}
            onSelectDistrict={handleSelectDistrict}
            view={view}
            period={period}
            zone={zone}
            searchQuery={searchQuery}
          />

          {!isPanelOpen && (
            <button
              type="button"
              className="interactive-map-restore-panel-btn"
              onClick={() => setIsPanelOpen(true)}
            >
              Show {selectedDistrict?.name || 'District'} Details
            </button>
          )}
        </div>

        {isPanelOpen && (
          <InteractiveWardPanel
            district={selectedDistrict}
            onClose={() => setIsPanelOpen(false)}
            onCompare={handleCompareDistricts}
          />
        )}
      </div>

      {/* Compare Districts Interactive Modal */}
      {isCompareOpen && (
        <CompareDistrictsModal
          currentDistrict={selectedDistrict}
          onClose={() => setIsCompareOpen(false)}
        />
      )}
    </div>
  )
}
