import { useMemo, useState } from 'react'
import { isApiMode } from '../../services/apiClient.js'
import Select from '../common/Select.jsx'
import ForecastChart from './ForecastChart.jsx'
import {
  DEFAULT_TREND_WARD,
  PREDICTION_DISCLAIMER,
  TREND_WARD_OPTIONS,
  TREND_YEARS,
  WSI_HISTORICAL_SERIES,
  WSI_PREDICTED_SERIES,
} from '../../data/predictionsData.js'

/** Keep any scaled value inside the valid WSI range and tidy decimals. */
const clampWsi = (value) => Math.min(1, Math.max(0, Math.round(value * 100) / 100))

const WARD_SELECT_OPTIONS = TREND_WARD_OPTIONS.map(({ value, label }) => ({ value, label }))

/**
 * Trend Comparison card — blue solid "Historical" line against a red
 * dashed "Predicted" line for the selected ward (defaults to Ward 12).
 * The ward `factor` from the demo data scales both series so switching
 * wards changes the chart deterministically.
 */
const TrendComparison = ({ forecastSeries }) => {
  const [ward, setWard] = useState(DEFAULT_TREND_WARD)

  const factor = TREND_WARD_OPTIONS.find((option) => option.value === ward)?.factor ?? 1

  const data = useMemo(
    () => Array.isArray(forecastSeries) && forecastSeries.length
      ? forecastSeries
      : isApiMode() ? [] : TREND_YEARS.map((year, index) => ({
          year,
          historical: index < WSI_HISTORICAL_SERIES.length ? clampWsi(WSI_HISTORICAL_SERIES[index] * factor) : null,
          predicted: WSI_PREDICTED_SERIES[index] != null ? clampWsi(WSI_PREDICTED_SERIES[index] * factor) : null,
        })),
    [factor, forecastSeries],
  )

  return (
    <ForecastChart
      className="trend-comparison"
      title="Trend Comparison"
      subtitle={isApiMode() ? 'Historical series is not available from the current backend.' : 'Historical vs predicted water stress index.'}
      headerRight={
        <Select
          label="Ward"
          options={WARD_SELECT_OPTIONS}
          value={ward}
          onChange={(event) => setWard(event.target.value)}
        />
      }
      legend={[
        { label: 'Historical', color: '#2589e9' },
        { label: 'Predicted', color: '#ef4444', dashed: true },
      ]}
      data={data}
      series={[
        { key: 'historical', label: 'Historical', color: '#2589e9' },
        { key: 'predicted', label: 'Predicted', color: '#ef4444', dashed: true },
      ]}
      yAxis={{
        label: 'Water Stress Index',
        domain: [0, 1],
        tickFormatter: (value) => value.toFixed(1),
      }}
      chartHeight={185}
      note={isApiMode() ? 'The backend currently returns a persistence baseline, not a historical time series.' : PREDICTION_DISCLAIMER}
    />
  )
}

export default TrendComparison