import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HelpCircle,
  BookOpen,
  Calculator,
  Database,
  CloudLightning,
  Code2,
  ExternalLink,
  X,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react'

const DocumentationModal = ({ isOpen, onClose, onShowToast }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('methodology') // 'methodology' | 'datasources' | 'climate' | 'api'

  if (!isOpen) return null

  const handleGoToAbout = () => {
    onClose()
    navigate('/about')
    onShowToast?.('Navigated to Platform Documentation & Methodology')
  }

  return (
    <div className="wm-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="wm-modal wm-doc-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="doc-modal-title"
      >
        <header className="wm-modal__header">
          <div className="wm-modal__title-wrap">
            <div className="wm-modal__title-icon wm-modal__title-icon--amber">
              <HelpCircle size={18} />
            </div>
            <div>
              <h2 id="doc-modal-title" className="wm-modal__title">
                WaterMap Platform Documentation
              </h2>
              <span className="wm-modal__subtitle">
                Hydrological Modeling Standards, Equations & Telemetry Architecture
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

        {/* Tab Navigation */}
        <div className="wm-modal-tabs">
          {[
            { id: 'methodology', label: 'WSI Methodology', icon: <Calculator size={14} /> },
            { id: 'datasources', label: 'Data Sources & Ingestion', icon: <Database size={14} /> },
            { id: 'climate', label: 'Climate Projections', icon: <CloudLightning size={14} /> },
            { id: 'api', label: 'API Architecture', icon: <Code2 size={14} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`wm-modal-tab-btn ${activeTab === tab.id ? 'wm-modal-tab-btn--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="wm-modal__body wm-doc-body">
          {activeTab === 'methodology' && (
            <div className="wm-doc-pane">
              <div className="wm-doc-callout">
                <h4>Water Stress Index (WSI) Formulation</h4>
                <p>
                  WaterMap computes a normalized dimensionless Composite Water Stress Index (0.0 to 1.0)
                  derived from multi-source hydrological indicators calibrated specifically for Bangalore's
                  dual Cauvery piped delivery and groundwater extraction ecosystem:
                </p>
                <div className="wm-formula-box">
                  <code>
                    WSI = 0.40 × (D<sub>deficit</sub>) + 0.30 × (E<sub>extract</sub>) + 0.20 × (G<sub>deplete</sub>) + 0.10 × (I<sub>infra</sub>)
                  </code>
                </div>
              </div>

              <div className="wm-doc-grid">
                <div className="wm-doc-card">
                  <h5>D<sub>deficit</sub>: Demand-Supply Deficit (40%)</h5>
                  <p>
                    Compares ward-level population water requirement (150 LPCD standard) against actual
                    potable pipeline deliveries tracked through BWSSB bulk supply SCADA meters.
                  </p>
                </div>

                <div className="wm-doc-card">
                  <h5>E<sub>extract</sub>: Groundwater Extraction Ratio (30%)</h5>
                  <p>
                    Ratio of estimated private and commercial borewell extraction to net annual dynamic
                    groundwater recharge evaluated by Central Ground Water Board (CGWB).
                  </p>
                </div>

                <div className="wm-doc-card">
                  <h5>G<sub>deplete</sub>: Aquifer Water Table Trend (20%)</h5>
                  <p>
                    5-year moving trend of piezometric pre- and post-monsoon water depth anomalies across
                    observation wells across the Bangalore metropolitan area.
                  </p>
                </div>

                <div className="wm-doc-card">
                  <h5>I<sub>infra</sub>: Infrastructure Vulnerability (10%)</h5>
                  <p>
                    Distribution losses, pipeline age, non-revenue water (NRW) estimates, and absence of
                    decentralized rainwater harvesting recharge wells.
                  </p>
                </div>
              </div>

              <div className="wm-doc-table-wrap">
                <table className="wm-doc-table">
                  <thead>
                    <tr>
                      <th>WSI Range</th>
                      <th>Classification</th>
                      <th>Hydrological Risk Level</th>
                      <th>Municipal Recommended Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span className="wm-badge wm-badge--low">0.00 – 0.35</span></td>
                      <td>Low Stress</td>
                      <td>Adequate surface supply & stable aquifer</td>
                      <td>Routine water auditing & conservation incentives</td>
                    </tr>
                    <tr>
                      <td><span className="wm-badge wm-badge--medium">0.36 – 0.65</span></td>
                      <td>Moderate Stress</td>
                      <td>Seasonal deficit during pre-monsoon months</td>
                      <td>Expand rainwater harvesting & dual-piping mandates</td>
                    </tr>
                    <tr>
                      <td><span className="wm-badge wm-badge--high">0.66 – 0.80</span></td>
                      <td>High Stress</td>
                      <td>Severe groundwater depletion & supply rationing</td>
                      <td>Prioritize lake restoration & aquifer injection wells</td>
                    </tr>
                    <tr>
                      <td><span className="wm-badge wm-badge--critical">0.81 – 1.00</span></td>
                      <td>Critical Stress</td>
                      <td>Acute water crisis, acute tanker dependence</td>
                      <td>Immediate drought emergency infrastructure intervention</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'datasources' && (
            <div className="wm-doc-pane">
              <p className="wm-doc-intro">
                WaterMap continuously ingests, validates, and aligns multi-agency geospatial and telemetry datasets:
              </p>

              <div className="wm-datasource-list">
                {[
                  {
                    agency: 'India Meteorological Department (IMD)',
                    dataset: '1km Gridded Daily Rainfall & Doppler Weather Radar',
                    latency: 'Real-time (6-hour ingest)',
                    status: 'Active Live Feed',
                  },
                  {
                    agency: 'National Water Informatics Centre (NWIC)',
                    dataset: 'Reservoir Storage & Basin Hydrometric River Gauges',
                    latency: 'Daily telemetry sync',
                    status: 'Active Live Feed',
                  },
                  {
                    agency: 'BWSSB SCADA Systems',
                    dataset: 'Cauvery Water Supply Stages I–V (1,450 MLD Distribution)',
                    latency: 'Hourly operational logs',
                    status: 'Connected',
                  },
                  {
                    agency: 'European Space Agency (ESA) Sentinel-2',
                    dataset: '10m Optical Imagery (MNDWI Lake Surface Area & NDRE)',
                    latency: '5-day satellite revisit',
                    status: 'Cloud Synchronized',
                  },
                  {
                    agency: 'Central Ground Water Board (CGWB)',
                    dataset: 'District Piezometer Monitoring Wells & Water Table Depth',
                    latency: 'Quarterly sensor update',
                    status: 'Calibrated',
                  },
                ].map((ds, idx) => (
                  <div key={idx} className="wm-datasource-card">
                    <div className="wm-datasource-card__header">
                      <strong>{ds.agency}</strong>
                      <span className="wm-tag wm-tag--emerald">
                        <CheckCircle2 size={11} />
                        <span>{ds.status}</span>
                      </span>
                    </div>
                    <div className="wm-datasource-card__dataset">{ds.dataset}</div>
                    <div className="wm-datasource-card__meta">Update Cadence: {ds.latency}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'climate' && (
            <div className="wm-doc-pane">
              <div className="wm-doc-callout">
                <h4>CMIP6 Downscaled Climate Change Scenarios</h4>
                <p>
                  WaterMap utilizes high-resolution downscaled climate projections from the Coupled Model
                  Intercomparison Project Phase 6 (CMIP6) downscaled over Karnataka (12.97° N, 77.59° E).
                </p>
              </div>

              <div className="wm-climate-scenarios-grid">
                <div className="wm-climate-card">
                  <span className="wm-climate-card__scenario">SSP1-2.6</span>
                  <h5>Aggressive Climate Mitigation (+1.5°C)</h5>
                  <p>
                    Global emissions net-zero by 2050. Southwest monsoon rainfall variance stabilizes within ±8% of historical mean (970 mm). Minimal compound dry spells.
                  </p>
                </div>

                <div className="wm-climate-card wm-climate-card--active">
                  <span className="wm-climate-card__scenario">SSP2-4.5 (Baseline Default)</span>
                  <h5>Middle-of-the-Road (+2.7°C)</h5>
                  <p>
                    Current socio-economic trajectory. Extended pre-monsoon dry spells (+18 days), erratic intense rainfall bursts (+22%), and reduced infiltration efficiency.
                  </p>
                </div>

                <div className="wm-climate-card">
                  <span className="wm-climate-card__scenario">SSP5-8.5</span>
                  <h5>High Emissions Stress (+4.4°C)</h5>
                  <p>
                    Extreme warming scenario. Severe monsoon delays, 40% surge in evaporation losses from surface water bodies, and acute tanker cost escalation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="wm-doc-pane">
              <p className="wm-doc-intro">
                RESTful APIs served via FastAPI on port 8000 powering the WaterMap frontend and municipal GIS clients:
              </p>

              <div className="wm-api-endpoints-list">
                {[
                  {
                    method: 'GET',
                    path: '/api/v1/districts',
                    desc: 'Returns GeoJSON boundaries with computed WSI, rainfall, and groundwater metrics for all zones.',
                  },
                  {
                    method: 'GET',
                    path: '/api/v1/recommendations',
                    desc: 'Retrieves prioritized municipal interventions, estimated costs, and target districts.',
                  },
                  {
                    method: 'POST',
                    path: '/api/v1/simulation/run',
                    desc: 'Executes parametric rainfall reduction or demand spike simulation on composite index.',
                  },
                  {
                    method: 'GET',
                    path: '/api/v1/telemetry/live',
                    desc: 'Streams latest NWIC reservoir inflows and IMD Doppler rainfall telemetry.',
                  },
                ].map((ep, idx) => (
                  <div key={idx} className="wm-api-endpoint-card">
                    <div className="wm-api-endpoint-card__header">
                      <span className={`wm-method-badge wm-method-badge--${ep.method.toLowerCase()}`}>
                        {ep.method}
                      </span>
                      <code className="wm-endpoint-path">{ep.path}</code>
                    </div>
                    <div className="wm-endpoint-desc">{ep.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <footer className="wm-modal__footer">
          <button
            type="button"
            className="wm-btn wm-btn--ghost"
            onClick={handleGoToAbout}
          >
            <span>Open Full About & Methodology Page</span>
            <ExternalLink size={14} />
          </button>
          <button type="button" className="wm-btn wm-btn--secondary" onClick={onClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
  )
}

export default DocumentationModal
