from fastapi import APIRouter, HTTPException, status

router = APIRouter(
    prefix="/recommendations",
    tags=["recommendations"],
)


@router.get("")
def list_recommendations():
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Recommendations engine reserved for Part 2",
    )
