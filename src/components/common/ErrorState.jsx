/**
 * Error banner used when a view fails to load.
 */
const ErrorState = ({ message = 'Something went wrong.', onRetry }) => (
  <div className="error-state" role="alert">
    <p className="error-state__message">{message}</p>
    {onRetry ? (
      <button type="button" className="error-state__retry" onClick={onRetry}>
        Try again
      </button>
    ) : null}
  </div>
)

export default ErrorState
