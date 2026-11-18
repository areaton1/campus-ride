# Acceptance criteria — Feature 1 Route Isolation

## Functional

| ID | Criterion | How to verify |
|----|-----------|---------------|
| AC-1 | No route focused → all six route paths, underlays, stops, and twelve bus markers visible as before. | Load app; inspect `#route-lines`, `#stop-markers`, `#bus-markers`. |
| AC-2 | Selecting a Routes-list item hides every other route path and underlay completely. | Routes tab → Campus Loop; unrelated `[data-line]` / `[data-under]` not displayed. |
| AC-3 | Selected route stays emphasized (thicker / emphasis class). | Inspect focused `.route-path.emphasis`. |
| AC-4 | Unrelated bus markers hidden; simulation still runs. | Pause after isolation, note clock; wait; switch to another route — buses appear mid-loop, not reset. |
| AC-5 | Focused route’s stop marks remain, including nodes shared with other patterns. | e.g. Bidgood / Capstone corridor stop on focused route still shown. |
| AC-6 | Selecting a different route switches focus immediately. | Click East after Campus Loop. |
| AC-7 | Selecting the active Routes item again restores full overview. | Toggle same route twice. |
| AC-8 | Show All Routes restores full overview when no trip is active. | Enter route detail → Show All Routes. |
| AC-8b | During an active trip, Routes does not offer Show All; shows trip-lock notice; list marks the effective (trip) route. | Follow This Bus → Routes tab; confirm notice + focused Active trip row; no `#all-routes`. |
| AC-9 | Choosing a Ride itinerary option focuses that route; `plans()` counts unchanged. | PV → Student Center; pick option; map isolates; `node tests/routing.cjs` still passes. |
| AC-10 | Follow This Bus, walk paths, ETAs, trip phases, mobile sheet unchanged. | Full smoke trip + narrow viewport Routes selection. |

## Regression / automated

| ID | Criterion |
|----|-----------|
| AC-R1 | `node tests/routing.cjs` exits 0 (observed counts may match prior snapshot; not a hard contract). |
| AC-R2 | No new dependencies in `package.json`. |

## Out of scope checks (must not appear in this branch)

- POI card / Get Directions / Set as Starting Point
- Pinch-zoom handlers
- New places or stops datasets
