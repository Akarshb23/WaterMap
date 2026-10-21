import { LogOut, AlertTriangle, User, ShieldCheck, X } from 'lucide-react'

const SignOutModal = ({ isOpen, onClose, onConfirmSignOut, userName = 'Akarsh' }) => {
  if (!isOpen) return null

  return (
    <div className="wm-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="wm-modal wm-signout-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="signout-modal-title"
      >
        <header className="wm-modal__header">
          <div className="wm-modal__title-wrap">
            <div className="wm-modal__title-icon wm-modal__title-icon--rose">
              <LogOut size={18} />
            </div>
            <div>
              <h2 id="signout-modal-title" className="wm-modal__title">
                Sign Out of WaterMap
              </h2>
              <span className="wm-modal__subtitle">
                End active municipal planning session
              </span>
            </div>
          </div>
          <button
            type="button"
            className="wm-modal__close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </header>

        <div className="wm-modal__body">
          <div className="wm-signout-user-card">
            <div className="wm-signout-avatar">{userName.charAt(0)}</div>
            <div className="wm-signout-info">
              <div className="wm-signout-name">{userName}</div>
              <div className="wm-signout-role">City Water Planner • Level 4 Admin</div>
              <div className="wm-signout-org">Bangalore Water Supply & Sewerage Board</div>
            </div>
          </div>

          <div className="wm-signout-notice">
            <AlertTriangle size={18} className="wm-text-amber wm-flex-shrink-0" />
            <p>
              Are you sure you want to end your current session? You will be switched to
              <strong> Guest Mode</strong>. Unsaved simulation scenario drafts and district notes
              remain safely preserved in your browser cache.
            </p>
          </div>
        </div>

        <footer className="wm-modal__footer">
          <button type="button" className="wm-btn wm-btn--secondary" onClick={onClose}>
            Stay Signed In
          </button>
          <button
            type="button"
            className="wm-btn wm-btn--danger"
            onClick={() => {
              onConfirmSignOut()
              onClose()
            }}
          >
            <LogOut size={15} />
            <span>Confirm Sign Out</span>
          </button>
        </footer>
      </div>
    </div>
  )
}

export default SignOutModal
