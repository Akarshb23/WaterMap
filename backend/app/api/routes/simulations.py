from fastapi import APIRouter, HTTPException, status

router = APIRouter(
    prefix="/simulations",
    tags=["simulations"],
)


@router.get("")
def list_simulations():
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Simulations engine reserved for Part 2",
    )
