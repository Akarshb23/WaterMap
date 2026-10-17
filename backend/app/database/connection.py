from functools import lru_cache
from typing import Optional

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

from ..core.config import get_settings

# Module-level engine that can be overridden for testing
engine: Optional[Engine] = None


def get_database_url() -> str:
    return get_settings().database_url


def build_database_url() -> str:
    return get_database_url()



def set_test_engine(test_engine: Optional[Engine]) -> None:
    """Set the engine for testing - replaces the default engine."""
    global engine
    engine = test_engine


def get_engine() -> Engine:
    """Return the configured engine (test, sqlite, or production PostgreSQL)."""
    global engine
    if engine is not None:
        return engine

    db_url = get_database_url()
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

