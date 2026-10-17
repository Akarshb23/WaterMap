import { Leaf } from 'lucide-react'
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
      {/* City skyline, river & trees landscape SVG */}
      <svg
        className="about-header__landscape-svg"
        viewBox="0 0 480 120"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f3f9fa" stopOpacity="0" />
            <stop offset="30%" stopColor="#e0f2fe" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#bae6fd" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f3f9fa" stopOpacity="0" />
            <stop offset="25%" stopColor="#38bdf8" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#0284c7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0.65" />
          </linearGradient>
          <linearGradient id="bldgFarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="bldgNearGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#075d4c" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="treeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Sky background */}
        <rect x="0" y="0" width="480" height="120" fill="url(#skyGrad)" />

        {/* Distant building silhouettes */}
        <path
          d="M 120 75 L 120 52 L 132 52 L 132 45 L 136 45 L 136 75 
             L 150 75 L 150 38 L 162 38 L 162 75 
             L 175 75 L 175 48 L 188 48 L 188 75 
             L 205 75 L 205 32 L 210 24 L 215 32 L 215 75 
             L 230 75 L 230 42 L 242 42 L 242 75 
             L 260 75 L 260 50 L 275 50 L 275 75 
             L 300 75 L 300 35 L 315 35 L 315 75 
             L 340 75 L 340 46 L 355 46 L 355 75 
             L 380 75 L 380 30 L 392 30 L 392 75 
             L 415 75 L 415 45 L 430 45 L 430 75 
             L 460 75 L 460 55 L 480 55 L 480 75 Z"
          fill="url(#bldgFarGrad)"
          opacity="0.65"
        />

        {/* Mid-ground skyline towers & spires */}
        <path
          d="M 140 76 L 140 44 L 148 44 L 148 20 L 150 15 L 152 20 L 152 44 L 158 44 L 158 76 
             L 170 76 L 170 36 L 182 36 L 182 76 
             L 195 76 L 195 28 L 205 28 L 205 76 
             L 220 76 L 220 40 L 232 40 L 232 76 
             L 248 76 L 248 30 L 254 22 L 260 30 L 260 76 
             L 272 76 L 272 45 L 285 45 L 285 76 
             L 310 76 L 310 32 L 322 32 L 322 76 
             L 335 76 L 335 48 L 348 48 L 348 76 
             L 365 76 L 365 26 L 372 18 L 378 26 L 378 76 
             L 395 76 L 395 42 L 410 42 L 410 76 
             L 435 76 L 435 38 L 450 38 L 450 76 Z"
          fill="url(#bldgNearGrad)"
          opacity="0.85"
        />

        {/* Tree clusters / Green banks on shoreline */}
        <path
          d="M 90 78 Q 105 70 120 76 Q 135 68 150 75 Q 165 72 180 77 
             Q 210 69 240 76 Q 270 71 300 77 Q 330 68 360 76 
             Q 390 70 420 76 Q 450 72 480 77 L 480 84 L 90 84 Z"
          fill="url(#treeGrad)"
          opacity="0.9"
        />

        {/* Water surface & reflections */}
        <rect x="0" y="80" width="480" height="40" fill="url(#waterGrad)" />
        
        {/* Soft water ripples */}
        <path
          d="M 120 86 Q 160 84 200 86 T 280 86 T 360 86 T 440 86 
             M 150 93 Q 200 91 250 93 T 350 93 T 450 93 
             M 100 102 Q 160 99 220 102 T 340 102 T 460 102 
             M 180 110 Q 240 108 300 110 T 420 110"
          stroke="rgba(255, 255, 255, 0.45)"
          strokeWidth="1.2"
          fill="none"
        />
      </svg>

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
