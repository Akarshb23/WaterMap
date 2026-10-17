/**
 * Compact on/off switch used by map overlays. Controlled: the parent owns
 * the boolean state and rerenders with the new `checked` value.
 */
const ToggleSwitch = ({ label, checked, onChange, id }) => (
  <span className="toggle">
    {id ? (
      <label className="toggle__label" htmlFor={id}>
        {label}
      </label>
    ) : (
      <span className="toggle__label">{label}</span>
    )}
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className="toggle__switch"
      onClick={() => onChange(!checked)}
    >
      <span className="toggle__thumb" aria-hidden="true" />
    </button>
  </span>
)

export default ToggleSwitch
