'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const NS='http://www.w3.org/2000/svg';
const iconPaths={bus:'M5 16V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v11M5 10h14M8 3v7m8-7v7M5 16h14v3H5zM7 19v2m10-2v2M8 14h.01M16 14h.01',pin:'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0',info:'M12 11v6m0-10h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',route:'M5 4v13a3 3 0 0 0 6 0V7a3 3 0 0 1 6 0v13M2 4h6m6 16h6',bookmark:'M6 3h12v18l-6-4-6 4Z',arrow:'M4 12h16m-6-6 6 6-6 6',back:'M20 12H4m6-6-6 6 6 6',chevron:'m9 5 7 7-7 7',locate:'M12 2v3m0 14v3M2 12h3m14 0h3M19 12a7 7 0 1 1-14 0 7 7 0 0 1 14 0M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0',pause:'M9 5v14m6-14v14',play:'m8 4 12 8-12 8Z',restart:'M3 10a9 9 0 1 1 1 7M3 4v6h6',plus:'M12 5v14M5 12h14',minus:'M5 12h14',close:'m6 6 12 12M18 6 6 18',clock:'M12 8v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',walk:'M14 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0M8 21l4-9 2 5 4 4M6 11l4-4 3 1 3 5h4M13 8l-1 4',building:'M4 21V7l8-4 8 4v14M2 21h20M9 21v-5h6v5M8 9h1m6 0h1M8 12h1m6 0h1',home:'m2 10 10-8 10 8M5 9v12h14V9M9 21v-7h6v7',book:'M12 5c-4-3-8-2-10-1v16c4-2 7-1 10 1 3-2 6-3 10-1V4c-2-1-6-2-10 1Zm0 0v16',check:'m5 12 4 4L20 5',trash:'M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7',star:'m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z'};
function icon(name){return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${iconPaths[name]||iconPaths.pin}"/></svg>`}
function hydrateIcons(root=document){root.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon))}
const places=[
 {id:'presidential',name:'Presidential Village',category:'Residence halls',type:'home',x:350,y:151,aliases:'presidential village 1 2 pv dorm residence'},
 {id:'student-center',name:'Student Center',category:'Dining · Student life',type:'building',x:319,y:366,aliases:'ferguson ferg student union supe store'},
 {id:'bidgood',name:'Bidgood Hall',category:'Culverhouse College of Business',type:'building',x:236,y:463,aliases:'business finance culverhouse bidgood'},
 {id:'gorgas',name:'Gorgas Library',category:'Library · The Quad',type:'book',x:308,y:464,aliases:'gorgas library quad study'},
 {id:'shelby',name:'Shelby Hall',category:'Science & Engineering',type:'building',x:429,y:337,aliases:'shelby science chemistry'},
 {id:'serc',name:'SERC',category:'South Engineering Research Center',type:'building',x:385,y:376,aliases:'serc south engineering research center'},
 {id:'tutwiler',name:'Tutwiler Hall',category:'Residence hall · South campus',type:'home',x:226,y:702,aliases:'tut tutwiler dorm'},
 {id:'ridgecrest',name:'Ridgecrest South',category:'Residence hall',type:'home',x:216,y:288,aliases:'ridgecrest south dorm'},
 {id:'stadium',name:'Bryant–Denny Stadium',category:'Stadium · Athletics',type:'building',x:172,y:613,aliases:'bryant denny stadium saban football'},
 {id:'paty',name:'Paty Hall',category:'Residence hall',type:'home',x:292,y:293,aliases:'paty dorm'},
 {id:'lakeside',name:'Lakeside Dining',category:'Dining · North campus',type:'building',x:302,y:242,aliases:'lakeside dining food'},
 {id:'rec',name:'Student Recreation Center',category:'Recreation · East campus',type:'building',x:746,y:441,aliases:'rec recreation gym fitness'}
];
const routes=[
 {id:'campus',name:'Campus Loop',color:'#758c6d',direction:'Via Engineering & the Quad',points:[[344,179],[318,190],[312,215],[322,244],[350,251],[383,253],[422,273],[455,293],[473,320],[475,371],[465,397],[426,418],[404,440],[397,481],[399,552],[360,545],[309,537],[248,527],[251,475],[264,442],[294,443],[300,402],[302,361],[308,332],[315,287],[319,258],[310,224],[303,198],[344,179]],stops:[{i:0,name:'Presidential Village'},{i:3,name:'Lakeside'},{i:9,name:'Engineering'},{i:12,name:'Transit Hub'},{i:16,name:'The Quad — South'},{i:18,name:'Bidgood'},{i:20,name:'Gorgas'},{i:22,name:'Student Center'},{i:24,name:'Paty'}]},
 {id:'north',name:'North Connector',color:'#a08a69',direction:'Via Student Center & Gorgas',points:[[344,179],[303,198],[311,220],[323,254],[315,290],[309,338],[302,361],[300,402],[294,443],[355,449],[400,448],[429,420],[469,398],[475,373],[479,330],[475,290],[453,257],[420,245],[412,225],[405,194],[393,178],[344,179]],stops:[{i:0,name:'Presidential Village'},{i:3,name:'Lakeside'},{i:4,name:'Paty'},{i:6,name:'Student Center'},{i:8,name:'Gorgas'},{i:10,name:'Transit Hub'},{i:13,name:'Engineering'}]},
 {id:'west',name:'West Loop',color:'#778c9e',direction:'Via Bidgood, Stadium & Tutwiler',points:[[302,361],[277,356],[223,366],[205,377],[190,397],[181,426],[189,448],[208,452],[238,457],[245,476],[248,527],[230,545],[217,575],[209,625],[206,667],[215,697],[235,702],[249,675],[270,675],[320,681],[370,685],[401,685],[403,628],[400,557],[360,545],[309,537],[248,527],[251,475],[264,442],[294,443],[300,402],[302,361]],stops:[{i:0,name:'Student Center'},{i:3,name:'West Campus'},{i:8,name:'Bidgood'},{i:12,name:'Stadium'},{i:15,name:'Tutwiler'},{i:21,name:'South Campus'},{i:25,name:'The Quad — South'},{i:29,name:'Gorgas'}]}
];
routes.push(
 {id:'east',name:'East Campus',color:'#285bb8',direction:'Via Recreation & East Campus',points:[[475,398],[548,438],[624,424],[705,383],[750,361],[781,401],[798,451],[813,490],[797,522],[804,638],[700,625],[610,610],[520,585],[400,557],[397,481],[404,440],[475,398]],stops:[{i:0,name:'Engineering'},{i:4,name:'Recreation North'},{i:6,name:'Student Recreation Center'},{i:8,name:'East Campus'},{i:9,name:'Nursing'},{i:12,name:'Bryant Hall'},{i:15,name:'Transit Hub'}]},
 {id:'bryce',name:'Bryce Connector',color:'#8b4bab',direction:'Via Bryce & Engineering',points:[[475,398],[478,330],[473,320],[455,293],[462,227],[480,181],[548,157],[585,165],[596,231],[667,272],[707,335],[750,361],[705,383],[624,424],[548,438],[475,398]],stops:[{i:0,name:'Engineering'},{i:3,name:'Shelby North'},{i:6,name:'Bryce North'},{i:8,name:'Bryce Campus'},{i:10,name:'Bryce East'},{i:11,name:'Recreation North'},{i:14,name:'Transit Hub East'}]},
 {id:'coleman',name:'Coleman Connector',color:'#ad344a',direction:'Via Coleman & South Campus',points:[[294,443],[355,449],[400,448],[399,552],[403,628],[401,685],[445,687],[488,694],[512,727],[520,766],[501,806],[445,815],[401,812],[400,748],[370,685],[320,681],[270,675],[235,671],[217,575],[248,527],[251,475],[264,442],[294,443]],stops:[{i:0,name:'Gorgas'},{i:2,name:'Transit Hub'},{i:5,name:'Bryant Drive'},{i:8,name:'Coleman North'},{i:10,name:'Coleman Coliseum'},{i:12,name:'South Campus'},{i:17,name:'Tutwiler North'},{i:18,name:'Stadium'},{i:20,name:'Bidgood'}]}
);
places.push({id:'coleman',name:'Coleman Coliseum',category:'Athletics · South campus',type:'building',x:503,y:780,aliases:'coleman basketball gymnastics'}, {id:'bryce',name:'Bryce Campus',category:'North-east campus',type:'building',x:585,y:254,aliases:'bryce performing arts'});
/** POI marker anchors (AD-POI-4). Map-space points placed on the SVG `buildings` footprints
 *  (interior points chosen by eye against the 2014 reference artwork), deliberately separate from
 *  routing entrances. `check:true` = footprint match is uncertain. Illustrative only, not survey-verified. */
const poiVisual={
 presidential:{x:350,y:151,check:true},'student-center':{x:319,y:363},bidgood:{x:238,y:462},gorgas:{x:309,y:462},
 shelby:{x:441,y:329},serc:{x:387,y:380,check:true},tutwiler:{x:226,y:702},ridgecrest:{x:213,y:282,check:true},
 stadium:{x:198,y:623},paty:{x:291,y:295,check:true},lakeside:{x:302,y:242},rec:{x:740,y:441},
 coleman:{x:502,y:789},bryce:{x:556,y:287,check:true}
};
places.forEach(p=>{p.visual=poiVisual[p.id]});

CampusNetwork.apply(routes);
places.forEach(p=>{const e=CampusNetwork.entrances[p.id];if(e){p.x=e.point[0];p.y=e.point[1];}});
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),mod=(a,b)=>((a%b)+b)%b;
routes.forEach(r=>{let t=0;r.timeline=[];r.nodeTimes=[];r.points.forEach((p,i)=>{if(i===r.points.length-1)return;r.nodeTimes[i]=t;const next=r.points[i+1];if(r.stops.some(s=>s.i===i)){r.timeline.push({from:t,to:t+30,a:p,b:p,dwell:true,next});t+=30}const dt=Math.hypot(next[0]-p[0],next[1]-p[1])/1.3;r.timeline.push({from:t,to:t+dt,a:p,b:next,dwell:false});t+=dt});r.duration=t;r.stops.forEach(s=>{s.x=r.points[s.i][0];s.y=r.points[s.i][1];s.at=r.nodeTimes[s.i]})});
const buses=routes.flatMap((r,ri)=>[0,1].map((v)=>({id:`${ri+1}0${v+1}`,route:r,offset:v*r.duration/2+(ri===1?58:ri*41)})));
let state={tab:'ride',origin:places[0],destination:null,selected:null,trip:null,route:null,mapFocusRouteId:null,selectedPoi:null,assistantOpen:false,assistant:{log:[],draftOrigin:null,draftDestination:null,pending:null},sim:0,speed:3,paused:matchMedia('(prefers-reduced-motion: reduce)').matches,editing:null,results:[],phase:null,followMap:false,walkPreview:false};
/** Presentation-only map focus. Trip route always wins while a trip is active. */
function effectiveMapFocus(){return state.trip?state.trip.route.id:state.mapFocusRouteId}
let saved=[];try{saved=JSON.parse(localStorage.getItem('campus-saved')||'["student-center","bidgood"]');if(!Array.isArray(saved))saved=[];saved=saved.filter(id=>places.some(p=>p.id===id))}catch{saved=['student-center','bidgood']}
let savedLabels={};try{const v=JSON.parse(localStorage.getItem('campus-saved-labels')||'{}');if(v&&typeof v==='object'&&!Array.isArray(v))savedLabels=v;}catch{}
function savedLabel(p){return typeof savedLabels[p.id]==='string'&&savedLabels[p.id].trim()?savedLabels[p.id].trim():p.name;}
const panel=$('#panel'),map=$('#map');let lastFrame=null,lastRefresh=0,toastTimer;
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function toast(s){$('#toast').textContent=s;$('#toast').classList.remove('hidden');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.add('hidden'),3200)}
function mins(t){return Math.max(1,Math.ceil(Math.max(0,t)/60))}
function formatETA(t){return t<=10?'Now':`${mins(t)} min`}
function busArtwork(color='#777'){return `<svg viewBox="0 0 60 50" aria-hidden="true"><ellipse cx="30" cy="43" rx="23" ry="3" fill="#ddd"/><path d="M8 9h38l7 9v20H7V13q0-4 1-4" fill="${color}"/><path d="M9 11h32v14H9z" fill="#dce4e6"/><path d="M44 12l6 7v7h-6z" fill="#b6c7cc"/><path d="M18 11v14m11-14v14m11-14v14" stroke="${color}" stroke-width="2"/><path d="M8 30h43" stroke="#ffffff" stroke-opacity=".65" stroke-width="2"/><rect x="35" y="29" width="8" height="9" rx="1" fill="#0002"/><circle cx="17" cy="39" r="5" fill="#222"/><circle cx="44" cy="39" r="5" fill="#222"/><circle cx="17" cy="39" r="2" fill="#aaa"/><circle cx="44" cy="39" r="2" fill="#aaa"/><path d="M49 32h3" stroke="#fff" stroke-width="3"/></svg>`}
function busPosition(bus){const r=bus.route,t=mod(state.sim+bus.offset,r.duration);const seg=r.timeline.find(s=>t>=s.from&&t<s.to)||r.timeline[0];const f=seg.dwell?0:(t-seg.from)/(seg.to-seg.from),b=seg.dwell?seg.next:seg.b;return{x:seg.a[0]+(seg.b[0]-seg.a[0])*f,y:seg.a[1]+(seg.b[1]-seg.a[1])*f,angle:Math.atan2(b[1]-seg.a[1],b[0]-seg.a[0])*180/Math.PI+90,dwell:seg.dwell}}
function nextArrival(bus,stop,earliest=state.sim){let t=state.sim+mod(stop.at+30-mod(state.sim+bus.offset,bus.route.duration),bus.route.duration);while(t<earliest)t+=bus.route.duration;return t}
function computePlans(){
 if(!state.destination||state.destination===state.origin)return[];
 const direct=CampusNetwork.walking(state.origin,state.destination);const out=[];for(const r of routes){let best=null;
 for(const board of r.stops){const inPath=CampusNetwork.walking(state.origin,board);if(!inPath||inPath.seconds>600)continue;
 for(const exit of r.stops){if(board===exit)continue;const outPath=CampusNetwork.walking(exit,state.destination);if(!outPath||outPath.seconds>600)continue;
 if(direct&&inPath.seconds+outPath.seconds>=direct.seconds*.95)continue;
 const walkIn=inPath.seconds,walkOut=outPath.seconds,ride=mod(exit.at-board.at,r.duration);
 for(const bus of buses.filter(b=>b.route===r)){const pickup=nextArrival(bus,board,state.sim+walkIn+20),dropoff=pickup+ride-30,total=dropoff+walkOut-state.sim;
 const p={route:r,bus,board,exit,walkIn,walkOut,inPath,outPath,pickup,dropoff,total,created:state.sim};
 if(!best||total<best.total)best=p;}}}if(best)out.push(best);}return out.sort((a,b)=>a.total-b.total);
}
function directWalk(){return state.destination&&state.destination!==state.origin?CampusNetwork.walking(state.origin,state.destination):null;}
function walkComparison(){const w=directWalk();if(!w)return '';const quickest=state.results[0],diff=quickest?Math.round((quickest.total-w.seconds)/60):null;return `<div class="walk-comparison"><span class="place-icon">${icon('walk')}</span><div><strong>Walk the whole way · ${mins(w.seconds)} min</strong><small>${Math.round(w.meters)} m along campus paths${diff>0?' · About '+diff+' min faster than the bus':''}</small></div><button class="text-button" id="preview-walk">${state.walkPreview?'Show bus':'View path'}</button></div>`;}
function fields(){return `<div class="location-box"><label class="field"><span class="location-dot"></span><span class="screen-reader">Starting location</span><input id="origin-input" autocomplete="off" spellcheck="false" value="${escapeHtml(state.origin.name)}" aria-label="Starting location" aria-controls="suggestions"><button class="field-button" id="use-location" type="button" aria-label="Use demo current location">${icon('locate')}</button></label><label class="field"><span class="location-square"></span><span class="screen-reader">Destination</span><input id="destination-input" autocomplete="off" spellcheck="false" value="${escapeHtml(state.destination?.name||'')}" placeholder="Where to?" aria-label="Destination" aria-controls="suggestions">${state.destination?`<button type="button" id="clear-destination" class="field-button" aria-label="Clear destination">${icon('close')}</button>`:''}</label></div><div id="suggestions" class="suggestions hidden" aria-label="Matching campus locations"></div>`}
function placeRow(p,attr='data-place'){return `<button class="place-row" ${attr}="${p.id}"><span class="place-icon">${icon(p.type)}</span><span class="place-copy"><strong>${p.name}</strong><small>${p.category}</small></span>${icon('chevron')}</button>`}
function assistantEntry(){return `<button type="button" class="secondary assistant-entry" id="open-assistant">Ask Trip Assistant</button>`}
function homeContent(){return `<p class="eyebrow">University of Alabama</p><h1>Your campus.<br>Your next stop.</h1>${fields()}<div class="demo-hint"><span class="mini-user"></span>Starting at ${state.origin.name} · demo location</div>${assistantEntry()}${saved.length?`<div class="section-label">Your saved places</div><div class="saved-shortcuts">${saved.slice(0,4).map(id=>{const p=places.find(p=>p.id===id);return `<button data-place="${id}" class="saved-shortcut">${icon(p.type)}<strong>${escapeHtml(savedLabel(p))}</strong><small>${escapeHtml(p.name)}</small></button>`}).join('')}</div>`:''}<div class="section-label">Popular on campus</div><div class="places-list">${['student-center','bidgood','gorgas'].map(id=>placeRow(places.find(p=>p.id===id))).join('')}</div><div class="tip">${icon('bus')}<span>Your next ride is already on its way.<br>Choose a destination to find your bus.</span></div>`}
function resultsContent(){state.results=plans();if(!state.results.length)return `<h1>Plan your ride</h1>${fields()}${assistantEntry()}<div class="notice">${state.destination===state.origin?'You’re already at your destination. Choose another campus location.':'Walking is the better fit for this trip. No useful direct bus option connects these locations in this demo.'}</div>${walkComparison()}<button class="text-button" id="home-again">Choose another destination</button>`;if(!state.selected||!state.results.some(p=>p.route.id===state.selected)){state.selected=state.results[0].route.id;state.mapFocusRouteId=state.selected;}else if(state.mapFocusRouteId&&!state.results.some(p=>p.route.id===state.mapFocusRouteId)&&state.mapFocusRouteId!==state.selected){state.mapFocusRouteId=state.selected;}const selected=state.results.find(p=>p.route.id===state.selected);return `<p class="eyebrow">Let's get you there</p><h1>Choose your ride.</h1>${fields()}${assistantEntry()}${walkComparison()}<div class="ride-heading"><h2>Available routes</h2><small>Simulated estimates</small></div><div id="options">${state.results.map((p,i)=>optionContent(p,i)).join('')}</div><div class="trip-breakdown" id="breakdown">${breakdown(selected)}</div><button class="primary" id="follow">Follow this bus ${icon('arrow')}</button><div class="selection-note">You’ll walk to a bus stop. No booking needed.</div><button class="text-button" id="save-destination">${saved.includes(state.destination.id)?'✓ Saved destination':'+ Save this destination'}</button>`}

function breakdown(p){return `${icon('walk')} ${mins(p.walkIn)} min <span>·</span> ${icon('clock')} ${mins(Math.max(0,p.pickup-state.sim-p.walkIn))} min <span>·</span> ${icon('bus')} ${mins(p.dropoff-p.pickup)} min <span>·</span> ${icon('walk')} ${mins(p.walkOut)} min`}
function tripPhase(){const t=state.trip;if(!t)return null;if(state.sim<t.started+t.walkIn)return'walk';if(state.sim<t.pickup)return'wait';if(state.sim<t.dropoff)return'ride';if(state.sim<t.dropoff+t.walkOut)return'finish';return'arrived'}
function trackingContent(){const t=state.trip,phase=tripPhase();state.phase=phase;if(phase==='arrived')return `<div class="arrival-content"><div class="arrival-icon">${icon('check')}</div><p class="eyebrow">Trip complete</p><h1>You’ve arrived.</h1><p>Welcome to <strong>${state.destination.name}</strong>.</p><div class="notice">${t.route.name} · Bus ${t.bus.id}<br>Your simulated campus trip is complete.</div><button class="primary" id="new-trip">Plan another trip ${icon('arrow')}</button><button class="text-button" id="save-destination">${saved.includes(state.destination.id)?'✓ Saved destination':'+ Save this destination'}</button></div>`;const phaseIdx={walk:0,wait:1,ride:1,finish:2}[phase];const headline=phase==='walk'?'Head to your stop.':phase==='wait'?'Your bus is on its way.':phase==='ride'?'You’re on your way.':'Just a short walk.';const remaining=phase==='walk'||phase==='wait'?t.pickup-state.sim:t.dropoff+t.walkOut-state.sim;return `<div class="back-row"><button class="back-button" id="back-to-routes">${icon('back')}Route options</button><button class="icon-button" id="save-destination" aria-label="Save destination">${icon(saved.includes(state.destination.id)?'check':'bookmark')}</button></div><div class="tracking-top"><h1>${headline}</h1><div class="eta-tile"><strong id="track-eta">${mins(remaining)}</strong><span>${phase==='walk'||phase==='wait'?'min to bus':'min left'}</span></div></div><div class="track-bus"><div class="bus-picture">${busArtwork(t.route.color)}</div><div><h3>${t.route.name}</h3><p>${t.route.direction}</p><span class="bus-id">BUS ${t.bus.id}</span></div></div><div class="timeline"><div class="step ${phaseIdx===0?'active':'done'}"><span class="step-icon">${icon(phaseIdx>0?'check':'walk')}</span><div><strong>Walk to ${t.board.name}</strong><small>${mins(t.walkIn)} min walk · ${t.board.street}</small></div></div><div class="step ${phaseIdx===1?'active':phaseIdx>1?'done':''}"><span class="step-icon">${icon(phaseIdx>1?'check':'bus')}</span><div><strong>Take ${t.route.name}</strong><small>Look for Bus ${t.bus.id} · ${mins(t.dropoff-t.pickup)} min ride<br>Get off at ${t.exit.name}<br>${boardingDirection(t)}</small></div></div><div class="step ${phaseIdx===2?'active':''}"><span class="step-icon">${icon('pin')}</span><div><strong>${state.destination.name}</strong><small>${mins(t.walkOut)} min walk from the exit stop</small></div></div></div><div class="notice">${phase==='walk'?`Follow the dotted path to ${t.board.name} on ${t.board.street}. ${boardingDirection(t)}`:phase==='wait'?`Look for the ${t.route.name} route sign. Your bus is highlighted on the map.`:phase==='ride'?`Get off at ${t.exit.name}. We’ll alert you before your stop.`:'Follow the dotted path to your destination.'}</div><div class="progress-bar"><div id="trip-progress" class="progress-fill"></div></div><div class="selection-note">Departs ${clockTime(t.pickup)} · Arrive ${clockTime(t.dropoff+t.walkOut)}</div><button class="secondary" id="next-stage" style="width:100%;margin-top:12px">Next demo stage →</button>${assistantEntry()}<button class="text-button" id="cancel-trip">End trip</button>`}
function routesContent(){
 const focusId=effectiveMapFocus(),tripLock=!!state.trip,focusRoute=focusId?routes.find(r=>r.id===focusId):null;
 const tripNote=tripLock?'<div class="notice trip-focus-note" role="status">'+icon('info')+'<span>Trip in progress — your selected route remains highlighted.</span></div>':'';
 const showAllBtn=tripLock?'':'<button class="text-button" id="all-routes" type="button">Show All Routes</button>';
 if(state.route){
  const r=routes.find(x=>x.id===state.route);
  const mapStay=tripLock&&focusRoute&&focusRoute.id!==r.id?'<br>Map stays on '+focusRoute.name+' until this trip ends.':'';
  return '<div class="back-row"><button class="back-button" id="back-routes">'+icon('back')+'All routes</button>'+showAllBtn+'</div>'+tripNote+'<p class="eyebrow">Demo route</p><h1>'+r.name+'</h1><p class="subtle">'+r.direction+'<br>2 simulated buses · '+mins(r.duration)+' min loop'+mapStay+'</p><div class="route-stops">'+r.stops.map(s=>'<div class="route-stop"><span class="stop-dot" style="border-color:'+r.color+'"></span>'+s.name+'</div>').join('')+'</div><div class="tip">'+icon('info')+'<span>These stops demonstrate the experience. They are not an official Crimson Ride timetable.</span></div>';
 }
 const list=routes.map(r=>{
  const active=focusId===r.id,tag=tripLock&&active?' · Active trip':'';
  return '<button class="route-list-item '+(active?'focused':'')+'" data-route="'+r.id+'" aria-pressed="'+active+'"><span class="route-badge" style="background:'+r.color+'">'+icon('bus')+'</span><span><strong>'+r.name+'</strong><small>'+r.stops.length+' stops · 2 buses'+tag+'</small></span>'+icon('chevron')+'</button>';
 }).join('');
 const restore=(!tripLock&&focusId)?showAllBtn:'';
 const tip=tripLock?'Return to Ride to continue your trip, or end the trip to explore every corridor again.':'Tap a route to isolate it on the map. Tap the active route again or choose Show All Routes to restore every corridor.';
 return '<p class="eyebrow">Explore campus</p><h1>Find your way.</h1><p class="subtle" style="margin:-10px 0 24px">Six campus routes. One familiar campus.</p>'+tripNote+list+restore+'<div class="tip">'+icon('pin')+'<span>'+tip+'</span></div>';
}
const poiTypeLabels={home:'Residence hall',building:'Campus building',book:'Library'};
/** POI info card (AD-POI-1/5). Inspect-only while a trip is active. */
function poiCardContent(){
 const p=state.selectedPoi,locked=!!state.trip;
 const status=[state.origin===p?'Current starting point':'',state.destination===p?'Current destination':''].filter(Boolean).join(' · ');
 return '<div class="poi-card" id="poi-card" tabindex="-1" role="region" aria-label="Place details: '+escapeHtml(p.name)+'">'
  +'<div class="poi-head"><span class="place-icon">'+icon(p.type)+'</span><span class="poi-type">'+(poiTypeLabels[p.type]||'Campus location')+'</span>'
  +'<button class="icon-button" id="poi-close" type="button" aria-label="Close place details">'+icon('close')+'</button></div>'
  +'<h1>'+escapeHtml(p.name)+'</h1><p class="poi-category">'+escapeHtml(p.category)+'</p>'
  +(status?'<p class="poi-status">'+status+'</p>':'')
  +(p.visual.check?'<p class="poi-status" role="status">Uncertain footprint match · illustrative only</p>':'')
  +(locked?'<div class="notice trip-focus-note" role="status">'+icon('info')+'<span>Trip in progress — end your trip to change your start or destination.</span></div>':'')
  +'<div class="poi-actions"><button class="primary" id="poi-directions" type="button"'+(locked?' disabled aria-disabled="true"':'')+'>Get Directions '+icon('arrow')+'</button>'
  +'<button class="secondary" id="poi-start" type="button"'+(locked?' disabled aria-disabled="true"':'')+'>Set as Starting Point</button></div>'
  +'<p class="selection-note">Illustrative marker position · simulated demo data</p></div>';
}
function assistantLogHtml(){return state.assistant.log.map(m=>`<div class="assistant-msg ${m.role}"><p>${escapeHtml(m.text)}</p></div>`).join('')}
function assistantDraftHtml(){
 const o=state.assistant.draftOrigin,d=state.assistant.draftDestination,pending=state.assistant.pending;
 if(!pending)return '';
 const locked=!!state.trip;
 if(pending.kind==='clarify'&&pending.options?.length){
  return `<div class="assistant-actions"><p class="subtle">${escapeHtml(pending.message)}</p>${pending.options.map(p=>`<button type="button" class="suggestion" data-assistant-pick="${p.id}" data-assistant-slot="${pending.slot||'destination'}"><span class="place-icon">${icon(p.type)}</span><span class="place-copy"><strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(p.category)}</small></span></button>`).join('')}</div>`;
 }
 if(pending.kind==='need_origin'&&pending.destination){
  const suggest=pending.originSuggestion||state.origin;
  return `<div class="assistant-actions"><p class="subtle">${escapeHtml(pending.message)}</p>
   <button type="button" class="primary" id="assistant-use-origin" ${locked?'disabled':''}>Start from ${escapeHtml(suggest.name)} (demo · not GPS)</button>
   <div class="section-label">Or choose another start</div>
   ${places.map(p=>`<button type="button" class="suggestion" data-assistant-pick="${p.id}" data-assistant-slot="origin"><span class="place-icon">${icon(p.type)}</span><span class="place-copy"><strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(p.category)}</small></span></button>`).join('')}</div>`;
 }
 if(pending.kind==='confirm'&&o&&d){
  return `<div class="assistant-confirm"><p class="subtle">Confirm trip · simulated assistant</p>
   <div class="assistant-pair"><span><small>From</small><strong>${escapeHtml(o.name)}</strong></span><span><small>To</small><strong>${escapeHtml(d.name)}</strong></span></div>
   <button type="button" class="primary" id="assistant-confirm" ${locked?'disabled':''}>Confirm &amp; plan ride ${icon('arrow')}</button>
   <div class="assistant-correct"><label>Correct start<select id="assistant-origin-select">${places.map(p=>`<option value="${p.id}" ${p.id===o.id?'selected':''}>${escapeHtml(p.name)}</option>`).join('')}</select></label>
   <label>Correct destination<select id="assistant-dest-select">${places.map(p=>`<option value="${p.id}" ${p.id===d.id?'selected':''}>${escapeHtml(p.name)}</option>`).join('')}</select></label>
   <button type="button" class="secondary" id="assistant-apply-correction" ${locked?'disabled':''}>Update places</button></div>
   ${locked?'<div class="notice trip-focus-note" role="status">'+icon('info')+'<span>Trip in progress — end your trip before applying a new plan.</span></div>':''}</div>`;
 }
 if(pending.kind==='unsupported'||pending.kind==='refuse_live'||pending.kind==='refuse_off_topic'||pending.kind==='same_place'){
  return `<div class="assistant-actions"><button type="button" class="secondary" id="assistant-manual">Use manual destination entry</button></div>`;
 }
 return '';
}
function assistantContent(){
 const examples=CampusAssistant.EXAMPLES.map(ex=>`<button type="button" class="assistant-chip" data-assistant-example="${escapeHtml(ex.id)}">${escapeHtml(ex.label)}</button>`).join('');
 return `<div class="assistant-panel" id="assistant-panel">
  <div class="back-row"><button type="button" class="back-button" id="close-assistant">${icon('back')}Ride</button></div>
  <p class="eyebrow">Trip assistant</p><h1>Ask in plain language.</h1>
  <div class="notice assistant-sim" role="status">${icon('info')}<span>Simulated assistant for this class prototype. Responses and transit information are not live. Actual AI accuracy cannot be validated here.</span></div>
  <div class="assistant-log" id="assistant-log" aria-live="polite">${assistantLogHtml()||'<div class="assistant-msg bot"><p>Describe a campus trip, or tap an example. I only use supported places already in this demo.</p></div>'}</div>
  ${assistantDraftHtml()}
  <div class="section-label">Examples</div><div class="assistant-chips">${examples}</div>
  <form id="assistant-form" class="assistant-form"><label class="screen-reader" for="assistant-input">Trip request</label>
  <input id="assistant-input" name="assistant" autocomplete="off" spellcheck="true" maxlength="180" placeholder="e.g. Presidential to Bidgood">
  <button class="primary" type="submit">Send</button></form>
  <p class="selection-note">Nothing is saved off this device. Manual fields still work when you leave this panel.</p></div>`;
}
function openAssistant(){
 state.selectedPoi=null;state.tab='ride';state.editing=null;state.assistantOpen=true;
 if(!state.assistant.log.length)state.assistant.log=[];
 renderPanel();panel.scrollTop=0;
 if(typeof revealSheet==='function')revealSheet();
 // Expand after the opening click finishes bubbling so mobile sheet handlers cannot collapse it.
 if(typeof setSheet==='function'&&innerWidth<=680){
  setSheet(2,true);
  setTimeout(()=>{setSheet(2,true);panel.scrollTop=0},0);
 }
 // Keep the simulated disclosure in view; do not scroll the sheet to the input.
 $('#assistant-input')?.focus({preventScroll:true});
 panel.scrollTop=0;
 announce('Trip assistant open. Simulated responses.');
}
function closeAssistant(){state.assistantOpen=false;state.assistant.pending=null;renderPanel();panel.scrollTop=0}
function pushAssistant(role,text){state.assistant.log.push({role,text});if(state.assistant.log.length>12)state.assistant.log=state.assistant.log.slice(-12)}
function assistantPlaceById(id){return id?places.find(p=>p.id===id)||null:null}
function runAssistantInterpret(text){
 const originBefore=state.origin,destBefore=state.destination;
 const result=CampusAssistant.interpret(text,{places,originSuggestion:state.origin});
 CampusAssistant.assertKnownIds(result,places);
 pushAssistant('user',text);
 pushAssistant('bot',result.message);
 state.assistant.pending=result;
 // Preserve already-resolved locations from clarify drafts (do not drop Bidgood when asking which dorm).
 state.assistant.draftOrigin=result.origin||assistantPlaceById(result.draft?.origin)||null;
 state.assistant.draftDestination=result.destination||assistantPlaceById(result.draft?.destination)||null;
 // AD-AI-2: interpret never mutates endpoints
 if(state.origin!==originBefore||state.destination!==destBefore)throw new Error('Assistant mutated trip fields on interpret');
 renderPanel();panel.scrollTop=panel.scrollHeight;
}
function applyAssistantTrip(origin,destination){
 if(state.trip){toast('End your trip to plan a new one');return}
 if(!origin||!destination)return;
 if(origin.id===destination.id){toast('Choose two different places');return}
 state.assistantOpen=false;state.assistant.pending=null;state.selectedPoi=null;
 state.walkPreview=false;state.origin=origin;state.destination=destination;state.tab='ride';
 state.route=null;state.trip=null;state.selected=null;state.mapFocusRouteId=null;planCache=null;
 renderPanel();panel.scrollTop=0;centerOnPlaces();announce(`Planning ${origin.name} to ${destination.name}`);
}
function renderPanel(){const scroll=panel.scrollTop;$$('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===state.tab));if(state.selectedPoi){state.phase=state.trip?tripPhase():null;panel.innerHTML=poiCardContent();}else if(state.assistantOpen&&state.tab==='ride'){panel.innerHTML=assistantContent();}else panel.innerHTML=state.tab==='routes'?routesContent():state.tab==='saved'?savedContent():state.trip?trackingContent():state.destination?resultsContent():homeContent();bindPanel();panel.scrollTop=scroll;drawFocus()}
function bindPanel(){
 $('#open-assistant')?.addEventListener('click',openAssistant);
 $('#close-assistant')?.addEventListener('click',closeAssistant);
 $('#assistant-form')?.addEventListener('submit',e=>{e.preventDefault();const v=$('#assistant-input')?.value.trim();if(!v)return;runAssistantInterpret(v);const input=$('#assistant-input');if(input)input.value=''});
 $$('[data-assistant-example]').forEach(b=>b.addEventListener('click',()=>{const ex=CampusAssistant.EXAMPLES.find(x=>x.id===b.dataset.assistantExample);if(ex)runAssistantInterpret(ex.text)}));
 $$('[data-assistant-pick]').forEach(b=>b.addEventListener('click',()=>{
  if(state.trip){toast('End your trip to change your start or destination');return}
  const place=places.find(p=>p.id===b.dataset.assistantPick);if(!place)return;
  const slot=b.dataset.assistantSlot||'destination';
  if(slot==='origin')state.assistant.draftOrigin=place;else state.assistant.draftDestination=place;
  const o=state.assistant.draftOrigin,d=state.assistant.draftDestination;
  const remaining=(state.assistant.pending?.remaining||[]).filter(step=>{
   if(step.slot==='origin'&&o)return false;
   if(step.slot==='destination'&&d)return false;
   return true;
  });
  if(o&&d){
   state.assistant.pending={kind:'confirm',message:`Updated to ${o.name} → ${d.name}. Confirm to open the route planner.`,origin:o,destination:d,placeIds:[o.id,d.id]};
   pushAssistant('bot',state.assistant.pending.message);
  }else if(remaining.length){
   const next=remaining[0];
   state.assistant.pending={kind:'clarify',message:next.prompt+' Choose one of the supported places below.',slot:next.slot,options:next.options,remaining:remaining.slice(1),draft:{origin:o?.id||null,destination:d?.id||null},placeIds:[...new Set(next.options.map(p=>p.id).concat(o?[o.id]:[],d?[d.id]:[]))]};
   pushAssistant('bot',state.assistant.pending.message);
  }else if(slot==='destination'&&!o){
   state.assistant.pending={kind:'need_origin',message:`Destination set to ${place.name}. Confirm a starting place (demo location is not GPS).`,destination:place,originSuggestion:state.origin,placeIds:[place.id,state.origin.id]};
   state.assistant.draftDestination=place;pushAssistant('bot',state.assistant.pending.message);
  }
  renderPanel();
 }));
 $('#assistant-use-origin')?.addEventListener('click',()=>{
  if(state.trip){toast('End your trip to change your start or destination');return}
  const d=state.assistant.draftDestination||state.assistant.pending?.destination;if(!d)return;
  const o=state.assistant.pending?.originSuggestion||state.origin;
  state.assistant.draftOrigin=o;state.assistant.draftDestination=d;
  state.assistant.pending={kind:'confirm',message:`Confirm ${o.name} → ${d.name}. Starting point is a demo location, not GPS.`,origin:o,destination:d,placeIds:[o.id,d.id]};
  pushAssistant('bot',state.assistant.pending.message);renderPanel();
 });
 $('#assistant-apply-correction')?.addEventListener('click',()=>{
  const o=places.find(p=>p.id===$('#assistant-origin-select')?.value),d=places.find(p=>p.id===$('#assistant-dest-select')?.value);
  if(!o||!d)return;state.assistant.draftOrigin=o;state.assistant.draftDestination=d;
  state.assistant.pending={kind:'confirm',message:`Updated to ${o.name} → ${d.name}. Confirm when ready.`,origin:o,destination:d,placeIds:[o.id,d.id]};
  pushAssistant('bot',state.assistant.pending.message);renderPanel();
 });
 $('#assistant-confirm')?.addEventListener('click',()=>{
  applyAssistantTrip(state.assistant.draftOrigin,state.assistant.draftDestination);
 });
 $('#assistant-manual')?.addEventListener('click',()=>{closeAssistant();$('#destination-input')?.focus()});
 $('#poi-close')?.addEventListener('click',()=>dismissPoi(true));
 $('#poi-directions')?.addEventListener('click',poiGetDirections);
 $('#poi-start')?.addEventListener('click',poiSetStart);
 $('#preview-walk')?.addEventListener('click',()=>{state.walkPreview=!state.walkPreview;renderPanel();centerOnPlaces();});
 $('#add-saved')?.addEventListener('submit',e=>{e.preventDefault();const id=$('#saved-place-select').value,label=$('#saved-label').value.trim();if(!places.some(p=>p.id===id))return;if(!saved.includes(id))saved.push(id);if(label)savedLabels[id]=label.slice(0,40);storeSaved();renderPanel();toast('Place saved');});
 $$('[data-edit-label]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.editLabel;const field=$(`[data-label-for="${id}"]`);savedLabels[id]=field.value.trim().slice(0,40);storeSaved();renderPanel();toast('Saved name updated');}));
for(const field of ['origin','destination']){const e=$(`#${field}-input`);if(e){e.addEventListener('focus',()=>{state.editing=field;e.select();showSuggestions('')});e.addEventListener('input',()=>{showSuggestions(e.value);const follow=$('#follow');if(follow)follow.disabled=true});e.addEventListener('keydown',ev=>{if(ev.key==='Escape'){$('#suggestions').classList.add('hidden');e.blur()}if(ev.key==='Enter'){ev.preventDefault();const q=normalize(e.value),exact=places.find(p=>normalize(p.name)===q);if(exact)choosePlace(exact);else{const first=$('#suggestions [data-suggestion]');if(first)first.click()}}})}}
 $('#use-location')?.addEventListener('click',e=>{e.preventDefault();state.origin=places[0];state.trip=null;state.selected=null;renderPanel();toast('Demo location set to Presidential Village');centerOnPlaces()});$('#clear-destination')?.addEventListener('click',resetDestination);
 $$('[data-place]').forEach(b=>b.addEventListener('click',()=>{state.walkPreview=false;state.destination=places.find(p=>p.id===b.dataset.place);state.tab='ride';state.trip=null;state.selected=null;state.mapFocusRouteId=null;renderPanel();panel.scrollTop=0;centerOnPlaces()}));
 $$('[data-option]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.option;if(state.selected===id&&state.mapFocusRouteId===id){state.mapFocusRouteId=null;drawFocus();$$('[data-option]').forEach(x=>x.classList.toggle('chosen',x.dataset.option===state.selected));return;}state.selected=id;state.mapFocusRouteId=id;renderPanel()}));
 $('#next-stage')?.addEventListener('click',nextStage);$('#follow')?.addEventListener('click',()=>{const p=plans().find(p=>p.route.id===state.selected);if(!p)return;if(p.pickup<state.sim+p.walkIn+15){refreshPlans();toast('That departure is too soon to reach. Updated departures shown.');return;}state.trip={...p,started:state.sim};state.mapFocusRouteId=p.route.id;state.followMap=true;state.walkPreview=false;state.alerts=new Set();state.phase=null;renderPanel();panel.scrollTop=0;announce(`Following ${p.route.name}, bus ${p.bus.id}`)});
 $('#save-destination')?.addEventListener('click',()=>{if(!state.destination)return;if(!saved.includes(state.destination.id)){saved.push(state.destination.id);storeSaved();toast(`${state.destination.name} saved`)}else toast('This destination is already saved');renderPanel()});
 $('#back-to-routes')?.addEventListener('click',()=>{state.trip=null;state.phase=null;state.mapFocusRouteId=state.selected;renderPanel()});$('#cancel-trip')?.addEventListener('click',()=>{state.trip=null;state.phase=null;state.mapFocusRouteId=state.selected;renderPanel();toast('Demo trip ended')});$('#new-trip')?.addEventListener('click',()=>{state.origin=state.destination;resetDestination()});$('#home-again')?.addEventListener('click',resetDestination);
 $$('[data-route]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.route;if(state.trip){state.route=state.route===id?null:id;renderPanel();return;}if(state.mapFocusRouteId===id){state.route=null;state.mapFocusRouteId=null;renderPanel();resetMap();return;}state.route=id;state.mapFocusRouteId=id;renderPanel();centerRoute(id)}));
 $('#back-routes')?.addEventListener('click',()=>{state.route=null;renderPanel();});
 $('#all-routes')?.addEventListener('click',()=>{if(state.trip){renderPanel();return;}state.route=null;state.mapFocusRouteId=null;renderPanel();resetMap()});
 $$('[data-remove]').forEach(b=>b.addEventListener('click',()=>{saved=saved.filter(id=>id!==b.dataset.remove);storeSaved();renderPanel()}));
}
function storeSaved(){try{localStorage.setItem('campus-saved',JSON.stringify(saved));localStorage.setItem('campus-saved-labels',JSON.stringify(savedLabels))}catch{toast('Saved for this session only')}}
function normalize(s){return s.toLowerCase().replace(/[–—-]/g,' ').trim()}
function showSuggestions(q){const box=$('#suggestions');if(!box)return;const query=normalize(q),matches=places.filter(p=>normalize(p.name+' '+p.aliases).includes(query));box.innerHTML=matches.length?matches.map(p=>`<button class="suggestion" data-suggestion="${p.id}"><span class="place-icon">${icon(p.type)}</span><span class="place-copy"><strong>${p.name}</strong><small>${p.category}</small></span></button>`).join(''):'<div class="notice">No matching campus location. Try “Ferg,” “Bidgood,” or “Gorgas.”</div>';box.classList.remove('hidden');box.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>choosePlace(places.find(p=>p.id===b.dataset.suggestion))))}
function choosePlace(p){state.walkPreview=false;state[state.editing||'destination']=p;state.trip=null;state.selected=null;state.mapFocusRouteId=null;state.editing=null;renderPanel();centerOnPlaces()}
/** Map POI actions. Selecting only previews; endpoints change solely via the card buttons (AD-POI-1). */
function selectPoi(p){
 state.editing=null;state.assistantOpen=false;state.selectedPoi=p;renderPanel();panel.scrollTop=0;
 if(typeof revealSheet==='function')revealSheet();
 revealPoi(p);$('#poi-card')?.focus({preventScroll:true});announce(`${p.name}. Place details open.`);
}
function dismissPoi(restoreFocus=false){
 const p=state.selectedPoi;if(!p)return;
 state.selectedPoi=null;renderPanel();
 if(restoreFocus)$(`[data-poi="${p.id}"]`)?.focus({preventScroll:true});
}
function poiGetDirections(){
 const p=state.selectedPoi;if(!p)return;
 if(state.trip){toast('End your trip to change your destination');return}
 state.selectedPoi=null;state.walkPreview=false;state.destination=p;state.tab='ride';state.route=null;state.trip=null;state.selected=null;state.mapFocusRouteId=null;
 renderPanel();panel.scrollTop=0;centerOnPlaces();
}
function poiSetStart(){
 const p=state.selectedPoi;if(!p)return;
 if(state.trip){toast('End your trip to change your starting point');return}
 state.selectedPoi=null;state.walkPreview=false;state.origin=p;state.tab='ride';state.route=null;state.trip=null;state.selected=null;state.mapFocusRouteId=null;
 renderPanel();panel.scrollTop=0;centerOnPlaces();toast(`Starting point set to ${p.name}`);
}
/** Mobile: keep a tapped marker visible above the bottom sheet. */
function revealPoi(p){
 if(innerWidth>680)return;
 const rect=map.getBoundingClientRect(),sheetH=$('.sidebar').getBoundingClientRect().height,visible=Math.max(100,rect.height-sheetH);
 const sx=(p.visual.x-view.x)/view.w*rect.width,sy=(p.visual.y-view.y)/view.h*rect.height,pad=36;
 if(sx>pad&&sx<rect.width-pad&&sy>pad+50&&sy<visible-pad)return;
 state.followMap=false;view={...view,x:p.visual.x-view.w/2,y:p.visual.y-view.h*(visible/rect.height)/2};setView();
}
function resetDestination(){state.selectedPoi=null;state.assistantOpen=false;state.walkPreview=false;state.followMap=false;state.destination=null;state.trip=null;state.selected=null;state.mapFocusRouteId=null;state.phase=null;state.tab='ride';renderPanel();panel.scrollTop=0;resetMap()}
function announce(s){$('#announcement').textContent=s}
function svgEl(tag,attrs={},html=''){const e=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));if(html)e.innerHTML=html;return e}
/** Interactive POI marker anchored on the building footprint (`visual`), not the routing entrance. */
function makePoiMarker(p){
 const g=svgEl('g',{class:'poi-marker',transform:`translate(${p.visual.x},${p.visual.y})`,'data-poi':p.id,role:'button',tabindex:0,'aria-pressed':'false','aria-label':`${p.name}, ${p.category}. Show place details`},
  `<title>${escapeHtml(p.name)}</title><circle class="poi-hit" r="20"/><circle class="poi-ring" r="10.5"/><circle class="poi-dot" r="6.5"/><circle class="poi-core" r="2.2"/><text class="poi-label" y="-13" text-anchor="middle">${escapeHtml(p.name)}</text>`);
 g.addEventListener('click',()=>{if(!didPan)selectPoi(p)});
 g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectPoi(p)}});
 $('#poi-markers').append(g);
}
function syncPoiMarkers(){$$('.poi-marker').forEach(g=>{const on=g.dataset.poi===state.selectedPoi?.id;g.classList.toggle('selected',on);g.setAttribute('aria-pressed',on)})}
function makeMap(){const lines=$('#route-lines');routes.forEach(r=>{const d=pathD(r.points);lines.append(svgEl('path',{d,class:'route-underlay','data-under':r.id}),svgEl('path',{d,stroke:r.color,class:'route-path','data-line':r.id}));r.stops.forEach(s=>$('#stop-markers').append(svgEl('circle',{cx:s.x,cy:s.y,r:3,stroke:r.color,class:'stop-mark','data-stop-route':r.id}))) });
 places.forEach(makePoiMarker);
 buses.forEach(b=>{const g=svgEl('g',{class:'bus-marker','data-bus':b.id,role:'button',tabindex:0,'aria-label':`Bus ${b.id}, ${b.route.name}`},`<title>Bus ${b.id} · ${b.route.name}</title><g class="bus-turn"><rect x="-8" y="-13" width="16" height="26" rx="4" fill="white" stroke="white" stroke-width="3"/><rect class="bus-body" x="-7" y="-12" width="14" height="24" rx="3" fill="${b.route.color}" stroke="#52604e" stroke-width=".7"/><path d="M-5-7H5V-3H-5Z" fill="#e8efed"/><path d="M-5 5H5M-5 8H5" stroke="#fff" stroke-opacity=".5" stroke-width="1"/><path d="M-8-6v5M8-6v5M-8 5v5M8 5v5" stroke="#353c31" stroke-width="1.8"/></g><g class="bus-id-label"><rect x="12" y="-21" width="43" height="16" rx="4" fill="#fff" stroke="#ddd" stroke-width=".5"/><text x="33.5" y="-10" text-anchor="middle" fill="#111" font-size="8" font-family="Arial" font-weight="600">BUS ${b.id}</text></g>`);g.addEventListener('click',()=>{if(didPan)return;state.selectedPoi=null;state.tab='routes';state.route=b.route.id;state.mapFocusRouteId=b.route.id;renderPanel();toast(`Bus ${b.id} · ${b.route.name}`)});g.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();g.dispatchEvent(new Event('click'))}});$('#bus-markers').append(g)});
}
function drawFocus(){const active=effectiveMapFocus();syncPoiMarkers();
 $$('[data-line]').forEach(e=>{const on=!active||e.dataset.line===active;e.style.display=on?'':'none';e.classList.toggle('emphasis',!!active&&e.dataset.line===active);e.classList.remove('dimmed')});
 $$('[data-under]').forEach(e=>{e.style.display=!active||e.dataset.under===active?'':'none';e.style.opacity=1});
 $$('[data-stop-route]').forEach(e=>{const on=!active||e.dataset.stopRoute===active;e.style.display=on?'':'none';e.style.opacity=.8;e.setAttribute('r',active&&e.dataset.stopRoute===active?3.5:2.3)});
 $$('[data-bus]').forEach(e=>{const b=buses.find(b=>b.id===e.dataset.bus);const on=!active||b.route.id===active;e.style.display=on?'':'none';e.style.opacity=1;e.classList.toggle('selected',e.dataset.bus===state.trip?.bus.id)});
 const markers=$('#location-markers');markers.innerHTML='';const o=state.origin;markers.append(svgEl('circle',{cx:o.x,cy:o.y,r:17,class:'user-halo'}),svgEl('circle',{cx:o.x,cy:o.y,r:5,class:'user-dot'}));if(state.destination){const d=state.destination;markers.append(svgEl('g',{transform:`translate(${d.x},${d.y-3})`},'<path d="M0 4C-3 0-10-5-10-12a10 10 0 0 1 20 0C10-5 3 0 0 4Z" class="destination-pin"/><circle cx="0" cy="-12" r="3" fill="#fff"/>'))}
 const p=state.trip||state.results.find(p=>p.route.id===state.selected),walk=$('#walk-lines');walk.innerHTML='';
 if(state.destination&&state.tab==='ride'){
 const paths=state.walkPreview&&!state.trip?[directWalk()]:p?[p.inPath,p.outPath]:[];
 for(const path of paths.filter(Boolean)){walk.append(svgEl('path',{d:pathD(path.points),class:'walking-underlay'}),svgEl('path',{d:pathD(path.points),class:'walking-line'}));}
 if(p&&!state.walkPreview){for(const [label,stop] of [['Board',p.board],['Exit',p.exit]]){walk.append(svgEl('circle',{cx:stop.x,cy:stop.y,r:5,class:'trip-stop'}),svgEl('text',{x:stop.x+9,y:stop.y-7,class:'trip-stop-label'},label));}}
 }
 const focused=active?routes.find(r=>r.id===active):null;
 $('#map-title').textContent=focused?focused.name:'Campus in motion';
 const titleSmall=$('.map-title-card small');if(titleSmall)titleSmall.textContent=focused?`Isolated · ${buses.filter(b=>b.route.id===active).length} buses on this route`:'12 buses · 6 campus routes';
 updateTracking();
}
function updateTracking(){const t=state.trip,status=$('#map-status');if(!t){status.classList.add('hidden');return}const phase=tripPhase();if(phase!==state.phase&&state.tab==='ride'){renderPanel();panel.scrollTop=0;announce(phase==='ride'?'Demo bus boarded. You are on your way.':phase==='arrived'?'Demo trip complete. You have arrived.':phase==='finish'?'Exit the bus and walk to your destination.':'You have reached your boarding stop.');return}const remaining=phase==='walk'||phase==='wait'?t.pickup-state.sim:t.dropoff+t.walkOut-state.sim;$('#track-eta')&&($('#track-eta').textContent=mins(remaining));const progress=$('#trip-progress');if(progress)progress.style.width=`${Math.min(100,Math.max(0,(state.sim-t.started)/(t.dropoff+t.walkOut-t.started)*100))}%`;status.classList.toggle('hidden',phase==='arrived'||state.tab!=='ride');status.innerHTML=icon(phase==='ride'?'bus':'walk')+(phase==='walk'?`Walk to ${t.board.name}`:phase==='wait'?`Bus ${t.bus.id} departs in ${formatETA(t.pickup-state.sim)}`:phase==='ride'?`Next: ${t.exit.name}`:`Walk to ${state.destination.name}`);
}
let view={x:120,y:85,w:760,h:760},didPan=false,pan=null;
function setView(){map.setAttribute('viewBox',`${view.x} ${view.y} ${view.w} ${view.h}`)}
function fitBounds(x1,y1,x2,y2){const rect=map.getBoundingClientRect(),aspect=rect.width/Math.max(1,rect.height);let h=Math.max(220,y2-y1),w=Math.max(220,x2-x1);if(w/h<aspect)w=h*aspect;else h=w/aspect;view={x:(x1+x2)/2-w/2,y:(y1+y2)/2-h/2,w,h};setView()}
function resetMap(){if(innerWidth<=680)fitBounds(150,115,520,540);else fitBounds(115,95,810,810)}
function centerOnPlaces(){if(!state.destination){resetMap();return}const a=state.origin,b=state.destination;fitBounds(Math.min(a.x,b.x)-125,Math.min(a.y,b.y)-90,Math.max(a.x,b.x)+140,Math.max(a.y,b.y)+110)}
function centerRoute(id){const r=routes.find(r=>r.id===id),xs=r.points.map(p=>p[0]),ys=r.points.map(p=>p[1]);fitBounds(Math.min(...xs)-70,Math.min(...ys)-70,Math.max(...xs)+70,Math.max(...ys)+70)}
function zoom(f){state.followMap=false;const w=Math.max(190,Math.min(1500,view.w*f)),h=view.h*w/view.w;view.x+=(view.w-w)/2;view.y+=(view.h-h)/2;view.w=w;view.h=h;setView()}
map.addEventListener('pointerdown',e=>{if(e.button!==0)return;pan={x:e.clientX,y:e.clientY,vx:view.x,vy:view.y};didPan=false});
map.addEventListener('pointermove',e=>{if(!pan)return;const dx=e.clientX-pan.x,dy=e.clientY-pan.y;if(Math.abs(dx)+Math.abs(dy)>5){if(!didPan)map.setPointerCapture(e.pointerId);didPan=true;state.followMap=false;map.classList.add('dragging');const r=map.getBoundingClientRect();view.x=pan.vx-dx*view.w/r.width;view.y=pan.vy-dy*view.h/r.height;setView()}});
function stopPan(){pan=null;map.classList.remove('dragging');setTimeout(()=>didPan=false,0)}map.addEventListener('pointerup',stopPan);map.addEventListener('pointercancel',stopPan);map.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY>0?1.08:.92)},{passive:false});
map.addEventListener('click',e=>{if(didPan||!state.selectedPoi||e.target.closest('.poi-marker,.bus-marker'))return;dismissPoi()});
$('#zoom-in').addEventListener('click',()=>zoom(.8));$('#zoom-out').addEventListener('click',()=>zoom(1.25));$('#recenter').addEventListener('click',()=>{if(state.trip){state.followMap=true;updateTraveler();toast('Following your trip');}else state.tab==='routes'&&state.route?centerRoute(state.route):centerOnPlaces();});
function pauseUI(){$('#pause').innerHTML=icon(state.paused?'play':'pause');$('#pause').setAttribute('aria-label',state.paused?'Resume simulation':'Pause simulation')}
$('#pause').addEventListener('click',()=>{state.paused=!state.paused;pauseUI();toast(state.paused?'Simulation paused':'Simulation resumed')});$('#speed').addEventListener('click',()=>{const speeds=[1,2,3];state.speed=speeds[(speeds.indexOf(state.speed)+1)%speeds.length];$('#speed').textContent=state.speed+'×';toast(`Simulation speed: ${state.speed}×`)});$('#reset').addEventListener('click',()=>{state.selectedPoi=null;state.assistantOpen=false;state.assistant={log:[],draftOrigin:null,draftDestination:null,pending:null};state.sim=0;state.trip=null;state.selected=null;state.route=null;state.mapFocusRouteId=null;state.phase=null;state.tab='ride';state.paused=false;state.speed=3;$('#speed').textContent='3×';pauseUI();planCache=null;renderPanel();resetMap();toast('Presentation reset')});$('#brand').addEventListener('click',()=>{state.assistantOpen=false;resetDestination();state.origin=places[0];renderPanel()});$$('[data-tab]').forEach(b=>b.addEventListener('click',()=>{state.selectedPoi=null;state.assistantOpen=false;state.tab=b.dataset.tab;if(state.tab!=='routes')state.route=null;renderPanel();panel.scrollTop=0;if(state.tab==='routes')resetMap()}));
let priorFocus;function openAbout(){priorFocus=document.activeElement;$('#about').classList.remove('hidden');$('#close-about').focus()}function closeAbout(){$('#about').classList.add('hidden');priorFocus?.focus()}$('#about-button').addEventListener('click',openAbout);$('#close-about').addEventListener('click',closeAbout);$('#start-demo').addEventListener('click',closeAbout);$('#about').addEventListener('click',e=>{if(e.target===$('#about'))closeAbout()});document.addEventListener('keydown',e=>{if(!$('#about').classList.contains('hidden')){if(e.key==='Escape')closeAbout();if(e.key==='Tab'){const items=$('#about').querySelectorAll('button,a[href]'),first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}}});
document.addEventListener('keydown',e=>{if(e.key!=='Escape'||!$('#about').classList.contains('hidden')||document.querySelector('.welcome-overlay'))return;if(state.selectedPoi)dismissPoi(true);else if(state.assistantOpen)closeAssistant()});
document.addEventListener('click',e=>{if(!e.target.closest('.location-box,.suggestions')){const box=$('#suggestions');box?.classList.add('hidden');if(state.editing){const field=$(`#${state.editing}-input`);if(field)field.value=state[state.editing]?.name||'';state.editing=null;const follow=$('#follow');if(follow)follow.disabled=false}}});
function frame(now){if(lastFrame!==null&&!state.paused)state.sim+=Math.min((now-lastFrame)/1000,.1)*state.speed;lastFrame=now;for(const b of buses){const p=busPosition(b),e=$(`[data-bus="${b.id}"]`);e.setAttribute('transform',`translate(${p.x},${p.y})`);e.querySelector('.bus-turn').setAttribute('transform',`rotate(${p.angle}) scale(.57)`)}updateTraveler();if(now-lastRefresh>1000){lastRefresh=now;if(state.trip){updateTracking();checkTripAlerts();}else if(state.destination&&state.tab==='ride'&&!state.editing){state.results=plans();const options=$('#options');if(options){options.innerHTML=state.results.map((p,i)=>optionContent(p,i)).join('');options.querySelectorAll('[data-option]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.option;if(state.selected===id&&state.mapFocusRouteId===id){state.mapFocusRouteId=null;drawFocus();return;}state.selected=id;state.mapFocusRouteId=id;renderPanel()}));const p=state.results.find(p=>p.route.id===state.selected);if(p&&$('#breakdown'))$('#breakdown').innerHTML=breakdown(p)}}}requestAnimationFrame(frame)}

let planCache=null;
function clockTime(seconds){const n=10*3600+10*60+Math.round(seconds);return `${String(Math.floor(n/3600)%24).padStart(2,'0')}:${String(Math.floor(n/60)%60).padStart(2,'0')}`}
function plans(){const key=state.origin.id+'|'+(state.destination?.id||'');if(!planCache||planCache.key!==key)planCache={key,items:computePlans()};return planCache.items}
function refreshPlans(){planCache=null;state.selected=null;state.mapFocusRouteId=null;renderPanel()}
function optionContent(p,i){const reachable=p.pickup>=state.sim+p.walkIn+15;return `<button class="option ${p.route.id===state.selected?'chosen':''}" data-option="${p.route.id}" aria-pressed="${p.route.id===state.selected}"><span class="bus-picture">${busArtwork(p.route.color)}</span><span class="option-text"><span class="option-title"><i class="route-swatch" style="background:${p.route.color}"></i>${p.route.name}</span><span class="option-meta">Bus ${p.bus.id} · Departs ${clockTime(p.pickup)}<br>${p.board.name} stop<br>${reachable?'Arrive '+clockTime(p.dropoff+p.walkOut):'Departure too soon — refresh'}</span>${i===0?'<span class="recommend-label">Earliest arrival</span>':''}</span><span class="option-time"><strong>${mins(p.total)} min</strong><small>planned trip</small></span></button>`}
function nextStage(){const t=state.trip;if(!t)return;const next=[t.started+t.walkIn,t.pickup-45,t.pickup,t.dropoff-45,t.dropoff,t.dropoff+t.walkOut].sort((a,b)=>a-b).find(n=>n>state.sim+.5);if(next!==undefined){state.sim=next+.01;updateTracking();updateTraveler();checkTripAlerts();}}
function updateTraveler(){const t=state.trip;let p={x:state.origin.x,y:state.origin.y};let phase=t?tripPhase():null;const lerp=(a,b,f)=>({x:a.x+(b.x-a.x)*Math.max(0,Math.min(1,f)),y:a.y+(b.y-a.y)*Math.max(0,Math.min(1,f))});if(t){if(phase==='walk')p=CampusNetwork.position(t.inPath,(state.sim-t.started)/t.walkIn);else if(phase==='wait')p=t.board;else if(phase==='ride')p=busPosition(t.bus);else if(phase==='finish')p=CampusNetwork.position(t.outPath,(state.sim-t.dropoff)/t.walkOut);else p=state.destination}const group=$('#location-markers');group.querySelectorAll('.user-halo,.user-dot').forEach(e=>{e.setAttribute('cx',p.x);e.setAttribute('cy',p.y)});let label=$('#traveler-label');if(!label){label=svgEl('text',{id:'traveler-label',class:'traveler-label','text-anchor':'middle'});group.append(label)}label.setAttribute('x',p.x);label.setAttribute('y',p.y-12);label.textContent=t?({walk:'Walking to stop',wait:'Waiting at stop',ride:'On board',finish:'Walking to destination',arrived:'Arrived'}[phase]):'You';if(t&&state.followMap&&!pan&&state.tab==='ride')followTraveler(p);const c=$('#demo-clock');if(c)c.textContent=clockTime(state.sim)}

function pathD(points){return points.map((p,i)=>`${i?'L':'M'}${p[0]},${p[1]}`).join(' ');}
function boardingDirection(t){const r=t.route,i=r.stops.indexOf(t.board),next=r.stops[(i+1)%r.stops.length];return `Board toward ${next.name}.`;}
function savedContent(){return `<p class="eyebrow">Your everyday places</p><h1>One tap closer.</h1><p class="subtle">Save your dorm, next class, or favorite campus stop.</p><div class="saved-list">${saved.map(id=>places.find(p=>p.id===id)).filter(Boolean).map(p=>`<div class="saved-item"><div class="saved-card"><button class="place-row" data-place="${p.id}"><span class="place-icon">${icon(p.type)}</span><span class="place-copy"><strong>${escapeHtml(savedLabel(p))}</strong><small>${p.name}</small></span>${icon('arrow')}</button><button class="icon-button" data-remove="${p.id}" aria-label="Remove ${p.name} from saved">${icon('close')}</button></div><div class="saved-edit"><input data-label-for="${p.id}" aria-label="Saved name for ${p.name}" maxlength="40" placeholder="Give this place a name" value="${escapeHtml(savedLabel(p))}"><button data-edit-label="${p.id}" aria-label="Update name for ${p.name}">Update</button></div></div>`).join('')||'<div class="empty-state">Add a place below to make your next trip easier.</div>'}</div><form id="add-saved" class="save-form"><h2>Add a saved place</h2><label for="saved-place-select">Campus location</label><select id="saved-place-select">${places.map(p=>`<option value="${p.id}">${p.name}</option>`).join('')}</select><label for="saved-label">Your name for it <span>(optional)</span></label><input id="saved-label" maxlength="40" placeholder="My dorm, My next class…"><button class="primary" type="submit">Save place ${icon('bookmark')}</button></form><div class="tip">${icon('bookmark')}<span>Saved in this browser. Your places remain here when you return.</span></div>`;}
function followTraveler(p){const rect=map.getBoundingClientRect(),mobile=innerWidth<=680,sh=mobile?$('.sidebar').getBoundingClientRect().height:0,visible=Math.max(100,rect.height-sh);const w=mobile?240:390,h=w*rect.height/Math.max(1,rect.width);view={x:p.x-w/2,y:p.y-h*(visible/rect.height)*.53,w,h};setView();}
function checkTripAlerts(){const t=state.trip;if(!t)return;state.alerts??=new Set();const phase=tripPhase();let key,msg;
 if(phase==='wait'&&t.pickup-state.sim<=60){key='approach';msg=`Bus ${t.bus.id} is approaching. ${boardingDirection(t)}`;}
 if(phase==='ride'&&t.dropoff-state.sim<=60){key='next';msg=`Your stop is next: ${t.exit.name}. Get ready to exit.`;}
 if(phase==='finish'){key='exit';msg=`Get off at ${t.exit.name}. Follow the path to ${state.destination.name}.`;}
 if(phase==='arrived'){key='arrive';msg=`You’ve arrived at ${state.destination.name}.`;}
 if(key&&!state.alerts.has(key)){state.alerts.add(key);toast(msg);announce(msg);}
 const status=$('#map-status');if(phase==='ride'&&t.dropoff-state.sim<=60)status.textContent=`Your stop is next · ${t.exit.name}`;
}
hydrateIcons();makeMap();renderPanel();pauseUI();resetMap();requestAnimationFrame(frame);new ResizeObserver(()=>{if(!pan)state.destination?centerOnPlaces():resetMap()}).observe($('.map-area'));
// Expose immutable summaries for lightweight, local presentation QA.
window.campusDemo={get summary(){return{time:state.sim,paused:state.paused,phase:tripPhase(),routes:routes.length,buses:buses.length,destination:state.destination?.name||null,origin:state.origin.name,selectedPoi:state.selectedPoi?.id||null,assistantOpen:state.assistantOpen,mapFocusRouteId:effectiveMapFocus()}},get pois(){return places.map(p=>({id:p.id,name:p.name,visual:{x:p.visual.x,y:p.visual.y},entrance:{x:p.x,y:p.y},check:!!p.visual.check}))},get plans(){return plans().map(p=>({route:p.route.name,walk:p.walkIn,pickup:p.pickup,dropoff:p.dropoff,total:p.total,bus:p.bus.id}))},get mapVisibility(){const vis=e=>e.style.display!=='none';return{lines:$$('[data-line]').filter(vis).map(e=>e.dataset.line),unders:$$('[data-under]').filter(vis).map(e=>e.dataset.under),buses:$$('[data-bus]').filter(vis).map(e=>e.dataset.bus),stops:$$('[data-stop-route]').filter(vis).length}}};
