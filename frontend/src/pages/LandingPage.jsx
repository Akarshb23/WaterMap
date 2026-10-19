import {

  ArrowRight,

  BarChart3,

  Leaf,

  Map,

  ShieldCheck,

  SlidersHorizontal,

  Database,

  Users,

  Lightbulb,

} from 'lucide-react'

import { Link } from 'react-router-dom'

import { ROUTES } from '../constants/routes.js'

import cityscape from '../assets/watermap-cityscape.png'

import ctaBackground from '../assets/watermap-cta-background.png'



// Brand icons were removed from newer lucide-react versions, so they are inlined here.

const GithubIcon = ({ size = 18 }) => (

  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">

    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.38 7.86 10.9.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />

  </svg>

)



const LinkedinIcon = ({ size = 18 }) => (

  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">

    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />

  </svg>

)



const features = [

  {

    icon: Map,

    title: 'Interactive City Map',

    text: 'Explore ward-level water stress with clear, visual insights.',

    tone: 'blue',

    to: ROUTES.CITY_MAP,

  },

  {

    icon: BarChart3,

    title: 'Predictive Analysis',

    text: 'Understand future water risks with data-driven forecasts.',

    tone: 'green',

    to: ROUTES.PREDICTIONS,

  },

  {

    icon: SlidersHorizontal,

    title: 'What-If Simulations',

    text: 'Test interventions and estimate their impact before implementation.',

    tone: 'violet',

    to: ROUTES.SIMULATION,

  },

  {

    icon: Leaf,

    title: 'Actionable Recommendations',

    text: 'Get prioritized, data-driven suggestions for targeted interventions.',

    tone: 'mint',

    to: ROUTES.RECOMMENDATIONS,

  },

]



const statistics = [

  { icon: Map, value: '100+', label: 'City wards analysed', tone: 'blue' },

  { icon: Database, value: '5+', label: 'Data sources', tone: 'blue' },

  { icon: BarChart3, value: '3x', label: 'Better risk visibility', tone: 'green' },

  { icon: Leaf, value: 'Sustainable', label: 'Urban future', tone: 'green' },

]



const processSteps = [

  {

    number: '01',

    icon: Database,

    title: 'Integrate Data',

    description: 'Collect and process data from trusted public sources.',

    tone: 'blue',

  },

  {

    number: '02',

    icon: BarChart3,

    title: 'Analyze & Predict',

    description: 'Calculate water stress and identify key drivers using AI and geospatial analysis.',

    tone: 'green',

  },

  {

    number: '03',

    icon: Lightbulb,

    title: 'Plan Interventions',

    description: 'Get actionable recommendations for a more resilient city.',

    tone: 'violet',

  },

]



const benefits = [

  { icon: ShieldCheck, label: 'Safer communities' },

  { icon: Leaf, label: 'Better resource planning' },

  { icon: Users, label: 'Climate-resilient cities' },

]



function BrandMark({ id, size = 26 }) {

  return (

    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">

      <defs>

        <linearGradient id={id} x1="5" y1="3" x2="19" y2="21" gradientUnits="userSpaceOnUse">

          <stop offset="0" stopColor="#2f8dff" />

          <stop offset="0.55" stopColor="#12b2c0" />

          <stop offset="1" stopColor="#0ba984" />

        </linearGradient>

      </defs>

      <path

        d="M12 2.2c-.4 0-.8.2-1 .5C8.4 6.2 4.8 10.4 4.8 14.6a7.2 7.2 0 0 0 14.4 0c0-4.2-3.6-8.4-6.2-11.9-.2-.3-.6-.5-1-.5Z"

        fill={`url(#${id})`}

      />

      <path

        d="M8.6 15.2a3.6 3.6 0 0 0 3.4 3.4"

        fill="none"

        stroke="#fff"

        strokeOpacity=".75"

        strokeWidth="1.6"

        strokeLinecap="round"

      />

    </svg>

  )

}



function Brand({ footer = false }) {

  return (

    <Link className="landing-brand" to="/" aria-label="WaterMap home">

      <span className="landing-brand__mark">

        <BrandMark id={footer ? 'wm-drop-footer' : 'wm-drop-nav'} size={footer ? 26 : 28} />

      </span>

      <span>WaterMap</span>

    </Link>

  )

}



function SectionHeading({ title, description, action }) {

  return (

    <div className="section-heading">

      <div>

        <h2>{title}</h2>

        <p>{description}</p>

      </div>

      {action}

    </div>

  )

}



const LandingPage = () => (

  <div className="landing-page">

    <header className="landing-nav">

      <Brand />

      <nav aria-label="Main navigation">

        <a className="is-current" href="#home">Home</a>

        <a href="#about">About</a>

        <a href="#features">Features</a>

        <a href="#contact">Contact</a>

      </nav>

      <Link className="landing-nav__cta" to={ROUTES.DASHBOARD}>

        Get Started <ArrowRight size={16} />

      </Link>

    </header>



    <main>

      <section className="landing-hero" id="home">

        <div className="landing-hero__copy">

          <span className="eyebrow">

            DATA-DRIVEN CITIES <i /> RESILIENT TOMORROWS

          </span>

          <h1>

            Smarter Cities.<br />

            <span>Water</span> Secure.

          </h1>

          <p>

            Predict urban water stress, understand risk factors, and plan data-driven interventions for a more resilient tomorrow.

          </p>

          <div className="landing-hero__actions">

            <Link className="btn-primary" to={ROUTES.CITY_MAP}>

              Explore the Map <ArrowRight size={16} />

            </Link>

            <a className="btn-secondary" href="#about">Learn More</a>

          </div>

          <div className="landing-stats">

            {statistics.map(({ icon: Icon, value, label, tone }) => (

              <div key={value}>

                <span className={`landing-stat-icon ${tone}`}><Icon size={20} /></span>

                <strong>{value}</strong>

                <small>{label}</small>

              </div>

            ))}

          </div>

        </div>



        <div className="landing-hero__art" aria-hidden="true">

          <img src={cityscape} alt="" />

        </div>

        <div className="landing-hero__wave" aria-hidden="true" />

      </section>



      <section className="landing-features" id="features">

        <SectionHeading

          title="Key Features"

          description="Everything you need for a more water-resilient city."

          action={

            <Link to={ROUTES.ABOUT}>

              Explore All Features <ArrowRight size={15} />

            </Link>

          }

        />

        <div className="landing-feature-grid">

          {features.map(({ icon: Icon, title, text, tone, to }) => (

            <Link className="landing-feature-card" to={to} key={title}>

              <span className={`landing-feature-icon ${tone}`}><Icon size={25} /></span>

              <h3>{title}</h3>

              <p>{text}</p>

              <span className="landing-feature-arrow" aria-hidden="true"><ArrowRight size={15} /></span>

            </Link>

          ))}

        </div>

      </section>



      <section className="landing-process" id="about">

        <SectionHeading

          title="How WaterMap Works"

          description="From data to decisions, in three simple steps."

        />

        <div className="process-steps">

          {processSteps.map(({ number, icon: Icon, title, description, tone }) => (

            <article className="process-step" key={number}>

              <span className={`process-icon ${tone}`}><Icon size={26} /></span>

              <div className="process-step__title">

                <b>{number}</b>

                <h3>{title}</h3>

              </div>

              <p>{description}</p>

            </article>

          ))}

        </div>

      </section>



      <section className="landing-cta" id="contact">

        <div className="landing-cta__copy">

          <span className="eyebrow">A MORE RESILIENT TOMORROW</span>

          <h2>

            Cleaner Cities.<br />

            <span>Stronger Communities.</span>

          </h2>

          <p>

            WaterMap helps city planners, researchers, and citizens make informed decisions to ensure water security for generations to come.

          </p>

          <Link className="btn-primary" to={ROUTES.DASHBOARD}>

            Get Started <ArrowRight size={16} />

          </Link>

          <div className="landing-values">

            {benefits.map(({ icon: Icon, label }) => (

              <span key={label}><Icon size={23} /> {label}</span>

            ))}

          </div>

        </div>

        <div className="landing-cta__background" aria-hidden="true">
          <img src={ctaBackground} alt="" />
        </div>

      </section>

    </main>



    <footer className="landing-footer">

      <div className="landing-footer__main">

        <div className="landing-footer__brand">

          <Brand footer />

          <p>Smarter Cities. Water Secure.</p>

        </div>

        <nav aria-label="Footer navigation">

          <a href="#home">Home</a>

          <a href="#about">About</a>

          <a href="#features">Features</a>

          <a href="#contact">Contact</a>

        </nav>

        <div className="landing-footer__socials" aria-label="Social links">

          <a href="https://github.com/" aria-label="GitHub"><GithubIcon /></a>

          <a href="https://x.com/" aria-label="X">𝕏</a>

          <a href="https://linkedin.com/" aria-label="LinkedIn"><LinkedinIcon /></a>

        </div>

      </div>

      <div className="landing-footer__legal">

        <span>© 2026 WaterMap. All rights reserved.</span>

        <span>

          <a href="#privacy">Privacy</a>

          <a href="#terms">Terms</a>

          <a href="#contact">Contact</a>

        </span>

      </div>

    </footer>

  </div>

)



export default LandingPage
