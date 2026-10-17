/**
 * Single recommendation with priority, ward scope and estimated impact.
 */
const RecommendationCard = ({ recommendation = {}, onOpenWard }) => (
  <article className="recommendation-card">
    <header className="recommendation-card__header">
      <h3 className="recommendation-card__title">{recommendation.title}</h3>
      {recommendation.priority ? (
        <span className="recommendation-card__priority">{recommendation.priority}</span>
      ) : null}
    </header>
    <p className="recommendation-card__summary">{recommendation.summary}</p>
    {recommendation.wardId && onOpenWard ? (
      <button type="button" className="recommendation-card__ward" onClick={() => onOpenWard(recommendation.wardId)}>
        View ward
      </button>
    ) : null}
  </article>
)

export default RecommendationCard
