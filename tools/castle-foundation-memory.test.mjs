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
const PINNED={"castleFoundationSite":"05903383fd214825","castleFoundationCentersPossible":"97f734a95ed5fce1","castleFoundationSurveyRead":"924af993dcba3853","castleFoundationLandOK":"1c1323d61765ed95","castleFoundationGround":"dba79eab8b76f97a","castleFoundationBoxMayHit":"da187f1e51c3f18c","castleFoundationSegmentMayHitBox":"c1ff83639ad0c277","slopeAt":"f04f3db9f54bcfa6","hAt":"f459c5ff2804ca09","riverAt":"c4bda44c2b489b2e","lakeAt":"6a14ce0b475936f4","furlongAt":"aca164d39bde3f54","compoundGround":"47f9f0a2ecab463c","occupiedGroundCells":"e4195f51df13de4f","occupiedGroundFields":"2ba9dbf41d8bc2ee","computeFurlongPoly":"605c31b180f2da7f","graveyardPolygonsOverlap":"65258af15a0c47a1","inPoly":"abebffb4a9abafff","inPolyXZ":"641dd4b3ae9a6dad","fortContains":"9f6ca02fc957e17d","fortCircuits":"e77dd39eccb4abc1","fortCenter":"70fbd07bf1bf54a1","casRing":"a6921fd1103e167c","wallRadAt":"fbbec3db03bd0ce6","circuitLen":"9deb244c96e6486c","placeFitRadii":"8a45384e2759f058","placeR":"63335d5f5f19eb27","placeHit":"62746e6b8c8200de","serviceDoor":"a4312db07cdce77e","locW":"833ae0c87356ca4b","obbCorners":"490b7d06b8d4a63f","obbOverlap":"5267c37bd7733324","streetFootprintOverlap":"ba1725bce82e34ce","segDist":"01b34b3baef31aff","segSegDist":"debb34048a0acf69","resample":"a590253bb5bcd7f5","lerpPt":"f218c11d09086fc4","makeHash":"b1d9816147e072f3","helpers":"626d791b92980e90"};
test('the certified survey still reads the reviewed native helpers',()=>{
  assert.deepEqual(Object.fromEntries([...READS.map(n=>[n,sha(fn(n))]),['helpers',sha(HELPERS.map(line).join('\n'))]]),PINNED,
    'Survey dependency changed: audit the writer certificate and private hash stamps before repinning.');
});
function realm(on=true){const c=vm.createContext({console});
  vm.runInContext(`const SIZE=1000,GRID=20,CELL=SIZE/GRID,FN=1,FG=1000,PLN=20;let W=null;`,c);
  vm.runInContext([...HELPERS.map(line),line('let HASH_STAMP='),...READS.map(fn),NATIVE_LINE,line('const CASTLE_FOUNDATION_SURVEY_NATIVE='),line('const CASTLE_FOUNDATION_SURVEYS='),fn('castleFoundationSurveyNative'),fn('castleFoundationSurveyToken'),fn('castleFoundationFailedSite')].join('\n'),c);
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
  assert.equal(run(on,'rasterReads'),3,'one exact pending raster per authoritative survey, never retained across operations');
  assert.ok(run(off,'rasterReads')>30,'control path recomputes the native raster for each clear probe');
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
