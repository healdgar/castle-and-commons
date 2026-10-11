// Controlled opening titles/terrain, using the actual shared layout, placement,
// paid materials/work, current titles and retained routes. No generated world or heavy run.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {parse} from './vendor/acorn/acorn.mjs';
import {inlineGameScript} from './simulation-boundary.mjs';
import {realm,near} from './ownership-fixture.mjs';
const source=inlineGameScript(fs.readFileSync(process.env.FURLONG_TEST_SOURCE||new URL('../index.html',import.meta.url),'utf8')),ast=parse(source,{ecmaVersion:'latest'}),F=new Map(),V=new Map();
for(const n of ast.body)if(n.type==='FunctionDeclaration')F.set(n.id.name,n);else if(n.type==='VariableDeclaration')for(const d of n.declarations)if(d.id.type==='Identifier')V.set(d.id.name,{kind:n.kind,node:d});
const fn=n=>{const d=F.get(n);assert.ok(d,'native '+n);return source.slice(d.start,d.end);},constant=n=>{const d=V.get(n);assert.ok(d,'native '+n);return d.kind+' '+source.slice(d.node.start,d.node.end)+';';},native=n=>F.has(n)?fn(n):constant(n);
const layout=F.get('layoutSettlement'),LV=new Map(),LF=new Map();for(const n of layout.body.body)if(n.type==='VariableDeclaration')for(const d of n.declarations)if(d.id.type==='Identifier')LV.set(d.id.name,{kind:n.kind,node:d});else{}else if(n.type==='FunctionDeclaration')LF.set(n.id.name,n);
const local=n=>{const d=LV.get(n);assert.ok(d,'native local '+n);return d.kind+' '+source.slice(d.node.start,d.node.end)+';';},localFn=n=>{const d=LF.get(n);assert.ok(d);return source.slice(d.start,d.end);};
const methods=LV.get('liveOps').node.init.properties.filter(p=>['compoundSite','fabricSite'].includes(p.key.name));
const names=['corpFound','compoundEnsure','compoundOf','compoundCourtGeometry','compoundPointObstacle','compoundStructureOverlap','compoundBuilding','compoundOwnerAccount','compoundBuildingOwned','compoundLayoutPoses','compoundLayoutRoute','compoundConnectionValid','compoundConnectionClear','compoundConnectionRouteClear','compoundConnectionPlan','compoundCourtStreetCompatible','compoundBindConnection','compoundConnectionRecipe','compoundBindBuilding','compoundHas','compoundComponentPresent','compoundCircuit','compoundPolys','compoundGround','compoundProjectPayer','purseAcct','compoundProjectValidate','compoundProjectCommission','compoundProjectTick','constructionProjectMaterials','constructionProjectPaidWork','constructionRecipe','buildWorks','payAmong','workers_','groundBuilding','obbCorners','obbOverlap','serviceDoor','streetFootprintOverlap','inPolyXZ','inPoly','graveyardPolygonsOverlap','segDist','segSegDist','polyLen','locW','lerp','armyObstacle','armySegmentClear','hAt','makeHash','occupiedGroundBoxMayHit','occupiedGroundCells','occupiedGroundFields','occupiedGroundAreas','computeFurlongPoly','markOccupiedGround','markSettlementBuilt','markBuilt','abbeyField','abbeyBuildingGround','abbeyGroundOwned','abbeyCompoundValidate','abbeyCompoundComplete','abbeyBuildings','abbeyPeople','abbeyLay','abbeyCapacity','abbeyConnectedSpec','abbeyConnectedAnchor','abbeyConnectedPlan','abbeyChapter','abbeyRefectory','capOf','bindPropertyRights','syncLive','ensureBldList','collegePlanQuote','collegeGroundValue','collegeCompoundValidate','collegeCompoundComplete','drawCompoundCourt','compoundCourtSurface','streetGraph','fortStreetRuns','resample','lerpPt','visualBuilding','visualRecord','visualScalars','visualDataNames','visualGeometry','visualPoints','visualPut','projectBuildingInstance','roofRise','hash01','courtyardAccessValid','abbeyAccessEndpointValid','chOf','orientCh','chLay','chCap','chNext','churchFabricMethod','churchFabricApply','churchFabricFrontageCompatible','churchFabricProposal','abbeyChurchFabricReserve','abbeyChurchFabricValidate','abbeyFabric','fabricSnapshot','fabricPending','fabricProjectPayer','fabricProjectValidate','fabricProjectCommission','fabricProjectComplete','fabricProjectTick','fabricMaterialDemand','storageGroundClaim','storageGroundPay','castleFoundationReserved'];
// The reusable ownership bootstrap carries an unrelated reservation capture
// from its oldHouseholdHead→houseFolk slice. It is not used by this capsule;
// the native castleFoundationReserved, geometry and church readers load below.
function setup({originX=0,originZ=0}={}){const r=realm({grain:40,fish:20,cash:0,crown:30000,pop:2,households:2,transformSource:p=>p.replace(/^const PROJECT_RESERVATION_BOUNDS_NATIVE=.*$/m,'').replace('const isHouse=x=>x&&W.houses.includes(x);',constant('isHouse'))});
 vm.runInContext(names.map(native).join('\n'),r.C);vm.runInContext(['ARCH','RESID','cellX','cellZ','toCell','cIdx','inB'].map(constant).join('\n'),r.C);
 r.eval(`const SIZE=256,GRID=65,CELL=4,FG=256,FN=1,SEA_SURFACE=0,SEA=0;let HASH_STAMP=0;const MODEL_ONLY=true;
 W.clock={day:1};W.h=new Float32Array(GRID*GRID).fill(5);W.water=new Uint8Array(GRID*GRID);W.dom=new Int16Array(GRID*GRID);W.roads=[];W.projects=[];W.bldList=[];s.streets=[];s.places=[];s.remnants=[];s.furl=[];s.history=[];
 H[0].tr='mason';H[1].tr='carter';G.ordersDirty=false;const A=corpFound('abbey',{name:'Actual fixture house',si:0,members:[],granges:[0]});W.abbeys=[A];A.id=0;transfer('crown',A,10000,'actual opening endowment',s);
 W.land={F:[{k:0,i:0,j:0,jx:.5,jz:.5,x:0,z:0,area:65536,alms:0,own:A.storageOwnerId,wk:A.storageOwnerId}],mask:new Uint8Array(GRID*GRID*4)};s.furl=W.land.F;
 const C=compoundEnsure(s,'abbey',A.storageOwnerId);A.compound=C.id;
 const placed=makeHash(16),segH=makeHash(24),RHW=4,E=1;let curE=1,live=false;const rr=()=>.5,cellOK=()=>true,buildable=()=>true,inPlace=()=>false,wallSide=()=>-100;
 const riverAt=()=>false,lakeAt=()=>false,fortCircuits=()=>[],fortGround=()=>5,fortSurface=()=>5,armyCauseway=()=>false,paidRoadAt=()=>false,armyBridgeAt=()=>false,armyRaftAt=()=>false;
 const reserveChurchyard=()=>null,VACANT_RESIDENTIALS=new WeakMap();
 const streetAccessAt=(town,p)=>town.streets.some(st=>!st.compoundPrivate&&!st.gone&&!st.hidden&&st.pts.some((q,k)=>k&&segDist(p.x,p.z,st.pts[k-1],q)<.01));
 const abbeyPublicStreet=(town,st)=>!st.compoundPrivate&&!st.gone&&!st.hidden&&town.streets.includes(st);
 let foodReserve=10;const abbeyReserve=()=>foodReserve,abbeyExpansionBlocked=()=>false;let tech=true;const constructionCapability=()=>({available:tech}),abbeyApproachClaim=()=>({ok:true}),abbeyApproachCash=()=>0;
 consumeOwnStock=()=>0;const hungryHands=()=>[],fortPrepare=()=>{},stitchRoads=()=>{},settleParcels=()=>{},settleFortGates=()=>{},updateBuildingInstance=()=>{};
 const streetGraphFortContext=()=>null,roadAccessClear=()=>true;
 const institutionalCapability=()=>({available:true}),learningSpare=(town,payer)=>means(payer),landPrice=()=>0,refreshArea=()=>{},furlongAt=()=>W.land.F[0];
 `);
 vm.runInContext(['probe','onRoadway','onStreet','fits','addSeg','addStreet','serviceAccess'].map(local).join('\n')+'\n'+localFn('place')+'\n'+local('unplace'),r.C);
 r.eval(`const liveOps={${methods.map(p=>source.slice(p.start,p.end)).join(',')}};s._lay={placed,segH,live:liveOps,queue:()=>[]};
 const church=place('temple',0,{x:${originX},z:${originZ},w:12,d:22,rot:0},'compound',1,{inst:true,abbey:A.storageOwnerId,exactGround:true,ownerId:A.storageOwnerId,compoundKey:'church'});church.idx=0;W.bldList.push(church);church.st=addStreet([{x:${originX},z:${originZ}+11},{x:${originX},z:${originZ}+12.2},{x:${originX},z:${originZ}+60}],1.3,'alley',{serviceAccess:'temple'});const publicStreet=addStreet([{x:-60,z:${originZ}+60},{x:60,z:${originZ}+60}],2,'road');church.st.compoundAccess=true;church.st.accessEndpoint={kind:'street',ref:1,segment:1,point:{x:${originX},z:${originZ}+60}};A.church=church.idx;bindPropertyRights(s);compoundBindBuilding(C,church,['worship']);chOf(church);church.ch.tower=0;church.ch.W=1;const buildingName=()=>church.nm||'Actual fixture church';
 s.stores.timber=100;s.stores.stone=100;s.px.timber=s.px.stone=1;offer(s,'timber','crown',100);offer(s,'stone','crown',100);let q;
 `);
 return {...r,json:e=>JSON.parse(r.eval('JSON.stringify('+e+')'))};}
const cash=r=>r.W.treasury+r.H.reduce((n,p)=>n+(p.w||0),0)+r.eval('A.gold+(church.ch.fund||0)');
function finishRange(r,P,component='C'){r.eval(`q=compoundProjectCommission(s,${component},${P});`);assert.ok(r.eval('q'));const total=cash(r),timber=r.s.stores.timber,runs=Math.ceil(r.eval('q.days'))+2;r.eval(`for(let i=0;i<${runs};i++)compoundProjectTick(q)`);assert.equal(r.eval('q.status'),'completed');assert.ok(r.eval('q.paid>0'));assert.ok(r.eval('q.timberInstalled===q.timber'));near(cash(r),total);near(timber-r.s.stores.timber,r.eval('q.timber'));return r.eval('W.bldList.at(-1)');}

function finishChurch(r){const total=cash(r),count=r.W.bldList.length;r.eval('const days=Math.ceil(q.days)+2;for(let i=0;i<days;i++)fabricProjectTick(q)');assert.equal(r.eval('q.status'),'completed');near(cash(r),total);assert.equal(r.W.bldList.length,count);return r.eval('q');}

test('Abbey church stages retain a canonical target and pay real materials and workers from its corporate chest',()=>{
 const r=setup(),total=cash(r),gold=r.eval('A.gold'),timber=r.s.stores.timber;
 r.eval('q=churchFabricProposal(s,church,{k:"bell",cr:3,st:0,t:"a bellcote"})');assert.ok(r.eval('q'));assert.equal(r.eval('q.payer===A'),true);assert.equal(r.eval('q.abbeyOwner'),'abbey:0');near(r.eval('church.ch.fund'),0);near(r.eval('church.ch.tower'),0);near(r.eval('q.worked'),0);near(cash(r),total);near(r.eval('fabricMaterialDemand(s,"timber")'),2);
 r.eval('fabricProjectTick(q)');near(r.eval('church.ch.tower'),0);assert.ok(r.eval('q.worked>0&&q.paid>0&&q.materialPaid>0'));assert.ok(r.eval('A.gold')<gold);near(r.eval('church.ch.fund'),0);near(cash(r),total);finishChurch(r);near(r.eval('church.ch.tower'),1);near(timber-r.s.stores.timber,r.eval('q.timber'));near(r.eval('C.components.length'),1);assert.equal(r.eval('C.components[0].ref'),0);
});

test('an existing church earmark returns by named real custody transfer and is not new Abbey income',()=>{
 const r=setup();r.eval('transfer(A,church,15,"abbey church fabric",s);const income=A._inc||0;const totalBefore=A.gold+church.ch.fund;abbeyFabric(A,s)');near(r.eval('church.ch.fund'),0);near(r.eval('A.gold+church.ch.fund'),r.eval('totalBefore'));near(r.eval('A._inc||0'),r.eval('income'));near(r.eval('A.cashY.receipts["abbey church fabric refund"]'),15);near(r.eval('church.cashY.payments["abbey church fabric refund"]'),15);assert.equal(r.eval('W.projects.length'),0,'the actual core buildings come before church embellishment');
 const before=r.eval('A.gold');r.eval('transfer(A,church,9,"abbey church fabric",s);church.ownerId="lord";abbeyFabric(A,s)');near(r.eval('church.ch.fund'),9);near(r.eval('A.gold'),before-9);
});

test('an earmark backing an existing paid parish-style contract is retained until that native contract ends',()=>{
 const r=setup();r.eval('transfer(A,church,15,"abbey church fabric",s);W.projects.push({type:"fabric",target:church.idx,payer:church,dead:false});abbeyFabric(A,s)');near(r.eval('church.ch.fund'),15);near(r.eval('A.cashY?.receipts["abbey church fabric refund"]||0'),0);
});

test('food reserve is enforced at commission and every material/work payment without creating goods',()=>{
 const r=setup();r.eval('A.gold=foodReserve+4;q=churchFabricProposal(s,church,{k:"bell",cr:3,st:0})');assert.equal(r.eval('q'),null);r.eval('A.gold=100;q=churchFabricProposal(s,church,{k:"bell",cr:3,st:0});A.gold=foodReserve+.1;fabricProjectTick(q)');near(r.eval('q.worked'),0);near(r.eval('q.timberInstalled'),0);near(r.eval('A.gold'),r.eval('foodReserve+.1'));assert.equal(r.eval('q.reason'),'funds');
 r.eval('A.gold=foodReserve+q.labour/q.days+1;fabricProjectTick(q)');near(r.eval('q.worked'),0);assert.ok(r.eval('q.timberInstalled>0&&q.timberInstalled<q.timber'));assert.ok(r.eval('A.gold>=foodReserve+q.labour/q.days-1e-9'));near(r.eval('church.ch.tower'),0);
});

test('current church method adoption and paid physical technology recipe control a stone rebuild',()=>{
 const r=setup();r.eval('tech=false;q=churchFabricProposal(s,church,{k:"stone",cr:20,st:8})');assert.equal(r.eval('q'),null);r.eval('tech=true;const constructionTechnologyRecipe=()=>({laborFactor:.72,timber:22});q=churchFabricProposal(s,church,{k:"stone",cr:20,st:8})');assert.ok(r.eval('q'));near(r.eval('q.labour'),14.4);near(r.eval('q.timber'),12*22*.025+22);near(r.eval('q.stone'),8);near(r.eval('church.tier'),0);finishChurch(r);assert.equal(r.eval('church.ch.stone'),true);near(r.eval('church.tier'),2);near(r.eval('q.stoneInstalled'),8);assert.equal(r.eval('q.method'),'churchMasonry');
});

test('a native church may lengthen away from its retained door without changing any paid circulation',()=>{
 const r=setup();r.eval('const pathBefore=JSON.stringify(church.st.pts);q=churchFabricProposal(s,church,{k:"long",dl:4,cr:12,st:0})');assert.ok(r.eval('q'));near(r.eval('q.site.f.z'),-2);near(r.eval('q.site.f.d'),26);near(r.eval('church.d'),22);near(r.eval('q.land'),0);finishChurch(r);near(r.eval('church.d'),26);near(r.eval('church.z'),-2);assert.equal(r.eval('JSON.stringify(church.st.pts)'),r.eval('pathBefore'));near(r.eval('serviceDoor(church,0).z'),11);assert.equal(r.eval('compoundConnectionRouteClear(s,{f:church,path:church.st.pts,pathWidth:church.st.hw*2,compoundId:C.id},undefined,church)'),true);
});

test('growth cannot move the existing door or cross a turning/private/pending retained path',()=>{
 const r=setup();r.eval('q=churchFabricProposal(s,church,{k:"tower",dl:5,cr:40,st:50})');assert.equal(r.eval('q'),null,'a tower pose moving the paid entrance is refused');
 r.eval('const crossing=addStreet([{x:-20,z:-12},{x:20,z:-12}],.4,"footpath",{compoundPrivate:C.id});q=churchFabricProposal(s,church,{k:"long",dl:4,cr:12,st:0})');assert.equal(r.eval('q'),null,'a completed private path cannot be swallowed');
 r.eval('crossing.gone=true;W.projects.push({type:"compound",si:0,site:{f:{x:0,z:-12,w:3,d:3,rot:0}},dead:false});q=churchFabricProposal(s,church,{k:"long",dl:4,cr:12,st:0})');assert.equal(r.eval('q'),null,'another retained paid building remains reserved');
});

test('live church title, granted field and public endpoint changes stop work before more purchases or wages',()=>{
 for(const mutation of['church.ownerId="lord"','W.land.F[0].own="lord";W.land.F[0].title.own=propertyRightsResolve("lord")','s.streets[1].gone=true','church.abbey=null']){const r=setup();r.eval('q=churchFabricProposal(s,church,{k:"bell",cr:3,st:0});fabricProjectTick(q)');const paid=r.eval('q.paid'),gold=r.eval('A.gold');r.eval(mutation+';fabricProjectTick(q)');near(r.eval('q.paid'),paid);near(r.eval('A.gold'),gold);near(r.eval('church.ch.tower'),0);assert.notEqual(r.eval('q.status'),'completed',mutation);}
});

test('completed connected ranges and their canonical parent routes survive fitted nave growth',()=>{
 const r=setup();finishRange(r,'abbeyConnectedPlan(A,s,"residence")');r.eval('const child=W.bldList.at(-1),pathBefore=JSON.stringify(child.st.pts),parentBefore=JSON.stringify(child.compoundConnection);q=churchFabricProposal(s,church,{k:"long",dl:4,cr:12,st:0})');assert.ok(r.eval('q'),'actual fitted rear addition must preserve the completed native connection');finishChurch(r);assert.equal(r.eval('JSON.stringify(child.st.pts)'),r.eval('pathBefore'));assert.equal(r.eval('JSON.stringify(child.compoundConnection)'),r.eval('parentBefore'));assert.equal(r.eval('compoundConnectionValid(s,{path:child.st.pts,accessMode:"compound-internal",connection:child.compoundConnection},A.storageOwnerId)&&compoundConnectionRouteClear(s,{f:child,path:child.st.pts,pathWidth:child.st.hw*2,compoundId:C.id},undefined,child)'),true);near(r.eval('abbeyCapacity(A)'),6);
});

test('a changed completed range connection blocks its church project on the next daily check',()=>{
 const r=setup();finishRange(r,'abbeyConnectedPlan(A,s,"residence")');r.eval('q=churchFabricProposal(s,church,{k:"bell",cr:3,st:0});const child=W.bldList.at(-1);if(!q)throw Error(JSON.stringify(abbeyChurchFabricValidate({abbeyOwner:A.storageOwnerId,payer:A,site:{f:church}},s,church)));child.compoundConnection.point.x+=2;fabricProjectTick(q)');near(r.eval('q.worked'),0);near(r.eval('q.materialPaid'),0);assert.equal(r.eval('q.reason'),'abbey-range-access');near(r.eval('church.ch.tower'),0);
});

test('plain retained project data resumes the same canonical payer and completed structural target',()=>{
 const r=setup();r.eval('q=churchFabricProposal(s,church,{k:"bell",cr:3,st:0});fabricProjectTick(q);const saved=JSON.parse(JSON.stringify({...q,payer:undefined}));q={...saved,payer:corpOf(saved.abbeyOwner)};W.projects[0]=q;');const paid=r.eval('q.paid');r.eval('fabricProjectTick(q)');assert.ok(r.eval('q.paid')>paid);assert.equal(r.eval('q.payer===A'),true);finishChurch(r);near(r.eval('church.ch.tower'),1);near(r.eval('C.components.length'),1);
});

test('the retained daughter join never permits widened, moved, foreign or unregistered church circulation',()=>{
 const r=setup();finishRange(r,'abbeyConnectedPlan(A,s,"residence")');r.eval('const child=W.bldList.at(-1),join=segH.near(0,12.2,15).find(g=>g.st===child.st&&g.b.x===0),f={x:0,z:-2,w:12,d:26,rot:0};');assert.ok(r.eval('join'));assert.equal(r.eval('churchFabricFrontageCompatible(s,f,join,church)'),true);
 for(const change of['{...f,w:14}','{...f,x:1}','{...f,rot:.1}','{...f,z:0}'])assert.equal(r.eval(`churchFabricFrontageCompatible(s,${change},join,church)`),false,change);
 r.eval('child.ownerId="lord"');assert.equal(r.eval('churchFabricFrontageCompatible(s,f,join,church)'),false);r.eval('child.ownerId=A.storageOwnerId;C.components=C.components.filter(c=>c.ref!==child.idx)');assert.equal(r.eval('churchFabricFrontageCompatible(s,f,join,church)'),false);r.eval('q=churchFabricProposal(s,church,{k:"long",dl:4,cr:12,st:0})');assert.equal(r.eval('q'),null);
});

test('rear-added setback is still exact even for a registered child with a current lawful detour',()=>{
 const r=setup();finishRange(r,'abbeyConnectedPlan(A,s,"residence")');r.eval(`const child=W.bldList.at(-1),P=child.st.pts,face=serviceDoor(child,0),door=serviceDoor(child),end={...P.at(-1)};
 // An adverse current path mutation remains plain canonical data. It is not
 // completed or priced by this fixture; the project must refuse it.
 child.st.pts=[face,door,{x:8.6,z:door.z},{x:8.6,z:-12.2},{x:-8.6,z:-12.2},{x:-8.6,z:12.2},end];child.compoundConnection.pathKey=JSON.stringify(child.st.pts);
 const g={a:child.st.pts[3],b:child.st.pts[4],hw:child.st.hw,st:child.st},f={x:0,z:-2,w:12,d:26,rot:0};`);
 assert.equal(r.eval('streetFootprintOverlap(church,g)'),true,'the old conservative setback already touches the rear detour');assert.equal(r.eval('compoundConnectionRouteClear(s,{f:child,path:child.st.pts,pathWidth:child.st.hw*2,compoundId:C.id},undefined,child)'),true,'the unchanged original church leaves the actual native walker clear');assert.equal(r.eval('churchFabricFrontageCompatible(s,f,g,church)'),false,'new rear ground must not consume the actual route');
});

test('Abbey daily growth follows actual core completion and cannot commission beside another retained corporate project',()=>{
 const r=setup();r.eval('church.ch.stone=false;abbeyFabric(A,s)');assert.equal(r.eval('W.projects.length'),0);finishRange(r,'abbeyConnectedPlan(A,s,"residence")');r.eval('abbeyFabric(A,s)');assert.equal(r.eval('W.projects.filter(q=>!q.dead).length'),0,'actual grange still required');finishRange(r,'abbeyConnectedPlan(A,s,"grange")');r.eval('const other={type:"compound",ownerId:A.storageOwnerId,dead:false};W.projects.push(other);abbeyFabric(A,s)');assert.equal(r.eval('W.projects.filter(q=>!q.dead).length'),1);r.eval('other.dead=true;q=abbeyFabric(A,s)');assert.ok(r.eval('q'));assert.equal(r.eval('q.payer===A'),true);assert.equal(r.eval('q.change.k'),'bell');
});

test('direct church fabric retains Abbey authority and cannot spend a different payer or the old church fund',()=>{
 const r=setup(),before=cash(r);r.eval('transfer(A,church,100,"abbey church fabric",s);const plan={work:"church",payer:church,abbeyOwner:A.storageOwnerId,change:{k:"bell"},labour:3,days:5,timber:2,stone:0};q=fabricProjectCommission(s,church,plan)');assert.equal(r.eval('q'),null);near(cash(r),before);near(r.eval('church.ch.fund'),100);r.eval('plan.payer="crown";q=fabricProjectCommission(s,church,plan)');assert.equal(r.eval('q'),null);r.eval('plan.payer=A;plan.abbeyOwner="abbey:99";q=fabricProjectCommission(s,church,plan)');assert.equal(r.eval('q'),null);near(cash(r),before);near(r.eval('church.ch.tower'),0);
});
