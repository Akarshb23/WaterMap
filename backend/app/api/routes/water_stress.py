from fastapi import APIRouter, HTTPException, status

router = APIRouter(
    prefix="/water-stress",
    tags=["water-stress"],
)


@router.get("")
def get_water_stress():
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Advanced water stress intelligence reserved for Part 2",
    )
