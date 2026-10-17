import AboutHeader from '../components/about/AboutHeader.jsx'
import KeyComponentsCard from '../components/about/KeyComponentsCard.jsx'
import MethodologyCard from '../components/about/MethodologyCard.jsx'
import MissionVisionCards from '../components/about/MissionVisionCards.jsx'
import RiskCategoriesCard from '../components/about/RiskCategoriesCard.jsx'
import TeamCollaborationCard from '../components/about/TeamCollaborationCard.jsx'
import WaterStressFormulaCard from '../components/about/WaterStressFormulaCard.jsx'
import WorkflowCard from '../components/about/WorkflowCard.jsx'

/**
 * About page describing the WaterMap project, mission, workflow, methodology,
 * key indicators, risk classification, and collaboration partners.
 */
const AboutPage = () => (
  <div className="about-page">
    {/* 1. Header with city skyline banner & sustainability badge */}
    <AboutHeader />

    {/* 2. Four core pillars: Mission, Vision, Approach, Impact */}
    <MissionVisionCards />

    {/* 3 & 4. Main grid: Workflow + Components/Formula on left, Methodology + Risk on right */}
    <div className="about-content-grid">
      <div className="about-content-grid__main">
        {/* Five-stage connected workflow */}
        <WorkflowCard />

        {/* 2x2 Key components + Formula side-by-side */}
        <div className="about-factors-grid">
          <KeyComponentsCard />
          <WaterStressFormulaCard />
        </div>
      </div>

      <div className="about-content-grid__side">
        {/* Methodology pillars */}
        <MethodologyCard />

        {/* WSI Risk categories table */}
        <RiskCategoriesCard />
      </div>
    </div>

    {/* 5. Team & multidisciplinary collaboration */}
    <TeamCollaborationCard />
  </div>
)

export default AboutPage
