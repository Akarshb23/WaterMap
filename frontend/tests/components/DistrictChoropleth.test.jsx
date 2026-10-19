// Component tests for the district map: selection, deselection, and
// data-integrity of the details panel.
//
// Real Leaflet GeoJSON projection cannot run in jsdom, so react-leaflet
// is mocked with a faithful fake: it applies onEachFeature to every
// feature, renders one clickable element per district, and records every
// creation-time and update-time style call. SelectionStyles' useMap()
// effect therefore runs against these same fake layers, exactly as it
// does against real Leaflet vector layers.

import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { fetchDistrictsGeoJSON } = vi.hoisted(() => ({
  fetchDistrictsGeoJSON: vi.fn(),
}))

vi.mock('../../src/services/districtMapService.js', () => ({
  fetchDistrictsGeoJSON,
}))

const layers = []

vi.mock('react-leaflet', async () => {
  const React = await vi.importActual('react')

  const createElement = React.createElement

  const createFakeLayer = (feature) => {
    const layer = {
      feature,
      handlers: {},
      tooltip: null,
      styleHistory: [],
      on(nextHandlers) {
        Object.assign(layer.handlers, nextHandlers)
      },
      bindTooltip(content) {
        layer.tooltip = content
      },
      setStyle(style) {
        layer.styleHistory.push(style)
      },
    }

    return layer
  }

  return {
    MapContainer: function MockMapContainer({ children }) {
      return createElement('div', { 'data-testid': 'map-container' }, children)
    },
    useMap: () => ({
      eachLayer(callback) {
        layers.forEach(callback)
      },
      fitBounds: vi.fn(),
    }),
    GeoJSON: function MockGeoJSON({ data, onEachFeature, style }) {
      React.useMemo(() => {
        layers.length = 0

        ;(data?.features ?? []).forEach((feature) => {
          const layer = createFakeLayer(feature)
          onEachFeature(feature, layer)

          // Mirror real react-leaflet: the style prop is applied to the
          // layers exactly once, at creation time.
          layer.setStyle(style(layer.feature))
          layers.push(layer)
        })

        return layers
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [data, onEachFeature])

      return createElement(
        'div',
        { 'data-testid': 'district-geojson' },
        layers.map((layer) =>
          createElement(
            'button',
            {
              key: layer.feature.properties.district_id,
              'data-testid': `district-${layer.feature.properties.district_id}`,
              onClick: () => layer.handlers.click?.(),
            },
            layer.feature.properties.district_name,
          ),
        ),
      )
    },
  }
})

import DistrictChoropleth from '../../src/components/map/DistrictChoropleth.jsx'

const SAMPLE_DATA = {
  type: 'FeatureCollection',
  features: [
    {
      id: '524',
      type: 'Feature',
      properties: {
        district_id: '524',
        district_name: 'Bagalkote',
        state_name: 'Karnataka',
        water_stress_index: null,
        risk_category: 'insufficient_data',
        data_status: 'insufficient_data',
        data_coverage: 0,
        data_date: null,
        data_source: null,
      },
      geometry: { type: 'Polygon', coordinates: [[[74.9, 15.8], [75.6, 15.8], [75.6, 16.4], [74.9, 15.8]]] },
    },
    {
      id: '574',
      type: 'Feature',
      properties: {
        district_id: '574',
        district_name: 'Dakshina Kannada',
        state_name: 'Karnataka',
        water_stress_index: 0.6104,
        risk_category: 'high',
        data_status: 'verified_district_metrics',
        data_coverage: 80,
        data_date: '2024-06-15',
        data_source: 'CGWB NWIC',
      },
      geometry: { type: 'Polygon', coordinates: [[[74.8, 12.4], [75.5, 12.4], [75.5, 13.1], [74.8, 12.4]]] },
    },
  ],
}

const findLayer = (districtId) =>
  layers.find((layer) => String(layer.feature.properties.district_id) === String(districtId))

const lastStyle = (districtId) => {
  const history = findLayer(districtId).styleHistory

  return history[history.length - 1]
}

beforeEach(() => {
  layers.length = 0
  fetchDistrictsGeoJSON.mockReset()
  fetchDistrictsGeoJSON.mockResolvedValue(SAMPLE_DATA)
})

afterEach(() => {
  cleanup()
})

describe('initial render', () => {
  it('fetches once, renders every district polygon, and shows no selection', async () => {
    render(<DistrictChoropleth />)

    expect(await screen.findByText('Bagalkote')).toBeInTheDocument()
    expect(screen.getByText('Dakshina Kannada')).toBeInTheDocument()
    expect(screen.getByText('Select a district')).toBeInTheDocument()
    expect(fetchDistrictsGeoJSON).toHaveBeenCalledTimes(1)

    // Unselected districts keep the plain administrative style.
    const bagalkote = lastStyle('524')

    expect(bagalkote.color).toBe('#ffffff')
    expect(bagalkote.weight).toBe(2.0) // Updated from 1.4 to 2.0 for better visibility
  })

  it('shows an explicit error when no polygons come back', async () => {
    fetchDistrictsGeoJSON.mockResolvedValue({ type: 'FeatureCollection', features: [] })

    render(<DistrictChoropleth />)

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/returned no usable polygons/i)).toBeInTheDocument()
  })

  it('surfaces the API error message for network failures', async () => {
    fetchDistrictsGeoJSON.mockRejectedValue(Object.assign(new Error('boom'), { userMessage: 'Cannot reach the API.' }))

    render(<DistrictChoropleth />)

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Cannot reach the API.')).toBeInTheDocument()
  })
})

describe('all 31 districts rendered', () => {
  it('renders every district returned by the authoritative dataset', async () => {
    const names = [
      { name: 'Bagalkote', code: '524' },
      { name: 'Ballari', code: '528' },
      { name: 'Belagavi', code: '527' },
      { name: 'Bengaluru Rural', code: '526' },
      { name: 'Bengaluru South', code: '631' },
      { name: 'Bengaluru Urban', code: '525' },
      { name: 'Bidar', code: '529' },
      { name: 'Chamarajanagar', code: '531' },
      { name: 'Chikkaballapura', code: '630' },
      { name: 'Chikkamagaluru', code: '532' },
      { name: 'Chitradurga', code: '533' },
      { name: 'Dakshina Kannada', code: '534' },
      { name: 'Davanagere', code: '535' },
      { name: 'Dharwad', code: '536' },
      { name: 'Gadag', code: '537' },
      { name: 'Hassan', code: '539' },
      { name: 'Haveri', code: '540' },
      { name: 'Kalaburagi', code: '538' },
      { name: 'Kodagu', code: '541' },
      { name: 'Kolar', code: '542' },
      { name: 'Koppal', code: '543' },
      { name: 'Mandya', code: '544' },
      { name: 'Mysuru', code: '545' },
      { name: 'Raichur', code: '546' },
      { name: 'Shivamogga', code: '547' },
      { name: 'Tumakuru', code: '548' },
      { name: 'Udupi', code: '549' },
      { name: 'Uttara Kannada', code: '550' },
      { name: 'Vijayanagara', code: '738' },
      { name: 'Vijayapura', code: '530' },
      { name: 'Yadgir', code: '635' },
    ]

    const fullData = {
      type: 'FeatureCollection',
      features: names.map((district) => ({
        id: district.code,
        type: 'Feature',
        properties: {
          district_id: district.code,
          district_name: district.name,
          state_name: 'Karnataka',
          water_stress_index: null,
          risk_category: 'insufficient_data',
          data_status: 'insufficient_data',
          data_coverage: 0,
          data_date: null,
          data_source: null,
        },
        geometry: { type: 'Polygon', coordinates: [[[74.9, 15.8], [75.6, 15.8], [75.6, 16.4], [74.9, 15.8]]] },
      })),
    }

    fetchDistrictsGeoJSON.mockResolvedValue(fullData)

    render(<DistrictChoropleth />)

    await screen.findByTestId('district-524')

    for (const district of names) {
      expect(screen.getByTestId(`district-${district.code}`)).toBeInTheDocument()
    }

    expect(screen.getByText('31 districts are displayed. Click any polygon to inspect its available information. No district is selected by default.')).toBeInTheDocument()

    // Selecting the newest official district shows its name and LGD ID.
    fireEvent.click(screen.getByTestId('district-738'))

    expect(await screen.findByRole('heading', { level: 3, name: 'Vijayanagara' })).toBeInTheDocument()
    expect(screen.getByText(/District ID: 738/)).toBeInTheDocument()
    expect(screen.getAllByText('Insufficient data').length).toBeGreaterThan(0)
  })
})

describe('selecting a district', () => {
  it('shows the selected district name while unverified metrics read Insufficient data', async () => {
    render(<DistrictChoropleth />)

    fireEvent.click(await screen.findByTestId('district-524'))

    expect(await screen.findByRole('heading', { level: 3, name: 'Bagalkote' })).toBeInTheDocument()
    expect(screen.getByText('SELECTED DISTRICT')).toBeInTheDocument()
    expect(screen.getAllByText('Insufficient data').length).toBeGreaterThan(0)
    expect(screen.getByText(/District ID: 524/)).toBeInTheDocument()

    // Color-derived values must NOT appear for an unverified district..
    expect(screen.getByText('Water Stress Index')).toBeInTheDocument()
    expect(screen.queryByText('80%')).not.toBeInTheDocument()
    expect(screen.queryByText('2024-06-15')).not.toBeInTheDocument()
  })

  it('shows API-backed values only when the feature is verified', async () => {
    render(<DistrictChoropleth />)

    fireEvent.click(await screen.findByTestId('district-574'))

    expect(await screen.findByRole('heading', { level: 3, name: 'Dakshina Kannada' })).toBeInTheDocument()
    expect(screen.getByText('0.61')).toBeInTheDocument()
    expect(screen.getByText('80%')).toBeInTheDocument()
    expect(screen.getByText('2024-06-15')).toBeInTheDocument()
    expect(screen.getByText('CGWB NWIC')).toBeInTheDocument()
  })

  it('displays individual metadata fields based on availability when score is verified', async () => {
    const dataWithPartialMetadata = {
      type: 'FeatureCollection',
      features: [
        {
          id: '524',
          type: 'Feature',
          properties: {
            district_id: '524',
            district_name: 'Bagalkote',
            state_name: 'Karnataka',
            water_stress_index: null,
            risk_category: 'insufficient_data',
            data_status: 'insufficient_data',
            data_coverage: 0,
            data_date: '2024-06-15', // Date available
            data_source: null, // No source
          },
          geometry: { type: 'Polygon', coordinates: [[[74.9, 15.8], [75.6, 15.8], [75.6, 16.4], [74.9, 15.8]]] },
        },
        {
          id: '574',
          type: 'Feature',
          properties: {
            district_id: '574',
            district_name: 'Dakshina Kannada',
            state_name: 'Karnataka',
            water_stress_index: 0.6104,
            risk_category: 'high',
            data_status: 'verified_district_metrics',
            data_coverage: 80,
            data_date: null, // No date
            data_source: 'CGWB NWIC', // Source available
          },
          geometry: { type: 'Polygon', coordinates: [[[74.8, 12.4], [75.5, 12.4], [75.5, 13.1], [74.8, 12.4]]] },
        },
      ],
    }

    fetchDistrictsGeoJSON.mockResolvedValue(dataWithPartialMetadata)

    render(<DistrictChoropleth />)

    // Click on Bagalkote - should show date but not source (because score not verified)
    fireEvent.click(await screen.findByTestId('district-524'))
    expect(await screen.findByRole('heading', { level: 3, name: 'Bagalkote' })).toBeInTheDocument()

    // When score is not verified, ALL metadata fields show "Insufficient data" regardless of actual data availability
    // Get the district map detail section (the aside element)
    const detailSection = screen.getByRole('complementary');

    // Check that all metadata labels are present
    expect(within(detailSection).getByText('Risk classification')).toBeInTheDocument();
    expect(within(detailSection).getByText('Data coverage')).toBeInTheDocument();
    expect(within(detailSection).getByText('Observation date')).toBeInTheDocument();
    expect(within(detailSection).getByText('Data source')).toBeInTheDocument();

    // When score is not verified, ALL metadata values show "Insufficient data"
    const insufficientDataElements = within(detailSection).getAllByText('Insufficient data');
    expect(insufficientDataElements).toHaveLength(5);

    // Click on Dakshina Kannada - should show actual values (because score is verified)
    fireEvent.click(await screen.findByTestId('district-574'));
    expect(await screen.findByRole('heading', { level: 3, name: 'Dakshina Kannada' })).toBeInTheDocument();

    // When score is verified, show actual data values
    expect(within(detailSection).getByText('Risk classification')).toBeInTheDocument();
    expect(within(detailSection).getByText('high')).toBeInTheDocument();
    expect(within(detailSection).getByText('Data coverage')).toBeInTheDocument();
    expect(within(detailSection).getByText('80%')).toBeInTheDocument();
    expect(within(detailSection).getByText('Observation date')).toBeInTheDocument();
    expect(within(detailSection).getByText('Insufficient data')).toBeInTheDocument(); // No date available
    expect(within(detailSection).getByText('Data source')).toBeInTheDocument();
    expect(within(detailSection).getByText('CGWB NWIC')).toBeInTheDocument();
  })

  it('highlights exactly the selected district without changing its category color', async () => {
    render(<DistrictChoropleth />)

    fireEvent.click(await screen.findByTestId('district-524'))
    await screen.findByText('SELECTED DISTRICT')

    const bagalkote = lastStyle('524')
    const dakshina = lastStyle('574')

    expect(bagalkote.weight).toBe(3)
    expect(bagalkote.weight).toBeGreaterThan(dakshina.weight)
    expect(bagalkote.color).toBe('#075f50')

    // Fill color cannot imply a risk category change on selection.
    const unselected = layers[0].styleHistory[0]

    expect(bagalkote.fillColor).toBe(unselected.fillColor)
    expect(dakshina.color).toBe('#ffffff')
  })

  it('keeps the selection and its highlight across rerenders and map updates', async () => {
    const { rerender } = render(<DistrictChoropleth />)

    fireEvent.click(await screen.findByTestId('district-524'))
    await screen.findByText('SELECTED DISTRICT')

    rerender(<DistrictChoropleth />)

    expect(screen.getByRole('heading', { level: 3, name: 'Bagalkote' })).toBeInTheDocument()
    expect(lastStyle('524').weight).toBe(3)
    expect(lastStyle('574').weight).toBe(2.0) // Updated from 1.4 to 2.0 for better visibility
  })

  it('binds exactly one select handler and one tooltip per district layer', async () => {
    render(<DistrictChoropleth />)
    await screen.findByTestId('district-524')

    const layer = findLayer('524')

    expect(Object.keys(layer.handlers).filter((name) => name === 'click').length).toBe(1)
    expect(layer.handlers.click).toBeTypeOf('function')
    expect(layer.tooltip).toBe('Bagalkote')
  })
})

describe('selection state isolation', () => {
  it('does not persist a selection across unmount/remount (separate page instances)', async () => {
    const first = render(<DistrictChoropleth />)

    fireEvent.click(await screen.findByTestId('district-524'))
    expect(await screen.findByText('SELECTED DISTRICT')).toBeInTheDocument()

    // Navigating between pages unmounts the component; a new page mounts a
    // fresh <DistrictChoropleth /> whose state must start clean.
    first.unmount()

    layers.length = 0
    render(<DistrictChoropleth />)

    expect(await screen.findByTestId('district-524')).toBeInTheDocument()
    expect(screen.getByText('Select a district')).toBeInTheDocument()
    expect(screen.queryByText('SELECTED DISTRICT')).not.toBeInTheDocument()
  })
})

describe('clearing the selection', () => {
  it('returns to the unselected state and removes the highlight', async () => {
    render(<DistrictChoropleth />)

    fireEvent.click(await screen.findByTestId('district-524'))
    fireEvent.click(await screen.findByRole('button', { name: /clear selection/i }))

    await waitFor(() => expect(screen.getByText('Select a district')).toBeInTheDocument())

    const style = lastStyle('524')

    expect(style.weight).toBe(2.0) // Updated from 1.4 to 2.0 for better visibility
    expect(style.color).toBe('#ffffff')

    // Re-selecting the same district after clearing still works.
    fireEvent.click(screen.getByTestId('district-524'))

    expect(await screen.findByText('SELECTED DISTRICT')).toBeInTheDocument()
  })

  it('switches selection when another district is clicked', async () => {
    render(<DistrictChoropleth />)

    fireEvent.click(await screen.findByTestId('district-524'))
    fireEvent.click(screen.getByTestId('district-574'))

    expect(await screen.findByRole('heading', { level: 3, name: 'Dakshina Kannada' })).toBeInTheDocument()
    expect(screen.queryByText(/District ID: 524/)).not.toBeInTheDocument()

    const bagalkote = lastStyle('524')
    const dakshina = lastStyle('574')

    expect(bagalkote.weight).toBe(2.0) // Updated from 1.4 to 2.0 for better visibility
    expect(dakshina.weight).toBe(3)
  })
})

  it('displays individual metadata fields based on availability when score is verified', async () => {
    const dataWithPartialMetadata = {
      type: 'FeatureCollection',
      features: [
        {
          id: '524',
          type: 'Feature',
          properties: {
            district_id: '524',
            district_name: 'Bagalkote',
            state_name: 'Karnataka',
            water_stress_index: null,
            risk_category: 'insufficient_data',
            data_status: 'insufficient_data',
            data_coverage: 0,
            data_date: '2024-06-15', // Date available
            data_source: null, // No source
          },
          geometry: { type: 'Polygon', coordinates: [[[74.9, 15.8], [75.6, 15.8], [75.6, 16.4], [74.9, 15.8]]] },
        },
        {
          id: '574',
          type: 'Feature',
          properties: {
            district_id: '574',
            district_name: 'Dakshina Kannada',
            state_name: 'Karnataka',
            water_stress_index: 0.6104,
            risk_category: 'high',
            data_status: 'verified_district_metrics',
            data_coverage: 80,
            data_date: null, // No date
            data_source: 'CGWB NWIC', // Source available
          },
          geometry: { type: 'Polygon', coordinates: [[[74.8, 12.4], [75.5, 12.4], [75.5, 13.1], [74.8, 12.4]]] },
        },
      ],
    }

    fetchDistrictsGeoJSON.mockResolvedValue(dataWithPartialMetadata)

    render(<DistrictChoropleth />)

    // Click on Bagalkote - should show date but not source (because score not verified)
    fireEvent.click(await screen.findByTestId('district-524'))
    expect(await screen.findByRole('heading', { level: 3, name: 'Bagalkote' })).toBeInTheDocument()

    // When score is not verified, ALL metadata fields show "Insufficient data" regardless of actual data availability
    // Check that all metadata labels are present (using role/text combinations to be specific)
    expect(screen.getByText('Risk classification')).toBeInTheDocument();
    expect(screen.getByText('Data coverage')).toBeInTheDocument();
    expect(screen.getByText('Observation date')).toBeInTheDocument();
    expect(screen.getByText('Data source')).toBeInTheDocument();

    // When score is not verified, ALL metadata values show "Insufficient data"
    // Look for strong elements containing "Insufficient data" within the detail section
    const detailSection = screen.getByRole('complementary');
    const strongElements = detailSection.querySelectorAll('strong');
    const insufficientDataCounts = Array.from(strongElements).filter(
      strong => strong.textContent.trim() === 'Insufficient data'
    ).length;
    expect(insufficientDataCounts).toBe(5); // Water Stress Index, Risk classification, Data coverage, Observation date, Data source

    // Click on Dakshina Kannada - should show actual values (because score is verified)
    fireEvent.click(await screen.findByTestId('district-574'))
    expect(await screen.findByRole('heading', { level: 3, name: 'Dakshina Kannada' })).toBeInTheDocument();

    // When score is verified, show actual data values
    // Check specific values in strong elements
    expect(screen.getByText('Risk classification')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('Data coverage')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('Observation date')).toBeInTheDocument();
    // Check that observation date shows "Insufficient data" (since data_date is null)
    const observationDateLabel = within(detailSection).getByText('Observation date');
    const observationDateValue = observationDateLabel.querySelector('strong');
    expect(observationDateValue).toHaveTextContent('Insufficient data');
    expect(screen.getByText('Data source')).toBeInTheDocument();
    expect(screen.getByText('CGWB NWIC')).toBeInTheDocument();
  })