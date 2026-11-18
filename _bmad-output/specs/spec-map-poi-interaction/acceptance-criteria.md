# Acceptance criteria — Feature 2 Interactive POI Selection

Draft for review. Implementation starts only after team approval.

## Functional

| ID | Criterion | How to verify |
|----|-----------|---------------|
| AC-1 | Click/tap a map POI opens an info card; origin/destination unchanged. | Tap Bidgood; card visible; fields still previous values. |
| AC-2 | Card shows name, type/category (minimum). | Inspect card copy vs `places[]`. |
| AC-3 | Get Directions sets destination and uses existing planner. | Results / walk comparison appear; `node tests/routing.cjs` still passes. |
| AC-4 | Set as Starting Point sets origin only. | Origin label updates; destination unchanged unless also acted on. |
| AC-5 | Dismiss card without applying. | Close / Escape / empty-map tap; no field change. |
| AC-6 | SERC and Lakeside are map-selectable (markers + card). | Both have entrances today but lacked labels. |
| AC-7 | Pan does not accidentally open a card (`didPan` gate). | Drag map then release over a POI — no card. |
| AC-8 | Mobile (≤680px): card usable with bottom sheet; route isolation still works. | 375px smoke. |
| AC-9 | Feature 1 trip-lock + Show All rules unchanged. | Follow trip → Routes still shows trip notice; no false Show All. |
| AC-10 | Bus animation and ETAs continue during POI browsing. | Clock/buses advance with card open. |

## Regression / automated

| ID | Criterion |
|----|-----------|
| AC-R1 | `node tests/routing.cjs` exits 0 after any place/entrance wiring changes. |
| AC-R2 | No new dependencies in `package.json`. |

## Out of scope (must not appear in this branch’s implementation)

- Pinch-zoom
- New residence halls / official stop catalog beyond marker readiness notes
- `network.js` geometry accuracy pass
