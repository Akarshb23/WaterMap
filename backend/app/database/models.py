from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    Numeric,
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
    name = Column(String, nullable=False)
    district = Column(String, nullable=False)
    population = Column(Integer, nullable=False)
    geometry = Column(Text, nullable=True)
    water_stress_index = Column(Numeric, default=0.0)
    risk_category = Column(String, default="low")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    indicators = relationship("Indicator", back_populates="ward", cascade="all, delete-orphan")
    data_sources = relationship("DataSource", secondary="ward_data_sources", back_populates="wards")


class Indicator(Base):
    __tablename__ = "indicators"

    indicator_id = Column(String, primary_key=True, index=True)
    ward_id = Column(String, ForeignKey("wards.ward_id", ondelete="CASCADE"), nullable=False)
    metric = Column(String, nullable=False)
    value = Column(Numeric, nullable=False)
    normalized_value = Column(Numeric, default=0.0)
    source_id = Column(String, ForeignKey("data_sources.source_id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    ward = relationship("Ward", back_populates="indicators")
    source = relationship("DataSource", back_populates="indicators")


class DataSource(Base):
    __tablename__ = "data_sources"

    source_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    source_type = Column(String, nullable=False)
    url = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    refresh_interval_hours = Column(Integer, default=24)
    is_active = Column(Boolean, default=True)
    last_refreshed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    indicators = relationship("Indicator", back_populates="source", cascade="all, delete-orphan")
    wards = relationship("Ward", secondary="ward_data_sources", back_populates="data_sources")


class WardDataSource(Base):
    __tablename__ = "ward_data_sources"

    ward_id = Column(String, ForeignKey("wards.ward_id", ondelete="CASCADE"), primary_key=True)
    source_id = Column(String, ForeignKey("data_sources.source_id", ondelete="CASCADE"), primary_key=True)
    ingested_at = Column(DateTime(timezone=True), server_default=func.now())
    record_count = Column(Integer, default=0)
    is_cleaned = Column(Boolean, default=False)
