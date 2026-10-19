"""Build clipped facility-density grid cells for Chart 2.

The script groups facilities into 0.05-degree cells (roughly 4–5 km around
Melbourne), then clips each occupied cell to the union of the 31 study LGAs.
It requires Shapely for the offline preprocessing step only; the published
website consumes the generated GeoJSON directly.
"""

from __future__ import annotations

import json
import math
from collections import defaultdict
from pathlib import Path

from shapely import from_geojson, set_precision
from shapely.geometry import box, mapping
from shapely.ops import unary_union


ROOT = Path(__file__).resolve().parents[1]
POINTS_PATH = ROOT / "data" / "facility_points.geojson"
BOUNDARY_PATH = ROOT / "data" / "lga_access.geojson"
OUTPUT_PATH = ROOT / "data" / "facility_density_grid.geojson"
GRID_STEP = 0.05


def load_json(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as source:
        return json.load(source)


def main() -> None:
    facilities = load_json(POINTS_PATH)["features"]
    lgas = load_json(BOUNDARY_PATH)["features"]

    study_boundary = unary_union(
        [from_geojson(json.dumps(feature["geometry"])) for feature in lgas]
    )

    bin_counts: dict[tuple[str, int, int], int] = defaultdict(int)
    for feature in facilities:
        longitude, latitude = feature["geometry"]["coordinates"]
        category = feature["properties"]["facility_category"]
        x_index = math.floor(longitude / GRID_STEP)
        y_index = math.floor(latitude / GRID_STEP)
        bin_counts[(category, x_index, y_index)] += 1

    output_features = []
    for (category, x_index, y_index), count in sorted(bin_counts.items()):
        west = round(x_index * GRID_STEP, 8)
        east = round(west + GRID_STEP, 8)
        south = round(y_index * GRID_STEP, 8)
        north = round(south + GRID_STEP, 8)

        clipped_cell = box(west, south, east, north).intersection(study_boundary)
        if clipped_cell.is_empty:
            raise ValueError(
                f"Occupied cell {category} {west},{south} does not intersect the study boundary"
            )

        clipped_cell = set_precision(clipped_cell, 0.000001, mode="valid_output")
        output_features.append(
            {
                "type": "Feature",
                "properties": {
                    "facility_category": category,
                    "facility_count": count,
                    "grid_west": west,
                    "grid_east": east,
                    "grid_south": south,
                    "grid_north": north,
                },
                "geometry": mapping(clipped_cell),
            }
        )

    output = {
        "type": "FeatureCollection",
        "name": "facility_density_grid",
        "description": (
            "Occupied 0.05-degree facility grid cells clipped to the union of "
            "the 31 metropolitan Melbourne study LGAs."
        ),
        "grid_step_degrees": GRID_STEP,
        "features": output_features,
    }

    with OUTPUT_PATH.open("w", encoding="utf-8", newline="\n") as target:
        json.dump(output, target, ensure_ascii=False, separators=(",", ":"))
        target.write("\n")

    print(f"Wrote {len(output_features)} clipped grid features to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
