---
title: 'US-17 AI Assistant Robustness'
type: 'bugfix'
created: '2026-11-26'
status: 'done'
route: 'oneshot'
review_loop_iteration: 1
context:
  - '{project-root}/_bmad-output/specs/spec-us-17-ai-assistant/SPEC.md'
  - '{project-root}/_bmad-output/specs/spec-us-17-ai-assistant/acceptance-criteria.md'
  - '{project-root}/_bmad-output/planning-artifacts/decision-log.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The scripted US-17 assistant falsely confirms trips from shared tokens like “Hall” / “Hardaway Hall”, under-refuses live/ETA phrasing, and lacks curated regression coverage after the 23-place catalog.

**Approach:** Expand automated tests (failing hall traps first), then harden `dist/ai-assistant.js` for shared-token matching, live-status refusal, conservative NL trip cues, and catalog-only spelling suggestions that always clarify/confirm — without chat ETAs, FAQ, new places, or planner changes.

## Boundaries & Constraints

**Always:** Confirm-before-apply; AD-AI-1…6; place universe = existing `places` only; planner remains authoritative for routes/stops/ETAs; preserve clarify/draft/trip-lock; branch `fix/ai-assistant-robustness` from `7c03d52`.

**Never:** External AI/APIs; new locations/routes/geometry; transfers; chat-calculated ETAs/route recommendations; app FAQ / current-trip Q&A; academic/`docs/`/OneDrive edits; invent graded BMAD overrides; touch unrelated untracked files.

</frozen-after-approval>

## Implementation Notes

- Pre-fix: `Hall` / `Hardaway Hall` asserted `confirm` Bidgood→Shelby (failing regression demonstrated).
- Post-fix: generic single-token phrases excluded from distinctive hits; unique name tokens (e.g. Stadium) still resolve; unresolved origin segments surface as unsupported (AC-10).
- LIVE_RE expanded for ETA/next-bus/how-long/when-should-I-leave; avoided bare `\blate\b` / `arrive at` over-refuse.
- Spelling: edit distance 1 on distinctive catalog phrases ≥5 chars → clarify only.
- NL: `I am at` / `starting at` / `headed to … from …` segment extractors.
- Verification: `node tests/{routing,poi,ai-assistant}.cjs` all exit 0 — curatedCases 113, odSmoke 506×2.
- Docs: AD-AI-8; US-17 SPEC addendum; AC-6/10/17/18; AC-R2→23 places; AC-R3 expanded.

## Review Triage Log

- LIVE_RE over-refuse late/arrive — **high** — patched (tightened LIVE_RE; STOP late/tonight).
- Generic origin silently dropped — **high** — patched (unresolved origin → unsupported).
- headed to … from … broken — **medium** — patched.
- Unique-name village/company auto-resolve — **medium** — deferred (see deferred-work.md).
- Duration/how-long gaps — **medium** — patched (how long / when should I leave → refuse_live).
- SPEC branch header conflict — **low** — patched.
- AC-17/18 ordering — **low** — patched.
- Impl artifact still in-progress — **low** — patched (this file → done).
- Clarify ternary no-op — **low** — patched.
- EXAMPLE chips not extended — **low** — deferred.
- Bare ten hoor vs trip-cue — **false**/documented via tests — refuse_off_topic vs unsupported intentional.
- Live message under-asserted — **medium** — patched (assert cannot verify live + simulated).
