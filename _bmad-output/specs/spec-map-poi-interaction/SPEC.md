---
id: SPEC-map-poi-interaction
companions:
  - acceptance-criteria.md
  - brownfield-notes.md
sources:
  - Feature 2 brief (team-approved planning after PR #3 merge)
  - Verified baseline on main @ 96dedfe (post Feature 1)
---

> **Canonical contract (draft for review).** Do not implement until the team approves this SPEC.

# Interactive Campus POI Selection

## Why

**Pain to solve:** Map POIs today jump straight to a destination on label click (12 of 14 places labeled; SERC and Lakeside searchable but unmarked). Students cannot inspect name/type/category first, nor set a starting point from the map. Feature 2 adds an explicit select → inspect → act flow on the existing SVG map so trip planning stays intentional and touch-friendly, while remaining compatible with route isolation and the offline stack.

## Capabilities

- **CAP-1**
  - **intent:** Student can click or tap an existing campus building/POI on the map and see an information card before any trip field changes.
  - **success:** Card shows at least name, type/icon, and category (and optionally aliases hint). Origin and destination remain unchanged until a card action.
- **CAP-2**
  - **intent:** From the card, student can choose Get Directions or Set as Starting Point.
  - **success:** Get Directions sets destination (and clears an active trip / opens Ride results via existing planner). Set as Starting Point sets origin. Both reuse existing place objects + `CampusNetwork` entrances; `computePlans` is not rewritten.
- **CAP-3**
  - **intent:** POI targets work on desktop mouse and mobile touch without fighting map pan.
  - **success:** Invisible/hit-friendly markers (≥ ~24–44 CSS px equivalent in map space); `didPan` continues to suppress accidental taps; mobile bottom sheet remains usable (card placement does not block sheet drag).
- **CAP-4**
  - **intent:** Feature 2 preserves Feature 1 isolation and the live bus demo.
  - **success:** Selecting a POI does not break `effectiveMapFocus` / trip-lock rules; buses keep animating; zoom/pan/recenter still work.
- **CAP-5**
  - **intent:** Data shape prepares for later verified buildings and a separate bus-stop catalog (Feature 3) without implementing that expansion here.
  - **success:** POI rendering iterates a place list (or thin adapter) keyed like today’s `places` + `entrances`; documentation notes that official stops must not be mixed into destination POIs until a dedicated stops dataset ships.

## Constraints

- HTML/CSS/JavaScript/SVG only — no APIs, Mapbox/Google/Leaflet, or new npm dependencies.
- Do not filter or replace `computePlans` / walking graph; only feed origin/destination place objects.
- Preserve route isolation (`mapFocusRouteId` / `effectiveMapFocus`), trip-lock UX (AD-ISO-5), bus simulation, ETAs, and `mobile.js` sheet behavior.
- SERC and Lakeside must become map-selectable once markers exist (they already have entrances).
- Course `docs/` are not silently edited; propose backlog wording separately if needed.

## Non-goals

- Pinch-to-zoom / new gesture stack beyond existing pan + button/wheel zoom.
- Bulk place expansion or verified Crimson Ride stop dataset (Feature 3).
- Map geometry accuracy rewrites in `network.js` (Feature 4).
- Treating bus stop markers as destinations in this phase.
- Live GPS / geolocation permissions.

## Success signal

Tap Bidgood on the map → card appears with name/type → Get Directions plans PV→Bidgood as today → Set as Starting Point on Gorgas updates origin without surprising destination changes → Feature 1 isolate/Show All and Follow This Bus still work on phone and desktop.

## Assumptions

- Card UI lives in the existing sidebar/panel or a compact map overlay; exact chrome follows current Uber-inspired CSS (no new design system).
- Closing the card (dismiss / tap map empty / Escape) clears `selectedPoi` without changing trip fields.
- During an active trip, POI actions should confirm or block destination changes (open question if silent cancel-trip is acceptable).

## Open Questions

1. Card placement: sidebar panel section vs floating map card vs bottom-sheet peek on mobile?
2. During `state.trip`, should Get Directions cancel the trip automatically, prompt, or disable the action?
3. Should static labels (THE QUAD, street names) remain non-interactive?
4. Do we show a marker for every `places[]` entry in v1, or only the current labeled twelve plus SERC/Lakeside?

## Architecture decisions (proposed)

See Decision Log AD-POI-1 … AD-POI-2 (proposed until team adopts). Inherit Feature 1 AD-ISO-1 … AD-ISO-5 as binding.
