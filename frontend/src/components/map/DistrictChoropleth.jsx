import { useCallback, useEffect, useMemo, useState } from 'react'
import { Droplets } from 'lucide-react'
import { GeoJSON, MapContainer, useMap } from 'react-leaflet'
import L from 'leaflet'

import 'leaflet/dist/leaflet.css'
import '../../styles/district-map.css'

import { fetchDistrictsGeoJSON } from '../../services/districtMapService.js'

import {
  RISK_COLORS,
  getDistrictId,
  getSelectedDistrictId,
  hasUsableScore,
  hasVerifiedScore,
  hasEstimatedScore,
  normalizeRisk,
  styleFeature,
} from './districtMap.js'

function FitDistricts({ data }) {
  const map = useMap()

  useEffect(() => {
    if (!data?.features?.length) return

    const bounds = L.geoJSON(data).getBounds()

    if (bounds.isValid()) {
      map.invalidateSize({ pan: false })
      map.fitBounds(bounds, {
        padding: [45, 45],
        maxZoom: 7,
      })
    }
  }, [data, map])

  return null
}

function SelectionStyles({ selectedDistrictId }) {
  const map = useMap()

  useEffect(() => {
    map.eachLayer((layer) => {
      if (
        layer.feature &&
        typeof layer.setStyle === 'function' &&
        getDistrictId(layer.feature) !== null
      ) {
        layer.setStyle(styleFeature(layer.feature, selectedDistrictId))
      }
    })
  }, [map, selectedDistrictId])

  return null
}

function formatValue(value, digits = 2) {
  if (value === null || value === undefined || value === '') {
    return 'Not available'
  }

  const number = Number(value)
  return Number.isFinite(number) ? number.toFixed(digits) : String(value)
}

function MetricCard({ label, value }) {
  return (
    <div className="district-map-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function MetadataCard({ label, children, className = '' }) {
  return (
    <div className={`district-map-meta-card ${className}`.trim()}>
      <span>{label}</span>
      <strong>{children || 'Not available'}</strong>
    </div>
  )
}

export default function DistrictChoropleth() {
  const [data, setData] = useState(null)
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadDistricts() {
      setLoading(true)
      setError('')

      try {
        const result = await fetchDistrictsGeoJSON({
          signal: controller.signal,
        })

        if (controller.signal.aborted) return

        if (
          !result ||
          result.type !== 'FeatureCollection' ||
          !Array.isArray(result.features) ||
          result.features.length === 0
        ) {
          throw new Error(
            'The district boundary endpoint returned no usable polygons.',
          )
        }

        setData(result)
        setSelected(null)
      } catch (err) {
        if (controller.signal.aborted) return

        setError(
          err?.userMessage ||
            err?.message ||
            'District boundaries could not be loaded.',
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadDistricts()

    return () => controller.abort()
  }, [])

  const selectedDistrictId = getSelectedDistrictId(selected)

  const selectedFeature = useMemo(() => {
    if (selectedDistrictId === null || !data?.features?.length) {
      return null
    }

    return (
      data.features.find(
        (feature) => getDistrictId(feature) === selectedDistrictId,
      ) ?? null
    )
  }, [data, selectedDistrictId])

  const selectedProperties = selectedFeature?.properties ?? null

  const scoreIsVerified = selectedProperties
    ? hasVerifiedScore(selectedProperties)
    : false

  const scoreIsEstimated = selectedProperties
    ? hasEstimatedScore(selectedProperties)
    : false

  const scoreIsAvailable = selectedProperties
    ? hasUsableScore(selectedProperties)
    : false

  const districtCount = data?.features?.length ?? 0

  const verifiedCount = useMemo(
    () =>
      data?.features?.filter((feature) =>
        hasVerifiedScore(feature.properties),
      ).length ?? 0,
    [data],
  )

  const estimatedCount = useMemo(
    () =>
      data?.features?.filter((feature) =>
        hasEstimatedScore(feature.properties),
      ).length ?? 0,
    [data],
  )

  const geoJsonKey = useMemo(
    () =>
      JSON.stringify(
        (data?.features ?? []).map(
          (feature) =>
            getDistrictId(feature) ??
            feature.properties?.district_name ??
            'unknown',
        ),
      ),
    [data],
  )

  const onEachFeature = useCallback((feature, layer) => {
    const properties = feature?.properties ?? {}
    const districtId = getDistrictId(feature)
    const name = properties.district_name || 'Unnamed district'

    layer.bindTooltip(name, {
      sticky: true,
      direction: 'auto',
      className: 'district-map-tooltip',
    })

    layer.on({
      click: () => {
        if (districtId === null) {
          console.warn('Clicked district has no district ID:', properties)
          return
        }

        setSelected({ districtId })
      },
    })
  }, [])

  return (
    <div className="district-map-shell">
      <header className="district-map-toolbar">
        <div className="district-map-toolbar__copy">
          <span className="district-map-eyebrow">
            KARNATAKA · DISTRICT VIEW
          </span>

          <h2>Water stress by district</h2>

          <p>
            Select a district to inspect its score, indicators, and data
            availability.
          </p>
        </div>

        <span className="district-map-status">
          <i aria-hidden="true" />
          {verifiedCount} verified · {estimatedCount} estimated scores
        </span>
      </header>

      {loading && (
        <div className="district-map-message" role="status">
          Loading district boundaries…
        </div>
      )}

      {error && !loading && (
        <div
          className="district-map-message district-map-message--error"
          role="alert"
        >
          <strong>District map unavailable</strong>
          <p>{error}</p>
          <p>
            Confirm the backend is running and the district GeoJSON endpoint
            returns a valid FeatureCollection.
          </p>
        </div>
      )}

      {data && !loading && !error && (
        <div className="district-map-canvas">
          <MapContainer
            center={[15.1, 76.2]}
            zoom={6}
            minZoom={5}
            maxZoom={10}
            scrollWheelZoom
            zoomControl
            preferCanvas
            className="district-map-leaflet"
          >
            <FitDistricts data={data} />

            <GeoJSON
              key={geoJsonKey}
              data={data}
              style={(feature) => styleFeature(feature, selectedDistrictId)}
              onEachFeature={onEachFeature}
            />

            <SelectionStyles selectedDistrictId={selectedDistrictId} />
          </MapContainer>

          <div className="district-map-legend" aria-label="Map legend">
            <strong>Map legend</strong>

            {Object.entries(RISK_COLORS).map(([risk, color]) => (
              <span key={risk}>
                <i
                  className="district-map-legend__swatch"
                  style={{ backgroundColor: color }}
                />
                {risk === 'insufficient_data'
                  ? 'Insufficient data'
                  : `${risk[0].toUpperCase()}${risk.slice(1)} stress`}
              </span>
            ))}

            <span>
              <i className="district-map-legend__swatch district-map-legend__swatch--admin" />
              Administrative boundary
            </span>

            <small>
              Estimated scores are model outputs, not verified observations.
              Administrative colors do not represent water stress.
            </small>
          </div>
        </div>
      )}

      {data && !loading && !error && (
        <section className="district-map-detail" aria-live="polite">
          {selectedProperties ? (
            <>
              <div className="district-map-detail__top">
                <div className="district-map-detail__heading">
                  <span className="district-map-eyebrow">
                    SELECTED DISTRICT
                  </span>

                  <h3>
                    {selectedProperties.district_name || 'Unnamed district'}
                  </h3>

                  <p>
                    {selectedProperties.district_id != null
                      ? `District ID: ${selectedProperties.district_id} · `
                      : ''}
                    {selectedProperties.state_name || 'Karnataka'}, India
                  </p>
                </div>

                <div className="district-map-detail__score">
                  <span>Water Stress Index</span>

                  <strong>
                    {scoreIsAvailable
                      ? formatValue(selectedProperties.water_stress_index)
                      : 'N/A'}
                  </strong>

                  <small>
                    {scoreIsVerified
                      ? 'Source-backed score'
                      : scoreIsEstimated
                        ? 'Model estimate — provisional, not a verified measurement'
                        : 'No usable district-level score is available'}
                  </small>
                </div>

                <button
                  type="button"
                  className="district-map-clear"
                  onClick={() => setSelected(null)}
                >
                  Clear selection
                </button>

                <div className="district-map-detail__visual" aria-hidden="true">
                  <div className="district-map-detail__visual-circle">
                    <Droplets size={58} strokeWidth={1.4} />
                  </div>

                  <span>Every drop matters</span>
                  <small>Water intelligence</small>
                </div>
              </div>

              <div className="district-map-detail__meta">
                <MetadataCard label="Risk classification">
                  {normalizeRisk(selectedProperties.risk_category) ??
                    'Insufficient data'}
                </MetadataCard>

                <MetadataCard label="Indicator families populated">
                  {selectedProperties.data_coverage != null
                    ? `${selectedProperties.data_coverage}%`
                    : 'Not available'}
                </MetadataCard>

                <MetadataCard label="Observation date">
                  {selectedProperties.data_date || 'Not available'}
                </MetadataCard>

                <MetadataCard
                  label="Data source"
                  className="district-map-meta-card--source"
                >
                  {selectedProperties.data_source || 'Not available'}
                </MetadataCard>

                <MetadataCard label="Verified / estimated indicators">
                  {`${selectedProperties.verified_indicators ?? 0} verified · ${selectedProperties.estimated_indicators ?? 0} estimated`}
                </MetadataCard>
              </div>

              <div className="district-map-indicators">
                <div className="district-map-indicators__heading">
                  <h4>Indicator breakdown</h4>
                  <p>Values are normalized scores returned by the API.</p>
                </div>

                <div className="district-map-indicators__grid">
                  <MetricCard
                    label="Groundwater"
                    value={formatValue(
                      selectedProperties.indicator_scores?.groundwater,
                    )}
                  />

                  <MetricCard
                    label="Rainfall"
                    value={formatValue(
                      selectedProperties.indicator_scores?.rainfall,
                    )}
                  />

                  <MetricCard
                    label="Piped water supply"
                    value={formatValue(
                      selectedProperties.indicator_scores?.piped_supply,
                    )}
                  />

                  <MetricCard
                    label="Tanker reliance"
                    value={formatValue(
                      selectedProperties.indicator_scores?.tanker_reliance,
                    )}
                  />

                  <MetricCard
                    label="Water bodies"
                    value={formatValue(
                      selectedProperties.indicator_scores?.water_bodies,
                    )}
                  />
                </div>

                <p className="district-map-indicators__note">
                  Indicator values are shown as returned by the API. Estimated
                  indicators must not be interpreted as observed measurements.
                </p>
              </div>
            </>
          ) : (
            <div className="district-map-empty">
              <span className="district-map-empty__icon" aria-hidden="true">
                ⌖
              </span>

              <div>
                <h3>Select a district</h3>
                <p>
                  {districtCount} districts are displayed. Click any district
                  polygon to view its score, risk category, and available
                  indicators.
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      <p className="district-map-footnote">
        Source-backed measurements and model estimates are distinguished in
        district details. Estimated scores are provisional and must not be
        presented as official observations.
      </p>
    </div>
  )
}
