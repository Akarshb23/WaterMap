from fastapi import APIRouter

from .routes import health, dashboard, wards, map as map_routes, data_sources

router = APIRouter()
router.include_router(health.router)
router.include_router(dashboard.router)
router.include_router(wards.router)
router.include_router(map_routes.router)
router.include_router(data_sources.router)
