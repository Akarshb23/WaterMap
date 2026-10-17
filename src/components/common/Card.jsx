/**
 * Simple content card container.
 */
const Card = ({ children, className = '' }) => {
  const classes = ['card', className].filter(Boolean).join(' ')
  return <div className={classes}>{children}</div>
}

export default Card
