# Campus Ride — BMAD Decision Log

Project decisions that keep implementation consistent. Course documents under `docs/` are **not** modified here; when a decision implies backlog/SOW wording changes, a **proposal** is recorded for Jade / team approval.

| ID | Date | Status | Decision | Binds | Prevents |
|----|------|--------|----------|-------|----------|
| AD-ISO-1 | 2026-11-18 | Adopted | Add presentation-only `state.mapFocusRouteId` (`null` = show all). While `state.trip` is active, effective focus is always `state.trip.route.id`. | Map visibility / `drawFocus` | Overloading `state.route` vs `state.selected` for hide/show rules |
| AD-ISO-2 | 2026-11-18 | Adopted | Non-focused route paths, underlays, stop marks, and bus markers use full hide (`display: none`), not opacity dimming. Simulation `requestAnimationFrame` loop still updates every bus. | SVG overlay presentation | Underlays remaining visible when “isolated”; buses freezing when hidden |
| AD-ISO-3 | 2026-11-18 | Adopted | Isolation never filters `computePlans` / `plans()` / walking / ETA math. | Routing engine boundary | Presentation bugs changing recommendations |
| AD-ISO-4 | 2026-11-18 | Adopted | Feature 1 ships on `feature/route-isolation` only; no POI, pinch-zoom, or place expansion in this branch. | Branch scope | Scope creep into later map-phase features |
| AD-ISO-5 | 2026-11-18 | Adopted | While `state.trip` is set, Routes hides Show All Routes and shows: “Trip in progress — your selected route remains highlighted.” List focus uses `effectiveMapFocus()` (trip route). Normal Show All / toggle resumes when the trip ends. | Routes panel during tracking | Misleading Show All that clears manual focus but leaves trip isolation |

## Proposed course-doc updates (not applied)

- **Product Backlog:** Strengthen US-04 (route highlighted on map) to include optional single-route isolation; clarify US-13 (view multiple routes) as the default overview restored by Show All Routes / deselect.
- **SOW / future-state:** Optional note that the interactive map supports isolating one illustrative corridor for readability — still simulated, not official Crimson Ride.

Owners: Jade (backlog wording), Brett (architecture), Ashton (UI implementation).
