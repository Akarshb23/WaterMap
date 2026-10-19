# Karnataka District Boundary Verification — Priority 1 Report

**File inspected:** `backend/data/raw/karnataka_districts.geojson`

---

## 1. Source, publisher, coverage, date, and licensing

**Publisher / source.** The Karnataka district boundary file was derived from the **Esri India ArcGIS Living Atlas of India**, service **“IAB2024 / IAB_District_2024 (District Boundary)”**, item id `d2d6c22d2e5c4c3baff3d1330d4556e0`, endpoint:

- `https://livingatlas.esri.in/server/rest/services/IAB2024/IAB_District_2024/MapServer/0`

The Karnataka subset was retrieved with a query of the form:

- `where=upper(state)='KARNATAKA'`, full fields, geometry returned, output CRS 4326, format GeoJSON.

The provenance file `backend/data/raw/karnataka_districts.provenance.json` records the query and the source attributes carried over. The raw EPSG:4326 download from the service was retained as:

- `backend/data/raw/iab2024_karnataka_epsg4326_raw.geojson`

The derived file used by the app is:

- `backend/data/raw/karnataka_districts.geojson`

A legacy NWIC “733 India districts” Karnataka subset is also retained for traceability:

- `backend/data/raw/karnataka_districts_legacy_nwic_733india_epsg7755.geojson`

**Coverage.** Administrative boundaries of **Karnataka, India**. The file contains one feature per district. Many districts are MultiPolygons (islands, discontiguous parts, water-body holes), which is expected for administrative data.

**Publication / version date.** The provenance record states the boundary vintage is **2024**, reflecting current LGD status at that time. This includes **Vijayanagara district** (created 2021, carved out of Ballari) and the **Bengaluru South** name used after the 2023 renaming of Ramanagara. The GeoJSON itself does not embed a single authoritative publication date; the provenance record is the best available version indicator, not a certified issue date.

**Licensing and attribution.** The provenance record states that the Living Atlas service metadata does **not** publish an explicit license for the boundary data, and that only ArcGIS platform access terms apply from what is visible. The appropriate attribution is therefore:

- “Administrative boundaries derived from Esri India ArcGIS Living Atlas (IAB2024 / IAB_District_2024)”

with the explicit caveat that **license terms were not confirmed** before any redistribution. Before public or third-party use, the license status should be confirmed with Esri India / the publisher.

**Important caveat.** The file loading successfully and transforming correctly is **not** the same thing as saying the boundaries are officially verified. The authoritative upstream source is understood to be the Survey of India Administrative Boundary Database, and that source requires portal registration and could not be programmatically accessed here.

---

## 2. CRS verification

### Declared CRS in the file

The GeoJSON contains:

```json
{
  "type": "name",
  "properties": {
    "name": "urn:ogc:def:crs:EPSG::7755"
  }
}
```

That URN is **EPSG:7755**, i.e. **WGS 84 / India NSF LCC**, a projected CRS whose units are **metres** on both the easting and northing axes.

### Authoryitative CRS check

Using PyProj:

- `CRS.from_user_input("urn:ogc:def:crs:EPSG::7755")` resolves to **EPSG:7755**.
- `CRS.from_epsg(7755).is_geographic` is `False` — it is a projected CRS.
- Axis info for EPSG:7755 is Easting (X, east) and Northing (Y, north), with metre-length units.

So the declaration in the file is consistent with the EPSG registry definition: **EPSG:7755 = projected, metres**.

That matters for the next step: simplification tolerances and “metres” must be interpreted in the source CRS units, not in WGS84 degrees.

### Transformation method

The GeoJSON declares a source CRS of EPSG:7755, and the intended output for the browser map is **EPSG:4326 (WGS 84, longitude / latitude)**.

The transformation used is:

- PyProj `Transformer.from_crs(source_crs, target_crs, always_xy=True)`

That is the correct choice because:

- GeoJSON coordinates are **(longitude, latitude)**.
- The source projected coordinates are **(easting, northing)**.
- `always_xy=True` forces `(x, y)` order throughout, so the transform correctly treats the source as easting/northing and produces WGS84 as longitude/latitude.

The same `always_xy=True` convention is used in the backend route `backend/app/api/routes/map.py`, so the route and the verification are consistent.

### Transformation sanity result

After transforming all Karnataka features from EPSG:7755 to EPSG:4326:

- **WGS84 longitude extent:** ~74.0547°E to ~78.5877°E
- **WGS84 latitude extent:** ~11.5945°N to ~18.4778°N
- **All coordinates are inside Karnataka’s expected bbox.** No out-of-range coordinates were found.
- **All 31 transformed geometries are still valid and non-empty.**
- District centroids are in geographically plausible Karnataka locations (for example Bagalkote near 75.62°E/16.22°N, Bengaluru Urban near 77.59°E/12.95°N, Kalaburagi near 76.87°E/17.26°N, Vijayanagara near 76.19°E/14.89°N).

As a spatial sanity check, the **union** of all transformed Karnataka polygons covers about **191,805 km²**, which is very close to the commonly cited Karnataka extent of ~191,976 km² (a difference of ~171 km², about 0.09%). That small residual is consistent with normal administrative-boundary generalization and minor coastal/river/lake differences; it is a positive sanity indicator, not proof of authoritative accuracy.

So the CRS side checks out:

- Declared CRS = EPSG:7755, projected, metres — confirmed.
- Output CRS = EPSG:4326, lon/lat — confirmed.
- Transformation is valid and produces plausible Karnataka geography — confirmed.

---

## 3. Karnataka filtering method

Karnataka districts were selected using the **authoritative source attribute**, not by array position and not by guessing district names:

- `state = 'KARNATAKA'`

Every feature in `karnataka_districts.geojson` has:

- `state == "Karnataka"`
- `country == "India"`

The filtering check found:

- 31 Karnataka features
- 0 non-Karnataka features

So the filtering is reliable and attribute-based.

---

## 4. Geometry validation

**Identifiers.**

- 31 features
- 31 distinct district names
- 31 distinct `lgd_districtcode` values
- 31 distinct `uid` values
- No duplicate names, no duplicate LGD codes, no duplicate UIDs.

**Geometry health.**

- Empty geometries: **0**
- Invalid geometries (original, CRS 7755): **0**
- Invalid geometries (after transformation to WGS84): **0**
- MultiPolygons: **10 of 31** features — expected for real administrative districts.
- All transformed geometries remain valid and non-empty.

**Coordinate range.**

- Transformed coordinates all lie within Karnataka’s expected longitude/latitude bounds.
- No coordinates outside ~74.05–78.59°E / ~11.50–18.48°N.

**Spatial placement sanity.**

We tested whether the Karnataka bounding-box midpoint (~76.32°E, ~14.99°N) is inside each district’s largest transformed polygon. Only **Vijayanagara**’s largest polygon contains that midpoint; all other districts do not. That is exactly what we would expect from real administrative boundaries — a single interior point should fall inside one district, not all of them.

So the geometries are:

- syntactically valid,
- within Karnataka’s expected extent,
- geographically plausible,
- and not erroneously duplicated or swapped.

---

## 5. Expected vs actual Karnataka district count and names

**Expected current Karnataka district count:** 31. This is the post-2021 / post-2023 picture:

- Vijayanagara exists (created 2021 from Ballari).
- Ramanagara has been renamed **Bengaluru South** (2023).

**Actual count in the file:** 31.

**Names present:**

Bagalkote, Ballari, Belagavi, Bengaluru Rural, Bengaluru South, Bengaluru Urban, Bidar, Chamarajanagar, Chikkaballapura, Chikkamagaluru, Chitradurga, Dakshina Kannada, Davanagere, Dharwad, Gadag, Hassan, Haveri, Kalaburagi, Kodagu, Kolar, Koppal, Mandya, Mysuru, Raichur, Shivamogga, Tumakuru, Udupi, Uttara Kannada, Vijayanagara, Vijayapura, Yadgir.

**Comparison with the expected 31-district list:**

- Expected: 31 districts.
- Present in the file: 31 districts.
- Missing: **none**.
- Extra (not in the expected 31): **none**.
- Set of names matches the expected current 31-district Karnataka list **exactly**.

**Discrepancy note (explained, not ignored).** One verification script initially reported a spurious mismatch because it compared the current names against a legacy 30-district list using brittle string normalizations. Once the comparison is made against the proper current 31-district list, the file matches exactly. The legacy cross-check is only an informal explanatory aid; it is not the pass/fail criterion.

**Investigated discrepancy: Bagalkot vs Bagalkote.** The source properties show `lgd_districtname` value **Bagalkote** (with final 'e'). The working comparison uses the current authoritative name as **Bagalkote** in the present file. No rename was applied; this is the value present on disk.

**Discrepancies to report explicitly:**

- The file uses **Bengaluru South**, not **Ramanagara** — consistent with the 2023 rename.
- The file includes **Vijayanagara** — consistent with the 2021 creation.
- The source gives the northern district as **Bagalkote** (spelling used in the file). No silent correction was made.
- A legacy 30-district Karnataka subset is kept separately for traceability (`karnataka_districts_legacy_nwic_733india_epsg7755.geojson`); it does not include Vijayanagara.

We **report** these as intended vintage differences, and we do **not** delete or invent districts to force a match.

---

## 6. Transformed coordinates: valid WGS84 lon/lat and geographically correct?

**Yes, on the evidence available.**

- The transformed coordinates are valid EPSG:4326 longitude/latitude.
- All are inside Karnataka’s expected bounding box.
- District centroids are in plausible Karnataka locations.
- The union area is very close to Karnataka’s expected extent.
- The midpoint sanity check reinforces that the polygons really are arranged as Karnataka districts should be.

So the transformed boundaries **appear to be in their correct geographic locations**. This is an internal-consistency and spatial-plausibility conclusion, not an official Survey-of-India certification.

---

## 7. Documentation of source CRS, output CRS, provenance, transformation method, validation results, and unresolved concerns

### Source CRS

- Declared: `urn:ogc:def:crs:EPSG::7755`
- Resolved: EPSG:7755
- Type: projected (not geographic)
- Units: metres (easting, northing)

### Output CRS

- EPSG:4326 (WGS 84), longitude/latitude

### Source provenance

- Provider: Esri India ArcGIS Living Atlas of India
- Service: IAB2024 / IAB_District_2024 (District Boundary)
- Item id: `d2d6c22d2e5c4c3baff3d1330d4556e0`
- Query: `where=upper(state)='KARNATAKA'`, full fields, geometry, outSR 4326, GeoJSON
- Attributes carried over unchanged: `lgd_districtcode`, `lgd_districtname`, `lgd_statecode`, `censusname`, `censuscode2011`, `dist_locallang`, `level_2011`, plus `state`, `country`, `uid`, `objectid`, and the `st_area(shape)` / `st_perimeter(shape)` / `premiumdata.sde.DistrictBoundary26.area` metadata fields.
- Raw EPSG:4326 download retained: `data/raw/iab2024_karnataka_epsg4326_raw.geojson`
- Retrieval date recorded in provenance: 2026-10-19

### Transformation method

- Library: PyProj
- Source → target: EPSG:7755 → EPSG:4326
- Axis handling: `always_xy=True`
- Simplification: applied in the source CRS units (metres) before transformation, with topology preserved (`preserve_topology=True`), at a 100 m tolerance in `backend/app/api/routes/map.py`. The simplification gate is: source CRS is projected (not geographic), has axis_info, and all first-two axes use metre units (unit_conversion_factor == 1.0 ± 1e-9). This prevents applying a metre tolerance to longitude/latitude input.
- Validation measurements (based on the current dataset):
    - Original vertices: 446,598
    - Simplified vertices: 21,377
    - Vertex reduction: 95.21%
    - Original GeoJSON size: 18,312,234 bytes (~18.3 MB)
    - Simplified GeoJSON size: 872,152 bytes (~0.87 MB)
    - Size reduction: 95.24%
    - Processing time (without caching): 4.53 seconds

### Validation results

- 31 features in file
- All Karnataka, no non-Karnataka
- 31 unique names, 31 unique LGD codes, 31 unique UIDs
- 0 empty geometries
- 0 invalid geometries (original and after transformation)
- 10 MultiPolygons (expected)
- All transformed coords inside Karnataka bbox
- Plausible centroids
- Union area ≈191,805 km² vs ≈191,976 km² expected (~0.09% difference)
- 31 districts present, matches the expected current 31-district Karnataka list exactly

### Unresolved concerns

- No authoritative Survey of India polygon-level overlay was performed; SOI access requires portal registration.
- No explicit license is published in the service metadata; only ArcGIS platform access terms are visible.
- The “2024 boundaries” vintage is the best available indicator, not a certified issue date.
- The boundaries should not be described as officially verified merely because they load or transform correctly.

---

## Reproducibility

The checks above are reproducible from:

- `backend/scratch/verify_crs.py`
- `backend/scratch/verify_boundaries.py`

Both can be re-run from the repository to confirm the numbers in this document.

---

*End of Priority 1 report.*
