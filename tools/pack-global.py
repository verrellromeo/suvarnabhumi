#!/usr/bin/env python3
"""Package topology-simplified country GeoJSON into small browser-loadable gzip shards."""
import gzip
import json
from pathlib import Path

base = Path("assets/map/global")
manifest = json.loads((base / "manifest.json").read_text())
packs = base / "packs"
packs.mkdir(exist_ok=True)
for old in packs.glob("*.gz"):
    old.unlink()
for old in base.glob("world-*.json.gz"):
    old.unlink()

def compressed(obj):
    return gzip.compress(json.dumps(obj, ensure_ascii=False, separators=(",", ":")).encode(), compresslevel=9, mtime=0)

for letter in sorted({code[0] for code in manifest["countries"]}):
    group = {}
    index = 0
    def flush():
        global group, index
        if group:
            name = f"{letter}{index}.json.gz"
            (packs / name).write_bytes(compressed(group))
            for code in group:
                manifest["countries"][code]["pack"] = name
            group = {}
            index += 1
    for code in sorted(manifest["countries"]):
        if code[0] != letter:
            continue
        data = json.loads((base / f"{code}.geojson").read_text())
        assert len(data["features"]) == manifest["countries"][code]["count"], code
        if group and len(compressed({**group, code: data})) > 350_000:
            flush()
        group[code] = data
    flush()

world = json.loads((base / "world.geojson").read_text())
world_files = []
group = []
for feature in world["features"]:
    item = {"type": "FeatureCollection", "features": group + [feature]}
    if group and len(compressed(item)) > 350_000:
        name = f"world-{len(world_files)}.json.gz"
        (base / name).write_bytes(compressed({"type": "FeatureCollection", "features": group}))
        world_files.append(name)
        group = []
    group.append(feature)
if group:
    name = f"world-{len(world_files)}.json.gz"
    (base / name).write_bytes(compressed({"type": "FeatureCollection", "features": group}))
    world_files.append(name)
manifest["worldPacks"] = world_files
(base / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, separators=(",", ":")))
print(len(list(packs.iterdir())), "country packs;", len(world_files), "world packs")
