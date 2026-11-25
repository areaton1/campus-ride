/* Coordinates follow the bundled UA 2014 reference artwork (1080 × 1341.28).
 * Street traces are presentation geometry aligned to illustrated roads on
 * campus-map.svg (AD-GEO-1) — not official Crimson Ride service patterns.
 * Walking corridors and entrance connectors are illustrative where the reference
 * does not resolve sidewalks. No GPS or current accessibility claim is made.
 */
const CampusNetwork = (() => {
  /* Nodes sit on illustrated street corridors (AD-GEO-1). Coleman full manual export 2026-11-25 → _coleman-manual-export.json. */
  const nodes = {
    pv:[339,179], north:[315,181], lake:[316,239], paty:[306,278], sc:[302,346],
    west:[225,355], westCap:[194,439], bidgood:[253.3,469.7],
    quadW:[230.3,565.4],
    cap:[356.2,455.3], capH:[398,430], hub:[452.3,405.1], eng:[476,351], hackN:[400,249],
    riverE:[400,180], quadE:[360,568], uniH:[403.1,570.2], uniE:[798.7,651],
    recN:[764,366.5], rec:[801,449], recS:[815,511.1], eastHub:[546.9,436.9],
    bryceS:[542,333], bryceN:[570,157], bryceE:[714,294],
    bryantH:[402,678], tut:[206,672], bryantE:[802,700], second:[501.8,679.2],
    colW:[401,817], colE:[480,815], colN:[482,756]
  };
  const edges = [];
  const edge=(a,b,via=[],name='Campus street')=>edges.push({a,b,name,points:[nodes[a],...via,nodes[b]]});
  edge('pv','north',[[327,178],[321,178]],'Presidential campus drive');
  edge('pv','riverE',[[352,181],[367,180],[382,178],[392,178]],'Presidential campus drive');
  edge('north','lake',[[318,193],[320,207],[319,220],[318,230]],'McCorvey Drive');
  edge('lake','paty',[[314,252],[311,264]],'McCorvey Drive');
  edge('paty','sc',[[304,295],[303,315],[302,330],[302,340]],'McCorvey Drive');
  edge('sc','west',[[285,348],[265,350],[245,353],[235,355]],'Campus Drive West');
  /* Stadium Drive — consensus campus/north/west manual export */
  edge('sc','bidgood',[[293.6,341.3],[268.1,345.9],[241.7,351.7],[229.9,354.5],[228.6,370.5],[226.2,383.6],[221.7,402],[218.1,421],[213.3,443.1],[259.7,419.4],[291.1,422.5],[286.9,448.5],[259.1,443.1]],'Stadium Drive');
  edge('west','westCap',[[225,365],[223,380],[220,400],[215,420],[210.2,439],[198,438]],'Marrs Spring Road');
  /* West Capstone — west manual export */
  edge('westCap','bidgood',[[197.5,447.9],[204.6,450.7],[220,444],[235,445],[248,447],[252,455],[253.3,462]],'Capstone Drive');
  /* Capstone Drive — consensus coleman/campus/north/west manual export */
  edge('bidgood','cap',[[259.5,444.6],[272.7,445.4],[291.2,448.2],[312.6,449.7],[331.7,453.1],[343,454.1]],'Capstone Drive');
  edge('cap','capH',[[364.6,447.9],[375,441],[388,434]],'Margaret Drive');
  edge('capH','hub',[[408,426],[418,418],[428,412],[438,408]],'Campus Drive');
  edge('hub','eng',[[462.2,397.1],[471.5,385.9],[476.2,368.6]],'Hackberry Lane');
  /* Hackberry Lane N: follow road bend past engineering */
  edge('eng','hackN',[[476,335],[475,315],[470,295],[455,275],[433.6,261.2],[415.9,254.6]],'Hackberry Lane');
  edge('hackN','riverE',[[400,235],[400,220],[400,200],[400,188]],'Hackberry Lane');
  edge('lake','hackN',[[330,240],[350,244],[370,246],[388,247]],'Hackberry Lane');
  /* Colonial Drive — full Coleman manual export (shared west) */
  edge('bidgood','quadW',[[251.6,476.2],[248.5,488.4],[244.5,505.7],[240.2,524],[235.9,541.5],[234.1,555.8]],'Colonial Drive');
  /* University Boulevard south of Quad — follow street, not lawn diagonal */
  edge('quadW','quadE',[[250,564],[280,566],[310,567],[335,568],[350,568]],'University Boulevard');
  edge('cap','quadE',[[364.4,459.1],[362.3,491.7],[361.2,518.1],[359.6,543.8],[360,560]],'Sixth Avenue');
  edge('quadE','uniH',[[375,570],[395,570],[405,570]],'University Boulevard');
  /* Hackberry Lane — consensus coleman/east manual export */
  edge('capH','uniH',[[408.9,432.8],[407.1,460.6],[406.7,487.1],[404.5,510],[402.6,532.5],[401.3,546.8],[399.1,560.4]],'Hackberry Lane');
  /* University Blvd east — east manual export */
  edge('uniH','uniE',[[430,572],[460,578],[490,584],[520,590],[550,596],[578.2,602],[612.5,610],[645.2,618.5],[678.3,625.5],[705.9,629.7],[734,637.1],[760,642],[785.9,647.6]],'University Boulevard');
  edge('hub','eastHub',[[461,409],[480,418],[499.9,426.8],[519.2,433],[538.1,436.9]],'Campus Drive East');
  edge('eastHub','recN',[[560,438],[580.2,435.8],[606.6,430.2],[630,422.6],[656,412.2],[680.3,401.1],[706.1,390.3],[729.6,380.3],[748.1,371.8],[757.3,367]],'Campus Drive East');
  edge('recN','rec',[[770,374],[778,394],[784.3,415.6],[789.7,430.1],[797,441]],'Peter Bryce Boulevard');
  edge('rec','recS',[[805,461],[809,475.2],[811.7,485.4],[813.6,495.1],[815.5,503.3]],'Recreation access drive');
  edge('recS','uniE',[[814,525],[814,545],[813.9,565.9],[811.8,585.6],[807.1,608.6],[805.4,626.8],[801.8,640.3]],'Peter Bryce Boulevard');
  edge('eastHub','bryceS',[[548,415],[548,385],[545,355],[543,340]],'Bryce campus drive');
  /* Bryce manual export 2026-11-25 — exclusive loop + shared hub/eastHub/recN / Campus Dr East / Hackberry N applied */
  edge('hackN','bryceS',[[415,245],[450,238],[485,228],[510,220],[529.2,228],[538.9,242.7],[541,280],[542,310]],'Bryce campus drive');
  edge('bryceS','bryceE',[[560,332],[590,328],[630,315],[665,300],[690,295],[705,294]],'Kilgore Lane');
  edge('bryceE','bryceN',[[728,270.6],[727.4,240.7],[725.5,213.5],[701.3,174],[678,162.1],[630,157],[600,157]],'Bryce campus loop');
  edge('bryceN','bryceS',[[550,158],[536.6,183.3],[529,204.9],[545.5,221.1],[546.5,238.4],[542,280],[542,310]],'Bryce campus loop');
  edge('bryceE','recN',[[724.5,316.2],[710,330],[694.3,349.5],[678,372.9],[663.4,393.7],[658.2,402.1],[672.2,397.9],[700,385],[731.1,372],[751.8,363.5]],'Bryce campus connection');
  edge('uniH','bryantH',[[400,594.7],[399.6,618.9],[400.2,643.7],[399.7,662.7],[402,672]],'Hackberry Lane');
  edge('quadW','tut',[[227,580],[220.3,601.2],[216.1,622.9],[212.1,645.3],[208.1,658.8]],'Colonial Drive');
  edge('tut','bryantH',[[211.5,666.5],[258,667.9],[298.6,670.6],[342.9,674],[372.9,675.6],[391.4,677.1]],'Paul W. Bryant Drive');
  edge('bryantH','second',[[420,678],[445,678],[470,678],[485,678]],'Paul W. Bryant Drive');
  edge('second','bryantE',[[510,682],[560,686],[610,690],[660,694],[710,697],[760,699],[785,700]],'Paul W. Bryant Drive');
  edge('uniE','bryantE',[[801,660],[801,680],[801,695]],'Peter Bryce Boulevard');
  /* Coleman south loop — manual editor (coleman-only) */
  edge('bryantH','colW',[[401,700],[401,725],[401,750],[401,775],[401,800]],'Hackberry Lane');
  edge('colW','colE',[[420.6,822.1],[440.3,823.5],[457.2,821.7],[470.3,818.8]],'Coliseum Street');
  edge('colE','colN',[[481,798],[482,780],[482,765]],'Second Avenue');
  edge('colN','second',[[502.1,755.3],[502,732],[502,713.5],[501.9,695]],'Second Avenue');
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
    'student-center':{point:[308,360],to:'sc',via:[[304,355],[299,347]]},
    bidgood:{point:[238,478],to:'bidgood',via:[[245,475],[252,470]]},
    gorgas:{point:[318,452],to:'cap',via:[[330,450],[348,452],[356,455]]},
    shelby:{point:[445,335],to:'eng',via:[[460,340],[470,348],[478,352]]},
    serc:{point:[395,375],to:'capH',via:[[398,390],[398,410],[398,428]]},
    tutwiler:{point:[225,690],to:'tut',via:[[215,690],[207,680]]},
    ridgecrest:{point:[209,284],to:'west',via:[[191,284],[197,304],[205,330],[214,346]]},
    stadium:{point:[190,615],to:'tut',via:[[200,630],[203,650],[207,668]]},
    paty:{point:[298,287],to:'paty',via:[[308,287],[314,282]]},
    lakeside:{point:[300,246],to:'lake',via:[[310,248],[321,248]]},
    rec:{point:[765,444],to:'rec',via:[[780,448],[798,450]]},
    coleman:{point:[488,777],to:'colN',via:[[484,777],[483,760]]},
    bryce:{point:[580,272],to:'bryceS',via:[[580,282],[580,301],[578,316],[564,322]]},
    /* Batch 1 entrances — updated after POI recenter + street realign */
    rodgers:{point:[460,365],to:'eng',via:[[470,360],[478,352]]},
    bruno:{point:[215,470],to:'bidgood',via:[[230,470],[245,470],[252,468]]},
    'fresh-food':{point:[370,405],to:'capH',via:[[385,415],[398,428]]},
    alston:{point:[230,445],to:'bidgood',via:[[240,450],[248,458],[252,465]]},
    'student-services':{point:[290,340],to:'sc',via:[[299,347]]},
    burke:{point:[405,625],to:'bryantH',via:[[402,650],[402,676]]},
    foster:{point:[300,585],to:'quadE',via:[[320,575],[365,568]]},
    lloyd:{point:[370,515],to:'quadE',via:[[368,540],[365,568]]},
    'lakeside-hall':{point:[270,235],to:'lake',via:[[290,240],[316,239]]}
  };
  for(const [id,e] of Object.entries(entrances)){const key='place:'+id;walkNodes[key]=e.point;link(key,e.to,[e.point,...e.via,walkNodes[e.to]]);}
  const walkCache=new Map();
  function walking(a,b){const source=a.id?'place:'+a.id:a.key,target=b.id?'place:'+b.id:b.key;const cacheKey=source+'|'+target;if(walkCache.has(cacheKey))return walkCache.get(cacheKey);if(!adj[source]||!adj[target])return null;const costs={[source]:0},prev={},todo=new Set(Object.keys(adj));while(todo.size){let u=null;for(const k of todo)if(Number.isFinite(costs[k])&&(u===null||costs[k]<costs[u]))u=k;if(u===null)break;todo.delete(u);if(u===target)break;for(const e of adj[u]){const alt=costs[u]+e.cost;if(alt<(costs[e.to]??Infinity)){costs[e.to]=alt;prev[e.to]={from:u,edge:e};}}}if(!Number.isFinite(costs[target]))return null;let seq=[],u=target;while(u!==source){const step=prev[u];if(!step)return null;seq.unshift(step.edge);u=step.from;}let points=[walkNodes[source]];seq.forEach(e=>points.push(...e.points.slice(1)));if(!a.id)points.unshift(nodes[a.key]);if(!b.id)points.push(nodes[b.key]);const units=length(points),meters=units*2.65;const result={points,length:units,meters,seconds:Math.max(15,meters/1.35)};walkCache.set(cacheKey,result);return result;}
  function position(path,f){let remaining=path.length*Math.max(0,Math.min(1,f));const p=path.points;for(let i=1;i<p.length;i++){const a=p[i-1],b=p[i],d=Math.hypot(b[0]-a[0],b[1]-a[1]);if(remaining<=d&&d>0){const q=remaining/d;return{x:a[0]+(b[0]-a[0])*q,y:a[1]+(b[1]-a[1])*q};}remaining-=d;}return{x:p.at(-1)[0],y:p.at(-1)[1]};}
  return {apply,walking,position,entrances,edges,nodes,length};
})();
