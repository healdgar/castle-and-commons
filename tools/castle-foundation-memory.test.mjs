// Native deterministic survey and exact dependency memory in a tiny controlled world.
// No generator, renderer, population initialization or long-running simulation.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
const source=fs.readFileSync(process.env.FURLONG_TEST_SOURCE||new URL('../index.html',import.meta.url),'utf8');
function fn(name){
  const start=source.search(new RegExp(`^function ${name}\\b`,'m'));assert.ok(start>=0,name);const open=source.indexOf('{',start);let depth=0,quote='',escape=false;
  for(let i=open;i<source.length;i++){const c=source[i];if(quote){if(escape)escape=false;else if(c==='\\')escape=true;else if(c===quote)quote='';continue;}
    if(c==='\''||c==='"'||c==='`'){quote=c;continue;}if(c==='/'&&source[i+1]==='/'){while(source[i]!=='\n')i++;continue;}
    if(c==='/'&&source[i+1]==='*'){i+=2;while(!(source[i]==='*'&&source[i+1]==='/'))i++;i++;continue;}
    if(c==='{')depth++;else if(c==='}'&&!--depth)return source.slice(start,i+1);}
  assert.fail(name+' unterminated');
}
const line=prefix=>{const hit=source.match(new RegExp('^'+prefix.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'.*$','m'));assert.ok(hit,prefix);return hit[0];};
const NATIVE_LINE=line('const CASTLE_FOUNDATION_SURVEY_CURRENT=');
const READS=NATIVE_LINE.match(/\(\{(.*?)\}\)/)[1].split(',').filter(n=>!['planCellOK','dist2d','lerp','clamp','toCell','cIdx','inB','cellX','cellZ'].includes(n));
const HELPERS=['const lerp=','const clamp=','const dist2d=','const cIdx=','const inB=','const cellX=','const cellZ=','const toCell=','const planCellOK='];
const sha=s=>createHash('sha256').update(s).digest('hex').slice(0,16);
// Repin only after reviewing the full writer list in CASTLE-FOUNDATION-DEPENDENCIES.md.
// Reviewed 219b90e: Cells/Fields retain exact native predicates and row order after a
// conservative finite one-metre axis rejection. The factory now captures their actual
// BoxMayHit dependency, so replacing it invalidates null-survey reuse. Only these two
// existing body pins and the new bound helper are renewed; all 38 other pins stay exact.
// Reviewed d016a6a: only Cells now clips native plain dense polygon candidates
// to conservative row strips, keeping exact hit predicates/order and rectangle
// fallback for custom/accessor/prototype/replaced readers. See the appended
// dependency audit; Fields/Box and the other 38 pins are unchanged.
// Reviewed lifecycle bundle: private walks remain blockers but cannot anchor a public
// first castle. The survey read includes their actual compoundPrivate Boolean;
// only Site/Read/serviceDoor changed, and the other 38 pins are retained.
// Reviewed performance pass: radius directions are reused within each ray;
// fresh surveys omit only reservation polygons wholly outside a conservative
// operation-local probe envelope. All exact tests and private stamps remain.
// Reviewed native point reuse: rights keys are actual field objects; copied bounds
// and lazily calculated building rotations are fixed for this synchronous survey.
// Helper replacement/work=false keeps the original calls. Site is repinned;
// no persistent input certificate, writer category or private hash count changes.
// Reviewed certificate storage reuse: internally created arrays overwrite through
// a cursor and truncate only when complete. Read's ordered values/writers stay exact;
// external buffers or replaced push retain the original clear-and-push path.
const PINNED={"castleFoundationSite":"556c42f915aec8e8","castleFoundationCentersPossible":"97f734a95ed5fce1","castleFoundationSurveyRead":"8553b1cd6f245360","castleFoundationLandOK":"1c1323d61765ed95","castleFoundationGround":"dba79eab8b76f97a","castleFoundationBoxMayHit":"430a45b7b287d2d6","castleFoundationSegmentMayHitBox":"c1ff83639ad0c277","slopeAt":"f04f3db9f54bcfa6","hAt":"f459c5ff2804ca09","riverAt":"c4bda44c2b489b2e","lakeAt":"6a14ce0b475936f4","furlongAt":"aca164d39bde3f54","compoundGround":"800cfe4973552f94","occupiedGroundCells":"eb2ca800f0707890","occupiedGroundFields":"c5efe8ec6f058487","computeFurlongPoly":"605c31b180f2da7f","graveyardPolygonsOverlap":"65258af15a0c47a1","inPoly":"abebffb4a9abafff","inPolyXZ":"641dd4b3ae9a6dad","fortContains":"9f6ca02fc957e17d","fortCircuits":"7eca461ef4c3091c","fortCenter":"70fbd07bf1bf54a1","casRing":"a6921fd1103e167c","wallRadAt":"fbbec3db03bd0ce6","circuitLen":"9deb244c96e6486c","placeFitRadii":"7efd7d2d35c18bdb","placeR":"63335d5f5f19eb27","placeHit":"62746e6b8c8200de","serviceDoor":"edaca1b65a0dd2c9","locW":"833ae0c87356ca4b","obbCorners":"490b7d06b8d4a63f","obbOverlap":"5267c37bd7733324","streetFootprintOverlap":"ba1725bce82e34ce","segDist":"01b34b3baef31aff","segSegDist":"debb34048a0acf69","resample":"a590253bb5bcd7f5","lerpPt":"f218c11d09086fc4","makeHash":"b1d9816147e072f3","helpers":"626d791b92980e90","compoundPolys":"2059f5631f5d5e48","occupiedGroundBoxMayHit":"74c4c88f63dabba5"};
test('the certified survey still reads the reviewed native helpers',()=>{
  assert.deepEqual(Object.fromEntries([...READS.map(n=>[n,sha(fn(n))]),['helpers',sha(HELPERS.map(line).join('\n'))]]),PINNED,
    'Survey dependency changed: audit the writer certificate and private hash stamps before repinning.');
});
function realm(on=true){const c=vm.createContext({console});
  vm.runInContext(`const SIZE=1000,GRID=20,CELL=SIZE/GRID,FN=1,FG=1000,PLN=20;let W=null;`,c);
  vm.runInContext([...HELPERS.map(line),line('let HASH_STAMP='),...READS.map(fn),line('const OCCUPIED_GROUND_NATIVE='),NATIVE_LINE,line('const CASTLE_FOUNDATION_SURVEY_NATIVE='),line('const CASTLE_FOUNDATION_SURVEYS='),fn('castleFoundationSurveyNative'),fn('castleFoundationSurveyToken'),fn('castleFoundationFailedSite')].join('\n'),c);
  vm.runInContext(`
    const s={pos:{x:0,z:0},radius:70,owner:0,buildings:[{x:0,z:0,w:800,d:800,rot:0,state:'sound'}],streets:[{kind:'lane',hw:2,pts:[{x:0,z:-100},{x:0,z:100}]}],places:[],remnants:[],relicWalls:[]};
    const field={i:0,j:0,jx:.5,jz:.5,dom:0,lord:-1,own:-1,wk:-1};
    W={clock:{day:0},h:new Float32Array(GRID*GRID).fill(10),water:new Uint8Array(GRID*GRID),settlements:[s],land:{F:[field],mask:new Uint8Array(GRID*GRID*4)},rivHash:makeHash(24),roads:[],trackSet:new Set(),tg:{E:new Map(),pts:[]},projects:[]};
    const spec={w:13,d:13,tier:2,hm:.8,h:7,timber:false};
    globalThis.town=s;globalThis.spec=spec;CASTLE_FOUNDATION_SURVEYS.on=${on};
    globalThis.ask=()=>castleFoundationFailedSite(s,spec,{world:W,token:null});
    globalThis.stats=()=>JSON.stringify({hits:CASTLE_FOUNDATION_SURVEYS.hits,misses:CASTLE_FOUNDATION_SURVEYS.misses,reads:CASTLE_FOUNDATION_SURVEYS.reads,stamp:HASH_STAMP});
    globalThis.graph=()=>JSON.stringify({world:W,hash:HASH_STAMP},(k,v)=>k==='__hs'?v:v instanceof Map?[...v]:v instanceof Set?[...v]:v);`,c);
  return c;
}
const run=(c,code)=>vm.runInContext(code,c);
const stats=c=>JSON.parse(run(c,'stats()'));
function equalAsk(off,on,label){assert.equal(run(off,'ask()'),null,label+' fresh failure');assert.equal(run(on,'ask()'),null,label+' remembered failure');assert.equal(run(on,'graph()'),run(off,'graph()'),label+' exact world graph and saved hash counter');}

test('identical failed surveys replay their exact private-query count and leave native records unchanged',()=>{
  const off=realm(false),on=realm(true);equalAsk(off,on,'first');const first=stats(on);assert.ok(first.stamp>0,'a real private-index survey was performed');
  for(let d=1;d<=4;d++){for(const c of[off,on])run(c,`W.clock.day=${d};`);equalAsk(off,on,'day '+d);}
  const after=stats(on);assert.equal(after.hits,4);assert.equal(after.misses,1);assert.equal(after.stamp,first.stamp*5);
  assert.equal(run(on,'town.buildings[0].__hs'),undefined,'native building is never stamped by the scratch survey');
  run(on,'CASTLE_FOUNDATION_SURVEYS.memory=new WeakMap();CASTLE_FOUNDATION_SURVEYS.read=null;CASTLE_FOUNDATION_SURVEYS.token=null;');
  equalAsk(off,on,'cold checkpoint memory');assert.equal(stats(on).misses,2,'empty derived memory merely recomputes the same failure');
});
const CHANGES=[
  'W.h[0]+=1','W.water[0]=1','W.land.mask[2]=255','W.land.F[0].jx=.6','W.land.F[0].dom=1','W.land.F[0].lord=1','W.land.F[0].title={own:{owner:7},work:{owner:-1}}','W.land.F[0].crofts=1',
  'town.buildings[0].x=1','town.buildings[0].rot=.1','town.buildings[0].poly=[{x:-400,z:-400},{x:400,z:-400},{x:400,z:400},{x:-400,z:400}]','town.buildings[0].lot=[{x:-400,z:-400},{x:400,z:-400},{x:400,z:400},{x:-400,z:400}]',
  'town.buildings[0]._graveyard={x:0,z:0,w:5,d:5,rot:0,poly:[{x:0,z:0},{x:5,z:0},{x:5,z:5}]}',
  'town.streets[0].pts[0].z=-101','town.streets[0].hw=3','town.streets[0].hidden=true','town.streets[0].planQ=true','town.streets[0].castlePath=true','town.streets[0].kind="quay"',
  'town.wallRad=new Float32Array(32).fill(25)','town.cas={outerWall:{x:0,z:0,r:25}}','town.ward={x:0,z:0,r:25}','town.motte={x:0,z:0,r:10}',
  'town.places.push({x:0,z:0,r:Array(20).fill(20)})','town.citadel={x:0,z:0,S:30}','town.remnants.push({x:0,z:0,r:20})','town.burgRing={x:0,z:0,r:30}','town.relicWalls.push([{x:0,z:-100},{x:0,z:100}])',
  'town.lake={y:11,poly:[{x:-100,z:-100},{x:100,z:-100},{x:100,z:100},{x:-100,z:100}]}',
  'W.roads.push({path:[{x:-100,z:0},{x:100,z:0}]})','W.tg.pts=[{x:-100,z:0},{x:100,z:0}];W.tg.E.set("0_1",{a:0,b:1});W.trackSet.add("0_1")',
  'W.rivHash.add({x:0,z:0,a:{x:0,z:-100},b:{x:0,z:100},hw:5},110)',
  'W.projects.push({type:"castle",site:{ward:{x:10,z:0,r:25},path:[{x:10,z:0},{x:0,z:0}]}})',
  'W.projects.push({type:"compound",site:{f:{x:20,z:0,w:10,d:10,rot:0},path:[{x:20,z:0},{x:0,z:0}]}})',
  'W.projects.push({type:"fabric",site:{polys:[[{x:10,z:0},{x:20,z:0},{x:20,z:20}]],yard:{poly:[{x:20,z:0},{x:25,z:0},{x:25,z:5}]}}})',
  'W.projects.push({type:"road",P:{path:[{x:0,z:-100},{x:0,z:100}]}})',
  'W.projects.push({type:"storage",arch:"barn",x:0,z:0})',
  'W.projects.push({type:"clear",x:0,z:0,r:50})',
  'W.projects.push({type:"plan",kind:"street",st:{hw:3,pts:[{x:-100,z:0},{x:100,z:0}]}})',
  'W.projects.push({type:"plan",kind:"quarter",sts:[{hw:3,pts:[{x:-100,z:0},{x:100,z:0}]}]})',
  'W.projects.push({type:"plan",kind:"square",place:{x:0,z:0,r:Array(20).fill(40)}})',
  'W.projects.push({type:"plan",kind:"wall",si:0,rad:new Float32Array(32).fill(40)})',
  'town.owner=1','town.radius=71','town.pos.x=1','spec.w=12',
];
test('every writer category invalidates null reuse, including unchanged-count edits',()=>{
  for(const change of CHANGES){const off=realm(false),on=realm(true);for(const c of[off,on])run(c,'globalThis.ARCH={barn:[10,20]};');equalAsk(off,on,'before '+change);equalAsk(off,on,'recall '+change);
    for(const c of[off,on])run(c,change);equalAsk(off,on,'after '+change);assert.equal(stats(on).misses,2,change+' must rerun the authoritative survey');}
});

test('existing pending geometry edits and circuit/river edits invalidate at the same counts',()=>{
  const setups=[
    ['town.ward={x:0,z:0,r:25,wallRad:new Float32Array(32).fill(25)}','town.ward.wallRad[3]=26'],
    ['W.roads=[{path:[{x:-100,z:0},{x:100,z:0}]}]','W.roads[0].path[0].x=-101'],
    ['W.projects=[{type:"compound",site:{ring:{x:50,z:0,r:10},paths:[[{x:50,z:0},{x:0,z:0}]],pathWidth:3}}]','W.projects[0].site.ring.r=11'],
    ['W.projects=[{type:"compound",site:{ring:{x:50,z:0,r:10},paths:[[{x:50,z:0},{x:0,z:0}]],pathWidth:3}}]','W.projects[0].site.paths[0][0].x=51'],
    ['W.projects=[{type:"fabric",site:{poly:[{x:10,z:0},{x:20,z:0},{x:20,z:20}]}}]','W.projects[0].site.poly[0].x=11'],
    ['W.rivHash.add({x:0,z:0,a:{x:0,z:-100},b:{x:0,z:100},hw:5},110)','[...W.rivHash.historyCells.values()][0][0].hw=6'],
    ['town.streets[0].kind="quay";town.streets[0].serviceLinked=true','town.streets[0].serviceLinked=false'],
  ];
  for(const[setup,change]of setups){const off=realm(false),on=realm(true);for(const c of[off,on])run(c,setup);equalAsk(off,on,'setup '+setup);equalAsk(off,on,'recall '+setup);for(const c of[off,on])run(c,change);equalAsk(off,on,'edit '+change);assert.equal(stats(on).misses,2,change);}
});

test('nongeometry cash, prices, project progress and crop colors do not fabricate a geometry invalidation',()=>{
  const c=realm();run(c,'W.projects=[{type:"clear",x:0,z:0,r:3,done:0}];');assert.equal(run(c,'ask()'),null);
  run(c,'town.pop=500;town.prosperity=70;town.gold=1;W.projects[0].done=.5;W.land.mask[0]=180;W.land.mask[1]=90;W.land.mask[3]=60;W.land.mask[2]=3;');
  assert.equal(run(c,'ask()'),null);assert.equal(stats(c).hits,1,'financial decisions remain outside the geometry certificate');
});

test('projects without survey geometry preserve null reuse and exact stamps until their actual type reserves ground',()=>{
  const off=realm(false),on=realm(true);equalAsk(off,on,'opening');
  const changes=[
    'W.projects.push({type:"equipment",si:0,kind:"siegeEngine",done:0})',
    'W.projects.push({type:"pave",si:0,r:{path:[{x:-100,z:0},{x:100,z:0}]},done:0})',
    'W.projects.push({type:"persuade",si:0,x:0,z:0,decide:4})',
    'W.projects.push({type:"buy",si:0,f:{x:0,z:0},decide:4})',
    'W.projects[0].done=.5;W.projects[1].r.path[0].x=-101;W.projects[2].decide=5;W.projects[3].f.x=1',
    'W.projects[1].dead=true;W.projects.splice(2,1)',
  ];
  for(const change of changes){const before=stats(on);for(const c of[off,on])run(c,change);equalAsk(off,on,change);
    assert.equal(stats(on).hits,before.hits+1,'inert project changes reuse the same native failure');assert.equal(stats(on).misses,1);}
  for(const c of[off,on])run(c,'Object.assign(W.projects[0],{type:"clear",x:0,z:0,r:3});');
  equalAsk(off,on,'actual type becomes reserved ground');assert.equal(stats(on).misses,2,'the newly recognized geometry is freshly surveyed');
  equalAsk(off,on,'unchanged reserved ground');assert.equal(stats(on).misses,2);
});

test('an overridden helper and a stamp beyond the current counter bypass memory',()=>{
  const c=realm();run(c,'ask();ask();');const before=stats(c);run(c,'const original=hAt;hAt=(x,z)=>original(x,z);');assert.equal(run(c,'ask()'),null);assert.equal(stats(c).hits,before.hits);
  const d=realm();run(d,'ask();ask();town.buildings[0].__hs=HASH_STAMP+100000;');const prev=stats(d);assert.equal(run(d,'ask()'),null);assert.equal(stats(d).hits,prev.hits,'future copied stamp is never treated as harmless');
});

test('a completed obstruction can unlock a genuine site immediately and successful sites are never remembered',()=>{
  const c=realm();assert.equal(run(c,'ask()'),null);run(c,'town.buildings[0].removed=true;');assert.ok(run(c,'ask()'),'current native geometry can admit a site on the same day');
  const misses=stats(c).misses;assert.ok(run(c,'ask()'));assert.equal(stats(c).misses,misses+1,'positive survey must be run afresh');
  run(c,'CASTLE_FOUNDATION_SURVEYS.verify=true;town.buildings[0].removed=false;');assert.equal(run(c,'ask()'),null);assert.equal(run(c,'ask()'),null,'verify checks cached failure against a real fresh survey');
});

test('operation-local pending polygon reuse preserves fresh answers and hash stamps without repeated raster work',()=>{
  const off=realm(false),on=realm(false);
  for(const c of[off,on])run(c,`town.buildings=[];W.projects=[{type:'compound',site:{f:{x:0,z:0,w:340,d:340,rot:0},path:[{x:0,z:0},{x:0,z:190}]}}];
    const groundNative=compoundGround;let rasterReads=0;compoundGround=site=>{rasterReads++;return groundNative(site)};`);
  run(off,'CASTLE_FOUNDATION_SURVEYS.work=false;');
  for(let d=0;d<3;d++){
    for(const c of[off,on])run(c,`W.clock.day=${d};W.projects[0].site.f.rot=${d*.01};`);
    assert.equal(run(off,'castleFoundationSite(town,spec)'),null);
    assert.equal(run(on,'castleFoundationSite(town,spec)'),null);
    assert.equal(run(on,'graph()'),run(off,'graph()'),'same full native graph and original private hash query count');
  }
  assert.equal(run(on,'rasterReads'),0,'pending reservation polygons do not need the native raster at all');
  assert.ok(run(off,'rasterReads')>30,'control path recomputes the native raster for each clear probe');
});

test('the pure ordered polygon builder leaves raster authority to actual ground consumers',()=>{
  const c=realm(false);run(c,`const explicit=[{x:0,z:0},{x:4,z:0},{x:4,z:4}],yard=[{x:5,z:0},{x:9,z:0},{x:9,z:4}],hydraulic=[{x:0,z:5},{x:4,z:5},{x:4,z:9}];
    const site={polys:[explicit],yard:{poly:yard},poly:hydraulic,f:{x:0,z:0,w:12,d:14,rot:.2},ring:{x:0,z:0,r:22},paths:[[{x:0,z:0},{x:0,z:30},{x:30,z:30}],[{x:30,z:30},{x:40,z:40}]],pathWidth:3};
    const before=JSON.stringify(site),nativeRaster=occupiedGroundCells;let rasters=0;occupiedGroundCells=P=>{rasters++;return nativeRaster(P)};globalThis.parts=compoundPolys(site);`);
  assert.equal(run(c,'rasters'),0);assert.equal(run(c,'parts.length'),8);
  assert.equal(run(c,'parts[0]===explicit&&parts[1]===yard&&parts[2]===hydraulic'),true,'explicit native polygon order/references are preserved');
  assert.equal(run(c,'parts[3].length'),4);assert.equal(run(c,'parts[4].length'),64);
  run(c,'globalThis.ground=compoundGround(site);');assert.equal(run(c,'rasters'),8,'the rights consumer intersects every actual polygon with native mask cells');
  assert.equal(run(c,'JSON.stringify(parts)'),run(c,'JSON.stringify(ground.polys)'));assert.ok(run(c,'ground.cells.length')>0);assert.equal(run(c,'JSON.stringify(site)'),run(c,'before'));
});

test('native pending-fit reservations use polygons without performing a ground raster or mutating native records',()=>{
  const c=realm(false);vm.runInContext(fn('castleFoundationReserved'),c);run(c,`occupiedGroundCells=()=>{throw Error('reservation must not rasterize rights')};
    const q={type:'compound',si:0,site:{f:{x:0,z:0,w:10,d:10,rot:0}}};W.projects=[q];const foot={x:0,z:0,w:4,d:4,rot:0};`);
  const before=run(c,'graph()');assert.equal(run(c,'castleFoundationReserved(town,foot)'),true);assert.equal(run(c,'castleFoundationReserved(town,foot,q)'),false);assert.equal(run(c,'graph()'),before);
  run(c,'q.site.f.x=100;');assert.equal(run(c,'castleFoundationReserved(town,foot)'),false,'a same-count move is freshly checked');
  run(c,'q.site.path=[{x:-20,z:0},{x:20,z:0}];');assert.equal(run(c,'castleFoundationReserved(town,foot)'),true,'the real retained public approach is protected too');
});

test('operation-local bounds preserve successful and retained-site geometry with remote pending projects',()=>{
  const off=realm(false),on=realm(false);
  for(const c of[off,on])run(c,`town.buildings=[];W.projects=[{type:'fabric',site:{f:{x:350,z:350,w:12,d:15,rot:.3},path:[{x:350,z:350},{x:350,z:380}]}}];`);
  run(off,'CASTLE_FOUNDATION_SURVEYS.work=false;');
  for(const c of[off,on])run(c,'globalThis.fixed=castleFoundationSite(town,spec);');
  assert.ok(run(on,'fixed'),'the current native world admits a site');
  assert.equal(run(on,'JSON.stringify(fixed)'),run(off,'JSON.stringify(fixed)'),'same successful native candidate');
  assert.equal(run(on,'graph()'),run(off,'graph()'),'same original private hash queries');
  for(const c of[off,on])run(c,'globalThis.retained=castleFoundationSite(town,spec,fixed);');
  assert.ok(run(on,'retained'));assert.equal(run(on,'JSON.stringify(retained)'),run(off,'JSON.stringify(retained)'));
  assert.equal(run(on,'graph()'),run(off,'graph()'),'retained authority uses the same hash-query count');
});

test('fresh survey envelope preserves remote reservations, crossing approaches and same-count moves',()=>{
  const off=realm(false),on=realm(false);
  for(const c of[off,on])run(c,`town.buildings=[];W.projects=Array.from({length:3},(_,k)=>({type:'fabric',site:{f:{x:1200+k*20,z:1200,w:12,d:15,rot:.3}}}));`);
  run(off,'castleFoundationSurveyNative=()=>false;');
  const equal=label=>{
    for(const c of[off,on])run(c,'globalThis.fixed=castleFoundationSite(town,spec);');
    assert.equal(run(on,'JSON.stringify(fixed)'),run(off,'JSON.stringify(fixed)'),label+' exact surveyed geometry');
    assert.equal(run(on,'graph()'),run(off,'graph()'),label+' exact native state and private stamps');
  };
  equal('remote footprints');assert.ok(run(on,'fixed'));
  for(const c of[off,on])run(c,'W.projects[0].site.path=[{x:-100,z:10},{x:100,z:10}];');
  equal('remote project with a local approach');
  for(const c of[off,on])run(c,'W.projects[1].site.f.x=fixed.f.x;W.projects[1].site.f.z=fixed.f.z;');
  equal('same-count footprint moves into the surveyed ground');
  for(const c of[off,on])run(c,'globalThis.retained=castleFoundationSite(town,spec,fixed);');
  assert.equal(run(on,'JSON.stringify(retained)'),run(off,'JSON.stringify(retained)'));
  assert.equal(run(on,'graph()'),run(off,'graph()'),'retained sites still use all current reservations');
});

test('native point reuse expires between surveys after terrain, title and rotation edits',()=>{
  const off=realm(false),on=realm(false);
  for(const c of[off,on])run(c,'town.buildings=[];');
  run(off,'CASTLE_FOUNDATION_SURVEYS.work=false;');
  const equal=label=>{
    for(const c of[off,on])run(c,'globalThis.fixed=castleFoundationSite(town,spec);');
    assert.equal(run(on,'JSON.stringify(fixed)'),run(off,'JSON.stringify(fixed)'),label+' exact site');
    assert.equal(run(on,'graph()'),run(off,'graph()'),label+' full state and private queries');
  };
  equal('open land');assert.ok(run(on,'fixed'));
  for(const c of[off,on])run(c,'globalThis.saved=fixed;W.water.fill(1);');
  equal('flooded land');assert.equal(run(on,'fixed'),null);
  for(const c of[off,on])run(c,'W.water.fill(0);W.h.fill(0);');
  equal('low terrain');assert.equal(run(on,'fixed'),null);
  for(const c of[off,on])run(c,'W.h.fill(10);W.land.F[0].title={own:{owner:7},work:{owner:-1}};');
  equal('new holding');assert.equal(run(on,'fixed'),null);
  for(const c of[off,on])run(c,'W.land.F[0].title.own.owner=-1;town.buildings=[{x:saved.f.x,z:saved.f.z,w:12,d:45,rot:.2,state:"sound"}];');
  equal('new rotated obstruction');
  for(const c of[off,on])run(c,'town.buildings[0].rot=1.1;');
  equal('same-count rotation');
  for(const c of[off,on])run(c,'globalThis.retained=castleFoundationSite(town,spec,saved);');
  assert.equal(run(on,'JSON.stringify(retained)'),run(off,'JSON.stringify(retained)'));
  assert.equal(run(on,'graph()'),run(off,'graph()'),'retained-site current obstruction and query count');
});

test('replaced terrain and rights readers retain every original point call',()=>{
  const off=realm(false),on=realm(false);
  for(const c of[off,on])run(c,`town.buildings=[];
    let groundCalls=0,rightsCalls=0;const groundOriginal=slopeAt,rightsOriginal=castleFoundationLandOK;
    slopeAt=(x,z)=>{groundCalls++;return groundOriginal(x,z)};
    castleFoundationLandOK=(f,s,si)=>{rightsCalls++;return rightsOriginal(f,s,si)};`);
  run(off,'CASTLE_FOUNDATION_SURVEYS.work=false;');
  for(const c of[off,on])run(c,'globalThis.fixed=castleFoundationSite(town,spec);');
  assert.ok(run(on,'fixed'));
  assert.equal(run(on,'JSON.stringify(fixed)'),run(off,'JSON.stringify(fixed)'));
  assert.equal(run(on,'graph()'),run(off,'graph()'));
  assert.ok(run(on,'groundCalls')>100,'the fixture exercises repeated point clearance');
  assert.equal(run(on,'groundCalls'),run(off,'groundCalls'),'no memoized replaced terrain reads');
  assert.equal(run(on,'rightsCalls'),run(off,'rightsCalls'),'no memoized replaced title reads');
});

test('certified scratch bounds retain exact hypot boundaries and uncertain-input fallback',()=>{
  const c=realm(false),local=fn('castleFoundationSite').match(/  const boxMayHit=[\s\S]*?\n  };/)[0];
  run(c,`const native=true;${local};globalThis.hit=boxMayHit;`);
  run(c,`const box={minX:-3,maxX:7,minZ:-5,maxZ:9,finite:true};let comparisons=0;
    for(const pad of[-2,0,1e-8,1,3,17])for(const x of[-Infinity,NaN,-20,-3,0,7,30])for(const z of[-Infinity,NaN,-30,-5,0,9,40]){
      if(hit(x,z,box,pad)!==castleFoundationBoxMayHit(x,z,box,pad))throw Error('scratch predicate differs');comparisons++;
    }
    for(const pad of[0,1,3,17])for(const a of[0,.01,.3,.8,Math.PI/2])for(const scale of[1-1e-12,1,1+1e-12]){
      const x=box.maxX+Math.cos(a)*(pad+1e-6)*scale,z=box.maxZ+Math.sin(a)*(pad+1e-6)*scale;
      if(hit(x,z,box,pad)!==castleFoundationBoxMayHit(x,z,box,pad))throw Error('hypot boundary differs');comparisons++;
    }`);
  assert.equal(run(c,'comparisons'),354);
  run(c,`box.finite=false;let reads=0;Object.defineProperty(box,'minX',{get(){reads++;return -3}});
    globalThis.answer=hit(20,30,box,1);globalThis.actualReads=reads;reads=0;
    globalThis.original=castleFoundationBoxMayHit(20,30,box,1);`);
  assert.equal(run(c,'answer'),run(c,'original'));
  assert.equal(run(c,'actualReads'),run(c,'reads'),'uncertified bounds retain every original getter read');
});

test('owned survey buffers retain every certificate value and remove their previous tail',()=>{
  const c=realm(false);
  run(c,`const external=[];globalThis.owned=castleFoundationSurveyRead();globalThis.original=castleFoundationSurveyRead(external);
    globalThis.ownedBySurvey=CASTLE_FOUNDATION_SURVEYS.buffers.has(owned);globalThis.externalOwned=CASTLE_FOUNDATION_SURVEYS.buffers.has(external);`);
  assert.equal(run(c,'ownedBySurvey'),true);assert.equal(run(c,'externalOwned'),false);
  assert.equal(run(c,'owned.length===original.length&&owned.every((v,k)=>Object.is(v,original[k]))'),true);
  const before=run(c,'owned.length');
  run(c,`town.buildings=[];town.streets=[];W.projects=[];globalThis.reused=castleFoundationSurveyRead(owned);globalThis.fresh=castleFoundationSurveyRead([]);`);
  assert.equal(run(c,'reused===owned'),true);assert.ok(run(c,'reused.length')<before);
  assert.equal(run(c,'reused.length===fresh.length&&reused.every((v,k)=>Object.is(v,fresh[k]))'),true,'same shortened certificate with no stale tail');
  run(c,`town.streets=[{kind:'lane',hw:2,pts:[{x:0,z:-100},{x:0,z:100}]}];town.buildings=Array.from({length:12},(_,k)=>({x:k*20,z:0,w:10,d:15,rot:.3,state:'sound'}));
    castleFoundationSurveyRead(owned);globalThis.grown=castleFoundationSurveyRead([]);`);
  assert.equal(run(c,'owned.length===grown.length&&owned.every((v,k)=>Object.is(v,grown[k]))'),true,'same growing certificate, exact value order');
});

test('external survey buffers and a replaced Array push retain original write semantics',()=>{
  const c=realm(false);
  run(c,`globalThis.owned=castleFoundationSurveyRead();const push=Array.prototype.push;let calls=0;
    Array.prototype.push=function(v){calls++;return push.call(this,v)};
    castleFoundationSurveyRead(owned);globalThis.ownedCalls=calls;calls=0;
    globalThis.external=castleFoundationSurveyRead([]);globalThis.externalCalls=calls;Array.prototype.push=push;`);
  assert.equal(run(c,'owned.length===external.length&&owned.every((v,k)=>Object.is(v,external[k]))'),true);
  assert.ok(run(c,'ownedCalls')>100,'the full certificate uses the replaced writer');
  assert.equal(run(c,'ownedCalls'),run(c,'externalCalls'),'owned storage also falls back for a replaced writer');
});

test('private bucket reuse preserves ordered results, every object stamp and the saved counter',()=>{
  const local=fn('castleFoundationSite').match(/  const privateNear=[\s\S]*?\n  };/)[0];
  for(const future of[false,true]){
    const off=realm(false),on=realm(false);
    for(const c of[off,on])run(c,`const native=true;${local};const hash=makeHash(24);
      hash.add({x:0,z:0,id:'a',${future?'__hs:1,':''}},50);hash.add({x:24,z:24,id:'b'},40);hash.add({x:-24,z:0,id:'c'},30);
      globalThis.query=privateNear(hash,${!future});globalThis.hashGraph=()=>JSON.stringify([...hash.historyCells]);`);
    run(off,'query=(x,z,r)=>hash.near(x,z,r);');
    const queries=[[0,0,7],[.5,.5,7],[1,1,7],[2,2,7],[12,0,7],[13,1,7],[-10,-10,7],[-11,-11,7],[0,0,0],[1,1,0],[0,0,70],[1,1,70],[NaN,0,7],[0,0,7]];
    for(const[x,z,r]of queries){const args=[x,z,r].map(v=>Number.isNaN(v)?'NaN':String(v)).join(',');
      assert.equal(run(on,`JSON.stringify(query(${args}))`),run(off,`JSON.stringify(query(${args}))`),'same ordered deduplicated results');
      assert.equal(run(on,'hashGraph()'),run(off,'hashGraph()'),'same actual stamp on every private object');
      assert.equal(run(on,'HASH_STAMP'),run(off,'HASH_STAMP'),'same saved global query counter');
    }
    for(const c of[off,on])run(c,'HASH_STAMP=Number.MAX_SAFE_INTEGER;');
    for(let k=0;k<3;k++){
      assert.equal(run(on,'JSON.stringify(query(0,0,7))'),run(off,'JSON.stringify(query(0,0,7))'),'unsafe counter uses native collision behavior');
      assert.equal(run(on,'hashGraph()'),run(off,'hashGraph()'));
      assert.equal(run(on,'HASH_STAMP'),run(off,'HASH_STAMP'));
    }
  }
});

test('blocker shapes preserve rectangles, lots, polygons and graveyards across fresh and retained surveys',()=>{
  const shapes=[
    `{x:40,z:20,w:12,d:35,rot:.6,state:'sound'}`,
    `{x:120,z:70,w:12,d:15,rot:.3,lot:[{x:-50,z:-20},{x:140,z:-20},{x:140,z:90},{x:-50,z:90}],state:'sound'}`,
    `{x:50,z:30,w:10,d:15,rot:.3,poly:[{x:25,z:0},{x:75,z:0},{x:75,z:60},{x:25,z:60}],state:'sound'}`,
    `{x:0,z:0,w:100,d:100,rot:.3,poly:[],lot:[],state:'sound'}`,
    `{x:100,z:80,w:12,d:15,rot:.3,state:'sound',_graveyard:{x:30,z:0,poly:[{x:0,z:-40},{x:60,z:-40},{x:60,z:40},{x:0,z:40}]}}`,
    `{x:40,z:20,w:'12',d:35,rot:'0.6',state:'sound'}`,
  ];
  for(const shape of shapes){const off=realm(false),on=realm(false);
    for(const c of[off,on])run(c,'town.buildings=[];globalThis.retained=castleFoundationSite(town,spec);');
    run(off,'CASTLE_FOUNDATION_SURVEYS.work=false;');
    for(const c of[off,on])run(c,`town.buildings=[${shape}];`);
    for(const suffix of['',',retained']){
      assert.equal(run(on,`JSON.stringify(castleFoundationSite(town,spec${suffix}))`),run(off,`JSON.stringify(castleFoundationSite(town,spec${suffix}))`),shape+' exact candidate');
      assert.equal(run(on,'graph()'),run(off,'graph()'),shape+' full native graph and query counter');
    }
    for(const c of[off,on])run(c,'town.buildings[0].removed=true;');
    assert.equal(run(on,'JSON.stringify(castleFoundationSite(town,spec))'),run(off,'JSON.stringify(castleFoundationSite(town,spec))'),'a new operation observes removal');
    assert.equal(run(on,'graph()'),run(off,'graph()'));
  }
});

test('uncertain blocker dimensions retain original coercions during point clearance',()=>{
  const off=realm(false),on=realm(false);
  for(const c of[off,on])run(c,`let widthReads=0;town.buildings=[{x:40,z:20,w:{valueOf(){widthReads++;return 12}},d:35,rot:.6,state:'sound'}];`);
  run(off,'CASTLE_FOUNDATION_SURVEYS.work=false;');
  assert.equal(run(on,'JSON.stringify(castleFoundationSite(town,spec))'),run(off,'JSON.stringify(castleFoundationSite(town,spec))'));
  assert.equal(run(on,'graph()'),run(off,'graph()'));
  assert.equal(run(on,'widthReads'),run(off,'widthReads'),'no eager arithmetic on an uncertain dimension');
});
