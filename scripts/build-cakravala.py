import csv,gzip,json
from pathlib import Path
from collections import defaultdict,Counter
from lxml import etree
from shapely.geometry import shape,mapping
from shapely.ops import unary_union
R=Path(__file__).resolve().parents[1]; M=R/'assets/map'; O=M/'maharaja/cakravala'; O.mkdir(exist_ok=True)
rows=list(csv.DictReader((M/'maharaja/adm2-cakravala.csv').open())); assignments={r['adm2_id']:r for r in rows}
manifest=json.loads((M/'global/manifest.json').read_text()); groups=defaultdict(list)
for code in sorted({r['adm0_code'] for r in rows}):
 e=manifest['countries'][code]
 for pack in e.get('packs',[e.get('pack')]):
  data=json.load(gzip.open(M/'global/packs'/pack,'rt'))
  for f in data[code]['features']:
   r=assignments.get(f['properties']['id'])
   if r:
    f['properties']['cakravala']=r['cakravala_svg_frame'];groups[r['cakravala_svg_frame']].append(f)
svg=etree.parse(str(R.parent/'upload/Southeast Asia (Maharaja Mandala)(5).svg'))
colors={g.get('class'):Counter(p.get('fill') for p in g.xpath('.//*[local-name()="path"]') if p.get('fill')).most_common(1)[0][0] for g in svg.getroot().xpath('./*[local-name()="g"]/*[local-name()="g"]')}
boundaries=[]; index=[]
names={'Srivijaya_Suvarnabhumi_Capital_Region':'Srivijaya Special Administrative Region','Malaya_Islands':'Malaya Islands Capital Region'}
for group,fs in sorted(groups.items()):
 name=names.get(group,group.replace('_',' '));color=colors[group]
 geoms=[shape(f['geometry']) for f in fs];geoms=[g if g.is_valid else g.buffer(0) for g in geoms]
 geom=unary_union(geoms)
 boundaries.append({'type':'Feature','properties':{'id':group,'name':name,'color':color,'count':len(fs)},'geometry':mapping(geom)})
 with gzip.open(O/(group+'.json.gz'),'wt') as f:json.dump({'type':'FeatureCollection','features':fs},f,separators=(',',':'))
 index.append({'id':group,'name':name,'color':color,'count':len(fs),'pack':group+'.json.gz'})
with gzip.open(O/'boundaries.json.gz','wt') as f:json.dump({'type':'FeatureCollection','features':boundaries},f,separators=(',',':'))
(O/'index.json').write_text(json.dumps(index,separators=(',',':')))
assert sum(i['count'] for i in index)==4474
print(len(index),'Cakravala,',sum(i['count'] for i in index),'ADM2')
