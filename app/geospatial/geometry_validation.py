from typing import Any, Dict, List


class GeometryValidator:
    def validate(self, geometry: Dict[str, Any]) -> Dict[str, Any]:
        errors: List[str] = []

        if not isinstance(geometry, dict):
            return {
                "valid": False,
                "errors": ["Geometry must be a dictionary / JSON object"],
                "geometry": geometry,
            }

        geom_type = geometry.get("type")
        if not geom_type:
            errors.append("Missing geometry 'type'")
        elif geom_type not in ["Polygon", "MultiPolygon", "Point"]:
            errors.append(f"Unsupported geometry type: '{geom_type}' (expected Polygon or MultiPolygon)")

        coords = geometry.get("coordinates")
        if coords is None:
            errors.append("Missing 'coordinates' field")
        elif not isinstance(coords, list):
            errors.append("'coordinates' must be a list")
        elif geom_type == "Polygon":
            if len(coords) == 0:
                errors.append("Polygon has empty coordinates array")
            else:
                ring = coords[0]
                if not isinstance(ring, list) or len(ring) < 4:
                    errors.append("Polygon outer ring must contain at least 4 coordinate pairs")
                else:
                    # Validate coordinate values
                    for pt in ring:
                        if not isinstance(pt, (list, tuple)) or len(pt) < 2:
                            errors.append(f"Invalid coordinate point: {pt}")
                            break
                        lon, lat = pt[0], pt[1]
                        if not (-180.0 <= lon <= 180.0 and -90.0 <= lat <= 90.0):
                            errors.append(f"Coordinates out of range: lon={lon}, lat={lat}")
                            break

                    # Check closure
                    if ring[0] != ring[-1]:
                        # Warning / minor error
                        errors.append("Polygon ring is not closed (first vertex != last vertex)")

        return {
            "valid": len(errors) == 0,
            "errors": errors,
            "geometry": geometry,
        }

