from sqlalchemy.orm import sessionmaker, Session

from .connection import get_engine


engine = get_engine()


def get_session_factory() -> sessionmaker:
    return sessionmaker(autocommit=False, autoflush=False, bind=get_engine())



def SessionLocal() -> Session:
    factory = get_session_factory()
    return factory()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

