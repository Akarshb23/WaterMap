"""Supported simulation intervention defaults."""
INTERVENTIONS = {
 "leakage_reduction": {"label":"Leakage reduction", "default_effect":0.08, "description":"Reduce distribution losses and non-revenue water."},
 "demand_management": {"label":"Demand management", "default_effect":0.06, "description":"Reduce avoidable demand through conservation measures."},
 "rainwater_harvesting": {"label":"Rainwater harvesting", "default_effect":0.07, "description":"Improve local capture and recharge of rainfall."},
 "lake_restoration": {"label":"Lake restoration", "default_effect":0.05, "description":"Improve local surface-water buffering."},
 "groundwater_recharge": {"label":"Groundwater recharge", "default_effect":0.06, "description":"Support groundwater replenishment and infiltration."},
}
