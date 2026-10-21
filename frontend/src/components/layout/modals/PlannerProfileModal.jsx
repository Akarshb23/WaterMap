import { useState, useEffect } from 'react'
import {
  User,
  ShieldCheck,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  Copy,
  Save,
  X,
  Edit3,
  Award,
  TrendingDown,
  Droplets,
  DollarSign,
} from 'lucide-react'

const DEFAULT_PROFILE = {
  name: 'Akarsh',
  fullName: 'Akarsh B.',
  title: 'Principal Urban Hydrologist & City Water Planner',
  department: 'Urban Resilience & Climate Adaptation Division',
  organization: 'Bangalore Water Supply & Sewerage Board (BWSSB) & BBMP Joint Cell',
  email: 'akarsh@watermap.org',
  phone: '+91 (080) 2294-5500',
  office: 'Kaveri Bhavan, KG Road, Bengaluru, Karnataka 560009',
  jurisdiction: 'Bengaluru Urban Core & Peri-Urban Basins (198 Wards)',
  roleLevel: 'Level 4 Administrator',
  idNumber: 'WM-BLR-2026-0942',
  joinedDate: 'January 2024',
  bio: 'Leading city-wide water security forecasting, groundwater replenishment modeling, and municipal drought resilience infrastructure projects across Greater Bangalore.',
}

const PlannerProfileModal = ({ isOpen, onClose, onSaveProfile, onShowToast }) => {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('watermap_planner_profile')
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE
    } catch {
      return DEFAULT_PROFILE
    }
  })

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(profile)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem('watermap_planner_profile')
        if (saved) {
          const parsed = JSON.parse(saved)
          setProfile(parsed)
          setFormData(parsed)
        }
      } catch {
        // use default
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleCopyId = () => {
    navigator.clipboard?.writeText(profile.idNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    onShowToast?.('Planner ID copied to clipboard')
  }

  const handleSave = (e) => {
    e.preventDefault()
    setProfile(formData)
    localStorage.setItem('watermap_planner_profile', JSON.stringify(formData))
    setIsEditing(false)
    onSaveProfile?.(formData)
    onShowToast?.('Planner profile updated successfully')
  }

  const handleReset = () => {
    setFormData(DEFAULT_PROFILE)
    setProfile(DEFAULT_PROFILE)
    localStorage.removeItem('watermap_planner_profile')
    setIsEditing(false)
    onSaveProfile?.(DEFAULT_PROFILE)
    onShowToast?.('Profile reset to default')
  }

  return (
    <div className="wm-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="wm-modal wm-profile-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
      >
        <header className="wm-modal__header">
          <div className="wm-modal__title-wrap">
            <div className="wm-modal__title-icon wm-modal__title-icon--emerald">
              <User size={18} />
            </div>
            <div>
              <h2 id="profile-modal-title" className="wm-modal__title">
                City Water Planner Profile
              </h2>
              <span className="wm-modal__subtitle">
                Official Municipal Resilience Authority Credentials
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
          {/* Hero Profile Banner */}
          <div className="wm-profile-hero">
            <div className="wm-profile-hero__avatar-wrap">
              <div className="wm-profile-hero__avatar">
                {formData.name.charAt(0)}
              </div>
              <span className="wm-profile-hero__online-dot" title="Active Session" />
            </div>

            <div className="wm-profile-hero__content">
              <div className="wm-profile-hero__name-row">
                <h3 className="wm-profile-hero__name">{formData.fullName || formData.name}</h3>
                <span className="wm-profile-hero__badge">
                  <ShieldCheck size={13} />
                  <span>{formData.roleLevel}</span>
                </span>
              </div>
              <div className="wm-profile-hero__title">{formData.title}</div>
              <div className="wm-profile-hero__org">{formData.organization}</div>
            </div>

            <div className="wm-profile-hero__actions">
              <button
                type="button"
                className={`wm-btn wm-btn--sm ${isEditing ? 'wm-btn--secondary' : 'wm-btn--primary'}`}
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit3 size={14} />
                <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="wm-profile-stats">
            <div className="wm-profile-stat-card">
              <div className="wm-profile-stat-card__icon wm-profile-stat-card__icon--emerald">
                <Droplets size={16} />
              </div>
              <div className="wm-profile-stat-card__val">24</div>
              <div className="wm-profile-stat-card__lbl">Interventions Tracked</div>
            </div>

            <div className="wm-profile-stat-card">
              <div className="wm-profile-stat-card__icon wm-profile-stat-card__icon--cyan">
                <Award size={16} />
              </div>
              <div className="wm-profile-stat-card__val">12</div>
              <div className="wm-profile-stat-card__lbl">Priority Basins</div>
            </div>

            <div className="wm-profile-stat-card">
              <div className="wm-profile-stat-card__icon wm-profile-stat-card__icon--teal">
                <TrendingDown size={16} />
              </div>
              <div className="wm-profile-stat-card__val">38%</div>
              <div className="wm-profile-stat-card__lbl">Target WSI Reduction</div>
            </div>

            <div className="wm-profile-stat-card">
              <div className="wm-profile-stat-card__icon wm-profile-stat-card__icon--amber">
                <DollarSign size={16} />
              </div>
              <div className="wm-profile-stat-card__val">₹520 Cr</div>
              <div className="wm-profile-stat-card__lbl">Monitored Budget</div>
            </div>
          </div>

          {/* Details / Edit Form */}
          {isEditing ? (
            <form onSubmit={handleSave} className="wm-profile-form">
              <div className="wm-profile-form__grid">
                <div className="wm-form-group">
                  <label htmlFor="pf-name">Display Name</label>
                  <input
                    id="pf-name"
                    type="text"
                    className="wm-form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="wm-form-group">
                  <label htmlFor="pf-fullname">Full Legal Name</label>
                  <input
                    id="pf-fullname"
                    type="text"
                    className="wm-form-input"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>

                <div className="wm-form-group wm-form-group--full">
                  <label htmlFor="pf-title">Official Title & Role</label>
                  <input
                    id="pf-title"
                    type="text"
                    className="wm-form-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="wm-form-group wm-form-group--full">
                  <label htmlFor="pf-org">Department & Organization</label>
                  <input
                    id="pf-org"
                    type="text"
                    className="wm-form-input"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    required
                  />
                </div>

                <div className="wm-form-group">
                  <label htmlFor="pf-email">Official Email</label>
                  <input
                    id="pf-email"
                    type="email"
                    className="wm-form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="wm-form-group">
                  <label htmlFor="pf-phone">Desk Phone / Extension</label>
                  <input
                    id="pf-phone"
                    type="text"
                    className="wm-form-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="wm-form-group wm-form-group--full">
                  <label htmlFor="pf-jurisdiction">Municipal Jurisdiction</label>
                  <input
                    id="pf-jurisdiction"
                    type="text"
                    className="wm-form-input"
                    value={formData.jurisdiction}
                    onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                  />
                </div>

                <div className="wm-form-group wm-form-group--full">
                  <label htmlFor="pf-office">Office Address</label>
                  <input
                    id="pf-office"
                    type="text"
                    className="wm-form-input"
                    value={formData.office}
                    onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                  />
                </div>

                <div className="wm-form-group wm-form-group--full">
                  <label htmlFor="pf-bio">Professional Bio & Scope</label>
                  <textarea
                    id="pf-bio"
                    rows={3}
                    className="wm-form-textarea"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>
              </div>

              <div className="wm-profile-form__footer">
                <button
                  type="button"
                  className="wm-btn wm-btn--ghost"
                  onClick={handleReset}
                >
                  Reset Defaults
                </button>
                <div className="wm-profile-form__footer-right">
                  <button
                    type="button"
                    className="wm-btn wm-btn--secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="wm-btn wm-btn--primary">
                    <Save size={15} />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="wm-profile-details">
              <div className="wm-profile-detail-card">
                <div className="wm-profile-detail-card__header">
                  <Building size={15} className="wm-profile-detail-card__icon" />
                  <span>Administrative Jurisdiction</span>
                </div>
                <div className="wm-profile-detail-row">
                  <span className="wm-profile-detail-label">Assigned Area:</span>
                  <span className="wm-profile-detail-value">{profile.jurisdiction}</span>
                </div>
                <div className="wm-profile-detail-row">
                  <span className="wm-profile-detail-label">Headquarters:</span>
                  <span className="wm-profile-detail-value">{profile.office}</span>
                </div>
                <div className="wm-profile-detail-row">
                  <span className="wm-profile-detail-label">System Role:</span>
                  <span className="wm-profile-detail-value wm-tag wm-tag--emerald">
                    {profile.roleLevel} • Policy Author
                  </span>
                </div>
              </div>

              <div className="wm-profile-detail-card">
                <div className="wm-profile-detail-card__header">
                  <Mail size={15} className="wm-profile-detail-card__icon" />
                  <span>Contact & Credentials</span>
                </div>
                <div className="wm-profile-detail-row">
                  <span className="wm-profile-detail-label">Email:</span>
                  <span className="wm-profile-detail-value">
                    <a href={`mailto:${profile.email}`} className="wm-link">
                      {profile.email}
                    </a>
                  </span>
                </div>
                <div className="wm-profile-detail-row">
                  <span className="wm-profile-detail-label">Phone:</span>
                  <span className="wm-profile-detail-value">{profile.phone}</span>
                </div>
                <div className="wm-profile-detail-row">
                  <span className="wm-profile-detail-label">Planner ID:</span>
                  <span className="wm-profile-detail-value wm-profile-id-row">
                    <code>{profile.idNumber}</code>
                    <button
                      type="button"
                      className="wm-profile-id-copy"
                      onClick={handleCopyId}
                      title="Copy Planner ID"
                    >
                      {copied ? <CheckCircle2 size={13} className="wm-text-emerald" /> : <Copy size={13} />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </span>
                </div>
              </div>

              <div className="wm-profile-bio-card">
                <h4 className="wm-profile-bio-card__title">Planner Scope & Mandate</h4>
                <p className="wm-profile-bio-card__text">{profile.bio}</p>
              </div>
            </div>
          )}
        </div>

        <footer className="wm-modal__footer">
          <div className="wm-profile-footer-meta">
            <Calendar size={13} />
            <span>Active planner credentials verified for 2026 municipal cycle</span>
          </div>
          <button type="button" className="wm-btn wm-btn--secondary" onClick={onClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
  )
}

export default PlannerProfileModal
