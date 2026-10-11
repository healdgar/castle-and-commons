// A forced 1166 fixture exercises the eyre without pretending an early world has reached that era.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {realm,near} from './ownership-fixture.mjs';
const source=fs.readFileSync(process.env.FURLONG_TEST_SOURCE||new URL('../index.html',import.meta.url),'utf8');
const fn=n=>{const m=source.match(new RegExp('^function '+n+'\\b[\\s\\S]*?(?=^function |^const |^/\\*|$(?![\\s\\S]))','m'));assert.ok(m,n);return m[0];};
const cst=n=>source.match(new RegExp('^const '+n+'=.*$','m'))[0];
function royal({commodity=false}={}){const r=realm({households:5,cash:0,grain:0,fish:0,crown:100,pop:5,commodity});
  r.eval(['royalHundreds','royalBudget','royalFine','royalPleaPlan','royalPlans','royalOfficers','royalTravel','royalAppoint','royalEyreStart','royalStockReserve','royalForfeitGoods','royalEyreVisit','royalEyreCmd','royalJusticeHTML','courtOfficials','courtAppoint','courtDebtor','courtSession','institutionJobsChanged','technologyActorsDirty','craftPresent','workers_','lordSeat','roadSpare','sovOn','plyH','workerCommandTarget','workerCommandIndexText','workerCommandString','runCmd','replayEntry','courtCard'].map(fn).join('\n'));
  Object.assign(r.C,{KL:0,KLaw:3,esc:x=>String(x),dateStr:d=>'day '+d,MODEL_ONLY:true,backgroundUserRequest:()=>false,workerCommandIsLocal:()=>false});
  r.eval('W.houses=[{name:"the Crown"},{name:"House Ash",gold:0}];W.notables=[];W.roads=[];W.capital=s;W.player={on:true,house:0};s.furl=[];for(const h of H)h.sk=[1,0,0,1];ownershipTick();for(const h of H)householdAccount(h).population.set(s,1);W._pm=folkIndex();storageInit(s);AD=()=>1166;notableById=id=>W.notables.find(n=>n.id===id);notableSetAlive=(n,a)=>n.alive=a;notableFromFolk=(p,o)=>{const n={...o,id:W.notables.length+1,fp:p,name:folkName(p),alive:true};W.notables.push(n);return n;};');return r;}
const total=r=>r.coins()+(r.W.houses[1].gold||0);
const robbery=(r,v=100)=>r.eval(`courtRobbery(s,{value:${v},qty:10,good:'cloth',origin:0,dest:0},{id:7},{x:0,z:0})`);
const hear=r=>r.eval('royalEyreStart();day=()=>2;royalEyreVisit()');
const personnel=r=>r.eval('JSON.stringify([H.map(p=>[p.id,p.w,p.office,p.officeFor,p.role,p.abbey,p.abbeyJob,p.estateOffice,p.portHealthJob,p.schoolMaster,p.tutorMaster,p.study,p.apprentice,p.craft,p.away]),W.notables.map(n=>[n.id,n.alive,n.fp.id,n.retiredDay,n.endReason]),W.houses.map(h=>h.justice),s.pop])');
const conflicts=[
  ['monk','H[0].abbey=0;H[0].role="monk"'],['nun','H[0].abbey=0;H[0].role="nun"'],['canon','H[0].abbey=0;H[0].role="canon"'],
  ['paid abbey servant','H[0].abbeyJob="carter";H[0].role="abbey servant"'],['paid estate keeper','H[0].estateOffice={project:4,priorTrade:"labourer"}'],
  ['port attendant','H[0].portHealthJob=0'],['schoolmaster','H[0].schoolMaster=0'],['tutor','H[0].tutorMaster=0'],
  ['active student','H[0].study={closed:false}'],['active apprentice','H[0].apprentice={closed:false}'],
  ['paid journeyman','H[0].craft={rank:"journeyman",employer:5}'],['absence','H[0].away={until:90}'],
  ['lost letters','H[0].sk[KL]=0'],['other court owner','H[0].officeFor=9;H[0].office=office']
];

for(const kind of ['royal','manor'])for(const retained of [false,true])test(`${kind} ${retained?'retained':'new'} officers exclude actual conflicting jobs and absent or unqualified heads without changing their records`,()=>{
  for(const[label,change]of conflicts){const r=royal();r.eval(`globalThis.office=${JSON.stringify(kind==='royal'?'justice':'steward')};H[4].w=100;${kind==='manor'?'s.owner=1;W.houses[1].seat=0;':''}`);
    if(retained){if(kind==='royal'){robbery(r);hear(r);}else r.eval('courtPlead(s,"entry",5,20,{},W.houses[1]);courtSession(s,0)');}
    r.eval(change);const before=personnel(r),coin=total(r),ids=JSON.parse(r.eval(`JSON.stringify(${kind==='royal'?'royalOfficers()':'courtOfficials(0)'}.picked.map(p=>p.id))`));
    assert.ok(!ids.includes(1),label);assert.equal(new Set(ids).size,2,label);assert.equal(personnel(r),before,label+' quote changes no office, contract, membership or purse');near(total(r),coin);
  }
});
test('court service admits an independent household craftsman and a graduate, and retains the same compatible offices',()=>{
  const r=royal();r.eval('H[0].tr="smith";H[0].craft={rank:"master",employees:[]};H[1].study={closed:true};H[1].apprentice={closed:true};H[4].w=100');
  assert.deepEqual(JSON.parse(r.eval('JSON.stringify(royalOfficers().picked.map(p=>p.id))')),[1,2]);assert.equal(r.eval('craftPresent(s,H[0])'),true);r.eval('s._craftIndex={};s._learningIndex={};s._technologyActors={}');robbery(r);hear(r);const before=personnel(r);r.eval('headsOf=()=>{throw Error("compatible officers need no search")};royalOfficers()');assert.equal(personnel(r),before);assert.equal(r.H[0].tr,'smith');assert.equal(r.H[0].craft.rank,'master');assert.equal(r.eval('craftPresent(s,H[0])'),false);assert.equal(r.eval('workers_(s,p=>p===H[0]).length'),0);for(const cache of ['_craftIndex','_learningIndex','_technologyActors'])assert.equal(r.s[cache],undefined,cache+' is refreshed on actual appointment');
});
test('a clerk keeps his own office when an unrecorded incumbent and a vacant steward are reconciled',()=>{
  const r=royal();r.eval('s.owner=1;W.houses[1].seat=0;H[0].office="clerk";H[0].officeFor=1;H[0].sk[KLaw]=10');
  assert.deepEqual(JSON.parse(r.eval('JSON.stringify(courtOfficials(0).picked.map(p=>[p.id,p.office]))')),[[2,null],[1,'clerk']]);assert.equal(r.H[0].office,'clerk');
});
for(const kind of ['royal','manor'])test(`funded ${kind} replacement releases only its old court markers and pays the present head once`,()=>{
  const r=royal();r.eval(`H[4].w=100;${kind==='manor'?'s.owner=1;W.houses[1].seat=0;':''}`);
  if(kind==='royal'){robbery(r);hear(r);}else r.eval('courtPlead(s,"entry",5,20,{},W.houses[1]);courtSession(s,0)');
  r.eval('H[0].away={until:90};H[0].study={closed:false};day=()=>31');const before=personnel(r),oldCash=r.H[0].w,coin=total(r);
  r.eval(kind==='royal'?'royalOfficers()':'courtOfficials(0)');assert.equal(personnel(r),before,'candidate quote retains stale owned markers');
  if(kind==='royal'){robbery(r);r.eval('royalEyreStart();day=()=>32;royalEyreVisit()');assert.equal(r.W.houses[0].justice.eyre.sessions,2);assert.equal(r.W.notables[0].alive,false);assert.equal(r.W.notables.length,3);}else r.eval('courtPlead(s,"entry",5,20,{},W.houses[1]);courtSession(s,0)');
  near(total(r),coin);near(r.H[0].w,oldCash);assert.equal(r.H[0].office,undefined);assert.equal(r.H[0].officeFor,undefined);assert.equal(r.H[0].away.until,90);assert.equal(r.H[0].study.closed,false);assert.equal(r.H[2].office,kind==='royal'?'justice':'steward');near(r.H[2].w,r.eval('foodYr()/360'));assert.equal(r.s.pop,5);assert.equal(r.H.length,5);
});
for(const kind of ['royal','manor'])test(`funded ${kind} replacement preserves a prior holder's reassigned foreign office`,()=>{
  const r=royal();r.eval(`H[4].w=100;${kind==='manor'?'s.owner=1;W.houses[1].seat=0;':''}`);
  if(kind==='royal'){robbery(r);hear(r);}else r.eval('courtPlead(s,"entry",5,20,{},W.houses[1]);courtSession(s,0)');
  r.eval('H[0].officeFor=9;day=()=>31');const coin=total(r);if(kind==='royal'){robbery(r);r.eval('royalEyreStart();day=()=>32;royalEyreVisit()');}else r.eval('courtPlead(s,"entry",5,20,{},W.houses[1]);courtSession(s,0)');
  near(total(r),coin);assert.equal(r.H[0].office,kind==='royal'?'justice':'steward');assert.equal(r.H[0].officeFor,9);assert.equal(r.H[2].office,kind==='royal'?'justice':'steward');
});

test('general eyre is gated at 1166; held evidence never charges an early world',()=>{
  const r=royal();r.eval('AD=()=>1165;H[2].w=100');robbery(r);assert.equal(r.eval('royalEyreStart()'),false);near(total(r),200);assert.equal(r.W.notables.length,0);assert.equal(r.s.royalCourt,undefined);
});
test('robbery fines the actual vill once, pays two real households and conserves coin',()=>{
  const r=royal();r.eval('H[2].w=100;H[3].w=200');robbery(r);const before=total(r);hear(r);near(total(r),before);near(r.s.royalCourt.fines,5);near(r.W.houses[0].justice.eyre.fees,r.eval('2*foodYr()/360'));assert.equal(r.s.royalPleas.rows.length,0);assert.equal(r.W.notables.length,2);assert.ok(r.W.notables.every(n=>n.role==='justice'&&r.H.includes(n.fp)&&n.oldBlood));assert.equal(r.H[0].office,'justice');assert.equal(r.H[1].officeFor,0);
  r.eval('day=()=>32;royalEyreStart();royalEyreVisit()');near(total(r),before);near(r.s.royalCourt.fines,5);assert.equal(r.W.houses[0].justice.eyre.sessions,1);
});
test('shared caps and subsistence prevent repeated robbery cases promising the same purse',()=>{
  const r=royal(),bread=r.eval('foodYr()/12');r.eval(`H[2].w=${bread+10};W.houses[0].justice={cap:0.1}`);for(let i=0;i<10;i++)robbery(r,1000);const before=total(r);hear(r);near(total(r),before);near(r.H[2].w,bread+9);near(r.s.royalCourt.fines,1);assert.equal(r.s.royalCourt.heard,10);assert.ok(r.s.royalCourt.roll.rows.some(p=>p.ruling==='pardoned'));
});
test('coinless vills wait when receipts cannot fund service; no job or salary is invented',()=>{
  const r=royal();robbery(r);assert.equal(r.eval('royalEyreStart()'),false);assert.equal(r.W.notables.length,0);assert.equal(r.W.houses[0].justice,undefined);near(total(r),100);
});
for(const commodity of [false,true])test(`felony forfeits only witnessed, remaining surplus; quantities and coin conserved (${commodity?'balances':'legacy'})`,()=>{
  const r=royal({commodity});r.eval('H[2].w=200;H[2].outlawCampId=7;s.stores.cloth=20;storageBindGood(s,"cloth");addHeld(s,H[2],"cloth",20);s.stores.wine=10;storageBindGood(s,"wine");offer(s,"wine",H[2],10);globalThis.x=stockOf(s,H[2]);x.animals.cattle=6;s.stores.cattle=6;x.animals.horses=2;s.stores.horses=2;courtFelony(s,H[2],{id:7});');const before=total(r),cloth=r.eval('pantry(s,H[2]).cloth'),wine=r.eval('avail(s,"wine")');hear(r);near(total(r),before);near(r.eval('(pantry(s,H[2]).cloth||0)+(stockOf(s,"crown").sale.cloth||0)'),cloth);near(r.eval('avail(s,"wine")'),wine);near(r.eval('x.animals.cattle+stockOf(s,"crown").sale.cattle'),6);near(r.eval('x.animals.horses+stockOf(s,"crown").sale.horses'),2);assert.ok(r.eval('x.animals.cattle>=1&&x.animals.horses>=1'));near(r.H[2].w,r.eval('foodYr()/12'));assert.equal(r.s.royalCourt.roll.rows[0].ruling,'forfeited');assert.ok(r.s.royalCourt.chattelValue>0);assert.equal(r.H[2]._royalForfeitCamp,7);
});
test('spent or moved goods are not recreated; joining evidence cannot take new wealth beyond its cap',()=>{
  const r=royal({commodity:true});r.eval('H[2].w=200;H[2].outlawCampId=7;s.stores.cloth=20;storageBindGood(s,"cloth");addHeld(s,H[2],"cloth",20);courtFelony(s,H[2],{id:7});commodityConsume(s,H[2],"cloth",17,"held");H[2].w=500');hear(r);near(r.s.royalCourt.forfeitCoin,200);near(r.eval('stockOf(s,"crown").sale.cloth'),3);near(r.H[2].w,300);
});
test('dead, returned, changed-camp and extinct households are dismissed without charges to an heir',()=>{
  for(const change of ['H[2].dead=true','delete H[2].outlawCampId','H[2].outlawCampId=8','householdAccount(H[2]).estate=true']){const r=royal();r.eval('H[2].w=200;H[3].w=200;H[2].outlawCampId=7;courtFelony(s,H[2],{id:7});'+change);robbery(r);hear(r);near(r.s.royalCourt.forfeitCoin,0);assert.equal(r.s.royalCourt.roll.rows[0].ruling,'dismissed');assert.ok(r.H[2].w>=195);}
});
test('duplicate felony evidence cannot forfeit twice in a sitting or in later circuits',()=>{
  const r=royal();r.eval('H[2].w=200;H[2].outlawCampId=7;courtFelony(s,H[2],{id:7});courtFelony(s,H[2],{id:7});H[3].w=200');hear(r);const taken=r.s.royalCourt.forfeitCoin;near(taken,200-r.eval('foodYr()/12'));r.eval('H[2].w=200;courtFelony(s,H[2],{id:7});day=()=>31');robbery(r);r.eval('royalEyreStart();day=()=>32;royalEyreVisit()');near(r.s.royalCourt.forfeitCoin,taken);near(r.H[2].w,200);assert.equal(r.s.royalCourt.roll.rows.filter(p=>p.ruling==='dismissed').length,2);
});
test('neglect presents only a real payer’s shortfall, coalesces that duty and levies no repair principal',()=>{
  const r=royal();r.eval('W.houses[1].gold=200;globalThis.road={a:0,b:0};W.roads=[road];courtNeglect(s,road,W.houses[1],40);courtNeglect(s,road,W.houses[1],20);courtNeglect(s,road,"crown",40);courtNeglect(s,road,W.houses[1],0)');assert.equal(r.s.royalPleas.rows.length,1);near(r.s.royalPleas.rows[0].v,60);const before=total(r);hear(r);near(total(r),before);near(r.s.royalCourt.fines,3);near(r.W.houses[1].gold,197);assert.equal(r.s.royalCourt.roll.rows[0].incidents,2);
});
test('a family enlarged since joining limits forfeiture to the outlaw’s current share',()=>{
  const r=royal();r.eval('H[2].w=200;H[2].outlawCampId=7;courtFelony(s,H[2],{id:7});globalThis.A=householdAccount(H[2]);A.members.add({id:90,gn:"new member",si:0});H[2].w=300');hear(r);near(r.s.royalCourt.forfeitCoin,150);near(r.H[2].w,150);
});
for(const commodity of [false,true])test(`forfeited stock blends zero purchase cost into the Crown’s old cost basis (${commodity?'balances':'legacy'})`,()=>{
  const r=royal({commodity});r.eval('H[2].w=200;H[2].outlawCampId=7;s.stores.cloth=24;storageBindGood(s,"cloth");offer(s,"cloth","crown",4,5);addHeld(s,H[2],"cloth",20);courtFelony(s,H[2],{id:7})');hear(r);near(r.eval('stockOf(s,"crown").sale.cloth'),24);near(r.eval('rsv(s,"cloth").get("crown")'),20/24);near(r.s.stores.cloth,24);
});
test('valuable chattels cannot mint the coin required for wages or empty the crown’s reserve',()=>{
  const r=royal({commodity:true});r.eval('W.treasury=0;H[2].outlawCampId=7;s.stores.cloth=100;storageBindGood(s,"cloth");addHeld(s,H[2],"cloth",100);courtFelony(s,H[2],{id:7})');assert.equal(r.eval('royalEyreStart()'),false);near(r.eval('pantry(s,H[2]).cloth'),100);assert.equal(r.W.notables.length,0);
  r.eval('W.treasury=100;chestReserve=()=>100');assert.equal(r.eval('royalEyreStart()'),false);near(r.W.treasury,100);
});
test('appointed justices are reused without searching households, and a dead holder is replaced at a funded sitting',()=>{
  const r=royal();r.eval('H[2].w=200');robbery(r);hear(r);r.eval('globalThis.oldHeads=headsOf;headsOf=()=>{throw Error("unexpected appointment search")};day=()=>31');robbery(r);r.eval('royalEyreStart();day=()=>32;royalEyreVisit()');assert.equal(r.W.notables.length,2);
  r.eval('headsOf=oldHeads;H[0].dead=true;day=()=>61');robbery(r);r.eval('royalEyreStart();day=()=>62;royalEyreVisit()');assert.equal(r.W.houses[0].justice.eyre.sessions,3);assert.equal(r.W.notables.length,3);assert.ok(r.W.houses[0].justice.eyre.officers.every(id=>!r.W.notables.find(n=>n.id===id).fp.dead));
});
test('each town hears its nearest villages on its scheduled day, and no town is visited twice in one day',()=>{
  const r=royal();r.eval('H[2].w=200;globalThis.v={...s,name:"near village",kind:"village",pos:{x:5,z:0},royalPleas:undefined,folk:[H[2]],households:undefined,_householdsD:-1,_populationReady:false,pop:1};globalThis.t={...s,name:"second town",kind:"town",pos:{x:500,z:0},royalPleas:undefined,folk:[H[3]],households:undefined,_householdsD:-1,_populationReady:false,pop:1};W.settlements.push(v,t);H[3].w=200;H[2].si=1;H[3].si=2;s.folk=s.folk.filter(h=>h!==H[2]&&h!==H[3]);s.pop=3;householdHeadsChanged(s);courtRobbery(v,{value:100,qty:1},{id:7},v.pos);courtRobbery(t,{value:100,qty:1},{id:7},t.pos)');assert.deepEqual(JSON.parse(r.eval('JSON.stringify([...royalHundreds()])')),[[0,[1]],[2,[2]]]);hear(r);assert.equal(r.eval('v.royalCourt.heard'),1);assert.equal(r.eval('t.royalCourt'),undefined);r.eval('royalEyreVisit()');assert.equal(r.eval('t.royalCourt'),undefined);r.eval('day=()=>4;royalEyreVisit()');assert.equal(r.eval('t.royalCourt.heard'),1);
});
test('eyre order validates, obeys the ruler and replays to identical accounts and rulings',()=>{
  const play=r=>{r.eval('H[2].w=200');robbery(r);const e={k:'c',c:'c-eyre',a:''};assert.equal(r.eval(`workerCommandTarget(${JSON.stringify(e)})`),'worker');r.eval(`replayEntry(${JSON.stringify(e)});day=()=>2;royalEyreVisit()`);return JSON.parse(r.eval('JSON.stringify([s.royalCourt,H.map(h=>h.w),W.treasury,W.houses[0].justice])'));};const a=royal(),b=royal();assert.deepEqual(play(a),play(b));assert.throws(()=>a.eval('workerCommandTarget({k:"c",c:"c-eyre",a:"force"})'),/Invalid eyre command/);
  const c=royal();c.eval('H[2].w=200;W.player.house=1');robbery(c);c.eval('royalEyreCmd()');assert.equal(c.W.houses[0].justice,undefined);
});
test('worker-side royal reports link rulings and officers and do not change state or populate an index',()=>{
  const r=royal();r.eval('H[2].w=200');robbery(r);hear(r);r.eval('delete W._pm;folkIndex=()=>{throw Error("report cannot populate index")};');const before=r.eval('JSON.stringify([s.royalCourt,W.houses[0].justice])'),html=r.eval('royalJusticeHTML()+courtCard(s,0)');assert.ok(html.includes('Royal rulings'));assert.ok(html.includes('data-nm="n1"'));assert.ok(html.includes('data-cmd="c-eyre"'));assert.equal(r.eval('JSON.stringify([s.royalCourt,W.houses[0].justice])'),before);
});
