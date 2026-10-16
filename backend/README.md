# WaterMap Backend

This is the backend for **WaterMap**, a predictive urban water-stress intelligence platform.

## Technology Stack

- Python
- FastAPI
- PostgreSQL with PostGIS
- SQLAlchemy
- Pydantic
- Pytest

## Project Structure

```
backend/
├── app/                      # Backend application
│   ├── api/                  # API routes
│   │   ├── routes/           # Route modules
│   │   │   ├── health.py     # Health check endpoint
│   │   │   ├── dashboard.py  # Dashboard summary endpoint
│   │   │   ├── wards.py      # Ward list/detail endpoints
│   │   │   ├── map.py        # Map layer/geometry endpoints
│   │   │   ├── data_sources.py # Data source CRUD endpoints
│   │   │   ├── predictions.py  # Prediction endpoints (TBD - Part 2)
│   │   │   ├── simulations.py  # Simulation endpoints (TBD - Part 2)
│   │   │   ├── recommendations.py # Recommendation endpoints (TBD - Part 2)
│   │   │   └── methodology.py  # Methodology endpoint (TBD - Part 2)
│   │   └── router.py         # API router
│   ├── core/                 # Core application configuration
│   │   ├── config.py         # Pydantic settings
│   │   ├── logging.py        # Logging configuration
│   │   ├── exceptions.py     # Custom exceptions
│   │   └── dependencies.py   # FastAPI dependency injection
│   ├── database/             # Database layer
│   │   ├── connection.py     # Database connection
│   │   ├── session.py        # Session management
│   │   ├── base.py           # SQLAlchemy Base
│   │   ├── models.py         # ORM models
│   │   ├── queries.py        # Database queries
│   │   └── seed.py           # Seed data
│   ├── schemas/              # Pydantic schemas
│   ├── services/             # Business service abstractions
│   ├── repositories/          # Repository pattern
│   ├── data_pipeline/         # Data ingestion/cleaning/validation
│   ├── geospatial/            # Geospatial operations
│   ├── water_stress/          # Water stress calculations (TBD - Part 2)
│   ├── forecasting/           # Forecasting (TBD - Part 2)
│   ├── simulation/            # Simulations (TBD - Part 2)
│   └── recommendations/       # Recommendations (TBD - Part 2)
├── data/                     # Data directories
│   ├── raw/                  # Raw data
│   ├── processed/            # Processed data
│   └── sample/               # Sample data
├── scripts/                  # Utility scripts
├── tests/                    # Test files
└── docs/                     # Documentation
