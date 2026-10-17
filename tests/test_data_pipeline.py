import pytest
from app.data_pipeline.ingestion import Ingestor, SourceType
from app.data_pipeline.cleaning import Cleaner
from app.data_pipeline.validation import Validator
from app.data_pipeline.normalization import Normalizer
from app.data_pipeline.aggregation import Aggregator
from app.data_pipeline.pipeline_runner import DataPipeline
from app.data_pipeline.source_registry import SourceRegistry


def test_cleaner_standardizes_ward_id():
    cleaner = Cleaner()
    assert cleaner.standardize_ward_id("w001") == "W001"
    assert cleaner.standardize_ward_id("15") == "W015"
    assert cleaner.standardize_ward_id(" W042 ") == "W042"


def test_cleaner_ward_record():
    cleaner = Cleaner()
    raw = {
        "ward_id": "w1",
        "name": " koramangala ",
        "population": -500,  # invalid negative
        "area_sqkm": 0.0,
    }
    cleaned = cleaner.clean_ward_record(raw)
    assert cleaned["ward_id"] == "W001"
    assert cleaned["name"] == "Koramangala"
    assert cleaned["population"] >= 5000
    assert cleaned["area_sqkm"] >= 0.5


def test_cleaner_deduplication():
    cleaner = Cleaner()
    records = [
        {"ward_id": "W001", "name": "Ward 1"},
        {"ward_id": "W001", "name": "Ward 1 duplicate"},
        {"ward_id": "W002", "name": "Ward 2"},
    ]
    report = cleaner.clean(records)
    assert report["cleaned"] == 2
    assert report["dropped"] == 1


def test_validator_valid_and_invalid_wards():
    validator = Validator()
    records = [
        {"ward_id": "W001", "name": "Koramangala", "population": 50000, "area_sqkm": 5.0},
        {"ward_id": "W", "name": "", "population": -10},  # invalid
    ]
    result = validator.validate(records, schema_type="wards")
    assert result.is_valid is False
    assert result.valid_count == 1
    assert result.invalid_count == 1
    assert len(result.errors) == 1


def test_normalizer_domain_logic():
    normalizer = Normalizer()

    # Groundwater (deeper = higher stress)
    assert normalizer.normalize_groundwater(0.0) == 0.0
    assert normalizer.normalize_groundwater(75.0) == 1.0
    assert normalizer.normalize_groundwater(37.5) == 0.5

    # Piped water supply (135 LPCD = 0.0 stress; <=25 = 1.0 stress)
    assert normalizer.normalize_water_supply(135.0) == 0.0
    assert normalizer.normalize_water_supply(150.0) == 0.0
    assert normalizer.normalize_water_supply(25.0) == 1.0
    assert normalizer.normalize_water_supply(80.0) == 0.5

    # Rainfall (0% deficit = 0.0 stress; -60% = 1.0 stress)
    assert normalizer.normalize_rainfall(10.0) == 0.0
    assert normalizer.normalize_rainfall(-60.0) == 1.0
    assert normalizer.normalize_rainfall(-30.0) == 0.5

    # Tanker dependency (0 trips = 0.0; 6 trips/k = 1.0)
    assert normalizer.normalize_tanker_dependency(0.0) == 0.0
    assert normalizer.normalize_tanker_dependency(6.0) == 1.0

    # Lake coverage (>=5% = 0.0; 0% = 1.0)
    assert normalizer.normalize_surface_water(5.0) == 0.0
    assert normalizer.normalize_surface_water(0.0) == 1.0


def test_aggregator_composite_wsi_and_risk_category():
    aggregator = Aggregator()

    scores_low = {
        "groundwater_depth_mbgl": 0.15,
        "piped_water_supply_lpcd": 0.0,
        "tanker_dependency_index": 0.05,
        "rainfall_deficit_pct": 0.10,
        "water_body_coverage_pct": 0.10,
    }
    wsi_low = aggregator.compute_composite_wsi(scores_low)
    assert wsi_low < 0.35
    assert aggregator.get_risk_category(wsi_low) == "low"

    scores_critical = {
        "groundwater_depth_mbgl": 0.90,
        "piped_water_supply_lpcd": 0.95,
        "tanker_dependency_index": 0.85,
        "rainfall_deficit_pct": 0.60,
        "water_body_coverage_pct": 0.80,
    }
    wsi_critical = aggregator.compute_composite_wsi(scores_critical)
    assert wsi_critical >= 0.75
    assert aggregator.get_risk_category(wsi_critical) == "critical"


def test_pipeline_runner_flow(db_session):
    registry = SourceRegistry()
    pipeline = DataPipeline(db=db_session, registry=registry)
    result = pipeline.run_full_pipeline()
    assert result["status"] == "completed"
    assert result["total_wards"] > 0
    assert result["stats"]["indicators_created"] > 0
