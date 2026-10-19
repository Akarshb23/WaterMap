# WaterMap Backend

WaterMap is a FastAPI backend for ward-level urban water-stress monitoring, map data, indicator ingestion, baseline forecasting, rule-based intervention simulations, and explainable recommendations.

## Features
- Ward, dashboard, data-source, and GeoJSON endpoints.
- Data cleaning, validation, normalization, aggregation, and ingestion pipeline.
- Weighted Water Stress Index (WSI) with risk categories and per-indicator explanations.
- Ward-level baseline forecasts (persistence baseline; not a trained predictive model).
- Rule-based what-if intervention simulations (illustrative estimates, not causal guarantees).
- Explainable recommendations based on indicator evidence and stored ward risk.
- API mounted at both `/` and `/api/v1` for compatibility.

## Requirements
Python 3.11+, dependencies from `requirements.txt`. SQLite works for local development and tests. PostgreSQL is supported through SQLAlchemy; production PostGIS-specific storage and migrations should be configured separately before deployment.

## Setup

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# Linux/macOS: source .venv/bin/activate
python -m pip install -r requirements.txt
cp .env.example .env
python -m app.scripts.initialize_database
python -m app.scripts.run_pipeline
uvicorn app.main:app --reload
```

Open `/docs` for Swagger UI and `/health` for the health check. Set `DATABASE_URL` and `CORS_ORIGINS` in `.env` for your environment. Never use the example secret key in deployment.

## Important API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/cities` | Cities supported by the currently loaded ward dataset |
| GET | `/api/v1/dashboard` | City and ward summary |
| GET | `/api/v1/wards` | Filter/search wards |
| GET | `/api/v1/wards/{ward_id}` | Ward details and indicators |
| GET | `/api/v1/map/geojson` | Ward boundary GeoJSON |
| GET | `/api/v1/water-stress` | WSI for all wards |
| GET | `/api/v1/water-stress?ward_id=W001` | WSI for one ward |
| GET | `/api/v1/predictions?horizon_days=30` | Baseline forecasts |
| GET | `/api/v1/recommendations` | Rule-based recommendations |
| GET | `/api/v1/simulations` | Supported intervention types |
| POST | `/api/v1/simulations/run` | Run a stateless what-if simulation |
| GET | `/api/v1/methodology` | Indicator weights and thresholds |

### Run a simulation

```json
{"ward_id":"W001","intervention_type":"leakage_reduction","coverage":1.0}
```

Supported interventions: `leakage_reduction`, `demand_management`, `rainwater_harvesting`, `lake_restoration`, `groundwater_recharge`.

## WSI method
The service normalizes groundwater depth, piped-water supply, tanker dependence, rainfall deficit, and water-body coverage onto a 0–1 stress scale, then applies weights of 0.30, 0.25, 0.20, 0.15, and 0.10 respectively. Missing indicators are excluded and remaining weights are renormalized. If no supported indicators are available, the API reports the stored ward WSI as a fallback.

Risk bands: low `<0.35`; moderate `0.35–<0.55`; high `0.55–<0.75`; critical `>=0.75`.

## Forecasting and simulation limitations
The supplied ward boundary and indicator dataset currently represents Bengaluru; `/api/v1/cities` only exposes cities represented by the loaded dataset. A second city requires its own validated boundaries and indicators.

The forecast endpoint intentionally uses a transparent persistence baseline because this repository does not provide a verified longitudinal time series or a trained model artifact. Simulations are rule-based estimates and are not causal predictions. Simulation runs are calculated on demand and are not persisted. These limitations are returned in the API responses and must be addressed before presenting the results as calibrated predictions.

## Tests

```bash
python -m pytest -q
```

Tests use an isolated in-memory SQLite database. They do not replace integration tests against your production PostgreSQL/PostGIS deployment.
