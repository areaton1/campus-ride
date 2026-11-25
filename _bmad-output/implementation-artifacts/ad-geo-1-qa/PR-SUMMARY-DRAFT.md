# PR draft — `feature/place-catalog-batch-1`

**Branch:** `feature/place-catalog-batch-1`  
**Status:** Approved for commit + PR against `main` (do not merge until review)  
**Geometry policy:** Frozen (`geometry-freeze.json`). No further automatic coordinate changes.

## Summary

- Expand searchable campus directory from 14 → **23 places** (Batch 1: Rodgers, Bruno, Fresh Food, Student Services, Alston, Burke, Foster, Lloyd, Lakeside Hall) with entrance spurs on the existing pedestrian graph.
- Align all **six** demo bus routes to manually edited centerlines on `campus-map.svg` (AD-GEO-1), applying shared street edges once so Campus / North / West / Coleman / East / Bryce stay consistent.
- Extend the scripted Trip Assistant corpus for Batch 1 aliases and clarify flows (Lakeside Hall vs Dining; multi-library), without external AI.
- Preserve original basemap artwork (`dist/campus-map.svg` unchanged) and existing Ride / Routes / Saved / POI / trip-lock behaviors.

## Shared-geometry decisions

- Shared edges applied from unanimous manual exports (orientation-normalized). Documented non-conflicts include `sc|bidgood` and `bidgood|cap` (campus/north/west; coleman shares Capstone).
- Bidgood stop relocated to export `[253.3, 469.7]`; Stadium Drive + Capstone Drive take the exported via polylines exactly (no smoothing).
- Route **identities, stop sequences/patterns, and basemap** unchanged; only illustrated node/via geometry.

## Test evidence (this freeze)

```text
node tests/routing.cjs      → exit 0  {"walkingPairs":506,"itineraries":5128,"noUsefulBusCases":216,"routes":6}
node tests/poi.cjs          → exit 0  {"places":23,"visualSeparated":true,"previewOk":true,"tripLockOk":true,…}
node tests/ai-assistant.cjs → exit 0  {"places":23,… all guardrail flags true}
```

App QA: all six routes isolate with correct boarding stop lists; buses sample route polylines at 0/25/50/75% loop (max path Δ = 0); Presidential → Bidgood returns west/north/campus options boarding PV or Student Center → Bidgood; Batch 1 Bruno plans west/north/campus.

## Artifacts (not app ship set)

- Manual exports + debug editors archived under `_bmad-output/implementation-artifacts/ad-geo-1-qa/dev-artifacts-archive/`
- Freeze + QA JSON under `_bmad-output/implementation-artifacts/ad-geo-1-qa/`
- Shipping `dist/`: `index.html`, `app.js`, `network.js`, `mobile.js`, `ai-assistant.js`, `campus-map.svg` only

## Test plan (reviewer)

- [ ] `npm run dev` → Routes tab: isolate each of 6 routes; confirm 2 buses follow the highlighted line
- [ ] Zoom Stadium Drive (SC→Bidgood) and Capstone (Bidgood→Gorgas/cap); line stays in road corridor
- [ ] Search/POI: open Rodgers, Bruno, Lakeside Hall; trip-lock still blocks endpoint hijack mid-trip
- [ ] Assistant: “Rodgers library”, Lakeside clarify, refuse live/off-topic
- [ ] Run the three `node tests/*.cjs` suites; expect exit 0 and counts above

## Out of scope / do not merge accidentally

- Graded MIS 430 docs under `docs/` (untouched)
- `map-src/` authoring tree
- Archived `_*-debug*` / `_*-manual-export.json` tools (kept only under `_bmad-output/…/dev-artifacts-archive/`)
