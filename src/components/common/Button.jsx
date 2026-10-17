/**
 * Base button with a variant style. Styling classes are defined in the
 * global stylesheets; behaviour stays in the caller (onClick etc.).
 */
const Button = ({ children, type = 'button', variant = 'primary', className = '', ...rest }) => {
  const classes = ['btn', `btn--${variant}`, className].filter(Boolean).join(' ')
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  )
}

export default Button
