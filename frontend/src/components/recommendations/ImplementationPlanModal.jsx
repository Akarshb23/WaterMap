import { useEffect } from 'react'
import {
  AlertCircle,
  Building2,
  Calendar,
  Check,
  Coins,
  MapPin,
  TrendingUp,
  X,
} from 'lucide-react'

/**
 * Interactive modal presenting the full multi-phase Implementation Plan
 * for the selected recommendation.
 */
const ImplementationPlanModal = ({
  recommendation,
  isOpen,
  onClose,
  isPlanned = false,
  onTogglePlanned,
}) => {
  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !recommendation) return null

  return (
    <div className="implementation-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="implementation-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-plan-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="implementation-modal__header">
          <div>
            <div className="implementation-modal__badge-wrap">
              <span className="implementation-modal__badge">Strategic Roadmap</span>
              <span className="implementation-modal__sub-badge">{recommendation.implementation?.status || 'Active Plan'}</span>
            </div>
            <h3 className="implementation-modal__title" id="modal-plan-title">
              {recommendation.title}
            </h3>
          </div>
          <button
            type="button"
            className="implementation-modal__close-btn"
            onClick={onClose}
            aria-label="Close implementation plan modal"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="implementation-modal__body">
          {/* Key Metadata Row */}
          <div className="implementation-modal__metrics-grid">
            <div className="implementation-modal__metric-card">
              <MapPin size={18} className="implementation-modal__metric-icon" />
              <div>
                <span className="implementation-modal__metric-label">Target Scope</span>
                <p className="implementation-modal__metric-val">{recommendation.targetDistricts || recommendation.targetWards}</p>
              </div>
            </div>

            <div className="implementation-modal__metric-card">
              <Calendar size={18} className="implementation-modal__metric-icon" />
              <div>
                <span className="implementation-modal__metric-label">Time Horizon</span>
                <p className="implementation-modal__metric-val">{recommendation.timeHorizon}</p>
              </div>
            </div>

            <div className="implementation-modal__metric-card">
              <Coins size={18} className="implementation-modal__metric-icon" />
              <div>
                <span className="implementation-modal__metric-label">Budget Allocation</span>
                <p className="implementation-modal__metric-val">{recommendation.estimatedCost}</p>
              </div>
            </div>

            <div className="implementation-modal__metric-card">
              <Building2 size={18} className="implementation-modal__metric-icon" />
              <div>
                <span className="implementation-modal__metric-label">Lead Agency</span>
                <p className="implementation-modal__metric-val">{recommendation.implementation?.leadAgency || 'Bangalore Water Supply and Sewerage Board (BWSSB)'}</p>
              </div>
            </div>
          </div>

          {/* Phased Execution Roadmap */}
          <section className="implementation-modal__section">
            <h4 className="implementation-modal__section-title">
              <TrendingUp size={16} aria-hidden="true" />
              <span>Phased Execution Roadmap</span>
            </h4>
            <div className="implementation-modal__phases">
              {recommendation.implementation?.phases.map((ph, idx) => (
                <div key={ph.phase} className="implementation-modal__phase-item">
                  <div className="implementation-modal__phase-step">
                    <span>{idx + 1}</span>
                  </div>
                  <div className="implementation-modal__phase-content">
                    <span className="implementation-modal__phase-period">{ph.phase}</span>
                    <h5 className="implementation-modal__phase-name">{ph.title}</h5>
                    <p className="implementation-modal__phase-desc">{ph.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Funding & Governance */}
          <section className="implementation-modal__section">
            <h4 className="implementation-modal__section-title">
              <AlertCircle size={16} aria-hidden="true" />
              <span>Governance & Capital Structure</span>
            </h4>
            <div className="implementation-modal__gov-box">
              <p>
                <strong>Capital Sources:</strong> {recommendation.cost?.fundingSources}
              </p>
              <p>
                <strong>Economic Justification:</strong> {recommendation.cost?.roi}
              </p>
            </div>
          </section>
        </div>

        <footer className="implementation-modal__footer">
          <button
            type="button"
            className={`btn btn--outline${isPlanned ? ' btn--success' : ''}`}
            onClick={() => onTogglePlanned(recommendation.id)}
          >
            {isPlanned ? (
              <>
                <Check size={16} aria-hidden="true" />
                <span>Added to City Plan</span>
              </>
            ) : (
              <span>Add Intervention to Plan</span>
            )}
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={onClose}
          >
            Close Plan
          </button>
        </footer>
      </div>
    </div>
  )
}

export default ImplementationPlanModal
