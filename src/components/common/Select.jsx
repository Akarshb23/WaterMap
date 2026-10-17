/**
 * Labelled native select. Options are passed in as
 * `[{ value, label }]` so the component stays data-agnostic.
 */
const Select = ({ label, options = [], value, onChange, className = '', ...rest }) => {
  const classes = ['select', className].filter(Boolean).join(' ')
  return (
    <label className={classes}>
      {label ? <span className="select__label">{label}</span> : null}
      <select value={value} onChange={onChange} {...rest}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export default Select
