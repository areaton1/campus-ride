# Coleman Connector only — curb centerline (STOP for visual approval)

**Branch:** `feature/place-catalog-batch-1`  
**Scope:** Coleman Connector (`id: coleman`) only. Other five routes not reworked as routes. Shared street edges Coleman uses were retuned to the same centerline (same road = same geometry). No commit/push/merge.

## 1. Root cause

**Not a coordinate-system / scale / transform mismatch.**

| Layer | Space |
|--------|--------|
| `campus-map.svg` | `viewBox="0 0 1080 1341.28"` |
| Map `<image>` | `x=0 y=0 width=1080 height=1341.28` (same units) |
| Route paths | raw `[x,y]` — **no extra transform** |
| Pan/zoom | `viewBox` only |

Remaining misalignment was **polyline geometry**: nodes/vias sitting on or outside one curb of `streets 2001` dual strokes, Second Ave×Bryant intersection parked ~12 map units west of the illustrated avenue, and Coliseum / Bryant / Hackberry south runs that hugged one edge instead of the gutter midpoint.

## 2. Coleman pattern (unchanged)

`cap → capH → uniH → bryantH → colW → colE → colN → second → bryantH → tut → quadW → bidgood → cap`

Stop keys/names unchanged: Gorgas, South Campus, Coleman Coliseum, Tutwiler, The Quad — West, Bidgood.

## 3. Geometry changes (`dist/network.js`)

### Nodes

| Node | Before | After | Notes |
|------|--------|-------|-------|
| `cap` | 350,446 | 350,445 | Capstone gutter |
| `quadW` | 231,563 | 231,564 | Colonial mid |
| `bryantH` | 403,680 | 402,678 | Hackberry × Bryant center |
| `tut` | 208,670 | 210,672 | Bryant west approach |
| `second` | 480,679 | **492,678** | Second Ave sits east of 480 at Bryant |
| `colW` | 401,820 | 401,817 | Hackberry × Coliseum |
| `colE` | 481,819 | 480,815 | Coliseum × Second |
| `colN` | 481,758 | 482,756 | Second Ave |
| `bidgood`, `capH`, `uniH` | — | unchanged | Capstone / East-locked |

### Edges (Coleman corridor)

| Edge | Street | Change |
|------|--------|--------|
| `bidgood–cap` | Capstone | vias y≈443–445 (dual curb ~440–446) |
| `cap–capH` | Margaret | slight north snap |
| `capH–uniH` | Hackberry | denser centerline vias (shared w/ East) |
| `uniH–bryantH` | Hackberry | track x≈409→402 into Bryant |
| `bryantH–colW` | Hackberry | hold x=401 between dual curbs |
| `colW–colE` | Coliseum | lift off south curb; y≈818→815 eastbound |
| `colE–colN` | Second | x≈481–482 |
| `colN–second` | Second | NE diagonal into `[492,678]` |
| `bryantH–second` | Bryant | y=678 gutter |
| `tut–bryantH` | Bryant | y≈673–678 center |
| `quadW–tut` | Colonial | west drift into Tutwiler |
| `bidgood–quadW` | Colonial | hold x≈231 (thin dual-curb) |

Walking entrance vias lightly retouched for `gorgas`, `stadium`, `coleman`, `burke` to meet moved nodes. Buses follow `CampusNetwork.apply` → `r.points` (same polyline as the colored line).

## 4. Visual proof (temp — not ship)

Open: `http://127.0.0.1:8000/_coleman-debug.html`  
Files: `dist/_coleman-debug.html`, `_coleman-debug-data.js`, `_coleman-streets.js` → **delete before commit**.

Screenshots in this folder:

| File | Content |
|------|---------|
| `coleman-full-final.png` | Full loop red=before / blue=after, thin strokes |
| `coleman-capstone.png` | Capstone `bidgood→cap` |
| `coleman-bryant.png` | Bryant `tut→bryantH` |
| `coleman-hackberry-south.png` | Hackberry `bryantH→colW` |
| `coleman-coliseum-v2.png` | Coliseum `colW→colE` |
| `coleman-second-ave.png` | Second Ave `colN→second` (fixed building cut) |
| `coleman-app-isolated.png` | Live app Route Isolation + buses 601/602 |

## 5. Unresolved / needs your eye

- **Colonial Drive (`bidgood–quadW`):** dual curb is thin/interrupted west of the Quad; path held at x≈231 by pair samples — **manual review**, not claimed fixed to ±1 unit.
- **`quadW→tut` approach:** roadway narrows / sidewalk clutter near Tutwiler; centerline confidence lower than Bryant/Coliseum.
- **Production stroke width:** app underlay is thick vs ~0.7px curb strokes — can *look* off-center even when the polyline sits in the gutter. Proof used thin strokes.
- **Other five routes:** not reworked. Shared Capstone / Hackberry / Bryant / Colonial edges now match Coleman-verified centerlines.

## 6. Tests (this session)

```
routing.cjs     → walkingPairs 506, itineraries 5168, noUsefulBus 216, routes 6  OK
poi.cjs         → places 23 OK
ai-assistant.cjs → all checks true, places 23 OK
```

Prior East-session itineraries were **5184**; now **5168** (polyline re-bend). Walking pairs still **506**. Six routes preserved.

## 7. STOP

Do **not** start the other five routes until Coleman centerline method is visually approved. Do not commit/push/merge yet.
