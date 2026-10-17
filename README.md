# 💧 WaterMap Backend

> **Predictive Urban Water-Stress Intelligence Platform**

The WaterMap backend powers ward-level water-stress monitoring, geospatial data access, data-source transparency, and the foundation for predictive water intelligence.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Database Setup](#-database-setup)
- [Running the Server](#-running-the-server)
- [API Endpoints](#-api-endpoints)
- [Data Pipeline](#-data-pipeline)
- [Geospatial Processing](#-geospatial-processing)
- [Testing](#-testing)
- [Architecture](#-architecture)
- [Security Guidelines](#-security-guidelines)
- [Project Status](#-project-status)

---

## 🌍 Overview

**WaterMap** is designed to help understand and analyze urban water stress at the ward level.

The backend provides a REST API for retrieving ward information, dashboard summaries, map data, and registered data sources. It also establishes the infrastructure needed for water-stress calculations, forecasting, scenario simulations, and recommendations.

### Core Objectives

- Provide structured access to ward-level water information.
- Support interactive geospatial visualization.
- Ingest, validate, and process water-related datasets.
- Maintain transparent data-source information.
- Support explainable and data-driven water-stress analysis.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Python** | Backend programming language |
| **FastAPI** | REST API development |
| **PostgreSQL** | Relational data storage |
| **PostGIS** | Geospatial database capabilities |
| **SQLAlchemy** | Database ORM and session management |
| **Pydantic** | Request validation and response schemas |
| **Pytest** | Automated testing |
| **Uvicorn** | ASGI application server |

---

## ✨ Features

### ✅ Backend Infrastructure

- FastAPI application foundation and API routing.
- Health-check endpoint.
- Dashboard summary API.
- Ward listing and ward detail APIs.
- Map-data API modules.
- Data-source registration and retrieval.
- Database connection, session, and ORM infrastructure.
- Repository and service layers.
- Data ingestion and validation modules.
- Geospatial boundary and geometry-processing modules.

### 🚧 Water Intelligence Engine

The following modules are reserved for separate implementation:

- **Water Stress Index (WSI):** Weighted water-stress assessment.
- **Forecasting:** Future water-stress estimation.
- **Scenario Simulation:** What-if analysis for demand reduction and other interventions.
- **Recommendations:** Prioritized actions based on available indicators and risk factors.

> **Note:** These features should be considered complete only after their implementation and validation.

---

## 📁 Project Structure

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── router.py
│   │   └── routes/
│   │       ├── health.py
│   │       ├── dashboard.py
│   │       ├── wards.py
│   │       ├── map.py
│   │       ├── data_sources.py
│   │       ├── predictions.py
│   │       ├── simulations.py
│   │       ├── recommendations.py
│   │       └── methodology.py
│   ├── core/
│   │   ├── config.py
│   │   ├── logging.py
│   │   ├── exceptions.py
│   │   └── dependencies.py
│   ├── database/
│   │   ├── connection.py
│   │   ├── session.py
│   │   ├── base.py
│   │   ├── models.py
│   │   ├── queries.py
│   │   └── seed.py
│   ├── schemas/
│   ├── services/
│   ├── repositories/
│   ├── data_pipeline/
│   ├── geospatial/
│   ├── water_stress/
│   ├── forecasting/
│   ├── simulation/
│   └── recommendations/
├── data/
│   ├── raw/
│   ├── processed/
│   └── sample/
├── scripts/
├── tests/
├── docs/
├── .env.example
├── .gitignore
├── requirements.txt
├── pyproject.toml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure the following are installed:

- **Python 3.11+**, or another version supported by the project dependencies.
- **PostgreSQL**
- **PostGIS**, if using spatial database functionality.
- **Git**

### 1. Clone the Repository

```bash
git clone <repository-url>
cd WaterMap
```

### 2. Navigate to the Backend

```bash
cd backend
```

### 3. Create a Virtual Environment

**Windows — PowerShell**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**Linux / macOS**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 4. Install Dependencies

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

---

## ⚙️ Environment Configuration

Create a `.env` file from the provided example.

**Windows:**

```powershell
Copy-Item .env.example .env
```

**Linux / macOS:**

```bash
cp .env.example .env
```

Configure the required values in `.env`, according to the settings defined in `app/core/config.py`.

Typical settings include:

```dotenv
PROJECT_NAME=WaterMap
DEBUG=false
DATABASE_URL=postgresql+psycopg2://username:password@localhost:5432/watermap
DATABASE_ECHO=false
```

> **Security:** Replace example credentials with your local configuration. Never commit `.env`, passwords, API keys, or other secrets to Git.

The variable names must match the actual application settings. Update this example if the configuration implementation uses different names.

---

## 🗄️ Database Setup

### 1. Create a PostgreSQL Database

Create a database named `watermap`, or use another name and update the connection URL accordingly.

### 2. Enable PostGIS

If spatial database functionality is required, execute the following SQL using a database role with the necessary permissions:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

### 3. Initialize the Schema

Use the database initialization or migration workflow provided by the project.

Before loading data, verify that:

- The database connection works.
- Required tables exist.
- Ward identifiers are stable and unique.
- Geometry columns use the expected coordinate reference system.
- Indicator records contain appropriate units, timestamps, and source references.

**Important:** Database initialization and migrations must be verified against the actual implementation. Do not assume tables are automatically created.

---

## ▶️ Running the Server

From the `backend/` directory, start the development server:

```bash
uvicorn app.main:app --reload
```

The default local address is:

```text
http://127.0.0.1:8000
```

### API Documentation

When enabled, FastAPI provides interactive documentation:

- **Swagger UI:** http://127.0.0.1:8000/docs
- **ReDoc:** http://127.0.0.1:8000/redoc
- **OpenAPI Schema:** http://127.0.0.1:8000/openapi.json

> **Startup note:** This command assumes `app/main.py` exposes a module-level `app` object. If the implementation only provides a `create_app()` factory, configure the appropriate Uvicorn factory command or expose the application instance.

---

## 🔌 API Endpoints

The following endpoints were reported as registered in the current implementation.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Check API availability |
| `GET` | `/dashboard` | Retrieve dashboard summary |
| `GET` | `/wards` | List wards |
| `GET` | `/wards/{ward_id}` | Retrieve ward details |
| `GET` | `/map/layers` | Retrieve available map layers |
| `GET` | `/map/wards/{ward_id}` | Retrieve ward map information |
| `GET` | `/data-sources` | List registered data sources |
| `POST` | `/data-sources` | Register a data source |
| `GET` | `/data-sources/{source_id}` | Retrieve a specific data source |

**Verify actual paths and HTTP methods** using the running application's OpenAPI documentation. Router prefixes may change the final URLs.

### Health Check Example

**Request**

```http
GET /health
```

**Example response**

```json
{
  "status": "ok"
}
```

The response above represents the health-check result reported during initial verification.

---

## 🔄 Data Pipeline

The data pipeline separates ingestion and processing into reusable modules.

### Processing Workflow

1. **Ingestion** — Read supported source files.
2. **Cleaning** — Handle malformed records and inconsistent values.
3. **Validation** — Check required fields, types, and constraints.
4. **Normalization** — Transform indicator values when appropriate metadata is available.
5. **Aggregation** — Associate observations with canonical ward identifiers.
6. **Persistence** — Store validated records in PostgreSQL.
7. **Reporting** — Record rejected rows, validation failures, and ingestion errors.

### Data Organization

| Directory | Purpose |
|---|---|
| `data/raw/` | Original input datasets |
| `data/processed/` | Cleaned and transformed datasets |
| `data/sample/` | Small datasets for development and testing |

> Use real, attributable datasets for real-world analysis. Clearly label synthetic or sample records, and do not present them as verified measurements.

---

## 🗺️ Geospatial Processing

The geospatial modules support ward-level geographic data for integration with **MapLibre** or **Leaflet**.

Responsibilities include:

- Importing ward boundary datasets.
- Validating geometry and detecting invalid features.
- Handling coordinate reference systems.
- Matching indicator observations to stable ward IDs.
- Preparing GeoJSON-compatible map responses.
- Reporting invalid or unmatched geographic records.

All API and database modules should use the same canonical ward identifiers.

---

## 🧪 Testing

Run the test suite from the `backend/` directory:

```bash
pytest -v
```

For a coverage report, install `pytest-cov` if it is not already included:

```bash
pytest --cov=app --cov-report=term-missing
```

### Initial Verification Status

The initial test run reported:

- **1 test passed**
- **9 tests skipped**
- Database-dependent tests were skipped because PostgreSQL was unavailable in that environment.

This confirms the health-check test passed, but does not establish that all database operations or geospatial workflows work correctly.

Run the full suite again after configuring the database.

---

## 🏗️ Architecture

WaterMap separates backend responsibilities into two implementation areas.

### Part 1 — Backend & Data Infrastructure

Responsible for:

- FastAPI application setup and shared configuration.
- Database models, sessions, queries, and repositories.
- Dashboard, ward, map, and data-source APIs.
- Data ingestion, cleaning, validation, and aggregation.
- Geospatial processing and map-data preparation.

### Part 2 — Water Intelligence & Decision Engine

Responsible for:

- Water Stress Index calculation and explainability.
- Forecasting and baseline comparisons.
- What-if scenario simulation and impact estimation.
- Rule-based recommendations and prioritization.

Both parts must share the same database schema, canonical ward IDs, and documented data contracts.

---

## 🔐 Security Guidelines

- Store credentials in environment variables.
- Keep `.env` out of version control.
- Validate incoming request parameters and payloads.
- Use parameterized database operations.
- Avoid exposing internal stack traces or secrets in API responses.
- Configure CORS for trusted frontend origins.
- Apply pagination and sensible limits to collection endpoints.
- Validate uploaded datasets before processing them.
- Avoid destructive database initialization or seeding operations.

---

## 📚 Documentation

Additional technical documentation is available in `docs/`.

| File | Purpose |
|---|---|
| `docs/api_contracts.md` | API request and response contracts |
| `docs/data_dictionary.md` | Database fields and indicator definitions |
| `docs/methodology.md` | Water-stress methodology |
| `docs/architecture.md` | System architecture and module boundaries |

---

## 📈 Project Status

**Current stage:** Part 1 Backend & Data Infrastructure Complete. Ready for Part 2 Intelligence Layer.

| Component | Status | Details |
|---|---|---|
| **Public Datasets** | ✅ Complete | 25 Bengaluru wards GeoJSON, CGWB groundwater, BWSSB piped supply, IMD rainfall, tanker trips, lake spread |
| **FastAPI Foundation** | ✅ Complete | Dual routing (`/` & `/api/v1`), global error handlers, CORS, Swagger UI, health checks |
| **Database & PostGIS Layer** | ✅ Complete | SQLAlchemy models (`Ward`, `Indicator`, `DataSource`, `WardDataSource`, `PipelineRun`), SQLite & PostgreSQL/PostGIS support |
| **Data Cleaning & Validation** | ✅ Complete | Canonical ward IDs (`w1` → `W001`), domain outlier clamping, Pydantic schemas (`WardValidationSchema`, etc.) |
| **Normalization & Aggregation** | ✅ Complete | Domain-calibrated normalization (CPHEEO 135 LPCD, CGWB 45m, IMD deficit), composite WSI calculation |
| **Geospatial Processing** | ✅ Complete | Point-in-polygon ray casting, bounding box spatial filtering, FeatureCollection assembly |
| **Ward-Level Indicators** | ✅ Complete | Filtering by district, zone, risk category, stress score; indicator timeseries and metrics |
| **Technical Documentation** | ✅ Complete | Full documentation in `docs/`: `architecture.md`, `data_dictionary.md`, `api_contracts.md`, `methodology.md` |
| **Automated Test Suite** | ✅ Complete | 23/23 passing automated tests (`uv run pytest`) across routes, models, pipeline, and geospatial engine |
| **Water Stress Index Modeling** | ⏳ Reserved for Part 2 | Detailed scoring, explainability decomposition, temporal tracking |
| **Forecasting Engine** | ⏳ Reserved for Part 2 | 30/60/90-day predictive stress models and baseline comparisons (HTTP 501 stubs ready) |
| **Scenario Simulation** | ⏳ Reserved for Part 2 | What-if simulation for demand interventions and climate shocks (HTTP 501 stubs ready) |
| **Recommendations Engine** | ⏳ Reserved for Part 2 | Automated policy and infrastructure action prioritization (HTTP 501 stubs ready) |

---

## 🤝 Contribution Guidelines

When contributing to WaterMap:

1. Follow the existing module structure.
2. Keep route handlers thin and place business logic in services.
3. Use repositories for database access.
4. Validate API inputs with Pydantic schemas.
5. Add tests for new functionality.
6. Update the documentation when API contracts or database models change.
7. Coordinate shared schema changes with the other backend developer.
8. Never claim a feature is complete without appropriate verification.

---

**WaterMap — Turning urban water data into actionable intelligence.** 💧