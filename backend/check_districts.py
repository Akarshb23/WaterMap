import json
from pathlib import Path
from app.api.routes.map import _normalize_properties, _get_district_name, _get_state_name, _get_district_code, _load_district_boundaries

DISTRICT_GEOJSON_PATH = Path(__file__).parent / "data" / "raw" / "karnataka_districts.geojson"

def main():
    collection, _, _ = _load_district_boundaries(DISTRICT_GEOJSON_PATH)

    # We'll collect the properties of interest
    district_names = []
    lgd_codes = []
    uids = []

    for original in collection["features"]:
        if not isinstance(original, dict):
            continue
        geometry_data = original.get("geometry")
        if not isinstance(geometry_data, dict):
            continue

        properties = _normalize_properties(original.get("properties") or {})
        state_name = _get_state_name(properties)
        if state_name not in {"karnataka", "ಕರ್ನಾಟಕ"}:
            continue

        district_name = _get_district_name(properties)
        if not district_name:
            continue

        district_code = _get_district_code(properties)
        # UID might be in the properties as 'uid'
        uid = properties.get('uid', '')

        district_names.append(district_name)
        lgd_codes.append(district_code)
        uids.append(uid)

    print(f"Total districts found: {len(district_names)}")
    print(f"Unique district names: {len(set(district_names))}")
    print(f"Unique LGD codes: {len(set(lgd_codes))}")
    print(f"Unique UIDs: {len(set(uids))}")

    # Check for duplicates
    def find_duplicates(lst):
        seen = set()
        duplicates = set()
        for item in lst:
            if item in seen:
                duplicates.add(item)
            else:
                seen.add(item)
        return list(duplicates)

    dup_names = find_duplicates(district_names)
    dup_codes = find_duplicates(lgd_codes)
    dup_uids = find_duplicates(uids)

    if dup_names:
        print(f"Duplicate district names: {dup_names}")
    else:
        print("No duplicate district names.")

    if dup_codes:
        print(f"Duplicate LGD codes: {dup_codes}")
    else:
        print("No duplicate LGD codes.")

    if dup_uids:
        print(f"Duplicate UIDs: {dup_uids}")
    else:
        print("No duplicate UIDs.")

    # Check for missing values (empty strings or None)
    missing_names = [name for name in district_names if not name]
    missing_codes = [code for code in lgd_codes if not code]
    missing_uids = [uid for uid in uids if not uid]

    if missing_names:
        print(f"Missing district names: {missing_names}")
    else:
        print("No missing district names.")

    if missing_codes:
        print(f"Missing LGD codes: {missing_codes}")
    else:
        print("No missing LGD codes.")

    if missing_uids:
        print(f"Missing UIDs: {missing_uids}")
    else:
        print("No missing UIDs.")

    # Specifically check for Bagalkot vs Bagalkote
    bagalkote_variants = [name for name in district_names if 'bagalkot' in name.lower()]
    print(f"Variants of Bagalkot found: {bagalkote_variants}")

    # Expected list of 31 districts (from the README)
    expected_districts = [
        "Bagalkote", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru South",
        "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapura",
        "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere",
        "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar",
        "Koppal", "Mandya", "Mysuru", "Raichur", "Shivamogga", "Tumakuru",
        "Udupi", "Uttara Kannada", "Vijayanagara", "Vijayapura", "Yadgir"
    ]

    missing_from_expected = set(expected_districts) - set(district_names)
    extra_in_file = set(district_names) - set(expected_districts)

    if missing_from_expected:
        print(f"Districts missing from expected list: {missing_from_expected}")
    else:
        print("All expected districts are present.")

    if extra_in_file:
        print(f"Extra districts in file not in expected list: {extra_in_file}")
    else:
        print("No extra districts in file.")

if __name__ == "__main__":
    main()