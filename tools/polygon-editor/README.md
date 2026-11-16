# Suvarnabhumi Polygon Studio

Browser-only utility for mapping polygon areas into the Suvarnabhumi hierarchy.

## Use

1. Open `index.html` in a current desktop browser with internet access. Leaflet and the OpenStreetMap background load from public services.
2. Add a GeoJSON FeatureCollection with Polygon or MultiPolygon geometry. If the source is ZIP, extract the GeoJSON first.
3. Choose the source granularity (ADM0, ADM1, or ADM2), then map the name, ID, country, ADM1, and ADM2 properties in the import dialog.
4. Filter, search, and select polygons in the list or on the map. Fill any hierarchy fields that apply:
   `Mahā-Mandala → Mandala → Cakravala → Kadipatra → Viṣaya → Thāna → Kampong`.
5. Export assigned features as GeoJSON. An assignment CSV is available for review.

Polygon processing runs locally in the browser. Files are not uploaded. The export copies original geometries unchanged and records the source level, so overlapping ADM0/ADM1/ADM2 features can be resolved by the future map.

## Export structure

The GeoJSON is a FeatureCollection with a top-level `suvarnabhumi_schema` descriptor. Each feature has its original `geometry` and:

- `properties.source`: source file, ADM level, source ID/name, country/ADM1/ADM2, and original source properties.
- `properties.suvarnabhumi`: assigned hierarchy values using `maha_mandala`, `mandala`, `cakravala`, `kadipatra`, `visaya`, `thana`, and `kampong`.

For a large global ADM2 GeoJSON file, use the country filter before drawing polygons on the map. The list remains searchable across the imported layer.
