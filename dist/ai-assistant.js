'use strict';
/**
 * US-17 — Deterministic local trip-request interpreter (AD-AI-1…8).
 * Does not mutate app state, invent places, or call external services.
 */
(function (root) {
  const STOP = new Set([
    'a', 'an', 'the', 'to', 'from', 'for', 'me', 'my', 'i', 'im', "i'm", 'am', 'please',
    'want', 'need', 'get', 'go', 'going', 'take', 'taking', 'ride', 'bus', 'trip',
    'across', 'campus', 'how', 'do', 'can', 'you', 'help', 'with', 'at', 'on', 'in',
    'of', 'and', 'or', 'near', 'towards', 'toward', 'via', 'next', 'class', 'where',
    'whats', "what's", 'is', 'are', 'there', 'this', 'that', 'demo', 'starting',
    'start', 'headed', 'heading', 'leave', 'leaving', 'arrive', 'arriving',
    'tonight', 'today', 'tomorrow', 'morning', 'afternoon', 'evening', 'night',
    'now', 'soon', 'asap', 'late', 'early'
  ]);

  /* Tokens too weak to uniquely identify a place — never invent OD from these alone. */
  const GENERIC_TOKENS = new Set([
    'hall', 'south', 'north', 'east', 'west', 'center', 'centre', 'campus',
    'village', 'company', 'auditorium', 'coliseum', 'stadium', 'library',
    'dining', 'food', 'recreation', 'student', 'business', 'science',
    'engineering', 'residence', 'residential', 'dorm', 'dorms'
  ]);

  const LIVE_RE = /\b(live|real[\s-]?time|right now|currently|delay|delayed|running late|service (status|alert)|out of service|where is (the )?(bus|crimson)|bus (location|position|eta)|is (the )?(bus|crimson|route|[a-z]+(?:\s+[a-z]+){0,3}) running|next bus|arrival times?|\beta\b|when does (the )?bus|when is (the )?next|what time does (the )?next|when should i leave|how long (does it take|to get))\b/i;
  const OFF_TOPIC_RE = /\b(essay|homework|write (my|an)|weather|forecast|recipe|stock|crypto|jailbreak|password|hack|dating|girlfriend|boyfriend)\b/i;
  const TRIP_CUE_RE = /\b(to|from|take me|get (me )?to|go(ing)? to|ride|bus|trip|directions?|how (do|can) i (get|go)|drop( me)? off|pick( me)? up|i am at|i'm at|starting at|headed to)\b/i;

  const EXAMPLES = [
    { id: 'pv-bidgood', label: 'Presidential → Bidgood', text: 'Take me from Presidential Village to Bidgood' },
    { id: 'ferg-gorgas', label: 'Ferg → Gorgas', text: 'Ferg to Gorgas' },
    { id: 'shelby-only', label: 'Need Shelby', text: 'I need to get to Shelby' },
    { id: 'dorm-ambiguous', label: 'Go to the dorm', text: 'Go to the dorm' },
    { id: 'publix', label: 'To Publix', text: 'Take me from Presidential to Publix' },
    { id: 'live-refuse', label: 'Live bus location', text: 'Where is bus 101 right now for real?' },
    { id: 'off-topic', label: 'Off-topic', text: 'Can you write my essay?' }
  ];

  function normalize(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/[–—-]/g, ' ')
      .replace(/[^a-z0-9\s']/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function isGenericToken(w) {
    return GENERIC_TOKENS.has(w) || STOP.has(w);
  }

  function placePhrases(place) {
    const phrases = new Set();
    const name = normalize(place.name);
    if (name) phrases.add(name);
    name.split(' ').filter(w => w.length > 2 && !STOP.has(w) && !GENERIC_TOKENS.has(w)).forEach(w => phrases.add(w));
    normalize(place.aliases || '')
      .split(' ')
      .filter(a => a && !GENERIC_TOKENS.has(a))
      .forEach(a => phrases.add(a));
    const aliasRaw = normalize(place.aliases || '');
    if (aliasRaw.includes('student union')) phrases.add('student union');
    if (aliasRaw.includes('south engineering')) phrases.add('south engineering research center');
    if (name === 'student recreation center') phrases.add('student recreation center');
    if (name === 'bryant denny stadium') {
      phrases.add('bryant denny');
      phrases.add('bryant denny stadium');
    }
    if (name === 'presidential village') {
      phrases.add('presidential village');
      phrases.add('pv');
    }
    if (name === 'ridgecrest south') phrases.add('ridgecrest');
    if (name === 'fresh food company') {
      phrases.add('fresh food');
      phrases.add('fresh foods');
      phrases.add('ffc');
    }
    if (name === 'student services center') phrases.add('student services');
    if (name === 'bruno business library') phrases.add('business library');
    if (name === 'rodgers library') phrases.add('science library');
    if (name === 'foster auditorium') phrases.add('foster auditorium');
    if (name === 'lakeside hall') {
      phrases.add('lakeside hall');
      phrases.add('lakeside dorm');
      phrases.add('lakeside residential');
    }
    if (name === 'lakeside dining') {
      phrases.add('lakeside dining');
      phrases.add('lakeside food');
    }
    if (name === 'student center') phrases.add('student center');
    return [...phrases].filter(Boolean).sort((a, b) => b.length - a.length);
  }

  function buildIndex(places) {
    return places.map(p => ({ place: p, phrases: placePhrases(p) }));
  }

  function findHits(text, places) {
    const norm = normalize(text);
    const index = buildIndex(places);
    const occupied = Array(norm.length).fill(false);
    const hits = [];

    const candidates = [];
    for (const entry of index) {
      for (const phrase of entry.phrases) {
        if (phrase.length < 2) continue;
        let from = 0;
        while (from <= norm.length) {
          const at = norm.indexOf(phrase, from);
          if (at < 0) break;
          const before = at === 0 ? ' ' : norm[at - 1];
          const after = at + phrase.length >= norm.length ? ' ' : norm[at + phrase.length];
          const boundary = /[^a-z0-9]/.test(before) && /[^a-z0-9]/.test(after);
          if (boundary) {
            /* Only single-token generics are weak. Multi-word aliases like "science library" stay distinctive. */
            const parts = phrase.split(' ');
            const generic = parts.length === 1 && isGenericToken(phrase);
            candidates.push({ start: at, end: at + phrase.length, phrase, place: entry.place, generic });
          }
          from = at + 1;
        }
      }
    }
    candidates.sort((a, b) => b.end - b.start - (a.end - a.start) || a.start - b.start);

    for (const c of candidates) {
      let overlap = false;
      for (let i = c.start; i < c.end; i++) if (occupied[i]) { overlap = true; break; }
      if (overlap) {
        const sameSpan = hits.some(h => h.start === c.start && h.end === c.end && h.phrase === c.phrase);
        if (!sameSpan) continue;
        hits.push(c);
        continue;
      }
      for (let i = c.start; i < c.end; i++) occupied[i] = true;
      hits.push(c);
    }
    hits.sort((a, b) => a.start - b.start);
    return { norm, hits };
  }

  function uniquePlaces(hits) {
    const seen = new Set();
    const out = [];
    for (const h of hits) {
      if (seen.has(h.place.id)) continue;
      seen.add(h.place.id);
      out.push(h.place);
    }
    return out;
  }

  function distinctiveHits(hits) {
    return hits.filter(h => !h.generic);
  }

  function editDistance(a, b) {
    if (a === b) return 0;
    const m = a.length;
    const n = b.length;
    if (Math.abs(m - n) > 2) return 99;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      }
    }
    return dp[m][n];
  }

  function catalogSpellCandidates(token, places) {
    const t = normalize(token);
    if (!t || t.length < 5 || isGenericToken(t)) return [];
    const scored = [];
    for (const place of places) {
      const phrases = placePhrases(place);
      for (const phrase of phrases) {
        if (phrase.length < 5 || isGenericToken(phrase)) continue;
        const d = editDistance(t, phrase);
        if (d === 1) scored.push({ place, phrase, d });
      }
    }
    const byId = new Map();
    for (const s of scored) {
      const prev = byId.get(s.place.id);
      if (!prev || s.d < prev.d) byId.set(s.place.id, s);
    }
    return [...byId.values()].sort((a, b) => a.d - b.d || a.phrase.length - b.phrase.length);
  }

  function suggestFromUnknown(unknownText, places) {
    const tokens = normalize(unknownText).split(' ').filter(w => w && !STOP.has(w) && w.length > 2);
    const placeVotes = new Map();
    for (const token of tokens) {
      const cands = catalogSpellCandidates(token, places);
      if (cands.length === 1) {
        const id = cands[0].place.id;
        placeVotes.set(id, (placeVotes.get(id) || 0) + 1);
      }
    }
    if (placeVotes.size === 1) {
      const id = [...placeVotes.keys()][0];
      return places.find(p => p.id === id) || null;
    }
    if (tokens.length === 1) {
      const cands = catalogSpellCandidates(tokens[0], places);
      if (cands.length === 1) return cands[0].place;
    }
    return null;
  }

  function extractSegments(norm) {
    const segments = [];
    const headedFrom = norm.match(/\bheaded to\s+(.+?)\s+from\s+(.+)$/);
    if (headedFrom) {
      segments.push({ role: 'origin', text: headedFrom[2].trim() });
      segments.push({ role: 'destination', text: headedFrom[1].trim() });
      return segments;
    }
    const atGoing = norm.match(/\b(?:i am at|i'm at|im at|starting at|at)\s+(.+?)\s+(?:take me to|go(?:ing)? to|headed to|to)\s+(.+)$/);
    if (atGoing) {
      segments.push({ role: 'origin', text: atGoing[1].trim() });
      segments.push({ role: 'destination', text: atGoing[2].trim() });
      return segments;
    }
    const fromTo = norm.match(/\bfrom\s+(.+?)\s+to\s+(.+)$/);
    if (fromTo) {
      segments.push({ role: 'origin', text: fromTo[1].trim() });
      segments.push({ role: 'destination', text: fromTo[2].trim() });
      return segments;
    }
    const fromHeaded = norm.match(/\bfrom\s+(.+?)\s+headed to\s+(.+)$/);
    if (fromHeaded) {
      segments.push({ role: 'origin', text: fromHeaded[1].trim() });
      segments.push({ role: 'destination', text: fromHeaded[2].trim() });
      return segments;
    }
    const arrow = norm.match(/^(.+?)\s+(?:to|->|→)\s+(.+)$/);
    if (arrow) {
      const left = arrow[1].trim();
      const verbLeft = /^(go|going|get( me)?|take( me)?|take me from.*|directions?|how( do| can)?( i)?( get| go)?|i need|i want|please|drop me off|pick me up)$/.test(left);
      const leftWords = left.split(' ').filter(Boolean);
      const onlyStops = leftWords.length > 0 && leftWords.every(w => STOP.has(w));
      if (!verbLeft && !onlyStops) {
        segments.push({ role: 'origin', text: left });
        segments.push({ role: 'destination', text: arrow[2].trim() });
        return segments;
      }
    }
    const toOnly = norm.match(/\b(?:get(?: me)? to|go(?:ing)? to|take me to|directions? to|headed to|drop me off at|pick me up at|^to)\s+(.+)$/);
    if (toOnly) {
      segments.push({ role: 'destination', text: toOnly[1].trim() });
      return segments;
    }
    return segments;
  }

  function uniqueNameTokenPlaces(token, places) {
    const t = normalize(token);
    if (!t || STOP.has(t)) return [];
    return places.filter(p => normalize(p.name).split(' ').includes(t));
  }

  function matchSegment(segmentText, places) {
    const { hits } = findHits(segmentText, places);
    const strong = distinctiveHits(hits);
    let matched = uniquePlaces(strong.length ? strong : []);
    const leftover = normalize(segmentText)
      .split(' ')
      .filter(w => w && !STOP.has(w) && w.length > 2 && !GENERIC_TOKENS.has(w));
    const covered = new Set();
    for (const h of strong) normalize(h.phrase).split(' ').forEach(w => covered.add(w));
    let unknownTokens = leftover.filter(w => !covered.has(w));

    /* Unique name tokens (e.g. only one "Stadium") may resolve even if the word is otherwise generic.
       Never expand bare "hall" into every * Hall building — that invented Bidgood→Shelby trips. */
    if (!matched.length) {
      const words = normalize(segmentText).split(' ').filter(w => w && !STOP.has(w));
      if (words.length === 1 && words[0] !== 'hall') {
        const named = uniqueNameTokenPlaces(words[0], places);
        if (named.length === 1) {
          matched = named;
          unknownTokens = [];
        } else if (named.length > 1) {
          matched = named;
          unknownTokens = [];
        }
      }
    }
    return { matched, unknownTokens, hits: strong, allHits: hits };
  }

  function isGenericPhrase(phrase) {
    return /^(the )?(dorm|dorms|residence|library|dining|food|lakeside|hall)$/.test(normalize(phrase));
  }

  function placesForAmbiguousPhrase(phrase, places) {
    let p = normalize(phrase).replace(/^the\s+/, '');
    if (p === 'dorm' || p === 'dorms' || p === 'residence' || p === 'residence hall' || p === 'residence halls') {
      return places.filter(x => x.type === 'home');
    }
    if (p === 'library') {
      return places.filter(x => /library/i.test(x.name + ' ' + x.category));
    }
    if (p === 'dining' || p === 'food' || p === 'eat') {
      return places.filter(x => /dining|food/i.test(x.category + ' ' + (x.aliases || '')));
    }
    if (p === 'lakeside') {
      return places.filter(x => x.id === 'lakeside' || x.id === 'lakeside-hall');
    }
    if (p === 'hall') {
      return [];
    }
    const { hits } = findHits(phrase, places);
    return uniquePlaces(distinctiveHits(hits));
  }

  function resolvePlaceSlot(slot, segmentText, places) {
    const amb = placesForAmbiguousPhrase(segmentText, places);
    const m = matchSegment(segmentText, places);
    if (m.unknownTokens.length && !m.matched.length) {
      const suggestion = suggestFromUnknown(segmentText, places);
      if (suggestion) {
        return {
          kind: 'clarify',
          options: [suggestion],
          place: null,
          prompt: `Did you mean ${suggestion.name}? I will not silently replace “${normalize(segmentText)}”.`
        };
      }
      return { kind: 'unsupported', unknown: segmentText, matched: [] };
    }
    if (m.unknownTokens.length && m.matched.length) {
      const suggestion = suggestFromUnknown(m.unknownTokens.join(' '), places);
      if (suggestion && !m.matched.some(p => p.id === suggestion.id)) {
        return {
          kind: 'clarify',
          options: [suggestion].concat(m.matched),
          place: null,
          prompt: `I am not sure about “${m.unknownTokens.join(' ')}”. Did you mean ${suggestion.name}?`
        };
      }
      return { kind: 'unsupported', unknown: m.unknownTokens.join(' '), matched: m.matched };
    }
    if (isGenericPhrase(segmentText) && amb.length > 1) {
      return { kind: 'clarify', options: amb, place: null };
    }
    if (isGenericPhrase(segmentText) && amb.length === 0) {
      return { kind: 'unsupported', unknown: segmentText, matched: [] };
    }
    if (m.matched.length > 1) {
      return { kind: 'clarify', options: m.matched, place: null };
    }
    if (m.matched.length === 1) {
      return { kind: 'resolved', options: [], place: m.matched[0] };
    }
    if (amb.length === 1) {
      return { kind: 'resolved', options: [], place: amb[0] };
    }
    if (amb.length > 1) {
      return { kind: 'clarify', options: amb, place: null };
    }
    const suggestion = suggestFromUnknown(segmentText, places);
    if (suggestion) {
      return {
        kind: 'clarify',
        options: [suggestion],
        place: null,
        prompt: `Did you mean ${suggestion.name}? Confirm or pick another supported place.`
      };
    }
    return { kind: 'unresolved', options: [], place: null, matched: [] };
  }

  function interpret(text, opts) {
    const places = opts && opts.places ? opts.places : [];
    const originSuggestion = opts && opts.originSuggestion ? opts.originSuggestion : null;
    const raw = String(text || '').trim();
    const norm = normalize(raw);

    if (!norm) {
      return {
        kind: 'empty',
        message: 'Tell me where you want to go on campus, or tap an example below.',
        placeIds: []
      };
    }

    if (LIVE_RE.test(raw) || LIVE_RE.test(norm)) {
      return {
        kind: 'refuse_live',
        message: 'I cannot verify live bus positions, delays, arrivals, or current service. This prototype does not provide live transit data. After you confirm a supported trip, the planner shows simulated routes, stops, and times — not official Crimson Ride information.',
        placeIds: []
      };
    }

    if (OFF_TOPIC_RE.test(raw) && !TRIP_CUE_RE.test(norm)) {
      return {
        kind: 'refuse_off_topic',
        message: 'I only help with campus trip planning in this demo. Ask me something like “Presidential to Bidgood,” or use the manual destination field.',
        placeIds: []
      };
    }

    const segments = extractSegments(norm);
    if (segments.length) {
      const originSeg = segments.find(s => s.role === 'origin');
      const destSeg = segments.find(s => s.role === 'destination');
      let origin = null;
      let destination = null;
      const clarify = [];

      if (originSeg) {
        const resolved = resolvePlaceSlot('origin', originSeg.text, places);
        if (resolved.kind === 'unsupported') {
          return {
            kind: 'unsupported',
            message: resolved.matched.length
              ? `I recognized ${resolved.matched.map(p => p.name).join(', ')}, but “${resolved.unknown}” is not a supported campus place. I will not ignore or invent that location.`
              : `“${originSeg.text}” is not in this prototype’s campus places. I will not invent a starting point. Choose a supported place manually, or try Bidgood, the Ferg, or Gorgas.`,
            unknown: resolved.unknown,
            placeIds: (resolved.matched || []).map(p => p.id)
          };
        }
        if (resolved.kind === 'clarify') {
          clarify.push({
            slot: 'origin',
            options: resolved.options,
            prompt: resolved.prompt || 'Which starting place did you mean?'
          });
        } else if (resolved.kind === 'resolved') {
          origin = resolved.place;
        } else if (resolved.kind === 'unresolved') {
          return {
            kind: 'unsupported',
            message: `“${originSeg.text}” is not in this prototype’s campus places. I will not invent or ignore a starting point. Choose a supported place manually, or try Bidgood, the Ferg, or Gorgas.`,
            unknown: originSeg.text,
            placeIds: []
          };
        }
      }

      if (destSeg) {
        const resolved = resolvePlaceSlot('destination', destSeg.text, places);
        if (resolved.kind === 'unsupported' || resolved.kind === 'unresolved') {
          return {
            kind: 'unsupported',
            message: resolved.matched && resolved.matched.length
              ? `I recognized ${resolved.matched.map(p => p.name).join(', ')}, but “${resolved.unknown || destSeg.text}” is not a supported campus place. I will not ignore or invent that location.`
              : `“${destSeg.text}” is not in this prototype’s campus places. I will not invent a destination. Use the manual destination field, or try a supported building like Bidgood or the Student Center.`,
            unknown: resolved.unknown || destSeg.text,
            placeIds: (resolved.matched || []).map(p => p.id)
          };
        }
        if (resolved.kind === 'clarify') {
          clarify.push({
            slot: 'destination',
            options: resolved.options,
            prompt: resolved.prompt || 'Which destination did you mean?'
          });
          destination = null;
        } else if (resolved.kind === 'resolved') {
          destination = resolved.place;
        }
      }

      if (clarify.length) {
        const ids = new Set(clarify[0].options.map(p => p.id));
        if (origin) ids.add(origin.id);
        if (destination) ids.add(destination.id);
        return {
          kind: 'clarify',
          message: /choose one of the supported places/i.test(clarify[0].prompt)
            ? clarify[0].prompt
            : clarify[0].prompt.replace(/\s*$/, '') + ' Choose one of the supported places below.',
          slot: clarify[0].slot,
          options: clarify[0].options,
          remaining: clarify.slice(1),
          draft: { origin: origin ? origin.id : null, destination: destination ? destination.id : null },
          placeIds: [...ids]
        };
      }

      if (destination && !origin) {
        return {
          kind: 'need_origin',
          message: originSuggestion
            ? `I heard ${destination.name} as your destination. Confirm starting from ${originSuggestion.name} (demo location — not GPS), choose another supported place, or type a full “from … to …” request.`
            : `I heard ${destination.name} as your destination. Which supported campus place are you starting from?`,
          destination,
          originSuggestion,
          placeIds: [destination.id].concat(originSuggestion ? [originSuggestion.id] : [])
        };
      }

      if (origin && destination) {
        if (origin.id === destination.id) {
          return {
            kind: 'same_place',
            message: `That looks like the same place (${origin.name}). Choose a different destination to plan a trip.`,
            origin,
            destination,
            placeIds: [origin.id]
          };
        }
        return {
          kind: 'confirm',
          message: `I interpreted this trip as ${origin.name} → ${destination.name}. Confirm to open the same route planner as manual entry, or correct a place first.`,
          origin,
          destination,
          placeIds: [origin.id, destination.id]
        };
      }
    }

    const { hits } = findHits(norm, places);
    const strong = distinctiveHits(hits);
    const matched = uniquePlaces(strong);

    if (/^(the )?(dorm|dorms|residence)$/.test(norm) || (/\b(dorm|dorms)\b/.test(norm) && matched.length !== 1)) {
      const homes = places.filter(p => p.type === 'home');
      return {
        kind: 'clarify',
        message: 'Which residence did you mean? I will not guess.',
        slot: 'destination',
        options: homes,
        draft: { origin: null, destination: null },
        placeIds: homes.map(p => p.id)
      };
    }

    if (/^(the )?library$/.test(norm)) {
      const libs = places.filter(p => /library/i.test(p.name + ' ' + p.category));
      return {
        kind: 'clarify',
        message: 'Which library did you mean? I will not guess.',
        slot: 'destination',
        options: libs,
        draft: { origin: null, destination: null },
        placeIds: libs.map(p => p.id)
      };
    }

    if (/^(the )?hall$/.test(norm)) {
      return {
        kind: 'unsupported',
        message: '“Hall” alone is not a supported campus place. Name a specific building (for example Bidgood Hall or Lloyd Hall), or use the manual destination field.',
        unknown: 'hall',
        placeIds: []
      };
    }

    if (matched.length >= 2) {
      const spans = new Set(strong.map(h => h.start + ':' + h.end));
      if (spans.size < 2) {
        return {
          kind: 'clarify',
          message: 'Which place did you mean? Several campus locations share similar words — I will not guess a full trip.',
          slot: 'destination',
          options: matched,
          draft: { origin: null, destination: null },
          placeIds: matched.map(p => p.id)
        };
      }
      return {
        kind: 'confirm',
        message: `I interpreted this trip as ${matched[0].name} → ${matched[1].name}. Confirm to open the route planner, or correct a place first.`,
        origin: matched[0],
        destination: matched[1],
        placeIds: matched.slice(0, 2).map(p => p.id)
      };
    }

    if (matched.length === 1) {
      return {
        kind: 'need_origin',
        message: originSuggestion
          ? `I heard ${matched[0].name}. Confirm starting from ${originSuggestion.name} (demo location — not GPS), or choose another start.`
          : `I heard ${matched[0].name}. Which supported place are you starting from?`,
        destination: matched[0],
        originSuggestion,
        placeIds: [matched[0].id].concat(originSuggestion ? [originSuggestion.id] : [])
      };
    }

    const suggestion = suggestFromUnknown(norm, places);
    if (suggestion) {
      return {
        kind: 'clarify',
        message: `Did you mean ${suggestion.name}? I will not silently replace your text. Choose a supported place below or rephrase.`,
        slot: 'destination',
        options: [suggestion],
        draft: { origin: null, destination: null },
        placeIds: [suggestion.id]
      };
    }

    if (/\b(hall|library|center|building|dorm|auditorium|coliseum|stadium)\b/.test(norm) && matched.length === 0) {
      return {
        kind: 'unsupported',
        message: `“${raw}” is not in this prototype’s campus places. I will not invent a destination. Use the manual destination field, or try a supported building like Bidgood or Lloyd Hall.`,
        unknown: raw,
        placeIds: []
      };
    }

    if (OFF_TOPIC_RE.test(raw) || (!TRIP_CUE_RE.test(norm) && matched.length === 0)) {
      return {
        kind: 'refuse_off_topic',
        message: 'I only help with campus trip planning in this demo. Try “Ferg to Gorgas,” tap an example, or enter a destination manually.',
        placeIds: []
      };
    }

    return {
      kind: 'unsupported',
      message: 'I could not match that request to supported campus places. I will not invent buildings, stops, or routes. Use the manual fields or try Bidgood, the Ferg, or Gorgas.',
      placeIds: []
    };
  }

  function assertKnownIds(result, places) {
    const allowed = new Set(places.map(p => p.id));
    for (const id of result.placeIds || []) {
      if (!allowed.has(id)) throw new Error('Invented place id: ' + id);
    }
    if (result.origin && !allowed.has(result.origin.id)) throw new Error('Invented origin');
    if (result.destination && !allowed.has(result.destination.id)) throw new Error('Invented destination');
    if (result.options) for (const p of result.options) if (!allowed.has(p.id)) throw new Error('Invented option');
    if (result.draft) {
      if (result.draft.origin && !allowed.has(result.draft.origin)) throw new Error('Invented draft origin');
      if (result.draft.destination && !allowed.has(result.draft.destination)) throw new Error('Invented draft destination');
    }
    if (result.remaining) {
      for (const step of result.remaining) {
        for (const p of step.options || []) if (!allowed.has(p.id)) throw new Error('Invented remaining option');
      }
    }
    return true;
  }

  const api = { EXAMPLES, interpret, normalize, findHits, assertKnownIds, LIVE_RE, OFF_TOPIC_RE, GENERIC_TOKENS };
  root.CampusAssistant = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
