from pydantic import BaseModel, Field


class RecommendationOut(BaseModel):
    recommendation_id: str = Field(..., min_length=1)
    ward_id: str = Field(..., min_length=1)
    priority: int = Field(..., ge=1, le=10)
    recommended_action: str = Field(..., min_length=1)
    rationale: str = Field(..., min_length=1)
    created_at: str = Field(..., min_length=1)
