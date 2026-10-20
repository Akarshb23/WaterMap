import { Leaf } from 'lucide-react'
import cityscape from '../../assets/watermap-cityscape.png'
import { ABOUT_HEADER } from '../../data/aboutData.js'

/**
 * About page header component with title, subtitle, and an aesthetic
 * city-and-water landscape banner featuring the sustainability badge.
 */
const AboutHeader = () => (
  <header className="about-header">
    <div className="about-header__intro">
      <h1 className="about-header__title">{ABOUT_HEADER.title}</h1>
      <p className="about-header__subtitle">{ABOUT_HEADER.subtitle}</p>
    </div>

    <div className="about-header__banner" role="region" aria-label="WaterMap sustainability banner">
      {/* City skyline, river & trees photographic landscape backdrop */}
      <div
        className="about-header__cityscape-bg"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(243, 249, 250, 1) 0%, rgba(243, 249, 250, 0.3) 22%, rgba(243, 249, 250, 0) 50%), url(${cityscape})`,
        }}
        aria-hidden="true"
      />

      {/* Sustainability message badge */}
      <div className="about-header__card">
        <div className="about-header__card-icon">
          <Leaf size={18} aria-hidden="true" />
        </div>
        <div className="about-header__card-text">
          <span className="about-header__card-line1">{ABOUT_HEADER.bannerCard.line1}</span>
          <span className="about-header__card-line2">{ABOUT_HEADER.bannerCard.line2}</span>
        </div>
      </div>
    </div>
  </header>
)

export default AboutHeader
