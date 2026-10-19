/**
 * Confirmation dialog for destructive or irreversible actions.
 * The caller controls `open`, `onConfirm` and `onCancel`.
 */
const ConfirmDialog = ({ title = 'Are you sure?', message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', open, onConfirm, onCancel }) => {
  if (!open) {
    return null
  }

  return (
    <div className="confirm-dialog" role="dialog" aria-modal="true" aria-label={title}>
      <h2 className="confirm-dialog__title">{title}</h2>
      {message ? <p className="confirm-dialog__message">{message}</p> : null}
      <div className="confirm-dialog__actions">
        <button type="button" className="confirm-dialog__cancel" onClick={onCancel}>
          {cancelLabel}
        </button>
        <button type="button" className="confirm-dialog__confirm" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </div>
  )
}

export default ConfirmDialog
