# Campus — UA Bus Presentation Prototype

A buildless HTML, CSS, and JavaScript prototype of an Uber-inspired campus bus experience. No React, Leaflet, external API calls, server, or package dependencies are used by the app.

## Files

- `dist/index.html`: responsive interface and styles.
- `dist/app.js`: location directory, illustrative route paths, search, trip planner, bus simulation, and browser-local favorites.
- `dist/mobile.js`: sliding mobile welcome and draggable three-position bottom sheet.
- `dist/campus-map.svg`: simplified vector geography from the University of Alabama's 2014 campus reference map, with most original labels removed.

## Demo

Start at Presidential Village, choose Student Center or Bidgood Hall, select a route, and press **Follow this bus**. The trip advances through walking, waiting, riding, final walking, and arrival. The default clock is accelerated 3 times; controls offer 1×, 2×, and 3×. Twelve smaller bus markers follow six illustrative campus routes, covering north, west, east, Bryce, recreation, and Coleman. The blue student marker walks to the stop, waits, follows the selected bus, and walks to the destination. **Next demo stage** advances the presentation without waiting. Departures and arrivals stay fixed for the selected itinerary; **Refresh departures** explicitly requests a new set. Map controls pause, change speed, reset, zoom, and recenter. On phones, a sliding welcome pane opens the app and a draggable bottom sheet snaps to three heights. Click a bus to inspect its route.

All route paths, boarding stops, vehicles, and arrival estimates are illustrative. They are not verified current Crimson Ride services. The demo location is simulated and no device location permission is requested. The historic reference map and labels are not for real navigation. Font stack prefers Uber Move if already installed and otherwise uses Helvetica Neue / Arial; no proprietary font files are bundled.

## Sources

- Campus reference geometry: https://alabamamaps.ua.edu/contemporarymaps/campus/2D%20Campus%20Map%206-18-14.pdf
- Official UA TripShot information: https://crimsonride.ua.edu/tripshot/
- Uber interface references: https://base.uber.com/ and https://www.uber.com/us/en/u/redesigned-uber-app/

## Local use


## Getting Started (Cursor / VS Code)

### Prerequisites
Install the following:
- Node.js and npm
- Python 3
- Cursor or Visual Studio Code

### 1. Clone the Repository
Open a terminal and run:

git clone https://github.com/areaton1/campus-ride.git
cd campus-ride

### 2. Install Dependencies
Run:

npm install

Note: The application has no external npm dependencies.
This step initializes the npm project.

### 3. Start the Application
Run:

npm run dev

### 4. Open the Application
Open a browser and navigate to:

http://localhost:8000

The Campus Ride application should now be running.

### 5. Stop the Application
Press Ctrl + C in the terminal.

## Notes
- The app runs locally using a Python 3 web server.
- No API keys or external services are required.
- The bus routes and tracking data are simulated.
- The application files are located in the dist/ folder.


## Validation

- JavaScript syntax checked with Node.
- Desktop and 390 × 844 mobile layout inspected in browser.
- Campus nickname search, route selection, bus-following, pause/speed, route explorer, direct map bus selection, and saved-destination views checked.
- 2,328 generated itineraries checked across origins, destinations, and clock positions: pickup is reachable, drop-off follows pickup, and the selected simulated bus is at the expected stop at each event time.

## Street and walking geometry

`dist/network.js` contains shared street traces, six route patterns, a separate pedestrian graph, and entrance connectors. Streets are traced against the bundled UA 2014 map; pedestrian corridors and entrances remain illustrative where the old reference lacks sidewalk detail. This is not current navigation or official Crimson Ride route data.

Walk geometry drives the dotted path, traveler animation, and timing. Distance uses an approximate 2.65 meters per map unit and walking uses 1.35 m/s. Each bus stops for 30 seconds; its timeline drives fixed departures and arrivals. New places need an entrance and a connected pedestrian spur before being added to search. There is no straight-line routing fallback.

Saved places and optional custom names stay in this browser's local storage. Trip alerts are in-app only. No GPS access or external API is used.

Run `node tests/routing.cjs` to validate all location pairs, reachable departures, and bus positions at boarding and exit times.
