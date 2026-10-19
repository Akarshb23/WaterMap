import { apiGet, isApiMode } from './apiClient.js'
import {
  DEMAND_FORECAST_SERIES, PREDICTION_KPIS, RISK_DRIVERS, PROJECTED_RESULTS,
  RAINFALL_FORECAST, WSI_HISTORICAL_SERIES, WSI_PREDICTED_SERIES, TREND_YEARS,
  SCENARIO_OUTLOOK, SCENARIO_BASELINE_WSI,
} from '../data/predictionsData.js'

export async function fetchForecasts({ signal, cityId = 'bengaluru', horizon = 2030 } = {}) {
  if (!isApiMode()) {
    return {
      metrics: PREDICTION_KPIS,
      demandForecast: DEMAND_FORECAST_SERIES,
      rainfallForecast: RAINFALL_FORECAST,
      historicalWsi: WSI_HISTORICAL_SERIES,
      predictedWsi: WSI_PREDICTED_SERIES,
      years: TREND_YEARS,
      projectedResults: PROJECTED_RESULTS,
      scenarioOutlook: SCENARIO_OUTLOOK,
      baselineWsi: SCENARIO_BASELINE_WSI,
      trendComparison: TREND_YEARS.map((year, index) => ({
        year,
        historical: index < WSI_HISTORICAL_SERIES.length ? WSI_HISTORICAL_SERIES[index] : null,
        predicted: WSI_PREDICTED_SERIES[index] ?? null,
      })),
      disclaimer: 'Illustrative demo forecast; replace with validated model output.',
    }
  }
  const days = Math.max(1, Math.min(365, (Number(horizon) - new Date().getFullYear()) * 365))
  const response = await apiGet('/predictions', { params: { horizon_days: days, city_id: cityId }, signal })
  const results = response.results ?? []
  const avg = (key) => results.length ? results.reduce((sum, item) => sum + Number(item[key] ?? 0), 0) / results.length : 0
  const current = avg('current_water_stress_index')
  const predicted = avg('water_stress_index')
  const high = results.filter((item) => ['high', 'critical'].includes(String(item.risk_category).toLowerCase())).length
  return { metrics: [{ id: 'current-wsi', title: 'Current WSI', value: current.toFixed(2), unit: '', tone: 'blue', note: 'Backend-calculated ward average' }, { id: 'predicted-wsi', title: 'Predicted WSI (365-day baseline)', value: predicted.toFixed(2), unit: '', tone: 'red', note: 'Persistence baseline' }, { id: 'high-risk-wards', title: 'High-risk wards', value: high, unit: '', tone: 'red', note: 'Backend forecast classification' }, { id: 'forecast-wards', title: 'Wards forecast', value: results.length, unit: '', tone: 'green', note: 'Ward records returned by API' }], demandForecast: [], rainfallForecast: [], historicalWsi: [], predictedWsi: [], years: [], projectedResults: [{ id: 'current-wsi', label: 'Current average WSI', value: current.toFixed(2), meta: 'Calculated from backend ward records' }, { id: 'predicted-wsi', label: '365-day baseline WSI', value: predicted.toFixed(2), meta: 'Persistence baseline; not a trained forecast' }, { id: 'high-risk-wards', label: 'Forecast high-risk wards', value: String(high), meta: `Of ${results.length} wards returned` }], scenarioOutlook: [], baselineWsi: current, trendComparison: [], forecasts: results, disclaimer: response.limitation ?? 'Baseline forecast returned by backend; not a calibrated time-series model.' }
}

export async function fetchRiskDrivers({ cityId = 'bengaluru' } = {}) {
  if (!isApiMode()) return RISK_DRIVERS
  // The current backend has no driver-attribution endpoint. Do not mislabel
  // high-risk wards as causal drivers or silently substitute demo percentages.
  void cityId
  return []
}
