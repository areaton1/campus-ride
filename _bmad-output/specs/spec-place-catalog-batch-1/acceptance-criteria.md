# Acceptance criteria — Place Catalog Batch 1

Pending team approval of SPEC before implementation. Target branch (when approved): `feature/place-catalog-batch-1`.

Baseline: `main` @ `e418d33` (14 places, 6 routes).

## Functional

| ID | Criterion | How to verify |
|----|-----------|---------------|
| AC-1 | Exactly the approved Batch 1 buildings are added (or a documented subset if one is excluded for placement confidence). No ten Hoor / Hardaway / SC Deck / Delta Zeta. | Diff `places[]` ids vs `place-catalog.md`; exclusions noted in PR. |
| AC-2 | Each added place has unique `id`, `name`, `category`, `type`, and useful `aliases`. | Inspect `dist/app.js` place records. |
| AC-3 | Each added place is searchable via origin/destination suggestions and selectable as endpoints. | Type name/alias; choose place; plan trip. |
| AC-4 | Each added place has a clickable POI marker on an SVG footprint (`visual`) separate from entrance `x,y`. | Tap marker → card; `campusDemo.pois` shows visual ≠ entrance. |
| AC-5 | POI card inspect / Get Directions / Set as Starting Point / trip-lock still match AD-POI-1/5. | Preview without mutating fields; act via buttons; active trip blocks acts. |
| AC-6 | Each added place has `CampusNetwork.entrances` spur onto an existing walk node; walking paths are not straight-line teleports across buildings. | Inspect `network.js`; walk preview looks corridor-plausible. |
| AC-7 | No edits to the six route patterns, stop indices/names tied to route geometry, or `campus-map.svg` artwork. | Diff excludes route pattern/`campus-map.svg` (unless unrelated approved work). |
| AC-8 | Lakeside Hall is distinct from Lakeside Dining (separate ids); ambiguous “lakeside” clarifies rather than silently picking one. | Assistant + search behavior for lakeside phrases. |
| AC-9 | Multi-library phrases (e.g. “library”) clarify among Gorgas / Rodgers / Bruno when ambiguous. | Assistant clarify options include library-type places. |
| AC-10 | Trip Assistant still refuses unknown/off-campus and live-status inventing; confirm-before-apply unchanged. | Publix / live bus cases still refuse; interpret alone does not mutate endpoints. |
| AC-11 | About / UI copy does not claim survey-verified building placement. | Read About + marker uncertainty flags. |
| AC-12 | If a Batch 1 building cannot be confidently placed, it is omitted with an explicit note — coordinates are not invented. | PR description lists any drop. |

## Regression / automated

| ID | Criterion |
|----|-----------|
| AC-R1 | `node tests/routing.cjs` exits 0; every place pair remains walkable; itinerary assertions still hold. Expected `walkingPairs = n(n-1)` for final searchable count `n` (23 if all nine ship). |
| AC-R2 | `node tests/poi.cjs` exits 0 with updated place-count assertion; visual≠entrance; trip-lock still passes; uncertain `check` list updated if needed. |
| AC-R3 | `node tests/ai-assistant.cjs` fixture synced to live place set; covers Batch 1 alias hit, Lakeside Hall vs Dining ambiguity, library ambiguity, and prior refuse/confirm/trip-lock contracts. |
| AC-R4 | No new dependencies in `package.json`. |
| AC-R5 | Branch does not stage `map-src/`, Elicitation Report PDF, or silent course-`docs/` edits. |

## Manual smoke

1. Search each new place by name and at least one alias.  
2. Tap each new marker; confirm card; Set Start / Get Directions once each.  
3. Plan Presidential → Rodgers and Lakeside Hall → Bruno (bus or walk comparison as today).  
4. Assistant: “Rodgers to Fresh Food”; “lakeside to Bidgood” (expect clarify if bare lakeside); “library to Alston” (expect clarify or explicit pick).  
5. Confirm Features 1–3 still work (route isolation, POI trip-lock, assistant trip-lock).

## Out of scope

- ten Hoor Hall, Hardaway Hall, Student Center Parking Deck, Delta Zeta  
- New bus routes / basemap replacement / OSM migration  
- Paid APIs or external geocoders  
- Graded OneDrive academic doc edits without Jade/team approval  
