import { WSI_FORMULA_DATA } from '../../data/aboutData.js'

/**
 * Water Stress Index conceptual formula panel with colored variable legend.
 */
const WaterStressFormulaCard = () => (
  <article className="card about-formula-card" aria-labelledby="formula-title">
    <header className="about-formula-card__header">
      <h3 className="about-formula-card__title" id="formula-title">
        Water Stress Index
      </h3>
      <p className="about-formula-card__subtitle">
        {WSI_FORMULA_DATA.subtitle}
      </p>
    </header>

    <div className="about-formula-card__body">
      {/* Highlighted Formula Banner */}
      <div className="about-formula-banner" role="region" aria-label="Conceptual WSI formula">
        <code className="about-formula-banner__code">
          {WSI_FORMULA_DATA.formula}
        </code>
      </div>

      {/* Variables Legend */}
      <ul className="about-formula-legend" aria-label="Formula variable index legend">
        {WSI_FORMULA_DATA.variables.map((v) => (
          <li key={v.symbol} className="about-formula-legend__item">
            <span
              className="about-formula-legend__dot"
              style={{ backgroundColor: v.color }}
              aria-hidden="true"
            />
            <strong className="about-formula-legend__symbol">{v.symbol}</strong>
            <span className="about-formula-legend__sep">—</span>
            <span className="about-formula-legend__name">{v.name}</span>
          </li>
        ))}
      </ul>
    </div>
  </article>
)

export default WaterStressFormulaCard
