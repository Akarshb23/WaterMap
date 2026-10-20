import { Check, Droplet, Leaf, Waves } from 'lucide-react'

const ROW_PRESETS = {
  wsi: { icon: Check, tone: 'solid-green' },
  demand: { icon: Droplet, tone: 'blue' },
  groundwater: { icon: Waves, tone: 'blue' },
  resilience: { icon: Leaf, tone: 'soft-green' },
}

/**
 * Scenario impact summary card:
 * 4 metric rows matching reference screenshot:
 * 1. 44% reduction (solid green circle with white checkmark)
 * 2. 26 MLD lower water demand (light blue circle with droplet)
 * 3. +3.3 m groundwater level (light blue circle with waves)
 * 4. More resilient water supply (soft green circle with leaf)
 */
const SimulationResults = ({ result }) => {
  const rows = [
    {
      id: 'wsi',
      value: `${result.wardReductionPct}% reduction`,
      label: `in water stress index in ${result.area.label}`,
    },
    {
      id: 'demand',
      value: `${result.demandDrop} MLD`,
      label: 'lower water demand',
    },
    {
      id: 'groundwater',
      value: `+${result.groundwaterGain.toFixed(1)} m`,
      label: 'groundwater level',
    },
    {
      id: 'resilience',
      value: result.resilience,
      label: 'water supply',
    },
  ]

  return (
    <section className="card sim-summary" aria-label="Scenario impact summary">
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
                <Icon size={16} strokeWidth={preset.tone === 'solid-green' ? 3 : 2.5} />
              </span>
              <span className="sim-summary__body">
                <strong className="sim-summary__value">{row.value}</strong>
                <span className="sim-summary__label">{row.label}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default SimulationResults