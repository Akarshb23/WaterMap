from typing import Optional, List, Dict, Any
from sqlalchemy import func, select, or_
from sqlalchemy.orm import Session

from . import models


def get_ward(db: Session, ward_id: str) -> Optional[models.Ward]:
    return db.execute(
        select(models.Ward).where(models.Ward.ward_id == ward_id)
    ).scalar_one_or_none()


def list_wards(
    db: Session,
    district: Optional[str] = None,
    zone: Optional[str] = None,
    risk_category: Optional[str] = None,
    min_stress: Optional[float] = None,
    max_stress: Optional[float] = None,
    search: Optional[str] = None,
    limit: Optional[int] = None,
    offset: Optional[int] = None,
) -> List[models.Ward]:
    stmt = select(models.Ward)

    if district:
        stmt = stmt.where(models.Ward.district.ilike(f"%{district}%"))
    if zone:
        stmt = stmt.where(models.Ward.zone.ilike(f"%{zone}%"))
    if risk_category:
        stmt = stmt.where(models.Ward.risk_category == risk_category.lower())
    if min_stress is not None:
        stmt = stmt.where(models.Ward.water_stress_index >= min_stress)
    if max_stress is not None:
        stmt = stmt.where(models.Ward.water_stress_index <= max_stress)
    if search:
        search_filter = or_(
            models.Ward.name.ilike(f"%{search}%"),
            models.Ward.ward_id.ilike(f"%{search}%"),
            models.Ward.district.ilike(f"%{search}%"),
            models.Ward.zone.ilike(f"%{search}%"),
        )
        stmt = stmt.where(search_filter)

    stmt = stmt.order_by(models.Ward.ward_id)
    if offset is not None:
        stmt = stmt.offset(offset)
    if limit is not None:
        stmt = stmt.limit(limit)

    return list(db.execute(stmt).scalars().all())


def count_wards(db: Session) -> int:
    return db.execute(select(func.count(models.Ward.ward_id))).scalar_one() or 0


def create_ward(db: Session, **kwargs) -> models.Ward:
    ward = models.Ward(**kwargs)
    db.add(ward)
    db.commit()
    db.refresh(ward)
    return ward


def update_ward(db: Session, ward_id: str, **kwargs) -> Optional[models.Ward]:
    kwargs.pop("ward_id", None)
    ward = get_ward(db, ward_id)
    if not ward:
        return None
    for k, v in kwargs.items():
        if hasattr(ward, k) and v is not None:
            setattr(ward, k, v)
    db.commit()
    db.refresh(ward)
    return ward



def get_indicator(db: Session, indicator_id: str) -> Optional[models.Indicator]:
    return db.execute(
        select(models.Indicator).where(models.Indicator.indicator_id == indicator_id)
    ).scalar_one_or_none()


def list_indicators_for_ward(
    db: Session, ward_id: str, metric: Optional[str] = None
) -> List[models.Indicator]:
    stmt = select(models.Indicator).where(models.Indicator.ward_id == ward_id)
    if metric:
        stmt = stmt.where(models.Indicator.metric == metric)
    stmt = stmt.order_by(models.Indicator.recorded_at.desc(), models.Indicator.created_at.desc())
    return list(db.execute(stmt).scalars().all())


def get_latest_indicators_for_ward(db: Session, ward_id: str) -> Dict[str, models.Indicator]:
    """Returns a dict mapping metric name -> latest Indicator model for the given ward."""
    indicators = list_indicators_for_ward(db, ward_id)
    latest_by_metric: Dict[str, models.Indicator] = {}
    for ind in indicators:
        if ind.metric not in latest_by_metric:
            latest_by_metric[ind.metric] = ind
    return latest_by_metric


def create_indicator(db: Session, **kwargs) -> models.Indicator:
    indicator = models.Indicator(**kwargs)
    db.add(indicator)
    db.commit()
    db.refresh(indicator)
    return indicator


def upsert_indicator(db: Session, indicator_id: str, **kwargs) -> models.Indicator:
    kwargs.pop("indicator_id", None)
    existing = get_indicator(db, indicator_id)
    if existing:
        for k, v in kwargs.items():
            if hasattr(existing, k) and v is not None:
                setattr(existing, k, v)
        db.commit()
        db.refresh(existing)
        return existing
    else:
        kwargs["indicator_id"] = indicator_id
        return create_indicator(db, **kwargs)



def get_data_source(db: Session, source_id: str) -> Optional[models.DataSource]:
    return db.execute(
        select(models.DataSource).where(models.DataSource.source_id == source_id)
    ).scalar_one_or_none()


def list_data_sources(db: Session, active_only: bool = False) -> List[models.DataSource]:
    stmt = select(models.DataSource)
    if active_only:
        stmt = stmt.where(models.DataSource.is_active.is_(True))
    stmt = stmt.order_by(models.DataSource.source_id)
    return list(db.execute(stmt).scalars().all())


def create_data_source(db: Session, **kwargs) -> models.DataSource:
    if "source_id" not in kwargs or not kwargs["source_id"]:
        import uuid
        kwargs["source_id"] = f"DS{uuid.uuid4().hex[:6].upper()}"
    source = models.DataSource(**kwargs)
    db.add(source)
    db.commit()
    db.refresh(source)
    return source



def get_ward_data_sources(db: Session, ward_id: str) -> List[models.WardDataSource]:
    return list(db.execute(
        select(models.WardDataSource).where(models.WardDataSource.ward_id == ward_id)
    ).scalars().all())


def record_pipeline_run(db: Session, **kwargs) -> models.PipelineRun:
    run = models.PipelineRun(**kwargs)
    db.add(run)
    db.commit()
    db.refresh(run)
    return run

