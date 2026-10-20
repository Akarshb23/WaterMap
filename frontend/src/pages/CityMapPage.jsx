import { useState } from 'react'
import CityMapFilterBar from '../components/citymap/CityMapFilterBar.jsx'
import InteractiveCityMap from '../components/citymap/InteractiveCityMap.jsx'
import InteractiveWardPanel from '../components/citymap/InteractiveWardPanel.jsx'
import { DELHI_DASHBOARD_WARDS } from '../data/delhiDashboardData.js'
import '../styles/interactive-city-map.css'

export default function CityMapPage() {
  const [view, setView] = useState('wsi')
  const [period, setPeriod] = useState('2024')
  const [zone, setZone] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedWard, setSelectedWard] = useState(
    () => DELHI_DASHBOARD_WARDS.find((w) => w.id === 'ward-12') || DELHI_DASHBOARD_WARDS[0]
  )
  const [isPanelOpen, setIsPanelOpen] = useState(true)
  const [toastMessage, setToastMessage] = useState(null)

  const handleSelectWard = (ward) => {
    setSelectedWard(ward)
    setIsPanelOpen(true)
  }

  const handleCompareWards = (ward) => {
    setToastMessage(`Comparing ${ward.name} with city average. Full comparison matrix loaded.`)
    setTimeout(() => setToastMessage(null), 3500)
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
          fontWeight: '600',
        }}>
          {toastMessage}
        </div>
      )}

      {/* Page Header with Botanical Leaves Decoration */}
      <header className="city-map-page-header">
        <div className="city-map-page-header__intro">
          <h1 className="city-map-page-header__title">Interactive City Map</h1>
          <p className="city-map-page-header__subtitle">
            Explore ward-level water stress, compare areas, and understand key risk factors.
          </p>
        </div>

        {/* Botanical Foliage Watermark on Top-Right */}
        <svg viewBox="0 0 160 120" className="city-map-page-header__foliage" aria-hidden="true">
          <defs>
            <linearGradient id="foliageGrad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#45bd9b" />
              <stop offset="100%" stopColor="#075d4c" />
            </linearGradient>
            <linearGradient id="foliageGrad2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          <path
            d="M 160 0 Q 120 40 80 85 Q 50 115 10 120"
            fill="none"
            stroke="#075d4c"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.35"
          />
          {/* Leaves */}
          <path d="M 120 30 Q 100 10 85 25 Q 105 45 120 30 Z" fill="url(#foliageGrad1)" opacity="0.85" />
          <path d="M 95 55 Q 70 40 60 60 Q 85 75 95 55 Z" fill="url(#foliageGrad2)" opacity="0.9" />
          <path d="M 140 10 Q 125 -10 110 5 Q 125 25 140 10 Z" fill="url(#foliageGrad1)" opacity="0.75" />
          <path d="M 68 85 Q 45 75 35 95 Q 60 105 68 85 Z" fill="url(#foliageGrad2)" opacity="0.85" />
          <path d="M 38 108 Q 15 105 10 120 Q 30 125 38 108 Z" fill="url(#foliageGrad1)" opacity="0.9" />
        </svg>
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

      {/* Main Grid: Interactive Map (Left) + Ward Details (Right) */}
      <div className={`city-map-main-layout ${!isPanelOpen ? 'city-map-main-layout--collapsed' : ''}`}>
        <div style={{ position: 'relative' }}>
          <InteractiveCityMap
            selectedWardId={selectedWard?.id || 'ward-12'}
            onSelectWard={handleSelectWard}
            zone={zone}
            searchQuery={searchQuery}
          />

          {!isPanelOpen && (
            <button
              type="button"
              className="interactive-map-restore-panel-btn"
              onClick={() => setIsPanelOpen(true)}
            >
              Show {selectedWard?.name || 'Ward'} Details
            </button>
          )}
        </div>

        {isPanelOpen && (
          <InteractiveWardPanel
            ward={selectedWard}
            onClose={() => setIsPanelOpen(false)}
            onCompare={handleCompareWards}
          />
        )}
      </div>
    </div>
  )
}
