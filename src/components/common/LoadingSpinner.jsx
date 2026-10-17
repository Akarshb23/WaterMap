/**
 * Accessible loading indicator.
 */
const LoadingSpinner = ({ label = 'Loading' }) => (
  <div className="loading-spinner" role="status" aria-live="polite">
    <span className="loading-spinner__circle" aria-hidden="true" />
    <span className="loading-spinner__label">{label}</span>
  </div>
)

export default LoadingSpinner
