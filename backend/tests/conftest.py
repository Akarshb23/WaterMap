import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.base import Base
from app.database.connection import set_test_engine
from app.core.dependencies import get_db_dependency
from app.database import get_db as original_get_db
from app.main import create_app


def get_sqlite_engine():
    """Create an in-memory SQLite engine with StaticPool for testing"""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(conn, conn_record):
        cursor = conn.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

    return engine


@pytest.fixture(scope="session")
def test_engine():
    engine = get_sqlite_engine()
    yield engine
    engine.dispose()


@pytest.fixture
def db_session(test_engine):
    """Provide a fresh test database session with clean tables for each test"""
    set_test_engine(test_engine)
    Base.metadata.create_all(bind=test_engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=test_engine)
        set_test_engine(None)


@pytest.fixture
def client(db_session, test_engine):
    """Create a TestClient with overridden DB dependency pointing to test_engine"""
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app = create_app()
    app.dependency_overrides[original_get_db] = override_get_db
    app.dependency_overrides[get_db_dependency] = override_get_db

    with TestClient(app) as c:
        yield c

    app.dependency_overrides.clear()


def pytest_configure(config):
    config.addinivalue_line(
        "markers",
        "skipif_no_postgres: Skip test when PostgreSQL is not available",
    )

