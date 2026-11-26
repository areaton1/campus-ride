---
id: SPEC-us-17-ai-assistant
companions:
  - acceptance-criteria.md
sources:
  - Product Backlog Final v1.1 — US-17 (Must, Medium)
  - First Sprint Plan Final v1.1 — US-17 acceptance criteria
  - MIS 430 Final Project Information — AI story + observable can’t/shouldn’t criteria; working AI not required
  - Team-approved verification report (2026-11-18) + clarifying design decisions
  - Verified baseline on main @ 85d2577 (post Features 1–2)
---

> **Canonical contract (approved for implementation 2026-11-18; robustness AD-AI-8 on 2026-11-26).** Original ship used `feature/us-17-ai-assistant`. Robustness work uses `fix/ai-assistant-robustness` only. Do not stage `map-src/`, the Elicitation Report PDF, or research-branch map work. Do not silently edit course `docs/`.

# US-17 — Simulated AI Trip Assistant

## Story

**US-17 (Must · Medium):** As a student, I want an AI trip assistant to interpret a trip request written in everyday language and ask me to confirm the locations, so that I can plan a campus trip without navigating multiple menus.

**Sprint 1 scope (course docs):** Scripted simulation of the proposed AI interaction. A working AI integration is not part of Sprint 1 / this prototype.

## Why

Students struggle with multi-step trip entry. The course requires an AI-feature story with observable acceptance criteria, including inability/refusal handling. This feature provides a conversational **alternate entry** into the existing planner using only predefined campus places — without paid APIs or live transit claims.

## Capabilities

- **CAP-1** — Secondary “Ask Trip Assistant” control on the Ride screen opens an assistant panel compatible with the mobile bottom sheet; manual origin/destination fields remain fully usable.
- **CAP-2** — Free-text input plus clickable example prompts; deterministic local interpretation against `places` names/aliases only.
- **CAP-3** — Supported requests surface interpreted origin and destination and require explicit confirmation before any `state.origin` / `state.destination` mutation.
- **CAP-4** — Ambiguous or incomplete requests ask for clarification; never silently pick among matches; never silently drop an unknown place token when multiple place names appear.
- **CAP-5** — Corrections allowed before confirmation (swap/change draft origin or destination within the known place set).
- **CAP-6** — After confirmation, hand off to the existing route-selection flow (`computePlans` / results / walk comparison / Follow This Bus). Planner remains authoritative for routes, stops, and times.
- **CAP-7** — Unsupported / unknown / off-campus destinations are refused without inventing places; live status/delay requests refused; off-topic redirected to trip help.
- **CAP-8** — Persistent visible notice that assistant responses and transit information are simulated.
- **CAP-9** — While `state.trip` is active, assistant cannot change origin/destination (same integrity rule as AD-POI-5).
- **CAP-10** — Preserve Feature 1 route isolation, Feature 2 POI inspect/act model, and manual entry independence. No conversation persistence beyond the session UI; no external network calls.

## Constraints

- HTML/CSS/JavaScript/SVG only — no paid APIs, external AI providers, new npm dependencies, or frameworks.
- Prefer parsing/matching in `dist/ai-assistant.js`, UI wiring in `dist/app.js`.
- Do not alter map geometry, bus route definitions, POI coordinates, or `network.js` entrances.
- Suggested origin (current demo starting point) may be offered but must be explicitly confirmed; never imply verified GPS.
- Course `docs/` are not silently edited; academic-doc impact is proposal-only.

## Non-goals

- Real LLM / cloud AI integration.
- Expanding the place catalog (Delta Zeta, additional halls, off-campus stops).
- Offline OSM basemap migration (`research/offline-campus-map` remains deferred).
- Inventing ETAs, live bus positions, or official Crimson Ride claims in assistant copy.
- Persisting free-text chat logs or sending location data off-device.

## Success signal

Student opens Ask Trip Assistant → sees simulated disclaimer → uses an example or types “Presidential to Bidgood” → confirms → lands in the same ride-results UI as manual entry → Follow This Bus still works. Ambiguous “dorm”, “Publix”, and “where is the bus live?” produce clarification / unsupported / refuse responses without mutating endpoints. Active trip blocks assistant apply. Routing and POI tests unchanged at the Feature 2 baseline.

## Robustness addendum (AD-AI-8, 2026-11-26)

Approved on `fix/ai-assistant-robustness` after the pre-final audit. Extends the scripted interpreter only:

- Shared generic tokens (e.g. bare `hall`) must not invent a full trip; unsupported `* Hall` names stay unsupported. Weak unique name tokens (`village`, `company`, etc.) must not silently resolve to Presidential / Fresh Food; only allowlisted suffixes (`stadium`, `coliseum`, `auditorium`) may unique-resolve.
- Live / delay / next-bus / ETA / “is … running” phrasing → `refuse_live`, with copy that distinguishes unavailable live data from simulated planner results after confirmation. Duration phrasing (`how long…`) refuses unless an explicit `from … to …` trip is present (then confirm/handoff — still no chat-invented times).
- Conservative spelling suggestions against the existing catalog only; always clarify/confirm — never silent replace.
- Automated coverage: curated regression cases plus OD smoke across all 23×22 pairs (smoke only).
- Still out of scope: chat ETAs/route dumps, app FAQ, current-trip Q&A, transfers, new places, external AI.

## Architecture decisions

See Decision Log **AD-AI-1 … AD-AI-8** (technical architecture decisions for this feature). These are **not** graded MIS 430 “BMAD Decision Log override” entries; do not fabricate override records.
