from typing import Any, Dict, List, Optional
import logging
from pydantic import BaseModel, Field, ValidationError, field_validator

logger = logging.getLogger(__name__)


class WardValidationSchema(BaseModel):
    ward_id: str = Field(..., min_length=2, max_length=20)
    name: str = Field(..., min_length=2)
    district: str = Field(default="Bengaluru Urban")
    zone: Optional[str] = Field(default=None)
    population: int = Field(..., gt=0)
    area_sqkm: Optional[float] = Field(default=None, gt=0)
    centroid_lat: Optional[float] = Field(default=None, ge=-90.0, le=90.0)
    centroid_lon: Optional[float] = Field(default=None, ge=-180.0, le=180.0)
    geometry: Optional[Any] = Field(default=None)

    @field_validator("ward_id")
    @classmethod
    def normalize_ward_id(cls, v: str) -> str:
        return v.strip().upper()


class GroundwaterValidationSchema(BaseModel):
    ward_id: str = Field(..., min_length=2)
    water_level_mbgl: float = Field(..., ge=0.0, le=250.0)
    pre_monsoon_mbgl: Optional[float] = Field(default=None, ge=0.0, le=250.0)
    post_monsoon_mbgl: Optional[float] = Field(default=None, ge=0.0, le=250.0)
    date: Optional[str] = Field(default="2024-09-30")
    source_id: Optional[str] = Field(default="DS001")


class RainfallValidationSchema(BaseModel):
    ward_id: str = Field(..., min_length=2)
    actual_rainfall_mm: float = Field(..., ge=0.0, le=5000.0)
    normal_rainfall_mm: float = Field(..., gt=0.0, le=5000.0)
    departure_pct: Optional[float] = Field(default=None, ge=-100.0, le=500.0)
    dry_spell_days: Optional[int] = Field(default=0, ge=0)
    date: Optional[str] = Field(default="2024-09-30")
    source_id: Optional[str] = Field(default="DS002")


class WaterSupplyValidationSchema(BaseModel):
    ward_id: str = Field(..., min_length=2)
    per_capita_lpcd: float = Field(..., ge=0.0, le=500.0)
    supply_mld: Optional[float] = Field(default=None, ge=0.0)
    benchmark_lpcd: Optional[float] = Field(default=135.0, gt=0.0)
    date: Optional[str] = Field(default="2024-09-30")
    source_id: Optional[str] = Field(default="DS003")


class TankerDemandValidationSchema(BaseModel):
    ward_id: str = Field(..., min_length=2)
    registered_tanker_trips: int = Field(..., ge=0)
    avg_tanker_price_inr: Optional[float] = Field(default=None, ge=0.0)
    scarcity_complaints: Optional[int] = Field(default=0, ge=0)
    date: Optional[str] = Field(default="2024-09-30")
    source_id: Optional[str] = Field(default="DS004")


class LakeValidationSchema(BaseModel):
    ward_id: str = Field(..., min_length=2)
    lake_name: str = Field(..., min_length=1)
    lake_area_ha: Optional[float] = Field(default=0.0, ge=0.0)
    lake_storage_pct: Optional[float] = Field(default=50.0, ge=0.0, le=100.0)
    source_id: Optional[str] = Field(default="DS005")


class DataSourceValidationSchema(BaseModel):
    source_id: str = Field(..., min_length=2)
    name: str = Field(..., min_length=2)
    source_type: str = Field(..., min_length=2)
    url: Optional[str] = Field(default=None)
    description: Optional[str] = Field(default=None)
    refresh_interval_hours: int = Field(default=24, ge=1)
    is_active: bool = Field(default=True)


SCHEMA_REGISTRY: Dict[str, type[BaseModel]] = {
    "wards": WardValidationSchema,
    "groundwater": GroundwaterValidationSchema,
    "rainfall": RainfallValidationSchema,
    "water_supply": WaterSupplyValidationSchema,
    "tankers": TankerDemandValidationSchema,
    "lakes": LakeValidationSchema,
    "data_sources": DataSourceValidationSchema,
}


class ValidationResult(BaseModel):
    is_valid: bool
    total_records: int
    valid_count: int
    invalid_count: int
    errors: List[Dict[str, Any]]
    records: List[Dict[str, Any]]


class Validator:
    def validate(
        self,
        records: List[Dict[str, Any]],
        schema_type: Optional[str] = None,
        schema_cls: Optional[type[BaseModel]] = None,
    ) -> ValidationResult:
        if schema_cls is None:
            if schema_type and schema_type in SCHEMA_REGISTRY:
                schema_cls = SCHEMA_REGISTRY[schema_type]
            else:
                schema_cls = BaseModel

        errors = []
        clean_records = []

        for i, record in enumerate(records):
            try:
                validated_model = schema_cls(**record)
                clean_records.append(validated_model.model_dump())
            except ValidationError as exc:
                errors.append({
                    "row_index": i,
                    "record_id": record.get("ward_id") or record.get("source_id") or f"row_{i}",
                    "errors": [
                        {
                            "field": ".".join(str(loc) for loc in err["loc"]),
                            "message": err["msg"],
                            "type": err["type"],
                        }
                        for err in exc.errors()
                    ],
                })

        return ValidationResult(
            is_valid=len(errors) == 0,
            total_records=len(records),
            valid_count=len(clean_records),
            invalid_count=len(errors),
            errors=errors,
            records=clean_records,
        )

