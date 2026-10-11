import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {realm,near} from './ownership-fixture.mjs';
const source=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const technologyRules=source.slice(source.indexOf('const TECH_RULES=Object.freeze('),source.indexOf('function technologyKey('));
const constructionRules=source.match(/^const CONSTRUCTION_METHODS=.*$/m)?.[0]||'';
const learning=source.slice(source.indexOf('/* LEARNING (#40):'),source.indexOf('/* the rank-and-file notables share'));
function fn(n){return source.match(new RegExp('^function '+n+'\\b[\\s\\S]*?(?=^function |^const |^/\\*|$(?![\\s\\S]))','m'))?.[0]||'';}
function fixture(households=4){
  const f=realm({crown:1000,cash:500,households,pop:households});let d=1;const [master,parent,kid,other]=f.H;
  Object.assign(master,{tr:'priest',age:35,sk:new Float32Array([1,1,1,1,0,0,0,0,0])});
  Object.assign(parent,{tr:'ploughman',age:35,sk:new Float32Array(9)});
  Object.assign(kid,{tr:'ploughman',age:10,ma:parent,sk:new Float32Array(9)});Object.assign(other,{tr:'ploughman',age:12,ma:parent,sk:new Float32Array(9)});
  for(const p of f.H.slice(4))Object.assign(p,{age:35,sk:new Float32Array([.8,.7,.5,.6,0,0,0,0,0])});
  f.eval('H.forEach(householdAccount);householdAccount(H[0]);bindHousehold(H[2],householdAccount(H[1]));bindHousehold(H[3],householdAccount(H[1]));householdsOf(s)');
  f.s._job={merchant:{sum:2000,n:1},reeve:{sum:1000,n:1},ploughman:{sum:200,n:1},priest:{sum:0,n:1}};
  const room={idx:0,arch:'temple',state:'sound',w:18,d:20};f.s.buildings=[room];f.W.bldList=[room];f.W._pm=new Map(f.H.map(p=>[p.id,p]));f.W.technology={known:{}};f.s.technology={adopted:{}};
  Object.assign(f.C,{KL:0,KR:1,KS:2,KLaw:3,KA:4,KRi:5,KC:6,KCr:7,KH:8,GW:1,GD:2,GV:3,GB:4,TILLERS:new Set(['ploughman']),TRADE_W:{merchant:1.6,reeve:.3},day:()=>d,year:()=>1,AD:()=>1250,
    RESID:new Set(['inn','hospital','house']),institutionalCapability:()=>({available:false}),livingNotableCandidates:()=>[],trait:()=>0,technologyActorsDirty:()=>{},technologyRecordTeaching:(s,p,v)=>{s.receipts=(s.receipts||0)+v;},houseAcct:hi=>hi?f.W.houses[hi]:'crown',purse:hi=>hi?f.W.houses[hi].gold:f.W.treasury,
    rentDue:()=>0,sovOn:()=>true,plyH:()=>0,esc:String,householdHeadsChanged:()=>{},emit:()=>{}});
  vm.runInContext(constructionRules+'\n'+technologyRules+'\n'+['constructionCapability','technologyKey','technologyCapability','technologyEffect','tradeIncome','capOf'].map(fn).join('\n')+'\n'+learning,f.C);
  return {...f,master,parent,kid,other,room,setDay:x=>d=x};
}

test('a real room and native teacher need profitable pupils and actual family surplus before opening',()=>{
  const f=fixture(),coins=f.coins(),Q=f.eval('learningRoomQuote(s,s.buildings[0])');assert.ok(Q);assert.equal(Q.master.id,f.master.id);assert.equal(Q.pupils.length,2);near(f.coins(),coins);
  f.room.state='ruin';assert.equal(f.eval('learningRoomQuote(s,s.buildings[0])'),null);f.room.state='sound';
  f.parent.w=0;assert.equal(f.eval('learningRoomQuote(s,s.buildings[0])'),null);
});

test('actual daily tuition reaches a named master and only paid delivered lessons raise skills',()=>{
  const f=fixture(),coins=f.coins(),before=f.eval('means(H[1])');f.eval('tickLearning()');
  assert.equal(f.W.schools.length,1);const S=f.W.schools[0];assert.equal(S.master,f.master.id);assert.equal(f.master.office,'master');assert.equal(S.pupils.length,2);
  assert.ok(S.fees>0);near(f.eval('means(H[1])'),before-S.fees);near(f.s.receipts,S.fees);near(f.coins(),coins);assert.ok(f.kid.sk[0]>0);assert.ok(f.other.sk[3]>0);
  const skill=f.kid.sk[0],paid=S.fees;f.eval('tickLearning()');assert.equal(f.kid.sk[0],skill);assert.equal(S.fees,paid);
  f.setDay(7);f.eval('tickLearning()');assert.equal(f.kid.sk[0],skill,'Sunday has tuition support but no delivered classroom lesson');
});

test('the worker read report changes neither money, school state nor skills',()=>{
  const f=fixture();f.eval('tickLearning()');const before=f.eval('JSON.stringify([W.schools,s.schoolIds,H.map(p=>Array.from(p.sk))])'),coins=f.coins();
  for(let i=0;i<5;i++)f.eval('learningState();learningSchoolsHTML()');near(f.coins(),coins);assert.equal(f.eval('JSON.stringify([W.schools,s.schoolIds,H.map(p=>Array.from(p.sk))])'),before);
});

test('fees cannot consume the next bread and rent; school closes rather than fabricating support',()=>{
  const f=fixture();f.eval('tickLearning()');const skill=f.kid.sk[0],S=f.W.schools[0];f.parent.w=0;f.setDay(2);f.eval('tickLearning()');
  assert.equal(S.gone,true);assert.equal(f.kid.sk[0],skill);assert.equal(f.kid.study.closed,true);assert.equal(f.master.schoolMaster,undefined);assert.equal(f.master.tr,'priest');assert.equal(f.W.schools.length,1);
});

test('named stipend payments conserve money and loss of teacher or actual room stops lessons',()=>{
  const f=fixture();f.s.schoolAllowance=50;const crown=f.W.treasury,coins=f.coins();f.eval('tickLearning()');const S=f.W.schools[0];assert.ok(S.stipends>0);near(f.W.treasury,crown-S.stipends);near(f.coins(),coins);
  const skill=f.kid.sk[0];f.room.removed=true;f.setDay(2);f.eval('tickLearning()');assert.equal(S.gone,true);assert.equal(f.kid.sk[0],skill);
});

test('unsupported calendar education cannot add book skills after the opening',()=>{
  const f=fixture();Object.assign(f.C,{BOOKISH:new Set(['merchant']),LETTERED:new Set(['merchant']),eduPlace:()=>({school:true,grammar:true,church:true,cath:true,town:true})});vm.runInContext(fn('educate'),f.C);
  const before=Array.from(f.kid.sk);f.eval('educate(H[2],10,s,false)');for(const k of[0,1,2,3])assert.equal(f.kid.sk[k],before[k]);
});

test('graduates record actual achieved skills and remain native people for ordinary office recruitment',()=>{
  const f=fixture();f.kid.age=17;f.kid.sk[0]=.5;f.eval('tickLearning()'); // already capable people do not need a second school roll
  const q={id:0,si:0,master:f.master.id,masterName:'Teacher',graduates:0};f.C.S=q;f.kid.study={school:0,closed:false,graduated:false};
  assert.equal(f.eval('learningGraduate(S,H[2])'),true);assert.equal(f.kid.study.graduated,true);assert.equal(q.graduates,1);assert.equal(f.kid.office,undefined);assert.equal(f.kid.si,0);assert.ok(f.W.settlements[0].folk.includes(f.kid));
});

function universityFixture(){
  const f=fixture(8);f.kid.age=16;f.other.age=17;f.kid.sk[0]=.2;f.other.sk[0]=.2;f.s._job.merchant.sum=9000;
  const scholar=f.H[7];Object.assign(scholar,{age:19,tr:'labourer',si:1,sk:new Float32Array([.2,.1,.1,.1,0,0,0,0,0])});
  const home={name:'village',owner:0,pop:1,kind:'village',folk:[scholar],buildings:[],stores:{grain:0,fish:0},pos:{x:500,z:0},px:{grain:1,fish:2},_job:{labourer:{sum:0,n:1}}};f.s.folk=f.s.folk.filter(p=>p!==scholar);f.W.settlements.push(home);f.C.home=home;f.eval('householdHeadsChanged(s);householdsOf(s);householdsOf(home)');
  const inn={idx:1,arch:'inn',state:'sound',w:6,d:10,tier:0,hh:[],ownerId:'lord',title:{owner:'crown'},_rent:360,s:f.s};f.s.buildings.push(inn);f.W.bldList.push(inn);
  Object.assign(f.C,{institutionalCapability:()=>({available:true}),WALK_MPD:750,route:(a,b)=>({len:500,poly:[f.W.settlements[a].pos,f.W.settlements[b].pos]}),technologyContact:(a,b)=>{f.W.contacts=(f.W.contacts||0)+1;}});
  f.eval('tickLearning()');f.setDay(2);f.eval('tickLearning()');return {...f,home,inn,scholar};
}

test('a university needs four actual supported masters and pays their own native households',()=>{
  const f=universityFixture(),U=f.W.universities[0],S=f.W.schools[U.school];assert.equal(U.active,true);assert.equal(U.masters.length,4);assert.equal(S.staff.length,4);
  for(const id of U.masters){const p=f.H.find(p=>p.id===id);assert.equal(p.office,'master');assert.ok(S.contracts[id].paid>0);assert.equal(S.contracts[id].lastPaidDay,2);}
  const coins=f.coins();f.setDay(3);f.eval('tickLearning()');near(f.coins(),coins);assert.ok(U.fees>0);assert.equal(new Set(U.masters).size,4);const report=f.eval('JSON.stringify([W.universities,W.schools])');f.eval('learningState();learningSchoolsHTML()');assert.equal(f.eval('JSON.stringify([W.universities,W.schools])'),report);near(f.coins(),coins);
  f.H.find(p=>p.id===U.masters[1]).dead=true;f.setDay(4);f.eval('tickLearning()');assert.equal(S.gone,true);assert.equal(U.active,false);
});

test('a real travelling scholar retains his family, pays board at destination and is not fed twice',()=>{
  const f=universityFixture(),A=f.scholar._hh,U=f.W.universities[0];f.setDay(3);f.eval('tickLearning()');assert.equal(f.scholar.away.why,'scholar');assert.equal(f.scholar.si,1);assert.ok(f.home.folk.includes(f.scholar));assert.equal(f.scholar._hh,A);assert.ok(f.W.travellers.some(t=>t.p===f.scholar&&t.why==='scholar'));assert.equal(f.scholar.study.journey.board,0);
  const coins=f.coins(),gold=A.assets.w,food=f.s.stores.grain;f.setDay(4);f.eval('tickLearning()');assert.ok(U.board>0);assert.ok(U.lodging>0);assert.ok(A.assets.w<gold);assert.ok(f.s.stores.grain<food);near(f.coins(),coins);assert.equal(f.eval('learningHomeAbsence(home,H[7]._hh)'),1);assert.equal(f.eval('learningHouseholdSlots(W.bldList[1])'),1);assert.equal(f.W.contacts,1);
  f.inn.removed=true;const skill=f.scholar.sk[0];f.setDay(5);f.eval('tickLearning()');assert.equal(f.scholar.study.closed,true);assert.equal(f.scholar.sk[0],skill);assert.ok(f.W.travellers.some(t=>t.p===f.scholar&&t.home));
});

test('native nobles gain book skills only through their real patron paying a named tutor',()=>{
  const f=fixture();f.kid.age=3;f.other.age=3;const child={id:100,age:10,alive:true,house:0,sk:new Float32Array(9)},keep={idx:1,arch:'keep',state:'sound',w:12,d:8,s:f.s};f.W.notables=[child];f.W.armies=[];f.s.buildings.push(keep);f.W.bldList.push(keep);f.s.tutorAllowance=1000;
  Object.assign(f.C,{livingNotableCandidates:predicate=>f.W.notables.filter(predicate),ageOf:n=>n.age,notableById:id=>f.W.notables.find(n=>n.id===id),notableResidence:()=>({s:f.s,b:keep})});const coins=f.coins(),crown=f.W.treasury;f.eval('tickLearning()');const T=f.W.tutors[0];assert.equal(T.master,f.master.id);assert.ok(T.paid>0);near(f.W.treasury,crown-T.paid);near(f.coins(),coins);assert.ok(child.sk[0]>0);assert.ok(child.sk[3]>0);assert.equal(f.master.tutorMaster,T.id);
  vm.runInContext(fn('technologySchoolMaster'),f.C);assert.equal(f.eval('technologySchoolMaster(s,H[0])'),true);const skill=child.sk[0];keep.removed=true;f.setDay(2);f.eval('tickLearning()');assert.equal(T.gone,true);assert.equal(child.sk[0],skill);assert.equal(f.master.tutorMaster,undefined);assert.equal(f.master.tr,'priest');
});

test('college proposal and journal command require knowledge, real funds and completed physical prerequisites',()=>{
  const f=fixture();f.room.x=0;f.room.z=0;f.W.projects=[];f.s._lay={live:{compoundSite:(raw,mode)=>mode==='survey'?{...raw,path:[{x:raw.f.x,z:raw.f.z},{x:0,z:0}]}:raw}};
  Object.assign(f.C,{constructionTechnologyRecipe:()=>({laborFactor:1,timber:2}),storageGroundClaim:()=>({ok:true,recipients:[]}),compoundEnsure:()=>assert.fail('a read quote creates no compound'),price:(s,g)=>s.px[g]??1});assert.equal(f.eval('collegePlanQuote(s)'),null);
  f.C.institutionalCapability=()=>({available:true});const coins=f.coins(),Q=f.eval('collegePlanQuote(s)');assert.ok(Q);assert.equal(Q.site.arch,'hall');assert.deepEqual(Array.from(Q.purposes),['school']);assert.equal(Q.groundRequired,true);assert.equal(f.W.projects.length,0);near(f.coins(),coins);assert.equal(f.eval('collegePlanQuote(s,"residence")'),null);
  f.W.treasury=0;assert.equal(f.eval('collegePlanQuote(s)'),null);f.W.treasury=1000;f.s.owner=1;assert.equal(f.eval('collegeCmd("0:classroom")'),false);
});


test('actual scholar board consumes only the remaining meal and retains its receipt through same-day graduation',()=>{
  const f=universityFixture();f.setDay(3);f.eval('tickLearning()');f.setDay(4);const U=f.W.universities[0],S=f.W.schools[U.school];f.C.school=S;
  f.eval('personBoardRecord(H[7],0,FOOD/2,"abbey:0")');const food=f.s.stores.grain,coins=f.coins();assert.equal(f.eval('learningScholarBoard(school,H[7])'),true);near(f.s.stores.grain,food-f.eval('FOOD')/2);near(f.eval('personBoardMeal(H[7])'),f.eval('FOOD'));near(f.scholar.study.journey.boarded,1);near(f.coins(),coins);
  const paid=U.board,rent=U.lodging,gold=f.scholar._hh.assets.w;assert.equal(f.eval('learningScholarBoard(school,H[7])'),true);near(f.s.stores.grain,food-f.eval('FOOD')/2);near(U.board,paid);near(U.lodging,rent);near(f.scholar._hh.assets.w,gold);
  f.scholar.sk[0]=.75;assert.equal(f.eval('learningGraduate(school,H[7])'),true);assert.equal(f.scholar.study.journey.leave,4);near(f.eval('learningHomeAbsence(home,H[7]._hh)'),1);near(f.eval('personBoardMeal(H[7])'),f.eval('FOOD'));
  f.setDay(5);near(f.eval('learningHomeAbsence(home,H[7]._hh)'),0);near(f.eval('personBoardMeal(H[7])'),0);
});

test('an already fed visiting scholar still pays one actual lodging bill without buying a second meal',()=>{
  const f=universityFixture();f.setDay(3);f.eval('tickLearning()');f.setDay(4);const U=f.W.universities[0],S=f.W.schools[U.school];f.C.school=S;f.eval('personBoardRecord(H[7],0,FOOD,"government")');const food=f.s.stores.grain,coins=f.coins();
  assert.equal(f.eval('learningScholarBoard(school,H[7])'),true);near(f.s.stores.grain,food);near(U.board,0);assert.ok(U.lodging>0);near(f.scholar.study.journey.boarded,1);near(f.coins(),coins);const rent=U.lodging;
  assert.equal(f.eval('learningScholarBoard(school,H[7])'),true);near(U.lodging,rent);near(f.s.stores.grain,food);
});


for(const symbolic of ['lord','church'])test(`a scholar's symbolic ${symbolic} lodging title resolves an actual rent recipient`,()=>{
  const f=universityFixture();f.inn.title={owner:symbolic};f.inn.ownerId=symbolic;if(symbolic==='church')f.inn.ch={fund:0};f.C.inn=f.inn;const Q=f.eval('learningLodgingQuote(s,H[7])');assert.ok(Q);assert.equal(Q.owner,symbolic==='lord'?'crown':f.inn);const title=f.inn.title;
  f.setDay(3);f.eval('tickLearning()');assert.equal(f.scholar.study.journey.owner,Q.owner);const coins=f.coins()+(f.inn.ch?.fund||0);f.setDay(4);f.eval('tickLearning()');assert.ok(f.scholar.study.journey.lodgingPaid>0);if(symbolic==='church')assert.ok(f.inn.ch.fund>0);near(f.coins()+(f.inn.ch?.fund||0),coins);assert.equal(f.inn.title,title);assert.equal(f.inn.title.owner,symbolic);
});

test('a legacy unowned inn still pays its actual resident host household',()=>{
  const f=fixture(),b={idx:1,arch:'inn',state:'sound',w:12,d:10,tier:0,hh:[f.parent],_rent:360,s:f.s};f.parent.bh=b;f.s.buildings.push(b);f.W.bldList.push(b);const coins=f.coins(),Q=f.eval('learningLodgingQuote(s,H[2])');assert.ok(Q);assert.equal(Q.owner,f.parent._hh);assert.equal(Q.host,f.parent);near(f.coins(),coins);assert.equal(b.title,undefined);assert.equal(b.ownerId,undefined);
});

test('indexed lodging keeps native order and revalidates current room state, capacity and newly built candidates',()=>{
  const f=fixture(),a={idx:1,arch:'inn',state:'sound',w:6,d:10,tier:0,hh:[],title:{owner:'crown'},_rent:360,s:f.s},b={idx:2,arch:'hospital',state:'sound',w:6,d:10,tier:0,hh:[],title:{owner:'crown'},_rent:360,s:f.s};f.s.buildings.push(a,b);f.W.bldList.push(a,b);let scans=0;const buildings=f.s.buildings;f.s.buildings=new Proxy(buildings,{get:(target,key)=>{if(key===Symbol.iterator)scans++;return Reflect.get(target,key);}});
  assert.equal(f.eval('learningLodgingQuote(s,H[2])').b,a);assert.equal(scans,1);for(let i=0;i<4;i++)assert.equal(f.eval('learningLodgingQuote(s,H[2])').b,a);assert.equal(scans,1,'prospective students share one native ordered building pass');a.state='ruin';assert.equal(f.eval('learningLodgingQuote(s,H[2])').b,b);a.state='sound';a.hh=[f.parent];f.parent.bh=a;assert.equal(f.eval('learningLodgingQuote(s,H[2])').b,b,'a currently occupied native household slot cannot be offered');b.removed=true;assert.equal(f.eval('learningLodgingQuote(s,H[2])'),null);assert.equal(scans,1);
  const c={idx:3,arch:'inn',state:'sound',w:6,d:10,tier:0,hh:[],title:{owner:'crown'},_rent:360,s:f.s};buildings.push(c);f.W.bldList.push(c);assert.equal(f.eval('learningLodgingQuote(s,H[2])').b,c);assert.equal(scans,2,'a real added building invalidates the structural candidate index immediately');assert.equal(f.eval('learningLodgingQuote(s,H[2])').b,c);assert.equal(scans,2);
});

function universityProposalFixture(){
  const f=fixture(8);f.kid.age=16;f.other.age=17;f.kid.sk[0]=.2;f.other.sk[0]=.2;f.H[7].sk[0]=.2;f.s._job.merchant.sum=9000;
  f.eval('tickLearning()');f.C.institutionalCapability=()=>({available:true});const Q=f.eval('learningUniversityQuote(s)');assert.ok(Q,'the native paid school and three exclusive extra masters can form a supported company');
  assert.deepEqual(Array.from(Q.staff,p=>p.id),[f.master.id,...f.H.slice(4,7).map(p=>p.id)]);return f;
}
const universityQuoteTruth=f=>f.eval('JSON.stringify([W.schools,W.universities,W.treasury,s.schoolIds,s.university,H.map(p=>[p.id,p.office,p.officeFor,p.schoolMaster,p.tr,means(p),Array.from(p.sk)])])');

test('a university quote rejects a missing, dead, absent or reassigned primary master before pricing faculty',()=>{
  for(const assignment of ['W._pm.delete(H[0].id)','H[0].dead=true','H[0].away={until:10,why:"errand"}','H[0].office="clerk"','H[0].schoolMaster=99','H[0].officeFor="school:99"']){
    const f=universityProposalFixture();f.eval(assignment);const before=universityQuoteTruth(f),coins=f.coins();assert.equal(f.eval('learningUniversityQuote(s)'),null,assignment);
    assert.equal(universityQuoteTruth(f),before,'rejection does not appoint, pay or close a school');near(f.coins(),coins);assert.equal(f.W.universities,undefined);assert.equal(f.W.schools[0].gone,false);
  }
});

test('a university quote revalidates exclusive extra masters from the current cached native roster',()=>{
  for(const assignment of ['H[4].estateOffice="keeper"','H[4].abbeyJob="servant"','H[4].schoolMaster=99','H[4].tutorMaster=0','H[4].study={closed:false}','H[4].apprentice={closed:false}','H[4].craft={employer:1}','H[4].away={until:10,why:"errand"}','H[4].dead=true']){
    const f=universityProposalFixture(),index=f.s._learningIndex;assert.ok(index.masters.includes(f.H[4]));f.eval(assignment);const before=universityQuoteTruth(f),coins=f.coins();assert.equal(f.eval('learningUniversityQuote(s)'),null,assignment);
    assert.equal(f.s._learningIndex,index,'eligibility revalidation preserves the prepared native candidate order');assert.equal(universityQuoteTruth(f),before);near(f.coins(),coins);assert.equal(f.W.universities,undefined);
  }
});

test('readonly school equipment candidates skip a missing or unavailable master before daily school closure',()=>{
  for(const assignment of ['W._pm.delete(H[0].id)','H[0].dead=true','H[0].away={until:10,why:"errand"}','H[0].office="clerk"','H[0].schoolMaster=99','H[0].officeFor="school:99"']){
    const f=universityProposalFixture();vm.runInContext(['technologyEquipmentFarms','technologyEquipmentCandidates'].map(fn).join('\n'),f.C);const actual=f.eval('technologyEquipmentCandidates(s,true)');
    assert.deepEqual(Array.from(actual,q=>q.key),['printing','clock','spectacles']);assert.ok(actual.every(q=>q.payer===f.master));f.eval(assignment);const before=universityQuoteTruth(f),coins=f.coins(),index=f.s._craftIndex;
    assert.equal(f.eval('technologyEquipmentCandidates(s,true).length'),0,assignment);assert.equal(universityQuoteTruth(f),before);near(f.coins(),coins);assert.equal(f.s._craftIndex,index,'a readonly card does not publish a new actor index');assert.equal(f.W.schools[0].gone,false,'actual daily school service owns closure');
  }
});
