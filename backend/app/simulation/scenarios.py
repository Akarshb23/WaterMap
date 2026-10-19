"""Scenario definitions and validation."""
from .intervention_rules import INTERVENTIONS

def get_scenario(intervention_type: str) -> dict:
    key = intervention_type.strip().lower()
    if key not in INTERVENTIONS: raise ValueError(f"Unsupported intervention_type. Choose from: {', '.join(sorted(INTERVENTIONS))}")
    return {"scenario_id": key, **INTERVENTIONS[key]}
