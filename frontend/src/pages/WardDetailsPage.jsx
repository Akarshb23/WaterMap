import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useWardDetails } from '../hooks/useWardDetails.js'
import { isApiMode } from '../services/apiClient.js'
import WardHeader from '../components/wards/WardHeader.jsx'
import WardMapCanvas from '../components/wards/WardMapCanvas.jsx'
import WardMetricCard from '../components/wards/WardMetricCard.jsx'
import WardTabs from '../components/wards/WardTabs.jsx'
import WaterStressTrendChart from '../components/wards/WaterStressTrendChart.jsx'
import { WARD_DETAILS, WARD_KPIS, WARD_RISK_FACTORS, WARD_RECOMMENDATIONS, WARD_FEATURED_ACTIONS } from '../data/wardDetailsData.js'

const formatValue = (value, digits = 2) => value == null || value === '' ? '—' : typeof value === 'number' ? value.toFixed(digits) : value

const IndicatorTable = ({ indicators = [] }) => (
  <section className="card ward-api-data-card">
    <h2 className="card__title">Available district indicators</h2>
    {indicators.length ? (
      <div className="ward-api-data-card__table-wrap">
        <table className="ward-api-data-card__table">
          <thead><tr><th>Indicator</th><th>Value</th><th>Unit</th><th>Recorded</th></tr></thead>
          <tbody>{indicators.map((item, index) => <tr key={item.indicator_id ?? `${item.metric}-${index}`}><td>{item.metric ?? item.name ?? 'Indicator'}</td><td>{formatValue(item.value)}</td><td>{item.unit ?? '—'}</td><td>{item.recorded_at ? new Date(item.recorded_at).toLocaleDateString() : '—'}</td></tr>)}</tbody>
        </table>
      </div>
    ) : <p className="ward-api-data-card__empty">No indicator records are available for this district.</p>}
  </section>
)

const WardDetailsPage = () => {
  const { wardId } = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const { ward: remoteWard, isLoading, error } = useWardDetails(wardId)
  const ward = isApiMode() ? remoteWard : (remoteWard ?? { ...WARD_DETAILS, name: WARD_DETAILS.name || `District ${wardId ?? WARD_DETAILS.id}` })
  const indicators = ward?.indicators ?? ward?.rawData ?? []
  const apiKpis = useMemo(() => {
    if (!ward) return []
    const wsi = Number(ward.water_stress_index ?? ward.wsi ?? 0)
    return [
      { id: 'wsi', title: 'Water Stress Index', value: wsi.toFixed(2), unit: '/ 1.0', tone: wsi >= .75 ? 'red' : wsi >= .55 ? 'yellow' : 'green', progress: { percent: Math.round(wsi * 100), label: `Water stress index ${Math.round(wsi * 100)} percent` } },
      { id: 'population', title: 'Population', value: Number(ward.population ?? 0).toLocaleString('en-IN'), unit: '', tone: 'blue' },
      { id: 'area', title: 'District Area', value: ward.area_sqkm == null ? '—' : Number(ward.area_sqkm).toFixed(2), unit: ward.area_sqkm == null ? '' : ' km²', tone: 'green' },
    ]
  }, [ward])
  const kpis = isApiMode() ? apiKpis : (ward?.kpis ?? WARD_KPIS)
  const riskFactors = isApiMode() ? indicators.map((item) => ({ id: item.indicator_id ?? item.metric, label: item.metric, name: item.metric, value: item.value, unit: item.unit, detail: item.normalized_value == null ? '' : `Normalized stress: ${Number(item.normalized_value).toFixed(2)}` })) : (ward?.riskFactors ?? WARD_RISK_FACTORS)
  const recommendations = isApiMode() ? [] : (ward?.recommendations ?? WARD_RECOMMENDATIONS)

  if (isApiMode() && isLoading && !ward) return <div className="ward-page"><p className="dashboard-loading" role="status">Loading district data from WaterMap API…</p></div>
  if (isApiMode() && error && !ward) return <div className="ward-page"><div className="dashboard-api-notice" role="alert"><strong>District data could not be loaded.</strong><p>{error}</p></div></div>
  if (isApiMode() && !ward) return <div className="ward-page"><div className="card"><h1>District not found</h1><p>The backend did not return a district with ID {wardId}.</p></div></div>

  return (
    <div className="ward-page">
      {isLoading ? <p className="dashboard-loading" role="status">Refreshing district data…</p> : null}
      {error ? <div className="dashboard-api-notice" role="status"><strong>District data could not be refreshed.</strong><p>{error}</p></div> : null}
      <WardHeader ward={{ ...ward, name: ward.name ?? ward.ward_id ?? `District ${wardId}`, zone: ward.zone ?? ward.district ?? '—', riskLabel: ward.riskLabel ?? ward.risk_category ?? ward.risk ?? '', area: ward.area ?? (ward.area_sqkm != null ? `${ward.area_sqkm} km²` : '—'), population: Number(ward.population ?? 0).toLocaleString('en-IN') }} onCompare={() => setActiveTab('risk-factors')} />
      <WardTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' ? (
        <div className="ward-tab-panel">
          <section className="ward-kpi-grid" aria-label="District key metrics">
            {kpis.map((kpi, index) => <WardMetricCard key={kpi.id ?? kpi.title ?? index} title={kpi.title ?? kpi.label ?? kpi.metric} value={kpi.value ?? '—'} unit={kpi.unit} icon={kpi.icon} tone={kpi.tone ?? 'blue'} progress={kpi.progress} change={isApiMode() ? undefined : kpi.change} changeDirection={kpi.changeDirection} />)}
          </section>
          <div className="ward-overview-grid">
            <div className="ward-overview-grid__col ward-overview-grid__col--left"><WardMapCanvas wardName={ward.name ?? ward.ward_id} />{isApiMode() ? <div className="card"><h2 className="card__title">Historical trend</h2><p className="ward-api-data-card__empty">The current backend does not provide a historical time series for this district.</p></div> : <WaterStressTrendChart />}</div>
            <div className="ward-overview-grid__col ward-overview-grid__col--middle"><IndicatorTable indicators={indicators} /></div>
            <div className="ward-overview-grid__col ward-overview-grid__col--right"><section className="card ward-api-data-card"><h2 className="card__title">Risk factors</h2>{riskFactors.length ? <ul className="ward-api-data-card__list">{riskFactors.map((item, index) => <li key={item.id ?? index}><strong>{item.label ?? item.name ?? item.metric}</strong><span>{item.value == null ? '—' : `${formatValue(Number(item.value))}${item.unit ? ` ${item.unit}` : ''}`}</span></li>)}</ul> : <p className="ward-api-data-card__empty">No indicator-level risk factors are available.</p>}</section><section className="card ward-api-data-card"><h2 className="card__title">Recommended actions</h2>{isApiMode() ? <p className="ward-api-data-card__empty">District-specific recommendations are available through the Recommendations page; quantified costs and impacts are not supplied by the current API.</p> : <ul className="ward-api-data-card__list">{(ward.featuredActions ?? WARD_FEATURED_ACTIONS).map((action, index) => <li key={action.id ?? index}><strong>{action.title ?? action.name ?? action.label}</strong></li>)}</ul>}</section></div>
          </div>
        </div>
      ) : null}
      {activeTab === 'risk-factors' ? <div className="ward-tab-panel"><IndicatorTable indicators={indicators} /></div> : null}
      {activeTab === 'trends' ? <div className="ward-tab-panel">{isApiMode() ? <section className="card"><h2 className="card__title">Historical WSI trends</h2><p className="ward-api-data-card__empty">No historical time-series endpoint is available in the current backend.</p></section> : <WaterStressTrendChart />}</div> : null}
      {activeTab === 'recommendations' ? <div className="ward-tab-panel"><section className="card"><h2 className="card__title">District recommendations</h2>{isApiMode() ? <p className="ward-api-data-card__empty">The backend supports city-level recommendation retrieval, but does not yet provide a dedicated district recommendations endpoint in the frontend contract.</p> : recommendations.map((item, index) => <p key={item.id ?? index}>{item.title ?? item.name ?? item.action}</p>)}</section></div> : null}
      {activeTab === 'raw-data' ? <div className="ward-tab-panel"><IndicatorTable indicators={indicators} /></div> : null}
      <footer className="dashboard-footer"><p>WaterMap · District data {isApiMode() ? 'provided by the backend API' : 'shown in demonstration mode'}.</p></footer>
    </div>
  )
}

export default WardDetailsPage
