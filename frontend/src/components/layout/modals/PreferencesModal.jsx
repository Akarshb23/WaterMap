import { useState, useEffect } from 'react'
import {
  Settings,
  MapPin,
  Cpu,
  CloudSun,
  BellRing,
  Activity,
  Layers,
  Save,
  RotateCcw,
  X,
  CheckCircle2,
} from 'lucide-react'
import { useCity } from '../../../context/CityContext.jsx'

const DEFAULT_PREFERENCES = {
  stressEngine: 'composite',
  climateScenario: 'ssp245',
  criticalThreshold: 0.75,
  autoRefreshTelemetry: true,
  refreshInterval: '5m',
  units: 'metric',
  basemapStyle: 'satellite',
  highContrastPills: true,
}

const PreferencesModal = ({ isOpen, onClose, onShowToast }) => {
  const { selectedCityId, setSelectedCityId } = useCity()

  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem('watermap_planner_preferences')
      return saved ? { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) } : DEFAULT_PREFERENCES
    } catch {
      return DEFAULT_PREFERENCES
    }
  })

  const [localCity, setLocalCity] = useState(selectedCityId || 'bangalore')

  useEffect(() => {
    if (isOpen) {
      setLocalCity(selectedCityId || 'bangalore')
      try {
        const saved = localStorage.getItem('watermap_planner_preferences')
        if (saved) {
          setPreferences({ ...DEFAULT_PREFERENCES, ...JSON.parse(saved) })
        }
      } catch {
        // use default
      }
    }
  }, [isOpen, selectedCityId])

  if (!isOpen) return null

  const handleSave = (e) => {
    e.preventDefault()
    if (localCity !== selectedCityId) {
      setSelectedCityId(localCity)
    }
    localStorage.setItem('watermap_planner_preferences', JSON.stringify(preferences))
    onShowToast?.('Preferences saved and applied across dashboard')
    onClose()
  }

  const handleReset = () => {
    setPreferences(DEFAULT_PREFERENCES)
    setLocalCity('bangalore')
    setSelectedCityId('bangalore')
    localStorage.removeItem('watermap_planner_preferences')
    onShowToast?.('Preferences restored to system defaults')
  }

  return (
    <div className="wm-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="wm-modal wm-preferences-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="preferences-modal-title"
      >
        <header className="wm-modal__header">
          <div className="wm-modal__title-wrap">
            <div className="wm-modal__title-icon wm-modal__title-icon--cyan">
              <Settings size={18} />
            </div>
            <div>
              <h2 id="preferences-modal-title" className="wm-modal__title">
                City & Model Preferences
              </h2>
              <span className="wm-modal__subtitle">
                Configure Hydrological Engines, Basemaps & Simulation Parameters
              </span>
            </div>
          </div>
          <button
            type="button"
            className="wm-modal__close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </header>

        <form onSubmit={handleSave} className="wm-modal__body">
          {/* Section 1: Active Jurisdiction Focus */}
          <div className="wm-pref-section">
            <div className="wm-pref-section__header">
              <MapPin size={16} className="wm-text-emerald" />
              <div>
                <h3 className="wm-pref-section__title">Active Municipal Jurisdiction</h3>
                <p className="wm-pref-section__desc">
                  Select the primary focus territory for telemetry, ward boundaries, and WSI scoring.
                </p>
              </div>
            </div>

            <div className="wm-pref-options-grid">
              {[
                { id: 'bangalore', label: 'Bangalore (Urban Core)', sub: '198 Wards • 8 BBMP Zones' },
                { id: 'bengaluru-urban', label: 'Bengaluru Urban District', sub: 'Extended Metropolitan Area' },
                { id: 'bengaluru-rural', label: 'Bengaluru Rural Catchments', sub: 'Peri-urban Agro-Hydrology' },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`wm-pref-radio-card ${localCity === opt.id ? 'wm-pref-radio-card--selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="cityFocus"
                    value={opt.id}
                    checked={localCity === opt.id}
                    onChange={(e) => setLocalCity(e.target.value)}
                    className="wm-sr-only"
                  />
                  <div className="wm-pref-radio-card__dot">
                    {localCity === opt.id && <CheckCircle2 size={13} />}
                  </div>
                  <div>
                    <div className="wm-pref-radio-card__title">{opt.label}</div>
                    <div className="wm-pref-radio-card__sub">{opt.sub}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Section 2: Stress Calculation Engine */}
          <div className="wm-pref-section">
            <div className="wm-pref-section__header">
              <Cpu size={16} className="wm-text-cyan" />
              <div>
                <h3 className="wm-pref-section__title">Hydrological Stress Index Engine</h3>
                <p className="wm-pref-section__desc">
                  Algorithm applied for calculating composite district vulnerability indices.
                </p>
              </div>
            </div>

            <div className="wm-pref-options-grid">
              {[
                {
                  id: 'composite',
                  title: 'Composite WSI (Standard)',
                  desc: 'Weighted 40% Deficit + 30% Extraction + 20% GW + 10% Infrastructure',
                },
                {
                  id: 'ewsi',
                  title: 'EWSI (Monsoon-Adaptive)',
                  desc: 'Includes high-frequency IMD rainfall anomaly and drought spell coefficient',
                },
                {
                  id: 'falkenmark',
                  title: 'Falkenmark Metric',
                  desc: 'Per capita freshwater availability benchmark (<1,000 m³/capita threshold)',
                },
              ].map((engine) => (
                <label
                  key={engine.id}
                  className={`wm-pref-radio-card ${preferences.stressEngine === engine.id ? 'wm-pref-radio-card--selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="stressEngine"
                    value={engine.id}
                    checked={preferences.stressEngine === engine.id}
                    onChange={(e) =>
                      setPreferences({ ...preferences, stressEngine: e.target.value })
                    }
                    className="wm-sr-only"
                  />
                  <div className="wm-pref-radio-card__dot">
                    {preferences.stressEngine === engine.id && <CheckCircle2 size={13} />}
                  </div>
                  <div>
                    <div className="wm-pref-radio-card__title">{engine.title}</div>
                    <div className="wm-pref-radio-card__sub">{engine.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Section 3: Climate Scenario & Sensitivity */}
          <div className="wm-pref-section">
            <div className="wm-pref-section__header">
              <CloudSun size={16} className="wm-text-amber" />
              <div>
                <h3 className="wm-pref-section__title">Climate Model Scenario & Sensitivity</h3>
                <p className="wm-pref-section__desc">
                  IPCC AR6 downscaled meteorological model used in simulation projections.
                </p>
              </div>
            </div>

            <div className="wm-pref-controls-row">
              <div className="wm-form-group wm-flex-1">
                <label htmlFor="pref-climate-scenario">Projection Scenario</label>
                <select
                  id="pref-climate-scenario"
                  className="wm-form-select"
                  value={preferences.climateScenario}
                  onChange={(e) =>
                    setPreferences({ ...preferences, climateScenario: e.target.value })
                  }
                >
                  <option value="ssp126">SSP1-2.6 (Mitigation: +1.5°C)</option>
                  <option value="ssp245">SSP2-4.5 (Moderate: +2.7°C)</option>
                  <option value="ssp585">SSP5-8.5 (Extreme Stress: +4.4°C)</option>
                </select>
              </div>

              <div className="wm-form-group wm-flex-1">
                <label htmlFor="pref-units">Measurement Units</label>
                <select
                  id="pref-units"
                  className="wm-form-select"
                  value={preferences.units}
                  onChange={(e) =>
                    setPreferences({ ...preferences, units: e.target.value })
                  }
                >
                  <option value="metric">Metric (MLD, MCM, mm)</option>
                  <option value="imperial">Imperial (MGD, Acre-Ft, in)</option>
                </select>
              </div>
            </div>

            <div className="wm-slider-control">
              <div className="wm-slider-control__header">
                <label htmlFor="pref-threshold" className="wm-slider-control__label">
                  <BellRing size={14} className="wm-text-rose" />
                  <span>Critical Water-Stress Alert Threshold</span>
                </label>
                <span className="wm-slider-control__badge">
                  WSI ≥ {Number(preferences.criticalThreshold).toFixed(2)}
                </span>
              </div>
              <input
                id="pref-threshold"
                type="range"
                min="0.50"
                max="0.90"
                step="0.05"
                value={preferences.criticalThreshold}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    criticalThreshold: parseFloat(e.target.value),
                  })
                }
                className="wm-slider"
              />
              <div className="wm-slider-control__ticks">
                <span>0.50 (Moderate)</span>
                <span>0.70</span>
                <span>0.75 (Default)</span>
                <span>0.85</span>
                <span>0.90 (Severe)</span>
              </div>
            </div>
          </div>

          {/* Section 4: Live Telemetry & Basemap */}
          <div className="wm-pref-section">
            <div className="wm-pref-section__header">
              <Activity size={16} className="wm-text-teal" />
              <div>
                <h3 className="wm-pref-section__title">Telemetry Feeds & Visual Theme</h3>
                <p className="wm-pref-section__desc">
                  Real-time synchronization and map styling preferences.
                </p>
              </div>
            </div>

            <div className="wm-pref-toggles-list">
              <div className="wm-pref-toggle-row">
                <div>
                  <div className="wm-pref-toggle-row__title">Real-time Telemetry Polling</div>
                  <div className="wm-pref-toggle-row__desc">
                    Synchronize NWIC reservoir levels & IMD radar sensor feeds every 5 minutes.
                  </div>
                </div>
                <label className="wm-switch">
                  <input
                    type="checkbox"
                    checked={preferences.autoRefreshTelemetry}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        autoRefreshTelemetry: e.target.checked,
                      })
                    }
                  />
                  <span className="wm-switch-slider" />
                </label>
              </div>

              <div className="wm-pref-toggle-row">
                <div>
                  <div className="wm-pref-toggle-row__title">Preferred Basemap Style</div>
                  <div className="wm-pref-toggle-row__desc">
                    Default map tile layer applied across Ward Analytics and Simulation views.
                  </div>
                </div>
                <div className="wm-pref-pill-group">
                  {[
                    { id: 'satellite', label: 'Vibrant Satellite' },
                    { id: 'light', label: 'Clean Canvas' },
                    { id: 'dark', label: 'Dark Analytics' },
                  ].map((mapStyle) => (
                    <button
                      key={mapStyle.id}
                      type="button"
                      className={`wm-pref-pill ${preferences.basemapStyle === mapStyle.id ? 'wm-pref-pill--active' : ''}`}
                      onClick={() =>
                        setPreferences({ ...preferences, basemapStyle: mapStyle.id })
                      }
                    >
                      <Layers size={12} />
                      <span>{mapStyle.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <footer className="wm-modal__footer">
            <button
              type="button"
              className="wm-btn wm-btn--ghost"
              onClick={handleReset}
            >
              <RotateCcw size={14} />
              <span>Reset Defaults</span>
            </button>
            <div className="wm-profile-form__footer-right">
              <button
                type="button"
                className="wm-btn wm-btn--secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="wm-btn wm-btn--primary">
                <Save size={15} />
                <span>Apply Preferences</span>
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  )
}

export default PreferencesModal
