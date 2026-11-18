---
id: SPEC-route-isolation
companions:
  - acceptance-criteria.md
sources:
  - architecture audit (team-approved 2026-11-18)
  - team Feature 1 requirements
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for Feature 1 — Bus Route Isolation.

# Bus Route Isolation

## Why

**Pain to solve:** With six overlapping illustrative routes drawn at once, students cannot visually isolate a single corridor. The current map only dims other routes (and leaves underlays fully opaque), so shared Capstone / Hackberry segments stay noisy. Isolation is a presentation fix that makes route exploration and itinerary selection readable without changing the routing engine or demo simulation.

## Capabilities

- **CAP-1**
  - **intent:** Student can select one bus route and see only that route’s line, underlay, stops, and buses on the map.
  - **success:** Unrelated route paths, underlays, stop marks, and bus markers are fully hidden (`display: none` or equivalent), not merely dimmed; the selected route remains emphasized.
- **CAP-2**
  - **intent:** Student can restore the full multi-route overview.
  - **success:** Re-selecting the active route on the Routes list, or using Show All Routes, clears map focus and shows every route/bus again.
- **CAP-3**
  - **intent:** Student can select a recommended itinerary and have the map focus that itinerary’s route without changing plan calculation.
  - **success:** `computePlans` / `plans()` output unchanged; map focus follows the chosen option’s `route.id`; Follow This Bus, walking paths, ETAs, and trip tracking still work.
- **CAP-4**
  - **intent:** Simulation keeps advancing all buses while some markers are hidden.
  - **success:** Hidden buses continue timeline updates; revealing a route shows markers already at the correct simulated positions.

## Constraints

- HTML/CSS/JavaScript/SVG only; no APIs, mapping platforms, or new npm dependencies.
- Isolation is presentation-only — never filter `computePlans`, walk graph, or ETA math.
- Preserve trip tracking, Follow This Bus, recommendations, walking directions, ETAs, and mobile sheet behavior.
- Shared stops that belong to the focused route remain visible (including nodes also used by other patterns).
- Course documents under `docs/` are not silently edited; backlog wording changes are proposals only.

## Non-goals

- POI selection cards, Get Directions / Set as Starting Point from map taps.
- Pinch-to-zoom / gesture upgrades beyond existing pan and zoom controls.
- Expanded campus places or a separate Crimson Ride stops dataset.
- Map geometry accuracy rewrites (`network.js` edge/via edits).
- Live transit feeds or official Crimson Ride timetable claims.

## Success signal

On Routes or Ride results, picking one route leaves a single highlighted corridor and its buses; picking another switches instantly; clearing focus restores the familiar six-route overview — while Presidential Village → Student Center still plans, follows, and ETAs as before.

## Assumptions

- “Show All Routes” maps to the existing Routes-detail back control (`#all-routes`), labeled for clarity.
- While a trip is active, map focus is locked to `state.trip.route.id` even if `mapFocusRouteId` differs.
- Re-clicking the already-chosen Ride option clears map focus but keeps `state.selected` so Follow This Bus still has a target.
---

## Architecture decisions (cited)

See `_bmad-output/planning-artifacts/decision-log.md` entries AD-ISO-1 … AD-ISO-4.
