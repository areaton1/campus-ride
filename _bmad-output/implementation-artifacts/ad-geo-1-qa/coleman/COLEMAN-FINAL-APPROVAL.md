# Coleman Connector — final verification (STOP for approval)

**Branch:** `feature/place-catalog-batch-1`  
**Product change:** `dist/network.js` only (Coleman corridor + shared Colonial edges West also draws).  
**No commit / push / merge. Other five routes not reworked.**

## Proof visuals (blue only)

Proof page: `http://127.0.0.1:8000/_coleman-debug.html`  
Mode **Compare** · curb strokes on · **proposed (blue) on** · old red / nodes / vias **off**.

| File | What |
|------|------|
| `coleman-colonial-blue-only.png` | `bidgood–quadW` Colonial |
| `coleman-quadW-tut-blue-only.png` | `quadW→tut` toward Tutwiler |
| `coleman-full-blue-only.png` | full Coleman loop, blue only |
| `coleman-app-final.png` | live app Route Isolation + buses 601/602 |

## Colonial pass (this session)

Where dual curb pairs were readable (≈y 525–565 and Tut approach), vias nudged onto mid-gutter (`x≈231–233` mid-block; west drift `229→209` into Tut).  
**Still uncertain:** Colonial mid-block ≈y 450–520 — street strokes sparse/interrupted; held `x≈231` rather than invent a centerline. Flag for eye if you zoom there.

## `second` node impact

| Check | Result |
|--------|--------|
| Patterns using `second` | **Coleman only** (campus/north/west/east/bryce: no) |
| `second` in `stopNames` | **No** — not a passenger stop |
| Coleman stops | Gorgas, South Campus, Coleman Coliseum, Tutwiler, Quad West, Bidgood — unchanged |
| Edges | `bryantH–second`, `colN–second` (Coleman); `second–bryantE` exists but **no route pattern uses it** |

Moving `second` `[480,679]→[492,678]` does **not** move other routes’ polylines or stop markers. West **does** share Colonial / Bryant / Capstone edges — same-road geometry updates there (not a separate West rework).

## Itinerary 5296 → 5168

`tests/routing.cjs` counts every `computePlans()` result for each place×place pair at times `{0,301,1200,5000}`.

- **Walking pairs: 506 → 506** (full place graph still connected)
- **`noUsefulBusCases: 216 → 216`** (same empty-plan count)
- **Itineraries: 5296 → 5168 (−128, ~2.4%)**

Cause: longer / re-bent bus polylines change segment timing and the usefulness gate (`walkIn+walkOut < walkDirect×0.95`). Plans that were barely “useful” drop out; this is timing/usefulness, **not** lost connectivity or broken boarding. Six routes remain. **No unacceptable routing regression** by those invariants.

(Intermediate: early AD-GEO → 5184; Coleman centerline → 5168.)

## App check

Route Isolation → Coleman: buses **601/602** interpolate on `r.points` (CDP path distance **0**). Stops/pattern unchanged. Thick production stroke can still *look* wider than thin proof gutters — use blue-only proof for curb judgment.

## Tests (this session)

```
routing.cjs      → {"walkingPairs":506,"itineraries":5168,"noUsefulBusCases":216,"routes":6}
poi.cjs          → places 23 OK
ai-assistant.cjs → all checks true, places 23
```

## STOP

Approve Coleman method before applying to the other five routes. Do not commit/push/merge yet.
