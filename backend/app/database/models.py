from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    Numeric,
    Float,
    String,
    Text,
    DateTime,
    func,
)
from sqlalchemy.orm import relationship

from .base import Base


class Ward(Base):
    __tablename__ = "wards"

    ward_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    district = Column(String, nullable=False, index=True)
    zone = Column(String, nullable=True, index=True)
    population = Column(Integer, nullable=False)
    area_sqkm = Column(Float, nullable=True)
    geometry = Column(Text, nullable=True)  # GeoJSON polygon or PostGIS geometry text
    centroid_lat = Column(Float, nullable=True)
    centroid_lon = Column(Float, nullable=True)
    water_stress_index = Column(Float, default=0.0)
    risk_category = Column(String, default="low", index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    indicators = relationship("Indicator", back_populates="ward", cascade="all, delete-orphan")
    data_sources = relationship("DataSource", secondary="ward_data_sources", back_populates="wards")


class Indicator(Base):
    __tablename__ = "indicators"

    indicator_id = Column(String, primary_key=True, index=True)
    ward_id = Column(String, ForeignKey("wards.ward_id", ondelete="CASCADE"), nullable=False, index=True)
    metric = Column(String, nullable=False, index=True)
    value = Column(Float, nullable=False)
    unit = Column(String, nullable=True)
    normalized_value = Column(Float, default=0.0)
    recorded_at = Column(DateTime(timezone=True), nullable=True)
    source_id = Column(String, ForeignKey("data_sources.source_id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    ward = relationship("Ward", back_populates="indicators")
    source = relationship("DataSource", back_populates="indicators")


class DataSource(Base):
    __tablename__ = "data_sources"

    source_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    source_type = Column(String, nullable=False, index=True)
    url = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    citation = Column(Text, nullable=True)
    license = Column(String, nullable=True)
    refresh_interval_hours = Column(Integer, default=24)
    is_active = Column(Boolean, default=True)
    last_refreshed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    indicators = relationship("Indicator", back_populates="source")
    wards = relationship("Ward", secondary="ward_data_sources", back_populates="data_sources")


class WardDataSource(Base):
    __tablename__ = "ward_data_sources"

    ward_id = Column(String, ForeignKey("wards.ward_id", ondelete="CASCADE"), primary_key=True)
    source_id = Column(String, ForeignKey("data_sources.source_id", ondelete="CASCADE"), primary_key=True)
    ingested_at = Column(DateTime(timezone=True), server_default=func.now())
    record_count = Column(Integer, default=0)
    is_cleaned = Column(Boolean, default=False)
    data_quality_score = Column(Float, default=1.0)


class PipelineRun(Base):
    __tablename__ = "pipeline_runs"

    run_id = Column(String, primary_key=True, index=True)
    source_id = Column(String, ForeignKey("data_sources.source_id", ondelete="SET NULL"), nullable=True)
    status = Column(String, nullable=False, default="completed")
    records_ingested = Column(Integer, default=0)
    records_cleaned = Column(Integer, default=0)
    records_dropped = Column(Integer, default=0)
    duration_seconds = Column(Float, default=0.0)
    executed_at = Column(DateTime(timezone=True), server_default=func.now())
    details = Column(Text, nullable=True)

