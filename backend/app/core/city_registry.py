from fastapi import HTTPException

# The packaged ward boundaries and indicator data currently represent Bengaluru.
# Add a city only after its own validated ward dataset is loaded and isolated.
SUPPORTED_CITY_IDS = {"bengaluru"}


def validate_city_id(city_id: str) -> str:
    normalized = (city_id or "bengaluru").strip().lower().replace("_", "-")
    if normalized not in SUPPORTED_CITY_IDS:
        raise HTTPException(
            status_code=404,
            detail=f"City '{city_id}' is not supported by the currently loaded WaterMap dataset.",
        )
    return normalized
