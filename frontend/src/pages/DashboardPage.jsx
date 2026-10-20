import { fetchDistrictsGeoJSON } from '../services/districtMapService.js'

import { useEffect, useState } from 'react'
import L from 'leaflet'
import { GeoJSON, MapContainer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import {

  Activity,

  AlertTriangle,

  Bell,

  CloudRain,

  Droplets,

  MapPinned,

  RefreshCw,

  ShieldCheck,



} from 'lucide-react'

import {

  Line,

  LineChart,

  CartesianGrid,

  Cell,

  Pie,

  PieChart,

  ResponsiveContainer,

  Tooltip,

  XAxis,

  YAxis,

} from 'recharts'



import PageHeader from '../components/layout/PageHeader.jsx'

import {

  fetchDashboardOverview,

} from '../services/dashboardService.js'

import { getApiErrorMessage } from '../services/apiClient.js'

import '../styles/dashboard-overview.css'
import '../styles/dashboard-overview-map-fix.css'



const RISK_COLORS = {

  low: '#45bd9b',

  moderate: '#ffcc59',

  high: '#ff7b45',

  critical: '#ef4444',

}



const RISK_ORDER = ['critical', 'high', 'moderate', 'low']



function DistrictMapBounds({ data }) {
  const map = useMap()

  useEffect(() => {
    if (!data?.features?.length) return

    const bounds = L.geoJSON(data).getBounds()
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [18, 18] })
    }
  }, [data, map])

  return null
}

function DashboardDistrictMap({ onGeoJSONLoaded }) {
  const [geojson, setGeojson] = useState(null)
  const [error, setError] = useState('')
  const [loadingBoundaries, setLoadingBoundaries] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    fetchDistrictsGeoJSON({ signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return
        setGeojson(data)
        onGeoJSONLoaded?.(data)
        setError('')
      })
      .catch((err) => {
        if (err.name !== 'AbortError' && err.code !== 'ERR_CANCELED') {
          setError('District boundary data could not be loaded. Related district metrics may be unavailable.')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingBoundaries(false)
      })

    return () => controller.abort()
  }, [onGeoJSONLoaded])

  function getDistrictStyle(feature) {
    const properties = feature?.properties ?? {}
    const rawScore = properties.water_stress_index ?? properties.wsi
    const hasScore = rawScore !== null && rawScore !== undefined && rawScore !== '' && Number.isFinite(Number(rawScore))
    const risk = normalizeRisk(properties.risk_category ?? properties.risk)

    return {
      color: '#ffffff',
      weight: 1.5,
      opacity: 1,
      fillColor: hasScore && RISK_COLORS[risk] ? RISK_COLORS[risk] : '#dce5e8',
      fillOpacity: hasScore && RISK_COLORS[risk] ? 0.9 : 0.72,
    }
  }

  if (error) {
    return (
      <div className="overview-map-empty" role="alert">
        <MapPinned size={26} aria-hidden="true" />
        <strong>District polygons unavailable</strong>
        <p>{error}</p>
      </div>
    )
  }

  if (loadingBoundaries || !geojson?.features?.length) {
    return (
      <div className="overview-map-empty" role="status">
        <span className="overview-spinner" />
        <strong>Loading district polygons…</strong>
      </div>
    )
  }

  return (
    <div className="overview-map-container overview-map-container--polygons-only">
      <MapContainer
        center={[15.3173, 75.7139]}
        zoom={6}
        minZoom={5}
        maxZoom={10}
        scrollWheelZoom={false}
        zoomControl
        className="overview-leaflet-map overview-leaflet-map--polygons-only"
      >
        <DistrictMapBounds data={geojson} />
        <GeoJSON
          key={JSON.stringify(geojson.features.map((feature) => feature.id ?? feature.properties?.district_id ?? feature.properties?.name))}
          data={geojson}
          style={getDistrictStyle}
          onEachFeature={(feature, layer) => {
            const properties = feature.properties ?? {}
            const name = properties.district_name ?? properties.district ?? properties.name ?? 'District'
            layer.bindTooltip(name, { sticky: true, direction: 'auto' })
          }}
        />
      </MapContainer>
      <div className="overview-map-legend" aria-label="District risk legend">
        {[
          ['#ef4444', 'Critical stress'],
          ['#ff7b45', 'High stress'],
          ['#ffcc59', 'Moderate stress'],
          ['#45bd9b', 'Low stress'],
          ['#dce5e8', 'Unclassified'],
        ].map(([color, label]) => (
          <span key={label}><i style={{ backgroundColor: color }} />{label}</span>
        ))}
      </div>
    </div>
  )
}

function formatNumber(value) {

  if (value === null || value === undefined || value === '') return '—'

  const number = Number(value)

  return Number.isFinite(number)

    ? number.toLocaleString('en-IN')

    : String(value)

}



function formatWSI(value) {

  if (value === null || value === undefined || value === '') return '—'

  const number = Number(value)

  return Number.isFinite(number) ? number.toFixed(2) : '—'

}



function normalizeRisk(value) {

  const risk = String(value ?? '').trim().toLowerCase()

  return Object.hasOwn(RISK_COLORS, risk) ? risk : 'unknown'

}



function SectionHeading({ title, subtitle, action }) {

  return (

    <div className="overview-section-heading">

      <div>

        <h2>{title}</h2>

        {subtitle && <p>{subtitle}</p>}

      </div>

      {action}

    </div>

  )

}



function MetricCard({ icon: Icon, title, value, note, tone = 'blue' }) {

  return (

    <article className="overview-metric-card">

      <div className={`overview-metric-icon overview-metric-icon--${tone}`}>

        <Icon size={21} aria-hidden="true" />

      </div>

      <div className="overview-metric-copy">

        <p>{title}</p>

        <strong>{value}</strong>

        <small>{note}</small>

      </div>

    </article>

  )

}



function EmptyChart({ children }) {

  return (

    <div className="overview-chart-empty" role="status">

      <Activity size={24} aria-hidden="true" />

      <p>{children}</p>

    </div>

  )

}



export default function DashboardPage() {

  const [overview, setOverview] = useState(null)
  const [districtGeoJSON, setDistrictGeoJSON] = useState(null)


  const [loading, setLoading] = useState(true)

  const [refreshing, setRefreshing] = useState(false)

  const [error, setError] = useState('')






  async function loadDashboard({ refresh = false } = {}) {

    if (refresh) setRefreshing(true)

    else setLoading(true)



    setError('')

    const controller = new AbortController()



    try {

      const result = await fetchDashboardOverview({

        cityId: 'bengaluru',

        range: '12m',

        signal: controller.signal,

      })



      setOverview(result)

    } catch (err) {

      setError(

        getApiErrorMessage(err) ||

        err?.message ||

        'Could not load dashboard data.',

      )

    } finally {

      setLoading(false)

      setRefreshing(false)

    }

  }



  useEffect(() => {

    loadDashboard()

    // Load dashboard metadata once; district metrics come from district GeoJSON.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  const sourceLabel = 'Karnataka district map data'

  // These metrics and lower panels are derived only from the district GeoJSON used by the map.
  const districtFeatures = districtGeoJSON?.features ?? []
  const districtRecords = districtFeatures.map((feature) => {
    const properties = feature.properties ?? {}
    const rawScore = properties.water_stress_index ?? properties.wsi
    const score = rawScore === null || rawScore === undefined || rawScore === ''
      ? null
      : Number(rawScore)
    const risk = normalizeRisk(properties.risk_category ?? properties.risk)

    return {
      id: feature.id ?? properties.district_id ?? properties.id ?? properties.name,
      name: properties.district_name ?? properties.district ?? properties.name ?? 'District',
      score: Number.isFinite(score) ? score : null,
      risk,
    }
  })
  const scoredDistricts = districtRecords.filter((district) => district.score !== null)
  const districtAverageWSI = scoredDistricts.length
    ? scoredDistricts.reduce((sum, district) => sum + district.score, 0) / scoredDistricts.length
    : null
  const districtRiskDistribution = RISK_ORDER
    .filter((risk) => scoredDistricts.some((district) => district.risk === risk))
    .map((risk) => ({
      name: `${risk[0].toUpperCase()}${risk.slice(1)} Risk`,
      value: scoredDistricts.filter((district) => district.risk === risk).length,
      color: RISK_COLORS[risk],
    }))
  const districtRiskTotal = districtRiskDistribution.reduce((sum, item) => sum + item.value, 0)
  const highRiskDistricts = scoredDistricts
    .filter((district) => district.risk === 'high' || district.risk === 'critical')
    .sort((a, b) => b.score - a.score)

  // Illustrative sample trend anchored to the current district average.
  // These are demo values, not historical observations from the backend.
  const trendOffsets = [-0.035, -0.018, -0.026, -0.008, 0.006, -0.004, 0.012, 0.025, 0.014, 0.032, 0.024, 0.041]
  const trendBase = districtAverageWSI ?? 0.34
  const trend = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => ({
    month,
    value: Number(Math.max(0, Math.min(1, trendBase + trendOffsets[index])).toFixed(2)),
  }))

  // Sample alerts are generated from current high-stress district scores.
  // They are clearly marked as illustrative and are not live incident reports.
  const alerts = highRiskDistricts.slice(0, 4).map((district, index) => ({
    id: `sample-${district.id ?? district.name}-${index}`,
    title: district.risk === 'critical' ? 'Critical stress score detected' : 'Elevated water stress score',
    description: `${district.name} has a current district WSI of ${district.score.toFixed(2)}. This is an illustrative alert based on the loaded score, not a live incident.`,
    timestamp: 'Sample alert',
    tone: district.risk === 'critical' ? 'danger' : 'warning',
    icon: 'water',
  }))

  if (alerts.length === 0 && scoredDistricts.length > 0) {
    const highest = [...scoredDistricts].sort((a, b) => b.score - a.score).slice(0, 2)
    highest.forEach((district, index) => alerts.push({
      id: `sample-watch-${district.id ?? district.name}-${index}`,
      title: 'District monitoring update',
      description: `${district.name} has a WSI of ${district.score.toFixed(2)}. Review this score alongside local water availability data.`,
      timestamp: 'Sample alert',
      tone: 'warning',
      icon: 'water',
    }))
  }

  return (

    <div className="dashboard-page overview-dashboard">

      <header className="overview-dashboard-heading">

        <PageHeader

          title="District Water Dashboard"

          description="Explore Karnataka district boundaries and available district-level water-stress indicators."

        />

        <div className="overview-heading-actions">

          <span

            className={`overview-source-badge ${overview?.source === 'api'

                ? 'overview-source-badge--api'

                : 'overview-source-badge--demo'

              }`}

          >

            <span />

            {sourceLabel}

          </span>

          <button

            type="button"

            className="overview-refresh-button"

            onClick={() => loadDashboard({ refresh: true })}

            disabled={loading || refreshing}

          >

            <RefreshCw

              size={15}

              className={refreshing ? 'overview-spin' : ''}

            />

            Refresh

          </button>

        </div>

      </header>



      {error && (

        <div className="overview-error" role="alert">

          <AlertTriangle size={18} />

          <div>

            <strong>Dashboard data unavailable</strong>

            <p>{error}</p>

          </div>

          <button type="button" onClick={() => loadDashboard()}>

            Retry

          </button>

        </div>

      )}



      {loading && !overview && (

        <div className="overview-loading" role="status">

          <span className="overview-spinner" />

          Loading dashboard data…

        </div>

      )}



      <section className="overview-kpi-grid" aria-label="Karnataka district water metrics">

        <MetricCard

          icon={Droplets}

          title="Average District Water Stress"

          value={districtAverageWSI === null ? '—' : districtAverageWSI.toFixed(2)}

          note={scoredDistricts.length ? `Calculated from ${scoredDistricts.length} scored districts` : 'No district scores available'}

          tone="blue"

        />

        <MetricCard

          icon={AlertTriangle}

          title="High-risk Districts"

          value={highRiskDistricts.length}

          note={`${districtRiskTotal} districts with classified scores`}

          tone="red"

        />

        <MetricCard

          icon={CloudRain}

          title="Annual Rainfall"

          value="—"

          note="District-level rainfall data unavailable"

          tone="blue"

        />

        <MetricCard

          icon={MapPinned}

          title="Districts Mapped"

          value={districtFeatures.length.toLocaleString('en-IN')}

          note={`${scoredDistricts.length} with numeric stress scores`}

          tone="green"

        />

      </section>



      <section className="overview-map-card">

        <SectionHeading

          title="Karnataka District Map"

          subtitle="District boundaries only · no world map, roads, or background tiles."

        />



        <div className="overview-map-layout">

          <DashboardDistrictMap onGeoJSONLoaded={setDistrictGeoJSON} />

        </div>

      </section>



      <section className="overview-analytics-grid">

        <article className="overview-panel">

          <SectionHeading

            title="District Water Stress Distribution"

            subtitle="Districts grouped by the risk classifications available on the map"

          />

          {districtRiskDistribution.length ? (

            <>

              <div className="overview-donut-wrap">

                <ResponsiveContainer width="100%" height="100%">

                  <PieChart>

                    <Pie

                      data={districtRiskDistribution}

                      dataKey="value"

                      nameKey="name"

                      innerRadius="63%"

                      outerRadius="86%"

                      paddingAngle={3}

                      stroke="none"

                    >

                      {districtRiskDistribution.map((entry, index) => (

                        <Cell

                          key={`${entry.name}-${index}`}

                          fill={entry.color}

                        />

                      ))}

                    </Pie>

                    <Tooltip />

                  </PieChart>

                </ResponsiveContainer>

                <div className="overview-donut-center">

                  <strong>{formatNumber(districtRiskTotal)}</strong>

                  <span>Districts</span>

                </div>

              </div>

              <div className="overview-risk-legend">

                {districtRiskDistribution.map((item) => {

                  const percent = districtRiskTotal

                    ? Math.round((Number(item.value) / districtRiskTotal) * 100)

                    : 0

                  return (

                    <div className="overview-risk-row" key={item.name}>

                      <i style={{ backgroundColor: item.color }} />

                      <span>{item.name}</span>

                      <strong>{formatNumber(item.value)}</strong>

                      <small>{percent}%</small>

                    </div>

                  )

                })}

              </div>

            </>

          ) : (

            <EmptyChart>

              District risk distribution is unavailable because the map has no scored

              districts with recognized risk categories.

            </EmptyChart>

          )}

        </article>



        <article className="overview-panel">

          <SectionHeading

            title="District Water Stress Trend"

            subtitle="Illustrative 12-month trend based on the current district average"

          />

          {trend.length ? (

            <div className="overview-trend-chart">

              <div className="overview-demo-note">Illustrative sample data · not historical measurements</div>

              <ResponsiveContainer width="100%" height="100%">

                <LineChart data={trend} margin={{ top: 12, right: 14, left: -12, bottom: 0 }}>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7eff2" />

                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />

                  <YAxis domain={[0, 1]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="value"
                    name="District average WSI (sample)"
                    stroke="#2589e9"
                    strokeWidth={3}
                    dot={{ r: 3, fill: '#2589e9', strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                    connectNulls={false}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          ) : (

            <EmptyChart>

              District scores are not loaded yet, so the sample trend cannot be generated.

            </EmptyChart>

          )}

        </article>

      </section>



      <section className="overview-bottom-grid">

        <article className="overview-panel">

          <SectionHeading

            title="Highest-Stress Districts"

            subtitle="Districts with high or critical scores shown on the map"

          />

          {highRiskDistricts.length ? (

            <div className="overview-table-scroll">

              <table className="overview-wards-table">

                <thead>

                  <tr>

                    <th>Rank</th>

                    <th>District</th>

                    <th>WSI</th>


                    <th>Risk</th>

                  </tr>

                </thead>

                <tbody>

                  {highRiskDistricts.slice(0, 5).map((district, index) => (

                    <tr key={district.id ?? district.name ?? index}>

                      <td>{index + 1}</td>

                      <td>{district.name}</td>

                      <td>

                        <span className="overview-wsi-badge">

                          {formatWSI(district.score)}

                        </span>

                      </td>

                      <td>

                        <span

                          className={`overview-risk-pill overview-risk-pill--${district.risk}`}

                        >

                          {district.risk[0].toUpperCase() + district.risk.slice(1)}

                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          ) : (

            <EmptyChart>

              No scored districts currently have a high or critical risk classification.

            </EmptyChart>

          )}

        </article>



        <article className="overview-panel">

          <SectionHeading

            title="Recent Alerts"

            subtitle="Illustrative monitoring notices based on current district scores"

          />

          {alerts.length ? (

            <>
              <div className="overview-demo-note">Sample alerts · not live notifications</div>
              <div className="overview-alert-list">

              {alerts.slice(0, 5).map((alert) => (

                <div className="overview-alert-item" key={alert.id ?? alert.title}>

                  <div className="overview-alert-icon">

                    {alert.tone === 'danger' ? (

                      <AlertTriangle size={17} />

                    ) : alert.icon === 'cloud-rain' ? (

                      <CloudRain size={17} />

                    ) : (

                      <Bell size={17} />

                    )}

                  </div>

                  <div>

                    <strong>{alert.title}</strong>

                    <p>{alert.description}</p>

                    <small>{alert.timestamp ?? 'Time not available'}</small>

                  </div>

                </div>

              ))}

              </div>
            </>

          ) : (

            <EmptyChart>

              No district scores are available to generate sample monitoring notices.

            </EmptyChart>

          )}

        </article>

      </section>



      <footer className="overview-dashboard-footer">

        <ShieldCheck size={15} />

        <span>

          WaterMap · Karnataka district map · Missing values are not interpreted

          as zero. {overview?.updatedAt

            ? `Last updated: ${new Date(overview.updatedAt).toLocaleString('en-IN')}`

            : ''}

        </span>

      </footer>

    </div>

  )

}
