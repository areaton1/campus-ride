<!-- bmad:context -->
<!-- Verified 2026-11-11 against f24ccf24c52f3c4ad293433b3892cbe1db4d50fc. Managed by bmad-project-context; edits inside this block are replaced on refresh. Keep anything you want preserved outside the markers. -->

## campus-ride

Brownfield MIS 430 academic prototype: Uber/Lyft-style UA campus-bus redesign of TripShot. Buildless HTML/CSS/JavaScript/SVG in `dist/` — no framework, backend, database, or live transit feeds by default. BMAD artifacts go in `_bmad-output/`. Course requirements live in MIS 430 documents under `docs/` (SOW, elicitation, backlog/MoSCoW, estimates, current/future process models, assignment instructions). Treat those imported copies as project knowledge; do not invent missing requirements or claim unread docs were reviewed.

## Policy

- Preserve the working prototype; never rebuild or migrate off the HTML/JavaScript/SVG stack unless an approved feature genuinely requires it and the team approves.
- Separate **verified implemented** (confirmed from current code/tests), **required but incomplete** (course/approved docs), and **potential enhancements** (discussed, not approved). Never claim a feature works solely because a message or academic doc mentions it.
- Current-state process model = existing TripShot experience. Future-state = intended Campus Ride redesign. This repo’s prototype implements part of the future-state — it is not the current-state system. `package.json` version 3.0.0 is not the current-state process model.
- AI is a remaining course requirement; design is not finalized. Prefer a practical classroom prototype. Do not auto-add paid APIs, external AI providers, hosted DBs, or other dependencies. Do not assume a scripted chatbot satisfies the AI requirement — evaluate assignment grading criteria and project docs first.
- Accurate routes, path-following upgrades, saved-places work, additional/off-campus stops, and similar ideas are potential enhancements — not approved implementation tasks until the team explicitly approves them.
- Before proposing or building a feature: check SOW scope, backlog/user stories, future-state process model impact, doc updates needed, new dependencies, and course deadline. Do not silently edit approved academic docs — propose changes and wait for approval. If provided docs conflict, report the conflict; do not pick a side.
- BMAD supports analysis, planning, implementation, review, testing, and doc alignment in the lifecycle — demonstrate useful contribution, not install-only. Do not duplicate existing MIS 430 deliverables or treat BMAD’s greenfield defaults as permission to discard established requirements.
- Do not reassign team roles (Ashton: UI/UX & prototype; Tyler: data & systems; Brett: technical/architecture; Jade: project manager). Agents assist; the team owns decisions and academic deliverables.
- Git: `main` is the stable baseline; keep BMAD integration on `setup/bmad-integration` until approved merge; use separate feature branches for app work; no direct commits to `main` for experimental work; no push, merge, or destructive Git without explicit approval. Inspect-only Git is fine.
- Do not skip ahead to feature implementation before requirements and planning decisions are approved. Do not modify `dist/` during BMAD setup/context-only work.

## Where things are

- App: `dist/index.html`, `dist/app.js`, `dist/network.js`, `dist/mobile.js`, `dist/campus-map.svg`
- Routing validation: `tests/routing.cjs`
- BMAD: `_bmad/`, skills in `.agents/skills/`, outputs in `_bmad-output/`
- Project knowledge: `docs/` (imported MIS 430 course documents)

## Running and verifying

- After places/routes/network geometry changes, run `node tests/routing.cjs` (not wired as `npm test`). Do not claim tests passed unless they were run successfully this session.
- Prior routing counts (e.g. walkingPairs/itineraries) are observed snapshots, not permanent acceptance numbers — approved routing changes may change them.
- Port 8000 already in use is an environment conflict, not automatic app failure. Do not add testing frameworks or build tools without approval.

## Conventions that differ from defaults

- Simulated routes, stops, vehicles, and ETAs are illustrative demo data — never present them as verified live Crimson Ride services. Official routes may be referenced (e.g. crimsonride.ua.edu) but current geometry is not an exact match claim.
- New searchable places need an entrance plus a connected pedestrian spur in `dist/network.js` before search; there is no straight-line routing fallback. Do not replace the network/routing implementation without analysis and approval.

<!-- /bmad:context -->
