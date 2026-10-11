// Retained native geometry only: no generated world, completed castle or invented payment.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {parse} from './vendor/acorn/acorn.mjs';
import {inlineGameScript} from './simulation-boundary.mjs';

const source=inlineGameScript(fs.readFileSync(process.env.FURLONG_TEST_SOURCE||new URL('../index.html',import.meta.url),'utf8'));
const ast=parse(source,{ecmaVersion:'latest'}),functions=new Map(),variables=new Map();
for(const n of ast.body){if(n.type==='FunctionDeclaration')functions.set(n.id.name,n);else if(n.type==='VariableDeclaration')for(const d of n.declarations)if(d.id.type==='Identifier')variables.set(d.id.name,{kind:n.kind,node:d});}
const fn=n=>{const d=functions.get(n);assert.ok(d,'native '+n);return source.slice(d.start,d.end);};
const constant=n=>{const d=variables.get(n);assert.ok(d,'native '+n);return d.kind+' '+source.slice(d.node.start,d.node.end)+';';};
const native=n=>functions.has(n)?fn(n):constant(n);
const layout=functions.get('layoutSettlement'),live=layout.body.body.flatMap(n=>n.type==='VariableDeclaration'?n.declarations:[]).find(d=>d.id.name==='liveOps');
const planSite=live.init.properties.find(p=>p.key.name==='planSite');assert.ok(planSite.method);
const names=['projectReservationPublic','projectReservationPolys','projectReservationSetback','projectSiteReserved','compoundPolys','compoundPolygonDifference','obbCorners','wallRadAt','streetFootprintOverlap','inPolyXZ','graveyardPolygonsOverlap','segDist','segSegDist','dist2d','lerp','clamp','serviceDoor','locW','castleFoundationReserved','abbeySurveyBounds','abbeySurveyBoxesMayHit','abbeySurveyUnion','abbeySurveyIndexRange','abbeySurveyIndex','abbeySurveyIndexRows','abbeySurveyReserved','abbeyPublicStreet','abbeyAccessEndpointValid','abbeyApproachSurveyNative','abbeyRouteSurveyNative','abbeyRouteTerrain','abbeyApproachSurvey','abbeyApproachClear','institutionFoundationPath','storageGroundClaim','roadProjectValidate','day'];
function setup({cold=false}={}){
 const C=vm.createContext(),run=s=>vm.runInContext(s,C),json=s=>JSON.parse(run('JSON.stringify('+s+')'));
 run(`const SIZE=640,CELL=40;const s={owner:0,pos:{x:0,z:0},radius:80,buildings:[],streets:[],places:[],_lay:{placed:{near:()=>[]}}},t={owner:0,pos:{x:200,z:0},buildings:[],streets:[],_lay:{placed:{near:()=>[]}}};
 const W={clock:{day:1},settlements:[s,t],projects:[],roads:[],houses:[]};
 const street={kind:'lane',hw:4,pts:[{x:0,z:0},{x:0,z:40}]};s.streets.push(street);
 const abbey={type:'compound',adapter:'abbey',si:0,dead:false,site:{accessMode:'abbey-rural',f:{x:20,z:-12,w:8,d:22,rot:0},path:[{x:20,z:-1},{x:20,z:.2},{x:20,z:1},{x:20,z:10},{x:0,z:10}],access:{endpoint:{kind:'street',ref:0,segment:1,point:{x:0,z:10}}}}};abbey.site.access.pathKey=JSON.stringify(abbey.site.path);
 const join={type:'plan',kind:'street',si:0,dead:false,site:{path:[{x:0,z:2},{x:0,z:18}],pathWidth:2},st:{pts:[{x:0,z:2},{x:0,z:18}],hw:1}};
 const streetAccessAt=()=>true,armyObstacle=()=>false,armySegmentClear=()=>true,houseAtWar=()=>false;
 const HW=2,laneBlockers=()=>[],planCellOK=()=>true,riverAt=()=>false,lakeAt=()=>false,liveB=()=>s.buildings;
 `);
 run(names.map(native).join('\n'));
 run(`const liveOps={${source.slice(planSite.start,planSite.end)}};s._lay.live=liveOps;`);
 if(!cold)run(['ABBEY_APPROACH_SURVEY_CURRENT','ABBEY_APPROACH_SURVEY_NATIVE','PROJECT_RESERVATION_BOUNDS_NATIVE'].map(constant).join('\n'));
 return{run,json};
}

test('a pending street may join an Abbey approach wholly inside the actual current public segment, in either order',()=>{
 for(const cold of[false,true]){const r=setup({cold});r.run('W.projects=[abbey]');assert.equal(r.run('projectSiteReserved(s,join)'),false);assert.equal(r.run("s._lay.live.planSite(join,'validate')===join"),true);
  r.run("join.type='road';join.ai=0;join.bi=1;join.payer=0;join.P={path:join.site.path};");assert.equal(r.run('roadProjectValidate(join).ok'),true);r.run("join.type='plan';");
  r.run('W.projects=[join,abbey]');assert.equal(r.run('abbeyApproachClear(s,abbey.site,abbey)'),true);assert.equal(r.run('projectSiteReserved(s,join)'),false);
  r.run('W.projects=[abbey,join]');assert.equal(r.run('abbeyApproachClear(s,abbey.site,abbey)'),true);
 }
});

test('a later street, highway, square or wall cannot take a pending private footprint or approach',()=>{
 for(const kind of['street','road','square','wall'])for(const footprint of[false,true]){const r=setup();r.run(`W.projects=[abbey];join.kind='${kind}';join.type='${kind==='road'?'road':'plan'}';join.site=${footprint?"{path:[{x:16,z:-12},{x:24,z:-12}],pathWidth:2}":"{path:[{x:14,z:5},{x:26,z:5}],pathWidth:2}"};`);
  assert.equal(r.run('projectSiteReserved(s,join)'),true,kind+' '+footprint);
  if(kind==='road'){r.run('join.ai=0;join.bi=1;join.payer=0;join.P={path:join.site.path};');assert.equal(r.run('roadProjectValidate(join).reason'),'site-obstructed');}
  else{if(kind==='square')r.run('join.site={poly:obbCorners(20,5,4,4,0)};');else r.run('join.st={pts:join.site.path,hw:1};');assert.equal(r.run("s._lay.live.planSite(join,'validate')"),null);}
 }
});

test('Abbey validation reciprocally refuses private pending street and structural interference',()=>{
 for(const cold of[false,true])for(const structural of[false,true]){const r=setup({cold});r.run(`join.site=${structural?"{f:{x:20,z:5,w:4,d:4,rot:0}}":"{path:[{x:14,z:5},{x:26,z:5}],pathWidth:2}"};W.projects=[abbey,join];`);assert.equal(r.run('abbeyApproachClear(s,abbey.site,abbey)'),false);}
 const r=setup();r.run('join.site.f={x:0,z:10,w:2,d:2,rot:0};W.projects=[join,abbey];');assert.equal(r.run('abbeyApproachClear(s,abbey.site,abbey)'),false,'a building on public ground receives no road exemption');
});

test('a parallel private road inside the native fit setback is refused even without raw corridor overlap',()=>{
 for(const cold of[false,true])for(const building of[false,true]){const r=setup({cold});r.run(`join.site={path:${building?'[{x:25,z:-18},{x:25,z:-6}]':'[{x:23,z:3},{x:23,z:8}]'},pathWidth:1};W.projects=[abbey,join];`);
  assert.equal(r.run('compoundPolys(join.site).some(P=>compoundPolys(abbey.site).some(Q=>graveyardPolygonsOverlap(P,Q)))'),false,'the actual retained land bands do not overlap');
  assert.equal(r.run('projectSiteReserved(s,join)'),true,'the same 2m native fit margin rejects the new private works');
  if(building)assert.equal(r.run('castleFoundationReserved(s,abbey.site.f,abbey)'),true);
  else assert.equal(r.run('abbeyApproachClear(s,abbey.site,abbey)'),false);
 }
});

test('planned, hidden, stopped, unpaid proposed or dead ground cannot exempt a join',()=>{
 for(const mutation of['street.hidden=true','street.planQ=true','street.planned=1200','street.gone=true','street.dead=true','s.streets=[]']){const r=setup();r.run(mutation+';W.projects=[abbey,join];');assert.equal(r.run('projectReservationPublic(s,abbey.site).length'),0,mutation);assert.equal(r.run('projectSiteReserved(s,join)'),true,mutation);assert.equal(r.run('abbeyApproachClear(s,abbey.site,abbey)'),false,mutation);}
 for(const flag of['dead','gone','hidden','planQ','planned']){const r=setup();r.run(`W.roads=[{a:0,b:1,path:street.pts,${flag}:true}];abbey.site.access.endpoint.kind='road';W.projects=[abbey,join];`);assert.equal(r.run('projectReservationPublic(s,abbey.site).length'),0,flag);assert.equal(r.run('projectSiteReserved(s,join)'),true,flag);}
 const r=setup();r.run("s.streets=[];abbey.site.access.endpoint.kind='road';join.type='road';join.ai=0;join.bi=1;join.P={path:street.pts};W.projects=[join,abbey];");assert.equal(r.run('projectReservationPublic(s,abbey.site).length'),0,'a pending road is not an existing W.roads segment');
});

test('a current registered highway segment permits a genuine public join and self-projects never block themselves',()=>{
 const r=setup();r.run("W.roads=[{a:0,b:1,path:street.pts}];abbey.site.access.endpoint.kind='road';W.projects=[abbey,join];");assert.equal(r.run('projectSiteReserved(s,join)'),false);assert.equal(r.run('abbeyApproachClear(s,abbey.site,abbey)'),true);
 r.run('W.projects=[join]');assert.equal(r.run('projectSiteReserved(s,join)'),false);r.run('W.projects=[abbey]');assert.equal(r.run('abbeyApproachClear(s,abbey.site,abbey)'),true);
 r.run('abbey.dead=true;W.projects=[abbey,join]');assert.equal(r.run('projectSiteReserved(s,join)'),false);
});

test('the day602 wider street endpoint wedge stays private and is refused by native exact geometry',()=>{
 const r=setup();r.run(`street.hw=1.872;street.pts=[{x:2384.1067429764003,z:-370.6389763544824},{x:2389.3764913813147,z:-364.6198608247837}];abbey.site.f={x:2520.2203485673163,z:-278.79925927582104,w:12,d:22,rot:-3.9269908169872414};abbey.site.path=[{x:2392,z:-364},{x:2389.3764913813147,z:-364.6198608247837}];abbey.site.access.endpoint.point={...abbey.site.path.at(-1)};join.site={path:[{x:2384.1757998154426,z:-364.8050834354628},{x:2389.3764913813147,z:-364.6198608247837}],pathWidth:4.8};W.projects=[abbey,join];`);
 assert.equal(r.run('projectReservationPublic(s,abbey.site).length'),1);assert.equal(r.run('projectSiteReserved(s,join)'),true,'the existing endpoint cap does not license the wider nonpublic triangle');
});

test('reservation reads do not write native project, money, geometry or RNG state',()=>{
 const r=setup();r.run('W.treasury=91;W.randomState={gen:[1,2,3,4],sim:[5,6,7,8]};W.projects=[abbey,join];const before=JSON.stringify(W);projectSiteReserved(s,join);abbeyApproachClear(s,abbey.site,abbey);');assert.equal(r.run('JSON.stringify(W)===before'),true);
});

test('connector clipping is reused only within one local query and structures retain the original polygon path',()=>{
 const r=setup();r.run('const publicPolys=projectReservationPublic(s,abbey.site),joins=new Map(),first=projectReservationPolys(join,publicPolys,joins),second=projectReservationPolys(join,publicPolys,joins);');assert.equal(r.run('first===second&&joins.size===1'),true);
 r.run('projectReservationPolys(abbey,publicPolys,joins);');assert.equal(r.run('joins.size'),1,'compound footprints never enter the connector cache');
 r.run('join.site.path[0].x=20;const next=projectReservationPolys(join,publicPolys,new Map());');assert.equal(r.run('next===first'),false);assert.ok(r.run('next.length>0'),'the next query sees the changed private path');assert.equal(r.run('Object.hasOwn(W,"joins")||Object.hasOwn(join,"joins")||Object.hasOwn(abbey.site,"joins")'),false);
});

test('new endpoint and polygon readers are covered by both native approach and route identity certificates',()=>{
 for(const name of['projectReservationPublic','projectReservationPolys']){const approach=variables.get('ABBEY_APPROACH_SURVEY_CURRENT').node.init.body.properties.map(p=>p.key.name),route=variables.get('ABBEY_ROUTE_SURVEY_NATIVE').node.init.arguments[0].properties.map(p=>p.key.name);assert.ok(approach.includes(name));assert.ok(route.includes(name));
  const r=setup();assert.equal(r.run('abbeyApproachSurveyNative()'),true);r.run(`const original=${name};${name}=(...args)=>original(...args);`);assert.equal(r.run('abbeyApproachSurveyNative()'),false,'a replaced reader forces the cold approach path');
 }
});

// Frozen production body from 542ca74: the new broad phase is compared against
// the original ordered exact query, not a second bounded implementation.
const frozenReserved=`function frozenProjectSiteReserved(s,q){
  const candidate=projectReservationPolys(q);for(const p of W.projects||[])if(p!==q&&!p.dead&&p.site){const town=W.settlements[p.si]||s,publicPolys=projectReservationPublic(town,p.site),solid=compoundPolys(p.site.ward?{...p.site,ring:p.site.ward,path:null,paths:null}:{...p.site,path:null,paths:null});
    if(candidate.some(P=>solid.some(Q=>graveyardPolygonsOverlap(P,Q))))return true;
    const paths=p.type==='compound'&&p.adapter==='abbey'&&p.site.accessMode==='abbey-rural'?projectReservationSetback(p.site):compoundPolys({path:p.site.path,paths:p.site.paths,pathWidth:p.site.pathWidth}),C=publicPolys.length?projectReservationPolys(q,publicPolys):candidate;if(C.some(P=>paths.some(Q=>graveyardPolygonsOverlap(P,Q))))return true;
  }return false;
}`;
function pair(code,{cold=false,readonly=true}={}){
 const results=[];for(const current of[false,true]){const r=setup({cold});r.run(frozenReserved);r.run(code);const before=r.json('W');
  let value,error;try{value=r.run((current?'projectSiteReserved':'frozenProjectSiteReserved')+'(s,join)');}catch(e){error={name:e.name,message:e.message};}
  results.push({r,value,error});if(readonly)assert.deepEqual(r.json('W'),before,'reservation query leaves the complete supplied world and RNG untouched');}
 assert.equal(results[1].value,results[0].value);assert.deepEqual(results[1].error,results[0].error);assert.deepEqual(results[1].r.json('W'),results[0].r.json('W'));return results;
}

test('native and cold bounds retain exact containment, crossing, touching and strict edge-distance boundaries',()=>{
 const shapes=[
  ['obbCorners(0,0,8,8,0)','obbCorners(0,0,2,2,0)',true],
  ['obbCorners(0,0,2,2,0)','obbCorners(0,0,8,8,0)',true],
  ['obbCorners(0,0,1,20,Math.PI/4)','obbCorners(0,0,1,20,-Math.PI/4)',true],
  ['obbCorners(0,0,2,2,0)','obbCorners(2,0,2,2,0)',true],
  ['obbCorners(0,0,2,2,0)','obbCorners(2000,2000,2,2,0)',false],
 ];
 for(const gap of[.009,.01,.0100001,.010001,.011])shapes.push([
  '[{x:-1,z:-1},{x:0,z:-1},{x:0,z:1},{x:-1,z:1}]',
  `[{x:${gap},z:-1},{x:${1+gap},z:-1},{x:${1+gap},z:1},{x:${gap},z:1}]`,gap<.01]);
 for(const cold of[false,true])for(const[A,B,expected]of shapes){const P=pair(`join.kind='square';join.site={poly:${A}};const other={type:'plan',kind:'square',si:1,site:{poly:${B}}};W.projects=[join,other];W.treasury=17;W.randomState={gen:[1,2,3,4],sim:[9,8,7,6]};`,{cold});assert.equal(P[1].value,expected,A+' / '+B);}
});

test('far native pending footprints skip exact edge work while retaining every world field',()=>{
 const P=pair(`join.kind='square';join.site={poly:obbCorners(0,0,10,10,0)};
  W.projects=[join,...Array.from({length:32},(_,k)=>({type:'plan',kind:'square',si:k%2,site:{poly:obbCorners(2000+k*20,2000,10,10,0)}}))];
  let hypotCalls=0;const originalHypot=Math.hypot;Math.hypot=(...args)=>{hypotCalls++;return originalHypot(...args);};`);
 assert.equal(P[1].value,false);assert.ok(P[0].r.run('hypotCalls')>=32*16*4,'the frozen query performs the actual segment-distance work');
 assert.equal(P[1].r.run('hypotCalls'),0,'only conservatively disjoint pairs are removed');
 assert.equal(P[1].r.run('Object.isFrozen(PROJECT_RESERVATION_BOUNDS_NATIVE)'),true);
});

test('nonfinite, large, degenerate, accessor and custom-array polygons retain the original exact query and read prefix',()=>{
 const shapes=[
  'obbCorners(2000000,2000000,4,4,0)',
  '[{x:0,z:0},{x:1,z:1},{x:2,z:2}]',
  '[{x:0,z:0},{x:0,z:0},{x:0,z:0}]',
  '[{x:NaN,z:0},{x:1,z:0},{x:1,z:1}]',
  '[{x:Infinity,z:0},{x:1,z:0},{x:1,z:1}]',
  '(()=>{const P=obbCorners(2000,2000,4,4,0);Object.defineProperty(P[0],"x",{get(){reads.push("x");return 1998;}});return P;})()',
  '(()=>{const P=obbCorners(2000,2000,4,4,0);Object.defineProperty(P,1,{get(){reads.push("index");return{x:1998,z:2002};}});return P;})()',
  '(()=>{const P=obbCorners(2000,2000,4,4,0),some=P.some;P.some=function(...args){reads.push("some");return some.apply(this,args);};return P;})()',
  '(()=>{const P=obbCorners(2000,2000,4,4,0);P[Symbol.iterator]=function*(){reads.push("iterator");yield*Array.prototype[Symbol.iterator].call(this);};return P;})()',
  '(()=>{class OtherArray extends Array{};return OtherArray.from(obbCorners(2000,2000,4,4,0));})()',
 ];
 for(const shape of shapes){const P=pair(`let reads=[],hypotCalls=0;const originalHypot=Math.hypot;Math.hypot=(...args)=>{hypotCalls++;return originalHypot(...args);};join.kind='square';join.site={poly:${shape}};W.projects=[join,{type:'plan',kind:'square',si:1,site:{poly:obbCorners(0,0,2,2,0)}}];`);
  assert.deepEqual(P[1].r.json('reads'),P[0].r.json('reads'),shape);assert.equal(P[1].r.run('hypotCalls'),P[0].r.run('hypotCalls'),shape);}
});

test('replaced geometry or overlap readers force the frozen ordered predicate path',()=>{
 for(const name of['projectReservationPublic','projectReservationPolys','projectReservationSetback','compoundPolys','compoundPolygonDifference','obbCorners','wallRadAt','graveyardPolygonsOverlap','inPolyXZ','segSegDist','segDist','abbeySurveyBounds','abbeySurveyBoxesMayHit']){
  const P=pair(`let helperCalls=0,hypotCalls=0;const originalHypot=Math.hypot;Math.hypot=(...args)=>{hypotCalls++;return originalHypot(...args);};const original=${name};${name}=(...args)=>{helperCalls++;return original(...args);};join.kind='square';join.site={poly:obbCorners(2000,2000,4,4,0)};W.projects=[join,{type:'plan',kind:'square',si:1,site:{poly:obbCorners(0,0,2,2,0)}}];`);
  assert.equal(P[1].r.run('helperCalls'),P[0].r.run('helperCalls'),name);assert.equal(P[1].r.run('hypotCalls'),P[0].r.run('hypotCalls'),name);
 }
 const P=pair(`abbeySurveyBoxesMayHit=()=>false;join.kind='square';join.site={poly:obbCorners(0,0,2,2,0)};W.projects=[join,{type:'plan',kind:'square',si:1,site:{poly:obbCorners(0,0,2,2,0)}}];`);assert.equal(P[1].value,true,'a foreign bounds callback cannot manufacture clearance');
});

test('endpoint and public-clipping read order precedes bounds and is retained across native and cold calls',()=>{
 const P=pair(`let reads=[];const originalEndpoint=abbeyAccessEndpointValid;abbeyAccessEndpointValid=(...args)=>{reads.push('endpoint');return originalEndpoint(...args);};
  W.projects=[abbey,join];`);
 assert.equal(P[1].value,false);assert.deepEqual(P[1].r.json('reads'),P[0].r.json('reads'));assert.ok(P[1].r.run('reads.length')>0);
 for(const cold of[false,true]){const R=pair(`street.hw=1.872;street.pts=[{x:2384.1067429764003,z:-370.6389763544824},{x:2389.3764913813147,z:-364.6198608247837}];abbey.site.f={x:2520.2203485673163,z:-278.79925927582104,w:12,d:22,rot:-3.9269908169872414};abbey.site.path=[{x:2392,z:-364},{x:2389.3764913813147,z:-364.6198608247837}];abbey.site.access.endpoint.point={...abbey.site.path.at(-1)};join.site={path:[{x:2384.1757998154426,z:-364.8050834354628},{x:2389.3764913813147,z:-364.6198608247837}],pathWidth:4.8};W.projects=[abbey,join];`,{cold});assert.equal(R[1].value,true,'the day602 private endpoint wedge is still refused');}
});

test('separate queries see changed geometry and no bounds scratch enters the world, project or site',()=>{
 const r=setup();r.run("W.projects=[abbey,join];W.randomState={gen:[1,2],sim:[3,4]};");assert.equal(r.run('projectSiteReserved(s,join)'),false);
 r.run('join.site={f:{x:20,z:5,w:2,d:2,rot:0}};');const before=r.json('W');assert.equal(r.run('projectSiteReserved(s,join)'),true);assert.deepEqual(r.json('W'),before);
 assert.equal(r.run('Object.hasOwn(W,"bounds")||Object.hasOwn(join,"bounds")||Object.hasOwn(join.site,"bounds")'),false);
});

test('an intervening required endpoint read cannot reuse earlier polygon coordinates',()=>{
 const P=pair(`join.kind='square';join.site={poly:obbCorners(0,0,2,2,0)};let endpointReads=0;
  const first={type:'plan',kind:'square',si:1,site:{poly:obbCorners(5000,5000,2,2,0)}},last={type:'plan',kind:'square',si:1,site:{poly:obbCorners(2000,2000,2,2,0)}};
  Object.defineProperty(last.site,'access',{get(){endpointReads++;for(const p of join.site.poly){p.x+=2000;p.z+=2000;}return undefined;}});
  W.projects=[first,last,join];`,{readonly:false});
 assert.equal(P[1].value,true);assert.equal(P[1].r.run('endpointReads'),1);assert.equal(P[1].r.run('endpointReads'),P[0].r.run('endpointReads'));
});
