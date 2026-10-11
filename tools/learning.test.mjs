import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {realm,near} from './ownership-fixture.mjs';
const source=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
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
  const room={idx:0,arch:'temple',state:'sound',w:18,d:20};f.s.buildings=[room];f.W.bldList=[room];f.W._pm=new Map(f.H.map(p=>[p.id,p]));
  Object.assign(f.C,{KL:0,KR:1,KS:2,KLaw:3,KA:4,KRi:5,KC:6,KCr:7,KH:8,GW:1,GD:2,GV:3,GB:4,TILLERS:new Set(['ploughman']),TRADE_W:{merchant:1.6,reeve:.3},day:()=>d,year:()=>1,AD:()=>1250,
    RESID:new Set(['inn','hospital','house']),institutionalCapability:()=>({available:false}),trait:()=>0,technologyActorsDirty:()=>{},technologyRecordTeaching:(s,p,v)=>{s.receipts=(s.receipts||0)+v;},houseAcct:hi=>hi?f.W.houses[hi]:'crown',purse:hi=>hi?f.W.houses[hi].gold:f.W.treasury,
    rentDue:()=>0,sovOn:()=>true,plyH:()=>0,esc:String,householdHeadsChanged:()=>{},emit:()=>{}});
  vm.runInContext(fn('tradeIncome')+'\n'+fn('capOf')+'\n'+learning,f.C);
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
