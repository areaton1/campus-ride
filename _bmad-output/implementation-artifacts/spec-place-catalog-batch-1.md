# Implementation notes — Place Catalog Batch 1

- **Branch:** `feature/place-catalog-batch-1`
- **Baseline:** `e418d33` (post Features 1–3 / US-17)
- **Spec:** `_bmad-output/specs/spec-place-catalog-batch-1/`
- **Decisions:** AD-PLACE-1…5

## Delivered

All nine approved Batch 1 places shipped (none excluded):

| id | Name | Walk node | `check` |
|----|------|-----------|---------|
| `rodgers` | Rodgers Library | `eng` | |
| `bruno` | Bruno Business Library | `bidgood` | |
| `fresh-food` | Fresh Food Company | `capH` | |
| `alston` | Alston Hall | `bidgood` | |
| `student-services` | Student Services Center | `sc` | |
| `burke` | Burke Hall | `bryantH` | |
| `foster` | Foster Auditorium | `quadE` | |
| `lloyd` | Lloyd Hall | `cap` | |
| `lakeside-hall` | Lakeside Hall | `lake` | `true` (wing pick illustrative) |

- `dist/app.js` — place records + `poiVisual`
- `dist/network.js` — entrance spurs only (no route pattern / stop geometry edits)
- `dist/ai-assistant.js` — Fresh Food / SSC / Bruno / Foster / Lakeside phrase helpers; bare `lakeside` clarify
- Tests updated: `routing.cjs`, `poi.cjs`, `ai-assistant.cjs`
- README validation snapshot updated to 23 places / 506 walking pairs

## Automated results (this branch)

```json
{"walkingPairs":506,"itineraries":5296,"noUsefulBusCases":216,"routes":6}
{"places":23,"uncertain":["bryce","lakeside-hall","paty","presidential","ridgecrest","serc"],"visualSeparated":true,"previewOk":true,"tripLockOk":true}
{"places":23,"batch1AliasOk":true,"lakesideClarifyOk":true,"libraryClarifyOk":true,"handoffOk":true,"tripLockStateOk":true}
```

Itinerary count shifted vs pre-geometry-align snapshot (5376→5296; noUsefulBus 208→216) because street polylines lengthened/re-bent under AD-GEO-1 — pairs remain fully walkable; six route ids/patterns unchanged.

## Geometry alignment (AD-GEO-1) — separate from catalog scope

Recorded after Batch 1 place records landed. Diff identity:

| Concern | Primary files |
|---------|----------------|
| Place catalog (AD-PLACE-*) | `dist/app.js` `places[]` / aliases; `dist/ai-assistant.js`; tests fixtures |
| POI footprint recenter | `dist/app.js` `poiVisual` (+ entrance spur retunes in `network.js`) |
| Bus/street polyline align | `dist/network.js` `nodes` + edge `via` points (patterns/stop sequences untouched) |

### POIs recentered (illustrative footprint centers)

Alston, Foster, Bruno, Bidgood, Gorgas, Lloyd, Rodgers, Shelby, SERC, Fresh Food, Student Services, Burke, Student Center, Stadium, Lakeside Hall (`check:true` retained).

### Route segments realigned to illustrated streets

University Blvd (quadW↔quadE↔uniH↔uniE), Capstone/Stadium Drive approaches, Hackberry bends, Colonial Drive onto Univ Blvd, Campus Drive East→Rec, denser vias on Bryce/Coleman corridors. Route **ids / patterns / stop name keys** unchanged.

Before/after visual evidence (local, non-repo): `/tmp/campus-ride-geom-fix/compare-*.png`, `before/`, `after/`.

## Explicitly not done

- ten Hoor / Hardaway / SC Parking Deck / Delta Zeta (deferred per AD-PLACE-4)
- `campus-map.svg` edits; OSM / basemap replacement
- New bus routes or stop-sequence redesign
- Course `docs/` / OneDrive / User Testing Plan edits
- Push / merge to `main`

## Placement honesty

All markers remain illustrative SVG-footprint alignments against the 2014 basemap (AD-PLACE-2 / AD-POI-4 / AD-GEO-1). `lakeside-hall` carries `check:true`. Not survey-verified; not official Crimson Ride geometry.
