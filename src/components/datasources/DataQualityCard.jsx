import { CheckCircle2 } from 'lucide-react'
import { DATA_QUALITY_METRICS, DATA_VALIDATION_MESSAGE } from '../../data/dataSourcesData.js'

/**
 * Data Quality & Completeness card showing dataset verification rates.
 */
const DataQualityCard = ({ metrics = DATA_QUALITY_METRICS }) => (
  <article className="card data-quality-card" aria-labelledby="quality-title">
    <header className="data-quality-card__header">
      <h3 className="data-quality-card__title" id="quality-title">
        Data Quality & Completeness
      </h3>
      <p className="data-quality-card__subtitle">
        Completeness and quality assessment.
      </p>
    </header>

    <div className="data-quality-card__body">
      <ul className="data-quality-card__list" aria-label="Dataset completeness percentages">
        {metrics.map((item) => (
          <li key={item.id} className="data-quality-card__item">
            <span className="data-quality-card__label">{item.label}</span>
            <div className="data-quality-card__track">
              <div
                className="data-quality-card__fill"
                style={{
                  width: `${item.percent}%`,
                  backgroundColor: item.color,
                }}
                role="progressbar"
                aria-valuenow={item.percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${item.label}: ${item.percent}%`}
              />
            </div>
            <span className="data-quality-card__value">{item.percent}%</span>
          </li>
        ))}
      </ul>

      {/* Validation Message Box */}
      <div className="data-quality-card__validation-box">
        <CheckCircle2 size={16} className="data-quality-card__check-icon" aria-hidden="true" />
        <p className="data-quality-card__validation-text">
          {DATA_VALIDATION_MESSAGE}
        </p>
      </div>
    </div>
  </article>
)

export default DataQualityCard
