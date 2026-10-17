import pytest
from app.database import connection
from app.core.config import Settings


def test_database_url_normalization(monkeypatch):
    test_settings = Settings(database_url="postgres://user:secret@localhost:5432/watermap_db")
    monkeypatch.setattr(connection, "get_settings", lambda: test_settings)

    url = connection.get_database_url()
    assert url.startswith("postgresql://")
    assert "user:secret@localhost:5432/watermap_db" in url


def test_sqlite_engine_creation():
    engine = connection.create_engine_for_url("sqlite:///:memory:")
    assert engine is not None
    assert engine.dialect.name == "sqlite"
