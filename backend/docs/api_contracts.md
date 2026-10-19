# 🔌 WaterMap API Contracts

The WaterMap API provides RESTful access to urban water stress intelligence, ward demographics, geospatial GeoJSON layers, and data source governance.

---

## 📌 Endpoints Summary

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/health` | Service health check | `200` |
| `GET` | `/dashboard` | Citywide dashboard aggregates & top critical wards | `200` |
| `GET` | `/wards` | List wards with optional filtering, sorting, & search | `200` |
| `GET` | `/wards/{ward_id}` | Detailed ward profile with geometry & latest indicators | `200`, `404` |
| `GET` | `/wards/{ward_id}/indicators` | All indicators recorded for a specific ward | `200`, `404` |
| `GET` | `/wards/{ward_id}/indicators/{metric}` | Historical / specific metric readings for a ward | `200`, `404` |
| `GET` | `/map/layers` | List available map layers with summary | `200` |
| `GET` | `/map/geojson` | Complete GeoJSON FeatureCollection for interactive maps | `200` |
| `GET` | `/map/wards/{ward_id}` | Single ward geometry in GeoJSON Polygon format | `200`, `404` |
| `GET` | `/map/lookup` | Point-in-polygon spatial lookup (`?lat=...&lon=...`) | `200` |
| `GET` | `/data-sources` | List all registered data sources | `200` |
| `POST` | `/data-sources` | Register a new data source | `201` |
| `GET` | `/data-sources/{source_id}` | Retrieve specific data source metadata | `200`, `404` |
| `GET` | `/methodology` | Indicator definitions, weights, and scoring framework | `200` |

---

## 📝 Detailed Endpoints

### 1. Health Check
`GET /health`

**Response (`200 OK`)**
```json
{
  "status": "ok"
}
```

---

### 2. Dashboard Summary
`GET /dashboard`

**Response (`200 OK`)**
```json
{
  "total_wards": 25,
  "healthy_wards": 7,
  "warning_wards": 10,
  "critical_wards": 8,
  "last_updated": "2026-10-17T06:08:10.133000Z",
  "city_avg_stress_index": 0.548,
  "risk_distribution": {
    "low": 7,
    "moderate": 10,
    "high": 3,
    "critical": 5
  },
  "top_critical_wards": [
    {
      "ward_id": "W004",
      "name": "Whitefield",
      "water_stress_index": 0.91,
      "risk_category": "critical",
      "population": 88200
    },
    {
      "ward_id": "W003",
      "name": "Bellandur",
      "water_stress_index": 0.88,
      "risk_category": "critical",
      "population": 94500
    }
  ]
}
```

---

### 3. List Wards
`GET /wards`

**Query Parameters**
- `district` (`string`, optional): Filter by district name.
- `zone` (`string`, optional): Filter by administrative zone (e.g., `Mahadevapura`, `South`).
- `risk_category` (`string`, optional): `low`, `moderate`, `high`, `critical`.
- `min_stress` (`float`, optional): Minimum water stress index (0.0 to 1.0).
- `max_stress` (`float`, optional): Maximum water stress index (0.0 to 1.0).
- `search` (`string`, optional): Substring search across name, ID, and zone.
- `limit` (`int`, optional): Pagination limit.
- `offset` (`int`, optional): Pagination offset.

**Response (`200 OK`)**
```json
[
  {
    "ward_id": "W001",
    "name": "Koramangala",
    "district": "Bengaluru Urban",
    "zone": "South",
    "population": 52400,
    "area_sqkm": 6.85,
    "water_stress_index": 0.45,
    "risk_category": "moderate",
    "centroid_lat": 12.9352,
    "centroid_lon": 77.6245
  }
]
```

---

### 4. Ward Detail
`GET /wards/{ward_id}`

**Response (`200 OK`)**
```json
{
  "ward_id": "W001",
  "name": "Koramangala",
  "district": "Bengaluru Urban",
  "zone": "South",
  "population": 52400,
  "area_sqkm": 6.85,
  "water_stress_index": 0.45,
  "risk_category": "moderate",
  "centroid_lat": 12.9352,
  "centroid_lon": 77.6245,
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[77.61, 12.92], [77.64, 12.92], [77.64, 12.95], [77.61, 12.95], [77.61, 12.92]]]
  },
  "indicators": [
    {
      "indicator_id": "IND-W001-groundwater_depth_mbgl",
      "metric": "groundwater_depth_mbgl",
      "value": 28.5,
      "unit": "mbgl",
      "normalized_value": 0.38,
      "source_id": "DS001",
      "recorded_at": "2024-09-30T00:00:00Z"
    }
  ]
}
```

---

### 5. Map GeoJSON Layer
`GET /map/geojson?layer=ward_boundaries`

**Response (`200 OK`)**
```json
{
  "type": "FeatureCollection",
  "layer": "ward_boundaries",
  "ward_count": 25,
  "bounds": {
    "minx": 77.53,
    "miny": 12.83,
    "maxx": 77.77,
    "maxy": 13.12
  },
  "features": [
    {
      "type": "Feature",
      "id": "W001",
      "properties": {
        "ward_id": "W001",
        "name": "Koramangala",
        "district": "Bengaluru Urban",
        "population": 52400,
        "water_stress_index": 0.45,
        "risk_category": "moderate",
        "indicators": {
          "groundwater_depth_mbgl": {
            "raw_value": 28.5,
            "unit": "mbgl",
            "normalized_value": 0.38
          }
        }
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [...]
      }
    }
  ]
}
```

---

### 6. Spatial Coordinate Lookup
`GET /map/lookup?lat=12.9352&lon=77.6245`

**Response (`200 OK`)**
```json
{
  "matched_ward_id": "W001",
  "ward_name": "Koramangala",
  "district": "Bengaluru Urban",
  "zone": "South",
  "confidence": 1.0,
  "is_inside": true,
  "distance_km": 0.0,
  "water_stress_index": 0.45,
  "risk_category": "moderate"
}
```


## Supported cities

`GET /api/v1/cities` returns the cities represented by the currently loaded ward dataset. The supplied dataset is Bengaluru; the frontend should not offer other cities until their ward boundaries and indicators have been ingested.
