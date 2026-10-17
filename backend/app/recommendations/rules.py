"""Rules mapping risk and indicator patterns to interventions."""
RULES = [
 ("groundwater", "groundwater_recharge", "Prioritize managed aquifer recharge and monitor extraction", "Deep groundwater levels contribute to elevated stress."),
 ("supply", "leakage_reduction", "Audit distribution losses and repair priority leaks", "Low piped-water supply can indicate distribution constraints."),
 ("tanker", "demand_management", "Reduce tanker dependence through reliable scheduled supply", "High tanker dependence can signal unreliable piped supply."),
 ("rain", "rainwater_harvesting", "Expand rooftop rainwater harvesting and stormwater capture", "Rainfall deficit increases seasonal supply vulnerability."),
 ("lake", "lake_restoration", "Protect lake catchments and restore local water bodies", "Low surface-water coverage reduces local buffering."),
]
