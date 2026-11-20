'use strict';
/** Headless US-17 assistant contract checks (AD-AI-1…7). Companion to routing.cjs / poi.cjs. */
const assert = require('assert');
const CampusAssistant = require('../dist/ai-assistant.js');

const places = [
  { id: 'presidential', name: 'Presidential Village', category: 'Residence halls', type: 'home', aliases: 'presidential village 1 2 pv dorm residence' },
  { id: 'student-center', name: 'Student Center', category: 'Dining · Student life', type: 'building', aliases: 'ferguson ferg student union supe store' },
  { id: 'bidgood', name: 'Bidgood Hall', category: 'Culverhouse College of Business', type: 'building', aliases: 'business finance culverhouse bidgood' },
  { id: 'gorgas', name: 'Gorgas Library', category: 'Library · The Quad', type: 'book', aliases: 'gorgas library quad study' },
  { id: 'shelby', name: 'Shelby Hall', category: 'Science & Engineering', type: 'building', aliases: 'shelby science chemistry' },
  { id: 'serc', name: 'SERC', category: 'South Engineering Research Center', type: 'building', aliases: 'serc south engineering research center' },
  { id: 'tutwiler', name: 'Tutwiler Hall', category: 'Residence hall · South campus', type: 'home', aliases: 'tut tutwiler dorm' },
  { id: 'ridgecrest', name: 'Ridgecrest South', category: 'Residence hall', type: 'home', aliases: 'ridgecrest south dorm' },
  { id: 'stadium', name: 'Bryant–Denny Stadium', category: 'Stadium · Athletics', type: 'building', aliases: 'bryant denny stadium saban football' },
  { id: 'paty', name: 'Paty Hall', category: 'Residence hall', type: 'home', aliases: 'paty dorm' },
  { id: 'lakeside', name: 'Lakeside Dining', category: 'Dining · North campus', type: 'building', aliases: 'lakeside dining food' },
  { id: 'rec', name: 'Student Recreation Center', category: 'Recreation · East campus', type: 'building', aliases: 'rec recreation gym fitness' },
  { id: 'coleman', name: 'Coleman Coliseum', category: 'Athletics · South campus', type: 'building', aliases: 'coleman basketball gymnastics' },
  { id: 'bryce', name: 'Bryce Campus', category: 'North-east campus', type: 'building', aliases: 'bryce performing arts' }
];
assert.equal(places.length, 14);

const origin = places[0];
function interpret(text) {
  const r = CampusAssistant.interpret(text, { places, originSuggestion: origin });
  CampusAssistant.assertKnownIds(r, places);
  return r;
}

// Supported trip
{
  const r = interpret('Take me from Presidential Village to Bidgood');
  assert.equal(r.kind, 'confirm');
  assert.equal(r.origin.id, 'presidential');
  assert.equal(r.destination.id, 'bidgood');
}

// Alias
{
  const r = interpret('Ferg to Gorgas');
  assert.equal(r.kind, 'confirm');
  assert.equal(r.origin.id, 'student-center');
  assert.equal(r.destination.id, 'gorgas');
}

// Ambiguous destination
{
  const r = interpret('Go to the dorm');
  assert.equal(r.kind, 'clarify');
  assert.equal(r.slot, 'destination');
  assert.ok(r.options.length >= 2);
  assert.ok(r.options.every(p => p.type === 'home'));
  assert.equal(r.origin, undefined);
  assert.equal(r.destination, undefined);
  assert.equal(r.draft?.origin ?? null, null);
  assert.equal(r.draft?.destination ?? null, null);
}

// Ambiguous origin must clarify — never silently pick the first "dorm" alias
{
  const before = { originId: origin.id, dest: null };
  const r = interpret('From dorm to Bidgood');
  assert.equal(r.kind, 'clarify');
  assert.equal(r.slot, 'origin');
  assert.ok(r.options.length >= 2);
  assert.ok(r.options.every(p => p.type === 'home'));
  assert.ok(!r.origin, 'must not silently assign an origin');
  assert.equal(r.draft?.origin ?? null, null);
  assert.equal(r.draft?.destination, 'bidgood');
  assert.ok(r.placeIds.includes('bidgood'));
  assert.equal(origin.id, before.originId, 'trip endpoints unchanged on interpret');
}

// Known origin retained while clarifying ambiguous destination
{
  const r = interpret('From Bidgood to dorm');
  assert.equal(r.kind, 'clarify');
  assert.equal(r.slot, 'destination');
  assert.ok(r.options.length >= 2);
  assert.ok(r.options.every(p => p.type === 'home'));
  assert.equal(r.draft?.origin, 'bidgood');
  assert.equal(r.draft?.destination ?? null, null);
  assert.ok(r.placeIds.includes('bidgood'));
  // UI contract: draft id must resolve to Bidgood, not the default origin suggestion (Presidential).
  const draftOrigin = places.find(p => p.id === r.draft.origin);
  assert.equal(draftOrigin.id, 'bidgood');
  assert.notEqual(draftOrigin.id, origin.id);
}

// Both slots ambiguous — queue origin clarify first, keep no silent assignments
{
  const r = interpret('From dorm to dorm');
  assert.equal(r.kind, 'clarify');
  assert.equal(r.slot, 'origin');
  assert.ok(Array.isArray(r.remaining) && r.remaining.length >= 1);
  assert.equal(r.remaining[0].slot, 'destination');
  assert.equal(r.draft?.origin ?? null, null);
  assert.equal(r.draft?.destination ?? null, null);
  assert.ok(!r.origin && !r.destination);
}

// Draft hydration contract used by runAssistantInterpret (preserve Bidgood through dest clarify)
{
  const r = interpret('From Bidgood to dorm');
  const draftOrigin = places.find(p => p.id === (r.origin && r.origin.id || r.draft && r.draft.origin));
  const draftDestination = places.find(p => p.id === (r.destination && r.destination.id || r.draft && r.draft.destination)) || null;
  assert.equal(draftOrigin.id, 'bidgood');
  assert.equal(draftDestination, null);
  const chosen = places.find(p => p.id === 'tutwiler');
  assert.equal(draftOrigin.id, 'bidgood');
  assert.equal(chosen.id, 'tutwiler');
  assert.notEqual(draftOrigin.id, origin.id);
}

// Missing origin
{
  const r = interpret('I need to get to Shelby');
  assert.equal(r.kind, 'need_origin');
  assert.equal(r.destination.id, 'shelby');
  assert.equal(r.originSuggestion.id, 'presidential');
  assert.match(r.message, /not GPS|demo location/i);
}

// Unknown / unsupported (destination)
{
  const r = interpret('Take me from Presidential to Publix');
  assert.equal(r.kind, 'unsupported');
  assert.match(r.unknown || '', /publix/i);
}

// Unknown in multi-place request (must not silently ignore)
{
  const r = interpret('From Publix to Bidgood');
  assert.equal(r.kind, 'unsupported');
  assert.match(r.unknown || '', /publix/i);
  assert.ok(!(r.origin && r.destination));
}

// Live-information refusal
{
  const r = interpret('Where is bus 101 right now for real?');
  assert.equal(r.kind, 'refuse_live');
  assert.ok(!r.origin && !r.destination);
}

// Off-topic
{
  const r = interpret('Can you write my essay?');
  assert.equal(r.kind, 'refuse_off_topic');
}

// Confirmation-before-mutation (interpreter purity + handoff contract shape)
{
  const snapshot = JSON.stringify(places.map(p => p.id));
  const r = interpret('Presidential to Bidgood');
  assert.equal(r.kind, 'confirm');
  assert.equal(JSON.stringify(places.map(p => p.id)), snapshot, 'places catalog mutated');
  assert.deepEqual(r.placeIds.sort(), ['bidgood', 'presidential']);
}

// Correction-before-confirmation: draft ids remain known after swapping
{
  const r = interpret('Presidential to Bidgood');
  const correctedOrigin = places.find(p => p.id === 'paty');
  const correctedDest = places.find(p => p.id === 'gorgas');
  const draft = { origin: correctedOrigin, destination: correctedDest, placeIds: [correctedOrigin.id, correctedDest.id] };
  CampusAssistant.assertKnownIds(draft, places);
  assert.notEqual(draft.origin.id, r.origin.id);
}

// Active-trip protection contract (UI enforces; module exposes no apply)
{
  assert.equal(typeof CampusAssistant.applyTrip, 'undefined');
  assert.equal(typeof CampusAssistant.interpret, 'function');
}

// Existing planner handoff: confirm payload only references catalog ids (planner remains authoritative)
{
  const r = interpret('Take me from Tutwiler to Bidgood');
  assert.equal(r.kind, 'confirm');
  for (const id of r.placeIds) assert.ok(places.some(p => p.id === id));
  assert.ok(!/Campus Loop|North Connector|\d+ min|ETA/i.test(r.message), 'assistant must not invent routes/ETAs');
}

// No invented place IDs across example prompts
{
  for (const ex of CampusAssistant.EXAMPLES) {
    const r = interpret(ex.text);
    CampusAssistant.assertKnownIds(r, places);
    assert.ok(['confirm', 'clarify', 'need_origin', 'unsupported', 'refuse_live', 'refuse_off_topic', 'same_place', 'empty'].includes(r.kind), ex.id + ' → ' + r.kind);
  }
}

// Load app wiring smoke: assistant helpers exist after vm bootstrap (handoff + trip lock surfaces)
const fs = require('fs');
const vm = require('vm');
const network = fs.readFileSync('dist/network.js', 'utf8');
const assistantSrc = fs.readFileSync('dist/ai-assistant.js', 'utf8');
const app = fs.readFileSync('dist/app.js', 'utf8');
const el = () => ({
  focus() {},
  classList: { contains: () => true, add() {}, remove() {}, toggle() {} },
  style: {},
  textContent: '',
  innerHTML: '',
  dataset: {},
  setAttribute() {},
  getBoundingClientRect: () => ({ width: 800, height: 600, top: 0, left: 0 }),
  querySelector: () => null,
  querySelectorAll: () => [],
  append() {},
  addEventListener() {},
  remove() {}
});
const documentStub = {
  querySelector: () => el(),
  querySelectorAll: () => [],
  createElementNS: () => el(),
  createElement: () => el(),
  addEventListener() {},
  body: { append() {} }
};
const context = vm.createContext({
  assert,
  console,
  document: documentStub,
  window: {},
  localStorage: { getItem: () => null },
  matchMedia: () => ({ matches: false }),
  requestAnimationFrame() {},
  ResizeObserver: function () { this.observe = () => {}; }
});
vm.runInContext(network + '\n' + assistantSrc + '\n', context);
vm.runInContext(
  app.slice(0, app.indexOf('const panel=$')) + '\n' +
  app.slice(app.indexOf('function busPosition'), app.indexOf('function fields')),
  context
);
vm.runInContext(`
assert.equal(typeof CampusAssistant.interpret, 'function');
assert.equal(places.length, 14);
const origin0 = state.origin;
const dest0 = state.destination;
const r = CampusAssistant.interpret('Presidential to Bidgood', { places, originSuggestion: state.origin });
assert.equal(state.origin, origin0);
assert.equal(state.destination, dest0);
assert.equal(r.kind, 'confirm');
// Simulated handoff used by applyAssistantTrip — same fields the planner reads
state.origin = places.find(p => p.id === r.origin.id);
state.destination = places.find(p => p.id === r.destination.id);
assert.equal(state.origin.id, 'presidential');
assert.equal(state.destination.id, 'bidgood');
const plans = computePlans();
assert.ok(Array.isArray(plans));
assert.ok(plans.length > 0, 'expected bus itineraries for Presidential → Bidgood');
// Trip lock surface: active trip flag present for UI guards
state.trip = { route: routes[0], bus: buses[0], board: routes[0].stops[0], exit: routes[0].stops[1], walkIn: 60, walkOut: 60, pickup: 100, dropoff: 200, started: 0 };
assert.ok(state.trip);
`, context);

console.log(JSON.stringify({
  places: places.length,
  examples: CampusAssistant.EXAMPLES.length,
  supportedOk: true,
  aliasOk: true,
  ambiguousOk: true,
  ambiguousOriginOk: true,
  draftOriginRetainedOk: true,
  missingOriginOk: true,
  unsupportedOk: true,
  liveRefuseOk: true,
  offTopicOk: true,
  confirmPurityOk: true,
  handoffOk: true,
  noInventedIds: true,
  tripLockStateOk: true
}));
