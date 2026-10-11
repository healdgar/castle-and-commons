import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {realm,near} from './ownership-fixture.mjs';
const html=fs.readFileSync(process.env.FURLONG_TEST_SOURCE||new URL('../index.html',import.meta.url),'utf8');
const fn=n=>{const m=html.match(new RegExp('^function '+n+'\\b[\\s\\S]*?(?=^function |^const |^/\\*|$(?![\\s\\S]))','m'));assert.ok(m,'missing '+n);return m[0];};
const names=['constructionRecipe','fabricSnapshot','fabricProjectPayer','fabricPending','fabricProjectValidate','fabricProjectCommission','fabricProjectComplete','fabricProjectTick','fabricMaterialDemand','constructionProjectMaterials','constructionProjectPaidWork','buildWorks','payAmong','workers_','storageOwnerId','churchFabricApply','roadProjectValidate','roadProjectTick'];
function setup(){const r=realm({grain:0,fish:0,cash:0,crown:1000,households:2});vm.runInContext(names.map(fn).join('\n'),r.C);r.eval(`
  const ARCH={house:[7,8,6,0,'house'],temple:[8,14,12,0,'church']};let now=1;day=()=>now;
  W.bldList=[];W.projects=[];W.roads=[];H[0].tr='mason';H[1].tr='carter';let valid=true,crew=true,completed=0;
  s.history=[];s.ruinCount=0;s.stores.timber=20;s.stores.stone=20;s.px.timber=s.px.stone=1;offer(s,'timber',H[1],20);offer(s,'stone',H[1],20);
  const b={idx:0,s,arch:'temple',x:0,z:0,w:8,d:14,rot:0,h:12,tier:0,state:'sound',ownerId:'lord',ch:{fund:100,stone:false,gothic:false,aisles:0,tower:0,spire:0,trans:false,ctower:false,porch:false,W:1},hh:[]};s.buildings.push(b);W.bldList.push(b);
  s._lay={live:{fabricSite:(site,target,mode)=>{if(!valid)return null;if(mode==='complete')completed++;return mode==='complete'?target:site;}}};
  consumeOwnStock=()=>0;const hungryHands=()=>[];const nativeWorkers=workers_;workers_=(town,pred)=>crew?nativeWorkers(town,pred):[];
  chOf=b=>b.ch;buildingName=()=> 'The fixture church';chNext=()=>null;orientCh=()=>{};constructionCapability=()=>({available:true});bindPropertyRights=()=>{};settleParcels=()=>{};updateBuildingInstance=()=>{};rehouse=()=>{};vacantResidentialChanged=()=>{};syncLive=()=>{};refreshOverlay=()=>{};houseAtWar=()=>false;
  const plan={work:'church',payer:b,change:{k:'bell'},labour:10,days:2,timber:4,stone:2};let q;
`);return r;}
const coins=r=>r.W.treasury+r.H.reduce((n,h)=>n+(h.w||0),0)+r.eval('b.ch.fund');
test('church commissioning reserves fixed paid work without adding its bell or charging a purse',()=>{const r=setup(),total=coins(r);r.eval('q=fabricProjectCommission(s,b,plan)');assert.ok(r.eval('q'));near(r.eval('b.ch.tower'),0);near(r.eval('b.ch.fund'),100);near(coins(r),total);assert.equal(r.eval('fabricProjectCommission(s,b,plan)'),null);near(r.eval("fabricMaterialDemand(s,'timber')"),4);});
test('church materials and wages go to actual native accounts before its stage changes',()=>{const r=setup(),total=coins(r);r.eval('q=fabricProjectCommission(s,b,plan);fabricProjectTick(q)');near(r.eval('q.paid'),5);near(r.eval('q.materialPaid'),6);near(r.eval('q.worked'),1);near(r.eval('b.ch.tower'),0);near(r.eval('b.ch.fund'),89);near(r.H[0].w+r.H[1].w,11);near(coins(r),total);r.eval('fabricProjectTick(q);fabricProjectTick(q)');near(r.eval('b.ch.tower'),1);assert.equal(r.eval('completed'),1);assert.equal(r.eval('q.status'),'completed');near(coins(r),total);});
test('a crew absence cannot advance an installed-material church project',()=>{const r=setup();r.eval('q=fabricProjectCommission(s,b,plan);crew=false;fabricProjectTick(q)');near(r.eval('q.worked'),0);near(r.eval('q.paid'),0);near(r.eval('q.materialPaid'),6);near(r.eval('b.ch.tower'),0);assert.equal(r.eval('q.reason'),'workers');});
test('changed native fabric or title abandons the paid plan without relocating or refunding it',()=>{const r=setup();r.eval('q=fabricProjectCommission(s,b,plan);fabricProjectTick(q);b.ownerId=H[0].id;fabricProjectTick(q)');assert.equal(r.eval('q.status'),'abandoned');near(r.eval('b.ch.fund'),89);near(r.eval('b.ch.tower'),0);near(r.eval('q.worked'),1);});
test('obstruction halts further purchases and wages on the same retained site',()=>{const r=setup();r.eval('q=fabricProjectCommission(s,b,plan);fabricProjectTick(q);valid=false;fabricProjectTick(q)');near(r.eval('q.worked'),1);near(r.eval('b.ch.fund'),89);assert.equal(r.eval('q.reason'),'site-obstructed');near(r.eval('b.ch.tower'),0);});
test('paid fractional progress resumes with the same actual payer and physical target',()=>{const r=setup();r.eval('q=fabricProjectCommission(s,b,plan);const nativeWorks=buildWorks;buildWorks=(s,c,p,w)=>nativeWorks(s,c*0.4,p,w);fabricProjectTick(q);q={...q,before:JSON.parse(JSON.stringify(q.before)),site:JSON.parse(JSON.stringify(q.site))};buildWorks=nativeWorks;fabricProjectTick(q);fabricProjectTick(q)');near(r.eval('q.worked'),2);near(r.eval('q.paid'),10);assert.equal(r.eval('q.status'),'completed');near(r.eval('b.ch.tower'),1);});
test('construction technology changes the saved recipe once and requires its actual timber',()=>{const r=setup();r.eval("const constructionTechnologyRecipe=()=>({laborFactor:0.72,timber:22});const recipe=constructionRecipe(s,100,50,4,8)");near(r.eval('recipe.labour'),72);near(r.eval('recipe.days'),36);near(r.eval('recipe.timber'),26);near(r.eval('recipe.stone'),8);});
function paving(){const r=setup();r.eval(`
  const B={name:'other end',owner:0,pos:{x:100,z:0},stores:{stone:4,timber:0},px:{stone:2,timber:1},buildings:[],folk:[],prosperity:50};W.settlements.push(B);s.stores.stone=0;s.mkt.stone.clear();offer(B,'stone',H[1],4);
  const road={a:0,b:1,len:100,path:[{x:0,z:0},{x:100,z:0}],grade:0};W.roads.push(road);
  q={type:'pave',r:road,payer:0,si:0,labour:10,days:2,timber:0,stone:4,worked:0,done:0,paid:0,materialPaid:0,timberInstalled:0,stoneInstalled:0};W.projects.push(q);
`);return r;}
test('paving purchases the other end\'s real offered stone and progresses only by paid wages',()=>{const r=paving(),total=coins(r);r.eval('roadProjectTick(q)');near(r.eval('q.stoneInstalled'),4);near(r.eval('q.materialPaid'),8);near(r.eval('q.paid'),5);near(r.eval('road.grade'),0);near(r.eval('road.paveF'),0.5);near(r.eval('B.stores.stone'),0);near(coins(r),total);r.eval('roadProjectTick(q)');near(r.eval('road.grade'),1);near(r.eval('q.paid'),10);near(coins(r),total);});
test('stone alone cannot pave a road when no native crew receives wages',()=>{const r=paving();r.eval('crew=false;roadProjectTick(q)');near(r.eval('q.stoneInstalled'),4);near(r.eval('q.worked'),0);near(r.eval('road.grade'),0);assert.equal(r.eval('q.reason'),'workers');});
test('a commissioned owner project keeps the canonical household account when its head dies',()=>{const r=setup();r.eval(`
  delete b.ch;b.arch='house';b.ownerId=H[0].id;transfer('crown',H[0],100,'actual owner savings',s);
  q=fabricProjectCommission(s,b,{work:'tier',tier:1,payer:H[0],labour:10,days:2,timber:4,stone:0});const owner=householdAccount(H[0]);
  if(q.payer!==owner)throw Error('payer must be the actual canonical household');H[0].dead=true;
  if(fabricProjectPayer(q)!==owner)throw Error('same living household retains its paid contract');
`);assert.ok(r.eval('q'));});
test('a fully paid native footprint licence survives parcel succession without a second land charge',()=>{const r=setup();vm.runInContext(['storageGroundClaim','storageGroundPay'].map(fn).join('\n'),r.C);r.eval(`
  const F={k:'native-field',title:{own:propertyRightsResolve(H[1].id),work:{owner:-1}},lord:0};W.land={mask:new Uint8Array(16)};let cells=[1,2];
  compoundGround=()=>({cells:cells.slice()});occupiedGroundFields=()=>new Set([F]);occupiedGroundAreas=()=>new Map([[F,100]]);
  transfer('crown',H[0],100,'real savings for land',s);q={site:{f:{}},land:20,paid:0};const payer=accountOwner(H[0]),claim=storageGroundClaim(s,q,payer);const result=storageGroundPay(q,s,payer,claim);
  if(!result.ok||result.paid!==20)throw Error('full actual receipts required');const before=means(payer);
  F.title.own=propertyRightsResolve(H[0].id);const inherited=storageGroundClaim(s,q,payer);if(!inherited.ok||inherited.recipients.length)throw Error('lawful successor takes the parcel subject to paid licence');
  if(means(payer)!==before)throw Error('licence must not charge again');cells=[1,3];const moved=storageGroundClaim(s,q,payer);if(moved.ok)throw Error('paid licence must not move to different native ground');
`);near(r.eval('q.landCash'),20);assert.equal(r.eval('q.groundClaim.cells.join(",")'),'1,2');});
test('a completed paid roof repair cancels a queued vacant-house fall',()=>{const r=setup();vm.runInContext(fn('tickFalling'),r.C);r.eval(`
  delete b.ch;b.arch='house';b.ownerId='lord';
  b._fallAt=2;s._falling=[b];q=fabricProjectCommission(s,b,{work:'repair',payer:'crown',labour:10,days:1,timber:4,stone:0});fabricProjectTick(q);now=2;tickFalling(s);
`);assert.equal(r.eval('b.state'),'sound');near(r.eval('s.ruinCount'),0);near(r.eval('s._falling.length'),0);assert.equal(r.eval('q.status'),'completed');});
