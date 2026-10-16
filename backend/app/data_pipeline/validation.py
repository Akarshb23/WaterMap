from typing import Any

from pydantic import BaseModel, ValidationError


class ValidationResult(BaseModel):
    is_valid: bool
    errors: list[dict[str, Any]]
    records: list[dict]


class Validator:
    def validate(self, records: list[dict]) -> ValidationResult:
        errors = []
        clean_records = []
        for i, record in enumerate(records):
            try:
                BaseModel(**record)
                clean_records.append(record)
            except ValidationError as exc:
                errors.append({"index": i, "errors": exc.errors()})

        return ValidationResult(
            is_valid=len(errors) == 0,
            errors=errors,
            records=clean_records,
        )
