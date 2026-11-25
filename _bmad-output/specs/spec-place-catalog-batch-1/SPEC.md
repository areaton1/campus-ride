---
id: SPEC-place-catalog-batch-1
companions:
  - acceptance-criteria.md
  - place-catalog.md
sources:
  - Team-approved Batch 1 location expansion decision (2026-11-25)
  - Location inventory + visual verification report (Option C) against dist/campus-map.svg
  - Verified baseline on main @ e418d33 (post Features 1–3 / US-17)
  - AGENTS.md place/network conventions; AD-POI-* and AD-AI-* continuity
---

> **Canonical contract (approved for implementation 2026-11-25).** Implement on `feature/place-catalog-batch-1` only. Do not edit `campus-map.svg` artwork, bus route/stop geometry, course `docs/`, or stage `map-src/` / Elicitation Report PDF. If any listed building cannot be placed confidently, exclude it and record the exclusion — do not invent coordinates.

# Place Catalog — Batch 1 Expansion

## Why

**Pain to solve:** Students can only search and pin 14 campus destinations. Common destinations (libraries, dining, services, classrooms, additional residence) are missing, so Trip Assistant and search refuse valid campus requests. Expanding the catalog with nine visually assessed buildings improves coverage without rebuilding the map or transit model.

## Approved scope (exactly nine)

1. Rodgers Library  
2. Bruno Business Library  
3. Fresh Food Company  
4. Student Services Center  
5. Alston Hall  
6. Burke Hall  
7. Foster Auditorium  
8. Lloyd Hall  
9. Lakeside Hall  

Proposed stable ids and alias rules: see companion `place-catalog.md`.

## Capabilities

- **CAP-1**
  - **intent:** Student can search, suggest, and select each of the nine Batch 1 places as origin or destination using unique ids, display names, categories, types, and aliases.
  - **success:** All nine appear in `places[]` / suggestions / saved-place picker; exact-name and alias queries resolve without inventing extra ids.
- **CAP-2**
  - **intent:** Student can tap a map POI marker for each Batch 1 place, inspect the existing info card, and optionally Set as Starting Point / Get Directions (trip-lock preserved).
  - **success:** Marker count equals searchable place count; `visual` ≠ entrance `x,y`; AD-POI-1/4/5 behavior unchanged.
- **CAP-3**
  - **intent:** Walking and bus itineraries work between every place pair using the existing pedestrian graph plus short entrance spurs onto existing walk nodes.
  - **success:** Every new place has a `CampusNetwork.entrances` entry; `node tests/routing.cjs` exits 0 for all pairs; no straight-line fallback; no bus route/stop edits.
- **CAP-4**
  - **intent:** Trip Assistant recognizes Batch 1 names/aliases and clarifies Lakeside Hall vs Lakeside Dining and multi-library phrases without inventing places.
  - **success:** Assistant tests cover new aliases, Lakeside ambiguity, and library clarify; confirm-before-apply and trip-lock still hold (AD-AI-*).
- **CAP-5**
  - **intent:** Automated suites and About/disclaimer language stay honest about illustrative placement.
  - **success:** `poi.cjs` / `routing.cjs` / `ai-assistant.cjs` updated for new counts/contracts; no survey-verified geography claims.

## Constraints

- HTML/CSS/JavaScript/SVG stack only — no external APIs, paid tools, new npm deps, or frameworks.
- Preserve `dist/campus-map.svg` artwork (no basemap replacement; no AD-POI-6-style layer edits unless separately approved).
- Preserve all six route patterns, stop geometry, and simulated bus/ETA behavior.
- New searchable places require entrance + connected spur (`AGENTS.md`); no straight-line walking.
- Prefer reuse of existing walk nodes (`eng`, `bidgood`, `capH`, `sc`, `bryantH`, `quadE`, `cap`, `lake`, etc.); add corridor edges only if a short spur is impossible otherwise — still no route pattern changes.
- `visual:{x,y}` on SVG `buildings` footprints; illustrative only (`check:true` when uncertain).
- Lakeside Hall id/aliases must not silently override Lakeside Dining.
- Course `docs/` / OneDrive academic deliverables are proposal-only; not silently edited.
- Uncertain placement at implement time → exclude + document; do not invent coords.

## Non-goals

- ten Hoor Hall, Hardaway Hall, Student Center Parking Deck, Delta Zeta.
- New bus routes, stop catalog expansion, or Crimson Ride geometry claims.
- Basemap / OSM migration or coordinate-system swap.
- Survey-grade official verification claims.
- Unapproved place catalog growth beyond these nine (unless a listed building is dropped for confidence).

## Success signal

Catalog grows from 14 → 23 searchable places (or fewer only if a listed building is explicitly dropped for placement confidence). Student searches “Rodgers”, taps Bruno’s marker, plans Fresh Food → Foster, and asks the assistant for “Lakeside Hall to Bruno” with correct disambiguation from Lakeside Dining. All three test suites exit 0. Six routes and the SVG basemap remain unchanged.

## Architecture decisions

See Decision Log **AD-PLACE-1 … AD-PLACE-5**. These are technical architecture decisions (same pattern as AD-ISO / AD-POI / AD-AI). They are **not** graded MIS 430 BMAD Decision Log override entries.

## Relationship to prior freeze

**AD-AI-7** correctly froze place-catalog expansion for the US-17 branch. This SPEC does not rewrite that history. Batch 1 is a **later, separately approved** scope that expands the catalog for these nine places only while preserving US-17 assistant rules (AD-AI-1…6).
