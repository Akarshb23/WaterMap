/**
 * Shown when a view has no data to display.
 */
const EmptyState = ({ title = 'Nothing here yet', description }) => (
  <div className="empty-state">
    <p className="empty-state__title">{title}</p>
    {description ? <p className="empty-state__description">{description}</p> : null}
  </div>
)

export default EmptyState
