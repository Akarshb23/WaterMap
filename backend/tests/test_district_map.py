
from app.api.routes import map as map_routes


def test_local_district_geojson_is_transformed_and_unscored(
    monkeypatch,
    tmp_path,
):
    dataset = {
        "type": "FeatureCollection",
        "name": "test districts",
        "crs": {
            "type": "name",
            "properties": {"name": "EPSG:4326"},
        },
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "state_name": "Karnataka",
                    "state": "KA",
                    "district": "Bengaluru Urban",
                    "dtcode": "526",
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [77.0, 12.0],
                        [78.0, 12.0],
                        [78.0, 13.0],
                        [77.0, 12.0],
                    ]],
                },
            },
            {
                "type": "Feature",
                "properties": {
                    "state_name": "Kerala",
                    "state": "KL",
                    "district": "Example District",
                    "dtcode": "999",
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [76.0, 10.0],
                        [77.0, 10.0],
                        [77.0, 11.0],
                        [76.0, 10.0],
                    ]],
                },
            },
        ],
    }

    local_file = tmp_path / "karnataka_districts.geojson"
    import json

    local_file.write_text(json.dumps(dataset), encoding="utf-8")

    monkeypatch.setattr(
        map_routes,
        "DISTRICT_GEOJSON_PATH",
        local_file,
    )

    result = map_routes.get_districts_geojson()

    assert result["type"] == "FeatureCollection"
    assert result["coordinate_reference_system"] == "EPSG:4326"
    assert len(result["features"]) == 1

    feature = result["features"][0]
    assert feature["properties"]["district_name"] == "Bengaluru Urban"
    assert feature["properties"]["water_stress_index"] is None
    assert feature["properties"]["risk_category"] == "insufficient_data"
    assert feature["properties"]["data_status"] == "insufficient_data"


def test_missing_local_district_file_returns_clear_error(
    monkeypatch,
    tmp_path,
):
    from fastapi import HTTPException

    monkeypatch.setattr(
        map_routes,
        "DISTRICT_GEOJSON_PATH",
        tmp_path / "missing.geojson",
    )

    try:
        map_routes.get_districts_geojson()
        assert False, "Expected HTTPException for missing district data"
    except HTTPException as exc:
        assert exc.status_code == 503
        assert "not found" in exc.detail.lower()


def test_real_district_metrics_provide_labelled_scores_for_all_31_districts():
    """Every boundary has a score, but estimated inputs must remain labelled."""
    result = map_routes.get_districts_geojson()

    assert result["district_count"] == 31
    assert result["scored_district_count"] == 31
    assert result["estimated_scored_district_count"] == 31

    for feature in result["features"]:
        properties = feature["properties"]
        assert properties["water_stress_index"] is not None
        assert 0 <= properties["water_stress_index"] <= 1
        assert properties["risk_category"] in {"low", "moderate", "high", "critical"}
        assert properties["data_status"] == "estimated_model"
        assert properties["indicators_used"] == 5
        if properties["district_name"] == "Bengaluru South":
            assert properties["verified_indicators"] == 0
            assert properties["estimated_indicators"] == 5
        else:
            assert properties["verified_indicators"] == 2
            assert properties["estimated_indicators"] == 3


def test_metrics_csv_has_155_traceable_metric_rows():
    import csv
    from pathlib import Path

    csv_path = Path(map_routes.DISTRICT_METRICS_PATH)
    with csv_path.open(encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))

    assert len(rows) == 155
    assert {row["metric"] for row in rows} == {
        "groundwater", "rainfall", "piped_supply", "tanker_reliance", "water_bodies"
    }
    assert all(row["source_url"].startswith("https://") for row in rows)
    assert all(row["normalization_method"] for row in rows)
    assert all(row["raw_unit"] for row in rows)
    assert all(row["data_quality"] for row in rows)
