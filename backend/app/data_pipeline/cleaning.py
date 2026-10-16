import logging
from typing import Any

logger = logging.getLogger(__name__)


class Cleaner:
    def clean(self, records: list[dict]) -> dict[str, Any]:
        return {
            "records": records,
            "cleaned": len(records),
            "dropped": 0,
            "warnings": [],
        }
