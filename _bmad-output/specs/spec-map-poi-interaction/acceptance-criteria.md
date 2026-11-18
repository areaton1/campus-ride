# Acceptance criteria — Feature 2 Interactive POI Selection

Approved for implementation 2026-11-18 on `feature/map-poi-interaction`.

## Functional

| ID | Criterion | How to verify |
|----|-----------|---------------|
| AC-1 | Click/tap a map POI opens an info card; origin/destination unchanged. | Tap Bidgood; card visible; fields still previous values. |
| AC-2 | Card shows name, type/category (minimum). | Inspect card copy vs `places[]`. |
| AC-3 | Get Directions sets destination and uses existing planner. | Results / walk comparison appear; `node tests/routing.cjs` still passes. |
| AC-4 | Set as Starting Point sets origin only. | Origin label updates; destination unchanged unless also acted on. |
| AC-5 | Dismiss card without applying. | Close / Escape / empty-map tap; no field change. |
| AC-6 | All 14 places are map-selectable (markers + card), including SERC and Lakeside. | Tap each marker once. |
| AC-7 | Pan does not accidentally open a card (`didPan` gate). | Drag map then release over a POI — no card. |
| AC-8 | Mobile (≤680px): card usable with bottom sheet; route isolation still works. | 375px smoke. |
| AC-9 | Feature 1 trip-lock + Show All rules unchanged. | Follow trip → Routes still shows trip notice; no false Show All. |
| AC-10 | Bus animation and ETAs continue during POI browsing. | Clock/buses advance with card open. |
| AC-11 | Permanent JS location-name labels removed; markers use `visual` coords on SVG building footprints, separate from entrance `x,y`. | No `map-place`/`staticLabels` name text; markers not glued to entrance dots; uncertain footprint matches flagged. |
| AC-12 | During active trip, POI inspect works; Get Directions / Set as Starting Point disabled. | Start trip → tap POI → actions blocked; endpoints unchanged. |
| AC-13 | SVG `building numbers` layer removed; `buildings`, streets, water, railroad intact; `road names` retained. | Visual compare pre/post; footprints and road labels still visible; building-name glyphs gone. |
| AC-14 | Delivery language does not claim a fully label-free map. | README/UI/about copy (if touched) and verification notes acknowledge remaining road/chrome labels. |

## Regression / automated

| ID | Criterion |
|----|-----------|
| AC-R1 | `node tests/routing.cjs` exits 0 (entrances/network unchanged). |
| AC-R2 | No new dependencies in `package.json`. |
| AC-R3 | `git diff --check` clean for committed files. |
| AC-R4 | Feature 2 commits do not include `map-src/` or the Elicitation Report PDF. |

## Out of scope (must not appear in this branch’s implementation)

- Full offline OSM / basemap platform migration
- Deleting `road names` or geography layers (`buildings`, `streets 2001`, water, railroad)
- Pinch-zoom
- New residence halls / official stop catalog beyond marker readiness notes
- `network.js` geometry accuracy pass
- Expanding Crimson Ride route catalog
- Survey-grade “officially verified building” claims
