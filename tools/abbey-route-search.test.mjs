import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {parse} from './vendor/acorn/acorn.mjs';
import {inlineGameScript} from './simulation-boundary.mjs';

const source=inlineGameScript(fs.readFileSync(process.env.FURLONG_TEST_SOURCE||new URL('../index.html',import.meta.url),'utf8'));
const ast=parse(source,{ecmaVersion:'latest'}),functions=new Map(),variables=new Map();
for(const node of ast.body){if(node.type==='FunctionDeclaration')functions.set(node.id.name,node);else if(node.type==='VariableDeclaration')for(const declaration of node.declarations)if(declaration.id.type==='Identifier')variables.set(declaration.id.name,{kind:node.kind,node:declaration});}
const fn=n=>{const node=functions.get(n);assert.ok(node,'missing native '+n);return source.slice(node.start,node.end);};
const constant=n=>{const declaration=variables.get(n);assert.ok(declaration,'missing native '+n);return declaration.kind+' '+source.slice(declaration.node.start,declaration.node.end)+';';};
const native=n=>functions.has(n)?fn(n):constant(n);
const certificate=constant('ABBEY_ROUTE_SURVEY_NATIVE'),certificateNode=variables.get('ABBEY_ROUTE_SURVEY_NATIVE').node.init;
assert.equal(certificateNode.type,'CallExpression');assert.equal(certificateNode.callee.object.name,'Object');assert.equal(certificateNode.callee.property.name,'freeze');
const readers=certificateNode.arguments[0].properties.map(property=>{
 assert.equal(property.type,'Property');assert.equal(property.computed,false);assert.equal(property.method,false);assert.equal(property.key.type,'Identifier');
 const n=property.key.name,value=property.value;
 if(value.type==='Identifier')assert.equal(value.name,n);
 else{assert.equal(value.type,'ConditionalExpression');assert.equal(value.test.type,'BinaryExpression');assert.equal(value.test.operator,'===');assert.equal(value.test.left.type,'UnaryExpression');assert.equal(value.test.left.operator,'typeof');assert.equal(value.test.left.argument.name,n);assert.equal(value.test.right.value,'function');assert.equal(value.consequent.name,n);assert.equal(value.alternate.value,null);}
 return n;
});
// Reviewed corridor extension: native permission/public-graph readers precede
// the original 53 route identities, which keep their exact previous order.
const reviewedReaders=('ABBEY_APPROACH_SURVEY_CURRENT resample wallDamage streetGraphFortContext fortStreetRuns fortRoadBlocked lakeAt streetGraph furlongAt computeFurlongPoly bindHousehold newHousehold oldHouseholdHead nonemptyHouseholds folkIndex cellZ cellX locW roadAccessClear streetAccessAt householdAccount corpOf abbeyApproachSurveyNative abbeyApproachSurvey abbeyCorridorCold abbeyCorridorInputs abbeyCorridorReady abbeyCorridorPrivate abbeyCorridorGhostClear abbeyCorridorWorldClear abbeyCorridorSegmentClear abbeySurveyBounds abbeySurveyBoxesMayHit abbeySurveyUnion abbeySurveyIndexRange abbeySurveyIndex abbeySurveyIndexRows abbeySurveyReserved abbeySurveyPublic abbeyPublicStreet abbeyAccessEndpointValid compoundPolys compoundPolygonDifference compoundGround occupiedGroundCells occupiedGroundFields occupiedGroundAreas storageGroundClaim propertyRightsResolve accountOwner houseAcct storageOwnerId graveyardPolygonsOverlap streetFootprintOverlap obbCorners inPolyXZ segSegDist abbeyRouteEnter abbeyRouteLeave serviceRoadPlan armyLandPath armyDetour armyReach armyReaches armyReachClosed armyReachFrom armyReachCovers armySegmentClear armyObstacle armyBridgeAt armyRaftAt armyCauseway hAt riverAt onRoad paidRoadAt walkedRoadAt roadWalkedBounds roadBounds fortGround fortSurface motteSurface fortCircuits casRing fortCenter wallRadAt wallKindAt wallBuilt wallProg wallDmgAt fortGateAngles wallGates citadelBarrier citadelLocal citadelBastion citadelFootprintAt citadelTownCut hostileTo atWar inRevolt inPoly segDist dist2d lerp clamp toCell cIdx inB sstep day').split(' ');
assert.deepEqual(readers,reviewedReaders);
const hotDetour=fn('armyDetour');
// Reconstruct only the two old expressions. All native routing, obstacles,
// scope certificates, heap comparisons, expansion limits and logs are shared.
const oldScore='const score=k=>dist2d(point(k).x,point(k).z,q.x,q.z),push=';
const hotScore='const score=k=>{if(!fast)return dist2d(point(k).x,point(k).z,q.x,q.z);if(!scored[k]){heuristic[k]=dist2d(x0+(k%nx)*step,z0+Math.floor(k/nx)*step,q.x,q.z);scored[k]=1;}return heuristic[k];},push=';
const hotCost='let length;if(lengths&&k!==start&&j!==end){const e=dx&&dz?1:0;length=lengths[e];if(length===undefined)lengths[e]=length=dist2d(P.x,P.z,Q.x,Q.z);}else length=dist2d(P.x,P.z,Q.x,Q.z);const cost=g[k]+length;';
assert.ok(hotDetour.includes(hotScore)&&hotDetour.includes(hotCost));
const oldDetour=hotDetour.replace(/^  \/\/ Only the uninterrupted[^\n]*\n  const scope=[^\n]*\n/m,'').replace(hotScore,oldScore).replace(hotCost,'const cost=g[k]+dist2d(P.x,P.z,Q.x,Q.z);');
assert.ok(!oldDetour.includes('heuristic')&&!oldDetour.includes('lengths'));

function setup({old=false,prepare='',replaceableDistance=false}={}){
 const count={hypot:0,heightReads:0},math=Object.create(Math);
 math.hypot=(...args)=>{count.hypot++;return Math.hypot(...args);};
 const C=vm.createContext({Math:math,count});
 const run=code=>vm.runInContext(code,C);
 run(`const GRID=16,CELL=40,SIZE=640,SEA_SURFACE=.5,BACKGROUND=null,MOTTEH=9;let HASH_STAMP=0;
  const s={owner:0,pos:{x:0,z:0},buildings:[],streets:[],_lay:{}};
  const heights=new Float32Array(GRID*GRID).fill(10);
  const W={clock:{day:1},settlements:[s],roads:[],feuds:[],dom:new Int16Array(GRID*GRID),h:new Proxy(heights,{get(target,key){if(typeof key==='string'&&/^\\d+$/.test(key))count.heightReads++;return Reflect.get(target,key,target);}})};
 `);
 // Only replacement-reader tests make this lexical binding writable. The
 // captured native function body stays exact; replacing it invalidates proof.
 run(readers.map(n=>n==='armyDetour'&&old?oldDetour:n==='dist2d'&&replaceableDistance?constant(n).replace(/^const /,'let '):native(n)).join('\n'));
 run(['abbeyRouteSurveyNative','abbeyRouteSurveyInputs','abbeyRouteTerrain','abbeyRouteMemo','abbeyTerrainSegmentClear','makeHash'].filter(n=>!readers.includes(n)).map(fn).join('\n'));
 run(`W.rivHash=makeHash(40);s._lay.placed=makeHash(16);onRoad.reach=-1;`);
 if(prepare)run(prepare);
 run(certificate);
 run(`const terrain=abbeyRouteTerrain(s);function walker(shared=true){const M=shared?abbeyRouteMemo(terrain):new Map();M.boxes=[];M.shut=[];return {house:s.owner,settlement:s,placed:s._lay.placed,requireRoadCrossing:true,waterClearance:2.3,_em:M};}
  function result(path,a){return {path,boxes:a._em.boxes,shut:a._em.shut.map(R=>({...R,closed:Array.from(R.closed)})),edges:[...a._em],roadBounds:W.roads.map(r=>r._bb),roadReach:onRoad.reach};}
 `);
 return {C,count,run,json:code=>JSON.parse(run('JSON.stringify('+code+')'))};
}
const building=`const building={x:10,z:0,w:8,d:16,rot:.2,state:'sound',arch:'house'};s.buildings.push(building);s._lay.placed.add(building,10);`;
function search(r,{p={x:-20,z:0},q={x:26,z:0},pad=24,shared=true,ghost=null,nested=false,useRetained=false}={}){
 r.C.input={p,q,pad,shared,ghost,nested,useRetained};
 r.run(`var a=input.useRetained?retainedWalker:walker(input.shared),p=input.p,q=input.q;if(input.ghost)a.ghost=input.ghost;
  var entered=input.nested?abbeyRouteEnter(a):null,outer=a._em.abbeyRouteGuard;count.hypot=count.heightReads=0;
  var path=armyDetour(a,p,q,input.pad),answer=result(path,a),after=a._em.abbeyRouteGuard;
  if(entered)abbeyRouteLeave(a,entered);`);
 return r.json('answer');
}

test('actual certified detours preserve full native paths, directed edge logs and expanded-node records',()=>{
 assert.equal(readers.length,110);assert.equal(new Set(readers).size,110);
 const cases=[{}, {p:{x:-20.7,z:.3},q:{x:26.4,z:-.2}}, {p:{x:26.4,z:-.2},q:{x:-20.7,z:.3}},
  {p:{x:-0,z:-20},q:{x:0,z:22}}, {p:{x:0,z:0},q:{x:.3,z:.4}}, {nested:true},
  {ghost:{x:-15,z:-6,w:6,d:8,rot:.3}}];
 for(const options of cases){const hot=setup({prepare:building}),old=setup({old:true,prepare:building}),cold=setup({prepare:building});
  const actual=search(hot,options),reference=search(old,options),ordinary=search(cold,{...options,shared:false});
  assert.deepEqual(actual,reference,JSON.stringify(options));assert.deepEqual(actual,ordinary,'ordinary native detour');
  assert.equal(hot.run('!path||path[0]===p&&path.at(-1)===q'),true,'retain exact endpoint objects and signed zeros');
  assert.equal(hot.run('a._em.abbeyRouteGuard'),undefined);
  if(options.nested)assert.equal(hot.run('after===outer'),true);
 }
});

test('river failures retain native lazy road bounds and all directed failure records',()=>{
 const prepare=`const river={x:0,z:0,a:{x:0,z:-100},b:{x:0,z:100},hw:2,y:10};W.rivHash.add(river,105);
  W.roads.push({a:0,b:0,path:[{x:-20,z:40},{x:26,z:40}]});`;
 const hot=setup({prepare}),old=setup({old:true,prepare});const actual=search(hot),reference=search(old);
 assert.deepEqual(actual,reference);assert.equal(actual.path,null);assert.ok(actual.shut[0].closed.reduce((n,k)=>n+k,0)>100);
 assert.deepEqual(actual.roadBounds,[[-20,40,26,40]]);assert.equal(hot.run('a._em.abbeyRouteGuard'),undefined);
});

test('water and closed-footprint failures retain all native failure outputs and original size budget',()=>{
 for(const prepare of ['heights.fill(0);',`const b={x:0,z:0,w:200,d:200,rot:0,state:'sound',arch:'house'};s.buildings.push(b);s._lay.placed.add(b,150);`]){
  const hot=setup({prepare}),old=setup({old:true,prepare});const actual=search(hot),reference=search(old);
  assert.equal(actual.path,null);assert.deepEqual(actual,reference);assert.equal(actual.shut.length,1);assert.equal(actual.shut[0].closed.reduce((n,k)=>n+k,0),1);
 }
 const hot=setup(),old=setup({old:true});assert.deepEqual(search(hot,{pad:500}),search(old,{pad:500}));
 assert.equal(hot.run('answer.path'),null);assert.equal(hot.run('answer.boxes.length+answer.shut.length'),0);assert.equal(hot.count.hypot,0);
 assert.ok(hotDetour.includes('N>50000')&&hotDetour.includes('visited++<30000')&&hotDetour.includes('if(cost<g[j])'));
});

test('heuristics and lattice lengths save actual native distance work without skipping terrain reads or off-grid edges',t=>{
 const hot=setup({prepare:building}),old=setup({old:true,prepare:building});
 const options={p:{x:-20.7,z:.3},q:{x:26.4,z:-.2},nested:true};
 assert.deepEqual(search(hot,options),search(old,options));
 assert.ok(hot.count.hypot<old.count.hypot*.85,`${hot.count.hypot}/${old.count.hypot}`);
 assert.equal(hot.count.heightReads,old.count.heightReads);assert.ok(hot.count.heightReads>100);
 t.diagnostic(`native hypot calls ${old.count.hypot}→${hot.count.hypot}; native height reads unchanged at ${hot.count.heightReads}`);
 // Record exact endpoint distance arguments with a replaced helper: this must
 // invalidate the certificate and keep the complete original cold query prefix.
 for(const shared of [false,true]){const current=setup({prepare:building,replaceableDistance:true}),legacy=setup({old:true,prepare:building,replaceableDistance:true});
  for(const r of [current,legacy])r.run(`var retainedWalker=walker(${shared});const originalDistance=dist2d;const queries=[];dist2d=(...v)=>{queries.push(v);return originalDistance(...v);};`);
  assert.deepEqual(search(current,{...options,shared,nested:false,useRetained:true}),search(legacy,{...options,shared,nested:false,useRetained:true}));
  assert.deepEqual(current.json('queries'),legacy.json('queries'));
  assert.ok(current.run('queries.some(v=>v[0]===p.x&&v[1]===p.z)||queries.some(v=>v[2]===q.x&&v[3]===q.z)'));
 }
});

test('cold callers retain custom distance side effects and strict heap choices',()=>{
 for(const shared of [false,true]){const hot=setup({prepare:building,replaceableDistance:true}),old=setup({old:true,prepare:building,replaceableDistance:true});
  for(const r of [hot,old])r.run(`var retainedWalker=walker(${shared});const nativeDistance=dist2d;const calls=[];dist2d=(...v)=>{calls.push(v);return nativeDistance(...v)+(calls.length%3)*.00001;};`);
  assert.deepEqual(search(hot,{shared,useRetained:true}),search(old,{shared,useRetained:true}));assert.deepEqual(hot.json('calls'),old.json('calls'));
  assert.equal(hot.run('a._em.abbeyRouteGuard'),undefined);
 }
});

test('stale inputs and replaced native readers restore the original memo and cold result',()=>{
 for(const mutation of ['W.clock.day++;','s.owner=2;','s._lay.placed=makeHash(16);','const nativeHeight=hAt;hAt=(x,z)=>nativeHeight(x,z);']){
  const hot=setup({prepare:building}),old=setup({old:true,prepare:building});
  for(const r of [hot,old])r.run(`var a=walker(),retained=a._em;${mutation}var path=armyDetour(a,{x:-20,z:0},{x:26,z:0},24);var answer=result(path,a);`);
  assert.deepEqual(hot.json('answer'),old.json('answer'),mutation);assert.equal(hot.run('a._em===retained'),true);assert.equal(hot.run('a._em.abbeyRouteGuard'),undefined);
 }
});

test('scope restoration survives native world-read exceptions both directly and nested',()=>{
 for(const nested of [false,true]){const r=setup({prepare:building});r.run(`var a=walker(),retained=a._em,entered=${nested}?abbeyRouteEnter(a):null,outer=a._em.abbeyRouteGuard;
  W.h=new Proxy(heights,{get(){throw Error('native terrain read failed');}});`);
  assert.throws(()=>r.run('armyDetour(a,{x:-20,z:0},{x:26,z:0},24)'),/native terrain read failed/);
  assert.equal(r.run('a._em===retained'),true);assert.equal(r.run('a._em.abbeyRouteGuard===outer'),true);
  if(nested)r.run('abbeyRouteLeave(a,entered)');assert.equal(r.run('a._em.abbeyRouteGuard'),undefined);
 }
});

test('a later goal gets fresh operation-local heuristic values without world or memo leakage',()=>{
 const hot=setup({prepare:building}),old=setup({old:true,prepare:building});
 for(const r of [hot,old])r.run('var retainedWalker=walker();');
 assert.deepEqual(search(hot,{useRetained:true}),search(old,{useRetained:true}));
 assert.deepEqual(search(hot,{useRetained:true,q:{x:26,z:13.3}}),search(old,{useRetained:true,q:{x:26,z:13.3}}));
 assert.equal(hot.run("Reflect.ownKeys(W).some(k=>['heuristic','scored','lengths','abbeyRouteGuard'].includes(k))||Reflect.ownKeys(a._em).some(k=>['heuristic','scored','lengths','abbeyRouteGuard'].includes(k))"),false);
});

test('retained landing metadata projects as detached scalar geometry while survey caches stay local',()=>{
 const r=setup();r.run(['VISUAL_PRIVATE','VISUAL_LINKS','VISUAL_SHAPES','VISUAL_ENTITY'].map(constant).join('\n')+'\n'+['visualDataNames','visualScalars','visualGeometry','visualPoints','visualPut','visualRecord'].map(fn).join('\n'));
 // A geometry-copy boundary: no founder, claim, completed building or actor is
 // created. The actual project DTO recursively carries the retained site.
 r.run(`const site={f:{x:0,z:0,w:12,d:22,rot:0},path:[{x:0,z:11},{x:0,z:12.2},{x:0,z:13}],access:{corridorFrom:2,endpoint:{kind:'street',ref:0,segment:1,point:{x:0,z:13}},pathKey:'fixed route',privatePolys:[]}};
  const q={type:'compound',site},packet=VISUAL_ENTITY.project(q),copied=packet.site.access.corridorFrom;packet.site.access.corridorFrom=9;`);
 assert.equal(r.run('copied'),2);assert.equal(r.run('q.site.access.corridorFrom'),2);
 assert.equal(r.run('packet.site!==site&&packet.site.access!==site.access&&packet.site.path!==site.path'),true);
 assert.deepEqual(r.json('packet.site.path'),r.json('site.path'));
 assert.equal(r.run("Reflect.ownKeys(packet.site.access).some(k=>['corridor','terrain','memo','banks','claims','payer'].includes(k))"),false);
 assert.match(fn('abbeyCorridorReady'),/C\.corridor=corridor/);
 assert.match(fn('abbeyApproachPlan'),/site\.access\.corridorFrom=2/);
 assert.doesNotMatch(fn('abbeyApproachPlan'),/(?:W|site)\.(?:corridor|terrain|memo|banks|claims)\s*=/);
});
