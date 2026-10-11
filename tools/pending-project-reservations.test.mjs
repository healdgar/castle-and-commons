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
const names=['projectReservationPublic','projectReservationPolys','projectReservationSetback','projectSiteReserved','compoundPolys','compoundPolygonDifference','obbCorners','streetFootprintOverlap','inPolyXZ','graveyardPolygonsOverlap','segDist','segSegDist','dist2d','lerp','clamp','serviceDoor','locW','castleFoundationReserved','abbeySurveyBounds','abbeySurveyBoxesMayHit','abbeySurveyUnion','abbeySurveyIndexRange','abbeySurveyIndex','abbeySurveyIndexRows','abbeySurveyReserved','abbeyPublicStreet','abbeyAccessEndpointValid','abbeyApproachSurveyNative','abbeyRouteSurveyNative','abbeyRouteTerrain','abbeyApproachSurvey','abbeyApproachClear','institutionFoundationPath','storageGroundClaim','roadProjectValidate','day'];
function setup({cold=false}={}){
 const C=vm.createContext(),run=s=>vm.runInContext(s,C),json=s=>JSON.parse(run('JSON.stringify('+s+')'));
 run(`const SIZE=640,CELL=40;const s={owner:0,pos:{x:0,z:0},radius:80,buildings:[],streets:[],places:[],_lay:{placed:{near:()=>[]}}},t={owner:0,pos:{x:200,z:0},buildings:[],streets:[],_lay:{placed:{near:()=>[]}}};
 const W={clock:{day:1},settlements:[s,t],projects:[],roads:[],houses:[]};
 const street={kind:'lane',hw:4,pts:[{x:0,z:0},{x:0,z:40}]};s.streets.push(street);
 const abbey={type:'compound',adapter:'abbey',si:0,dead:false,site:{accessMode:'abbey-rural',f:{x:20,z:-12,w:8,d:22,rot:0},path:[{x:20,z:-1},{x:20,z:.2},{x:20,z:1},{x:20,z:10},{x:0,z:10}],access:{endpoint:{kind:'street',ref:0,segment:1,point:{x:0,z:10}}}}};abbey.site.access.pathKey=JSON.stringify(abbey.site.path);
 const join={type:'plan',kind:'street',si:0,dead:false,site:{path:[{x:0,z:2},{x:0,z:18}],pathWidth:2},st:{pts:[{x:0,z:2},{x:0,z:18}],hw:1}};
 const streetAccessAt=()=>true,armyObstacle=()=>false,armySegmentClear=()=>true,wallRadAt=()=>40,houseAtWar=()=>false;
 const HW=2,laneBlockers=()=>[],planCellOK=()=>true,riverAt=()=>false,lakeAt=()=>false,liveB=()=>s.buildings;
 `);
 run(names.map(native).join('\n'));
 run(`const liveOps={${source.slice(planSite.start,planSite.end)}};s._lay.live=liveOps;`);
 if(!cold)run(['ABBEY_APPROACH_SURVEY_CURRENT','ABBEY_APPROACH_SURVEY_NATIVE'].map(constant).join('\n'));
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
