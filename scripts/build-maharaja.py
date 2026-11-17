"""Build the Maharaja footprint from the SVG membership and existing atlas geometry."""
import csv
import gzip
import json
from collections import defaultdict
from pathlib import Path

from lxml import etree
from shapely.geometry import MultiPolygon, Polygon, mapping, shape
from shapely.ops import unary_union

ROOT = Path(__file__).resolve().parents[1]
SVG = ROOT.parent / 'upload/Southeast Asia (Maharaja Mandala)(5).svg'
OUT = ROOT / 'assets/map/maharaja'
OUT.mkdir(parents=True, exist_ok=True)
MANIFEST = json.loads((ROOT / 'assets/map/global/manifest.json').read_text())
FULL = {'BRN', 'KHM', 'LAO', 'MYS', 'MMR', 'PHL', 'SGP', 'THA', 'TLS', 'VNM', 'TWN', 'HKG', 'MAC'}
PARTIAL = {'IDN', 'CHN', 'IND', 'BGD', 'JPN'}
NAMES = {'Philippines':'PHL','Thailand':'THA','Vietnam':'VNM','Cambodia':'KHM','Laos':'LAO','Malaysia':'MYS','Myanmar':'MMR','Indonesia':'IDN','Brunei':'BRN','Singapore':'SGP','Timor-Leste':'TLS','Taiwan':'TWN','China':'CHN','India':'IND','Bangladesh':'BGD','Japan':'JPN','Hong_Kong':'HKG','Macau':'MAC'}

tree = etree.parse(str(SVG))
rows = []
for frame in tree.getroot().xpath('./*[local-name()="g"]/*[local-name()="g"]'):
    group = frame.get('class')
    for node in frame.xpath('.//*[local-name()="path"]'):
        label = node.get('class')
        if not label:
            continue
        prefix = group + '_'
        if not label.startswith(prefix):
            continue
        remainder = label[len(prefix):]
        match = next(((name,code) for name,code in sorted(NAMES.items(),key=lambda kv:-len(kv[0])) if remainder.startswith(name+'_')), None)
        if not match:
            continue
        name, code = match
        parts = remainder[len(name)+1:].split('_')
        rows.append((group,code,name,parts[0] if parts else '', '_'.join(parts[1:]),remainder[len(name)+1:],label))

with (OUT/'svg-membership.csv').open('w',newline='') as f:
    writer=csv.writer(f);writer.writerow(['cakravala_frame','adm0_code','adm0_svg','adm1_first_token','remaining_tokens','adm1_adm2_raw','svg_path_class']);writer.writerows(rows)

world=[]
for pack in MANIFEST['worldPacks']:
    with gzip.open(ROOT/'assets/map/global'/pack,'rt') as f:
        world.extend(json.load(f)['features'])

features=[]
selected=defaultdict(list)
world_by_code={f['properties']['country']:shape(f['geometry']) for f in world}
for code in sorted(FULL):
    polygons=[world_by_code[code]] if code in world_by_code else []
    if not polygons:
        raise RuntimeError('Missing ADM0: '+code)
    features.extend(polygons)
    selected[code]=['ADM0: entire entity']

for code in sorted(PARTIAL):
    # Earlier SVG matching produced these per-country selection geometries. Match
    # their area back to the site's current ADM2 polygons to avoid mixed seams.
    regional=json.loads((ROOT/'assets/map'/f'{code}.geojson').read_text())
    footprint=unary_union([shape(f['geometry']) for f in regional['features']])
    entry=MANIFEST['countries'][code]
    areas=[]
    for pack in entry.get('packs',[entry.get('pack')]):
        with gzip.open(ROOT/'assets/map/global/packs'/pack,'rt') as f:
            areas.extend(json.load(f)[code]['features'])
    for area in areas:
        geom=shape(area['geometry'])
        if geom.is_empty or not geom.is_valid:
            geom=geom.buffer(0)
        p=area['properties']
        adm1=p.get('adm1')
        # Whole island groups must not be cut by the older SVG's mismatched
        # district names. These codes are the ADM1 groups in this atlas.
        complete_island=(
            code=='IDN' and adm1 not in {'IDN_0031_V1','IDN_0032_V1','IDN_0033_V1','IDN_0034_V1'}
            or code=='IND' and adm1 in {'IND_0001_V1',
                'IND_0021_V1','IND_0023_V1','IND_0024_V1','IND_0032_V1'}
            or code=='BGD' and adm1=='BGD_0002_V1'
        )
        if complete_island or (geom.area and footprint.intersects(geom) and footprint.intersection(geom).area/geom.area >= .45):
            features.append(geom)
            selected[code].append({'id':p['id'],'adm1':adm1,'adm2':p.get('name')})

merged=unary_union(features)
if not merged.is_valid:
    merged=merged.buffer(0)
# Independent country and ADM2 simplification creates thin slivers at shared
# borders. Close sub-kilometre seams on this display-only footprint.
merged=merged.buffer(.008, join_style=2).buffer(-.008, join_style=2)
# Remaining enclosed gaps are small artifacts between independently reduced
# polygons, not intended exclusions from the Mandala.
pieces=merged.geoms if isinstance(merged, MultiPolygon) else [merged]
merged=MultiPolygon([Polygon(p.exterior,[ring for ring in p.interiors if Polygon(ring).area >= .03]) for p in pieces])
# Keep coastlines detailed while removing microscopic ring artifacts.
result={'type':'FeatureCollection','features':[{'type':'Feature','properties':{'name':'Maharaja Mandala'},'geometry':mapping(merged)}]}
with gzip.open(OUT/'boundary.geojson.gz','wt',compresslevel=9) as f:
    json.dump(result,f,separators=(',',':'))
summary={'svgSource':SVG.name,'svgFrames':len(tree.getroot().xpath('./*[local-name()="g"]/*[local-name()="g"]')),'svgPathsParsed':len(rows),'fullAdm0':sorted(FULL),'partialAdm0':sorted(PARTIAL),'mapSelection':dict(selected),'note':'Whole Indonesian western/central island ADM1 groups, Andaman and SVG-covered northeast Indian ADM1 groups, and Chittagong ADM1 are included in full; other partial districts use at least 45% overlap. Display geometry closes narrow source seams by 0.008 degrees. SVG raw labels remain in CSV.'}
(OUT/'membership.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
print('SVG',len(rows),'boundary parts',len(features),'partial counts',{c:len(selected[c]) for c in sorted(PARTIAL)},'bounds',merged.bounds)
