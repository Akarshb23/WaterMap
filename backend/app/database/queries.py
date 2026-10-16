from sqlalchemy import func, select
from sqlalchemy.orm import Session

from . import models


def get_ward(db: Session, ward_id: str):
    return db.execute(select(models.Ward).where(models.Ward.ward_id == ward_id)).scalar_one_or_none()


def list_wards(db: Session):
    return db.execute(select(models.Ward)).scalars().all()


def create_ward(db: Session, **kwargs):
    ward = models.Ward(**kwargs)
    db.add(ward)
    db.commit()
    db.refresh(ward)
    return ward


def get_indicator(db: Session, indicator_id: str):
    return db.execute(
        select(models.Indicator).where(models.Indicator.indicator_id == indicator_id)
    ).scalar_one_or_none()


def list_indicators_for_ward(db: Session, ward_id: str):
    return db.execute(
        select(models.Indicator).where(models.Indicator.ward_id == ward_id)
    ).scalars().all()


def create_indicator(db: Session, **kwargs):
    indicator = models.Indicator(**kwargs)
    db.add(indicator)
    db.commit()
    db.refresh(indicator)
    return indicator


def get_data_source(db: Session, source_id: str):
    return db.execute(
        select(models.DataSource).where(models.DataSource.source_id == source_id)
    ).scalar_one_or_none()


def list_data_sources(db: Session):
    return db.execute(select(models.DataSource)).scalars().all()


def create_data_source(db: Session, **kwargs):
    source = models.DataSource(**kwargs)
    db.add(source)
    db.commit()
    db.refresh(source)
    return source


def get_ward_data_sources(db: Session, ward_id: str):
    return db.execute(
        select(models.WardDataSource).where(models.WardDataSource.ward_id == ward_id)
    ).scalars().all()
