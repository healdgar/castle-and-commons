import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {realm,near} from './ownership-fixture.mjs';

const source=fs.readFileSync(process.env.FURLONG_TEST_SOURCE||new URL('../index.html',import.meta.url),'utf8');
const fn=n=>source.match(new RegExp('^function '+n+'\\b[\\s\\S]*?(?=^function |^const |^/\\*|$(?![\\s\\S]))','m'))?.[0]||'';
const constant=n=>source.match(new RegExp('^const '+n+'=.*$','m'))?.[0]||'';
const abbey=source.slice(source.indexOf('/* ABBEY_INSTITUTION_BEGIN */'),source.indexOf('/* ABBEY_INSTITUTION_END */'));
const church=source.slice(source.indexOf('/* WIDER_CHURCH_BEGIN */'),source.indexOf('/* WIDER_CHURCH_END */'));

function setup({people=2,host=false}={}){
 const bootstrap=host?`H[1].si=1;s.folk=H.filter(p=>p.si===0);s.pop=H.length-1;const host={name:'host',owner:0,kind:'town',pos:{x:750,z:0},pop:1,folk:[H[1]],buildings:[],furl:[],stores:{grain:100,fish:100},_lard:{},px:{grain:1,fish:2},_made:{},res:{}};W.settlements.push(host);`:'';
 const r=realm({households:people,pop:people,cash:1000,crown:10000,grain:100,fish:100,commodity:true,bootstrap,transformSource:p=>p.replace('const isHouse=x=>x&&W.houses.includes(x);',constant('isHouse'))});
 r.eval([fn('corpFound'),fn('accountBalances'),fn('chOf'),fn('capOf'),fn('workers_'),fn('technologyActorsDirty'),fn('errand'),fn('tickTravel'),fn('personBoardMeal'),fn('personBoardRecord'),constant('RESID'),constant('LK'),constant('LS'),constant('ARABLE'),constant('WALK_MPD'),abbey,church].join('\n'));
 r.eval(`KS=2;KL=0;W.land={F:[],perHead:1000};s.furl=[];W.bldList=[];W.travellers=[];route=()=>({len:750,poly:[{x:0,z:0},{x:750,z:0}]});frand=()=>0;let now=1;day=()=>now;for(const p of H){p.age=30;p.sx='m';p.sk=[.6,0,.6];}ownershipTick();const a=corpFound('abbey',{name:'Native Abbey',si:${host?1:0},order:'cistercian',members:[],servants:[],corrodies:[],granges:[],charter:{selfWorked:true}});stockOf(W.settlements[a.si],a);`);
 if(host)r.eval(`offer(host,'grain','crown',host.stores.grain);offer(host,'fish','crown',host.stores.fish);transfer('crown',a,100,'abbey endowment',host);purchase(host,'grain',a,10);commodityCreditPurchase(host,a,'grain',purchase.got);const b={idx:0,s:host,arch:'hospital',compoundKey:'hospital',state:'sound',ownerId:a.storageOwnerId,w:12,d:8,tier:1};host.buildings.push(b);W.bldList.push(b);bindPropertyRights(host);const servant=H[1];servant.role='abbey servant';servant.abbeyService=a.storageOwnerId;servant.abbeyJob='hospitaller';servant.abbeyWage=36;a.servants.push(servant);abbeyStaff(a,host);const guest=H[0];const started=errand(guest,0,1,'pilgrim',3);`);
 return r;
}

test('native return leg identifies the guest stay, never outbound or homeward transit',()=>{
 const r=setup({host:true});assert.equal(r.eval('started'),true);near(r.eval('W.travellers[1].visitSince'),2);
 near(r.eval('abbeyHospitality(a,host)'),0);r.eval('now=2;tickTravel();abbeyStaff(a,host)');
 assert.equal(r.eval('W.travellers.length'),1);assert.equal(r.eval('guest.si'),0);assert.ok(r.eval('W.travellers[0].home'));
 near(r.eval('abbeyHospitality(a,host)'),r.eval('FOOD'));
 r.eval('now=5;abbeyStaff(a,host)');near(r.eval('abbeyHospitality(a,host)'),0);
 r.eval('now=6;tickTravel();abbeyStaff(a,host)');near(r.eval('abbeyHospitality(a,host)'),0);
});

test('a real guest consumes only the abbey stock once and its home household buys and eats no second meal',()=>{
 const r=setup({host:true});r.eval('now=2;tickTravel();abbeyStaff(a,host);const held=pantry(host,a).grain,physical=host.stores.grain,homePhysical=s.stores.grain+s.stores.fish,cash=accountBalances().total,people=W.settlements.reduce((n,s)=>n+s.folk.length,0);const meal=abbeyHospitality(a,host);const once=host.stores.grain;abbeyHospitality(a,host);eatHouseholds(s,folkIndex())');
 near(r.eval('meal'),r.eval('FOOD'));near(r.eval('pantry(host,a).grain'),r.eval('held-FOOD'));near(r.eval('host.stores.grain'),r.eval('physical-FOOD'));near(r.eval('host.stores.grain'),r.eval('once'));near(r.eval('s.stores.grain+s.stores.fish'),r.eval('homePhysical'));near(r.eval('accountBalances().total'),r.eval('cash'));near(r.eval('pantry(s,guest).grain||0'),0);near(r.eval('learningHomeAbsence(s,guest._hh)'),1);assert.equal(r.eval('guest._hh.hunger'),0);assert.equal(r.eval('W.settlements.reduce((n,s)=>n+s.folk.length,0)'),r.eval('people'));assert.equal(r.eval('guest.boardReceipt.source'),'abbey:0');
});

test('actual partial scholar board and hospitality share one consumed person meal',()=>{
 const r=setup({host:true});r.eval("now=2;tickTravel();abbeyStaff(a,host);purchase(host,'grain',guest,FOOD/2);commodityCreditPurchase(host,guest,'grain',purchase.got);const schoolMeal=consumeOwned(host,guest,'grain',FOOD/2);guest.study={journey:{from:0,to:1,arrive:2,leave:5,boardedDay:day(),boarded:schoolMeal/FOOD}};const before=host.stores.grain;const served=abbeyHospitality(a,host)");
 near(r.eval('served'),r.eval('FOOD/2'));near(r.eval('host.stores.grain'),r.eval('before-FOOD/2'));near(r.eval('personBoardMeal(guest)'),r.eval('FOOD'));near(r.eval('learningHomeAbsence(s,guest._hh)'),1);r.eval('now=3');near(r.eval('personBoardMeal(guest)'),0);near(r.eval('learningHomeAbsence(s,guest._hh)'),0);
});

test('actual local hosted food also replaces the native household meal',()=>{
 const r=setup();r.eval("purchase(s,'grain',H[0],FOOD);commodityCreditPurchase(s,H[0],'grain',purchase.got);const eaten=consumeOwned(s,H[0],'grain',FOOD);personBoardRecord(H[0],0,eaten,'native host');const before=s.stores.grain+s.stores.fish;H[1].dead=true;s.folk=s.folk.filter(p=>!p.dead);householdHeadsChanged(s);householdsOf(s);H[0]._hh.population.set(s,1);eatHouseholds(s,folkIndex())");
 near(r.eval('s.stores.grain+s.stores.fish'),r.eval('before'));near(r.eval('learningHomeAbsence(s,H[0]._hh)'),1);
});

test('hospitality requires a live present paid servant and preserves the real annual food reserve',()=>{
 const r=setup({host:true});r.eval('now=2;tickTravel();abbeyStaff(a,host);servant.away={until:4}');near(r.eval('abbeyHospitality(a,host)'),0);r.eval('delete servant.away;guest.abbey=a.id;guest.role="monk";a.members.push(guest);guest.si=1;guest._hh.population.set(host,1);a.members.push(servant);servant.abbey=a.id;servant._hh.population.set(host,1);consumeOwned(host,a,"grain",3);const before=host.stores.grain');near(r.eval('abbeyHospitality(a,host)'),0);near(r.eval('host.stores.grain'),r.eval('before'));
});

test('a living relocated servant releases its own markers and invalidates both native job indexes',()=>{
 const r=setup({host:true});r.eval('servant.si=0;host.folk=[];s.folk.push(servant);householdHeadsChanged(host);householdHeadsChanged(s);servant.abbeyPaidDay=day();s._learningIndex={};host._learningIndex={};s._technologyActors={};host._technologyActors={};a._wagesDay=null;const before=accountBalances().total;abbeyStaff(a,host)');
 assert.equal(r.eval('a.servants.length'),0);assert.equal(r.eval('servant.role'),null);assert.equal(r.eval('servant.abbeyService'),undefined);assert.equal(r.eval('servant.abbeyPaidDay'),undefined);assert.ok(r.eval('!s._learningIndex&&!host._learningIndex&&!s._technologyActors&&!host._technologyActors'));near(r.eval('accountBalances().total'),r.eval('before'));
});

test('release preserves a real replacement teaching office and another institution identity',()=>{
 const r=setup();r.eval("const p=H[0];p.role='schoolmaster';p.office='master';p.officeFor='school:3';p.schoolMaster=3;p.abbeyService=a.storageOwnerId;p.abbeyJob='ploughman';p.abbeyPaidDay=day();abbeyServiceRelease(a,p)");assert.equal(r.eval('p.role'),'schoolmaster');assert.equal(r.eval('p.office'),'master');assert.equal(r.eval('p.schoolMaster'),3);assert.equal(r.eval('p.abbeyJob'),undefined);r.eval("p.abbeyService='abbey:99';p.abbeyJob='fisher';abbeyServiceRelease(a,p)");assert.equal(r.eval('p.abbeyJob'),'fisher');
});

test('cellarer choice preserves the actual employed master and retires only the stale own cellarer',()=>{
 const r=setup({people:3});r.eval("for(const p of H){p.abbey=a.id;p.role='monk';p._hh.abbey=a.id;a.members.push(p);}H[0].sk[KS]=.9;H[0].office='master';H[0].officeFor=a.storageOwnerId;H[0].schoolMaster=0;H[1].sk[KS]=.4;H[1].office='cellarer';H[1].officeFor=a.storageOwnerId;H[2].sk[KS]=.6;s._learningIndex={};s._technologyActors={};abbeyStaff(a,s)");assert.equal(r.eval('H[0].office'),'master');assert.equal(r.eval('H[0].schoolMaster'),0);assert.equal(r.eval('H[1].office'),undefined);assert.equal(r.eval('H[2].office'),'cellarer');assert.equal(r.eval('a.members.filter(p=>p.office===\'cellarer\').length'),1);assert.ok(r.eval('!s._learningIndex&&!s._technologyActors'));
});

test('an off-seat cleric loses only its actual Church service and receives no abandoned-seat wage',()=>{
 const r=setup({host:true});r.eval("const bishop=churchBody('bishop',1);const p=servant;abbeyServiceRelease(a,p);p.role='bishop';p.office='bishop';p.officeFor=bishop.storageOwnerId;p.churchBody=bishop.storageOwnerId;p._hh.clergy=bishop.storageOwnerId;bishop.leader=p.id;transfer('crown',bishop,100,'diocesan gift',host);p.si=0;const before=p.w+bishop.gold;churchStaff(bishop,host,false)");assert.equal(r.eval('bishop.leader'),null);assert.equal(r.eval('p.churchBody'),undefined);assert.equal(r.eval('p.office'),undefined);assert.equal(r.eval('p.role'),null);assert.equal(r.eval('p._hh.clergy'),undefined);near(r.eval('p.w+bishop.gold'),r.eval('before'));
});

test('Church release never deletes a replacement native office or different household privilege',()=>{
 const r=setup();r.eval("const bishop=churchBody('bishop',0),p=H[0];p.churchBody=bishop.storageOwnerId;p.role='schoolmaster';p.office='master';p.officeFor='school:4';p._hh.clergy='church:99';bishop.leader=p.id;transfer('crown',bishop,100,'diocesan gift',s);const before=p.w+bishop.gold;churchStaff(bishop,s,false)");assert.equal(r.eval('p.role'),'schoolmaster');assert.equal(r.eval('p.office'),'master');assert.equal(r.eval('p.officeFor'),'school:4');assert.equal(r.eval('p._hh.clergy'),'church:99');assert.equal(r.eval('p.churchBody'),undefined);assert.equal(r.eval('bishop.leader'),null);near(r.eval('p.w+bishop.gold'),r.eval('before'));
});
