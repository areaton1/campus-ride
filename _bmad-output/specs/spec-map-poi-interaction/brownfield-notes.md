# Brownfield notes — Feature 2 POI (verified on main @ 96dedfe)

## Current behavior (verified)

- `places[]` in `dist/app.js`: 14 campus destinations with `id`, `name`, `category`, `type`, `aliases`.
- Coords synced from `CampusNetwork.entrances` in `dist/network.js` (all 14 have entrances + pedestrian spurs).
- Map labels in `makeMap()`: 12 clickable `map-place` groups (text only). **Missing map labels:** `serc`, `lakeside`.
- Label click today: immediately sets `state.destination`, clears trip/selection, switches to Ride tab — **no preview card**.
- Search / popular list / saved places already set destination via `data-place` or `choosePlace`.
- Pan/zoom: pointer pan + `didPan` gate; wheel + zoom buttons; mobile hides `.zoom-group`.
- Feature 1: `mapFocusRouteId` + `effectiveMapFocus()`; trip-lock notice AD-ISO-5.

## Likely touch points (implementation later)

| File | Role |
|------|------|
| `dist/app.js` | `makeMap` markers/hit targets; `state.selectedPoi`; card render + Get Directions / Set Starting Point; wire to `choosePlace` / origin assignment |
| `dist/index.html` | Card CSS; optional marker styles |
| `dist/mobile.js` | Sheet height when card opens (if needed) |
| `tests/routing.cjs` | Unchanged unless entrances change |

## Integration rules

- Get Directions ≈ set destination then existing `resultsContent` / `plans()`.
- Set as Starting Point ≈ `state.origin = place` (mirror `#use-location` / `choosePlace` with `editing='origin'`).
- Do not put Crimson Ride stop nodes into `places[]` as destinations in this feature.
- Keep isolation presentation-only.

## Suggested implementation sequence (after approval)

1. `state.selectedPoi` + card UI shell (dismiss only).
2. Replace immediate destination assignment on `map-place` with card open; add hit circles for all entranced places (incl. SERC/Lakeside).
3. Wire Get Directions / Set as Starting Point.
4. Mobile sheet / trip-active policy (per open questions).
5. Manual + `routing.cjs` regression; preserve Feature 1 checks.
