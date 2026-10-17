from fastapi import APIRouter

from .routes import (
    health,
    dashboard,
    wards,
    map as map_routes,
    data_sources,
    predictions,
    simulations,
    water_stress,
    recommendations,
    methodology,
)

router = APIRouter()
router.include_router(health.router)
router.include_router(dashboard.router)
router.include_router(wards.router)
router.include_router(map_routes.router)
router.include_router(data_sources.router)
router.include_router(predictions.router)
router.include_router(simulations.router)
router.include_router(water_stress.router)
router.include_router(recommendations.router)
router.include_router(methodology.router)

