# AD-GEO-1 / place-catalog development artifacts archive

Recoverable copies of non-shipping files removed from `dist/` before PR.

## Exports (preserve permanently)
- `exports/_*-manual-export.json` — six manual route geometry exports (source of truth for freeze)

## Temporary editors / overlays (must not ship)
- `_coleman-debug.html` + supporting `_coleman-*.js`
- `_east-debug.html` + `_east-debug-*.js` + `_east-proposed.json`
- `_geo-debug.html` + `_geo-debug-*.js|json`
- `_shared-edge-review.html`

## Shipping surface (`dist/`)
Keep: `index.html`, `app.js`, `network.js`, `mobile.js`, `ai-assistant.js`, `campus-map.svg`, CSS/assets referenced by index.

Do not serve underscore-prefixed `_*.html` tools from production static hosting.
