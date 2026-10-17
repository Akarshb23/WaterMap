from fastapi import HTTPException, status


class WaterMapError(Exception):
    pass


class WardNotFoundException(HTTPException):
    def __init__(self, ward_id: str) -> None:
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ward '{ward_id}' not found",
        )


class DataValidationError(HTTPException):
    def __init__(self, detail: str) -> None:
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=detail,
        )
