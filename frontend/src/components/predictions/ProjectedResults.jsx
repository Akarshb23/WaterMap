import { AlertTriangle, ArrowDown, ArrowUp, Droplet, Leaf, Users } from 'lucide-react'

const DEFAULT_RESULTS = {
  wsi: '0.74',
  wsiTrend: '12% vs baseline',
  highRiskWards: '15',
  wardsTrend: '3 more than baseline',
  rainfall: '612 mm',
  rainTrend: '6% vs baseline',
  demand: '128 MLD',
  demandTrend: '18% vs baseline',
}

/**
 * Projected Results (2030) card:
 * 4 metric rows aligned in the bottom right block of the predictions grid,
 * matching Water Demand Forecast and Rainfall Forecast horizontally.
 */
const ProjectedResults = ({ results = DEFAULT_RESULTS }) => {
  return (
    <section className="card projected-results-card" aria-label="Projected Results 2030">
      <div className="card__header">
        <h2 className="card__title">Projected Results (2030)</h2>
      </div>

      <div className="projected-results-list">
        {/* Item 1: Projected WSI */}
        <div className="projected-result-item">
          <div className="projected-result-item__left">
            <div className="projected-result-item__icon projected-result-item__icon--blue">
              <Droplet size={18} />
            </div>
            <div className="projected-result-item__body">
              <strong>{results.wsi}</strong>
              <span>Projected WSI</span>
            </div>
          </div>
          <div className="projected-result-item__delta projected-result-item__delta--red">
            <ArrowUp size={13} strokeWidth={2.5} />
            <span>{results.wsiTrend}</span>
          </div>
        </div>

        {/* Item 2: High Risk Wards */}
        <div className="projected-result-item">
          <div className="projected-result-item__left">
            <div className="projected-result-item__icon projected-result-item__icon--red">
              <AlertTriangle size={18} />
            </div>
            <div className="projected-result-item__body">
              <strong>{results.highRiskWards}</strong>
              <span>High Risk Wards</span>
            </div>
          </div>
          <div className="projected-result-item__delta projected-result-item__delta--red">
            <ArrowUp size={13} strokeWidth={2.5} />
            <span>{results.wardsTrend}</span>
          </div>
        </div>

        {/* Item 3: Annual Rainfall */}
        <div className="projected-result-item">
          <div className="projected-result-item__left">
            <div className="projected-result-item__icon projected-result-item__icon--teal">
              <Users size={18} />
            </div>
            <div className="projected-result-item__body">
              <strong>{results.rainfall}</strong>
              <span>Annual Rainfall</span>
            </div>
          </div>
          <div className="projected-result-item__delta projected-result-item__delta--red">
            <ArrowDown size={13} strokeWidth={2.5} />
            <span>{results.rainTrend}</span>
          </div>
        </div>

        {/* Item 4: Water Demand */}
        <div className="projected-result-item">
          <div className="projected-result-item__left">
            <div className="projected-result-item__icon projected-result-item__icon--green">
              <Leaf size={18} />
            </div>
            <div className="projected-result-item__body">
              <strong>{results.demand}</strong>
              <span>Water Demand</span>
            </div>
          </div>
          <div className="projected-result-item__delta projected-result-item__delta--red">
            <ArrowUp size={13} strokeWidth={2.5} />
            <span>{results.demandTrend}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProjectedResults
