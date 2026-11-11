const fs=require('fs'),vm=require('vm'),assert=require('assert');
const network=fs.readFileSync('dist/network.js','utf8'),app=fs.readFileSync('dist/app.js','utf8');
const context=vm.createContext({assert,console,localStorage:{getItem:()=>null},matchMedia:()=>({matches:false})});
vm.runInContext(network+'\n'+app.slice(0,app.indexOf("const panel=$"))+'\n'+app.slice(app.indexOf('function busPosition'),app.indexOf('function fields')),context);
vm.runInContext(`
let itineraryCount=0,pairCount=0,noBus=0;
for(const r of routes){assert.deepEqual(r.points[0],r.points.at(-1),'Closed route');assert(r.duration>0);for(const s of r.stops){assert(Number.isFinite(s.at));assert.deepEqual([s.x,s.y],r.points[s.i]);}}
for(const origin of places)for(const destination of places){if(origin===destination)continue;state.origin=origin;state.destination=destination;const path=CampusNetwork.walking(origin,destination);assert(path&&path.points.length>2);assert.deepEqual(path.points[0],[origin.x,origin.y]);assert.deepEqual(path.points.at(-1),[destination.x,destination.y]);assert(path.length+1e-8>=distance(origin,destination));for(const f of [0,.1,.4,.75,1]){const p=CampusNetwork.position(path,f);assert(Number.isFinite(p.x)&&Number.isFinite(p.y));}pairCount++;
for(const time of [0,301,1200,5000]){state.sim=time;const plans=computePlans();if(!plans.length)noBus++;for(const p of plans){assert(p.pickup>=time+p.walkIn+19.99);assert(p.dropoff>p.pickup);assert(p.walkIn+p.walkOut<path.seconds*.95);assert.equal(p.walkIn,p.inPath.seconds);assert.equal(p.walkOut,p.outPath.seconds);state.sim=p.pickup;let bp=busPosition(p.bus);assert(distance(bp,p.board)<1e-6,'Bus at boarding stop');state.sim=p.dropoff+.001;bp=busPosition(p.bus);assert(distance(bp,p.exit)<1e-6,'Bus at exit stop');state.sim=time;itineraryCount++;}}}
console.log(JSON.stringify({walkingPairs:pairCount,itineraries:itineraryCount,noUsefulBusCases:noBus,routes:routes.length}));
`,context);
