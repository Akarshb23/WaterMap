"""Rule-based, explainable ward recommendations."""
from datetime import date
from .rules import RULES
from .prioritization import priority_for
from ..water_stress.risk_categories import risk_category

def recommend_for_ward(ward, indicators) -> list[dict]:
    current = max(0.0, min(1.0, float(ward.water_stress_index or 0.0)))
    category = risk_category(current)
    metrics = [str(getattr(i, "metric", "")).lower() for i in indicators]
    results=[]
    for keyword, action_id, action, rationale in RULES:
        matching = [m for m in metrics if keyword in m or (keyword == "supply" and "lpcd" in m) or (keyword == "lake" and "coverage" in m)]
        if matching:
            results.append({"recommendation_id":f"rec-{ward.ward_id}-{action_id}","ward_id":ward.ward_id,"priority":priority_for(current,category),"recommended_action":action,"action_type":action_id,"rationale":rationale,"risk_category":category,"evidence_metrics":matching,"created_at":date.today().isoformat()})
    if not results and current >= 0.35:
        results.append({"recommendation_id":f"rec-{ward.ward_id}-monitoring","ward_id":ward.ward_id,"priority":priority_for(current,category),"recommended_action":"Validate recent measurements and create a ward-level water conservation plan","action_type":"monitoring","rationale":"Stored ward-level water-stress score is elevated, but indicator-level evidence is unavailable.","risk_category":category,"evidence_metrics":[],"created_at":date.today().isoformat()})
    return sorted(results,key=lambda r:(-r["priority"],r["action_type"]))
