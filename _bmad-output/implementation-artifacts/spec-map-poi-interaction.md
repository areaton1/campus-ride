---
title: 'Interactive Campus POI Selection'
type: 'feature'
created: '2026-11-18'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: 'b99bdceaffcd8a4c1352572fc94a1969e79ca5f5'
context:
  - '{project-root}/_bmad-output/specs/spec-map-poi-interaction/SPEC.md'
  - '{project-root}/_bmad-output/planning-artifacts/decision-log.md'
  - '{project-root}/AGENTS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Map taps jump straight to a destination via permanent name labels (12 of 14 places), with no inspect step and no way to set origin from the map. SERC and Lakeside are searchable but unmarked. Building names also appear as path-outlined glyphs in the SVG basemap.

**Approach:** Replace JS permanent location-name labels with interactive POI markers for all 14 searchable places. Place markers on SVG `buildings`-layer footprints using separate `visual` coordinates (not routing entrances). Tap opens an info card in the existing desktop sidebar / mobile bottom sheet; Get Directions and Set as Starting Point apply only on explicit action. During an active trip, POIs are inspect-only. Preserve Feature 1 isolation, buses, ETAs, navigation. Keep the current SVG-as-`<image>` architecture (no OSM migration). Strip only the isolated basemap `building numbers` layer; keep `road names` for navigation. The finished map is **not** claimable as fully label-free.

**Approved / review decisions:**
- Remove permanent JS location-name labels; replace with interactive markers (AD-POI-3).
- Markers on corresponding building footprints; visual coords ≠ entrance/`places.x|y` (AD-POI-4).
- All 14 searchable locations get markers (AD-POI-2).
- Card uses existing desktop sidebar and mobile bottom sheet.
- During `state.trip`, inspect allowed; endpoint actions disabled (AD-POI-5).
- Controlled SVG edit: remove `building numbers` only; retain `road names` (and other non-building geography/chrome) (AD-POI-6). Not a basemap platform migration.
- Do not claim a completely label-free map (road names intentional; chrome/title; possible water raster lettering; Bryce inset glyphs unless separately removed).

## Boundaries & Constraints

**Always:**
- HTML/CSS/JavaScript/SVG only; reuse `places`, planner, `didPan`, `effectiveMapFocus`, `mobile.js` sheet.
- `state.selectedPoi` for preview; origin/destination mutate only via card actions (AD-POI-1).
- Keep `CampusNetwork.entrances` and `computePlans` / walking graph unchanged.
- Origin/destination pins use entrance-synced `places.x|y`; markers use `visual`.
- Stage only Feature 2 files — exclude `map-src/` and the Elicitation Report PDF from commits.

**Never:**
- Mapbox/Google/Leaflet, paid APIs, new npm deps, live GPS.
- Full offline OSM basemap migration or coordinate-system swap.
- Deleting `buildings`, `streets 2001`, `road names`, water, or railroad layers.
- Expanding official Crimson Ride routes or mixing bus-stop nodes into destination POIs.
- Rewriting Feature 1 isolation or changing trip endpoints via POI while `state.trip` is active.
- Claiming survey-grade / official building verification or a fully label-free map.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Inspect POI | Tap Bidgood marker, no trip | Card in sidebar/sheet: name, type/category; origin/destination unchanged | Ignore if `didPan` |
| Get Directions | Card action on Bidgood | `destination=Bidgood`, clear trip/selection/focus, Ride results via existing planner | N/A |
| Set Starting Point | Card action on Gorgas | `origin=Gorgas` only; destination unchanged; dismiss card | N/A |
| Dismiss | Close / Escape / empty-map tap | `selectedPoi=null`; trip fields unchanged | N/A |
| SERC / Lakeside | Tap either marker | Card opens | N/A |
| Active trip | Tap POI while `state.trip` | Card opens; actions disabled with notice | No endpoint mutation |
| Basemap labels | Load map after SVG strip | Building-name glyph layer gone; road names remain | N/A |

</frozen-after-approval>

## Code Map

- `dist/campus-map.svg` — Inkscape layers isolated: `buildings` (320 footprints), `building numbers` (195 glyph paths, **safe to remove**), `road names` (148, **keep**), `streets 2001`, water, railroad. No shared `d` between buildings∩numbers. Consumed as `<image>` — layer hide requires file edit, not runtime JS.
- `dist/app.js` — `places[]`, entrance sync, `makeMap` JS labels, `choosePlace`, `renderPanel`, `didPan`, `effectiveMapFocus`. Add `visual`, markers, card, actions; remove JS name/`staticLabels`.
- `dist/index.html` — marker/card CSS; keep SVG-as-image embed.
- `dist/mobile.js` — sheet hooks if needed.
- `dist/network.js` — **do not change** entrances/topology.
- `tests/routing.cjs` — regression (expect unchanged).
- Specs + `decision-log.md` — AD-POI-*.

## Tasks & Acceptance

**Execution:**
- [x] Specs + `decision-log.md` — lock AD-POI-1…6; document remaining labels; exclude `map-src/`/PDF from Feature 2 commits.
- [x] `dist/campus-map.svg` — remove only `building numbers` layer group; keep `road names` and geography layers; visual smoke that footprints/roads intact.
- [x] `dist/app.js` — `visual:{x,y}` footprint-aligned (manual vs SVG buildings); markers for 14; card + actions; trip-lock; remove JS permanent labels.
- [x] `dist/index.html` (+ `mobile.js` if needed) — marker/card CSS; sheet UX.
- [x] Verify — 14 POIs, actions, desktop/mobile, Feature 1, `routing.cjs`, `git diff --check`; flag uncertain marker positions.

**Acceptance Criteria:**
- Given home view, when a POI marker is tapped without panning, then a sidebar/sheet card shows name/category and fields are unchanged.
- Given a card, when Get Directions / Set as Starting Point is used (no trip), then destination or origin updates via existing planner rules.
- Given `state.trip`, when a POI is tapped, then inspect works and endpoint actions are disabled.
- Given the updated basemap, when the map loads, then embedded building-name glyphs from `building numbers` are gone while road-name labels remain.
- Given all 14 places, when markers are checked against the SVG `buildings` footprints, then each marker sits on its footprint (not on the entrance spur); uncertain ones are flagged, not claimed survey-verified.
- Given Feature 1 flows, when POI browsing occurs, then isolation, buses, ETAs, and trip tracking still work.

## Implementation Notes

- **SVG:** removed only the `building numbers` layer (195 glyph paths; actually numeric building IDs, not names). `buildings` (640 paths / 320 footprints), `road names` (148), `streets 2001`, `Bryce`, `railroad`, `water features` counts unchanged; file still parses as XML. `Bryce` left as-is. Basemap is not label-free (road names, grid/title chrome, Bryce lettering remain).
- **`dist/app.js`:** `poiVisual` table → `place.visual` (separate from entrance-synced `x,y`); `makePoiMarker` / `syncPoiMarkers`; `state.selectedPoi`; `poiCardContent`, `selectPoi`, `dismissPoi`, `poiGetDirections`, `poiSetStart`, `revealPoi`; removed JS `labels` and `staticLabels`. `campusDemo.pois` exposes visual vs entrance for QA. `renderPanel` syncs `state.phase` while a card is open to avoid a `updateTracking` re-render loop.
- **`dist/index.html`:** `#place-labels` → `#poi-markers` (above route/walk layers, below buses); marker + card CSS; `#walk-lines` made non-interactive; About copy now says building *markers* are illustrative.
- **`dist/mobile.js`:** `setSheet(level, keepView)` + `revealSheet()` so a collapsed sheet opens without re-fitting the map.
- **Marker confidence:** all 14 `visual` points verified inside their `buildings` footprint path (`isPointInFill`). Footprint *identity* is by eye. **Uncertain (flagged `check:true`):** Presidential Village (multi-building village, one courtyard building chosen), SERC (nearest footprint, entrance sits just outside it), Ridgecrest South (several similar residence footprints), Paty Hall (small footprint beside entrance), Bryce Campus (a campus, largest wing chosen).


- **Review patches:** `#location-markers{pointer-events:none}`; uncertain `check:true` surfaced on card; About not-label-free copy; `tests/poi.cjs` for preview/actions/trip-lock/visual separation.
## Spec Change Log

- 2026-11-18 review: Embedded-label study — `building numbers` safe to strip; keep `road names`; do not claim label-free; markers = SVG-footprint-aligned; AD-POI-6; allow controlled SVG layer edit without OSM migration.

## Review Triage Log

| Finding | Verdict | Evidence / route |
|---------|---------|------------------|
| `#location-markers` above POIs steals pointer hits (esp. Presidential / near-entrance visuals) | high → patched | Confirmed via `elementFromPoint` hitting `user-halo`; fixed with `#location-markers{pointer-events:none}` |
| Escape+About also dismisses POI | false | Handler already requires `#about` to be `hidden` before `dismissPoi` |
| Mobile `revealPoi` uses live sheet height mid-transition | low → defer | Tolerable; no viewport harness; manual AC-8 remains gate |
| `check:true` not shown in UI | medium → patched | Card now shows “Uncertain footprint match · illustrative only” |
| Focus lost on trip phase change while card open | low → reject | Rare; fix needs focus restore complexity beyond everyday use |
| Claim: default-origin POI untappable | high → patched | Same root as location-markers hit steal |
| Stale “not yet applied” brownfield/Design Notes | low → patched | Docs updated to applied + Bryce leave-unchanged |
| About copy missing not-label-free language (AC-14) | medium → patched | About modal updated |
| JS staticLabels road overlays removed without SVG note | false | Intentional; SVG `road names` retained per AD-POI-6 |
| Search/popular skip card (dual UX) | false | Intent is map-marker inspect card; list/search keep existing choose flow |
| Mid-trip card replaces tracking panel | false | Approved inspect-only card behavior |
| `routing.cjs` doesn’t cover POI actions | high → patched | Added `tests/poi.cjs` (preview, directions, start, trip-lock, visual separation) |
| Mobile `revealSheet(keepView)` untested | medium → defer | Needs browser harness; deferred |

## Design Notes

**Embedded labels (applied):**
- Removed `building numbers` layer from `dist/campus-map.svg` (path-outlined building ID/name glyphs; geography intact).
- Kept `road names`, `buildings`, `streets 2001`, water, railroad.
- Left `Bryce` lettering unchanged (team decision).
- Remaining labels: road names, map chrome, Bryce lettering, session UI — map is not fully label-free.

**Visual POI placement:** Footprint paths use per-shape `matrix(...)` transforms — auto-centroid from raw `d` is unreliable. Place `visual` by eye on the `buildings` layer for each of the 14 ids; keep independent of `entrances`. Confidence = **SVG-footprint-aligned (illustrative)**; flag uncertain matches.

**Commit hygiene:** Never stage `map-src/` or `docs/week 11_ assignment_ 430 Elicitation Report.pdf` on this branch.

## Verification

**Commands:**
- `node tests/routing.cjs` — expected: exit 0
- `node tests/poi.cjs` — expected: exit 0, visualSeparated/previewOk/tripLockOk
- `git diff --check` — expected: clean

**Manual checks:**
- After SVG strip: footprints, streets, road labels visible; building-name layer absent.
- All 14 markers on footprints; Get Directions / Set Starting Point; mobile sheet; trip inspect-only; Feature 1 smoke.
