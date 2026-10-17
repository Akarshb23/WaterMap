from fastapi import APIRouter, HTTPException, status

router = APIRouter(
    prefix="/predictions",
    tags=["predictions"],
)


@router.get("")
def list_predictions():
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Predictions engine reserved for Part 2",
    )
