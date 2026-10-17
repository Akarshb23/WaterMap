# 📖 WaterMap Data Dictionary

This document details the database schemas, field definitions, relationships, constraints, and standardized indicators for the **WaterMap** platform.

---

## 🗄️ Database Tables

### 1. `wards`
Administrative urban wards representing the primary spatial unit of analysis.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `ward_id` | `VARCHAR` | Primary Key, Indexed | Canonical identifier (e.g., `W001`, `W002`). |
| `name` | `VARCHAR` | NOT NULL, Indexed | Ward official name (e.g., `Koramangala`, `Bellandur`). |
| `district` | `VARCHAR` | NOT NULL, Indexed | District administrative jurisdiction (e.g., `Bengaluru Urban`). |
| `zone` | `VARCHAR` | NULLABLE, Indexed | Administrative zone (e.g., `South`, `East`, `Mahadevapura`). |
| `population` | `INTEGER` | NOT NULL | Ward population based on latest census/projections. |
| `area_sqkm` | `FLOAT` | NULLABLE | Geographic area of the ward in square kilometers. |
| `geometry` | `TEXT` | NULLABLE | GeoJSON polygon string or PostGIS spatial geometry. |
| `centroid_lat` | `FLOAT` | NULLABLE | Latitude of the ward geometric center. |
| `centroid_lon` | `FLOAT` | NULLABLE | Longitude of the ward geometric center. |
| `water_stress_index` | `FLOAT` | Default: `0.0` | Baseline Water Stress Index (0.00 to 1.00). |
| `risk_category` | `VARCHAR` | Default: `'low'` | Tier: `low`, `moderate`, `high`, `critical`. |
| `created_at` | `TIMESTAMPTZ` | Server Default `NOW()` | Timestamp when record was created. |
| `updated_at` | `TIMESTAMPTZ` | On Update `NOW()` | Timestamp when record was last updated. |

---

### 2. `indicators`
Multi-source telemetry and observational metrics associated with a ward.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `indicator_id` | `VARCHAR` | Primary Key, Indexed | Unique indicator record identifier (e.g., `IND-W001-groundwater_depth_mbgl`). |
| `ward_id` | `VARCHAR` | Foreign Key -> `wards.ward_id` (CASCADE), Indexed | Associated canonical ward. |
| `metric` | `VARCHAR` | NOT NULL, Indexed | Metric name (e.g., `groundwater_depth_mbgl`, `piped_water_supply_lpcd`). |
| `value` | `FLOAT` | NOT NULL | Raw observed measurement value. |
| `unit` | `VARCHAR` | NULLABLE | Physical unit of measurement (`mbgl`, `lpcd`, `%`, `trips/k`). |
| `normalized_value` | `FLOAT` | Default: `0.0` (0.0 to 1.0) | Standardized stress severity score. |
| `recorded_at` | `TIMESTAMPTZ` | NULLABLE | Observation timestamp from source. |
| `source_id` | `VARCHAR` | Foreign Key -> `data_sources.source_id` (SET NULL) | Attribution reference to the registered data source. |
| `created_at` | `TIMESTAMPTZ` | Server Default `NOW()` | Database record insertion timestamp. |

---

### 3. `data_sources`
Registry of public, municipal, satellite, and telemetry data sources.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `source_id` | `VARCHAR` | Primary Key, Indexed | Unique source identifier (e.g., `DS001`, `DS002`). |
| `name` | `VARCHAR` | NOT NULL | Official publication/organization name. |
| `source_type` | `VARCHAR` | NOT NULL, Indexed | `government`, `municipal`, `open_data`, `weather`, `satellite`. |
| `url` | `TEXT` | NULLABLE | Public API or dataset download URL. |
| `description` | `TEXT` | NULLABLE | Summary of metrics and methodology provided by source. |
| `citation` | `TEXT` | NULLABLE | Formal bibliographic and governmental citation. |
| `license` | `VARCHAR` | NULLABLE | Open data license (e.g., `GODL`, `CC-BY 4.0`). |
| `refresh_interval_hours`| `INTEGER` | Default: `24` | Expected ingestion cadence in hours. |
| `is_active` | `BOOLEAN` | Default: `TRUE` | Whether ingestion is currently active. |
| `last_refreshed_at` | `TIMESTAMPTZ` | NULLABLE | Timestamp of the last successful pipeline ingest. |
| `created_at` | `TIMESTAMPTZ` | Server Default `NOW()` | Registration timestamp. |
| `updated_at` | `TIMESTAMPTZ` | On Update `NOW()` | Modification timestamp. |

---

### 4. `ward_data_sources`
Association table tracking source attribution and data quality per ward.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `ward_id` | `VARCHAR` | Primary Key, FK -> `wards.ward_id` | Ward identifier. |
| `source_id` | `VARCHAR` | Primary Key, FK -> `data_sources.source_id` | Source identifier. |
| `ingested_at` | `TIMESTAMPTZ` | Server Default `NOW()` | Timestamp of ingestion. |
| `record_count` | `INTEGER` | Default: `0` | Number of observations ingested for this ward. |
| `is_cleaned` | `BOOLEAN` | Default: `FALSE` | Cleaning and validation flag. |
| `data_quality_score` | `FLOAT` | Default: `1.0` (0.0 - 1.0) | Completeness and fidelity score. |

---

### 5. `pipeline_runs`
Audit ledger of data pipeline execution runs.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `run_id` | `VARCHAR` | Primary Key, Indexed | Unique pipeline execution UUID. |
| `source_id` | `VARCHAR` | NULLABLE, FK -> `data_sources.source_id` | Specific source ID if single-source run. |
| `status` | `VARCHAR` | NOT NULL | `completed`, `failed`, `validation_failed`. |
| `records_ingested` | `INTEGER` | Default: `0` | Count of records read from sources. |
| `records_cleaned` | `INTEGER` | Default: `0` | Count of records sanitized and validated. |
| `records_dropped` | `INTEGER` | Default: `0` | Count of records rejected due to validation errors. |
| `duration_seconds` | `FLOAT` | Default: `0.0` | Execution elapsed wall-clock time in seconds. |
| `executed_at` | `TIMESTAMPTZ` | Server Default `NOW()` | Start timestamp. |
| `details` | `TEXT` | NULLABLE | JSON string with execution audit breakdown. |

---

## 📊 Core Indicators Specification

| Indicator Key | Full Name | Unit | Benchmarks & Thresholds | Normalization Formula | Stress Direction |
|---|---|---|---|---|---|
| `groundwater_depth_mbgl` | Depth to Groundwater Table | `mbgl` | Safe: <10m<br>Semi-Critical: 10-25m<br>Critical: 25-45m<br>Over-exploited: >45m | $\min(1.0, \text{depth} / 75.0)$ | Higher depth = Higher Stress |
| `piped_water_supply_lpcd` | Municipal Piped Water Distribution | `lpcd` | National Urban Standard: 135 LPCD<br>Deficit begins: <135 LPCD<br>Severe Crisis: <25 LPCD | If $\ge 135$: $0.0$<br>Else: $\min(1.0, \frac{135 - \text{lpcd}}{110})$ | Lower supply = Higher Stress |
| `rainfall_deficit_pct` | Precipitation Anomaly | `%` | Normal/Surplus: $\ge 0\%$<br>Deficient: $-20\%$ to $-59\%$<br>Scanty/Drought: $\le -60\%$ | If $\ge 0$: $0.0$<br>Else: $\min(1.0, \frac{\|\text{dep}\|}{60.0})$ | Higher deficit = Higher Stress |
| `tanker_dependency_index` | Commercial Tanker Reliance | `trips/k` | Low: 0 trips<br>Moderate: 1-3 trips/k<br>Severe: $\ge 6$ trips/k | $\min(1.0, \text{trips\_per\_k} / 6.0)$ | Higher reliance = Higher Stress |
| `water_body_coverage_pct` | Surface Lake & Water Retention Health | `%` | Healthy Buffer: $\ge 5.0\%$<br>Moderately Buffered: 1-4.9%<br>Vulnerable/Zero: $<1.0\%$ | If $\ge 5.0$: $0.0$<br>Else: $\min(1.0, \frac{5.0 - \text{cov}}{5.0})$ | Lower lake coverage = Higher Stress |
