"""Scenario simulation engine."""
from datetime import date
from .scenarios import get_scenario
from .impact_calculator import calculate_impact
from ..water_stress.risk_categories import risk_category

def simulate(ward, intervention_type: str, coverage: float = 1.0) -> dict:
    scenario = get_scenario(intervention_type)
    impact = calculate_impact(float(ward.water_stress_index or 0.0), scenario["default_effect"], coverage)
    return {"simulation_id": f"sim-{ward.ward_id}-{scenario['scenario_id']}", "scenario_id": scenario["scenario_id"], "ward_id": ward.ward_id, "ward_name": ward.name, "intervention_type": scenario["scenario_id"], "intervention_label": scenario["label"], "impact_estimate": -impact["absolute_reduction"], "baseline_wsi": impact["baseline_wsi"], "projected_wsi": impact["projected_wsi"], "baseline_risk_category": risk_category(impact["baseline_wsi"]), "projected_risk_category": risk_category(impact["projected_wsi"]), "absolute_reduction": impact["absolute_reduction"], "relative_reduction_pct": impact["relative_reduction_pct"], "coverage": coverage, "assumptions": "Illustrative rule-based estimate, not a causal or calibrated model.", "simulation_date": date.today().isoformat(), "status": "completed"}
