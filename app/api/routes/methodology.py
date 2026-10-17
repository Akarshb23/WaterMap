from fastapi import APIRouter

router = APIRouter(
    prefix="/methodology",
    tags=["methodology"],
)


@router.get("")
def get_methodology():
    return {
        "title": "WaterMap Water Stress Index (WSI) Methodology",
        "version": "1.0.0",
        "framework": "Urban Water Resilience and Depletion Assessment",
        "indicators": [
            {
                "id": "groundwater_depth_mbgl",
                "name": "Groundwater Table Depth",
                "unit": "mbgl",
                "weight": 0.30,
                "benchmarks": {
                    "safe": "<10m",
                    "semi_critical": "10-25m",
                    "critical": "25-45m",
                    "over_exploited": ">45m",
                },
                "source": "Central Ground Water Board (CGWB) NWIC",
            },
            {
                "id": "piped_water_supply_lpcd",
                "name": "Per Capita Piped Water Distribution",
                "unit": "lpcd",
                "weight": 0.25,
                "benchmarks": {
                    "adequate": ">=135 LPCD",
                    "stressed": "60-134 LPCD",
                    "crisis": "<60 LPCD",
                },
                "source": "Bangalore Water Supply and Sewerage Board (BWSSB)",
            },
            {
                "id": "tanker_dependency_index",
                "name": "Commercial Tanker Reliance",
                "unit": "trips/k",
                "weight": 0.20,
                "benchmarks": {
                    "low": "<1 trip/k",
                    "moderate": "1-3 trips/k",
                    "severe": ">3 trips/k",
                },
                "source": "BBMP Sahaaya 2.0 Grievance Redressal",
            },
            {
                "id": "rainfall_deficit_pct",
                "name": "Rainfall Precipitation Anomaly",
                "unit": "%",
                "weight": 0.15,
                "benchmarks": {
                    "normal": ">= -19%",
                    "deficient": "-20% to -59%",
                    "scanty": "<= -60%",
                },
                "source": "India Meteorological Department (IMD)",
            },
            {
                "id": "water_body_coverage_pct",
                "name": "Surface Lake & Water Body Health",
                "unit": "%",
                "weight": 0.10,
                "benchmarks": {
                    "resilient": ">=5%",
                    "vulnerable": "1-4%",
                    "depleted": "<1%",
                },
                "source": "Karnataka State Remote Sensing Applications Centre (KSRSAC)",
            },
        ],
        "risk_tiers": {
            "low": "< 0.35 WSI",
            "moderate": "0.35 - 0.54 WSI",
            "high": "0.55 - 0.74 WSI",
            "critical": ">= 0.75 WSI",
        },
    }
