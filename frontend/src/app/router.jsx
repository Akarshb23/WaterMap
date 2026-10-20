import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout.jsx'
import { ROUTES } from '../constants/routes.js'
import AboutPage from '../pages/AboutPage.jsx'
import CityMapPage from '../pages/CityMapPage.jsx'
import DashboardPage from '../pages/DashboardPage.jsx'
import DataSourcesPage from '../pages/DataSourcesPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import LandingPage from '../pages/LandingPage.jsx'
import PredictionsPage from '../pages/PredictionsPage.jsx'
import RecommendationsPage from '../pages/RecommendationsPage.jsx'
import SimulationPage from '../pages/SimulationPage.jsx'
import WardDetailsPage from '../pages/WardDetailsPage.jsx'

/**
 * Route table for the WaterMap app.
 */
const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path={ROUTES.HOME} element={<LandingPage />} />
      <Route element={<AppLayout />}>
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path={ROUTES.CITY_MAP} element={<CityMapPage />} />
        <Route path="/city-map" element={<CityMapPage />} />
        <Route path={ROUTES.DISTRICT_DETAILS} element={<WardDetailsPage />} />
        <Route path="/districts/:districtId" element={<WardDetailsPage />} />
        <Route path="/wards/:wardId" element={<WardDetailsPage />} />
        <Route path={ROUTES.PREDICTIONS} element={<PredictionsPage />} />
        <Route path={ROUTES.SIMULATION} element={<SimulationPage />} />
        <Route path={ROUTES.RECOMMENDATIONS} element={<RecommendationsPage />} />
        <Route path={ROUTES.DATA_SOURCES} element={<DataSourcesPage />} />
        <Route path={ROUTES.ABOUT} element={<AboutPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
)

export default Router
