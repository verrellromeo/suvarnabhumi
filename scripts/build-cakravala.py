import csv,gzip,json
from pathlib import Path
from collections import defaultdict,Counter
from lxml import etree
from shapely.geometry import shape,mapping,Polygon,MultiPolygon,GeometryCollection
from shapely.ops import unary_union,polygonize
from shapely import make_valid
from shapely.strtree import STRtree
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
def polygonal(g):
 g=make_valid(g)
 if g.geom_type=='Polygon':return g
 if hasattr(g,'geoms'):return unary_union([polygonal(p) for p in g.geoms if p.geom_type in {'Polygon','MultiPolygon','GeometryCollection'}])
 return GeometryCollection()

def partition(domain, geoms):
 # Node all shared edges once, assign each resulting face to exactly one owner.
 clipped=[polygonal(g.intersection(domain)) for g in geoms]
 tree=STRtree(clipped);buckets=[[] for _ in clipped]
 edges=unary_union([domain.boundary]+[g.boundary for g in clipped if not g.is_empty])
 for face in polygonize(edges):
  point=face.representative_point()
  if not domain.covers(point):continue
  candidates=tree.query(face)
  scores=[(face.intersection(clipped[int(i)]).area,int(i)) for i in candidates]
  best=max(scores,default=(0,-1))
  containing=[i for score,i in scores if score >= face.area*(1-1e-9)]
  owner=min(containing,key=lambda i:clipped[i].area) if containing else (best[1] if best[0]>0 else int(tree.nearest(point)))
  buckets[owner].append(face)
 result=[polygonal(unary_union(parts)) for parts in buckets]
 union=unary_union(result)
 assert domain.symmetric_difference(union).area < 1e-8
 assert abs(sum(g.area for g in result)-union.area) < 1e-8
 assert all(g.is_valid for g in result)
 assert all(not g.is_empty for g in result)
 return result

keys=sorted(groups)
domain=polygonal(shape(json.load(gzip.open(M/'maharaja/boundary.geojson.gz'))['features'][0]['geometry']))
raw={key:[polygonal(shape(f['geometry'])) for f in groups[key]] for key in keys}
# Close narrow source slivers before deriving the shared Cakravala edges.
domain=polygonal(unary_union([domain]+[g for values in raw.values() for g in values]))
footprints=[polygonal(unary_union([unary_union(raw[key]),unary_union(raw[key]).buffer(.008,join_style=2).buffer(-.008,join_style=2)])) for key in keys]
clean=partition(domain,footprints)
boundaries=[]; index=[]
names={'Srivijaya_Suvarnabhumi_Capital_Region':'Srivijaya Special Administrative Region','Malaya_Islands':'Malaya Islands Capital Region'}
for group,geom in zip(keys,clean):
 fs=groups[group]
 name=names.get(group,group.replace('_',' '));color=colors[group]
 cleaned_areas=partition(geom,raw[group])
 for f,area in zip(fs,cleaned_areas):f['geometry']=mapping(area)
 boundaries.append({'type':'Feature','properties':{'id':group,'name':name,'color':color,'count':len(fs)},'geometry':mapping(geom)})
 with gzip.open(O/(group+'.json.gz'),'wt') as f:json.dump({'type':'FeatureCollection','features':fs},f,separators=(',',':'))
 index.append({'id':group,'name':name,'color':color,'count':len(fs),'pack':group+'.json.gz'})
with gzip.open(O/'boundaries.json.gz','wt') as f:json.dump({'type':'FeatureCollection','features':boundaries},f,separators=(',',':'))
(O/'index.json').write_text(json.dumps(index,separators=(',',':')))
assert sum(i['count'] for i in index)==4474
print(len(index),'Cakravala,',sum(i['count'] for i in index),'ADM2')

print('Shared coverage verified: no gaps or overlaps at Cakravala and ADM2 levels')
