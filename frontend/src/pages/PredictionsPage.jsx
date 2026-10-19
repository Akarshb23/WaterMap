import { ChartLine, Droplet, TriangleAlert, Users } from 'lucide-react'
import MetricCard from '../components/dashboard/MetricCard.jsx'
import PageHeader from '../components/layout/PageHeader.jsx'
import ForecastChart from '../components/predictions/ForecastChart.jsx'
import ForecastSummary from '../components/predictions/ForecastSummary.jsx'
import DistrictPredictionMap from '../components/predictions/DistrictPredictionMap.jsx'
import RainfallForecast from '../components/predictions/RainfallForecast.jsx'
import RiskDrivers from '../components/predictions/RiskDrivers.jsx'
import ScenarioAnalysis from '../components/predictions/ScenarioAnalysis.jsx'
import TrendComparison from '../components/predictions/TrendComparison.jsx'
import {
  DEMAND_FORECAST_SERIES, PREDICTION_DISCLAIMER, PREDICTION_INFO,
  PREDICTION_KPIS, PROJECTED_RESULTS, RISK_DRIVERS,
} from '../data/predictionsData.js'
import { usePredictions } from '../hooks/usePredictions.js'
import { useCity } from '../context/CityContext.jsx'
import { isApiMode } from '../services/apiClient.js'

const KPI_ICONS = {
  'current-wsi': Droplet,
  'predicted-wsi': ChartLine,
  'high-risk-wards': TriangleAlert,
  'demand-increase': Users,
}

const PredictionsPage = () => {
  const { selectedCityId } = useCity()
  const { forecasts, riskDrivers, isLoading, error } = usePredictions({ cityId: selectedCityId || 'bengaluru' })
  const metrics = forecasts?.metrics ?? (isApiMode() ? [] : PREDICTION_KPIS)
  const demandForecast = forecasts?.demandForecast ?? (isApiMode() ? [] : DEMAND_FORECAST_SERIES)
  const projectedResults = forecasts?.projectedResults ?? (isApiMode() ? [] : PROJECTED_RESULTS)
  const drivers = riskDrivers?.length ? riskDrivers : (isApiMode() ? [] : RISK_DRIVERS)
  const disclaimer = forecasts?.disclaimer ?? (isApiMode() ? 'No forecast data has been returned by the backend.' : PREDICTION_DISCLAIMER)

  return (
    <div className="predictions-page">
      <header className="dashboard-heading">
        <PageHeader title="Prediction & Analysis" description="Understand future water risks with data-driven forecasts and scenario analysis." />
        <aside className="page-info-card page-info-card--blue">
          <span className="page-info-card__icon" aria-hidden="true"><ChartLine size={16} /></span>
          <p>{PREDICTION_INFO}</p>
        </aside>
      </header>

      {error ? <div className="dashboard-api-notice" role="status"><div><strong>Prediction data could not be refreshed.</strong><p>{error}</p></div></div> : null}
      {isLoading ? <p className="dashboard-loading" role="status">Loading prediction data…</p> : null}

      <section className="kpi-grid" aria-label="Prediction key performance indicators" aria-busy={isLoading}>
        {metrics.map((kpi) => (
          <MetricCard key={kpi.id} title={kpi.title} value={kpi.value} unit={kpi.unit} icon={KPI_ICONS[kpi.id]} tone={kpi.tone} trend={kpi.trend} trendTone={kpi.trendTone} trendDirection={kpi.trendDirection} note={kpi.note} visual={kpi.visual} />
        ))}
      </section>

      <div className="pred-layout">
        <div className="pred-col pred-col--left">
          <DistrictPredictionMap />
          <ForecastChart
            title="Water Demand Forecast"
            subtitle="Projected city-wide demand under current growth trends."
            legend={[{ label: 'Water demand (MLD)', color: '#2589e9' }]}
            data={demandForecast}
            series={[{ key: 'demand', label: 'Water demand', color: '#2589e9', fill: true }]}
            yAxis={{ label: 'MLD', domain: ['auto', 'auto'], tickFormatter: (value) => `${value}` }}
            unit="MLD"
            chartHeight={175}
            note={forecasts?.demandNote ?? 'Illustrative forecast unless supplied by a validated backend model.'}
          />
        </div>
        <div className="pred-col pred-col--middle">
          <TrendComparison forecastSeries={forecasts?.trendComparison} />
          <RiskDrivers title="Key Drivers" subtitle="Share of the projected WSI increase by 2030." drivers={drivers} />
          <RainfallForecast data={forecasts?.rainfallForecast} />
        </div>
        <div className="pred-col pred-col--right">
          <ScenarioAnalysis outlook={forecasts?.scenarioOutlook} baseline={forecasts?.baselineWsi} />
          <ForecastSummary subtitle="Where the city lands if current trends continue." rows={projectedResults} note={disclaimer} />
        </div>
      </div>
    </div>
  )
}

export default PredictionsPage