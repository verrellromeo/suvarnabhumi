#!/usr/bin/env python3
"""Extract the latest UNICEF GeoRepo ADM2 snapshot into country partitions.

Input: https://unidatadapmclimatechange.blob.core.windows.net/public/georepo/adm2.geojson
The published input is line-delimited features inside a FeatureCollection.
Run mapshaper topology simplification on the partitions before committing output.
"""
import argparse
import json
from collections import Counter
from pathlib import Path


def extract(source: Path, destination: Path):
    destination.mkdir(parents=True, exist_ok=True)
    handles = {}
    counts = Counter()
    try:
        with source.open(encoding="utf-8") as stream:
            for line in stream:
                if not line.startswith('{"type": "Feature",'):
                    continue
                feature = json.loads(line.rstrip().rstrip(","))
                props = feature["properties"]
                if props.get("is_latest") is not True:
                    continue
                country = (props.get("adm0_ucode") or "").split("_")[0]
                if not country or not country.isalnum():
                    continue
                feature["properties"] = {
                    "id": props["ucode"], "name": props.get("name_en") or props.get("name"),
                    "adm1": props.get("adm1_ucode"), "country": country,
                }
                if country not in handles:
                    handle = (destination / f"{country}.geojson").open("w", encoding="utf-8")
                    handle.write('{"type":"FeatureCollection","features":[')
                    handles[country] = handle
                handle = handles[country]
                if counts[country]:
                    handle.write(",")
                json.dump(feature, handle, ensure_ascii=False, separators=(",", ":"))
                counts[country] += 1
    finally:
        for handle in handles.values():
            handle.write("]}")
            handle.close()
    (destination / "counts.json").write_text(json.dumps(dict(sorted(counts.items())), indent=2) + "\n")
    print(f"{sum(counts.values())} latest features in {len(counts)} entities")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    args = parser.parse_args()
    extract(args.source, args.destination)
