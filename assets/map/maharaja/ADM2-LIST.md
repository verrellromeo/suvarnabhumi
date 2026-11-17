# Maharaja Mandala ADM2 inventory

`adm2-cakravala.csv` lists the 4,474 distinct ADM2 IDs currently included in the published Maharaja Mandala selection. It is generated with `python scripts/build-maharaja-adm2-list.py` from `membership.json`, the active global ADM2 packs, and the SVG-derived regional features. It does not change the map boundary.

The `cakravala_svg_frame` column retains the frame's literal SVG name. `adm1_id` and `adm2_id` are the IDs used by the website. The SVG contains older administrative levels and spellings, so `svg_name_status` distinguishes:

- `name_in_svg`: the normalized ADM2 name appears in a path of that frame (3,793 rows).
- `geometry_match_name_differs_or_level_differs`: a regional SVG-derived polygon overlaps the ADM2, but its path label does not contain the ADM2 name (647 rows).
- `no_svg_overlap_nearest_cakravala_review`: no regional feature overlaps; the frame is inferred from the closest feature of the same country and has been confirmed by the user (34 rows).

`cakravala_overlap_fraction` is the fraction of the ADM2's planar area covered by the assigned frame's regional features. For the nearest-feature cases, `nearest_svg_distance_degrees` is the geometric distance in longitude/latitude degrees. The Andaman districts are assigned to `Nagara_Sri_Dharmaraja` from three explicit SVG path names because those paths were omitted from the regional GeoJSON layer.

This inventory records the current selection, including whole ADM1 island groups added after the original SVG matching. It does not claim every inferred Cakravala is canonical; the 34 previously flagged rows are now user-confirmed. Karimun and Lingga belong to Malaya Islands. `confirmed-cakravala.json` preserves these decisions by ADM2 ID; `cakravala_assignment_status` records them independently of SVG name matching.
