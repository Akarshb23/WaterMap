import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker

from app.database.base import Base
from app.database.connection import set_test_engine
from app.main import create_app


def get_sqlite_engine():
    """Create an in-memory SQLite engine for testing"""
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(conn, conn_record):
        cursor = conn.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()
    
    return engine


@pytest.fixture(scope="session", autouse=True)
def database_engine():
    """Set the global engine to SQLite before tests run"""
    test_engine = get_sqlite_engine()
    set_test_engine(test_engine)
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)
    set_test_engine(None)


@pytest.fixture
def db_session():
    """Provide a test database session"""
    test_engine = get_sqlite_engine()
    Base.metadata.create_all(bind=test_engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def client(db_session):
    """Create a TestClient with SQLite setup"""
    from app.database import get_db as original_get_db

    # Create a new sessionmaker bound to the test engine
    from app.database.session import SessionLocal as RealSessionLocal
    from app.database.session import engine as test_engine
    
    TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    
    def override_get_db():
        db = TestSessionLocal()
        try:
            yield db
        finally:
            db.close()
    
    app = create_app()
    app.dependency_overrides[original_get_db] = override_get_db
    
    with TestClient(app) as c:
        yield c
    
    app.dependency_overrides.clear()


# Skip DB-dependent tests when PostgreSQL is not available
def pytest_configure(config):
    """Configure pytest with marks"""
    config.addinivalue_line(
        "markers",
        "skipif_no_postgres: Skip test when PostgreSQL is not available"
    )
