/**
 * Form for defining a simulation scenario.
 * Submission behaviour is wired up when the simulation page is implemented.
 */
const ScenarioForm = ({ children, onSubmit }) => (
  <form
    className="scenario-form"
    onSubmit={(event) => {
      event.preventDefault()
      onSubmit?.()
    }}
  >
    <h2 className="scenario-form__title">Scenario</h2>
    <div className="scenario-form__fields">{children}</div>
    <button type="submit" className="scenario-form__submit">
      Run simulation
    </button>
  </form>
)

export default ScenarioForm
