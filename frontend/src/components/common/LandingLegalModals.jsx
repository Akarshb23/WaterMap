import { useState } from 'react'
import { ShieldCheck, FileText, Mail, Send, CheckCircle2, Globe, MapPin } from 'lucide-react'

export const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="wm-modal-overlay" role="presentation" onClick={onClose}>
      <div className="wm-modal wm-doc-modal" role="dialog" aria-modal="true" aria-labelledby="privacy-modal-title" onClick={(e) => e.stopPropagation()}>
        <div className="wm-modal__header">
          <div className="wm-modal__title-wrap">
            <div className="wm-modal__title-icon wm-modal__title-icon--emerald">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="wm-modal__title" id="privacy-modal-title">Privacy Policy</h3>
              <span className="wm-modal__subtitle">Last updated: October 2026 • Karnataka Water Security Initiative</span>
            </div>
          </div>
          <button type="button" className="wm-modal__close-btn" onClick={onClose} aria-label="Close dialog">
            &times;
          </button>
        </div>

        <div className="wm-modal__body">
          <div className="wm-doc-pane">
            <div className="wm-doc-callout">
              <h4>Commitment to Open Geospatial & Public Water Integrity</h4>
              <p>
                WaterMap is an urban water risk analysis and decision-support platform designed for urban local bodies, researchers, and citizens in Karnataka. We are committed to transparency, open data stewardship, and safeguarding personal data.
              </p>
            </div>

            <section>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f2937', marginBottom: '0.4rem' }}>1. Information We Collect</h4>
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.55 }}>
                WaterMap processes publicly accessible environmental, satellite, groundwater, rainfall, and administrative ward data from government sources (including Karnataka Groundwater Authority, IMD, BWSSB, and KGIS). When using the platform, we collect anonymous usage telemetry and optional user-submitted preferences stored locally in your browser.
              </p>
            </section>

            <section>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f2937', marginBottom: '0.4rem' }}>2. How We Use Data</h4>
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.55 }}>
                Aggregated geospatial metrics and water stress indices (WSI) are computed strictly for urban planning, sustainability scenario modeling, and risk visibility. We never sell, monetize, or broker telemetry data to third parties.
              </p>
            </section>

            <section>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f2937', marginBottom: '0.4rem' }}>3. Data Retention & Cookies</h4>
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.55 }}>
                Session tokens and custom simulation inputs are saved in your browser local storage. You can reset all saved state at any time through the platform preferences menu or by clearing your browser cache.
              </p>
            </section>

            <section>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f2937', marginBottom: '0.4rem' }}>4. Contact Us Concerning Privacy</h4>
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.55 }}>
                If you have inquiries about our data governance or compliance with regional digital privacy frameworks, reach out to our team at <strong>privacy@watermap.org</strong>.
              </p>
            </section>
          </div>
        </div>

        <div className="wm-modal__footer">
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Protected under Karnataka Digital Governance Guidelines</span>
          <button type="button" className="wm-btn wm-btn--primary" onClick={onClose}>
            I Understand
          </button>
        </div>
      </div>
    </div>
  )
}

export const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="wm-modal-overlay" role="presentation" onClick={onClose}>
      <div className="wm-modal wm-doc-modal" role="dialog" aria-modal="true" aria-labelledby="terms-modal-title" onClick={(e) => e.stopPropagation()}>
        <div className="wm-modal__header">
          <div className="wm-modal__title-wrap">
            <div className="wm-modal__title-icon wm-modal__title-icon--teal">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="wm-modal__title" id="terms-modal-title">Terms of Service</h3>
              <span className="wm-modal__subtitle">Platform guidelines • Non-commercial open research platform</span>
            </div>
          </div>
          <button type="button" className="wm-modal__close-btn" onClick={onClose} aria-label="Close dialog">
            &times;
          </button>
        </div>

        <div className="wm-modal__body">
          <div className="wm-doc-pane">
            <div className="wm-doc-callout" style={{ backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }}>
              <h4 style={{ color: '#0369a1' }}>Open Research & Decision Support License</h4>
              <p style={{ color: '#0c4a6e' }}>
                By accessing and utilizing WaterMap dashboards, maps, and simulations, you agree to comply with the following operational terms and non-commercial open data provisions.
              </p>
            </div>

            <section>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f2937', marginBottom: '0.4rem' }}>1. Intended Use</h4>
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.55 }}>
                WaterMap is provided for municipal analysis, hydrological research, urban resilience evaluation, and citizen awareness. While simulations apply calibrated models against verified district datasets, projections should be corroborated with on-site engineering assessments prior to civil works.
              </p>
            </section>

            <section>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f2937', marginBottom: '0.4rem' }}>2. Intellectual Property & Citation</h4>
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.55 }}>
                Public research papers, policy briefs, and civic reports utilizing WaterMap charts and exported datasets may do so with appropriate citation: <em>"Source: WaterMap Karnataka Urban Water Intelligence (2026)"</em>.
              </p>
            </section>

            <section>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f2937', marginBottom: '0.4rem' }}>3. Limitation of Liability</h4>
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.55 }}>
                The platform is delivered "as is" without warranty of continuous uninterrupted service. Model predictions represent probabilistic scenarios and do not constitute legal or statutory guarantees of municipal water allotment.
              </p>
            </section>
          </div>
        </div>

        <div className="wm-modal__footer">
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>WaterMap • Open Civic Data Framework</span>
          <button type="button" className="wm-btn wm-btn--primary" onClick={onClose}>
            Accept & Close
          </button>
        </div>
      </div>
    </div>
  )
}

export const ContactModal = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Urban Water Research', message: '' })

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)

    // Send email notification to akshatavs1122@gmail.com via mailto intent
    const subject = encodeURIComponent(`[WaterMap Inquiry] ${formData.subject} - from ${formData.name}`)
    const body = encodeURIComponent(
      `Sender Name: ${formData.name}\nSender Email: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`
    )
    const mailtoUrl = `mailto:akshatavs1122@gmail.com?subject=${subject}&body=${body}`

    // Trigger user mail client in background
    const mailWindow = window.open(mailtoUrl, '_blank')
    if (mailWindow) {
      setTimeout(() => {
        try { mailWindow.close() } catch (_) {}
      }, 500)
    }
  }

  return (
    <div className="wm-modal-overlay" role="presentation" onClick={onClose}>
      <div className="wm-modal wm-doc-modal" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title" onClick={(e) => e.stopPropagation()}>
        <div className="wm-modal__header">
          <div className="wm-modal__title-wrap">
            <div className="wm-modal__title-icon wm-modal__title-icon--cyan">
              <Mail size={20} />
            </div>
            <div>
              <h3 className="wm-modal__title" id="contact-modal-title">Contact & Research Team</h3>
              <span className="wm-modal__subtitle">Connect with WaterMap engineers, researchers, and contributors</span>
            </div>
          </div>
          <button type="button" className="wm-modal__close-btn" onClick={onClose} aria-label="Close dialog">
            &times;
          </button>
        </div>

        <div className="wm-modal__body">
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', marginBottom: '1rem' }}>
                <CheckCircle2 size={36} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f2937', marginBottom: '0.4rem' }}>Message Prepared!</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '380px', margin: '0 auto 1.5rem' }}>
                Your message has been addressed directly to <strong>akshatavs1122@gmail.com</strong>.
              </p>
              <button
                type="button"
                className="wm-btn wm-btn--primary"
                onClick={() => {
                  setSubmitted(false)
                  onClose()
                }}
              >
                Done
              </button>
            </div>
          ) : (
            <div className="wm-doc-pane">
              <div style={{ marginBottom: '0.75rem' }}>
                <div className="wm-doc-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', color: '#0891b2' }}>
                    <Globe size={16} />
                    <strong style={{ fontSize: '0.82rem' }}>Project Repository & Direct Contact</strong>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                    Inquiries are delivered directly to <strong style={{ color: '#075d4c' }}>akshatavs1122@gmail.com</strong> • Open source on{' '}
                    <a href="https://github.com/Akarshb23/WaterMap.git" target="_blank" rel="noopener noreferrer" style={{ color: '#0891b2', fontWeight: 600 }}>
                      GitHub
                    </a>
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                  <div className="wm-form-group">
                    <label htmlFor="contact-name">Your Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="e.g. Dr. Priya Rao"
                      className="wm-form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="wm-form-group">
                    <label htmlFor="contact-email">Email Address</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="e.g. name@organization.org"
                      className="wm-form-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="wm-form-group">
                  <label htmlFor="contact-subject">Inquiry Subject</label>
                  <select
                    id="contact-subject"
                    className="wm-form-select"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="Urban Water Research">Urban Water Research & Data Ingestion</option>
                    <option value="Municipal Ward Planning">Municipal Ward Planning & ULB Integration</option>
                    <option value="Dataset Feedback">Dataset Feedback or Correction</option>
                    <option value="Platform Bug / Suggestion">Platform Bug or Feature Suggestion</option>
                  </select>
                </div>

                <div className="wm-form-group">
                  <label htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    rows={3}
                    required
                    placeholder="Describe your inquiry, suggestion, or research collaboration proposal..."
                    className="wm-form-textarea"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                  <button type="button" className="wm-btn wm-btn--secondary" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="wm-btn wm-btn--primary">
                    <Send size={15} /> Send Message
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}