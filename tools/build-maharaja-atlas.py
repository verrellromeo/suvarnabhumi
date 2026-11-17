#!/usr/bin/env python3
"""Build the Maharaja Mandala map from open regional layers and SVG frame names.

Usage: python tools/build-maharaja-atlas.py path/to/maharaja.svg
"""
import gzip
import hashlib
import json
import sys
import xml.etree.ElementTree as ET
from collections import defaultdict
from pathlib import Path
from shapely.geometry import mapping, shape
from shapely.ops import unary_union

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets/map/maharaja"
PACKS = OUT / "cakravalas"
NS = "{http://www.w3.org/2000/svg}"
COUNTRY_NAMES = {"BGD": "Bangladesh", "BRN": "Brunei", "CHN": "China", "IDN": "Indonesia", "IND": "India", "JPN": "Japan", "KHM": "Cambodia", "LAO": "Laos", "MMR": "Myanmar", "MYS": "Malaysia", "PHL": "Philippines", "SGP": "Singapore", "TLS": "Timor-Leste", "THA": "Thailand", "TWN": "Taiwan", "VNM": "Vietnam"}
ADMIN_LEVELS = {"PHL": "ADM3", "SGP": "ADM1", "TWN": "ADM1", "SAR": "ADM1"}


def main(svg_path):
    root = ET.parse(svg_path).getroot()
    outer = next((node for node in root.iter(f"{NS}g") if "maharaja_mandala_contrast_no_holes" in node.get("class", "")), None)
    if outer is None:
        raise ValueError("Maharaja Mandala SVG group not found")
    svg_frames = set()
    for group in outer.findall(f"{NS}g"):
        frame = group.get("class", "").split()[0]
        svg_frames.add(frame)
    if len(svg_frames) != 29:
        raise ValueError(f"Expected 29 Cakravala frames, found {len(svg_frames)}")

    features = []
    for file in sorted((ROOT / "assets/map").glob("*.geojson")):
        code = file.stem
        if code == "world":
            continue
        data = json.loads(file.read_text(encoding="utf-8"))
        for index, feature in enumerate(data["features"], start=1):
            original = feature["properties"]
            frame = original.get("cakravala")
            if frame not in svg_frames:
                raise ValueError(f"Missing SVG frame for {code} feature {original.get('label')}: {frame}")
            label = original.get("label") or original.get("name") or f"{code} area {index}"
            country = original.get("sourceCountry") or code
            identifier = "REG-" + hashlib.sha1(f"{country}\0{code}\0{frame}\0{label}\0{index}".encode()).hexdigest()[:16]
            adm1, _, name = label.partition(" · ")
            features.append({"type": "Feature", "id": identifier, "properties": {
                "id": identifier, "name": name or label, "label": label, "adm1": adm1 if name else "",
                "country": country, "countryName": COUNTRY_NAMES.get(country, country), "adminLevel": original.get("administrativeLevel") or ADMIN_LEVELS.get(code, "ADM2"), "mandala": "Maharaja Mandala",
                "cakravala": frame, "svgFrame": frame, "source": "Regional source layer",
                "matchConfidence": original.get("matchConfidence"),
            }, "geometry": feature["geometry"]})
    if len({feature["properties"]["id"] for feature in features}) != len(features):
        raise ValueError("Duplicate area IDs")
    frames = sorted({feature["properties"]["cakravala"] for feature in features})
    if len(frames) != 29:
        raise ValueError(f"Expected all 29 frames in map data; found {len(frames)}")

    frame_geometries = defaultdict(list)
    frame_counts = defaultdict(int)
    for feature in features:
        frame = feature["properties"]["cakravala"]
        geometry = shape(feature["geometry"])
        if not geometry.is_valid:
            geometry = geometry.buffer(0)
        frame_geometries[frame].append(geometry)
        frame_counts[frame] += 1
    cakravala_features = []
    for frame in frames:
        merged = unary_union(frame_geometries[frame])
        if not merged.is_valid:
            merged = merged.buffer(0)
        cakravala_features.append({"type": "Feature", "id": f"CAK-{frame}", "properties": {
            "id": f"CAK-{frame}", "name": frame, "mandala": "Maharaja Mandala",
            "cakravala": frame, "count": frame_counts[frame], "source": "Dissolved regional ADM boundaries",
        }, "geometry": mapping(merged)})
    OUT.mkdir(parents=True, exist_ok=True)
    PACKS.mkdir(parents=True, exist_ok=True)
    for old in PACKS.glob("*.json.gz"):
        old.unlink()
    for old in OUT.glob("boundaries*.json.gz"):
        old.unlink()
    grouped = defaultdict(list)
    for feature in features:
        grouped[feature["properties"]["cakravala"]].append(feature)
    manifest = {"mandala": "Maharaja Mandala", "total": len(features), "cakravalaCount": len(frames), "boundaryPacks": [], "cakravalas": {}}
    for frame in frames:
        pack_name = f"{frame}.json.gz"
        packed = {"type": "FeatureCollection", "name": frame, "features": grouped[frame]}
        encoded = json.dumps(packed, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        (PACKS / pack_name).write_bytes(gzip.compress(encoded, compresslevel=9, mtime=0))
        manifest["cakravalas"][frame] = {"count": len(grouped[frame]), "pack": f"cakravalas/{pack_name}"}
    boundary_group = []
    def write_boundary_pack(items):
        boundary_collection = {"type": "FeatureCollection", "name": "Maharaja Mandala Cakravala boundaries", "features": items}
        boundary_bytes = json.dumps(boundary_collection, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        filename = f"boundaries-{len(manifest['boundaryPacks'])}.json.gz"
        (OUT / filename).write_bytes(gzip.compress(boundary_bytes, compresslevel=9, mtime=0))
        manifest["boundaryPacks"].append(filename)
    for feature in cakravala_features:
        candidate = boundary_group + [feature]
        candidate_bytes = json.dumps({"type": "FeatureCollection", "features": candidate}, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        if boundary_group and len(gzip.compress(candidate_bytes, compresslevel=9, mtime=0)) > 250_000:
            write_boundary_pack(boundary_group)
            boundary_group = []
        boundary_group.append(feature)
    if boundary_group:
        write_boundary_pack(boundary_group)
    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, separators=(",", ":")))
    legacy = ROOT / "assets/map/maharaja-mandala.json.gz"
    legacy.unlink(missing_ok=True)
    packed_bytes = sum(path.stat().st_size for path in PACKS.glob("*.json.gz")) + sum((OUT / name).stat().st_size for name in manifest["boundaryPacks"])
    print(f"Wrote {OUT.relative_to(ROOT)}: {len(features):,} areas in {len(frames)} Cakravalas ({packed_bytes:,} bytes compressed)")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Usage: build-maharaja-atlas.py <maharaja.svg>")
    main(Path(sys.argv[1]))
