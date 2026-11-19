# Settlement detail pages

Add or edit a settlement in the `settlements` array in `src/data.js`.
The directory links to its detail page at `#/settlements/<id>`.
The same template in `src/settlement-detail.js` renders every entry.

| Field | Content |
| --- | --- |
| `id` | Unique URL slug |
| `name`, `type`, `region`, `era` | City name, classification, administrative region and historical note |
| `image` | Directory card image and fallback detail banner |
| `summary`, `detail` | Overview paragraphs |
| `features` | Points of interest for the Landmarks tab |
| `hero` | Optional banner override with `src`, `alt` and optional `placeholder` flag |
| `subtitle`, `overviewTitle` | Optional banner subtitle and overview heading |
| `facts` | Optional array of `{label, value}` pairs for At a glance. Defaults to region, city type and historical note |
| `feature` | Optional overview inset with `title`, `src` and `alt` |
| `history`, `districts`, `landmarks` | Optional history paragraph, district list and landmark list. `landmarks` overrides `features` in the Landmarks tab |
| `gallery` | Optional array of photos with `src`, `alt` and optional `caption` |

Only sections with content appear in the tab bar. Overview expands to two
columns when the inset is omitted. Maharajapura is a populated example.
Banner and inset artwork can live in `assets/settlements/`.
