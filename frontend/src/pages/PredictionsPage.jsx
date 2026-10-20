import { useState } from 'react'
import { BarChart3 } from 'lucide-react'
import predictionBanner from '../assets/prediction-banner.jpg'
import PredictionKpis from '../components/predictions/PredictionKpis.jsx'
import PredictedWaterStressMap from '../components/predictions/PredictedWaterStressMap.jsx'
import TrendComparison from '../components/predictions/TrendComparison.jsx'
import RiskDrivers from '../components/predictions/RiskDrivers.jsx'
import WaterDemandForecast from '../components/predictions/WaterDemandForecast.jsx'
import RainfallForecast from '../components/predictions/RainfallForecast.jsx'
import ScenarioAnalysis from '../components/predictions/ScenarioAnalysis.jsx'
import ProjectedResults from '../components/predictions/ProjectedResults.jsx'

const DEFAULT_SIM_RESULTS = {
  wsi: '0.74',
  wsiTrend: '12% vs baseline',
  highRiskWards: '15',
  wardsTrend: '3 more than baseline',
  rainfall: '612 mm',
  rainTrend: '6% vs baseline',
  demand: '128 MLD',
  demandTrend: '18% vs baseline',
}

const PredictionsPage = () => {
  const [simResults, setSimResults] = useState(DEFAULT_SIM_RESULTS)

  return (
    <div className="predictions-page">
      {/* Page Header */}
      <header className="predictions-header">
        <div className="predictions-header__left">
          <h1 className="predictions-header__title">Prediction &amp; Analysis</h1>
          <p className="predictions-header__subtitle">
            Understand future water risks with data-driven forecasts and scenario analysis.
          </p>
        </div>

        <div
          className="predictions-header__banner"
          style={{ backgroundImage: `url(${predictionBanner})` }}
          role="img"
          aria-label="City landscape banner"
        >
          <div className="predictions-header__badge">
            <div className="predictions-header__badge-icon">
              <BarChart3 size={17} />
            </div>
            <p className="predictions-header__badge-text">
              Using historical data, climate trends and geospatial analysis to predict urban water stress.
            </p>
          </div>
        </div>
      </header>

      {/* Top 4 Metric KPI Cards */}
      <PredictionKpis />

      {/* Main 3-Column x 2-Row Structured Grid */}
      <div className="predictions-main-grid">
        {/* Upper Row, Column 1: Predicted Map */}
        <div className="predictions-map-slot">
          <PredictedWaterStressMap />
        </div>

        {/* Upper Row, Column 2: Trend Comparison & Key Drivers */}
        <div className="predictions-trend-drivers-slot">
          <TrendComparison />
          <RiskDrivers />
        </div>

        {/* Upper Row, Column 3: Scenario Analysis */}
        <div className="predictions-scenario-slot">
          <ScenarioAnalysis
            onSimulate={setSimResults}
            onReset={() => setSimResults(DEFAULT_SIM_RESULTS)}
          />
        </div>

        {/* Lower Row, Column 1: Water Demand Forecast */}
        <div className="predictions-demand-slot">
          <WaterDemandForecast />
        </div>

        {/* Lower Row, Column 2: Rainfall Forecast */}
        <div className="predictions-rainfall-slot">
          <RainfallForecast />
        </div>

        {/* Lower Row, Column 3: Projected Results (2030) */}
        <div className="predictions-results-slot">
          <ProjectedResults results={simResults} />
        </div>
      </div>
    </div>
  )
}

export default PredictionsPage