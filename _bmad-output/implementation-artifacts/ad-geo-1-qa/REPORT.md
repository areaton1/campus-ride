# AD-GEO-1 re-trace — visual QA report (STOP before commit)

**Branch:** `feature/place-catalog-batch-1`  
**Changed:** `dist/network.js` only (product). Temp debug: `dist/_geo-debug.html`, `dist/_geo-debug-streets.js`, `dist/_geo-debug-proposal.json` — **delete before final commit**.

## 1. Root cause

**Not a coordinate-system / scale / transform mismatch.**

- Basemap `<image href="campus-map.svg" width="1080" height="1341.28">` and overlay paths share the same SVG user space (`viewBox` pan/zoom only).
- Misalignment was **incorrect presentation polylines**: too few vias, diagonal shortcuts through building fills/lawns, and several nodes sitting off the `streets 2001` curb strokes.
- Prior AD-GEO-1 pass improved some corridors but left large off-street runs (e.g. SC→Bidgood max curb-miss ~28 map units; Uni Blvd west ~18; Colonial ~15).

## 2. Geometry corrected

All work in `CampusNetwork` `nodes` + edge `via` arrays. **Patterns / stop keys / six route ids unchanged.**

| Area | Edges touched |
|------|----------------|
| Presidential / McCorvey | `pv–north`, `pv–riverE`, `north–lake`, `lake–paty`, `paty–sc` |
| Stadium / Marrs / Capstone / Colonial | `sc–bidgood` (west then south on real streets — no building diagonal), `sc–west`, `west–westCap`, `westCap–bidgood`, `bidgood–cap`, `bidgood–quadW` |
| Quad / Hackberry / Uni Blvd | `cap–capH`, `capH–hub`, `hub–eng`, `eng–hackN`, `hackN–riverE`, `lake–hackN`, `cap–quadE`, `quadE–uniH`, `capH–uniH`, `uniH–uniE`, `uniH–bryantH` |
| East / Rec / Bryce | `hub–eastHub`, `eastHub–recN`, `recN–rec`, `rec–recS`, `recS–uniE`, `eastHub–bryceS`, `hackN–bryceS`, `bryceS–bryceE`, `bryceE–bryceN`, `bryceN–bryceS`, `bryceE–recN` |
| Bryant / Coleman | `quadW–tut`, `tut–bryantH`, `bryantH–second`, `second–bryantE`, `uniE–bryantE`, `bryantH–colW`, `colW–colE`, `colE–colN`, `colN–second` |

Shared corridors reuse the same edge geometry across routes (Campus Loop / West / North / Coleman as before).

## 3. Before / after visuals

Temp overlay: `http://127.0.0.1:8000/_geo-debug.html` (red = prior, lime = corrected).

Saved under `_bmad-output/implementation-artifacts/ad-geo-1-qa/`:

| File | Content |
|------|---------|
| `west-before-after.png` | West + Stadium/Marrs corridor |
| `campus-loop-after.png` | Campus Loop after |
| `east-before-after.png` | East Campus |
| `bryce-before-after.png` | Bryce loop |
| `coleman-before-after.png` | Coleman / south campus |
| `app-campus-loop-isolated.png` | Live app Route Isolation + buses |

## 4. Still uncertain / residual

- **Colonial Drive** (`bidgood–quadW`): streets layer is thin west of the Quad; path held at x≈231 by eye — may sit slightly off true centerline.
- **BryceE→recN** connection: parking/access geometry; path follows illustrated access roads but is not a single named arterial.
- **Rec access** (`rec–recS`): tight curves; illustrative.
- **Curb vs centerline**: basemap strokes are ~0.7px curb outlines; routes aim for corridor centers — residual ±few map units possible on dual-curb streets.
- **No confident direct “Stadium Drive” diagonal** between SC and Bidgood in `streets 2001`; campus loop now uses Campus Dr West → N–S Marrs corridor → Capstone (same street space as West Loop approaches).

## 5. Automated tests (this session)

```
node tests/routing.cjs  → {"walkingPairs":506,"itineraries":5184,"noUsefulBusCases":216,"routes":6}  exit 0
node tests/poi.cjs      → {"places":23,...,"previewOk":true,"tripLockOk":true}  exit 0
node tests/ai-assistant.cjs → all checks true, places:23  exit 0
```

Prior post-geometry snapshot had itineraries **5296**; now **5184** (longer/re-bent polylines change timing usefulness). Walking pairs still **506**. Six routes preserved.

## 6. Simulated buses

`CampusNetwork.apply(routes)` rebuilds `r.points`; bus timelines are derived from those points in `app.js`. Route Isolation shows buses 101/102 only on Campus Loop; markers interpolate along the corrected polylines.

## 7. Regressions

- Itinerary count 5296 → 5184 (timing/usefulness shift only; not connectivity loss).
- `noUsefulBusCases` stayed **216**.
- POI count **23**, patterns/stop name keys unchanged.
- Basemap `campus-map.svg` **not** modified.

## Review checklist before commit

1. Open `_geo-debug.html`, toggle red/lime per route at high zoom.
2. App → Routes → isolate each of the six; confirm buses stay on colored lines.
3. Delete `dist/_geo-debug*` before shipping commit.
4. Do not merge/push until visual sign-off.
