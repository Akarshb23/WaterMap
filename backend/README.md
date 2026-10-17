# 💧 WaterMap Backend

> **Predictive Urban Water-Stress Intelligence Platform — Part 1 Backend & Data Infrastructure**

The WaterMap backend provides high-performance REST APIs, domain-validated data pipelines, geospatial indexing, and ward-level indicators for urban water resilience monitoring.

---

## 🛠️ Technology Stack

- **Runtime & Language:** Python 3.11+ (Managed with `uv`)
- **Web Framework:** FastAPI (ASGI)
- **Database:** PostgreSQL with PostGIS (Production) / SQLite with In-Memory StaticPool (Testing & Local Dev)
- **ORM & Data Access:** SQLAlchemy 2.0 with Repository Pattern
- **Validation:** Pydantic v2
- **Testing:** Pytest with HTTPX TestClient
- **Geospatial Processing:** GeoJSON polygon matching, ray-casting point-in-polygon, bounding box spatial queries

---

## 📁 Project Structure

```text
backend/
├── app/
│   ├── api/                     # REST API routing
│   │   ├── router.py            # Unified router mounting dual prefixes (/ & /api/v1)
│   │   └── routes/              # Route handlers
│   │       ├── health.py        # Health & readiness checks
│   │       ├── dashboard.py     # High-level KPIs & risk counts
│   │       ├── wards.py         # Ward search, filters, pagination, indicators
│   │       ├── map.py           # GeoJSON FeatureCollections & spatial point lookup
│   │       ├── data_sources.py  # Public dataset registry & provenance
│   │       ├── methodology.py   # WSI weighting & CPHEEO/CGWB benchmarks
│   │       ├── predictions.py   # Forecasting stubs (Part 2)
│   │       ├── simulations.py   # Scenario simulation stubs (Part 2)
│   │       ├── water_stress.py  # Advanced WSI stubs (Part 2)
│   │       └── recommendations.py# Policy recommendation stubs (Part 2)
│   ├── core/                    # Core configuration, logging, exceptions
│   ├── database/                # Connection, session, ORM models, queries, seeds
│   ├── data_pipeline/           # Ingestion, cleaning, validation, normalization, runner
│   ├── geospatial/              # Boundary loading, point-in-polygon, spatial validation
│   ├── repositories/            # Data access repositories (Ward, Indicator, DataSource)
│   ├── schemas/                 # Pydantic request & response models
│   └── services/                # Business logic services
├── data/
│   ├── raw/                     # Generated public datasets (GeoJSON, CSVs, JSON)
│   └── sample/                  # Ingestion reference copies
├── docs/                        # Technical specifications
│   ├── architecture.md          # Architecture diagram and component responsibilities
│   ├── api_contracts.md         # Request & response endpoint contracts
│   ├── data_dictionary.md       # Database schemas & indicator definitions
│   └── methodology.md           # WSI mathematical formulation & benchmarks
├── scripts/                     # Operational CLI scripts
│   ├── initialize_database.py   # DB table creation & initial seed
│   ├── import_wards.py          # GeoJSON ward boundary importer
│   └── run_pipeline.py          # Data ingestion & aggregation runner
└── tests/                       # 100% passing automated test suite
```

---

## 🚀 Quick Start Guide

### 1. Environment Setup

Ensure `uv` is installed, then set up the virtual environment:

```bash
cd backend
uv venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate
```

Copy the example environment configuration:

```bash
cp .env.example .env
```

### 2. Database Initialization

Initialize the database schema and seed canonical wards and data sources:

```bash
python scripts/initialize_database.py
```

### 3. Run the Data Pipeline

Ingest, clean, validate, normalize, and aggregate all raw public datasets:

```bash
python scripts/run_pipeline.py
```

### 4. Start the Development Server

Start the FastAPI application using Uvicorn:

```bash
uv run uvicorn app.main:app --reload --port 8000
```

- **Interactive API Documentation:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Alternative ReDoc Documentation:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- **Health Check:** [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

---

## 🧪 Running Automated Tests

Run the complete test suite with `uv run pytest`:

```bash
uv run pytest -v
```

All 25 automated tests cover:
- Health & system diagnostics
- Dashboard summary statistics
- Ward filtering, pagination, and indicator timeseries
- Map layers, GeoJSON exports, and reverse-geocoding coordinates
- Data source CRUD and provenance tracking
- Data cleaning, Pydantic schema validation, and normalization
- Database connection URL normalization and engine creation
- Part 2 501 Not Implemented API contracts

---

## 🌐 Public Datasets Included

Located in `backend/data/raw/`:

| Dataset | Format | Source | Description |
|---|---|---|---|
| `ward_boundaries.geojson` | GeoJSON | BBMP GIS Portal | 25 urban wards with geometry polygons, population, and centroid |
| `groundwater_levels.csv` | CSV | CGWB NWIC | Observation wells monitoring water table depth (`mbgl`) |
| `piped_water_supply.csv` | CSV | BWSSB | Per-capita supply telemetry benchmarked to 135 LPCD |
| `rainfall_precipitation.csv`| CSV | IMD | Gridded precipitation and seasonal departure percentages |
| `tanker_water_demand.csv` | CSV | BBMP Sahaaya | Commercial tanker trips per 1,000 residents and pricing |
| `water_bodies_lakes.csv` | CSV | KSRSAC | Surface lake spread area and ecological buffer coverage |
| `data_sources.json` | JSON | WaterMap Registry | Provenance metadata, licenses, and official URLs |

---

## 📑 Technical Documentation

Detailed documentation is available in the [`docs/`](./docs/) directory:
- [Architecture & Components](./docs/architecture.md)
- [API Request/Response Contracts](./docs/api_contracts.md)
- [Data Dictionary & Field Definitions](./docs/data_dictionary.md)
- [Water Stress Index Methodology](./docs/methodology.md)
