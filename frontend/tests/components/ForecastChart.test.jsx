// Chart integrity tests: charts must never render an axis-only empty frame
// that implies data exists where the backend supplies none.

import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'

import ForecastChart from '../../src/components/predictions/ForecastChart.jsx'
import RainfallForecast from '../../src/components/predictions/RainfallForecast.jsx'
import ScenarioAnalysis from '../../src/components/predictions/ScenarioAnalysis.jsx'

afterEach(() => cleanup())

describe('ForecastChart', () => {
  it('shows an explicit Not available state instead of an empty chart', () => {
    const { container } = render(
      <ForecastChart
        title="Water Demand Forecast"
        subtitle="Projected city-wide demand under current growth trends."
        data={[]}
        series={[{ key: 'demand', label: 'Water demand', color: '#2589e9', fill: true }]}
        yAxis={{ label: 'MLD' }}
        unit="MLD"
      />,
    )

    expect(screen.getByText('Not available')).toBeInTheDocument()
    expect(container.querySelector('svg')).toBeNull()
  })

  it('renders the chart when data exists', () => {
    const { container } = render(
      <ForecastChart
        title="Water Demand Forecast"
        data={[
          { year: 2024, demand: 124 },
          { year: 2026, demand: 133 },
        ]}
        series={[{ key: 'demand', label: 'Water demand', color: '#2589e9', fill: true }]}
      />,
    )

    expect(screen.getByText('Water Demand Forecast')).toBeInTheDocument()
    // jsdom cannot measure Recharts containers, so assert a real chart
    // frame is mounted rather than the absence of the empty state.
    expect(container.querySelector('.forecast-card__chart:not(.forecast-card__chart--empty)')).not.toBeNull()
    expect(screen.queryByText('Not available')).not.toBeInTheDocument()
  })
})

describe('RainfallForecast', () => {
  it('marks an empty series as Not available and draws no chart axes', () => {
    render(<RainfallForecast data={[]} />)

    const statuses = screen.getAllByText('Not available')
    expect(statuses.length).toBeGreaterThan(0)
    expect(document.querySelector('svg')).toBeNull()
  })

  it('renders the composed chart for illustration data', () => {
    const { container } = render(<RainfallForecast />)

    expect(container.querySelector('.forecast-card__chart:not(.forecast-card__chart--empty)')).not.toBeNull()
  })
})

describe('ScenarioAnalysis', () => {
  function renderScenario(outlook, baseline = 0.68) {
    return render(
      <MemoryRouter>
        <ScenarioAnalysis outlook={outlook} baseline={baseline} />
      </MemoryRouter>,
    )
  }

  it('shows Not available instead of an empty scenario list', () => {
    renderScenario([])

    expect(screen.getByText(/Not available — the backend does not yet provide scenario estimates/)).toBeInTheDocument()
    expect(screen.queryByText(/Rainwater harvesting/)).not.toBeInTheDocument()
  })

  it('still renders scenario rows when outlook data exists', () => {
    renderScenario([{ id: 'rainwater', label: 'Rainwater harvesting', wsi: 0.7, reduction: 11 }], 0.79)

    expect(screen.getByText('Rainwater harvesting')).toBeInTheDocument()
    expect(screen.getByText('0.70')).toBeInTheDocument()
  })
})
