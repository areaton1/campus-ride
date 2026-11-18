# Brownfield notes — Feature 2 POI

Baseline: main @ 96dedfe. Branch: `feature/map-poi-interaction`. Planning commit: `b99bdce`.

## Current behavior (verified pre-Feature-2)

- `places[]`: 14 destinations; `x,y` overwritten from `CampusNetwork.entrances`.
- `makeMap()`: 12 clickable `map-place` texts + 7 decorative `staticLabels`; missing map labels for `serc`, `lakeside`.
- Label click sets `destination` immediately (no card).
- Feature 1: `mapFocusRouteId` + `effectiveMapFocus()`; AD-ISO-5.
- Basemap: `campus-map.svg` via `<image href>` in `index.html`.

## Embedded SVG label study (2026-11-18; strip applied on this branch)

| Finding | Evidence |
|---------|----------|
| No `<text>` in SVG | Labels are path-outlined glyphs |
| `buildings` isolated | 320 `#dfe2dc` fills + 320 outlines; matrix transforms per footprint |
| `building numbers` isolated | 195 paths; **0** shared `d` with `buildings` or `road names` |
| Strip test (in-memory) | Removing `building numbers` leaves `#dfe2dc` count = 320; road names / streets / water / railroad strings intact |
| `road names` separate | 148 paths — keep for navigation |
| `Bryce` | 2 fill paths — inset lettering, not footprints |
| Auto-centroid from raw `d` | Unreliable without applying transforms → manual visual placement |

**Recommendation:** Safe to remove `building numbers` from `dist/campus-map.svg` without damaging geography. Keep `road names`. Not an OSM migration.

## Target behavior (post-review)

- JS permanent name labels → interactive markers for all 14.
- `visual:{x,y}` SVG-footprint-aligned; entrance `x,y` for routing only.
- `state.selectedPoi` + sidebar/sheet card; trip = inspect-only.
- SVG: strip `building numbers`; keep road names; honest “not fully label-free” stance.

## Touch points

| File | Role |
|------|------|
| `dist/campus-map.svg` | Remove `building numbers` layer only |
| `dist/app.js` | `visual`, markers, card, actions, remove JS labels |
| `dist/index.html` | Marker/card CSS |
| `dist/mobile.js` | Sheet polish if needed |
| `dist/network.js` | **No change** |
| Specs + decision-log | AD-POI-1…6 |

## Commit hygiene

- Do **not** stage: `map-src/`, `docs/week 11_ assignment_ 430 Elicitation Report.pdf`
- Do **not** merge `research/offline-campus-map` into this branch
