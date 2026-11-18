---
id: SPEC-map-poi-interaction
companions:
  - acceptance-criteria.md
  - brownfield-notes.md
sources:
  - Feature 2 brief (team-approved planning after PR #3 merge)
  - Verified baseline on main @ 96dedfe (post Feature 1)
  - Team-approved POI design (2026-11-18)
  - Embedded SVG label review (2026-11-18) — building numbers layer isolation
---

> **Canonical contract (approved for implementation 2026-11-18).** Implement on `feature/map-poi-interaction` only. Do not merge research into main or Feature 2. Do not stage `map-src/` or the Elicitation Report PDF. AD-POI-6 adopted; Bryce lettering layer left unchanged.

# Interactive Campus POI Selection

## Why

**Pain to solve:** Map POIs today jump straight to a destination on label click (12 of 14 places labeled; SERC and Lakeside searchable but unmarked). Students cannot inspect name/type/category first, nor set a starting point from the map. Permanent building names also appear as path-outlined glyphs in the SVG basemap. Feature 2 adds select → inspect → act markers and removes **building-name** clutter (JS + isolated SVG layer) while keeping useful road labels.

## Capabilities

- **CAP-1** — Tap/click a POI marker → info card in desktop sidebar / mobile bottom sheet before trip fields change (name, type/icon, category minimum).
- **CAP-2** — Get Directions sets destination; Set as Starting Point sets origin; reuse entrances + existing planner (`computePlans` unchanged).
- **CAP-3** — Touch-friendly hit targets; `didPan` suppresses accidental opens; mobile sheet remains usable.
- **CAP-4** — Preserve Feature 1 isolation, bus animation, ETAs, navigation.
- **CAP-5** — All 14 searchable places marked. `visual:{x,y}` on SVG `buildings` footprints, independent of entrance-synced `x,y`. OSM-ready shape documented; no coordinate migration in this feature.
- **CAP-6** — During `state.trip`, inspect allowed; endpoint actions disabled.
- **CAP-7** — Remove permanent building-name presentation: JS `map-place`/`staticLabels` texts **and** the SVG `building numbers` layer. Keep `road names` for navigation. Do **not** claim a fully label-free map.

## Constraints

- HTML/CSS/JavaScript/SVG only — no APIs, Mapbox/Google/Leaflet, or new npm dependencies.
- Do not filter or replace `computePlans` / walking graph.
- Preserve route isolation, AD-ISO-5 trip-lock, bus simulation, ETAs, `mobile.js` sheet behavior.
- **Allowed basemap edit (not OSM migration):** delete only the `building numbers` layer group from `dist/campus-map.svg`. Keep current SVG-as-`<image>` architecture.
- **Must retain:** `buildings`, `streets 2001`, `road names`, water, railroad, and other non-building-name geography needed for the prototype.
- Do not expand the official Crimson Ride route catalog.
- Course `docs/` are not silently edited.

## Non-goals

- Full offline OSM basemap migration / coordinate-system swap.
- Claiming the map is completely free of all labels (road names stay; chrome/title; possible water raster lettering; Bryce inset unless separately approved for removal).
- Pinch-to-zoom beyond existing controls.
- Feature 3 stop catalog / Feature 4 network geometry rewrite.
- Live GPS.
- Survey-grade official building verification claims.

## Success signal

Tap Bidgood → card → Get Directions plans as today → Set as Starting Point updates origin only → active trip = inspect-only → building-name glyphs from the SVG layer are gone while University Blvd–style road labels remain → Feature 1 still works on phone and desktop.

## Assumptions

- Card dismiss (close / empty-map tap / Escape) clears `selectedPoi` without changing trip fields.
- Marker positions are **SVG-footprint-aligned** by visual inspection against the `buildings` layer; uncertain placements are flagged (not survey-verified).
- Traveler / Board–Exit / bus ID labels remain as session UI.

## Embedded label finding (2026-11-18)

| Layer | Role | Feature 2 action |
|-------|------|------------------|
| `buildings` | 320 footprints (+ outlines) | **Keep** — marker alignment target |
| `building numbers` | 195 path-outlined building name/ID glyphs; **0** shared path data with footprints | **Remove** (safe for geography) |
| `road names` | Street/road labels | **Keep** (navigation) |
| `Bryce` | 2 inset fill paths (campus/area lettering, not footprints) | **Leave unchanged** (team decision 2026-11-18) |
| `streets 2001` / water / railroad | Geography | **Keep** |
| JS `map-place` + `staticLabels` | Overlay text in `makeMap` | **Remove** |

Because the basemap is an `<image>`, layer removal is a file edit (still the same SVG architecture), not a runtime toggle and **not** an OSM migration.

**Honest delivery statement:** After Feature 2, permanent **building-name** labels (JS + `building numbers`) are gone and replaced by interactive markers. **Road labels remain.** The map is not completely label-free.

## Architecture decisions

See Decision Log AD-POI-1 … AD-POI-6 (all adopted). Inherit AD-ISO-1 … AD-ISO-5.
