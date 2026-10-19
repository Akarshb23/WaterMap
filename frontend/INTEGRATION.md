# WaterMap frontend/backend integration

## Run locally
1. Start the backend using `backend/README.md` (from the `backend` directory): install `requirements.txt`, initialize the database, run the data pipeline, then start `uvicorn app.main:app --reload`.
2. In `frontend`, copy `.env.example` to `.env`. The API mode uses `VITE_API_BASE_URL=http://localhost:8000/api/v1` and `VITE_DATA_MODE=api`.
3. Run `npm install` and `npm run dev`.

## Current backend data coverage
The supplied backend dataset contains Bengaluru ward boundary data. The new `/api/v1/cities` endpoint reports cities actually represented by loaded ward records, so API mode exposes Bengaluru rather than presenting unsupported cities as if their data existed. Other city datasets must be ingested and isolated by city before they can be selected.

## Maps
In API mode, map components use React Leaflet, OpenStreetMap tiles, and the backend's `/api/v1/map/geojson` FeatureCollection. Ward colors come from backend `risk_category`; clicking a polygon selects the corresponding ward. Demo mode keeps the original illustrative map.

## Data and limitations
- Dashboard summary is based on `/dashboard`, `/wards`, and `/map/geojson`.
- Predictions use `/predictions` and are labelled as the backend's persistence baseline; they are not a trained/calibrated time-series model.
- Recommendations use `/recommendations`; impact analytics and persistent saved plans are not provided by the current backend endpoints.
- Simulation submits to `/simulations/run` using the backend's supported intervention types. Results are rule-based estimates.
- The current backend does not provide historical trends, rainfall time series, or real-time sensors. The frontend should not represent those as live validated data.
