# Coleman manual centerline tracer — ready for review

**STOP here.** Production `dist/network.js` was **not** modified in this step.

## Coordinate verification

| Layer | Mapping |
|--------|---------|
| `campus-map.svg` | `viewBox="0 0 1080 1341.28"` |
| App + debug `<image>` | `x=0 y=0 width=1080 height=1341.28` |
| Route / click points | raw SVG user units |
| Pan/zoom | `viewBox` only |

**Verdict:** no scale/transform mismatch. Clicks map 1:1 into `network.js` coordinates. Round-trip check in-page: OK.

## Tool

Open: `http://127.0.0.1:8000/_coleman-debug.html`

- Mode **Trace (manual centerline)** (default)
- Old/proposed routes **hidden** by default (optional ghost dash)
- Click = add centerline point · drag handle = move · Backspace / right-click / dblclick = delete
- Space+drag or **Pan** tool = pan · wheel = zoom
- Thin preview polyline only — **no auto Bézier / smoothing**
- **Export geometry** / **Copy JSON** → `{ id, points, coordSpace, networkJsSnippet }`
- **Seed from old route** optional starting polyline to drag onto curbs

Apply exported points to the app only after you approve the trace visually.
