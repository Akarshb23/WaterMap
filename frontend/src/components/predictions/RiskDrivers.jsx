const DEFAULT_DRIVERS = [
  { id: 'population', label: 'Population Growth', share: 32 },
  { id: 'climate', label: 'Climate Change (Lower Rainfall)', share: 24 },
  { id: 'demand', label: 'Increasing Water Demand', share: 18 },
  { id: 'groundwater', label: 'Declining Groundwater Levels', share: 16 },
  { id: 'urbanization', label: 'Urbanization', share: 10 },
]

const RiskDrivers = ({ title = 'Key Drivers (2030)', drivers = DEFAULT_DRIVERS }) => {
  const driverList = drivers && drivers.length > 0 ? drivers : DEFAULT_DRIVERS

  return (
    <section className="card risk-drivers-card" aria-label={title}>
      <div className="card__header risk-drivers-card__header">
        <h2 className="card__title">{title}</h2>
      </div>

      <div className="risk-drivers-list">
        {driverList.map((driver) => (
          <div key={driver.id || driver.label} className="risk-driver-row">
            <span className="risk-driver-label">{driver.label}</span>
            <div className="risk-driver-bar-track">
              <div
                className="risk-driver-bar-fill"
                style={{ width: `${driver.share}%` }}
                role="progressbar"
                aria-valuenow={driver.share}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
            <span className="risk-driver-value">{driver.share}%</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RiskDrivers