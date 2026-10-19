/**
 * Small status/label badge.
 */
const Badge = ({ children, tone = 'neutral' }) => {
  const classes = ['badge', `badge--${tone}`].filter(Boolean).join(' ')
  return <span className={classes}>{children}</span>
}

export default Badge
