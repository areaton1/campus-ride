'use strict';
/** Headless US-17 assistant contract checks (AD-AI-1…8). Companion to routing.cjs / poi.cjs. */
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
  { id: 'bryce', name: 'Bryce Campus', category: 'North-east campus', type: 'building', aliases: 'bryce performing arts' },
  { id: 'rodgers', name: 'Rodgers Library', category: 'Library · Science & Engineering', type: 'book', aliases: 'rodgers rogers science engineering library' },
  { id: 'bruno', name: 'Bruno Business Library', category: 'Library · Culverhouse', type: 'book', aliases: 'bruno business library bashinsky' },
  { id: 'fresh-food', name: 'Fresh Food Company', category: 'Dining · Engineering quad', type: 'building', aliases: 'fresh food company foods ffc' },
  { id: 'alston', name: 'Alston Hall', category: 'Culverhouse College of Business', type: 'building', aliases: 'alston mary hewell' },
  { id: 'student-services', name: 'Student Services Center', category: 'Student services', type: 'building', aliases: 'student services center ssc' },
  { id: 'burke', name: 'Burke Hall', category: 'Residence hall', type: 'home', aliases: 'burke hall dorm residence' },
  { id: 'foster', name: 'Foster Auditorium', category: 'Auditorium · South Quad', type: 'building', aliases: 'foster auditorium' },
  { id: 'lloyd', name: 'Lloyd Hall', category: 'Academic · The Quad', type: 'building', aliases: 'lloyd hall' },
  { id: 'lakeside-hall', name: 'Lakeside Hall', category: 'Residence hall · North campus', type: 'home', aliases: 'lakeside hall dorm residential residence' }
];
assert.equal(places.length, 23);

const origin = places[0];
let curated = 0;
function interpret(text) {
  const r = CampusAssistant.interpret(text, { places, originSuggestion: origin });
  CampusAssistant.assertKnownIds(r, places);
  return r;
}
function expectConfirm(text, oId, dId) {
  curated++;
  const r = interpret(text);
  assert.equal(r.kind, 'confirm', text + ' → ' + r.kind);
  assert.equal(r.origin.id, oId, text);
  assert.equal(r.destination.id, dId, text);
  return r;
}
function expectKind(text, kind, extra) {
  curated++;
  const r = interpret(text);
  assert.equal(r.kind, kind, `"${text}" → ${r.kind}, expected ${kind}`);
  if (extra) extra(r, text);
  return r;
}

// --- Baseline supported / aliases (1–20) ---
expectConfirm('Take me from Presidential Village to Bidgood', 'presidential', 'bidgood');
expectConfirm('Presidential to Bidgood', 'presidential', 'bidgood');
expectConfirm('Ferg to Gorgas', 'student-center', 'gorgas');
expectConfirm('PV to Ferg', 'presidential', 'student-center');
expectConfirm('Rodgers to Bruno', 'rodgers', 'bruno');
expectConfirm('Fresh Food to Foster', 'fresh-food', 'foster');
expectConfirm('Lakeside Hall to Alston', 'lakeside-hall', 'alston');
expectConfirm('ssc to alston', 'student-services', 'alston');
expectConfirm('ffc to foster', 'fresh-food', 'foster');
expectConfirm('bryant denny to coleman', 'stadium', 'coleman');
expectConfirm('rec to lakeside dining', 'rec', 'lakeside');
expectConfirm('from ridgecrest to lloyd', 'ridgecrest', 'lloyd');
expectConfirm('burke hall to student services', 'burke', 'student-services');
expectConfirm('Take me from the Ferg to the Rec', 'student-center', 'rec');
expectConfirm('from the student union to the gym', 'student-center', 'rec');
expectConfirm('rogers to gorgas', 'rodgers', 'gorgas');
expectConfirm('mary hewell to bashinsky', 'alston', 'bruno');
expectConfirm('culverhouse to lloyd', 'bidgood', 'lloyd');
expectConfirm('How do I get from Tutwiler to Shelby?', 'tutwiler', 'shelby');
expectConfirm('From lakeside dining to Bidgood', 'lakeside', 'bidgood');

// --- Alternate phrasing (21–35) ---
expectKind('Directions to Gorgas', 'need_origin', (r) => assert.equal(r.destination.id, 'gorgas'));
expectKind('I need to get to Shelby', 'need_origin', (r) => {
  assert.equal(r.destination.id, 'shelby');
  assert.match(r.message, /not GPS|demo location/i);
});
expectKind('Take me across campus to Shelby', 'need_origin', (r) => assert.equal(r.destination.id, 'shelby'));
expectKind('drop me off at Bidgood', 'need_origin', (r) => assert.equal(r.destination.id, 'bidgood'));
expectKind('pick me up at Tutwiler', 'need_origin', (r) => assert.equal(r.destination.id, 'tutwiler'));
expectConfirm('I am at Bidgood take me to Tutwiler', 'bidgood', 'tutwiler');
expectConfirm('at Bidgood going to Gorgas', 'bidgood', 'gorgas');
expectConfirm('Starting at Ferg go to Shelby', 'student-center', 'shelby');
expectConfirm('Take me from Tutwiler to Bidgood', 'tutwiler', 'bidgood');
expectKind('Presidential to Presidential', 'same_place');
expectKind('', 'empty');
expectConfirm('Directions from Paty to Foster', 'paty', 'foster');
expectConfirm('from SERC to Bryce', 'serc', 'bryce');
expectConfirm('Lloyd to Burke', 'lloyd', 'burke');
expectConfirm('Coleman to Stadium', 'coleman', 'stadium');

// --- Ambiguity (36–48) ---
expectKind('Go to the dorm', 'clarify', (r) => {
  assert.equal(r.slot, 'destination');
  assert.ok(r.options.every(p => p.type === 'home'));
  assert.ok(r.options.length >= 2);
});
expectKind('From dorm to Bidgood', 'clarify', (r) => {
  assert.equal(r.slot, 'origin');
  assert.equal(r.draft?.destination, 'bidgood');
  assert.ok(!r.origin);
});
expectKind('From Bidgood to dorm', 'clarify', (r) => {
  assert.equal(r.slot, 'destination');
  assert.equal(r.draft?.origin, 'bidgood');
});
expectKind('From dorm to dorm', 'clarify', (r) => {
  assert.equal(r.slot, 'origin');
  assert.ok(r.remaining?.length >= 1);
});
expectKind('Go to lakeside', 'clarify', (r) => {
  const ids = r.options.map(p => p.id);
  assert.ok(ids.includes('lakeside') && ids.includes('lakeside-hall'));
});
expectKind('Go to the library', 'clarify', (r) => {
  const ids = new Set(r.options.map(p => p.id));
  assert.ok(ids.has('gorgas') && ids.has('rodgers') && ids.has('bruno'));
});
expectKind('Go to dining', 'clarify', (r) => assert.ok(r.options.length >= 2));
expectKind('I am at Bidgood, take me to the dorm', 'clarify', (r) => {
  assert.equal(r.draft?.origin, 'bidgood');
  assert.equal(r.slot, 'destination');
});
expectConfirm('from PV to the science library', 'presidential', 'rodgers');
expectConfirm('bruno to shelby', 'bruno', 'shelby');
expectKind('business to shelby', 'unsupported');
expectKind('Go to residence', 'clarify');
expectKind('the dorms', 'clarify');
expectKind('library', 'clarify');

// --- Shared-token false-positive traps (49–58) — were confirm Bidgood→Shelby on main ---
for (const bad of ['Hall', 'Hardaway Hall', 'Smith Hall', 'Morgan Hall', 'the hall', 'hall']) {
  expectKind(bad, 'unsupported', (r) => {
    assert.ok(!(r.origin && r.destination), 'must not invent OD for ' + bad);
  });
}
expectKind('Take me to Hardaway Hall', 'unsupported');
expectKind('From Hardaway Hall to Bidgood', 'unsupported', (r) => assert.match(r.unknown || '', /hardaway/i));
expectKind('ten hoor', 'refuse_off_topic');
expectKind('Take me to ten hoor', 'unsupported');
expectKind('Hardaway Hall to Shelby', 'unsupported');

// --- Unsupported / off-campus (59–68) ---
expectKind('Take me from Presidential to Publix', 'unsupported', (r) => assert.match(r.unknown || '', /publix/i));
expectKind('From Publix to Bidgood', 'unsupported', (r) => assert.match(r.unknown || '', /publix/i));
expectKind('Take me to ten hoor', 'unsupported');
expectKind('Delta Zeta', 'refuse_off_topic');
expectKind('Publix', 'refuse_off_topic');
expectKind('Can you write my essay?', 'refuse_off_topic');
expectKind('yes confirm', 'refuse_off_topic');
expectKind('Where do I board?', 'refuse_off_topic');
expectKind('Help me use this app', 'refuse_off_topic');
expectKind('What stops are on North Connector?', 'refuse_off_topic');

// --- Live / arrival refuse (69–80) ---
for (const live of [
  'Where is bus 101 right now for real?',
  'Where is the bus right now?',
  'is the bus delayed',
  'real-time location of Campus Loop',
  'bus position for route 101',
  "What's the ETA to Shelby?",
  'What time does the next bus arrive at Bidgood?',
  'next bus arrive Bidgood',
  'arrival time Bidgood',
  'live ETA',
  'Is Campus Loop running?',
  'when is the next bus',
  'How long does it take to get to Bidgood',
  'when should I leave for Bidgood'
]) {
  expectKind(live, 'refuse_live', (r) => {
    assert.ok(!r.origin && !r.destination);
    assert.match(r.message, /cannot verify live/i);
    assert.match(r.message, /simulated/i);
  });
}
expectConfirm('Take me from Presidential Village to Bidgood late tonight', 'presidential', 'bidgood');
expectConfirm('headed to Gorgas from Ferg', 'student-center', 'gorgas');
expectKind('science to Bidgood', 'unsupported', (r) => assert.match(r.unknown || '', /science/i));
expectKind('Go to village', 'unsupported');
expectKind('Go to company', 'unsupported');
expectConfirm('How long does it take to get from Burke to the Rec?', 'burke', 'rec');
expectKind('When will the next bus arrive?', 'refuse_live');
expectKind('Is the bus actually running right now?', 'refuse_live');
expectKind('Can you show me the estimated travel time?', 'refuse_live');

// --- Conservative spelling (81–88) ---
expectKind('I want to go from Presedential to Bidgood', 'clarify', (r) => {
  assert.ok(r.options.some(p => p.id === 'presidential'));
  assert.equal(r.draft?.destination, 'bidgood');
  assert.ok(!r.origin || r.origin.id === 'presidential');
});
expectKind('presidental to Bidgood', 'clarify', (r) => {
  assert.ok(r.options.some(p => p.id === 'presidential'));
});
expectKind('Bidgood to Gorgass', 'clarify', (r) => {
  assert.equal(r.draft?.origin, 'bidgood');
  assert.ok(r.options.some(p => p.id === 'gorgas'));
});
expectKind('Go to Bidgod', 'clarify', (r) => assert.ok(r.options.some(p => p.id === 'bidgood')));
expectKind('xyzzyqwerty', 'refuse_off_topic');
expectKind('zzzzz to Bidgood', 'unsupported');
expectConfirm('Bidgood to Shelby', 'bidgood', 'shelby');
expectConfirm('Lloyd Hall to Bidgood Hall', 'lloyd', 'bidgood');

// --- Corrections / purity / examples (89–95) ---
{
  curated++;
  const snapshot = JSON.stringify(places.map(p => p.id));
  const r = interpret('Presidential to Bidgood');
  assert.equal(r.kind, 'confirm');
  assert.equal(JSON.stringify(places.map(p => p.id)), snapshot);
  assert.deepEqual(r.placeIds.sort(), ['bidgood', 'presidential']);
}
{
  curated++;
  const r = interpret('Presidential to Bidgood');
  const draft = {
    origin: places.find(p => p.id === 'paty'),
    destination: places.find(p => p.id === 'gorgas'),
    placeIds: ['paty', 'gorgas']
  };
  CampusAssistant.assertKnownIds(draft, places);
  assert.notEqual(draft.origin.id, r.origin.id);
}
{
  curated++;
  assert.equal(typeof CampusAssistant.applyTrip, 'undefined');
}
{
  curated++;
  const r = interpret('Take me from Tutwiler to Bidgood');
  assert.ok(!/Campus Loop|North Connector|\d+ min|\bETA\b/i.test(r.message));
}
{
  curated++;
  for (const ex of CampusAssistant.EXAMPLES) {
    const r = interpret(ex.text);
    CampusAssistant.assertKnownIds(r, places);
    assert.ok(['confirm', 'clarify', 'need_origin', 'unsupported', 'refuse_live', 'refuse_off_topic', 'same_place', 'empty'].includes(r.kind), ex.id);
  }
}
{
  curated++;
  const r = interpret('From Bidgood to dorm');
  const draftOrigin = places.find(p => p.id === (r.origin && r.origin.id || r.draft && r.draft.origin));
  assert.equal(draftOrigin.id, 'bidgood');
  assert.notEqual(draftOrigin.id, origin.id);
}
{
  curated++;
  const r = interpret('Should I walk or take the bus to Bidgood?');
  assert.ok(['unsupported', 'need_origin', 'refuse_off_topic', 'clarify'].includes(r.kind), r.kind);
  assert.ok(!(r.kind === 'confirm' && r.message.match(/\d+\s*min/i)));
}

// --- Additional alias / place coverage toward ~100 (96–105+) ---
expectConfirm('Paty to Gorgas', 'paty', 'gorgas');
expectConfirm('Tutwiler to Rec', 'tutwiler', 'rec');
expectConfirm('Bryce to Shelby', 'bryce', 'shelby');
expectConfirm('Foster to Alston', 'foster', 'alston');
expectConfirm('Student Services to Fresh Food', 'student-services', 'fresh-food');
expectConfirm('supe store to Bidgood', 'student-center', 'bidgood');
expectConfirm('saban to coleman', 'stadium', 'coleman');
expectConfirm('tut to paty', 'tutwiler', 'paty');
expectKind('Cancel my trip', 'unsupported');
expectKind('Tell me about my current trip', 'unsupported');
expectKind('change destination to Gorgas', 'unsupported');
expectKind('Which bus goes to Bidgood?', 'unsupported');

assert.ok(curated >= 100, 'expected ~100 curated cases, got ' + curated);

// --- OD smoke: all 506 distinct pairs (canonical names) — not a substitute for negatives ---
let odOk = 0;
let odTotal = 0;
for (const o of places) {
  for (const d of places) {
    if (o.id === d.id) continue;
    odTotal++;
    const r = interpret(`${o.name} to ${d.name}`);
    assert.equal(r.kind, 'confirm', `${o.name} to ${d.name} → ${r.kind}`);
    assert.equal(r.origin.id, o.id);
    assert.equal(r.destination.id, d.id);
    odOk++;
  }
}
assert.equal(odTotal, 23 * 22);
assert.equal(odOk, odTotal);

// Alternate template smoke (subset — from A to B)
let fromOk = 0;
for (const o of places) {
  for (const d of places) {
    if (o.id === d.id) continue;
    const r = interpret(`from ${o.name} to ${d.name}`);
    assert.equal(r.kind, 'confirm');
    assert.equal(r.origin.id, o.id);
    assert.equal(r.destination.id, d.id);
    fromOk++;
  }
}
assert.equal(fromOk, 506);

// Load app wiring smoke: handoff + trip lock surfaces
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
assert.equal(places.length, 23);
const origin0 = state.origin;
const dest0 = state.destination;
const r = CampusAssistant.interpret('Presidential to Bidgood', { places, originSuggestion: state.origin });
assert.equal(state.origin, origin0);
assert.equal(state.destination, dest0);
assert.equal(r.kind, 'confirm');
state.origin = places.find(p => p.id === r.origin.id);
state.destination = places.find(p => p.id === r.destination.id);
const plans = computePlans();
assert.ok(plans.length > 0);
state.trip = { route: routes[0], bus: buses[0], board: routes[0].stops[0], exit: routes[0].stops[1], walkIn: 60, walkOut: 60, pickup: 100, dropoff: 200, started: 0 };
assert.ok(state.trip);
assert.equal(typeof CampusAssistant.applyTrip, 'undefined');
`, context);

console.log(JSON.stringify({
  places: places.length,
  curatedCases: curated,
  odSmokePairs: odOk,
  fromSmokePairs: fromOk,
  examples: CampusAssistant.EXAMPLES.length,
  hallTrapOk: true,
  liveRefuseOk: true,
  spellingClarifyOk: true,
  supportedOk: true,
  aliasOk: true,
  ambiguousOk: true,
  draftOriginRetainedOk: true,
  confirmPurityOk: true,
  handoffOk: true,
  tripLockStateOk: true,
  noInventedIds: true
}));
