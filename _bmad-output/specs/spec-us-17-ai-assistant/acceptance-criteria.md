# Acceptance criteria — US-17 Simulated AI Trip Assistant

Approved for implementation 2026-11-18 on `feature/us-17-ai-assistant`.

Sources: First Sprint Plan Final v1.1 (US-17 AC) + team design clarifications.

## Functional

| ID | Criterion | How to verify |
|----|-----------|---------------|
| AC-1 | Before use, student sees a clear statement that assistant responses are simulated for the class prototype. | Open Ask Trip Assistant; persistent simulated notice visible. |
| AC-2 | Supported example/free-text request → assistant shows interpreted starting location and destination and asks to confirm. | “Presidential to Bidgood” or example chip → confirm card with both places. |
| AC-3 | Student can correct interpreted locations before requesting a route. | Change draft origin/destination in assistant; Confirm uses corrected places. |
| AC-4 | Missing or ambiguous location → clarification; no silent selection. | “Go to Shelby” asks to confirm suggested origin; “dorm” offers multiple residence options. |
| AC-5 | Unsupported request → explains limitation and offers manual location selection. | “Publix” / unknown place → refuse inventing; link/path back to manual fields. |
| AC-6 | Live bus positions, delays, or current service → cannot verify live info; does not invent an answer. | “Where is bus 101 right now for real?” → refuse. |
| AC-7 | After confirmation, locations pass into the same route-selection flow as manual input. | Confirm → results / walk / no-useful-bus notice as today; `computePlans` unchanged. |
| AC-8 | Assistant does not invent stops, routes, or travel times outside predefined data. | Chat copy never invents ETA/route geometry; planner UI owns those. |
| AC-9 | Off-topic requests redirect to campus trip assistance. | “Write my essay” → out of scope redirect. |
| AC-10 | Unknown place in a multi-place request is not silently ignored. | “From Publix to Bidgood” → surfaces unknown Publix. |
| AC-11 | Origin/destination do not change on interpret alone — only on explicit confirm. | Send message; fields unchanged until Confirm. |
| AC-12 | Active trip blocks origin/destination changes via assistant. | Follow This Bus → open assistant → apply blocked. |
| AC-13 | Manual destination entry continues to work with assistant closed. | Close assistant; type Ferg / pick Bidgood as before. |
| AC-14 | Suggested current origin is labeled as demo location, not GPS. | Missing-origin prompt copy. |
| AC-15 | Compatible with POI cards and route isolation; no geometry/POI coord edits. | Inspect POI; isolate route; assistant handoff still works. |
| AC-16 | Team documents that actual AI interpretation accuracy and live-data reliability cannot be validated through this scripted simulation. | SPEC / README / presentation notes. |

## Regression / automated

| ID | Criterion |
|----|-----------|
| AC-R1 | `node tests/routing.cjs` exits 0 at baseline counts unless an approved place/network change explains otherwise. |
| AC-R2 | `node tests/poi.cjs` exits 0 (14 places, trip lock, visual separation). |
| AC-R3 | `node tests/ai-assistant.cjs` covers supported, alias, ambiguous, missing, unknown, live refuse, off-topic, confirm-before-mutation, correction, trip lock, handoff contract, no invented IDs. |
| AC-R4 | No new dependencies in `package.json`. |
| AC-R5 | Branch work does not include `map-src/` or the Elicitation Report PDF. |

## Out of scope

- Paid / external AI backends
- New campus places or bus routes
- OSM map migration
- Persisted chat history or telemetry uploads
