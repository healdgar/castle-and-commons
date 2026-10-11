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
const reviewedReaders=('occupiedGroundBoxMayHit ABBEY_APPROACH_SURVEY_CURRENT resample wallDamage streetGraphFortContext fortStreetRuns fortRoadBlocked lakeAt streetGraph furlongAt computeFurlongPoly bindHousehold newHousehold oldHouseholdHead nonemptyHouseholds folkIndex cellZ cellX locW roadAccessClear streetAccessAt householdAccount corpOf abbeyApproachSurveyNative abbeyApproachSurvey abbeyCorridorCold abbeyCorridorInputs abbeyCorridorReady abbeyCorridorPrivate abbeyCorridorGhostClear abbeyCorridorWorldClear abbeyCorridorSegmentClear abbeySurveyBounds abbeySurveyBoxesMayHit abbeySurveyUnion abbeySurveyIndexRange abbeySurveyIndex abbeySurveyIndexRows abbeySurveyReserved abbeySurveyPublic abbeyPublicStreet abbeyAccessEndpointValid compoundPolys compoundPolygonDifference compoundGround occupiedGroundCells occupiedGroundFields occupiedGroundAreas storageGroundClaim propertyRightsResolve accountOwner houseAcct storageOwnerId graveyardPolygonsOverlap streetFootprintOverlap obbCorners inPolyXZ segSegDist abbeyRouteEnter abbeyRouteLeave serviceRoadPlan armyLandPath armyDetour armyReach armyReaches armyReachClosed armyReachFrom armyReachCovers armySegmentClear armyObstacle armyBridgeAt armyRaftAt armyCauseway hAt riverAt onRoad paidRoadAt walkedRoadAt roadWalkedBounds roadBounds fortGround fortSurface motteSurface fortCircuits casRing fortCenter wallRadAt wallKindAt wallBuilt wallProg wallDmgAt fortGateAngles wallGates citadelBarrier citadelLocal citadelBastion citadelFootprintAt citadelTownCut hostileTo atWar inRevolt inPoly segDist dist2d lerp clamp toCell cIdx inB sstep day').split(' ');
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

const boundedExpression='!!corridor?.terrain&&walker._em.abbeyTerrain===corridor.terrain&&abbeyCorridorInputs(corridor,walker)&&corridor.C.native&&abbeyApproachSurveyNative()';
assert.ok(fn('serviceRoadPlan').includes('const bounded='+boundedExpression+';'));
// Restores only the old exhaustive flood branch; its actual flood body, native
// path search, endpoint ordering and all physical/title predicates are shared.
const oldFloodService=fn('serviceRoadPlan').replace(boundedExpression,'false');
const endpointGate='    if(bounded&&endpointBlocked(q)){if(attempted.length===12)break;continue;}\n';
assert.ok(fn('serviceRoadPlan').includes(endpointGate));
// Remove only the new necessary endpoint predicate. Native target order,
// attempted-target accounting, bounded path search and final clearance remain.
const oldEndpointService=fn('serviceRoadPlan').replace(endpointGate,'');
const countedBody=(n,key)=>{const code=fn(n),at=functions.get(n).body.start-functions.get(n).start+1;return code.slice(0,at)+'count.'+key+'++;'+code.slice(at);};
const countedService=code=>code.replace('attempted.push(q);','attempted.push(q);count.targets.push({street:s.streets.indexOf(q.st),road:W.roads.indexOf(q.road),x:q.x,z:q.z});');

const highwayClause=fn('serviceRoadPlan').match(/  \/\/ An Abbey's rural approach[^\n]*\n  if\(corridor\)\{const si=W\.settlements\.indexOf\(s\);[^\n]*\n/)[0];
const oldServiceRoad=fn('serviceRoadPlan').replace(highwayClause,'').replaceAll('a.st||a.road','a.st').replaceAll('c.st||c.road','c.st').replace('(a.st)===(q.st||q.road)','a.st===q.st').replace("q.road?{path,road:q.road}:{path,street:q.st}","{path,street:q.st}").replace("q.road?{path,road:q.road}:{path,street:q.st}","{path,street:q.st}");
assert.ok(!oldServiceRoad.includes('q.road')&&!oldServiceRoad.includes('a.road')&&!oldServiceRoad.includes('c.road'));

function setup({old=false,oldService=false,oldFlood=false,oldEndpoint=false,countRoutes=false,prepare='',replaceableDistance=false}={}){
 const count={hypot:0,heightReads:0,reach:0,from:0,closed:0,land:0,targets:[]},math=Object.create(Math);
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
 run(readers.map(n=>n==='armyDetour'&&old?oldDetour:n==='serviceRoadPlan'?(countRoutes?countedService:code=>code)(oldService?oldServiceRoad:oldFlood?oldFloodService:oldEndpoint?oldEndpointService:fn(n)):countRoutes&&['armyReach','armyReachFrom','armyReachClosed','armyLandPath'].includes(n)?countedBody(n,({armyReach:'reach',armyReachFrom:'from',armyReachClosed:'closed',armyLandPath:'land'})[n]):n==='dist2d'&&replaceableDistance?constant(n).replace(/^const /,'let '):native(n)).join('\n'));
 run(['abbeyRouteSurveyNative','abbeyRouteSurveyInputs','abbeyRouteTerrain','abbeyRouteMemo','abbeyTerrainSegmentClear','makeHash'].filter(n=>!readers.includes(n)).map(fn).join('\n'));
 run(`W.rivHash=makeHash(40);s._lay.placed=makeHash(16);onRoad.reach=-1;`);
 if(prepare)run(prepare);
 // The disjoint row-strip batch adds this actual immutable reader capture;
 // older parent sources keep their native rectangle fallback without a stub.
 if(variables.has('OCCUPIED_GROUND_NATIVE'))run(constant('OCCUPIED_GROUND_NATIVE'));
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
 assert.equal(readers.length,111);assert.equal(new Set(readers).size,111);
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

// Finite controlled native geometry/title fixture: one Crown-held parcel, no
// generated people, goods, endowment, licence, commissioned project or RNG.
function highwaySetup({prepare='',oldService=false,oldFlood=false,oldEndpoint=false,countRoutes=false,replaceableDistance=false}={}){
 const extra=['castleFoundationReserved','abbeyAccessEndpoint','lerpPt'].map(fn).join('\n')+'\n'+
  ['STREET_GRAPH_FORT_CONTEXTS','STREET_GRAPH_FORT_NATIVE','ABBEY_APPROACH_SURVEY_NATIVE'].map(constant).join('\n');
 return setup({oldService,oldFlood,oldEndpoint,countRoutes,replaceableDistance,prepare:extra+`
const FN=1,FG=SIZE,field={k:0,i:0,j:0,jx:.5,jz:.5,lord:0,own:'crown',wk:'crown'};
  W.houses=[{name:'Crown'},{name:'Other holder',gold:10}];W.projects=[];W.land={F:[field],mask:new Uint8Array(GRID*GRID*4)};
  for(let i=0;i<GRID*GRID;i++)W.land.mask[i*4]=1;
  field.title={own:propertyRightsResolve('crown'),work:propertyRightsResolve('crown')};`+prepare});
}
function roadSearch(r,{p={x:-100,z:0},corridor=true,useRetained=false,accept='undefined',publicAccess='undefined',ghost='undefined'}={}){
 r.C.roadInput={p,corridor,useRetained};
 r.run(`var proposal=roadInput.corridor?roadInput.useRetained?retainedCorridor:abbeyCorridorReady(s,abbeyApproachSurvey(s),'crown',undefined,0,terrain):undefined;
  var roadAnswer=serviceRoadPlan(s,roadInput.p,s._lay.placed,null,1.3,proposal?.memo||abbeyRouteMemo(terrain),${ghost},proposal?.banks,${accept},${publicAccess},proposal);`);
 return r.json('roadAnswer');
}
const remoteHighway=`const road={a:0,b:1,path:[{x:20,z:-40},{x:20,z:40}]};W.roads.push(road);`;

test('ordinary native service callers retain their original query prefix, targets and acceptance ordering',()=>{
 const prepare=remoteHighway+`s.streets.push({id:'near',kind:'lane',hw:2,pts:[{x:-20,z:-8},{x:-20,z:8}]},{id:'far',kind:'lane',hw:2,pts:[{x:-12,z:-8},{x:-12,z:8}]});
  const nativeDistance=dist2d,queries=[],accepted=[];dist2d=(...v)=>{queries.push(v);return nativeDistance(...v);};
  function acceptService(q){accepted.push({keys:Object.keys(q),id:q.street?.id,path:q.path});return accepted.length===2;}`;
 const current=highwaySetup({prepare,replaceableDistance:true}),previous=highwaySetup({prepare,oldService:true,replaceableDistance:true});
 assert.deepEqual(roadSearch(current,{corridor:false,accept:'acceptService'}),roadSearch(previous,{corridor:false,accept:'acceptService'}));
 assert.deepEqual(current.json('accepted'),previous.json('accepted'));assert.deepEqual(current.json('queries'),previous.json('queries'));
 assert.deepEqual(current.json('accepted.map(q=>q.id)'),['near','far']);
 assert.equal(current.run('roadAnswer.street===s.streets[1]&&!Object.hasOwn(roadAnswer,"road")'),true);
 const onlyHighway=highwaySetup({prepare:remoteHighway});assert.equal(roadSearch(onlyHighway,{corridor:false}),null);
});

test('an Abbey corridor reaches its actual incident highway beyond the direct 60 metre connector',()=>{
 const r=highwaySetup({prepare:remoteHighway}),before=r.json('({roads:W.roads.length,streets:s.streets.length,projects:W.projects.length,mask:Array.from(W.land.mask),title:field.title})');
 const answer=roadSearch(r);assert.ok(answer);assert.deepEqual(answer.path,[{x:-100,z:0},{x:20,z:0}]);
 assert.equal(r.run('roadAnswer.road===road&&!Object.hasOwn(roadAnswer,"street")&&proposal.C.native'),true);
 assert.equal(r.run('dist2d(roadInput.p.x,roadInput.p.z,roadAnswer.path.at(-1).x,roadAnswer.path.at(-1).z)>60'),true);
 r.run('var endpoint=abbeyAccessEndpoint(s,roadAnswer.path);');
 assert.deepEqual(r.json('endpoint'),{kind:'road',ref:0,segment:1,point:{x:20,z:0}});
 assert.equal(r.run('abbeyAccessEndpointValid(s,endpoint,roadAnswer.path.at(-1))'),true);
 assert.deepEqual(r.json('({roads:W.roads.length,streets:s.streets.length,projects:W.projects.length,mask:Array.from(W.land.mask),title:field.title})'),before);
 assert.equal(r.run('Object.hasOwn(W,"corridor")||Object.hasOwn(s,"corridor")||Object.hasOwn(road,"accessEndpoint")'),false);
});

test('highway targets use only actual incident open geometry and retained endpoints revalidate current native roads',()=>{
 const r=highwaySetup({prepare:`W.roads.push({a:1,b:2,path:[{x:-90,z:-20},{x:-90,z:20}]});const road={a:0,b:1,path:[{x:-80,z:-20},{x:-80,z:20}],open:[{x:20,z:-40},{x:20,z:40}]};W.roads.push(road);`});
 const answer=roadSearch(r);assert.ok(answer);assert.deepEqual(answer.path.at(-1),{x:20,z:0});assert.equal(r.run('roadAnswer.road===W.roads[1]'),true);
 r.run('var endpoint=abbeyAccessEndpoint(s,roadAnswer.path);');assert.deepEqual(r.json('endpoint'),{kind:'road',ref:1,segment:1,point:{x:20,z:0}});
 for(const change of ['road.a=2;road.b=3;','road.open=[{x:21,z:-40},{x:21,z:40}];','W.roads[1]={a:0,b:1,open:[{x:30,z:-40},{x:30,z:40}]};']){
  const x=highwaySetup({prepare:remoteHighway});assert.ok(roadSearch(x));x.run('var endpoint=abbeyAccessEndpoint(s,roadAnswer.path);'+change.replace('W.roads[1]','W.roads[0]'));
  assert.equal(x.run('abbeyAccessEndpointValid(s,endpoint,roadAnswer.path.at(-1))'),false,change);
 }
 const noIncident=highwaySetup({prepare:'W.roads.push({a:1,b:2,path:[{x:20,z:-40},{x:20,z:40}]});'});assert.equal(roadSearch(noIncident),null);
});

test('native street ties remain first and multiple segments of each actual highway consume one of twelve target attempts',()=>{
 const r=highwaySetup({prepare:`s.streets.push({id:'street',kind:'lane',hw:2,pts:[{x:-20,z:-20},{x:-20,z:20}]});
  W.roads.push({a:0,b:1,path:[{x:-20,z:-30},{x:-20,z:0},{x:-20,z:30}]});
  for(let i=1;i<16;i++)W.roads.push({a:0,b:i+1,path:[{x:-20+i*3,z:-30},{x:-20+i*3,z:0},{x:-20+i*3,z:30}]});
  const accepted=[];function declineTarget(q){accepted.push({id:q.street?q.street.id:W.roads.indexOf(q.road),end:q.path.at(-1),keys:Object.keys(q)});return false;}`});
 assert.equal(roadSearch(r,{accept:'declineTarget'}),null);
 assert.deepEqual(r.json('accepted.map(q=>q.id)'),['street',0,1,2,3,4,5,6,7,8,9,10]);
 assert.equal(r.run('accepted.length'),12);assert.equal(new Set(r.json('accepted.map(q=>q.id)')).size,12);
 assert.deepEqual(r.json('accepted.slice(0,2).map(q=>q.keys)'),[['path','street'],['path','road']]);
});

test('an uncertified native corridor flood keeps distinct road identities and refuses active work rights without granting a licence',()=>{
 const r=highwaySetup({prepare:`field.title.work={owner:W.houses[1],beneficiary:null};
  for(let i=0;i<16;i++)W.roads.push({a:0,b:i+1,path:[{x:-20+i*3,z:-30},{x:-20+i*3,z:0},{x:-20+i*3,z:30}]});`});
 // Install the observer after native capture: this caller is intentionally
 // uncertified and must keep the entire original flood branch and arguments.
 r.run(`const actualReach=armyReach,floodTargets=[];armyReach=(a,p,pts,pad,cap)=>{floodTargets.push(pts.map(q=>({id:W.roads.indexOf(q.road),x:q.x,z:q.z})));return actualReach(a,p,pts,pad,cap);};`);
 assert.equal(roadSearch(r),null);assert.equal(r.run('floodTargets.length'),1);
 assert.deepEqual(r.json('floodTargets[0].map(q=>q.id)'),[1,2,3,4,5,6,7,8,9,10,11]);
 assert.equal(r.run('field.title.work.owner===W.houses[1]&&W.houses[1].gold===10&&W.projects.length===0'),true);
 assert.equal(r.run('storageGroundClaim(s,{site:{path:[{x:-100,z:0},{x:20,z:0}]},land:1,claimOccupied:true},"crown").reason'), 'occupied-holding');
});

test('actual highway targets retain water, pending works, standing footprints and ghost clearance vetoes',()=>{
 for(const obstacle of [
  'heights.fill(0);',
  `const b={x:-100,z:0,w:20,d:20,rot:0,state:'sound',arch:'house'};s.buildings.push(b);s._lay.placed.add(b,15);`,
  `W.projects.push({type:'compound',si:0,site:{f:{x:-100,z:0,w:20,d:20,rot:0}}});`
 ]){const r=highwaySetup({prepare:remoteHighway+obstacle});assert.equal(roadSearch(r),null,obstacle);}
 const ghost=highwaySetup({prepare:remoteHighway});assert.equal(roadSearch(ghost,{ghost:'{x:-100,z:0,w:20,d:20,rot:0}'}),null);
 // The current native river/bridge predicate remains the final physical gate;
 // discovering a road endpoint alone supplies no crossing through nearby water.
 const river=highwaySetup({prepare:remoteHighway+`const water={x:0,z:0,a:{x:0,z:-300},b:{x:0,z:300},hw:2,y:10};W.rivHash.add(water,305);`});
 river.run(`var proposal=abbeyCorridorReady(s,abbeyApproachSurvey(s),'crown',undefined,0,terrain),a=walker();a.abbeyCorridor=proposal;`);
 assert.equal(river.run('armySegmentClear(a,{x:-100,z:0},{x:20,z:0})'),false);
 river.run(`W.roads.push({a:1,b:2,path:[{x:-10,z:0},{x:10,z:0}]});`);
 // Fresh native call after a real highway change must observe its actual crossing.
 assert.equal(river.run('armySegmentClear(a,{x:-100,z:0},{x:20,z:0})'),true);
});

// Native reachability is bounded by four actual standing footprints, so the old
// exhaustive flood fixture completes in a small enclosure without changing its
// native 60,000-node cap or replacing any physical/rights reader. Counters are
// inserted in the exact native bodies before both identity certificates capture
// those functions; they record calls only and never touch world/memo/route state.
const enclosedTargets=`for(const b of [
 {x:-20,z:0,w:2,d:24},{x:20,z:0,w:2,d:24},{x:0,z:-10,w:44,d:2},{x:0,z:10,w:44,d:2}
]){Object.assign(b,{rot:0,state:'sound',arch:'house'});s.buildings.push(b);s._lay.placed.add(b,25);}
 W.roads.push({a:0,b:1,path:[{x:24,z:-4},{x:24,z:4}]},{a:0,b:2,path:[{x:-2,z:-4},{x:-2,z:4}]});`;
function nativeRoadIdentity(r){return r.json('roadAnswer&&({path:roadAnswer.path,street:s.streets.indexOf(roadAnswer.street),road:W.roads.indexOf(roadAnswer.road),endpoint:abbeyAccessEndpoint(s,roadAnswer.path)})');}

test('certified bounded Abbey paths match the old native flood result with zero reachability floods',()=>{
 const current=highwaySetup({prepare:enclosedTargets,countRoutes:true}),prior=highwaySetup({prepare:enclosedTargets,countRoutes:true,oldFlood:true});
 const graphClass=ast.body.find(n=>n.type==='ClassDeclaration'&&n.id.name==='HistoryGraph');assert.ok(graphClass);
 for(const r of [current,prior]){r.C.btoa=btoa;r.run(constant('HISTORY_SCRATCH')+'\n'+source.slice(graphClass.start,graphClass.end)+'\n'+fn('sfc32')+'\n'+fn('seedStreams')+`
  const RS=seedStreams(1001,42);function nativeFixtureCapture(){const G=new HistoryGraph(),F=G.capture({world:W,rng:RS,hashStamp:HASH_STAMP});return{root:F.root,state:[...G.state],code:G.code};}
  const initialDice=Object.getOwnPropertyNames(RS).map(k=>[k,RS[k].state()]);`);}
 const options={p:{x:14,z:0},ghost:'{x:14,z:-5,w:2,d:2,rot:0}'};
 assert.deepEqual(roadSearch(current,options),roadSearch(prior,options));assert.ok(current.run('roadAnswer'));
 assert.deepEqual(nativeRoadIdentity(current),nativeRoadIdentity(prior));assert.deepEqual(current.json('roadAnswer.path'),[{x:14,z:0},{x:-2,z:0}]);
 assert.equal(current.run('abbeyCorridorInputs(proposal,walker())&&abbeyApproachSurveyNative()'),true);
 assert.equal(current.count.reach,0);assert.equal(current.count.from,0);assert.equal(current.count.closed,0);
 assert.equal(prior.count.reach,1);assert.equal(prior.count.closed,1);assert.equal(current.count.land,2);assert.equal(prior.count.land,2);
 assert.equal(current.run('proposal.banks.floods.length'),0);assert.equal(prior.run('proposal.banks.floods.length'),1);
 assert.deepEqual(current.json('nativeFixtureCapture()'),prior.json('nativeFixtureCapture()'),'actual current world/aliases/descriptors/closure code/every RNG/HASH_STAMP, without scratch omission');
 for(const r of [current,prior])assert.deepEqual(r.json('Object.getOwnPropertyNames(RS).map(k=>[k,RS[k].state()])'),r.json('initialDice'),'all actual streams remain untouched');
});

test('bounded native target searches preserve twelve-target failure and real active-holding refusals',()=>{
 const prepare=`field.title.work={owner:W.houses[1],beneficiary:null};for(let i=0;i<16;i++)W.roads.push({a:0,b:i+1,path:[{x:-20+i*3,z:-30},{x:-20+i*3,z:0},{x:-20+i*3,z:30}]});`;
 const current=highwaySetup({prepare,countRoutes:true}),prior=highwaySetup({prepare,countRoutes:true,oldFlood:true});
 assert.equal(roadSearch(current),null);assert.equal(roadSearch(prior),null);
 assert.equal(current.count.reach,0);assert.equal(prior.count.reach,1);assert.equal(current.count.land,12);
 assert.equal(current.run('field.title.work.owner===W.houses[1]&&W.houses[1].gold===10&&W.projects.length===0'),true);
 assert.deepEqual(current.json('field.title'),prior.json('field.title'));
});

test('certified searches skip actual banked open floods without changing retained path or endpoint',()=>{
 const current=highwaySetup({prepare:enclosedTargets,countRoutes:true}),prior=highwaySetup({prepare:enclosedTargets,countRoutes:true,oldFlood:true});
 for(const r of [current,prior])r.run(`const retainedCorridor=abbeyCorridorReady(s,abbeyApproachSurvey(s),'crown',undefined,0,terrain),a=walker();a.abbeyCorridor=retainedCorridor;
  const R=armyReach(a,{x:14,z:0},[{x:-2,z:0}],150,60000);R.hw=1.3;retainedCorridor.banks.floods.push(R);
  count.reach=count.from=count.closed=count.land=0;`);
 const options={p:{x:14,z:0},useRetained:true};
 assert.deepEqual(roadSearch(current,options),roadSearch(prior,options));assert.deepEqual(nativeRoadIdentity(current),nativeRoadIdentity(prior));
 assert.equal(current.count.reach+current.count.from+current.count.closed,0);assert.equal(prior.count.from,1);assert.equal(prior.count.reach,1);
 assert.equal(current.run('proposal===retainedCorridor&&proposal.terrain===terrain&&proposal.banks.floods.length===1'),true);
});

test('stale native corridor inputs and uncertified readers retain the old exhaustive flood prefix',()=>{
 for(const mutation of ['W.clock.day++;','s.owner=2;','s._lay.placed=makeHash(16);','retainedCorridor.terrain=null;','retainedCorridor.C.native=false;',
  `const nativeHeight=hAt;hAt=(...v)=>{queries.push(v);return nativeHeight(...v);};`]){
  const current=highwaySetup({prepare:enclosedTargets,countRoutes:true}),prior=highwaySetup({prepare:enclosedTargets,countRoutes:true,oldFlood:true});
  for(const r of [current,prior])r.run(`const retainedCorridor=abbeyCorridorReady(s,abbeyApproachSurvey(s),'crown',undefined,0,terrain),queries=[];${mutation}`);
  assert.deepEqual(roadSearch(current,{p:{x:14,z:0},useRetained:true}),roadSearch(prior,{p:{x:14,z:0},useRetained:true}),mutation);
  assert.deepEqual(nativeRoadIdentity(current),nativeRoadIdentity(prior),mutation);assert.ok(current.count.reach>0,mutation);
  assert.deepEqual(current.json('queries'),prior.json('queries'),mutation);
  assert.deepEqual({reach:current.count.reach,from:current.count.from,closed:current.count.closed,land:current.count.land},
   {reach:prior.count.reach,from:prior.count.from,closed:prior.count.closed,land:prior.count.land},mutation);
 }
});

const endpointNode=functions.get('serviceRoadPlan').body.body.find(n=>n.type==='VariableDeclaration'&&n.declarations.some(d=>d.id.name==='endpointBlocked')).declarations.find(d=>d.id.name==='endpointBlocked').init;
const endpointPredicate=source.slice(endpointNode.start,endpointNode.end);
const endpointEnclosure=`for(const wall of [{x:-34,z:0,w:2,d:16},{x:6,z:0,w:2,d:16},{x:-14,z:-7,w:42,d:2},{x:-14,z:7,w:42,d:2}]){Object.assign(wall,{rot:0,state:'sound',arch:'house'});s.buildings.push(wall);s._lay.placed.add(wall,28);}`;
const nearBlockedEndpoint=endpointEnclosure+`const b={x:3,z:0,w:4,d:8,rot:0,state:'sound',arch:'house'};s.buildings.push(b);s._lay.placed.add(b,8);
 W.roads.push({a:0,b:1,path:[{x:0,z:-1},{x:0,z:1}]},{a:0,b:2,path:[{x:-30,z:-1},{x:-30,z:1}]});`;

test('certified standing-endpoint rejection removes only failed work and retains the actual accepted route, graph and RNG',()=>{
 const current=highwaySetup({prepare:nearBlockedEndpoint,countRoutes:true}),prior=highwaySetup({prepare:nearBlockedEndpoint,countRoutes:true,oldEndpoint:true});
 const graphClass=ast.body.find(n=>n.type==='ClassDeclaration'&&n.id.name==='HistoryGraph');assert.ok(graphClass);
 for(const r of [current,prior]){r.C.btoa=btoa;r.run(constant('HISTORY_SCRATCH')+'\n'+source.slice(graphClass.start,graphClass.end)+'\n'+fn('sfc32')+'\n'+fn('seedStreams')+`
  const RS=seedStreams(1001,42);function endpointGraph(){const G=new HistoryGraph(),F=G.capture({world:W,rng:RS,hashStamp:HASH_STAMP});return{root:F.root,state:[...G.state],code:G.code};}
  const initialDice=Object.getOwnPropertyNames(RS).map(k=>[k,RS[k].state()]);`);}
 const options={p:{x:-14,z:0}};
 assert.deepEqual(roadSearch(current,options),roadSearch(prior,options));assert.ok(current.run('roadAnswer'));
 assert.deepEqual(nativeRoadIdentity(current),nativeRoadIdentity(prior));assert.deepEqual(current.json('roadAnswer.path'),[{x:-14,z:0},{x:-30,z:0}]);
 assert.equal(current.run('!!armyObstacle(walker(),0,0)'),false,'the old .6 m point test alone permits this endpoint');
 assert.equal(current.run('streetFootprintOverlap(b,{a:{x:0,z:0},b:{x:0,z:0},hw:1.3},.3)'),true);
 assert.equal(current.count.land,1);assert.equal(prior.count.land,2);assert.equal(current.count.reach+prior.count.reach,0);
 assert.deepEqual(current.json('count.targets'),prior.json('count.targets'));assert.deepEqual(current.json('count.targets.map(q=>q.road)'),[0,1]);
 assert.deepEqual(current.json('endpointGraph()'),prior.json('endpointGraph()'),'actual world graph and every native RNG without scratch omission');
 for(const r of [current,prior])assert.deepEqual(r.json('Object.getOwnPropertyNames(RS).map(k=>[k,RS[k].state()])'),r.json('initialDice'));
});

test('blocked endpoints still consume twelve ordered distinct native targets and never retry that road through another segment',()=>{
 const prepare=endpointEnclosure+`const b={x:3,z:0,w:4,d:8,rot:0,state:'sound',arch:'house'};s.buildings.push(b);s._lay.placed.add(b,8);
  for(let i=0;i<12;i++)W.roads.push({a:0,b:i+1,path:[{x:0,z:-1},{x:0,z:1},{x:0,z:20},{x:-30,z:20}]});
  W.roads.push({a:0,b:13,path:[{x:-30,z:-1},{x:-30,z:1}]});`;
 const current=highwaySetup({prepare,countRoutes:true}),prior=highwaySetup({prepare,countRoutes:true,oldEndpoint:true});
 assert.equal(roadSearch(current,{p:{x:-14,z:0}}),null);assert.equal(roadSearch(prior,{p:{x:-14,z:0}}),null);
 assert.equal(current.count.land,0);assert.equal(prior.count.land,12);
 assert.deepEqual(current.json('count.targets'),prior.json('count.targets'));assert.deepEqual(current.json('count.targets.map(q=>q.road)'),Array.from({length:12},(_,i)=>i));
 assert.equal(current.count.targets.length,12);assert.equal(current.run('W.roads.length===13&&W.projects.length===0&&field.title.work.owner===houseAcct(0)'),true);
 assert.deepEqual(current.json('field.title'),prior.json('field.title'));
});

test('rotated standing footprints and native churchyards use the actual index while uncertain or unsafe point geometry keeps native search',()=>{
 const r=highwaySetup({prepare:`const b={x:0,z:0,w:4,d:8,rot:Math.PI/4,state:'sound',arch:'churchyard'};s.buildings.push(b);s._lay.placed.add(b,8);`});
 r.run(`var p={x:20,z:0},corridor=abbeyCorridorReady(s,abbeyApproachSurvey(s),'crown',undefined,0,terrain),endpointBlocked=${endpointPredicate};
  const rotated={x:3*Math.cos(b.rot),z:-3*Math.sin(b.rot)};`);
 assert.equal(r.run('!!armyObstacle(walker(),rotated.x,rotated.z)'),false,'churchyards are deliberately outside the original point obstacle test');
 assert.equal(r.run('endpointBlocked(rotated)'),true);assert.equal(r.run('streetFootprintOverlap(b,{a:rotated,b:rotated,hw:1.3},.3)'),true);
 assert.equal(r.run('endpointBlocked({x:10,z:10})'),false);
 r.run('b.rot=0;');
 for(const expression of ['{x:3.6,z:0}','{x:3.6-.5e-6,z:0}','{x:NaN,z:0}','{x:Infinity,z:0}','{x:1e10,z:0}'])assert.equal(r.run(`endpointBlocked(${expression})`),false,expression);
 assert.equal(r.run('endpointBlocked({x:3.6-2e-6,z:0})'),true);
 for(const mutation of ['b.x=NaN;','b.w=-4;','b.d=Infinity;','b.rot=NaN;','b.x="0";','b.w=1e10;']){
  r.run('Object.assign(b,{x:0,z:0,w:4,d:8,rot:0});'+mutation);
  assert.equal(r.run('endpointBlocked({x:0,z:0})'),false,mutation);
 }
 r.run('Object.assign(b,{x:0,z:0,w:4,d:8,rot:0});p={x:0,z:0};');assert.equal(r.run('endpointBlocked(p)'),false,'zero-length corridors keep their native early return');
});

test('the native nearly-parallel boundary exception and zero-length endpoint retain the original accepted path',()=>{
 const prepare=`const b={x:0,z:0,w:4,d:8,rot:0,state:'sound',arch:'house'};s.buildings.push(b);s._lay.placed.add(b,8);
  W.roads.push({a:0,b:1,path:[{x:3.6,z:-1},{x:3.6,z:1}]});`;
 for(const p of [{x:3.6000000005,z:0},{x:3.6,z:0}]){
  const current=highwaySetup({prepare,countRoutes:true}),prior=highwaySetup({prepare,countRoutes:true,oldEndpoint:true});
  assert.deepEqual(roadSearch(current,{p}),roadSearch(prior,{p}));assert.ok(current.run('roadAnswer'));
  assert.deepEqual(nativeRoadIdentity(current),nativeRoadIdentity(prior));assert.equal(current.count.land,1);assert.equal(prior.count.land,1);
  assert.equal(current.run('streetFootprintOverlap(b,{a:{x:3.6,z:0},b:{x:3.6,z:0},hw:1.3},.3)'),true);
  if(p.x!==3.6)assert.equal(current.run('streetFootprintOverlap(b,{a:roadInput.p,b:{x:3.6,z:0},hw:1.3},.3)'),false,'the actual native <1e-9 parallel branch tests the outside start');
 }
});
