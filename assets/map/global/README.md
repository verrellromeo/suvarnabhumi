# Global ADM2 atlas

Geometry: UNICEF GeoRepo [September 16, 2026 snapshot](https://github.com/unicef-drp/georepo-data), CC BY 4.0. The ADM0 and ADM2 exports contain historical versions. Only `is_latest: true` is included in the base layer: 289 ADM0 entities and 41,092 ADM2 units. Taiwan and Philippines detail layers use the supplied GADM 4.1 ADM2 exports instead, with 22 and 1,647 units respectively; the displayed total is 42,680.

The country index and ADM0 shapes derive from the same UNICEF export. ADM2 units are grouped by the prefix of `adm0_ucode`, retaining distinct UNICEF entities such as Hong Kong, Macau, and small island territories. A shared-topology Mapshaper simplification is applied *within each ADM2 entity* to reduce download size without separately shifting adjacent district edges. Most use 2% retained weighted vertices; Brazil, Ecuador, Honduras, India and Mexico use 0.8%. ADM0 display geometry uses 3%. This is a reference layer, not a Suvarnabhumi political boundary.

The browser loads compressed world shards, then the relevant compressed country pack when selected. `manifest.json` maps each entity to its pack. The world overview remains UNICEF ADM0 geometry; Taiwan and Philippines detail geometry comes from GADM 4.1. GADM permits redistribution for noncommercial purposes with attribution; check its terms before commercial reuse. The original 1.4 GB ADM2 export and uncompressed intermediate files are intentionally excluded from Git.

Rebuild from the linked `adm2.geojson` and `adm0.geojson` exports:

1. Run `python tools/build-global-adm2.py adm2.geojson adm2-parts`.
2. Filter ADM0 `is_latest` features and keep the country code and name to make `adm0-latest.geojson`.
3. Run Mapshaper weighted simplify with `keep-shapes` on ADM0 and each ADM2 partition, outputting `world.geojson` and `<entity>.geojson` here.
4. Create `manifest.json` with the ADM0 names and counts from `adm2-parts/counts.json`, then run `python tools/pack-global.py`. This repacks the UNICEF base; restore the two GADM overrides and their manifest entries afterward.

Assignments made in the browser are stored in that browser's local storage; **Export selections** downloads a portable JSON copy.
