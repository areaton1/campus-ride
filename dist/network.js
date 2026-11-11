/* Coordinates follow the bundled UA 2014 reference artwork (1080 × 1341.28).
 * Street traces are presentation geometry, not official service patterns.
 * Walking corridors and entrance connectors are illustrative where the reference
 * does not resolve sidewalks. No GPS or current accessibility claim is made.
 */
const CampusNetwork = (() => {
  const nodes = {
    pv:[340,181], north:[314,180], lake:[316,239], paty:[309,278], sc:[299,347],
    west:[224,354], westCap:[198,440], bidgood:[235,449], quadW:[231,529],
    cap:[356,457], capH:[400,431], hub:[444,404], eng:[475,354], hackN:[400,249],
    riverE:[400,180], quadE:[358,554], uniH:[400,563], uniE:[803,647],
    recN:[758,356], rec:[797,448], recS:[808,504], eastHub:[541,437],
    bryceS:[541,328], bryceN:[570,157], bryceE:[714,288],
    bryantH:[400,676], tut:[210,668], bryantE:[801,697], second:[478,680],
    colW:[400,819], colE:[478,817], colN:[478,758]
  };
  const edges = [];
  const edge=(a,b,via=[],name='Campus street')=>edges.push({a,b,name,points:[nodes[a],...via,nodes[b]]});
  edge('pv','north',[[327,180],[319,177]],'Presidential campus drive');
  edge('pv','riverE',[[352,183],[367,182],[382,178]],'Presidential campus drive');
  edge('north','lake',[[318,193],[320,207],[319,220],[318,230]],'McCorvey Drive');
  edge('lake','paty',[[314,252],[311,264]],'McCorvey Drive');
  edge('paty','sc',[[306,297],[303,318],[300,337]],'McCorvey Drive');
  edge('sc','west',[[278,349],[254,353],[238,355]],'Campus Drive West');
  edge('sc','bidgood',[[295,366],[292,386],[283,400],[266,409],[249,420],[239,433]],'Stadium Drive');
  edge('west','westCap',[[217,377],[212,399],[205,422]],'Marrs Spring Road');
  edge('westCap','bidgood',[[202,445],[216,447]],'Capstone Drive');
  edge('bidgood','cap',[[259,450],[286,451],[315,453],[341,456]],'Capstone Drive');
  edge('cap','capH',[[367,457],[375,448],[388,439]],'Margaret Drive');
  edge('capH','hub',[[405,419],[415,411],[429,402],[438,400]],'Campus Drive');
  edge('hub','eng',[[456,397],[466,389],[473,379],[475,367]],'Hackberry Lane');
  edge('eng','hackN',[[475,337],[474,319],[469,303],[459,287],[449,278],[432,267],[415,258]],'Hackberry Lane');
  edge('hackN','riverE',[[397,241],[397,231],[402,218],[401,207],[399,193]],'Hackberry Lane');
  edge('lake','hackN',[[329,239],[346,243],[363,246],[381,247]],'Hackberry Lane');
  edge('bidgood','quadW',[[234,469],[233,490],[231,513]],'Colonial Drive');
  edge('quadW','quadE',[[257,535],[282,540],[311,546],[336,550]],'University Boulevard');
  edge('cap','quadE',[[360,466],[360,490],[359,518],[358,542]],'Sixth Avenue');
  edge('quadE','uniH',[[377,558],[390,561]],'University Boulevard');
  edge('capH','uniH',[[399,452],[398,480],[398,510],[398,536],[399,552]],'Hackberry Lane');
  edge('uniH','uniE',[[439,572],[478,580],[519,589],[561,598],[607,608],[652,617],[697,627],[743,637],[781,645]],'University Boulevard');
  edge('hub','eastHub',[[459,411],[480,421],[501,429],[520,435]],'Campus Drive East');
  edge('eastHub','recN',[[562,437],[583,434],[605,430],[628,422],[654,412],[681,401],[708,390],[733,378],[750,370]],'Campus Drive East');
  edge('recN','rec',[[765,374],[774,395],[783,417],[791,438]],'Peter Bryce Boulevard');
  edge('rec','recS',[[802,466],[805,477],[816,478],[821,484],[818,490],[807,493]],'Recreation access drive');
  edge('recS','uniE',[[806,526],[805,549],[806,575],[805,600],[803,625]],'Peter Bryce Boulevard');
  edge('eastHub','bryceS',[[542,412],[543,385],[543,359],[542,341]],'Bryce campus drive');
  edge('hackN','bryceS',[[421,243],[448,237],[472,230],[488,220],[501,211],[513,219],[524,229],[535,232],[540,243],[539,270],[540,301]],'Bryce campus drive');
  edge('bryceS','bryceE',[[558,330],[579,328],[600,323],[622,315],[643,305],[661,295],[664,288],[687,289]],'Kilgore Lane');
  edge('bryceE','bryceN',[[714,268],[713,244],[713,220],[709,202],[696,188],[694,175],[683,167],[657,162],[628,159],[598,157]],'Bryce campus loop');
  edge('bryceN','bryceS',[[552,157],[540,159],[532,166],[526,181],[520,197],[513,210],[524,219],[538,230],[544,238],[543,262],[541,292]],'Bryce campus loop');
  edge('bryceE','recN',[[719,296],[722,307],[719,318],[710,329],[697,340],[681,353],[665,372],[649,391],[644,404],[654,412],[681,401],[708,390],[733,378],[750,370]],'Bryce campus connection');
  edge('uniH','bryantH',[[400,586],[399,614],[400,643],[400,662]],'Hackberry Lane');
  edge('quadW','tut',[[227,548],[222,573],[220,598],[217,625],[214,649]],'Colonial Drive');
  edge('tut','bryantH',[[239,669],[274,672],[311,674],[347,675],[377,675]],'Paul W. Bryant Drive');
  edge('bryantH','second',[[424,677],[450,678]],'Paul W. Bryant Drive');
  edge('second','bryantE',[[520,682],[565,685],[610,689],[658,693],[704,697],[751,700],[781,700]],'Paul W. Bryant Drive');
  edge('uniE','bryantE',[[802,666],[802,685]],'Peter Bryce Boulevard');
  edge('bryantH','colW',[[400,704],[400,736],[400,768],[400,796]],'Hackberry Lane');
  edge('colW','colE',[[422,821],[445,821],[463,819]],'Coliseum Street');
  edge('colE','colN',[[478,800],[478,778]],'Second Avenue');
  edge('colN','second',[[480,744],[485,732],[489,714],[489,696],[485,687]],'Second Avenue');
  function join(ids){let points=[],junctions=[];for(let i=0;i<ids.length-1;i++){const e=edges.find(e=>e.a===ids[i]&&e.b===ids[i+1]||e.b===ids[i]&&e.a===ids[i+1]);if(!e)throw Error('Missing street '+ids[i]+' '+ids[i+1]);const p=e.a===ids[i]?e.points:[...e.points].reverse();junctions.push(points.length?points.length-1:0);points.push(...(i?p.slice(1):p));}return{points,junctions};}
  const patterns={
    campus:['pv','north','lake','paty','sc','bidgood','cap','capH','hub','eng','hackN','riverE','pv'],
    north:['pv','riverE','hackN','eng','hub','capH','cap','bidgood','sc','paty','lake','north','pv'],
    west:['sc','west','westCap','bidgood','quadW','tut','bryantH','uniH','quadE','cap','bidgood','sc'],
    east:['hub','eastHub','recN','rec','recS','uniE','uniH','capH','hub'],
    bryce:['hub','eng','hackN','bryceS','bryceN','bryceE','recN','eastHub','hub'],
    coleman:['cap','capH','uniH','bryantH','colW','colE','colN','second','bryantH','tut','quadW','bidgood','cap']
  };
  const stopNames={pv:'Presidential Village',lake:'Lakeside',paty:'Paty',sc:'Student Center',west:'West Campus',bidgood:'Bidgood',cap:'Gorgas',hub:'Transit Hub',eng:'Engineering',recN:'Recreation North',rec:'Recreation Center',uniE:'East Campus',bryceS:'Bryce Campus',bryceN:'Bryce North',bryceE:'Bryce East',tut:'Tutwiler',colE:'Coleman Coliseum',bryantH:'South Campus',quadW:'The Quad — West'};
  function apply(routes){for(const r of routes){const ids=patterns[r.id],trace=join(ids);r.points=trace.points;r.stops=ids.slice(0,-1).flatMap((key,j)=>stopNames[key]?[{i:trace.junctions[j],key,name:stopNames[key],street:edges.find(e=>e.a===key&&e.b===ids[j+1]||e.b===key&&e.a===ids[j+1]).name}]:[]);}}
  // Separate walking graph: corridor edges run beside street traces. Explicit
  // entrance spurs connect buildings; no arbitrary straight-line fallback.
  const walkNodes={},adj={};
  const walkPoint=p=>[p[0]+5,p[1]-5];
  Object.entries(nodes).forEach(([k,p])=>walkNodes[k]=walkPoint(p));
  const length=p=>p.slice(1).reduce((s,b,i)=>s+Math.hypot(b[0]-p[i][0],b[1]-p[i][1]),0);
  function link(a,b,p){const cost=length(p);(adj[a]??=[]).push({to:b,points:p,cost});(adj[b]??=[]).push({to:a,points:[...p].reverse(),cost});}
  edges.forEach(e=>link(e.a,e.b,e.points.map(walkPoint)));
  const entrances={
    presidential:{point:[342,164],to:'pv',via:[[345,169]]},
    'student-center':{point:[308,365],to:'sc',via:[[304,365]]},
    bidgood:{point:[239,464],to:'bidgood',via:[[240,455]]},
    gorgas:{point:[309,466],to:'cap',via:[[309,462],[346,462],[361,462]]},
    shelby:{point:[442,337],to:'eng',via:[[451,340],[455,349]]},
    serc:{point:[387,369],to:'capH',via:[[397,369],[405,386],[405,413]]},
    tutwiler:{point:[229,689],to:'tut',via:[[217,689],[215,678]]},
    ridgecrest:{point:[209,284],to:'west',via:[[191,284],[197,304],[205,330],[214,346]]},
    stadium:{point:[194,611],to:'tut',via:[[207,611],[210,633],[212,650]]},
    paty:{point:[298,287],to:'paty',via:[[308,287],[314,282]]},
    lakeside:{point:[300,246],to:'lake',via:[[310,248],[321,248]]},
    rec:{point:[765,444],to:'rec',via:[[774,444],[788,444]]},
    coleman:{point:[488,777],to:'colN',via:[[484,777],[483,765]]},
    bryce:{point:[580,272],to:'bryceS',via:[[580,282],[580,301],[578,316],[564,322]]}
  };
  for(const [id,e] of Object.entries(entrances)){const key='place:'+id;walkNodes[key]=e.point;link(key,e.to,[e.point,...e.via,walkNodes[e.to]]);}
  const walkCache=new Map();
  function walking(a,b){const source=a.id?'place:'+a.id:a.key,target=b.id?'place:'+b.id:b.key;const cacheKey=source+'|'+target;if(walkCache.has(cacheKey))return walkCache.get(cacheKey);if(!adj[source]||!adj[target])return null;const costs={[source]:0},prev={},todo=new Set(Object.keys(adj));while(todo.size){let u=null;for(const k of todo)if(Number.isFinite(costs[k])&&(u===null||costs[k]<costs[u]))u=k;if(u===null)break;todo.delete(u);if(u===target)break;for(const e of adj[u]){const alt=costs[u]+e.cost;if(alt<(costs[e.to]??Infinity)){costs[e.to]=alt;prev[e.to]={from:u,edge:e};}}}if(!Number.isFinite(costs[target]))return null;let seq=[],u=target;while(u!==source){const step=prev[u];if(!step)return null;seq.unshift(step.edge);u=step.from;}let points=[walkNodes[source]];seq.forEach(e=>points.push(...e.points.slice(1)));if(!a.id)points.unshift(nodes[a.key]);if(!b.id)points.push(nodes[b.key]);const units=length(points),meters=units*2.65;const result={points,length:units,meters,seconds:Math.max(15,meters/1.35)};walkCache.set(cacheKey,result);return result;}
  function position(path,f){let remaining=path.length*Math.max(0,Math.min(1,f));const p=path.points;for(let i=1;i<p.length;i++){const a=p[i-1],b=p[i],d=Math.hypot(b[0]-a[0],b[1]-a[1]);if(remaining<=d&&d>0){const q=remaining/d;return{x:a[0]+(b[0]-a[0])*q,y:a[1]+(b[1]-a[1])*q};}remaining-=d;}return{x:p.at(-1)[0],y:p.at(-1)[1]};}
  return {apply,walking,position,entrances,edges,nodes,length};
})();
