import {
  ArrowRight,
  BarChart3,
  Database,
  Lightbulb,
  MapPin,
  Settings,
} from 'lucide-react'
import { WORKFLOW_STEPS } from '../../data/aboutData.js'

const STEP_ICONS = {
  Database,
  Settings,
  BarChart3,
  MapPin,
  Lightbulb,
}

/**
 * How WaterMap Works horizontal workflow card with 5 interactive stages and connecting arrows.
 */
const WorkflowCard = () => (
  <article className="card about-workflow-card" aria-labelledby="workflow-title">
    <header className="about-workflow-card__header">
      <h3 className="about-workflow-card__title" id="workflow-title">
        How WaterMap Works
      </h3>
      <p className="about-workflow-card__subtitle">
        From data to actionable insights.
      </p>
    </header>

    <div className="about-workflow-card__flow" role="list" aria-label="WaterMap five-stage data pipeline">
      {WORKFLOW_STEPS.map((step, idx) => {
        const Icon = STEP_ICONS[step.iconName] || Database
        const isLast = idx === WORKFLOW_STEPS.length - 1

        return (
          <div key={step.step} className="about-workflow-step-wrapper">
            <div className="about-workflow-step" role="listitem">
              <div className={`about-workflow-step__icon about-workflow-step__icon--${step.tone}`}>
                <Icon size={20} aria-hidden="true" />
              </div>
              <h4 className="about-workflow-step__title">{step.title}</h4>
              <p className="about-workflow-step__desc">{step.description}</p>
            </div>
            {!isLast && (
              <div className="about-workflow-arrow" aria-hidden="true">
                <ArrowRight size={18} className="about-workflow-arrow__icon" />
              </div>
            )}
          </div>
        )
      })}
    </div>
  </article>
)

export default WorkflowCard
