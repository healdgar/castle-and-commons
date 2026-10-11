// Native opening loop, lot builder, footprint checks and walking graph on a dry
// plane. No realm is generated or advanced, and capacity comes only from capOf.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html=fs.readFileSync(process.env.FURLONG_TEST_SOURCE||new URL('../index.html',import.meta.url),'utf8');
const fn=n=>{const m=html.match(new RegExp('^function '+n+'\\b[\\s\\S]*?(?=^function |^const |^let |^/\\*|$(?![\\s\\S]))','m'));assert.ok(m,n);return m[0];};
const cut=(a,b)=>{const i=html.indexOf(a),j=html.indexOf(b,i);assert.ok(i>=0&&j>i,a);return html.slice(i,j);};
const source=cut('const ARCH={','const TIERNAME=')+html.match(/^const RESID=.*$/m)[0]+'\n'+[
  'obbCorners','obbOverlap','groundBuilding','streetFootprintOverlap','roadAccessClear',
  'lerpPt','resample','frontFoot','capOf','streetGraph','streetAccessAt','frontageAccess',
].map(fn).join('\n')+'\n'+[
  cut('  const laneBlockers=','  const STANDS='),
  cut('  const wallSide=','  const registerYard='),
  cut('  function place(','  const unplace='),
  cut('  const home=','  const tradeScores='),
  cut('  const tierFor=','  const fill='),
  cut('  const buildLot=','  /* ---- back lanes:'),
  cut('  const completeResidential=','  if(!saved)s.growSlots=queue();'),
].join('\n');

function setup(){const C=vm.createContext({});vm.runInContext(`
  const C={x:0,z:0},publicStreet={kind:'road',hw:2.34,pts:[{x:-35,z:0},{x:0,z:0},{x:35,z:0}]},
    lane={kind:'lane',hw:2.34,hidden:true,pts:[{x:0,z:0},{x:0,z:8},{x:0,z:16},{x:0,z:24},{x:0,z:32},{x:0,z:40}]},
    unrelated={kind:'lane',hw:2.34,hidden:true,pts:[{x:25,z:0},{x:25,z:-20},{x:25,z:-40}]},
    s={pos:C,streets:[publicStreet,lane,unrelated],buildings:[],places:[],remnants:[],burns:[]},
    W={roads:[],settlements:[s],bldList:[]},G={roadsDirty:false,buildingsDirty:false},
    VACANT_RESIDENTIALS=new WeakMap(),HOME=new Set(['house','longhouse','burgher']),
    saved=null,focus=null,oldVil=null,isVil=false,era=1350,curE=5,Rmax=620,RHW=4;
  let wet=false,fort=false,terrain=false,reserved=false;
  const dist2d=(x,z,a,b)=>Math.hypot(x-a,z-b),clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),
    lerp=(a,b,t)=>a+(b-a)*t,AD=()=>1350,rr=()=>.5,burnAt=()=>null;
  const hAt=()=>7.259,SEA_SURFACE=.5,lakeAt=()=>wet,riverAt=()=>null,
    paidRoadAt=()=>false,fortRoadBlocked=()=>fort,cellOK=()=>!terrain,buildable=()=>!terrain,
    inPlace=()=>false,castleFoundationReserved=()=>reserved,
    fortCircuits=()=>[],fortStreetRuns=(s,st)=>[st.pts],streetGraphFortContext=()=>null;
  const placed={near:()=>s.buildings,add(){}},segH={near:()=>s.streets.filter(st=>!st.gone).flatMap(st=>st.pts.slice(1).map((b,k)=>({a:st.pts[k],b,st,hw:st.hw})))},
    craftMintRoomsDirty=()=>{},reserveChurchyard=()=>null,updateBuildingInstance=()=>{},
    seedMarketStreet=()=>false,extend=()=>false,stitchRoads=()=>{},queue=()=>[];
  s.growSlots=[{mx:0,mz:24,ux:0,uz:1,side:1,hw:lane.hw,st:lane,d:24,j:0}];
  `+source,C);return{C,run:q=>vm.runInContext(q,C)};}

test('a successful native opening home opens only its actual clear lane and walking graph',()=>{
  const r=setup();assert.equal(r.run('streetGraph(s).N.some(n=>n.st===lane)'),false);
  r.run('completeResidential(1)');
  const b=r.run('s.buildings[0]');assert.ok(b);assert.equal(b.state,'sound');assert.equal(b.st,r.run('lane'));
  assert.equal(r.run('W.bldList[0]'),b);assert.equal(r.run('lane.hidden'),false);assert.equal(r.run('G.roadsDirty'),true);
  assert.equal(r.run('unrelated.hidden'),true);assert.equal(r.run('s.streets.length'),3);
  assert.equal(r.run('streetGraph(s).N.some(n=>n.st===lane&&n.access)'),true);
  assert.equal(r.run('streetAccessAt(s,{x:0,z:32})'),true);
  assert.equal(r.run('lane.pts.some((p,k)=>k&&streetFootprintOverlap(s.buildings[0],{a:lane.pts[k-1],b:p,hw:lane.hw}))'),false);
});

test('native lot refusals leave both prospective lanes hidden and add no home',()=>{
  for(const edit of ['terrain=true','wet=true','fort=true','reserved=true',
    'publicStreet.hidden=true',
    's.buildings.push({x:-9.74,z:24,w:18,d:18,rot:0,arch:"keep",state:"sound"})']){
    const r=setup();r.run(edit);const before=r.run('s.buildings.length');r.run('completeResidential(1)');
    assert.equal(r.run('s.buildings.length'),before,edit);assert.equal(r.run('W.bldList.length'),0,edit);
    assert.equal(r.run('lane.hidden'),true,edit);assert.equal(r.run('unrelated.hidden'),true,edit);
    assert.equal(r.run('G.roadsDirty'),false,edit);
  }
});

test('a remote standing footprint across the hidden lane refuses opening before a clear local lot builds',()=>{
  const r=setup();r.run('s.buildings.push({x:0,z:38,w:4,d:4,rot:0,arch:"keep",state:"sound"})');
  assert.equal(r.run('buildLot(s.growSlots[0],tierFor(s.growSlots[0],curE),true,"survey")!==null'),true,
    'the local home fits; the remote occupied lane is the reason to refuse it');
  r.run('completeResidential(1)');assert.equal(r.run('s.buildings.length'),1);assert.equal(r.run('W.bldList.length'),0);
  assert.equal(r.run('lane.hidden'),true);assert.equal(r.run('unrelated.hidden'),true);
});
