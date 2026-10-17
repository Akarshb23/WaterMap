from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    project_name: str = "WaterMap"
    project_version: str = "0.1.0"
    debug: bool = False
    openapi_url: str = "/openapi.json"
    docs_url: str = "/docs"
    redoc_url: str = "/redoc"

    database_url: str = "sqlite:///./watermap.db"
    database_echo: bool = False

    raw_data_dir: str = str(BASE_DIR / "data" / "raw")
    processed_data_dir: str = str(BASE_DIR / "data" / "processed")
    sample_data_dir: str = str(BASE_DIR / "data" / "sample")

    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    cors_origins: list[str] = ["*"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()

