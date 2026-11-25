# Coleman — why corrections weren’t visible (NOT approved)

**Verdict: Coleman is not complete.** Do not treat prior “final approval” as valid.

## Step 1 — Is the app showing new geometry?

| Check | Result |
|--------|--------|
| Branch | `feature/place-catalog-batch-1` |
| `python3 -m http.server` on :8000 | serving `dist/` |
| `curl /network.js` MD5 vs disk | **identical** (`2ad7953e…` at session start; file rewritten since) |
| DOM `[data-line=coleman]` vs `CampusNetwork.apply` | **`renderedMatchesApply: true`** |
| Hardcoded `app.js` coleman points | stale fallback only; **overwritten by `apply()`** |

**Not a cache/server miss.** The app was already drawing the edited `network.js` polyline.

Proof page and app share the same SVG user space (`1080×1341.28`, no extra transform).

## Step 2 — How big were the “corrections”?

| Compare | Max polyline deviation | Colonial N–S |
|---------|------------------------|--------------|
| Ancient hardcoded `app.js` vs apply | **~38 map units** | large (never what you were reviewing) |
| Pre–Coleman-pass AD-GEO vs prior “fixed” | **~7–11 u** (mostly `second`) | Colonial **~1–2 u** (x≈231→231–233) |
| Prior “fixed” vs this session | **~4.7 u** max | Colonial **~3–5 u west** (x≈231–233 → **229**) |

**Explicit:** the earlier Coleman “success” on Colonial was **too small to see**. App stroke when isolated is ~**3.7–4.4** map units (underlay ~**4.6–6.5**). A **1–2 unit** centerline nudge is buried inside the stroke. Reporting pass based on tests alone was wrong for visual acceptance.

Thin BA overlays in the **actual app** (same viewport):

- `app-ba-colonial-final.png` / `app-ba-colonial-v229.png` — dashed red = geometry you were seeing; solid blue = this session  
- `app-colonial-production.png` — normal thick Coleman stroke only  

On thin strokes, red vs blue **is** separable (~3–5 u west on Colonial). Under production thickness, improvement is still subtle.

Largest earlier change that *should* have been noticeable: **`second` [480→492]** (~12 u) on the SE loop — not Colonial.

## Step 3 — What we changed this session (Colonial / Tut)

In `dist/network.js` only:

- `bidgood–quadW`: hold **x≈229** (was ~231–233)  
- `quadW`: `[229,564]`  
- `quadW–tut` / `tut`: west approach to **`tut:[206,672]`**  
- West route **inherits** the same Colonial edges (shared street)

No other five routes reworked as routes. Patterns/stops unchanged.

## Step 4 — Remaining inaccurate / not demonstrably centered

- **Colonial mid-block:** still not a confident dual-curb mid; thick stroke still reads east-biased in production shot.  
- **Tut / Bryant corner:** approach approximate; intersections need eye.  
- **Hackberry / Coliseum / Second:** not re-audited this pass for visible center.  
- **Structural:** production stroke width ≈ half a narrow roadway — ±2 u error is hard to judge without thin-stroke QA in-app.

## Tests

```
routing: 506 / 5168 / 216 / 6
poi: 23 OK
ai-assistant: OK
```

## Can alignment be demonstrated?

| Question | Answer |
|----------|--------|
| App loading new geo? | **Yes** |
| Prior Colonial fix visible in app? | **No — too small** |
| This session Colonial shift visible on thin BA overlay? | **Yes (~3–5 u west)** |
| Confident centerline under production stroke? | **No — not yet** |
| Coleman approved? | **No** |

**STOP.** Do not start other routes / commit / push / merge until a human confirms a clear gutter-centered line in the **normal** app stroke at Colonial + Tut.
