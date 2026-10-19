import {
  BarChart3,
  FileText,
  Leaf,
  Users,
} from 'lucide-react'
import {
  TEAM_COLLABORATION_BANNER,
  TEAM_ROLES,
} from '../../data/aboutData.js'

const TEAM_ICONS = {
  Users,
  BarChart3,
  Leaf,
  FileText,
}

/**
 * Our Team & Collaboration card showcasing multidisciplinary partners and closing mission statement.
 */
const TeamCollaborationCard = () => (
  <article className="card about-team-card" aria-labelledby="team-title">
    <header className="about-team-card__header">
      <h3 className="about-team-card__title" id="team-title">
        Our Team & Collaboration
      </h3>
      <p className="about-team-card__subtitle">
        WaterMap brings together expertise from urban planning, data science, climate research and policy.
      </p>
    </header>

    <div className="about-team-card__body">
      <div className="about-team-roles" role="list" aria-label="Collaboration disciplines">
        {TEAM_ROLES.map((role) => {
          const Icon = TEAM_ICONS[role.iconName] || Users
          return (
            <div key={role.id} className="about-team-role" role="listitem">
              <div className={`about-team-role__icon about-team-role__icon--${role.tone}`}>
                <Icon size={18} aria-hidden="true" />
              </div>
              <div className="about-team-role__content">
                <h4 className="about-team-role__title">{role.title}</h4>
                <p className="about-team-role__desc">{role.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="about-team-banner">
        <div className="about-team-banner__icon">
          <Leaf size={18} aria-hidden="true" />
        </div>
        <div className="about-team-banner__content">
          <h4 className="about-team-banner__title">{TEAM_COLLABORATION_BANNER.title}</h4>
          <p className="about-team-banner__caption">{TEAM_COLLABORATION_BANNER.caption}</p>
        </div>
      </div>
    </div>
  </article>
)

export default TeamCollaborationCard
