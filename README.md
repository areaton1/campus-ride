# Campus Ride — UA Campus Bus Prototype (MIS 430)

Buildless HTML, CSS, JavaScript, and SVG prototype of an Uber-inspired University of Alabama campus bus experience. No React, Leaflet, backend, database, live transit feeds, or app npm dependencies.

**Team:** Jade De Jesus (PM) · Tyler Staples (data & systems) · Brett Malik (technical/architecture) · Ashton Eaton (UI/UX & prototype)

**Stable branch:** `main`

**Repo:** https://github.com/areaton1/campus-ride (private)

---

## Repository layout

| Path | Purpose |
|------|---------|
| `dist/` | Working prototype (run this) |
| `tests/` | Routing validation (`routing.cjs`) |
| `docs/` | MIS 430 course / project documents |
| `_bmad/` | BMAD v6.12.4 configuration (already installed) |
| `.agents/skills/` | Cursor-compatible BMAD skills |
| `_bmad-output/` | Future BMAD planning and implementation artifacts |
| `AGENTS.md` | Project rules for AI agents and contributors |

Course documents live in `docs/`. Keep personal interview notes and sensitive academic materials out of the README.

### Prototype files

- `dist/index.html` — interface and styles
- `dist/app.js` — places, search, trip planner, bus simulation, browser-local favorites
- `dist/network.js` — street traces, route patterns, pedestrian graph, entrances
- `dist/mobile.js` — mobile welcome overlay and draggable three-position bottom sheet
- `dist/campus-map.svg` — simplified vector geography from UA’s 2014 campus reference map

---

## Access the private repository

1. Ask Ashton (repo owner) to add you as a collaborator on `areaton1/campus-ride`.
2. Accept the GitHub invitation (email or GitHub → notifications).
3. Confirm you can open https://github.com/areaton1/campus-ride while signed into GitHub.

Without collaborator access, clone will fail.

---

## Prerequisites

### To run Campus Ride

| Tool | Why |
|------|-----|
| **Git** | Clone and contribute |
| **Cursor** (or VS Code) | Edit and use BMAD skills |
| **Node.js** (includes `npm` and `node`) | `npm run dev` wrapper + `node tests/routing.cjs` |
| **Python 3** | Local static file server |

No API keys. No paid services. No `node_modules` required for the app.

**Optional:** `npm install` does nothing useful today (zero dependencies). Skip it unless you prefer initializing a local npm project.

#### macOS / Linux notes

- Prefer installs that provide a `python3` command on your PATH (Homebrew Python or the system Python usually does).
- Confirm with: `python3 --version`, `node --version`, `git --version`.

#### Windows notes

- Install Git for Windows, Node.js LTS, and Python 3 (check **Add python.exe to PATH**).
- The repo’s `npm run dev` script calls `python3`. If Windows only provides `py` or `python`, use the fallback in [Run the app](#run-the-app) instead of changing `package.json`.

### To run BMAD workflow scripts (separate from the app)

BMAD files are **already committed**. Do **not** run `npx bmad-method install` just to use them.

Some BMAD skills call Python helpers via `uv run …`. Install [uv](https://docs.astral.sh/uv/) only if you will execute those BMAD scripts. You do **not** need `uv` to open the app or run routing tests.

---

## Clone and open in Cursor

### Option A — Terminal (Git)

```bash
git clone https://github.com/areaton1/campus-ride.git
cd campus-ride
```

### Option B — Cursor

1. Cursor → **Clone Repo** (or Command Palette → “Git: Clone”).
2. Paste `https://github.com/areaton1/campus-ride.git`.
3. Choose a folder on your machine (avoid unusual spaces if you can).
4. When prompted, open the cloned folder in Cursor.

Confirm the open folder is the repo root (you should see `dist/`, `package.json`, `README.md`, `_bmad/`, `.agents/`).

---

## Run the app

From the repo root:

```bash
npm run dev
```

That runs: `python3 -m http.server 8000 --directory dist`.

Open: http://localhost:8000

Stop the server: focus the terminal → **Ctrl + C** (macOS and Windows).

`npm run start` is the same as `npm run dev`.

### Windows fallback when `python3` is missing

If `npm run dev` fails because `python3` is not found:

```bash
py -3 -m http.server 8000 --directory dist
```

Then open http://localhost:8000. Do not change `package.json` for this; use the fallback locally.

### Quick smoke check

1. Map loads with campus geography and bus markers.
2. Start from Presidential Village → choose Student Center or Bidgood Hall → select a route → **Follow this bus**.
3. Trip advances through walking / waiting / riding / final walk / arrival.
4. **Next demo stage** jumps ahead; speed controls change 1× / 2× / 3×.
5. Narrow the window to phone width: sliding welcome pane appears, and the bottom sheet snaps to three heights.

All routes, stops, vehicles, and ETAs are **illustrative demo data**, not verified live Crimson Ride. Location is simulated; no GPS / location permission is requested. The map is based on a historic UA reference and is not for real navigation.

### Port 8000 already in use

That usually means another process (often a leftover Campus Ride server) is bound to 8000 — not an app bug.

- Stop the other server (**Ctrl + C** in that terminal), **or**
- Close the process using port 8000, then run `npm run dev` (or the Windows fallback) again.

---

## Run routing validation

After changes to places, routes, or network geometry — and once after a fresh clone to confirm your environment:

```bash
node tests/routing.cjs
```

Recent successful snapshot (observed counts, **not** a fixed acceptance contract; approved routing changes may change them):

```json
{"walkingPairs":182,"itineraries":1904,"noUsefulBusCases":64,"routes":6}
```

If the command throws an assertion error, something in the routing model broke. If it prints JSON and exits 0, validation passed for this run.

---

## BMAD in Cursor (already installed)

Committed install: **BMAD 6.12.4** (`_bmad/_config/manifest.yaml`). Skills live in `.agents/skills/` (Cursor project skill directory).

Teammates do **not** need to reinstall BMAD to use the committed skills and config.

### Use skills

1. Open this repo in Cursor (folder must be the project root).
2. In Agent chat, type `/` and search for a skill (examples: `bmad-help`, `bmad-agent-pm`, `bmad-spec`).
3. Or ask naturally, e.g. “bmad help” / “talk to Mary”.

### Verify Cursor sees them

1. Cursor sidebar → **Customize** → **Skills** (skills appear under Agent Decides), **or**
2. Type `/` in Agent chat and confirm `bmad-*` skills appear.

If skills are missing: reopen the **repo root** (not a parent folder), wait for Cursor to index, or restart Cursor. Do not reinstall BMAD unless the team explicitly decides to upgrade.

### Config note

`_bmad/config.user.toml` was created by the original installer and currently names the installer user. Do **not** casually overwrite that committed file. Personal overrides belong in `_bmad/custom/config.user.toml` (gitignored) if you need local tweaks.

Agent project rules: see `AGENTS.md`.

---

## Safe Git workflow (team)

Keep `main` stable. Do experimental work on feature branches. Review via pull request before merging.

1. Pull the latest `main`:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Create a focused feature branch:
   ```bash
   git checkout -b feature/short-task-name
   ```
3. Make a small, related change.
4. Test appropriately:
   - Always: `npm run dev` (or Windows fallback) + smoke check above.
   - If you changed places, routes, or network geometry: `node tests/routing.cjs`.
5. Review what changed:
   ```bash
   git status
   git diff
   ```
6. Stage **only** the relevant files (do not use `git add .` as the default):
   ```bash
   git add path/to/file1 path/to/file2
   ```
7. Commit with a descriptive message:
   ```bash
   git commit -m "Describe why this change exists."
   ```
8. Push the feature branch:
   ```bash
   git push -u origin feature/short-task-name
   ```
9. Open a **pull request** into `main` on GitHub for team review.
10. Merge only after review/approval.

- **Do not** push unfinished or experimental work straight to `main`.
- **Do not** force-push or overwrite teammates’ branches.
- **Do not** stage unrelated local files (for example personal notes or untracked course PDFs that are not part of the change).

---

## Demo notes

Start at Presidential Village, choose Student Center or Bidgood Hall, select a route, and press **Follow this bus**. The trip advances through walking, waiting, riding, final walking, and arrival. The default clock is accelerated 3×; controls offer 1×, 2×, and 3×. Twelve smaller bus markers follow six illustrative campus routes (north, west, east, Bryce, recreation, Coleman). The blue student marker walks to the stop, waits, follows the selected bus, and walks to the destination. **Next demo stage** advances without waiting.

When you pick a destination, the planner shows available simulated route options. Departures and arrivals stay fixed for the selected itinerary once a trip is underway; **Refresh departures** (on the ride results view) clears the plan cache and requests a new set of simulated options. Map controls pause, change speed, reset, zoom, and recenter. On phones (viewport ≤ 680px), a sliding welcome pane opens the app and a draggable bottom sheet snaps to three heights. Click a bus to inspect its route.

Font stack prefers Uber Move if already installed; otherwise Helvetica Neue / Arial. No proprietary font files are bundled.

### Street and walking geometry

`dist/network.js` holds shared street traces, six route patterns, a separate pedestrian graph, and entrance connectors. Streets are traced against the bundled UA 2014 map; pedestrian corridors and entrances remain illustrative where the old reference lacks sidewalk detail. Not current navigation or official Crimson Ride data.

Walk geometry drives the dotted path, traveler animation, and timing. Distance uses ~2.65 meters per map unit; walking uses 1.35 m/s. Each bus stops 30 seconds; its timeline drives fixed departures and arrivals. New searchable places need an entrance **and** a connected pedestrian spur before search. There is no straight-line routing fallback.

Saved places and optional custom names stay in this browser’s local storage (`campus-saved` / `campus-saved-labels`). Trip alerts are in-app only. No GPS or external APIs.

---

## Sources

- Campus reference geometry: https://alabamamaps.ua.edu/contemporarymaps/campus/2D%20Campus%20Map%206-18-14.pdf
- Official UA TripShot information: https://crimsonride.ua.edu/tripshot/
- Uber interface references: https://base.uber.com/ and https://www.uber.com/us/en/u/redesigned-uber-app/
