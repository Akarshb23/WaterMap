/**
 * Lightweight tooltip wrapper using the native title attribute.
 * A richer flyout tooltip can replace this later without changing callers.
 */
const Tooltip = ({ label, children }) => (
  <span className="tooltip" title={label}>
    {children}
  </span>
)

export default Tooltip
