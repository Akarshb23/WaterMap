from pydantic import BaseModel, Field


class DataSourceOut(BaseModel):
    source_id: str = Field(..., min_length=1)
    name: str = Field(..., min_length=1)
    type: str = Field(..., min_length=1)
    url: str | None
    description: str | None
    refresh_interval_hours: int = Field(..., ge=1)
    is_active: bool


class DataSourceCreate(BaseModel):
    name: str = Field(..., min_length=1)
    type: str = Field(..., min_length=1)
    url: str | None
    description: str | None
    refresh_interval_hours: int = Field(..., ge=1)
    is_active: bool = True
