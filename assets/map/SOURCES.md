# Maharaja Mandala boundary sources

The Mandala explorer's 4,301 geometry features come from [geoBoundaries gbOpen](https://www.geoboundaries.org/) and the source datasets listed below. Cakravala membership follows the 29 parent frame groups in the supplied SVG. The gold overview boundaries are dissolved unions of the corresponding open regional polygons; opening a Cakravala reveals those ADM2/ADM3 polygons. The uploaded GADM files were used locally for comparison only. GADM's [license](https://gadm.org/license.html) prohibits redistribution without prior permission, so its geometry is not included in the site data.

| Country | geoBoundaries boundary ID | Original source | Licence |
| --- | --- | --- | --- |
| Myanmar | MMR-ADM2-60261553 | Myanmar Analytics Project, USAID/Burma | CC BY 4.0 |
| Indonesia | IDN-ADM2-22746128 | Badan Pusat Statistik, WFP, OCHA ROAP | CC BY 3.0 IGO |
| China | CHN-ADM2-17275852 | National Administration of Surveying, Mapping and Geoinformation of China; Revolutionary GIS | ODC PDDL 1.0 |
| Malaysia | MYS-ADM2-92858781 | geoBoundaries; citypopulation.de | CC BY 3.0 |
| Cambodia | KHM-ADM2-14789045 | Open Development Mekong; Open Development Cambodia | CC BY 4.0 |
| Laos | LAO-ADM2-54806243 | National Geographic Department; OCHA ROAP | CC BY 3.0 IGO |
| Vietnam | VNM-ADM2-81297802 | OCHA ROAP; Government of Viet Nam | CC BY 3.0 IGO |
| Bangladesh | BGD-ADM2-16705992 | Bangladesh Bureau of Statistics; OCHA ROAP | CC BY 3.0 IGO |
| Philippines | PHL-ADM3-30758251 | NAMRIA, Philippines Statistics Authority, OCHA Philippines | CC BY 3.0 IGO |
| Thailand | THA-ADM2-78962969 | Royal Thai Survey Department, OCHA ROAP | CC BY 3.0 IGO |
| Brunei | BRN-ADM2-61948251 | geoBoundaries, Wikimedia Commons (Rarelibra) | Public Domain |
| Japan | JPN-ADM2-22064153 | OpenStreetMap, Wambacher | CC BY-SA 2.0 |
| India | IND-ADM2-76128533 | Pathways Data Pvt. Ltd., lgdirectory.gov.in | ODbL 1.0 |
| Timor-Leste | TLS-ADM2-22284137 | WHO, OCHA ROAP | CC BY 3.0 IGO |
| Singapore | SGP-ADM1-49756563 | geoBoundaries gbOpen source metadata | ODbL 1.0 |
| Taiwan | TWN-ADM1-90331920 | geoBoundaries gbOpen source metadata | ODbL 1.0 |
| Hong Kong and Macau | CHN-ADM1-43563684 | National Administration of Surveying, Mapping and Geoinformation of China; Revolutionary GIS | ODC PDDL 1.0 |

The current release maps 4,301 open-geometry units across 16 country datasets, covering all 29 SVG Cakravalas at different completeness levels. The site packages dissolved Cakravala boundaries and lazy-loaded member areas under `assets/map/maharaja/` for the Mandala → Cakravala → ADM2 explorer. A feature's `matchConfidence` records the share of its area overlapping the assigned Cakravala in the local reconciliation. It is **not** a historical or legal claim to the boundary.

The source SVG contains 29 Cakravalas. Philippines uses ADM3, most other sources use ADM2; a number of SVG municipalities remain unmatched because names and administrative editions differ. Singapore and Taiwan have separate ADM1 geometry. Hong Kong and Macau have two separate ADM1 shapes; their 17 and two respective SVG subdistrict shapes await matching open district geometry. The geoBoundaries `Yamethin` district overlaps both Northern and Southern Pagan classifications and was assigned to the largest overlap (63%); its division needs manual review.

Display corrections: SVG `Srivijaya_Suvarnabhumi_Capital_Region` appears as **Srivijaya Special Administrative Region**, and `Malaya_Islands` appears as **Malaya Islands Capital Region**.

Rebuild the hierarchy data after updating the source regional layers:

```sh
python -m pip install shapely
python tools/build-maharaja-atlas.py path/to/maharaja-mandala.svg
```
