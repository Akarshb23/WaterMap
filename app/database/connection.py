from functools import lru_cache
from typing import Optional

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

from ..core.config import get_settings

# Module-level engine that can be overridden for testing
engine: Optional[Engine] = None


def get_database_url() -> str:
    """Return normalized database URL (e.g. postgres:// -> postgresql://)."""
    url = get_settings().database_url
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    return url


def build_database_url() -> str:
    return get_database_url()


def set_test_engine(test_engine: Optional[Engine]) -> None:
    """Set the engine for testing - replaces the default engine."""
    global engine
    engine = test_engine


def create_engine_for_url(db_url: str) -> Engine:
    """Create and return an engine configured appropriately for the given URL."""
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    if db_url.startswith("sqlite"):
        return create_engine(
            db_url,
            connect_args={"check_same_thread": False},
            echo=get_settings().database_echo,
        )
    return create_engine(
        db_url,
        pool_pre_ping=True,
        pool_recycle=3600,
        echo=get_settings().database_echo,
    )


def get_engine() -> Engine:
    """Return the configured engine (test, sqlite, or production PostgreSQL)."""
    global engine
    if engine is not None:
        return engine

    return create_engine_for_url(get_database_url())
