# Maharaja Mandala boundary sources

Published geometry comes from [geoBoundaries gbOpen](https://www.geoboundaries.org/), simplified from the source geometry for web display. The uploaded GADM files were used **locally for label matching and spatial reconciliation only**; GADM geometry is not redistributed in this repository.

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
| Philippines | PHL-ADM3 | geoBoundaries gbOpen source metadata | CC BY 3.0 IGO |
| Thailand | THA-ADM2 | geoBoundaries gbOpen source metadata | CC BY 3.0 IGO |
| Brunei | BRN-ADM2 | geoBoundaries gbOpen source metadata | Public Domain |
| Japan | JPN-ADM2 | geoBoundaries gbOpen source metadata | CC BY-SA (see source metadata) |
| India | IND-ADM2 | geoBoundaries gbOpen source metadata | ODbL 1.0 |
| Timor-Leste | TLS-ADM2 | geoBoundaries gbOpen source metadata | CC BY 3.0 IGO |

The current release maps 4,273 open-geometry units across 14 countries, covering all 29 SVG Cakravalas at different completeness levels. A feature's `matchConfidence` records the share of its area overlapping the assigned Cakravala in the local reconciliation. It is **not** a historical or legal claim to the boundary.

The source SVG contains 29 Cakravalas. Philippines uses ADM3, most other sources use ADM2; a number of SVG municipalities remain unmatched because names and administrative editions differ. Singapore, Taiwan, Hong Kong and Macau are individually named in the SVG and remain to be handled as distinct shapes. The extra Myanmar SVG label `Magyaw_Minbu-42` has no matching GADM unit and was excluded. The geoBoundaries `Yamethin` district overlaps both Northern and Southern Pagan classifications and was assigned to the largest overlap (63%); its division needs manual review.

Display corrections: SVG `Srivijaya_Suvarnabhumi_Capital_Region` appears as **Srivijaya Special Administrative Region**, and `Malaya_Islands` appears as **Malaya Islands Capital Region**.
