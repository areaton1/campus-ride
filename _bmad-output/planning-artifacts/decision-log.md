# Campus Ride — BMAD Decision Log

Project decisions that keep implementation consistent. Course documents under `docs/` are **not** modified here; when a decision implies backlog/SOW wording changes, a **proposal** is recorded for Jade / team approval.

| ID | Date | Status | Decision | Binds | Prevents |
|----|------|--------|----------|-------|----------|
| AD-ISO-1 | 2026-11-18 | Adopted | Add presentation-only `state.mapFocusRouteId` (`null` = show all). While `state.trip` is active, effective focus is always `state.trip.route.id`. | Map visibility / `drawFocus` | Overloading `state.route` vs `state.selected` for hide/show rules |
| AD-ISO-2 | 2026-11-18 | Adopted | Non-focused route paths, underlays, stop marks, and bus markers use full hide (`display: none`), not opacity dimming. Simulation `requestAnimationFrame` loop still updates every bus. | SVG overlay presentation | Underlays remaining visible when “isolated”; buses freezing when hidden |
| AD-ISO-3 | 2026-11-18 | Adopted | Isolation never filters `computePlans` / `plans()` / walking / ETA math. | Routing engine boundary | Presentation bugs changing recommendations |
| AD-ISO-4 | 2026-11-18 | Adopted | Feature 1 ships on `feature/route-isolation` only; no POI, pinch-zoom, or place expansion in this branch. | Branch scope | Scope creep into later map-phase features |
| AD-ISO-5 | 2026-11-18 | Adopted | While `state.trip` is set, Routes hides Show All Routes and shows: “Trip in progress — your selected route remains highlighted.” List focus uses `effectiveMapFocus()` (trip route). Normal Show All / toggle resumes when the trip ends. | Routes panel during tracking | Misleading Show All that clears manual focus but leaves trip isolation |
| AD-POI-1 | 2026-11-18 | Adopted | Feature 2 uses `state.selectedPoi` for map preview cards; origin/destination change only via explicit card actions (Get Directions / Set as Starting Point). | POI interaction model | Accidental destination changes from exploratory map taps |
| AD-POI-2 | 2026-11-18 | Adopted | Render selectable markers for every entranced place (including SERC/Lakeside); keep bus stops out of destination POIs until a separate Feature 3 stops dataset. | Map POI coverage vs stop confusion | Mixing boarding stops into place search destinations |
| AD-POI-3 | 2026-11-18 | Adopted | Remove permanent JS location-name labels (`map-place` texts and decorative `staticLabels`); replace with interactive POI markers. | Map clutter vs inspect-first flow | Permanent JS name clutter fighting marker/card UX |
| AD-POI-4 | 2026-11-18 | Adopted | Keep visual POI marker coordinates (`visual:{x,y}`) SVG-footprint-aligned against the `buildings` layer, separate from routing entrance coordinates (`places.x|y` synced from `CampusNetwork.entrances`). Illustrative alignment only — not survey-grade. Shape may later hold OSM ids; do not migrate coords or change the route network in Feature 2. | Marker placement vs walking graph | Gluing markers to entrance dots; false “officially verified” claims; breaking routing when adjusting visuals |
| AD-POI-5 | 2026-11-18 | Adopted | While `state.trip` is active, POIs may be inspected (card opens) but Get Directions / Set as Starting Point are disabled — trip endpoints cannot change from the map. | Trip integrity during tracking | Silent trip cancel / endpoint hijack mid-demo |
| AD-POI-6 | 2026-11-18 | Adopted | Controlled edit of `dist/campus-map.svg`: remove only the `building numbers` layer (path-outlined building names). Keep `road names` for navigation and keep all geography layers (`buildings`, `streets 2001`, water, railroad). Leave the `Bryce` lettering layer unchanged for now. Preserve SVG-as-`<image>` architecture — not an OSM migration. Do not claim a fully label-free map. | Basemap building-name declutter | Damaging footprints/roads; deleting useful road labels; scope creep into OSM swap; overclaiming label-free UI |

## Proposed course-doc updates (not applied)

- **Product Backlog:** Strengthen US-04 (route highlighted on map) to include optional single-route isolation; clarify US-13 (view multiple routes) as the default overview restored by Show All Routes / deselect.
- **SOW / future-state:** Optional note that the interactive map supports isolating one illustrative corridor for readability — still simulated, not official Crimson Ride.

Owners: Jade (backlog wording), Brett (architecture), Ashton (UI implementation).
