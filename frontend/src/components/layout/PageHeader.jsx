/**
 * Standard page heading with optional description text.
 */
const PageHeader = ({ title, description }) => (
  <header className="page-header">
    <h1 className="page-header__title">{title}</h1>
    {description ? <p className="page-header__description">{description}</p> : null}
  </header>
)

export default PageHeader
