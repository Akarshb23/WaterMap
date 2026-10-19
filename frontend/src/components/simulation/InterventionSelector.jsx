/**
 * Selector for interventions to include in a scenario.
 * `options` is `[{ id, label, description }]`; selection is controlled by
 * the caller.
 */
const InterventionSelector = ({ options = [], selected = [], onToggle }) => (
  <fieldset className="intervention-selector">
    <legend className="intervention-selector__legend">Interventions</legend>
    {options.length === 0 ? (
      <p className="intervention-selector__empty">No interventions available yet.</p>
    ) : (
      <ul className="intervention-selector__list">
        {options.map((option) => (
          <li key={option.id} className="intervention-selector__item">
            <label>
              <input
                type="checkbox"
                checked={selected.includes(option.id)}
                onChange={() => onToggle?.(option.id)}
              />
              <span className="intervention-selector__label">{option.label}</span>
            </label>
            {option.description ? (
              <p className="intervention-selector__description">{option.description}</p>
            ) : null}
          </li>
        ))}
      </ul>
    )}
  </fieldset>
)

export default InterventionSelector
