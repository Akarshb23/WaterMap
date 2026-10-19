import { CheckCircle2, Droplet, Leaf, Waves } from 'lucide-react'

const ROW_PRESETS = {
  wsi: { icon: CheckCircle2, tone: 'green' },
  demand: { icon: Droplet, tone: 'blue' },
  groundwater: { icon: Waves, tone: 'blue' },
  resilience: { icon: Leaf, tone: 'green' },
}

/**
 * Narrow impact-summary card to the right of the Scenario Impact chart.
 * Four rows (WSI reduction, demand drop, groundwater recovery, supply
 * resilience) derived from the last simulation run — demonstration
 * values, not validated forecasts.
 */
const SimulationResults = ({ result }) => {
  const rows = [
    {
      id: 'wsi',
      value: `${result.wardReductionPct}% reduction`,
      label: `in water stress index in ${result.area.label}`,
    },
    { id: 'demand', value: `${result.demandDrop} MLD`, label: 'lower water demand' },
    { id: 'groundwater', value: `+${result.groundwaterGain.toFixed(1)} m`, label: 'groundwater level' },
    { id: 'resilience', value: result.resilience, label: 'water supply' },
  ]

  return (
    <section className="card sim-summary" aria-label="Scenario impact summary">
      <div className="card__header">
        <h2 className="card__title">Impact Summary</h2>
      </div>

      <ul className="sim-summary__list">
        {rows.map((row) => {
          const preset = ROW_PRESETS[row.id]
          const Icon = preset.icon
          return (
            <li key={row.id} className="sim-summary__row">
              <span
                className={`sim-summary__icon sim-summary__icon--${preset.tone}`}
                aria-hidden="true"
              >
                <Icon size={15} />
              </span>
              <span className="sim-summary__body">
                <strong className="sim-summary__value">{row.value}</strong>
                <span className="sim-summary__label">{row.label}</span>
              </span>
            </li>
          )
        })}
      </ul>

      <p className="sim-summary__note">
        Demonstration values for the selected scenario — illustrative, not validated.
      </p>
    </section>
  )
}

export default SimulationResults