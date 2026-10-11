import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {realm,near} from './ownership-fixture.mjs';
const html=fs.readFileSync(process.env.FURLONG_TEST_SOURCE||new URL('../index.html',import.meta.url),'utf8');
const fn=n=>{const m=html.match(new RegExp('^function '+n+'\\b[\\s\\S]*?(?=^function |^const |^/\\*|$(?![\\s\\S]))','m'));assert.ok(m,'missing '+n);return m[0];};
const names=['constructionRecipe','fabricSnapshot','storageOwnerId','planProjectPayer','planGroundQuote','planProjectCommission','planProjectValidate','planProjectCompensate','tickPlan','constructionProjectMaterials','constructionProjectPaidWork','storageGroundClaim','storageGroundPay','buildWorks','payAmong','workers_','newTownStreetProposal'];
function setup(){const r=realm({grain:0,fish:0,cash:0,crown:1000,households:2});vm.runInContext(names.map(fn).join('\n'),r.C);r.eval(`
  const ARCH={house:[7,8,6,0,'house'],temple:[8,14,12,0,'church']};let now=1;day=()=>now;W.prehistory=true;W.projects=[];W.bldList=[];s.streets=[];s.history=[];let legal=true,crew=true,installed=0,occupied=0;
  H[0].tr='mason';H[1].tr='carter';s.stores.timber=20;s.px.timber=1;offer(s,'timber',H[1],20);s.px.stone=1;
  const hungryHands=()=>[],nativeWorkers=workers_;workers_=(town,pred)=>crew?nativeWorkers(town,pred):[];consumeOwnStock=()=>0;
  compoundGround=()=>({polys:[],cells:[1,2]});occupiedGroundAreas=()=>new Map();occupiedGroundFields=()=>new Set();polyLen=P=>P.reduce((n,p,k)=>k?n+Math.hypot(p.x-P[k-1].x,p.z-P[k-1].z):0,0);riverAt=()=>false;
  syncLive=()=>{};markOccupiedGround=()=>{occupied++};campHouse=()=>-1;emit=()=>{};planComp=()=>20;const plan={ok:true,kind:'street',si:0,pts:[{x:0,z:0},{x:20,z:0}],hw:3,hit:[],works:10,days:2,title:'A real paid lane'};
  s._lay={queue:()=>[],live:{planStreet:(P,hid,hw,preview)=>{if(!preview)throw Error('commission must not add native streets');return{pts:P.map(p=>({...p})),hw,kind:'lane',hidden:true,planQ:true};},planSite:(q,mode)=>legal?q:null,planOpen:st=>{installed++;s.streets.push(st);st.hidden=false;st.planQ=false;return st;}}};let q;
`);return r;}
const coins=r=>r.W.treasury+r.H.reduce((n,h)=>n+(h.w||0),0);
test('a public lane commission creates a saved proposal without a native street or charge',()=>{const r=setup(),total=coins(r);r.eval('q=planProjectCommission(plan,0)');assert.ok(r.eval('q'));near(r.eval('s.streets.length'),0);near(r.eval('installed'),0);near(r.eval('occupied'),0);near(coins(r),total);near(r.W.treasury,1000);});
test('a New Town keeps its paid street contract and frontage identity through native completion',()=>{const r=setup();r.eval('plan.newTown=true;q=planProjectCommission(plan,0);tickPlan(q)');assert.equal(r.eval('q.newTown'),true);near(r.eval('s.streets.length'),0);r.eval('tickPlan(q)');assert.equal(r.s.streets[0].neu,true);assert.equal(r.s.streets[0].name,'New Town Street');near(r.eval('q.paid'),10);assert.equal(r.eval('q.status'),'completed');});
test('a daily New Town survey uses the far bank of an actual current public crossing without mutation',()=>{for(const reverse of[false,true]){const r=setup();r.eval(`
  AD=()=>1200;s.role='crossing';s.pop=1000;s.growSlots=[];crowding=()=>12;streetAccessAt=()=>true;planCellOK=()=>true;fortRoadBlocked=()=>false;
  riverAt=(x,z,pad=0)=>x>=32-pad&&x<=44+pad;const road={kind:'road',pts:Array.from({length:13},(_,i)=>({x:i*16,z:0}))};if(${reverse})road.pts.reverse();s.streets.push(road);
  const before=JSON.stringify(road.pts);q=newTownStreetProposal(s);`);assert.ok(r.eval('q'));assert.equal(r.eval('q.newTown'),true);near(r.s.streets.length,1);near(r.eval('installed'),0);near(r.W.treasury,1000);assert.equal(r.eval('JSON.stringify(road.pts)'),r.eval('before'));assert.ok(r.eval('q.st.pts[0].x')>44,'retained street begins on far bank');assert.ok(r.eval('polyLen(q.st.pts)')>=64);}});
test('the lane and native occupied ground appear only after its material seller and crew are actually paid',()=>{const r=setup(),total=coins(r);r.eval('q=planProjectCommission(plan,0);tickPlan(q)');near(r.eval('q.done'),0.5);near(r.eval('installed'),0);near(r.eval('q.materialPaid'),0.5);near(r.eval('q.paid'),5);r.eval('tickPlan(q)');near(r.eval('installed'),1);near(r.eval('occupied'),1);near(r.eval('q.paid'),10);assert.equal(r.eval('q.status'),'completed');near(r.eval('s.streets.length'),1);near(coins(r),total);});
test('neither installed timber nor a funded purse can open a lane without a paid native crew',()=>{const r=setup(),total=coins(r);r.eval('q=planProjectCommission(plan,0);crew=false;tickPlan(q)');near(r.eval('q.timberInstalled'),0.5);near(r.eval('q.paid'),0);near(r.eval('q.done'),0);near(r.eval('installed'),0);assert.equal(r.eval('q.reason'),'workers');near(coins(r),total);});
test('a retained route obstruction prevents further payments and never clears the new obstruction',()=>{const r=setup();r.eval('q=planProjectCommission(plan,0);tickPlan(q);const saved=W.treasury;legal=false;tickPlan(q)');near(r.eval('W.treasury'),r.eval('saved'));near(r.eval('installed'),0);near(r.eval('q.done'),0.5);assert.equal(r.eval('q.reason'),'site-obstructed');});
test('the real owner and tenant receive their fixed public-work compensation rather than unrelated households',()=>{const r=setup(),total=coins(r);r.eval(`
  const b={idx:0,s,arch:'house',x:10,z:0,w:7,d:8,rot:0,h:6,tier:0,state:'sound',ownerId:H[0].id,hh:[H[1]]};W.bldList.push(b);s.buildings.push(b);plan.hit=[b];q=planProjectCommission(plan,0);crew=false;tickPlan(q);
`);near(r.H[0].w,17);near(r.H[1].w,3.5);near(r.eval('q.compensationPaid'),20);near(r.eval('b.removed||0'),0);near(r.eval('installed'),0);near(coins(r),total);});
test('changing a priced native building abandons the public plan without clearing or refunding it',()=>{const r=setup();r.eval(`
  const b={idx:0,s,arch:'house',x:10,z:0,w:7,d:8,rot:0,h:6,tier:0,state:'sound',ownerId:H[0].id,hh:[]};W.bldList.push(b);s.buildings.push(b);plan.hit=[b];q=planProjectCommission(plan,0);tickPlan(q);b.w=9;const saved=W.treasury;tickPlan(q);
`);assert.equal(r.eval('q.status'),'abandoned');near(r.eval('W.treasury'),r.eval('saved'));near(r.eval('b.removed||0'),0);near(r.eval('installed'),0);});
