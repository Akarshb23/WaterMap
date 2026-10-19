/**
 * Renders ward features on the map.
 *
 * Placeholder behaviour: with no features (the bundled
 * `public/mock-data/wards.geojson` is an empty FeatureCollection) it renders
 * nothing; with features it renders a plain list until the react-leaflet
 * GeoJSON layer is implemented.
 */
const WardLayer = ({ features = [], onSelectWard }) => {
  if (features.length === 0) {
    return null
  }

  return (
    <ul className="ward-layer">
      {features.map((feature, index) => (
        <li key={feature?.id ?? index} className="ward-layer__item">
          <button type="button" onClick={() => onSelectWard?.(feature)}>
            {feature?.properties?.name ?? 'Unnamed ward'}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default WardLayer
