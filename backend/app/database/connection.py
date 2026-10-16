from functools import lru_cache

from sqlalchemy import create_engine
from sqlalchemy.engine.url import URL


def get_database_url() -> str:
    return (
        "postgresql+psycopg2://water_map:password@localhost:5432/water_map"
    )


@lru_cache
def build_database_url() -> URL:
    return URL.create(
        "postgresql+psycopg2",
        username="water_map",
        password="password",
        host="localhost",
        port=5432,
        database="water_map",
    )


# Module-level engine that can be overridden for testing
engine = None


def set_test_engine(test_engine):
    """Set the engine for testing - replaces the real PostgreSQL engine."""
    global engine
    engine = test_engine


def get_engine():
    """Return the configured engine (test or production)."""
    if engine is None:
        return create_engine(str(build_database_url()), pool_pre_ping=True, pool_recycle=3600)
    return engine
