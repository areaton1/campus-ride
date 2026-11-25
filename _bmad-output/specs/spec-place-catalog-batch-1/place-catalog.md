# Place catalog — Batch 1 (companion)

Proposed place records for implementation. **Ids are stable recommendations** — change only with a SPEC note if collision appears.

Illustrative placement only. Nearest walk nodes are targets for entrance spurs, not GPS.

| Proposed id | Display name | Suggested type | Category (illustrative) | Nearest walk node | Notes |
|-------------|--------------|----------------|-------------------------|-------------------|-------|
| `rodgers` | Rodgers Library | `book` | Library · Science & Engineering | `eng` (alt `hub`) | Alias: rodgers, rogers, science library. Distinct from Gorgas/Bruno. |
| `bruno` | Bruno Business Library | `book` | Library · Culverhouse | `bidgood` | Alias: bruno, business library. Near Bidgood/Alston. |
| `fresh-food` | Fresh Food Company | `building` | Dining · Engineering quad | `capH` (alt `cap`) | Alias: fresh food, fresh foods, ffc. Not Lakeside Dining. |
| `student-services` | Student Services Center | `building` | Student services | `sc` | Alias: student services, ssc, registrar building (careful — not the office name alone if too vague). |
| `alston` | Alston Hall | `building` | Culverhouse College of Business | `bidgood` (alt `westCap`) | Alias: alston, mary hewell alston. |
| `burke` | Burke Hall | `home` | Residence hall | `bryantH` (alt `uniH`) | Alias: burke, burke hall, burke dining (dining is in-building — optional alias). `type:'home'` grows dorm clarify list. |
| `foster` | Foster Auditorium | `building` | Auditorium · South Quad | `quadE` | Alias: foster, foster auditorium. |
| `lloyd` | Lloyd Hall | `building` | Academic · The Quad | `cap` (alt `quadE`) | Alias: lloyd. |
| `lakeside-hall` | Lakeside Hall | `home` | Residence hall · North campus | `lake` | **Must not reuse** existing `lakeside` (Lakeside Dining). Prefer `check:true` until wing footprint is confidently chosen. |

## Alias / ambiguity rules

| Phrase | Expected behavior |
|--------|-------------------|
| `lakeside dining`, `lakeside food` | → existing `lakeside` |
| `lakeside hall`, `lakeside dorm`, `lakeside residential` | → `lakeside-hall` |
| bare `lakeside` | **Clarify** between Dining and Hall (do not silently pick) |
| `library` / `the library` | Clarify among Gorgas, Rodgers, Bruno (existing library filter grows) |
| `dorm` / `residence` | Clarify among all `type:'home'` including Burke + Lakeside Hall |
| `bruno` / `rodgers` / `foster` / etc. | Unique hit → confirm/match as today |

Existing `lakeside` aliases (`lakeside dining food`) should be tightened if needed so bare “lakeside” does not uniquely bind dining after Hall ships.

## Visual verification checklist (implement-time)

For each id before merge:

1. Eye-match `visual` to a single SVG `buildings` footprint near the named landmark cluster.  
2. Place entrance on building edge facing the spur; `via` follows open corridor space — not through other footprints.  
3. Set `check:true` when footprint identity is uncertain but neighborhood is acceptable.  
4. If no confident footprint → **drop from this PR** and note under AD-PLACE-5 / PR description.

## Explicitly excluded (Batch 1)

| Place | Reason |
|-------|--------|
| ten Hoor Hall | Dense west-cluster footprint ambiguity |
| Hardaway Hall | Eng/7th Ave lookalike footprints |
| Student Center Parking Deck | Deck vs lot hatch ambiguity |
| Delta Zeta | 2014 SVG vs rebuilt Magnolia house identity risk |
| Any new bus routes / basemap swap | Out of feature scope |

## Expected counts (if all nine ship)

| Metric | Before | After |
|--------|--------|-------|
| Searchable places | 14 | 23 |
| `walkingPairs` | 182 | 506 |
| POI markers | 14 | 23 |

Prior counts are snapshots, not permanent acceptance numbers (`AGENTS.md`).
