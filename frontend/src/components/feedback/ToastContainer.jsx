import Toast from './Toast.jsx'

/**
 * Fixed-position stack of active toasts.
 * `toasts` is `[{ id, message, tone }]`.
 */
const ToastContainer = ({ toasts = [], onDismiss }) => (
  <div className="toast-container" aria-live="polite" aria-atomic="false">
    {toasts.map((toast) => (
      <Toast
        key={toast.id}
        message={toast.message}
        tone={toast.tone}
        onDismiss={onDismiss ? () => onDismiss(toast.id) : undefined}
      />
    ))}
  </div>
)

export default ToastContainer
