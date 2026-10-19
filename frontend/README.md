# WaterMap

WaterMap is a React + Vite frontend for urban water-stress monitoring, ward-level analysis, forecasts, recommendations, and intervention simulations.

## 1. Run the frontend

Requirements: Node.js 20.19+ or 22.12+ recommended for the Vite version in this project.

```bash
npm install
cp .env.example .env
npm run dev
```

On Windows PowerShell, copy the environment file with:

```powershell
Copy-Item .env.example .env
```

The frontend runs in **mock mode** by default, using clearly illustrative local data. This lets the UI continue to work before the backend exists.

## 2. Connect the backend

Update `.env`:

```dotenv
VITE_DATA_MODE=api
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT_MS=15000
```

Restart Vite after changing environment variables. The frontend calls the API from `src/services/`; do not put database credentials or private API keys in `VITE_` variables. Configure CORS on the backend to allow the frontend origin (usually `http://localhost:5173`).

The shared Axios client is `src/services/apiClient.js`. It normalizes `{ "data": ... }` API envelopes, passes cancellation signals, applies a timeout, and produces readable request errors.

## 3. Backend API contract

All paths below are relative to `VITE_API_BASE_URL`. JSON responses may either be the payload directly or wrapped as `{ "data": payload }`.

### Dashboard

`GET /dashboard/overview?cityId=new-delhi&range=12m`

Returns the complete set used by the dashboard charts and cards:

```json
{
  "cityName": "New Delhi",
  "updatedAt": "2026-10-18T08:30:00.000Z",
  "metrics": [
    {
      "id": "water-stress",
      "title": "Avg. Water Stress Index",
      "value": "0.68",
      "tone": "blue",
      "trend": "12% vs last year",
      "trendDirection": "up",
      "visual": {
        "type": "sparkline",
        "color": "#2589E9",
        "data": [{ "label": "Jan", "value": 0.58 }]
      }
    }
  ],
  "riskDistribution": [
    { "name": "High Risk", "value": 12, "percent": "29%", "color": "#EF4444" }
  ],
  "riskDistributionTotal": { "value": 42, "label": "wards" },
  "waterStressTrend": [{ "month": "Jan", "value": 0.51 }],
  "highRiskWards": [
    { "rank": 1, "name": "Ward 12", "wsi": "0.87", "population": "240,000", "trend": "18%" }
  ],
  "alerts": [
    {
      "id": "alert-1",
      "icon": "alert-triangle",
      "tone": "danger",
      "title": "High water stress in Ward 12",
      "description": "WSI increased in the last 3 months.",
      "timestamp": "2 hours ago"
    }
  ],
  "mapWards": [],
  "mapRegions": []
}
```

`metrics`, `riskDistribution`, `waterStressTrend`, `highRiskWards`, and `alerts` should be arrays. `mapWards` should match the current illustrative map display shape (ward `id`, `name`, `zone`, `zoneKey`, `risk`, `riskLabel`, `wsi`, `population`, `rainfall`, `demand`, `groundwater`, and percentage `x`/`y` coordinates). `mapRegions` contains `{ "id", "label", "x", "y" }`. If the backend is using real GIS data, use the GeoJSON endpoint below rather than inventing map coordinates.

Optional dedicated endpoint: `GET /dashboard/metrics?cityId=new-delhi&range=12m`.

### Wards and map

- `GET /wards?zone=north&risk=high` — returns an array of wards (zone and risk are optional filters).
- `GET /wards/:wardId` — returns a ward detail object.
- `GET /wards/geojson` — returns a GeoJSON `FeatureCollection` for real ward boundaries.

The ward detail response may include `kpis`, `landUse`, `landUseTotal`, `waterSources`, `riskFactors`, `insights`, `trend`, `recommendations`, `history`, `historySummary`, `rawData`, and `featuredActions`. The fields should follow the shapes currently used in `src/data/wardDetailsData.js`.

### Predictions

- `GET /predictions?cityId=new-delhi&horizon=2030`
- `GET /predictions/drivers?cityId=new-delhi`

The prediction payload can include `metrics`, `demandForecast` (`[{ "year": 2024, "demand": 124 }]`), `rainfallForecast` (`[{ "month": "Jun", "rain": 72, "normal": 65 }]`), `trendComparison` (`[{ "year": 2024, "historical": 0.68, "predicted": 0.68 }]`), `scenarioOutlook` (`[{ "id": "rainwater", "label": "Rainwater harvesting", "wsi": 0.7, "reduction": 11 }]`), `baselineWsi`, `projectedResults`, and `disclaimer`. Drivers are an array matching the existing `RiskDrivers` component's expected shape.

### Data sources

- `GET /data-sources`
- `GET /data-sources/metrics`
- `GET /data-sources/indicators`
- `GET /data-sources/trends?category=rainfall`
- `GET /data-sources/quality`

Collection endpoints return arrays or `{ "items": [] }`; metric endpoints may return arrays or `{ "metrics": [] }`.

### Recommendations

- `GET /recommendations?category=all&priority=all&sortBy=impact`
- `GET /recommendations/impact` — returns `{ "cumulative": [], "interventions": [], "topWards": [] }`.
- `GET /recommendations/metrics`
- `POST /recommendations/plan` — request body: `{ "recommendationId": "rainwater-harvesting", "planned": true, "recommendation": {} }`.

Recommendation fields should match the existing component model in `src/data/recommendationsData.js`.

### Simulations

- `POST /simulations` — request body is the selected scenario input: `{ "scenario": "rainwater", "area": "citywide", "level": "medium", "horizon": "2030" }` (use the actual option values in the frontend).
- `GET /simulations/:runId` — returns a stored simulation run.

The POST response should return the same result structure currently produced by `runScenarioSimulation()` in `src/data/simulationData.js`, so existing charts can render it without translation.

## 4. Data flow

```text
Backend API
   ↓ JSON
src/services/*Service.js
   ↓
React hooks (loading / error / cancellation)
   ↓
Page components
   ↓
KPI cards, charts, tables, and map visualizations
```

Use `VITE_DATA_MODE=mock` while building the UI. Switch to `api` only when the backend implements the documented endpoints. Demo values are illustrative and should not be presented as verified live measurements.

## 5. Useful commands

```bash
npm run dev
npm run build
npm run lint
npm run preview
```
