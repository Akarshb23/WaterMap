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

    {/* 3. Five-stage connected workflow: How WaterMap Works */}
    <WorkflowCard />

    {/* 4. Analytics & Methodology Grid: Balanced 2x2 cards */}
    <div className="about-content-grid">
      <KeyComponentsCard />
      <WaterStressFormulaCard />
      <MethodologyCard />
      <RiskCategoriesCard />
    </div>

    {/* 5. Team & multidisciplinary collaboration */}
    <TeamCollaborationCard />
  </div>
)

export default AboutPage
