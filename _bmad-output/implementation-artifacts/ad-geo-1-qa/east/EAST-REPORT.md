# East route only — precision alignment (STOP for visual approval)

**Branch:** `feature/place-catalog-batch-1`  
**Scope:** East Campus (`id: east`) only. No other routes reworked. No commit/push/merge.

## 1. Coordinate diagnosis

| Layer | Space |
|--------|--------|
| `campus-map.svg` | `viewBox="0 0 1080 1341.28"` |
| Map `<image>` | `x=0 y=0 width=1080 height=1341.28` (same units) |
| Route paths | `pathD` → raw `[x,y]` — **no extra transform** |
| Pan/zoom | `viewBox` only (`setView`) |

**Verdict:** Remaining East misalignment was **polyline geometry**, not a scale/transform bug. Thick production underlays can still *look* wide relative to thin street gutters; proof used thin strokes.

## 2. East pattern (unchanged)

`hub → eastHub → recN → rec → recS → uniE → uniH → capH → hub`

Stops (unchanged keys/names): Transit Hub, Recreation North, Recreation Center, East Campus.

## 3. Edges / nodes updated (East corridor only)

**Nodes:** `hub`, `eastHub`, `recN`, `rec`, `recS`, `uniE`, `uniH`, `capH` (small snaps onto illustrated corridors).

**Edges:** `capH–hub`, `hub–eastHub`, `eastHub–recN`, `recN–rec`, `rec–recS`, `recS–uniE`, `uniH–uniE`, `capH–uniH`.

Shared street edges also used by other routes now match the East-verified centerlines (same road = same geometry). Non-East edges untouched.

## 4. Visual proof (temp — not ship)

Open: `http://127.0.0.1:8000/_east-debug.html`  
Files: `dist/_east-debug.html`, `_east-debug-data.js`, `_east-debug-streets.js` → **delete before commit**.

Screenshots in this folder:
- `05-full-before-after-final.png` — red before / blue after, full loop
- `02-eastHub-recN.png`, `03-rec-recS.png`, `04-uniH-uniE.png` — segment closeups
- `06-uniH-uniE-after.png`, `07-full-after-only.png`

## 5. Tests (this session)

```
routing.cjs → walkingPairs 506, itineraries 5184, noUsefulBus 216, routes 6  OK
poi.cjs     → places 23 OK
ai-assistant.cjs → OK
```

Buses follow `r.points` from `CampusNetwork.apply`; East Isolation shows 401/402 only.

## 6. Unresolved / needs your eye

- **`rec → recS` recreation access:** kinked driveway; blue follows illustrated access better than before, but not a named arterial — confirm at high zoom.
- **`uniH ↔ uniE` University Blvd:** hand-traced on boulevard density ridge; nearest-stroke auto-snap was abandoned because parking strokes pulled vias off-road. Confirm mid-boulevard sits in the street gutter, not the south parking lattice.
- **`eastHub → recN`:** follows Campus Drive East curve; construction/parking clutter on the 2014 basemap — confirm the NE approach into Rec North.

## 7. STOP

Do **not** start the other five routes until East is visually approved. Do not commit/push/merge yet.
