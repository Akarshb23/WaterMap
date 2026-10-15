WaterMap Frontend
The WaterMap frontend is a React + Vite application for exploring
ward-level urban water stress, understanding risk factors, viewing
forecasts, testing hypothetical interventions, and reviewing
recommendations.
Project status: This README describes the planned frontend
architecture. Keep commands, routes, and API contracts synchronized
with the actual implementation. Label synthetic or illustrative demo
data clearly.

Features
- Landing page introducing WaterMap
- City dashboard with summary indicators and risk distribution
- Interactive ward-level city map
- Ward details with stress scores and contributing factors
- Forecast and trend visualizations
- What-if scenario simulation interface
- Prioritized intervention recommendations
- Data source and methodology pages
- Responsive layouts, loading states, empty states, and error handling
Tech stack
- React and Vite
- React Router
- Plain CSS with shared design tokens
- Recharts or another selected charting library
- MapLibre GL JS or Leaflet (choose one)
- Fetch or Axios for API requests
Requirements
- Node.js LTS and npm
- WaterMap backend running locally, unless using clearly labeled demo
  data
Getting started
From the repository root:
cd frontend
npm install
Create .env based on .env.example:
VITE_API_BASE_URL=http://localhost:8000/api/v1
Start the development server:
npm run dev
Vite prints the local URL, usually http://localhost:5173.
Build and preview:
npm run build
npm run preview
Run linting if configured:
npm run lint
Suggested page routes
  Route                Page
  /                  Landing page
  /dashboard         City dashboard
  /map               Interactive city map
  /wards/:wardId     Ward details
  /predictions       Prediction and analysis
  /simulation        Scenario simulation
  /recommendations   Recommendations
  /data-sources      Data sources and coverage
  /about             About and methodology
  *                  Not found
These routes are proposed defaults. Keep them aligned with the router
and backend API contract.
Project organization
frontend/
├── public/                 # Static public assets
├── src/
│   ├── app/                # App setup, router, providers
│   ├── assets/             # Imported images and icons
│   ├── components/         # Shared and feature components
│   ├── pages/              # Route-level screens
│   ├── services/            # API client and feature services
│   ├── hooks/              # Reusable React hooks
│   ├── context/            # Shared city/filter state
│   ├── utils/              # Formatting and domain utilities
│   ├── constants/          # Routes, navigation, risk categories
│   └── styles/             # Global CSS and design tokens
├── tests/                  # Frontend tests
├── .env.example
├── package.json
└── vite.config.js
Design system
WaterMap uses a minimal, nature-inspired green-and-blue visual identity.
- Primary green: #176B52
- Water blue: #2788E8
- Main background: #F7FAF7
- Surface: #FFFFFF
- Pale mint: #E6F4EC
- Main text: #17332C
Use green for the core brand and primary actions, blue for water-related
indicators and interactive accents, and distinct risk colors for map
layers and status labels. Keep spacing, typography, buttons, cards, and
navigation consistent.
Backend integration
- Keep the API base URL in VITE_API_BASE_URL.
- Centralize HTTP behavior in src/services/apiClient.js.
- Put feature-specific requests in services such as wardService.js,
  mapService.js, and simulationService.js.
- Use consistent ward IDs across the map, dashboard, and ward details.
- Handle loading, empty, validation, and server-error states.
- Do not put secrets in frontend environment variables. Variables
  prefixed with VITE_ are exposed to the browser.
The proposed API prefix is /api/v1. Confirm endpoint names and
response shapes with the backend team before wiring up screens.
Data and visualization rules
- Label synthetic or mock values as demo data.
- Do not display missing values as zero or imply missing data means
  low risk.
- Show units and reporting periods for indicators.
- Distinguish historical observations from forecasts and simulated
  outcomes.
- Do not present simulated impact as a guaranteed real-world result.
Development workflow
1. Agree on API request and response schemas with the backend team.
2. Build the shared layout and global styles.
3. Implement the dashboard and map using a small, known dataset.
4. Add ward details, simulation, and recommendations.
5. Connect real API responses and remove mock data where available.
6. Test responsive behavior, loading states, and error states.
Troubleshooting
- API request fails: Confirm the backend is running and
  VITE_API_BASE_URL is correct.
- CORS error: Configure allowed frontend origins in FastAPI for
  the local Vite URL.
- Map is blank: Check the map library, map style/source
  configuration, and geometry format.
- Environment variable changes do not apply: Restart Vite after
  changing .env.
- Unexpected ward values: Check ward IDs, units, reporting
  periods, and risk thresholds.
Contributing
- Keep components focused and reusable.
- Use shared design tokens instead of hardcoding colors.
- Avoid duplicating API request logic across pages.
- Add tests for important formatting, filtering, and visualization
  utilities.
- Keep .env files and secrets out of version control.