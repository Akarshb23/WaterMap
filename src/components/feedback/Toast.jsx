/**
 * Single toast notification. `tone` drives styling
 * (success | error | info | warning).
 */
const Toast = ({ message, tone = 'info', onDismiss }) => (
  <div className={`toast toast--${tone}`} role="status" aria-live="polite">
    <span className="toast__message">{message}</span>
    {onDismiss ? (
      <button type="button" className="toast__dismiss" onClick={onDismiss} aria-label="Dismiss notification">
        &times;
      </button>
    ) : null}
  </div>
)

export default Toast
