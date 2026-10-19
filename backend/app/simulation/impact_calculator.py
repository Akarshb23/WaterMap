"""Calculate bounded, illustrative intervention impacts."""
def calculate_impact(current_wsi: float, effect: float, coverage: float = 1.0) -> dict:
    current = max(0.0, min(1.0, float(current_wsi)))
    applied = max(0.0, min(1.0, float(effect))) * max(0.0, min(1.0, float(coverage)))
    after = round(max(0.0, current - applied), 4)
    return {"baseline_wsi": round(current,4), "projected_wsi": after, "absolute_reduction": round(current-after,4), "relative_reduction_pct": round(((current-after)/current)*100,2) if current else 0.0}
