"""Inventory the currently published Maharaja ADM2 selections and SVG groups."""
import csv
import gzip
import json
import re
import unicodedata
from collections import defaultdict
from pathlib import Path

from shapely.geometry import shape
from shapely.strtree import STRtree

ROOT = Path(__file__).resolve().parents[1]
MAP = ROOT / 'assets/map'
OUT = MAP / 'maharaja' / 'adm2-cakravala.csv'
manifest = json.loads((MAP / 'global/manifest.json').read_text())
membership = json.loads((MAP / 'maharaja/membership.json').read_text())
svg = list(csv.DictReader((MAP / 'maharaja/svg-membership.csv').open()))

def norm(value):
    value = unicodedata.normalize('NFKD', value or '')
    return re.sub('[^a-z0-9]', '', ''.join(c for c in value if not unicodedata.combining(c)).lower())

svg_names = defaultdict(list)
for item in svg:
    svg_names[(item['adm0_code'], item['cakravala_frame'])].append(item)

confirmed = json.loads((MAP / 'maharaja/confirmed-cakravala.json').read_text())
records = []
for code in sorted(membership['mapSelection']):
    selection = membership['mapSelection'][code]
    all_entity = selection == ['ADM0: entire entity']
    ids = None if all_entity else {item['id'] for item in selection}
    regional_path = MAP / f'{code}.geojson'
    if code in {'HKG', 'MAC'}:
        regional_path = MAP / 'SAR.geojson'
    region = json.loads(regional_path.read_text())['features']
    shapes = [shape(f['geometry']) for f in region]
    tree = STRtree(shapes)
    entry = manifest['countries'][code]
    for pack in entry.get('packs', [entry.get('pack')]):
        with gzip.open(MAP / 'global/packs' / pack, 'rt') as file:
            areas = json.load(file)[code]['features']
        for area in areas:
            p = area['properties']
            if ids is not None and p['id'] not in ids:
                continue
            geom = shape(area['geometry'])
            if not geom.is_valid:
                geom = geom.buffer(0)
            overlaps = defaultdict(float)
            best_feature = defaultdict(lambda: (0, None))
            for index in tree.query(geom):
                source = region[int(index)]
                score = geom.intersection(shapes[int(index)]).area
                if score <= 0:
                    continue
                group = source['properties']['cakravala']
                overlaps[group] += score
                if score > best_feature[group][0]:
                    best_feature[group] = (score, source['properties']['label'])
            group = max(overlaps, key=overlaps.get) if overlaps else ''
            ratio = overlaps[group] / geom.area if group and geom.area else 0
            nearest_distance = 0.0
            andaman = code == 'IND' and p.get('adm1') == 'IND_0001_V1'
            if andaman:
                # These SVG paths have no regional GeoJSON counterpart, but
                # explicitly name all three atlas districts in this frame.
                group = 'Nagara_Sri_Dharmaraja'
            if not group and shapes:
                nearest = int(tree.nearest(geom))
                group = region[nearest]['properties']['cakravala']
                nearest_distance = geom.distance(shapes[nearest])
            name = p.get('name') or ''
            candidates = [item for item in svg_names[(code, group)]
                          if norm(item['adm1_adm2_raw']).endswith(norm(name)) and norm(name)]
            if andaman and not candidates:
                candidates = [item for item in svg_names[(code, group)]
                              if norm(name.replace('&', 'and')) in norm(item['adm1_adm2_raw'])]
            if candidates:
                status = 'name_in_svg'
                svg_label = candidates[0]['svg_path_class']
            elif ratio:
                status = 'geometry_match_name_differs_or_level_differs'
                svg_label = best_feature[group][1] or ''
            else:
                status = 'no_svg_overlap_nearest_cakravala_review'
                nearest = int(tree.nearest(geom))
                svg_label = region[nearest]['properties']['label']
            confirmation = confirmed.get(p['id'])
            if confirmation:
                group = confirmation['cakravala']
            records.append((code, entry['name'], p.get('adm1') or '', p['id'], name,
                            group, status, svg_label, f'{min(ratio, 1):.4f}',
                            f'{nearest_distance:.4f}',
                            'user_confirmed' if confirmation else 'svg_derived'))

records.sort(key=lambda row: (row[0], row[5], row[4], row[3]))
with OUT.open('w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['adm0_code', 'country_name_in_web', 'adm1_id', 'adm2_id',
                     'adm2_name_in_web', 'cakravala_svg_frame', 'svg_name_status',
                     'svg_reference_label', 'cakravala_overlap_fraction',
                     'nearest_svg_distance_degrees', 'cakravala_assignment_status'])
    writer.writerows(records)
print('ADM2 rows:', len(records))
print('No SVG overlap, nearest frame for review:', sum(row[6] == 'no_svg_overlap_nearest_cakravala_review' for row in records))
print('Name in SVG:', sum(row[6] == 'name_in_svg' for row in records))
print('Output:', OUT)
