"""Verification of the real authoritative district boundary dataset.

These tests run against the actual local file produced by
scripts/build_karnataka_districts.py (Esri India Living Atlas IAB2024).
They are intentionally route-level: they exercise the same load,
transform, filter, and cache path the live API uses.
"""

import json
from pathlib import Path

import pytest
from shapely.geometry import shape

from app.api.routes import map as map_routes

REPO_ROOT = Path(map_routes.DISTRICT_GEOJSON_PATH).parents[2]

EXPECTED_DISTRICT_COUNT = 31

EXPECTED_DISTRICTS = {
    "Bagalkote", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru South",
    "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapura",
    "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere",
    "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar",
    "Koppal", "Mandya", "Mysuru", "Raichur", "Shivamogga", "Tumakuru",
    "Udupi", "Uttara Kannada", "Vijayanagara", "Vijayapura", "Yadgir",
}

KARNATAKA_BBOX = (74.0, 11.5, 78.7, 18.9)


@pytest.fixture(scope="module")
def processed_real_features():
    features, source_crs, _source_url = map_routes._get_processed_boundary_features(
        Path(map_routes.DISTRICT_GEOJSON_PATH)
    )
    return features, source_crs


def test_real_dataset_contains_31_districts_including_vijayanagara(processed_real_features):
    features, _source_crs = processed_real_features

    assert len(features) == EXPECTED_DISTRICT_COUNT

    names = {feature["properties"]["district_name"] for feature in features}

    assert names == EXPECTED_DISTRICTS
    assert "Vijayanagara" in names
    assert "Bengaluru South" in names


def test_real_dataset_identifiers_are_unique_and_non_empty(processed_real_features):
    features, _source_crs = processed_real_features

    ids = [feature["properties"]["district_id"] for feature in features]

    assert all(district_id.strip() for district_id in ids)
    assert len(set(ids)) == len(ids)
    assert len({feature["properties"]["district_name"] for feature in features}) == len(ids)


def test_real_dataset_geometries_are_valid_wgs84_within_karnataka(processed_real_features):
    features, _source_crs = processed_real_features

    for feature in features:
        geometry = shape(feature["geometry"])

        assert not geometry.is_empty
        assert geometry.is_valid

        lon_min, lat_min, lon_max, lat_max = geometry.bounds

        assert -180.0 <= lon_min <= lon_max <= 180.0
        assert -90.0 <= lat_min <= lat_max <= 90.0
        assert lon_min >= KARNATAKA_BBOX[0]
        assert lat_min >= KARNATAKA_BBOX[1]
        assert lon_max <= KARNATAKA_BBOX[2]
        assert lat_max <= KARNATAKA_BBOX[3]


def test_real_dataset_uses_official_lgd_identifiers(processed_real_features):
    """district_id must equal the source's official LGD district code."""
    features, _source_crs = processed_real_features

    source_file = json.loads(
        Path(map_routes.DISTRICT_GEOJSON_PATH).read_text(encoding="utf-8")
    )
    codes_by_name = {
        feature["properties"]["name"]: str(feature["properties"]["lgd_districtcode"])
        for feature in source_file["features"]
    }

    for feature in features:
        name = feature["properties"]["district_name"]

        assert feature["properties"]["district_id"] == codes_by_name[name]


def test_real_dataset_reports_the_correct_source_crs(processed_real_features):
    _features, source_crs = processed_real_features

    assert source_crs == "EPSG:7755"


def test_boundary_source_metadata_and_provenance_exist():
    provenance_path = Path(map_routes.DISTRICT_METRICS_PATH).parent / "karnataka_districts.provenance.json"

    assert provenance_path.is_file()

    provenance = json.loads(provenance_path.read_text(encoding="utf-8"))

    source = provenance["authoritative_source"]

    assert source["source_url"].startswith("https://")
    assert provenance["retrieval_date"]
    assert provenance["raw_download"]
    assert provenance["derived_file"]["declared_crs"].startswith("EPSG:7755")
    assert provenance["derived_file"]["api_output_crs"].startswith("EPSG:4326")
    assert provenance["validation_summary"]["district_count"] == EXPECTED_DISTRICT_COUNT

    readme = (
        Path(map_routes.DISTRICT_METRICS_PATH).parent / "DISTRICT_BOUNDARIES_README.md"
    ).read_text(encoding="utf-8")

    assert source["source_url"] in readme
    assert provenance["retrieval_date"] in readme
    assert "Vijayanagara" in readme
