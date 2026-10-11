import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {realm,near} from './ownership-fixture.mjs';
const source=fs.readFileSync(process.env.FURLONG_TEST_SOURCE||new URL('../index.html',import.meta.url),'utf8');
const fn=n=>{const f=source.match(new RegExp('^function '+n+'\\b[\\s\\S]*?(?=^function |^const |^/\\*|$(?![\\s\\S]))','m'))?.[0];assert.ok(f,'missing native '+n);return f;};
const constant=n=>{const f=source.match(new RegExp('^const '+n+'=.*$','m'))?.[0];assert.ok(f,'missing native '+n);return f;};
const abbey=source.slice(source.indexOf('/* ABBEY_INSTITUTION_BEGIN */'),source.indexOf('/* ABBEY_INSTITUTION_END */'));
const tech=source.slice(source.indexOf('const TECH_RULES=Object.freeze('),source.indexOf('function technologyKey('));
const names=['craftRoomValid','craftRoomCapacity','craftRoomOwner','craftRoomQuote','technologyWindmillProposal','institutionFoundationPending','constructionRecipe','constructionTechnologyRecipe','technologyEquipmentPrice','technologyEquipmentSpare','corpFound','capOf','constructionCapability','technologyKey','technologyCapability','technologyActorsDirty','technologyBenefit','technologyRotation','technologyFarmYield','technologyWindExposure','technologyGrindingPower','technologyGrindingOperator','technologyGrindingDay','technologyGrindingReceipt','technologyMultureOffer','craftPresent','craftHands','awayNow','millDrive','millWheelBuildings','millWheelKey','compoundEnsure','compoundOf','compoundBindBuilding','compoundHas','compoundComponentPresent','compoundCircuit','compoundProjectPayer','compoundProjectValidate','compoundProjectCommission','compoundProjectTick','constructionProjectMaterials','constructionProjectPaidWork','workers_','hungryHands','payAmong','buildWorks'];
function setup({commodity=true,people=3}={}){
 const r=realm({households:people,pop:people,cash:200,crown:10000,grain:100,fish:100,commodity});
 r.eval([constant('TRADE_ARCH'),constant('RESID'),constant('LK'),constant('LS'),constant('ARABLE'),constant('CONSTRUCTION_METHODS'),constant('HUNGRY_HANDS'),tech,...names.map(fn),abbey].join('\n'));
 r.eval(`let now=1;day=()=>now;AD=()=>1200;year=()=>0;KCr=0;KS=2;KL=1;W.land={F:[],perHead:1000};s.furl=[];W.bldList=[];W.projects=[];s.streets=[];W.roads=[];G.detDirty=false;W.weather={state:'clear'};
  W.technology={known:{tanning:{},watermill:{},windmill:{}}};s.technology={adopted:{tanning:{},watermill:{},windmill:{}}};
  for(const p of H){p.sx='m';p.age=30;p.sk=[.6,.6,.6];p.own=true;}H[1].tr='mason';H[2].tr='tanner';H[2].craft={qualified:true,rank:'journeyman'};ownershipTick();storageInit(s);
  const a=corpFound('abbey',{name:'Native Abbey',si:0,founder:0,order:'cistercian',sex:'m',members:[],servants:[],corrodies:[],granges:[],charter:{selfWorked:true,titheExempt:true}});stockOf(s,a);transfer('crown',a,1000,'actual endowment',s);
  const f={k:0,dom:0,lord:0,core:-1,alms:a.id,own:a.storageOwnerId,wk:a.storageOwnerId,ten:'alms',kind:LK.FIELD,state:LS.TILLED,area:1000,x:20,z:20};W.land.F=[f];s.furl=[f];a.granges=[0];bindPropertyRights(s);
  compoundGround=()=>({cells:[0],polys:[]});compoundPolys=()=>[];occupiedGroundFields=()=>new Set([f]);markOccupiedGround=()=>{};syncLive=()=>{};updateBuildingInstance=()=>{};houseFolk=()=>{};soilYield=()=>.00002;
  obbCorners=(x,z,w,d)=>[{x:x-w/2,z:z-d/2},{x:x+w/2,z:z-d/2},{x:x+w/2,z:z+d/2},{x:x-w/2,z:z+d/2}];hAt=()=>0;riverAt=()=>({y:2,a:{x:0,z:0},b:{x:0,z:10}});lakeAt=()=>false;lerp=(a,b,t)=>a+(b-a)*t;
  // Controlled native geometry boundary. It installs only when the actual paid adapter completes.
  s._lay={live:{compoundSite:(site,mode)=>{site={...site};delete site.accessMode;delete site.accessDonor;if(mode==='survey')return {...site,path:[{x:site.f.x,z:site.f.z},{x:site.f.x,z:site.f.z+12}]};if(mode==='validate')return site;if(mode==='complete'){const b={...site.f,idx:W.bldList.length,s,arch:site.arch,tier:site.tier||0,ownerId:a.storageOwnerId,state:'sound',compoundKey:site.key};s.buildings.push(b);W.bldList.push(b);return b;}return null;}}};
  const C=compoundEnsure(s,'abbey',a.storageOwnerId);
 `);return r;
}
function building(r,key,arch=key){r.eval(`const b${key}={idx:W.bldList.length,s,arch:'${arch}',state:'sound',ownerId:a.storageOwnerId,abbey:a.storageOwnerId,compoundKey:'${key}',x:20,z:20,w:15,d:8,tier:0};s.buildings.push(b${key});W.bldList.push(b${key});bindPropertyRights(s);compoundBindBuilding(C,b${key},['productive']);`);}
function lay(r,i=0,job='tanner'){r.eval(`H[${i}].role='lay brother';H[${i}].abbey=a.id;H[${i}]._hh.abbey=a.id;H[${i}].abbeyPriorTrade='${job}';H[${i}].craft={qualified:true};a.members.push(H[${i}]);`);}
function stock(r,g,q,owner="'crown'"){r.eval(`if(s.storage)storageBindGood(s,'${g}');s.stores.${g}=(s.stores.${g}||0)+${q};offer(s,'${g}',${owner},${q});`);}
const coins=r=>r.eval('W.treasury+a.gold+[...W.households.values()].reduce((n,h)=>n+h.assets.w,0)');

test('new goods have no opening stock or household demand',()=>{const r=setup();near(r.s.stores.hides||0,0);near(r.s.stores.leather||0,0);near(r.eval('NEED.hides+NEED.leather'),0);assert.equal(r.eval('STORAGE_TYPES.tannery.buildable'),false);});
for(const commodity of [false,true])test(`actual cattle/sheep slaughter supplies skins once in ${commodity?'balanced':'legacy'} custody`,()=>{const r=setup({commodity});stock(r,'cattle',2,'H[0]._hh');r.eval("stockOf(s,H[0]).animals.cattle=2;const q=herdTake(s,H[0]._hh,'cattle',1);meatTo(s,H[0]._hh,q*CARCASS.cattle);herdTake(s,H[0]._hh,'cattle',4);herdTake(s,H[0]._hh,'cattle',4)");near(r.s.stores.hides,2);near(r.eval("mkt(s,'hides').get(H[0]._hh)"),2);near(r.eval('stockOf(s,H[0]).animals.cattle'),0);stock(r,'sheep',2,'H[0]._hh');r.eval("stockOf(s,H[0]).animals.sheep=2;herdTake(s,H[0]._hh,'sheep',1)");near(r.s.stores.hides,2.15);});
test('slaughter buyer owns skin; transfer, disease and pig slaughter supply none',()=>{const r=setup();stock(r,'cattle',3);const cash=coins(r);r.eval("const q=herdTake(s,'crown','cattle',1,true,H[2]);transfer(H[2],'crown',q*price(s,'cattle'),'sales',s)");near(r.eval("mkt(s,'hides').get(H[2]._hh)"),1);near(r.eval("mkt(s,'hides').get('crown')||0"),0);near(coins(r),cash);r.eval("herdLoss(s,'cattle',.5);const hides=s.stores.hides;purchase(s,'cattle',H[0],.25);stockOf(s,H[0]).animals.cattle+=purchase.got");near(r.s.stores.hides,r.eval('hides'));stock(r,'swine',1);r.eval("herdTake(s,'crown','swine',1,true,H[2])");near(r.s.stores.hides,1);});
test('a retained tannery is commissioned, paid and canonically installed only after real material and wages',()=>{const r=setup();building(r,'church','temple');building(r,'grange');stock(r,'timber',30);const cash=coins(r);r.eval("const plan=abbeySitePlan(s,f,'tannery',a.storageOwnerId,x=>abbeyGroundOwned(a,x));const q=compoundProjectCommission(s,C,plan);const count=W.bldList.length;compoundProjectTick(q)");near(r.eval('q.worked'),1);assert.equal(r.eval('W.bldList.length'),r.eval('count'));assert.ok(r.eval('q.paid>0&&q.materialPaid>0'));near(r.s.stores.timber,r.eval('30-plan.timber'));near(coins(r),cash);r.eval('for(;now<plan.days;){now++;compoundProjectTick(q)}');assert.equal(r.eval('q.status'),'completed');assert.ok(r.eval("W.bldList.at(-1).ownerId===a.storageOwnerId&&W.bldList.at(-1).title.owner===a&&W.bldList.at(-1).compoundKey==='tannery'"));near(r.eval('q.paid'),r.eval('plan.labour'));near(coins(r),cash);});
test('lost native grant or unadopted tanning cannot commission paid works',()=>{const r=setup();r.eval("const plan=abbeySitePlan(s,f,'tannery',a.storageOwnerId,()=>true);f.own='crown'");assert.equal(r.eval('compoundProjectCommission(s,C,plan)'),null);r.eval("f.own=a.storageOwnerId;delete s.technology.adopted.tanning");assert.equal(r.eval('compoundProjectCommission(s,C,plan)'),null);near(r.eval('a.gold'),1000);});
for(const commodity of [false,true])test(`finite own-use recipe conserves native materials and cash in ${commodity?'balanced':'legacy'} mode`,()=>{const r=setup({commodity});building(r,'tannery');lay(r);stock(r,'hides',1);stock(r,'timber',1);const cash=coins(r);r.eval('abbeyIndustryPrepare(a,s);abbeyIndustries(s);const made=a.leatherMade,used=a.leatherUsed,tanned=a.hidesTanned,bark=a.barkUsed;abbeyIndustries(s)');assert.ok(r.eval('made>0&&used>0'));near(r.eval('a.leatherMade'),r.eval('made'));near(r.eval('a.hidesTanned*.75'),r.eval('made'));near(r.eval('a.barkUsed'),r.eval('tanned*.25'));near(r.s.stores.hides,1-r.eval('tanned'));near(r.s.stores.timber,1-r.eval('bark'));near(r.s.stores.leather,r.eval('made-used'));near(r.eval('used'),.1/360);near(coins(r),cash);near(r.eval('stockOf(s,a).held.leather'),r.s.stores.leather);assert.ok(r.eval('made<=ABBEY_LEATHER.stockDays*.1/360'));});
test('no actual operator, skins, bark or adoption gives no leather output',()=>{for(const missing of ['operator','hides','timber','adoption']){const r=setup();building(r,'tannery');if(missing!=='operator')lay(r);if(missing!=='hides')stock(r,'hides',1);if(missing!=='timber')stock(r,'timber',1);if(missing==='adoption')r.eval('delete s.technology.adopted.tanning');r.eval('abbeyIndustryPrepare(a,s);abbeyIndustries(s)');near(r.eval('a.leatherMade||0'),0);}});
test('assigned craft member is not also a native field/sheep worker, even at building index zero',()=>{const r=setup();building(r,'tannery');building(r,'grange');lay(r);stock(r,'hides',1);stock(r,'timber',1);r.eval('abbeyIndustryPrepare(a,s);abbeyWork(a,s)');near(r.eval('H[0].abbeyIndustry'),0);near(r.eval('a.workingHands'),0);near(r.eval('abbeyHerdHands(a,s)'),0);assert.equal(r.eval('workers_(s,p=>p===H[0]).length'),0);});
test('owned water mill does not usurp public mill and shares finite daily work without a second multure',()=>{const r=setup();building(r,'mill');lay(r,0,'miller');r.eval("bmill.w=bmill.d=9;bmill.millWater={x:0,z:0,y:2,kind:'river',side:0,offset:6.8};const publicMill={idx:99,arch:'mill',state:'sound',s,w:6,d:6};s.mill=publicMill;abbeyIndustryPrepare(a,s);const physical=s.stores.grain,R=technologyGrindingDay(s,100,false,a),second=technologyGrindingDay(s,100,false,a);technologyMultureOffer(s,R,R.chargedWorked*.06)");assert.ok(r.eval('R.worked>0&&R.worked<100'));near(r.eval('R.chargedWorked'),0);near(r.eval('second.worked'),0);near(r.eval('bmill.poweredDay.used'),1);near(r.eval('bmill.grindingPending||0'),0);near(r.s.stores.grain,r.eval('physical'));assert.ok(r.eval('s.mill===publicMill'));assert.ok(r.eval('millWheelBuildings(s).includes(bmill)&&millWheelKey().includes("river")'));});
test('wind method/adoption, actual exposure and weather govern own grinding',()=>{const r=setup();building(r,'mill','windmill');lay(r,0,'miller');r.eval('bmill.windExposure=.4;abbeyIndustryPrepare(a,s)');near(r.eval('technologyGrindingPower(s,bmill)'),.4);r.eval("W.weather.state='storm'");near(r.eval('technologyGrindingDay(s,1,false,a).worked'),0);r.eval("W.weather.state='clear';delete s.technology.adopted.windmill");near(r.eval('technologyGrindingDay(s,1,false,a).worked'),0);});
test('mixed own and public work charges only actual public work and keeps the original receipt split',()=>{const r=setup();building(r,'mill','windmill');lay(r,0,'miller');r.eval("bmill.w=bmill.d=6;bmill.windExposure=1;const publicMill={idx:99,arch:'windmill',state:'sound',s,w:6,d:6,windExposure:1,ownerId:'crown'};s.buildings.push(publicMill);H[2].tr='miller';H[2].craft={qualified:true,rank:'master',room:99};abbeyIndustryPrepare(a,s);const R=technologyGrindingDay(s,5,false,a);s.stores.grain+=R.chargedWorked*.06;const before=mkt(s,'grain').get('crown')||0;technologyMultureOffer(s,R,R.chargedWorked*.06)");assert.ok(r.eval('R.rows.length===2&&R.rows[0].ownUse&&!R.rows[1].ownUse'));near(r.eval("mkt(s,'grain').get('crown')-before"),r.eval('R.chargedWorked*.06*.25'));near(r.eval("mkt(s,'grain').get(H[2]._hh)"),r.eval('R.chargedWorked*.06*.75'));});
test('readonly industry summary detaches decision reasons and never leaks ownership graphs into drawing',()=>{const r=setup();r.eval("a.industryPlans={mill:'no qualified miller'};const Q=abbeySummary(a);Q.industryPlans.mill='changed'");assert.equal(r.eval('a.industryPlans.mill'),'no qualified miller');assert.ok(source.includes("'millGround','hidesTanned','barkUsed','leatherMade','leatherUsed'"));});


test('small native own-use proposal is funded by real inputs and batch work without a commercial profit fiction',()=>{const r=setup();lay(r);stock(r,'hides',1);stock(r,'timber',5);r.eval('const P=abbeyTanneryPlan(a,s)');assert.ok(r.eval('P&&P.site.f.w===4&&P.site.f.d===4&&P.timber===4&&P.days===30'));near(r.eval('P.labour'),r.eval('foodYr()'));const money=coins(r);r.eval("consumeOwnStock(s,'crown','hides',1)");assert.equal(r.eval('abbeyTanneryPlan(a,s)'),null);assert.equal(r.eval('a.industryPlans.tannery'),'no actual slaughter skins for purchase');near(coins(r),money);});
test('real lay batch booking frees farming hands on covered days and resumes only at actual shortage',()=>{const r=setup();building(r,'tannery');building(r,'grange');lay(r);stock(r,'hides',1);stock(r,'timber',1);r.eval('abbeyIndustryPrepare(a,s);abbeyIndustries(s);now++;abbeyIndustryPrepare(a,s);abbeyWork(a,s)');assert.equal(r.eval('H[0].abbeyIndustry'),undefined);assert.equal(r.eval('H[0].abbeyJob'),undefined);near(r.eval('a.workingHands'),1);const output=r.eval('a.leatherMade');r.eval('abbeyIndustries(s)');near(r.eval('a.leatherMade'),output);r.eval('for(let k=0;k<29;k++){now++;abbeyIndustryPrepare(a,s);abbeyIndustries(s);}');assert.ok(r.eval('a.leatherMade>0&&a.leatherMade<=60*.1/360'));});
test('qualified paid tanner receives an actual batch day wage and returns to native work on idle days',()=>{const r=setup();building(r,'tannery');lay(r,0,'ploughman');stock(r,'hides',1);stock(r,'timber',1);const cash=coins(r);r.eval('abbeyStaff(a,s);abbeyIndustryPrepare(a,s);const paid=a.wages,operator=abbeyIndustryOperator(a,s,"tanner");abbeyIndustries(s);const output=a.leatherMade;now++;abbeyStaff(a,s);');assert.ok(r.eval('operator===H[2]&&btannery.abbeyOperator===H[2].id&&paid>0&&output>0'));near(r.eval('a.wages'),r.eval('paid'));assert.equal(r.eval('H[2].abbeyService'),undefined);assert.equal(r.eval('H[2].role'),null);assert.ok(r.eval('workers_(s,p=>p===H[2]).includes(H[2])'));near(coins(r),cash);});
test('leather wear counts existing household once even with member, corrody and servant aliases',()=>{const r=setup();lay(r);r.eval('a.corrodies.push({household:H[0]._hh});a.servants.push(H[0]);H[0].abbeyPaidDay=day()');near(r.eval('abbeyLeatherMouths(a,s)'),1);});
test('own-crop receipt retains real grain and requires today actual operator',()=>{const r=setup();building(r,'mill','windmill');building(r,'grange');lay(r,0,'miller');r.eval('bmill.windExposure=1;a.workArea=1000;a.workRatio=1;abbeyIndustryPrepare(a,s);const physical=s.stores.grain;abbeyCrop(s,1)');near(r.s.stores.grain,r.eval('physical+a.crop'));near(r.eval('a.millGround'),r.eval('a.crop'));near(r.eval("mkt(s,'grain').get(a)"),r.eval('a.crop'));r.eval('now++;H[0].away={until:day()+1};const old=a.millGround;abbeyCrop(s,1)');near(r.eval('a.millGround'),r.eval('old'));});

test('local adoption value needs actual wear and qualified expertise without a productivity premium',()=>{const r=setup();lay(r);r.eval('price0=(s,g)=>GOODBASE[g];const benefit=technologyBenefit(s,TECH_RULES.tanning,[]);H[0].craft.qualified=false;H[2].craft.qualified=false');near(r.eval('benefit'),.4);near(r.eval('technologyBenefit(s,TECH_RULES.tanning,[])'),0);near(r.eval('TECH_RULES.tanning.gain'),0);});


test('private own grinding never enters retained public claims and annual close preserves actual cumulative work',()=>{const r=setup();building(r,'mill','windmill');building(r,'tannery');lay(r,0,'miller');lay(r,2,'tanner');stock(r,'hides',1);stock(r,'timber',1);r.eval('bmill.windExposure=1;abbeyYear(a);abbeyIndustryPrepare(a,s);const R=technologyGrindingDay(s,1,true,a);abbeyIndustries(s);const totals={...a.industryTotal};year=()=>1;abbeyYear(a);const Q=abbeySummary(a);Q.industryTotal.millGround=-1;Q.prev.millGround=-1;Q.industryOperators[0].poweredDay.used=-1');near(r.eval('bmill.grindingPending||0'),0);assert.equal(r.eval('bmill.grindingClaims'),undefined);near(r.eval('a.prev.millGround'),r.eval('R.worked'));near(r.eval('a.millGround'),0);near(r.eval('a.industryTotal.millGround'),r.eval('totals.millGround'));near(r.eval('a.industryTotal.leatherMade'),r.eval('totals.leatherMade'));assert.ok(r.eval('totals.leatherMade>0&&totals.leatherUsed>0'));near(r.eval('bmill.poweredDay.used'),r.eval('R.worked/((bmill.w*bmill.d/12)*(.8+.2*H[0].sk[KCr]))'));});

test('additional native water-wheel geometry invalidates on actual foundation, feed and pond changes',()=>{const r=setup();building(r,'mill');r.eval("bmill.millWater={x:1,z:2,y:3,kind:'river',side:0,offset:6.8,intake:{x:4,z:5}};bmill.y0=0;s.lake={y:4,dam:{x:1,z:2,a:0,w:8,lo:-4,hi:4,bed:0},poly:[{x:0,z:0},{x:9,z:0},{x:0,z:9}]};let key=millWheelKey();");for(const change of ['bmill.y0+=1','bmill.millWater.x+=1','bmill.millWater.z+=1','s.lake.y+=1','s.lake.dam.x+=1','s.lake.dam.z+=1','s.lake.poly[0].x+=1']){r.eval(change);assert.notEqual(r.eval('millWheelKey()'),r.eval('key'),change);r.eval('key=millWheelKey()');}assert.ok(r.eval('millWheelBuildings(s).includes(bmill)'));});


test('a proposed exclusive own mill cannot count its only operator as retained farm labour',()=>{const r=setup();building(r,'grange');lay(r,0,'miller');r.eval('a.workArea=1000;a.workRatio=1;a.workingHands=1;const before=a.gold;const P=abbeyMillPlan(a,s)');assert.equal(r.eval('P'),null);assert.equal(r.eval('a.industryPlans.mill'),'actual grange throughput cannot support mill costs');near(r.eval('a.gold'),r.eval('before'));assert.equal(r.eval('H[0].abbeyIndustry'),undefined);});

test('shared abbey poses retain the previous eight candidates and exact signed-zero arithmetic',()=>{
 const math=Object.create(Math);math.random=()=>assert.fail('site poses cannot draw random numbers');
 const context=vm.createContext({Math:math});vm.runInContext(fn('abbeySitePoses'),context);
 for(const field of [{x:20,z:20,area:10000},{x:-0,z:-0,area:0},{x:-7,z:3},{x:5,z:-9,area:1e8},{x:1,z:2,area:-1}]){
  context.field=field;const poses=vm.runInContext('abbeySitePoses(field,12,22)',context);assert.equal(poses.length,8);
  for(let i=0;i<8;i++){const angle=i*Math.PI/4,radius=i?Math.min(45,Math.sqrt(field.area||0)/5):0,old={x:field.x+Math.cos(angle)*radius,z:field.z+Math.sin(angle)*radius,w:12,d:22,rot:-angle};
   for(const key of ['x','z','w','d','rot'])assert.ok(Object.is(poses[i][key],old[key]),`pose ${i} ${key}`);
  }assert.ok(Object.is(poses[0].rot,-0));
 }
});

test('church site proposals retain the shared pose order through native survey and legal rejection',()=>{
 const r=setup();r.eval(`const surveyed=[];s._lay.live.compoundSite=(site,mode,owner)=>{surveyed.push({f:{...site.f},mode,owner,arch:site.arch});return site;};
  const proposal=abbeySitePlan(s,f,'church',a.storageOwnerId,()=>false);const expected=abbeySitePoses(f,12,22);`);
 assert.equal(r.eval('proposal'),null);assert.equal(r.eval('surveyed.length'),8);
 assert.ok(r.eval("surveyed.every((q,i)=>q.mode==='survey'&&q.owner===a.storageOwnerId&&q.arch==='temple'&&['x','z','w','d','rot'].every(k=>Object.is(q.f[k],expected[i][k])))"));
});

test('own windmill searches beyond its occupied church centroid while retaining grant and power refusals',()=>{
 const r=setup();r.eval([fn('obbCorners'),fn('obbOverlap')].join('\n'));building(r,'church','temple');lay(r,0,'miller');lay(r,1,'ploughman');lay(r,2,'ploughman');
 const cash=coins(r),stores=JSON.stringify(r.s.stores),count=r.s.buildings.length;
 r.eval(`bchurch.w=12;bchurch.d=22;bchurch.rot=0;f.area=10000;W.land.perHead=5000;a.workArea=f.area;a.workRatio=1;a.workingHands=abbeyPeople(a).filter(abbeyLay).length;s._gYield=.0001;
  let foreign=false;const surveyed=[];occupiedGroundFields=()=>new Set([foreign?{...f,alms:null,own:'crown'}:f]);
  // Keep the controlled site boundary; use the native separating-axis test for the actual standing church.
  s._lay.live.compoundSite=(site,mode,owner)=>{if(mode!=='survey')throw Error('proposal must not install a building');surveyed.push({...site.f});
   if(obbOverlap({...site.f,w:site.f.w+2.4,d:site.f.d+2.4},bchurch))return null;
   return {...site,path:[{x:site.f.x,z:site.f.z+4.2},{x:site.f.x+15,z:site.f.z+4.2}]};};
  const proposal=abbeyMillPlan(a,s),offset=abbeySitePoses(f,6,6)[1];`);
 assert.ok(r.eval("proposal&&proposal.site.arch==='windmill'&&proposal.ownerId===a.storageOwnerId&&proposal.payerId===a.storageOwnerId"));
 assert.equal(r.eval('surveyed.length'),2);assert.ok(r.eval("['x','z','w','d','rot'].every(k=>Object.is(proposal.site.f[k],offset[k]))"));
 assert.ok(r.eval("proposal.requires.join(',')==='church,grange'&&proposal.days===240&&proposal.timber===32&&proposal.stone===0&&proposal.labour===foodYr()*8"));
 r.eval("foreign=true;surveyed.length=0;const foreignProposal=abbeyMillPlan(a,s);");assert.equal(r.eval('foreignProposal'),null);assert.equal(r.eval('surveyed.length'),8);
 r.eval("foreign=false;W.weather.state='storm';surveyed.length=0;const unpowered=abbeyMillPlan(a,s);");assert.equal(r.eval('unpowered'),null);assert.equal(r.eval('surveyed.length'),8);
 assert.equal(r.s.buildings.length,count);assert.equal(JSON.stringify(r.s.stores),stores);near(coins(r),cash);assert.equal(r.eval('H[0].abbeyIndustry'),undefined);
});


test('private own-use mill does not veto native public windmill preflight',()=>{const r=setup();building(r,'mill','windmill');r.eval("H[2].tr='miller';H[2].craft={qualified:true,rank:'journeyman'};s.growSlots=[];price(s,'grain');price(s,'timber');let quotes=0;const nativeRecipe=constructionRecipe;constructionRecipe=(...args)=>{quotes++;return nativeRecipe(...args)};technologyWindmillProposal(s,true)");near(r.eval('quotes'),1);r.eval("s.buildings.push({arch:'windmill',state:'sound',removed:false,ownerId:'lord'});technologyWindmillProposal(s,true)");near(r.eval('quotes'),1);assert.ok(r.eval('bmill.abbey===a.storageOwnerId'));});

function ruralSetup(beforeCapture=''){const r=setup();r.eval(['obbCorners','obbOverlap','locW','segDist','segSegDist','inPolyXZ','graveyardPolygonsOverlap','streetFootprintOverlap','serviceDoor','polyLen','occupiedGroundBoxMayHit','occupiedGroundCells','compoundPolys','compoundGround','storageGroundClaim','storageGroundPay','institutionFoundationAccess','institutionFoundationPath','storageRoadPlan','serviceRoadPlan','castleFoundationReserved','landValue','landPrice'].map(fn).join('\n'));r.eval(`
 const GRID=16,CELL=40,SIZE=640,LANDV={};cIdx=(x,z)=>z*GRID+x;toCell=x=>Math.floor((x+SIZE/2)/CELL);cellX=x=>-SIZE/2+(x+.5)*CELL;cellZ=cellX;PL=()=>1;
 W.monarch={alive:true,traits:['pious'],sk:[0,0,.6]};W.land.mask=new Uint8Array(GRID*GRID*4);for(let c=0;c<GRID*GRID;c++){W.land.mask[c*4]=1;W.land.mask[c*4+2]=255;}
 const privateField={...f,k:1,alms:null,own:'crown',wk:'crown',core:0,area:10000};privateField.title={own:propertyRightsResolve('crown'),work:propertyRightsResolve('crown')};let corridorFields=[privateField];occupiedGroundFields=cells=>new Set(cells.length?corridorFields:[]);occupiedGroundAreas=()=>new Map();
 const street={pts:[{x:0,z:-100},{x:0,z:100}],hw:3,kind:'main'};s.streets=[street];streetAccessAt=(town,p)=>town===s&&s.streets.some(st=>!st.gone&&!st.hidden&&(st.pts||[]).some((v,k,Q)=>k&&segDist(p.x,p.z,Q[k-1],v)<.1));
 // Terrain and native pathfinding are controlled boundaries; actual route, overlap, raster, title and payment clients run unchanged.
 let blocked=false,routeCalls=0;armyObstacle=()=>blocked;armySegmentClear=()=>!blocked;roadAccessClear=()=>!blocked;armyReach=()=>null;armyReachFrom=()=>false;armyReachClosed=()=>false;armyReachCovers=()=>false;armyReaches=()=>true;armyLandPath=(walker,P)=>{routeCalls++;return blocked?null:P;};
 const placed={near:()=>[]};s._lay.placed=placed;s._lay.segH={near:()=>s.streets.flatMap(st=>st.pts.slice(1).map((b,k)=>({a:st.pts[k],b,st,hw:st.hw})))};
 const base={key:'church',arch:'temple',tier:0,hm:1,accessMode:'abbey-rural',accessDonor:0,f:{x:200,z:0,w:12,d:22,rot:0}};
 `);if(beforeCapture)r.eval(beforeCapture);r.eval([constant('ABBEY_APPROACH_SURVEY_CURRENT'),constant('ABBEY_APPROACH_SURVEY_NATIVE')].join('\n'));return r;}

test('rural abbey survey retains a paid long native approach and exempts only actual public surface',()=>{const r=ruralSetup();const cash=coins(r);r.eval(`const short=storageRoadPlan(s,base.f,s._lay.placed,s._lay.segH),site=abbeyApproachPlan(s,base,a.storageOwnerId),length=polyLen(site.path),recipe=abbeyApproachRecipe(s,site,{labour:120,days:360,timber:40,stone:0}),claim=abbeyApproachClaim(s,site,a);`);assert.equal(r.eval('short'),null);assert.ok(r.eval('length>150&&site.access.endpoint.kind===\"street\"&&site.access.endpoint.ref===0'));assert.ok(r.eval('abbeyApproachClear(s,site)'));assert.ok(r.eval('site.access.privatePolys.every(P=>P.every(p=>p.x>=3-1e-6))'));assert.ok(r.eval('site.access.land>0&&claim.ok&&claim.recipients.length===1&&claim.recipients[0].donated&&claim.recipients[0].due===0'));near(r.eval('recipe.labour'),120+r.eval('length')*.6);near(r.eval('recipe.days'),360+20+r.eval('length')/4);near(r.eval('recipe.timber'),40+r.eval('length')*.005);assert.equal(r.eval('W.projects.length'),0);near(coins(r),cash);});

test('public endpoint, terrain, existing building and pending full corridor remain current vetoes',()=>{const r=ruralSetup();r.eval('const site=abbeyApproachPlan(s,base,a.storageOwnerId);');for(const change of ['street.gone=true','street.hidden=true','street.pts[0].x=street.pts[1].x=8','blocked=true']){r.eval(change);assert.equal(r.eval('abbeyApproachClear(s,site)'),false,change);r.eval('street.gone=false;street.hidden=false;street.pts[0].x=street.pts[1].x=0;blocked=false');}r.eval("const obstacle={x:100,z:12.2,w:8,d:8,rot:0,state:'sound'};s.buildings.push(obstacle)");assert.equal(r.eval('abbeyApproachClear(s,site)'),false);r.eval("s.buildings.pop();const pending={type:'compound',si:0,site:{path:[{x:100,z:-20},{x:100,z:20}]}};W.projects.push(pending)");assert.equal(r.eval('abbeyApproachClear(s,site)'),false);assert.equal(r.eval('abbeyApproachClear(s,site,pending)'),true);r.eval('pending.dead=true');assert.equal(r.eval('abbeyApproachClear(s,site)'),true);r.eval("W.roads=[{a:0,b:1,path:[{x:100,z:-40},{x:300,z:-40}]}];site.path=[serviceDoor(site.f,0),serviceDoor(site.f),{x:200,z:-40}];site.access.pathKey=JSON.stringify(site.path);site.access.endpoint={kind:'road',ref:0,segment:1,point:{x:200,z:-40}};");assert.equal(r.eval('abbeyApproachClear(s,site)'),false,'a connector cannot cut back through its own future nave');});

test('a public-core mask cannot erase native private ownership or an active tenant work right',()=>{const r=ruralSetup();r.eval('const site=abbeyApproachPlan(s,base,a.storageOwnerId);privateField.wk=H[0]._hh;privateField.title.work=propertyRightsResolve(H[0]._hh);');assert.equal(r.eval('abbeyApproachClaim(s,site,a).ok'),false);assert.equal(r.eval('abbeyApproachClaim(s,site,a).reason'),'occupied-holding');assert.equal(r.eval('abbeyApproachPlan(s,base,a.storageOwnerId)'),null);r.eval('privateField.wk=privateField.own=H[0]._hh;privateField.title={own:propertyRightsResolve(H[0]._hh),work:propertyRightsResolve(H[0]._hh)};const owned=abbeyApproachClaim(s,site,a)');assert.ok(r.eval('owned.ok&&owned.recipients[0].owner===H[0]._hh&&owned.recipients[0].due>0'));});

test('fixed corridor receipt pays a native freeholder once and survives lawful succession without changing the parcel',()=>{const r=ruralSetup();r.eval('privateField.wk=privateField.own=H[0]._hh;privateField.title={own:propertyRightsResolve(H[0]._hh),work:propertyRightsResolve(H[0]._hh)};const site=abbeyApproachPlan(s,base,a.storageOwnerId),q={site,paid:0},before=H[0]._hh.assets.w;');const cash=coins(r);r.eval('const R=abbeyApproachPay(q,s,a)');assert.ok(r.eval('R.ok&&q.approachPaid&&q.approachCash>0'));near(r.eval('H[0]._hh.assets.w-before'),r.eval('q.approachCash'));near(coins(r),cash);assert.ok(r.eval('privateField.own===H[0]._hh&&privateField.wk===H[0]._hh'));r.eval('const recorded=JSON.stringify(q.approachClaim),paid=q.approachCash;privateField.wk=privateField.own=H[1]._hh;privateField.title={own:propertyRightsResolve(H[1]._hh),work:propertyRightsResolve(H[1]._hh)};W.monarch.dead=true;W.monarch.alive=false;abbeyApproachPay(q,s,a)');near(r.eval('q.approachCash'),r.eval('paid'));assert.equal(r.eval('JSON.stringify(q.approachClaim)'),r.eval('recorded'));assert.equal(r.eval('abbeyApproachClaim(s,site,a,q).ok'),true);r.eval('q.site.access.privatePolys=[obbCorners(250,200,5,5,0)]');assert.equal(r.eval('abbeyApproachClaim(s,q.site,a,q).reason'),'ground-footprint-changed');});

test('donor permission is issued with actual commission, and an unpaid stale proposal cannot retain a deceased donor gift',()=>{const r=ruralSetup();r.eval('const site=abbeyApproachPlan(s,base,a.storageOwnerId),q={site,paid:0},old=abbeyApproachClaim(s,site,a);W.monarch.dead=true;W.monarch.alive=false;const current=abbeyApproachClaim(s,site,a);');assert.ok(r.eval('old.recipients[0].donated&&old.recipients[0].due===0&&current.recipients[0].due>0'));r.eval('const gold=a.gold;a.gold=0;const fail=abbeyApproachPay(q,s,a);a.gold=gold');assert.equal(r.eval('fail.ok'),false);assert.equal(r.eval('q.approachPaid'),undefined);r.eval('W.monarch.dead=false;W.monarch.alive=true;const given=abbeyApproachPay(q,s,a);W.monarch.dead=true;W.monarch.alive=false;const recorded=JSON.stringify(q.approachClaim);abbeyApproachPay(q,s,a)');assert.ok(r.eval('given.ok&&q.approachPaid&&q.approachCash===0&&q.approachClaim.recipients[0].donated'));assert.equal(r.eval('JSON.stringify(q.approachClaim)'),r.eval('recorded'));});

test('highway access retains the actual road endpoint and refuses later native replacement',()=>{const r=ruralSetup();r.eval("s.streets=[];W.roads=[{a:0,b:1,path:[{x:180,z:-100},{x:180,z:100}]}];const site=abbeyApproachPlan(s,base,a.storageOwnerId)");assert.ok(r.eval('site&&site.access.endpoint.kind===\"road\"&&abbeyApproachClear(s,site)'));r.eval('W.roads[0].path[0].x=W.roads[0].path[1].x=160');assert.equal(r.eval('abbeyApproachClear(s,site)'),false);r.eval('W.roads=[]');assert.equal(r.eval('abbeyApproachClear(s,site)'),false);});

test('commission acquires the exact corridor before any building work and preserves a separate building grant',()=>{const r=ruralSetup();r.eval(`
 f.x=200;f.area=10000;occupiedGroundFields=cells=>new Set(cells.length&&cells.every(c=>cellX(c%GRID)>160)?[f]:[f,privateField]);
 s._lay.live.compoundSite=(site,mode)=>mode==='validate'&&abbeyApproachClear(s,site)?site:null;
 const site=abbeyApproachPlan(s,base,a.storageOwnerId),plan={adapter:'abbey',key:'church',ownerId:a.storageOwnerId,payerId:a.storageOwnerId,site,labour:120,days:360,timber:40,stone:0,purposes:['worship'],requires:[]};
 const grantOK=abbeyGroundOwned(a,site),q=compoundProjectCommission(s,C,plan);`);
 assert.equal(r.eval('grantOK'),true);assert.ok(r.eval('q&&q.approachPaid&&q.worked===0&&!q.materials&&q.approachClaim.cells.length>0'));assert.equal(r.eval('W.bldList.length'),0);assert.ok(r.eval('privateField.own===\"crown\"&&privateField.wk===\"crown\"&&privateField.core===0&&privateField.alms===null'));r.eval('q.site.path[1].x+=2');assert.equal(r.eval('abbeyApproachClear(s,q.site,q)'),false);
});

test('later ranges may reach an actual completed paid rural alley with its retained highway connection',()=>{const r=ruralSetup();r.eval(`s.streets=[];W.roads=[{a:0,b:1,path:[{x:0,z:-100},{x:0,z:100}]}];
 const paid={pts:[{x:200,z:12.2},{x:150,z:12.2},{x:0,z:12.2}],hw:1.3,kind:'alley',compoundAccess:true,accessEndpoint:{kind:'road',ref:0,segment:1,point:{x:0,z:12.2}}};s.streets.push(paid);
 // This lane reaches a real highway but has no town-rooted streetGraph nodes.
 streetAccessAt=()=>false;const connected=abbeyPublicStreet(s,paid),second={...base,key:'grange',f:{...base.f,x:150,z:40,rot:Math.PI}},site=abbeyApproachPlan(s,second,a.storageOwnerId);`);
 assert.equal(r.eval('connected'),true);assert.ok(r.eval('site&&site.access.endpoint.kind===\"street\"&&polyLen(site.path)<60&&abbeyApproachClear(s,site)'));r.eval('W.roads=[]');assert.equal(r.eval('abbeyPublicStreet(s,paid)'),false);assert.equal(r.eval('abbeyApproachClear(s,site)'),false);
});


test('ordinary craft premises refuse private abbey industry while public rooms and qualified recruitment remain available',()=>{const r=setup();building(r,'tannery');building(r,'mill','windmill');r.eval("const privateTanner=craftRoomQuote(s,H[2],'tanner'),privateMiller=craftRoomQuote(s,H[2],'miller');const eligible=abbeyIndustryCandidate(a,s,'tanner');const publicTannery={idx:20,s,arch:'tannery',state:'sound',ownerId:'crown',w:15,d:8};const publicMill={idx:21,s,arch:'windmill',state:'sound',ownerId:'crown',w:6,d:6};s.buildings.push(publicTannery,publicMill);const tanner=craftRoomQuote(s,H[2],'tanner'),miller=craftRoomQuote(s,H[2],'miller');const classroom={idx:22,s,arch:'hall',state:'sound',abbey:a.storageOwnerId,compoundKey:'school'}");assert.equal(r.eval('privateTanner'),null);assert.equal(r.eval('privateMiller'),null);assert.ok(r.eval('eligible===H[2]&&H[2].craft.qualified'));assert.ok(r.eval('tanner.b===publicTannery&&miller.b===publicMill'));assert.equal(r.eval('craftRoomValid(s,classroom,"carpenter")'),true);assert.equal(r.eval('btannery.craftMasters'),undefined);assert.equal(r.eval('bmill.craftMasters'),undefined);});


test('operation bounds retain native polygon and rotated-footprint decisions at the tolerance boundary',()=>{
 const r=ruralSetup();r.eval('const origin=obbCorners(0,0,2,2,0),A=abbeySurveyBounds(origin);');
 for(const gap of [-.01,-0,0,.009999,.01,.010001,1,100]){
  r.C.gap=gap;r.eval('var other=obbCorners(2+gap,0,2,2,0);');
  const exact=r.eval('graveyardPolygonsOverlap(origin,other)'),broad=r.eval('abbeySurveyBoxesMayHit(A,abbeySurveyBounds(other))');
  assert.equal(r.eval('abbeySurveyBoxesMayHit(A,abbeySurveyBounds(other))&&graveyardPolygonsOverlap(origin,other)'),exact,`polygon gap ${gap}`);
  if(gap<=.01)assert.equal(broad,true,`retain boundary ${gap}`);
 }
 for(const rot of [0,Math.PI/8,Math.PI/4,Math.PI/2,Math.PI])for(const gap of [-.000001,0,.000001,.009999,.01,.010001,10]){
  r.C.rot=rot;r.C.gap=gap;r.eval(`var building={x:100,z:100,w:8,d:12,rot},c=Math.cos(rot),sn=Math.sin(rot),g={a:{x:100+(4+1.6+gap)*c-30*sn,z:100-(4+1.6+gap)*sn-30*c},b:{x:100+(4+1.6+gap)*c+30*sn,z:100-(4+1.6+gap)*sn+30*c},hw:1.3};`);
  assert.equal(r.eval('abbeySurveyBoxesMayHit(abbeySurveyBounds([g.a,g.b]),abbeySurveyBounds(obbCorners(building.x,building.z,building.w,building.d,building.rot)),Math.SQRT2*1.6)&&streetFootprintOverlap(building,g,.3)'),r.eval('streetFootprintOverlap(building,g,.3)'),`rotated ${rot}/${gap}`);
 }
 assert.equal(r.eval('abbeySurveyBounds([{x:NaN,z:0}])'),null);
 for(const bad of ['null','{minX:NaN,maxX:1,minZ:0,maxZ:1}','{minX:-Infinity,maxX:1,minZ:0,maxZ:1}'])assert.equal(r.eval(`abbeySurveyBoxesMayHit(A,${bad})`),true);
 assert.equal(r.eval('abbeySurveyBoxesMayHit(A,A,-1)'),true);
});

test('fresh synchronous survey agrees with unfactored native checks for pending, graveyard and current mutations',()=>{
 const r=ruralSetup();r.eval(`const site=abbeyApproachPlan(s,base,a.storageOwnerId),fastBounds=abbeySurveyBoxesMayHit,nativeReserved=castleFoundationReserved;
  const obstruction={x:100,z:60,w:8,d:8,rot:Math.PI/4,state:'sound'},grave={poly:obbCorners(90,70,6,6,0)},pending={type:'compound',si:0,site:{path:[{x:80,z:60},{x:120,z:60}]}};
  obstruction._graveyard=grave;s.buildings.push(obstruction);W.projects.push(pending);`);
 const compare=label=>{const fast=r.eval('abbeyApproachClear(s,site)');r.eval('castleFoundationReserved=(...args)=>nativeReserved(...args)');assert.equal(r.eval('abbeyApproachSurvey(s).native'),false);const cold=r.eval('abbeyApproachClear(s,site)');r.eval('castleFoundationReserved=nativeReserved');assert.equal(fast,cold,label);return fast;};
 assert.equal(compare('remote native items'),true);
 r.eval('pending.site.path[0].z=pending.site.path[1].z=12.2');assert.equal(compare('live project enters corridor'),false);
 r.eval('pending.dead=true');assert.equal(compare('dead project releases native reservation'),true);
 r.eval('obstruction.z=12.2');assert.equal(compare('standing rotated footprint'),false);
 r.eval('obstruction.removed=true');assert.equal(compare('removed building no longer blocks'),true);
 r.eval('obstruction.removed=false;obstruction.z=60;grave.poly=obbCorners(90,12.2,6,6,0)');assert.equal(compare('native active graveyard'),false);
 r.eval('grave.removed=true');assert.equal(compare('removed graveyard'),true);
 r.eval('street.hidden=true');assert.equal(compare('actual endpoint lost'),false);
 r.eval('street.hidden=false;const retained=abbeyApproachSurvey(s);castleFoundationReserved=()=>true');assert.equal(r.eval('abbeyApproachClear(s,site,undefined,retained)'),false,'replaced native predicate disables an existing operation context');r.eval('castleFoundationReserved=nativeReserved;site.path[1].x=NaN');assert.equal(compare('invalid retained geometry'),false);
});

test('distant pending geometry avoids native distance work without changing the paid route or polygon order',()=>{
 const r=ruralSetup();r.eval(`const site=abbeyApproachPlan(s,base,a.storageOwnerId),fastBounds=abbeySurveyBoxesMayHit;
  for(let k=0;k<120;k++)W.projects.push({type:'compound',si:0,site:{f:{x:1500+k*3,z:1800+k*2,w:8,d:12,rot:k*.1},path:[{x:1500+k*3,z:1800+k*2},{x:1510+k*3,z:1800+k*2}]}});
  const nativeHypot=Math.hypot;let distanceCalls=0;Math.hypot=(...args)=>{distanceCalls++;return nativeHypot(...args)};
  const clear=abbeyApproachClear(s,site),fast=distanceCalls;distanceCalls=0;abbeySurveyBoxesMayHit=()=>true;
  const reference=abbeyApproachClear(s,site),unbounded=distanceCalls;abbeySurveyBoxesMayHit=fastBounds;Math.hypot=nativeHypot;
  const privateFast=JSON.stringify(abbeyApproachPrivate(s,site.path));abbeySurveyBoxesMayHit=()=>true;const privateReference=JSON.stringify(abbeyApproachPrivate(s,site.path));abbeySurveyBoxesMayHit=fastBounds;`);
 assert.equal(r.eval('clear'),r.eval('reference'));assert.ok(r.eval('clear&&unbounded>10000&&fast<unbounded/10'));
 assert.equal(r.eval('privateFast'),r.eval('privateReference'));
});

test('physical-grant preflight preserves short native access queries and refuses before remote pathfinding',()=>{
 const r=ruralSetup();r.eval(`const accessNative=institutionFoundationAccess;let prefixCalls=0,legalCalls=0;institutionFoundationAccess=(...args)=>{prefixCalls++;return accessNative(...args)};
  const noGrant=abbeyApproachPlan(s,base,a.storageOwnerId,undefined,undefined,()=>{legalCalls++;return false});`);
 assert.equal(r.eval('noGrant'),null);assert.equal(r.eval('prefixCalls'),1);assert.equal(r.eval('legalCalls'),1);assert.equal(r.eval('routeCalls'),0);
 r.eval('const legal=abbeyApproachPlan(s,base,a.storageOwnerId,undefined,undefined,()=>true)');assert.ok(r.eval('legal&&abbeyApproachClear(s,legal)&&routeCalls>0'));
});


test('own mill preflight carries actual wheel ground and rejects lost grant or power before remote routing',()=>{
 const r=ruralSetup();lay(r,0,'miller');lay(r,1,'ploughman');lay(r,2,'ploughman');
 const method=source.slice(source.indexOf('    compoundSite(site,'),source.indexOf('    fabricSite(site,'));assert.ok(method.includes('surveyContext,groundLegal'));
 const arches=source.match(/^const ARCH=\{[\s\S]*?^\};/m)?.[0];assert.ok(arches);
 r.eval(arches);r.eval(`const fits=()=>true;s._lay.live.compoundSite=({${method}}).compoundSite;
  const bank={x:200,z:0,w:9,d:9,rot:0,arch:'mill',millWater:{x:180,z:0,y:2,kind:'river',side:0}};millBankSites=()=>[bank];
  s.river=true;delete s.technology.adopted.windmill;f.area=10000;W.land.perHead=5000;a.workArea=f.area;a.workRatio=1;a.workingHands=3;s._gYield=.001;
  let grantOK=false,waterOK=true;occupiedGroundFields=()=>new Set(grantOK?[f]:[privateField]);const nativeRiver=riverAt;riverAt=(...args)=>waterOK?nativeRiver(...args):null;
  const nativeGround=abbeyGroundOwned;let sawWheel=false;abbeyGroundOwned=(owner,site)=>{sawWheel ||= site.polys?.length===1&&site.polys[0].some(p=>p.x===179);return nativeGround(owner,site)};
  const unowned=abbeyMillPlan(a,s);`);
 assert.equal(r.eval('unowned'),null);assert.equal(r.eval('routeCalls'),0);assert.equal(r.eval('sawWheel'),true);
 r.eval('grantOK=true;waterOK=false;const dry=abbeyMillPlan(a,s)');assert.equal(r.eval('dry'),null);assert.equal(r.eval('routeCalls'),0);
 r.eval('waterOK=true;const powered=abbeyMillPlan(a,s)');assert.ok(r.eval('powered&&powered.site.millWater===bank.millWater&&powered.site.polys.length===1&&routeCalls>0'));assert.ok(r.eval("powered.site.arch==='mill'&&powered.ownerId===a.storageOwnerId&&powered.requires.join(',')==='church,grange'"));
});


function routeSetup(beforeCapture=''){const readers=['armyLandPath','armyDetour','armyReach','armyReaches','armyReachClosed','armyReachFrom','armyReachCovers','armySegmentClear','armyObstacle','armyBridgeAt','armyRaftAt','armyCauseway','hAt','riverAt','onRoad','paidRoadAt','walkedRoadAt','roadWalkedBounds','roadBounds','fortGround','fortSurface','motteSurface','fortCircuits','casRing','fortCenter','wallRadAt','wallKindAt','wallBuilt','wallProg','wallDmgAt','fortGateAngles','wallGates','citadelBarrier','citadelLocal','citadelBastion','citadelFootprintAt','citadelTownCut','hostileTo','atWar','inRevolt','inPoly','makeHash'];
 const r=ruralSetup([constant('sstep'),constant('cIdx'),constant('inB'),constant('toCell'),...readers.map(fn),`HASH_STAMP=0;const SEA_SURFACE=.5,BACKGROUND=null,MOTTEH=9;W.h=new Float32Array(GRID*GRID).fill(10);W.dom=new Int16Array(GRID*GRID);W.roads=[];W.feuds=[];W.clock={day:now};W.rivHash=makeHash(40);s._lay.placed=makeHash(16);
  const nativeHeight=hAt;let heightCalls=0;hAt=(...args)=>{heightCalls++;return nativeHeight(...args)};`].join('\n'));
 if(beforeCapture)r.eval(beforeCapture);r.eval(constant('ABBEY_ROUTE_SURVEY_NATIVE'));return r;}

test('shared native world edges retain exact directions, signed zeros and independent ghost samples',()=>{
 const r=routeSetup();r.eval(`const terrain=abbeyRouteTerrain(s),routes=[
   [{x:-20,z:20},{x:-18,z:20}],[{x:-18,z:20},{x:-20,z:20}],[{x:-20,z:20},{x:-18,z:22}],
   [{x:0,z:0},{x:2,z:0}],[{x:-0,z:0},{x:2,z:0}],[{x:0,z:-0},{x:2,z:0}],
   [{x:-19.5,z:20},{x:-18,z:20}],[{x:278,z:0},{x:280,z:0}]],ghosts=[null,
   {x:100,z:100,w:4,d:4,rot:0},{x:-19,z:20,w:4,d:4,rot:Math.PI/4},
   {x:-19,z:21.6,w:4,d:2,rot:0},{x:-19,z:21.6-1e-12,w:4,d:2,rot:0},{x:-19,z:21.6+1e-12,w:4,d:2,rot:0}];
  const comparisons=[];for(const ghost of ghosts)for(const [p,q]of routes){const ordinary={house:s.owner,settlement:s,placed:s._lay.placed,requireRoadCrossing:true,waterClearance:2.3,ghost};comparisons.push([armySegmentClear({...ordinary,_em:abbeyRouteMemo(terrain)},p,q),armySegmentClear(ordinary,p,q)]);}
  const forward=armySegmentClear({house:s.owner,settlement:s,placed:s._lay.placed,requireRoadCrossing:true,waterClearance:2.3,_em:abbeyRouteMemo(terrain)},routes[0][0],routes[0][1]);
  const currencies=[W.treasury,a.gold,...W.households.values()].map(v=>typeof v==='object'?v.assets.w:v);`);
 assert.ok(r.eval('terrain&&comparisons.every(([shared,cold])=>shared===cold)&&forward'));
 assert.ok(r.eval('terrain.memo.size>0&&terrain.memo.scopes.size>0&&terrain.memo.circuits.size>0'));
 assert.equal(r.eval('W.projects.length'),0);assert.equal(r.eval('W.bldList.length'),0);
});

test('shared native terrain avoids repeated world reads and refuses stale walker or replaced helper inputs',t=>{
 const r=routeSetup();r.eval(`const terrain=abbeyRouteTerrain(s),p={x:-20,z:20},q={x:-18,z:22},ordinary={house:s.owner,settlement:s,placed:s._lay.placed,requireRoadCrossing:true,waterClearance:2.3};
  heightCalls=0;for(let k=0;k<100;k++)armySegmentClear(ordinary,p,q);const cold=heightCalls;
  heightCalls=0;for(let k=0;k<100;k++)armySegmentClear({...ordinary,ghost:{x:80+k,z:80,w:6,d:6,rot:k*.03},_em:abbeyRouteMemo(terrain)},p,q);const shared=heightCalls;
  const cached=terrain.memo.size;const replacement=hAt;hAt=(x,z)=>x< -18.5?10:50;const replaced=armySegmentClear({...ordinary,_em:abbeyRouteMemo(terrain)},p,q),freshReplaced=armySegmentClear(ordinary,p,q);hAt=replacement;
  const badClearance={...ordinary,waterClearance:3.7,_em:abbeyRouteMemo(terrain)},differentHouse={...ordinary,house:2,_em:abbeyRouteMemo(terrain)};
  const clearance=armySegmentClear(badClearance,p,q),freshClearance=armySegmentClear({...badClearance,_em:undefined},p,q),house=armySegmentClear(differentHouse,p,q),freshHouse=armySegmentClear({...differentHouse,_em:undefined},p,q);
  now++;const stale=abbeyRouteMemo(terrain),current=abbeyRouteTerrain(s);
  const building={x:-18,z:22,w:4,d:4,rot:0,state:'sound',arch:'house'};s.buildings.push(building);s._lay.placed.add(building,3);const next=abbeyRouteTerrain(s),newObstruction=armySegmentClear({...ordinary,_em:abbeyRouteMemo(next)},p,q);`);
 t.diagnostic(JSON.stringify(r.eval('({cold,shared,cached})')));assert.ok(r.eval('cold>0&&shared<cold/20&&cached>0'));assert.equal(r.eval('replaced'),r.eval('freshReplaced'));assert.equal(r.eval('replaced'),false);
 assert.equal(r.eval('clearance'),r.eval('freshClearance'));assert.equal(r.eval('house'),r.eval('freshHouse'));assert.equal(r.eval('stale'),undefined);
 assert.equal(r.eval('newObstruction'),false);assert.ok(r.eval('current!==terrain&&next!==terrain'));
});

test('native paid crossing bounds are first read normally and stay identical on shared world-edge recall',()=>{
 const r=routeSetup();r.eval(`const water={a:{x:0,z:-100},b:{x:0,z:100},hw:2,y:10,x:0,z:0};W.rivHash.add(water,103);const road={a:0,b:1,path:[{x:-12,z:20},{x:12,z:20}]};W.roads.push(road);
  const terrain=abbeyRouteTerrain(s),p={x:-2,z:20},q={x:0,z:20},ordinary={house:s.owner,settlement:s,placed:s._lay.placed,requireRoadCrossing:true,waterClearance:2.3};
  const firstGhost=armySegmentClear({...ordinary,ghost:{x:0,z:20,w:4,d:4,rot:0},_em:abbeyRouteMemo(terrain)},p,q),ghostBounds=JSON.stringify(road._bb),ghostCached=terrain.memo.size;
  const first=armySegmentClear({...ordinary,_em:abbeyRouteMemo(terrain)},p,q),bounds=JSON.stringify(road._bb),reach=onRoad.reach;
  const next=armySegmentClear({...ordinary,_em:abbeyRouteMemo(terrain)},p,q),retainedBounds=JSON.stringify(road._bb),retainedReach=onRoad.reach;
  const cold=armySegmentClear(ordinary,p,q);`);
 assert.ok(r.eval('first&&next&&cold'));assert.equal(r.eval('bounds'),r.eval('retainedBounds'));assert.equal(r.eval('reach'),r.eval('retainedReach'));
 assert.equal(r.eval('firstGhost'),false);assert.equal(r.eval('ghostCached'),0);assert.equal(r.eval('ghostBounds'),r.eval('bounds'),'first obstructing ghost retains original native paid-road read prefix');
 assert.equal(r.eval('HASH_STAMP'),0,'native river/building cell reads do not advance a discarded query stamp');
});


test('actual native service detours retain route choices when different poses share ghost-free terrain',()=>{
 const r=routeSetup();r.eval(`const building={x:10,z:0,w:6,d:8,rot:.2,state:'sound',arch:'house'};s.buildings.push(building);s._lay.placed.add(building,6);
  s.streets=[{kind:'road',pts:[{x:26,z:-10},{x:26,z:10}],hw:3}];const terrain=abbeyRouteTerrain(s),ghosts=[
   {x:-15,z:-6,w:6,d:8,rot:0},{x:-12,z:0,w:6,d:8,rot:.4},{x:2,z:8,w:6,d:6,rot:-.5}],out=[];
  for(const ghost of ghosts){const p={x:-20,z:0},shared=serviceRoadPlan(s,p,s._lay.placed,null,1.3,abbeyRouteMemo(terrain),ghost,terrain.banks),cold=serviceRoadPlan(s,p,s._lay.placed,null,1.3,undefined,ghost);
   out.push([JSON.stringify(shared?.path),JSON.stringify(cold?.path),shared?.street===cold?.street,shared?.path.length||0]);}
  const worldLeaks=Reflect.ownKeys(W).filter(k=>k==='terrain'||k==='abbeyTerrain'||k==='banks'||k==='memo');`);
 assert.ok(r.eval('out.every(([shared,cold,street,len])=>shared===cold&&street&&len>2)'));
 assert.equal(r.eval('worldLeaks.length'),0);assert.equal(r.eval('W.projects.length'),0);
});

test('rural native planner discards both segment memo and flood banks when proposal inputs change',()=>{
 const mutations=['','s.owner=2','s._lay.placed=makeHash(16)','terrain.world={}','terrain.day--','terrain.size--','terrain.cell--','armyReach=(...args)=>capturedReach(...args)'];
 for(const mutation of mutations){const r=routeSetup(`const originalService=serviceRoadPlan,capturedReach=armyReach;let supplied;
   serviceRoadPlan=(...args)=>{supplied={memo:args[5],banks:args[7]};return originalService(...args)};`);
  r.eval(`const terrain=abbeyRouteTerrain(s),survey={s,native:false,terrain},before=JSON.stringify(s.stores),gold=a.gold;
   ${mutation};const quoted=abbeyApproachPlan(s,base,a.storageOwnerId,undefined,survey);`);
  assert.ok(r.eval('quoted&&abbeyApproachClear(s,quoted)&&quoted.access.endpoint.ref===0'),mutation||'unchanged');
  assert.equal(r.eval('!!supplied.memo'),!mutation,`${mutation||'unchanged'} memo`);assert.equal(r.eval('!!supplied.banks'),!mutation,`${mutation||'unchanged'} banks`);
  assert.equal(r.eval('JSON.stringify(s.stores)'),r.eval('before'));near(r.eval('a.gold'),r.eval('gold'));assert.equal(r.eval('W.projects.length'),0);
 }
});

test('native certified flood banks retain an unreachable result for a second actual door',()=>{
 const r=routeSetup();r.eval(`W.h.fill(0);for(const xs of [[5,6],[10,11]])for(const i of xs)for(const j of [7,8,9])W.h[cIdx(i,j)]=10;
  s.streets=[{kind:'road',pts:[{x:100,z:5},{x:100,z:15}],hw:3},{kind:'road',pts:[{x:100,z:25},{x:100,z:35}],hw:3}];
  const terrain=abbeyRouteTerrain(s),out=[];for(const x of [-100,-96]){const p={x,z:20},ghost={x,z:0,w:8,d:8,rot:0},shared=serviceRoadPlan(s,p,s._lay.placed,null,1.3,abbeyRouteMemo(terrain),ghost,terrain.banks),cold=serviceRoadPlan(s,p,s._lay.placed,null,1.3,undefined,ghost);out.push([shared,cold]);}
  const certified=terrain.banks.floods.every(R=>armyReachClosed(R,{house:s.owner,settlement:s,placed:s._lay.placed,requireRoadCrossing:true,waterClearance:2.3,_em:terrain.memo}));`);
 assert.ok(r.eval('out.every(([shared,cold])=>shared===null&&cold===null)'));assert.ok(r.eval('terrain.banks.floods.length>0&&certified'));
 assert.equal(r.eval('W.projects.length'),0);assert.equal(r.eval('HASH_STAMP'),0);
});

test('conservative spatial buckets preserve source order, touching tolerance and unknown bounds',()=>{
 const r=ruralSetup();r.eval(`const rows=Array.from({length:24},(_,k)=>({k})),boxes=rows.map(({k})=>abbeySurveyBounds(obbCorners((k-12)*128,0,10,10,k*.13)));
  boxes[3]=null;boxes[7]={minX:-1e20,maxX:1e20,minZ:-1e20,maxZ:1e20};const index=abbeySurveyIndex(rows,boxes,new Set([15]));`);
 for(const x of [-256.010002,-256.01,-256,-128.000001,-128,0,128,256,1e20])for(const pad of [0,.01,Math.SQRT2*1.6]){r.C.queryX=x;r.C.queryPad=pad;r.eval(`var query=abbeySurveyBounds(obbCorners(queryX,0,10,10,.2)),picked=abbeySurveyIndexRows(index,query,queryPad),eligible=rows.filter((row,k)=>!boxes[k]||k===15||abbeySurveyBoxesMayHit(query,boxes[k],queryPad));`);
  assert.ok(r.eval('eligible.every(row=>picked.includes(row))&&picked.every((row,k)=>!k||picked[k-1].k<row.k)'),`${x}/${pad}`);
 }
 assert.equal(r.eval('abbeySurveyIndexRows(index,null).length'),24);assert.equal(r.eval('abbeySurveyIndexRows(index,{minX:NaN,maxX:0,minZ:0,maxZ:0}).length'),24);
});

test('spatial native clearance preserves declines while sparing distant building and project row reads',()=>{
 const r=ruralSetup();r.eval(`const site=abbeyApproachPlan(s,base,a.storageOwnerId);for(let k=0;k<240;k++){s.buildings.push({x:1700+k*3,z:1900,w:8,d:12,rot:k*.1,state:'sound'});W.projects.push({type:'compound',si:0,site:{f:{x:1700+k*3,z:-1900,w:8,d:12,rot:k*.1}}});}
  const context=abbeyApproachSurvey(s);let reads=0;const count=rows=>new Proxy(rows,{get(target,key,receiver){if(typeof key==='string'&&/^\\d+$/.test(key))reads++;return Reflect.get(target,key,receiver)}});
  context.buildings=context.buildingIndex.rows=count(context.buildings);context.projects=context.projectIndex.rows=count(context.projects);
  const indexed=abbeyApproachClear(s,site,undefined,context),fast=reads;reads=0;context.buildingIndex=context.projectIndex=null;const linear=abbeyApproachClear(s,site,undefined,context),slow=reads;
  const obstacle={x:100,z:12.2,w:8,d:8,rot:.2,state:'sound'};s.buildings.push(obstacle);const current=abbeyApproachSurvey(s),declined=abbeyApproachClear(s,site,undefined,current);current.buildingIndex=current.projectIndex=null;const coldDeclined=abbeyApproachClear(s,site,undefined,current);`);
 assert.ok(r.eval('indexed&&linear&&slow>900&&fast<slow/20'));assert.equal(r.eval('declined'),false);assert.equal(r.eval('declined'),r.eval('coldDeclined'));assert.equal(r.eval('W.projects.length'),240);
});

test('uninterrupted native detour certifies once and restores its scope at actual entry boundaries',()=>{
 const r=routeSetup();r.eval(`const nativeCert=abbeyRouteSurveyNative;let certCalls=0;abbeyRouteSurveyNative=()=>{certCalls++;return nativeCert()};
  const building={x:10,z:0,w:6,d:8,rot:.2,state:'sound',arch:'house'};s.buildings.push(building);s._lay.placed.add(building,6);
  const terrain=abbeyRouteTerrain(s),walker={house:s.owner,settlement:s,placed:s._lay.placed,requireRoadCrossing:true,waterClearance:2.3,ghost:{x:-15,z:-6,w:6,d:8,rot:0},_em:abbeyRouteMemo(terrain)},p={x:-20,z:0},q={x:26,z:0};certCalls=0;
  const shared=armyLandPath(walker,[p,q]),checks=certCalls,cold=armyLandPath({...walker,_em:undefined},[p,q]),leftover=walker._em.abbeyRouteGuard;
  const retained=walker._em,originalHeight=hAt;hAt=()=>0;const stale=armyLandPath(walker,[p,q]),fresh=armyLandPath({...walker,_em:undefined},[p,q]);hAt=originalHeight;`);
 assert.ok(r.eval('shared.length>2&&JSON.stringify(shared)===JSON.stringify(cold)&&checks===1'));assert.equal(r.eval('leftover'),undefined);
 assert.equal(r.eval('stale'),r.eval('fresh'));assert.equal(r.eval('stale'),null);assert.equal(r.eval('walker._em===retained'),true);assert.equal(r.eval('walker._em.abbeyRouteGuard'),undefined);
});

test('full Abbey corridor finds a usable detour where the old skinny native street route is declined',t=>{
 const r=routeSetup();const cash=coins(r);r.eval(`base.f={x:-20,z:-19.2,w:12,d:22,rot:0};s.streets=[{kind:'main',pts:[{x:60,z:-100},{x:60,z:100}],hw:3}];
  for(const z of [-13,-1.5]){const b={x:10,z,w:6,d:8,rot:0,state:'sound',arch:'house'};s.buildings.push(b);s._lay.placed.add(b,6);}
  const p=serviceDoor(base.f),face=serviceDoor(base.f,0),skinny=serviceRoadPlan(s,p,s._lay.placed,null,1.3,undefined,base.f),oldPath=[face,...skinny.path],old={...base,path:oldPath,access:{endpoint:abbeyAccessEndpoint(s,oldPath),pathKey:JSON.stringify(oldPath)}};
  const oldFits=abbeyApproachClear(s,old),quote=abbeyApproachPlan(s,base,a.storageOwnerId),clear=quote&&abbeyApproachClear(s,quote),claim=quote&&abbeyApproachClaim(s,quote,a),landing=serviceDoor(base.f,2),length=quote&&polyLen(quote.path);`);
 t.diagnostic(JSON.stringify(r.eval('({oldFits,pathPoints:quote?.path.length,clear,length})')));assert.ok(r.eval('skinny.path.length===2&&!oldFits&&quote&&clear&&claim.ok&&quote.path.length>4'));
 assert.ok(r.eval('quote.access.corridorFrom===2&&quote.path[1].x===p.x&&quote.path[1].z===p.z&&quote.path[2].x===landing.x&&quote.path[2].z===landing.z&&quote.access.endpoint.ref===0&&length>80'));
 near(coins(r),cash);assert.equal(r.eval('W.projects.length'),0);r.eval('quote.path[2].z+=.1;quote.access.pathKey=JSON.stringify(quote.path)');assert.equal(r.eval('abbeyApproachClear(s,quote)'),false);
});

test('full native corridor checks parallel-bank clearance and current pending footprints before search accepts edges',()=>{
 const r=routeSetup();r.eval(`const water={a:{x:0,z:-100},b:{x:0,z:100},hw:7,y:10,x:0,z:0};W.rivHash.add(water,107);
  const C0=abbeyApproachSurvey(s),terrain=abbeyRouteTerrain(s),corridor=abbeyCorridorReady(s,C0,a.storageOwnerId,undefined,0,terrain),plain={house:s.owner,settlement:s,placed:s._lay.placed,requireRoadCrossing:true,waterClearance:2.3},p={x:10,z:20},q={x:10,z:22};
  const skinny=armySegmentClear(plain,p,q),wide=armySegmentClear({...plain,_em:abbeyRouteMemo(terrain),abbeyCorridor:corridor},p,q),far=armySegmentClear({...plain,_em:abbeyRouteMemo(terrain),abbeyCorridor:corridor},{x:12,z:20},{x:12,z:22});
  W.projects.push({type:'compound',si:0,site:{f:{x:12,z:21,w:2,d:2,rot:0}}});const current=abbeyCorridorReady(s,abbeyApproachSurvey(s),a.storageOwnerId,undefined,0,abbeyRouteTerrain(s)),reserved=armySegmentClear({...plain,_em:abbeyRouteMemo(current.terrain),abbeyCorridor:current},{x:12,z:20},{x:12,z:22});`);
 assert.equal(r.eval('skinny'),true);assert.equal(r.eval('wide'),false);assert.equal(r.eval('far'),true);assert.equal(r.eval('reserved'),false);
});

test('zero-payment corridor preflight refuses a native tenant and final positive freeholder licence remains unpaid at quote',()=>{
 const r=routeSetup();r.eval(`privateField.wk=H[0]._hh;privateField.title.work=propertyRightsResolve(H[0]._hh);const terrain=abbeyRouteTerrain(s),context=abbeyApproachSurvey(s),corridor=abbeyCorridorReady(s,context,a.storageOwnerId,undefined,0,terrain),p={x:80,z:20},q={x:82,z:20},walker={house:s.owner,settlement:s,placed:s._lay.placed,requireRoadCrossing:true,waterClearance:2.3,_em:abbeyRouteMemo(terrain),abbeyCorridor:corridor};
  const scope=abbeyRouteEnter(walker),tenant=armySegmentClear(walker,p,q),again=armySegmentClear(walker,p,q),known=corridor.claims.size;abbeyRouteLeave(walker,scope);privateField.wk=privateField.own=H[0]._hh;privateField.title={own:propertyRightsResolve(H[0]._hh),work:propertyRightsResolve(H[0]._hh)};
  const freshTerrain=abbeyRouteTerrain(s),fresh=abbeyCorridorReady(s,abbeyApproachSurvey(s),a.storageOwnerId,undefined,0,freshTerrain),freeholder=armySegmentClear({...walker,_em:abbeyRouteMemo(freshTerrain),abbeyCorridor:fresh},p,q),site=abbeyApproachPlan(s,base,a.storageOwnerId),claim=site&&abbeyApproachClaim(s,site,a);`);
 assert.equal(r.eval('tenant'),false);assert.equal(r.eval('again'),false);assert.ok(r.eval('known>0&&freeholder&&site&&claim.ok&&claim.recipients[0].due>0'));
 assert.equal(r.eval('site.access.approachPaid'),undefined);assert.equal(r.eval('W.projects.length'),0);assert.ok(r.eval('privateField.title.work.owner===H[0]._hh&&privateField.title.own.owner===H[0]._hh'));
});

test('warmed full-width corridor caches cannot outlive native route scope or changed current inputs',()=>{
 const mutations=[
  ['same-day tenant right',`privateField.wk=H[0]._hh;privateField.title.work=propertyRightsResolve(H[0]._hh)`],
  ['day',`now++;privateField.wk=H[0]._hh;privateField.title.work=propertyRightsResolve(H[0]._hh)`],
  ['world',`W={...W};privateField.wk=H[0]._hh;privateField.title.work=propertyRightsResolve(H[0]._hh)`],
  ['settlement owner',`s.owner=1;privateField.wk=H[0]._hh;privateField.title.work=propertyRightsResolve(H[0]._hh)`],
  ['placed hash',`s._lay.placed=makeHash(16);privateField.wk=H[0]._hh;privateField.title.work=propertyRightsResolve(H[0]._hh)`],
  ['current title helper',`const claim0=storageGroundClaim;storageGroundClaim=(...args)=>claim0(...args);privateField.wk=H[0]._hh;privateField.title.work=propertyRightsResolve(H[0]._hh)`],
  ['private polygon helper',`const difference0=compoundPolygonDifference;compoundPolygonDifference=(...args)=>difference0(...args);privateField.wk=H[0]._hh;privateField.title.work=propertyRightsResolve(H[0]._hh)`],
  ['standing footprint',`const b={x:81,z:20,w:2,d:2,rot:0,state:'sound',arch:'house'};s.buildings.push(b);s._lay.placed.add(b,3)`],
  ['pending corridor',`W.projects.push({type:'compound',si:0,site:{path:[{x:81,z:10},{x:81,z:30}]}})`]
 ];
 for(const [name,mutation] of mutations){const r=routeSetup(),cash=coins(r);r.eval(`const terrain=abbeyRouteTerrain(s),C0=abbeyApproachSurvey(s),corridor=abbeyCorridorReady(s,C0,a.storageOwnerId,undefined,0,terrain),p={x:80,z:20},q={x:82,z:20},walker={house:s.owner,settlement:s,placed:s._lay.placed,requireRoadCrossing:true,waterClearance:2.3,_em:abbeyRouteMemo(terrain),abbeyCorridor:corridor},scope=abbeyRouteEnter(walker),warm=armySegmentClear(walker,p,q),repeat=armySegmentClear(walker,p,q),claimCount=corridor.claims.size,memoCount=corridor.memo.size;abbeyRouteLeave(walker,scope);`);
  assert.ok(r.eval('C0.native&&warm&&repeat&&claimCount>0&&memoCount>0'),name+' warms actual indexed native corridor');r.eval(mutation);r.eval(`const current={...walker,house:s.owner,placed:s._lay.placed},cold=abbeyCorridorCold(current,corridor),expected=abbeyCorridorWorldClear({...current,_em:undefined},p,q,cold),actual=armySegmentClear(current,p,q);`);
  assert.equal(r.eval('actual'),false,name);assert.equal(r.eval('actual'),r.eval('expected'),name+' retains cold full-width truth');assert.ok(r.eval('corridor.claims.size===claimCount&&corridor.memo.size===memoCount'),name+' leaves old scratch untouched');near(coins(r),cash);
 }
});

test('stale corridor entry discards bank proofs and checks every native walker input',()=>{
 const r=routeSetup();r.eval(`const T=abbeyRouteTerrain(s),corridor=abbeyCorridorReady(s,abbeyApproachSurvey(s),a.storageOwnerId,undefined,0,T),ordinary={house:s.owner,settlement:s,placed:s._lay.placed,requireRoadCrossing:true,waterClearance:2.3},poison={};Object.defineProperty(poison,'hw',{get(){throw Error('stale flood proof was reused')}});corridor.banks.floods.push(poison);now++;s.streets=[];const result=serviceRoadPlan(s,{x:80,z:20},s._lay.placed,null,1.3,new Map(),base.f,corridor.banks,undefined,undefined,corridor),fresh=abbeyCorridorCold(ordinary,corridor);`);
 assert.equal(r.eval('result'),null);assert.ok(r.eval('fresh!==corridor&&fresh.C!==corridor.C&&fresh.claims.size===0&&fresh.memo.size===0&&fresh.banks.floods.length===0&&fresh.terrain===null'));
 for(const change of [`house:1`,`placed:makeHash(16)`,`waterClearance:1.3`,`requireRoadCrossing:false`,`raft:{}`])assert.equal(r.eval(`abbeyCorridorInputs(fresh,{...ordinary,${change}})`),false,change);
 assert.equal(r.eval('abbeyCorridorInputs(fresh,ordinary)'),true);
});


test('a replaced spatial predicate cold-checks the complete ordered public surface instead of retaining an index exemption',()=>{
 const r=routeSetup();r.eval(`const T=abbeyRouteTerrain(s),corridor=abbeyCorridorReady(s,abbeyApproachSurvey(s),a.storageOwnerId,undefined,0,T),p={x:0,z:20},q={x:0,z:22},walker={house:s.owner,settlement:s,placed:s._lay.placed,requireRoadCrossing:true,waterClearance:2.3,_em:abbeyRouteMemo(T),abbeyCorridor:corridor},scope=abbeyRouteEnter(walker),warm=armySegmentClear(walker,p,q);abbeyRouteLeave(walker,scope);
  privateField.wk=H[0]._hh;privateField.title.work=propertyRightsResolve(H[0]._hh);let invalidIndexCalls=0;abbeySurveyIndexRows=()=>{invalidIndexCalls++;return []};const cold=abbeyCorridorCold(walker,corridor),actual=armySegmentClear(walker,p,q);`);
 assert.ok(r.eval('warm&&!cold.C.native&&actual&&invalidIndexCalls===0'),'actual public road surface remains an easement, with no use of the invalid spatial index');
});

function groundGeometrySetup(cell=40){
 const context=vm.createContext({Math,Number,Map,Set,GRID:16,CELL:cell,SIZE:cell*16,W:{land:{F:[]}}});
 const cells=fn('occupiedGroundCells'),fields=fn('occupiedGroundFields');
 const legacyCells=cells.replace('function occupiedGroundCells(','function legacyOccupiedGroundCells(').replace('if(!occupiedGroundBoxMayHit(P,ax,bx,az,bz))return false;','');
 const legacyFields=fields.replace('function occupiedGroundFields(','function legacyOccupiedGroundFields(').replace('occupiedGroundBoxMayHit(poly,x-half,x+half,z-half,z+half)&&','');
 assert.notEqual(legacyCells,cells);assert.notEqual(legacyFields,fields);
 vm.runInContext([constant('clamp'),constant('cIdx'),constant('inB'),constant('toCell'),constant('cellX'),constant('cellZ'),...['obbCorners','segDist','segSegDist','inPolyXZ','graveyardPolygonsOverlap','occupiedGroundBoxMayHit','occupiedGroundCells','occupiedGroundFields','computeFurlongPoly'].map(fn),legacyCells,legacyFields].join('\n'),context);
 return{context,eval:s=>vm.runInContext(s,context)};
}

test('ground cell broad phase preserves the original ordered raster near threshold, signed zero, malformed and scaled inputs',()=>{
 for(const cell of [15,6000/220,9000/220,40]){const r=groundGeometrySetup(cell);r.eval(`const edge=cellX(7)+CELL/2,z=cellZ(7),cases=[];
  for(const gap of [0,.005,.009999999,.01,.010000001,.999999999,1,1.000000001,2])for(const angle of [0,Math.PI/4,-Math.PI/3])cases.push(obbCorners(edge+gap+1,z,2,3,angle));
  cases.push([{x:-0,z:-0}],[{x:edge,z:z-1},{x:edge,z:z+1}],[],[{x:NaN,z:0},{x:1,z:1},{x:0,z:1}],[{x:Infinity,z:0},{x:1,z:1},{x:0,z:1}],
   [{x:1e7,z:-1},{x:1e7+2,z:1},{x:1e7,z:1}],[{x:-20,z:-20},{x:20,z:20},{x:-20,z:20},{x:20,z:-20}]);
  const differences=cases.map(P=>({new:occupiedGroundCells(P),old:legacyOccupiedGroundCells(P)}));`);
  for(const [i,result]of Array.from(r.eval('differences')).entries())assert.deepEqual(Array.from(result.new),Array.from(result.old),`CELL=${cell} case=${i}`);
  assert.equal(r.eval('occupiedGroundBoxMayHit([{x:12,z:0}],-10,10,-1,1)'),false);
  assert.equal(r.eval('occupiedGroundBoxMayHit([{x:11,z:0}],-10,10,-1,1)'),true,'one-metre boundary still runs exact native predicates');
  for(const expression of ['null,-10,10,-1,1','[{x:Infinity,z:0}],-10,10,-1,1','[{x:1e7,z:0}],-10,10,-1,1','[{x:12,z:0}],10,-10,-1,1','[{x:12,z:0}],NaN,10,-1,1'])assert.equal(r.eval(`occupiedGroundBoxMayHit(${expression})`),true,expression+' retains native fallback');
 }
});

test('native Voronoi parcel broad phase retains exact field identity and order while sparing distant overlap calls',()=>{
 const r=groundGeometrySetup(40);r.eval(`const FN=4,FG=SIZE/FN;W.land.F=Array.from({length:FN*FN},(_,k)=>{const i=k%FN,j=Math.floor(k/FN);return{k,i,j,jx:((i*7+j*11)%13)/12,jz:((i*5+j*3)%11)/10};});
  const overlap0=graveyardPolygonsOverlap;let overlapReads=0;graveyardPolygonsOverlap=(...args)=>{overlapReads++;return overlap0(...args)};
  const samples=[[0],[cIdx(7,7)],[cIdx(7,7),cIdx(8,7),cIdx(8,8),cIdx(7,7)],[cIdx(15,15)],[...Array(16)].map((_,i)=>cIdx(i,i))];
  let oldReads=0,newReads=0;const comparisons=[];for(const cells of samples){overlapReads=0;const old=[...legacyOccupiedGroundFields(cells)];oldReads+=overlapReads;overlapReads=0;const current=[...occupiedGroundFields(cells)];newReads+=overlapReads;comparisons.push({old,current});}
  W.land.F[5].jx=.999;W.land.F[5].jz=.001;const changed={old:[...legacyOccupiedGroundFields([cIdx(6,6),cIdx(7,7)])],current:[...occupiedGroundFields([cIdx(6,6),cIdx(7,7)])]};`);
 for(const result of Array.from(r.eval('[...comparisons,changed]')))assert.ok(result.old.length===result.current.length&&Array.from(result.old).every((f,k)=>f===result.current[k]));
 assert.ok(r.eval('newReads<oldReads/2'),'only proven distant parcels spare original overlap checks');
 const malformed=groundGeometrySetup(40);malformed.eval(`const FN=1,FG=SIZE;W.land.F=[{k:0}];computeFurlongPoly=()=>[{x:NaN,z:0},{x:1,z:1},{x:0,z:1}];const previous=graveyardPolygonsOverlap;let exactCalls=0;graveyardPolygonsOverlap=(...args)=>{exactCalls++;return previous(...args)};const current=[...occupiedGroundFields([cIdx(8,8)])],old=[...legacyOccupiedGroundFields([cIdx(8,8)])];`);
 assert.deepEqual(Array.from(malformed.eval('current')),Array.from(malformed.eval('old')));assert.equal(malformed.eval('exactCalls'),2,'uncertain parcel bounds run original overlap for both queries');
});

test('a certified corridor reuses its identical native ground once and still reads current worker rights',()=>{
 const r=routeSetup(`const ground0=compoundGround;let groundReads=0;compoundGround=(...args)=>{groundReads++;return ground0(...args)};`),cash=coins(r);r.eval(`const T=abbeyRouteTerrain(s),corridor=abbeyCorridorReady(s,abbeyApproachSurvey(s),a.storageOwnerId,undefined,0,T),p={x:80,z:20},q={x:82,z:20},walker={house:s.owner,settlement:s,placed:s._lay.placed,requireRoadCrossing:true,waterClearance:2.3,_em:abbeyRouteMemo(T),abbeyCorridor:corridor},scope=abbeyRouteEnter(walker);groundReads=0;const legal=abbeyCorridorWorldClear(walker,p,q,corridor),warmReads=groundReads;abbeyRouteLeave(walker,scope);
  privateField.wk=H[0]._hh;privateField.title.work=propertyRightsResolve(H[0]._hh);const fresh=abbeyCorridorCold(walker,corridor);groundReads=0;const refused=abbeyCorridorWorldClear({...walker,_em:undefined},p,q,fresh),coldReads=groundReads;`);
 assert.ok(r.eval('legal&&!refused&&warmReads===1&&coldReads===2'),'only the certified unchanged carrier avoids duplicate native raster');near(coins(r),cash);assert.equal(r.eval('W.projects.length'),0);
 r.eval(`privateField.wk=privateField.own=H[0]._hh;privateField.title={own:propertyRightsResolve(H[0]._hh),work:propertyRightsResolve(H[0]._hh)};const site={polys:[obbCorners(81,20,2.6,2,0)]},carrier={site,land:100,claimOccupied:true},ground=ground0(site),regular=storageGroundClaim(s,carrier,a),reused=storageGroundClaim(s,carrier,a,ground);`);
 assert.equal(r.eval('regular.ok'),true);assert.ok(r.eval('regular.key===reused.key&&JSON.stringify(regular.cells)===JSON.stringify(reused.cells)&&regular.recipients.length===reused.recipients.length&&regular.recipients.every((p,k)=>p.owner===reused.recipients[k].owner&&p.id===reused.recipients[k].id&&p.due===reused.recipients[k].due&&p.due>0)'));
});

test('native approach contexts cannot retain a foreign settlement or different excluded project in the final accepted route',()=>{
 const r=routeSetup();r.eval(`base.f.x=20;const project={type:'compound',si:0,site:{f:{x:10,z:12.2,w:2,d:2,rot:0}}};W.projects.push(project);const excluding=abbeyApproachSurvey(s,project),T=abbeyRouteTerrain(s),current=abbeyCorridorReady(s,excluding,a.storageOwnerId,undefined,0,T),quote=abbeyApproachPlan(s,base,a.storageOwnerId,undefined,excluding),foreign={...s,_lay:s._lay},foreignSurvey=abbeyApproachSurvey(foreign),sameSettlement=abbeyCorridorReady(s,foreignSurvey,a.storageOwnerId,undefined,0,T);`);
 assert.ok(r.eval('current.C!==excluding&&current.C.s===s&&current.C.q===undefined&&current.C.projects.some(p=>p.q===project)'));
 assert.ok(r.eval('sameSettlement.C!==foreignSurvey&&sameSettlement.C.s===s&&sameSettlement.C.q===undefined'));
 assert.ok(r.eval('quote&&quote.path.length>3&&abbeyApproachClear(s,quote)'),'the accepted lexical context checks the currently pending project, not merely Ready');
});
