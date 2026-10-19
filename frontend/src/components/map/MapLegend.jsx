/**
 * Legend explaining the ward colour coding on the map.
 * `items` is `[{ label, color }]`; pass `title={null}` to render a compact
 * overlay without the heading.
 */
const MapLegend = ({ items = [], title = 'Legend', children }) => (
  <div className="map-legend" aria-label="Map legend">
    {title ? <h3 className="map-legend__title">{title}</h3> : null}
    <ul className="map-legend__list">
      {items.map((item) => (
        <li key={item.label} className="map-legend__item">
          <span
            className="map-legend__swatch"
            style={{ backgroundColor: item.color }}
            aria-hidden="true"
          />
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
    {children}
  </div>
)

export default MapLegend
