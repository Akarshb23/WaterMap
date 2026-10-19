from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

router = APIRouter(
    prefix="/health",
    tags=["health"],
)


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=dict,
)
def health_check() -> dict:
    return {"status": "ok"}
