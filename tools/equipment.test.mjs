import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {realm,near} from './ownership-fixture.mjs';
const source=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
function fn(n){return source.match(new RegExp('^function '+n+'\\b[\\s\\S]*?(?=^function |^const |^/\\*|$(?![\\s\\S]))','m'))?.[0]||'';}
const craft=source.slice(source.indexOf('/* CRAFT LADDER (#43):'),source.indexOf('/* the rank-and-file notables share'));
const rules=source.slice(source.indexOf('const TECH_RULES=Object.freeze('),source.indexOf('const TECH_KEYS='));
function fixture(commodity=false){
  const f=realm({crown:10000,cash:5000,households:6,pop:6,commodity});let d=1;for(const p of f.H)Object.assign(p,{age:35,tr:'weaver',trChosen:true,sk:new Float32Array(9)});
  const rooms=[{idx:0,arch:'burgher',w:12,d:10,state:'sound',tier:1,ownerId:f.H[0].id,s:f.s},{idx:1,arch:'mill',w:10,d:8,state:'sound',tier:0,ownerId:f.H[2].id,s:f.s},{idx:2,arch:'smithy',w:12,d:10,state:'sound',tier:1,ownerId:f.H[3].id,s:f.s}];f.s.buildings=rooms;f.W.bldList=rooms;f.W.projects=[];f.s.mill=rooms[1];f.s.river=true;f.s.harbor=true;f.s.schoolIds=[];
  f.H[1].tr='carpenter';f.H[2].tr='miller';f.H[3].tr='smith';f.H[4].tr='bowyer';f.H[5].tr='merchant';for(const [i,b]of[[0,rooms[0]],[3,rooms[2]]]){f.H[i].bh=b;f.H[i].craft={rank:'master',qualified:true,room:b.idx,employees:[],opened:0,takings:10000,lastWorkDay:1};b.craftMasters=[f.H[i].id];}
  f.eval('H.forEach(householdAccount);householdsOf(s)');f.W._pm=new Map(f.H.map(p=>[p.id,p]));f.s._job={weaver:{sum:10000,n:1},miller:{sum:10000,n:1},carpenter:{sum:10000,n:1},smith:{sum:10000,n:1},merchant:{sum:10000,n:1}};
  Object.assign(f.C,{day:()=>d,year:()=>0,AD:()=>1600,TRADE_W:{weaver:1,smith:1},TILLERS:new Set(['ploughman']),TRADE_ARCH:{weaver:'burgher',smith:'smithy'},KL:0,KR:1,KS:2,KLaw:3,KA:4,KRi:5,KCr:7,GW:0,GD:2,trait:()=>0,
    price0:(s,g)=>s.px?.[g]??1,technologyKey:k=>k,technologyCapability:(s,key)=>({available:s.denied!==key}),waterMill:s=>!!(s.mill&&s.river&&s.mill.state==='sound'),institutionalCapability:()=>({available:true}),marketTradeIndexInvalidate:()=>{},sovOn:()=>true,plyH:()=>0,rentDue:()=>0,chestReserve:()=>0,esc:String,LS:{TILLED:1},ARABLE:new Set([1]),G:{ordersDirty:false},emit:()=>{},houseAtWar:()=>false,notableById:()=>null,generalship:()=>1,menQuality:()=>1,horseShare:()=>0,rand:()=>.5});
  const names=['resolveClash','siegeEngines','learningHead','learningPayer','learningFamilySize','learningPerson','learningSpare','learningTeacherCost','tradeIncome','corpFound','workers_','millHolder','technologyEffect'];
  vm.runInContext(rules+'\n'+names.map(fn).join('\n')+'\n'+craft,f.C);
  for(const g of ['timber','tools','stone','cloth','ore','wool','paper']){f.s.stores[g]=100;f.eval(`offer(s,'${g}','crown',100)`);}return{...f,rooms,setDay:x=>d=x};
}

for(const commodity of[false,true])test(`a loom is paid and materially consumed before installation (${commodity?'balance':'legacy'} ledger)`,()=>{
  const f=fixture(commodity),coins=f.coins(),timber=f.s.stores.timber,tools=f.s.stores.tools,Q=f.eval('technologyEquipmentQuote(s,"loom",{kind:"building",id:0},H[0])');assert.ok(Q);f.C.Q=Q;const q=f.eval('technologyEquipmentCommission(Q)');f.C.q=q;
  assert.equal(f.eval('technologyEffect(s,"loom",W.bldList[0])'),1);f.eval('technologyEquipmentTick(q)');assert.equal(f.rooms[0].techEquipment,undefined);near(f.s.stores.timber,timber-8);near(f.s.stores.tools,tools-2);assert.ok(q.paid>0);near(f.coins(),coins);
  for(let i=2;i<=Q.days;i++){f.setDay(i);f.eval('technologyEquipmentTick(q)');}assert.equal(q.complete,true);assert.equal(f.rooms[0].techEquipment.loom.installed,true);near(q.paid,Q.labour);assert.equal(f.eval('technologyEffect(s,"loom",W.bldList[0])'),1.3);near(f.coins(),coins);assert.equal(f.eval('technologyEquipmentQuote(s,"loom",{kind:"building",id:0},H[0])'),null);
});

test('technology, real native maker availability, purpose and funds all gate machinery',()=>{
  const f=fixture();f.s.denied='loom';assert.equal(f.eval('technologyEquipmentQuote(s,"loom",{kind:"building",id:0},H[0])'),null);delete f.s.denied;f.H[0].w=0;assert.equal(f.eval('technologyEquipmentQuote(s,"loom",{kind:"building",id:0},H[0])'),null);f.H[0].w=5000;
  f.eval('globalThis.q=technologyEquipmentCommission(technologyEquipmentQuote(s,"loom",{kind:"building",id:0},H[0]))');f.H[1].estateOffice={job:'keeper'};const before=f.coins();f.eval('technologyEquipmentTick(q)');assert.equal(f.C.q.worked,0);assert.equal(f.C.q.materialPaid,0);near(f.coins(),before);delete f.H[1].estateOffice;f.rooms[0].state='ruin';f.eval('technologyEquipmentTick(q)');assert.equal(f.C.q.dead,true);assert.equal(f.rooms[0].techEquipment,undefined);
});

test('tools and cloth processing bind to actual masters and only paid current native journeymen',()=>{
  const f=fixture();const base=f.eval('technologyCraftCapacity(s,H[0]._hh,"weaver")');assert.ok(base>0);f.rooms[0].techEquipment={loom:{installed:true},spinningWheel:{installed:true}};near(f.eval('technologyCraftCapacity(s,H[0]._hh,"weaver")'),base*1.3*1.5);
  f.H[5].craft={employer:f.H[0].id,paidDay:0,fraction:1};f.H[0].craft.employees=[f.H[5].id];near(f.eval('technologyCraftCapacity(s,H[0]._hh,"weaver")'),base*1.3*1.5);f.H[5].craft.paidDay=1;near(f.eval('technologyCraftCapacity(s,H[0]._hh,"weaver")'),base*1.3*1.5*2);
  f.H[0].away={until:20};assert.equal(f.eval('technologyCraftCapacity(s,H[0]._hh,"weaver")'),0);assert.equal(f.eval('technologyCottageHands(s,H[0]._hh)'),0);delete f.H[0].away;f.H[0].role='company soldier';assert.equal(f.eval('institutionalJobHeld(H[0])'),true);assert.equal(f.eval('technologyCraftCapacity(s,H[0]._hh,"weaver")'),0);assert.equal(f.eval('technologyCottageHands(s,H[0]._hh)'),0);delete f.H[0].role;f.H[0].office='clerk';assert.equal(f.eval('technologyCraftCapacity(s,H[0]._hh,"weaver")'),0);assert.equal(f.eval('technologyCottageHands(s,H[0]._hh)'),0);
});

test('a powered mill needs a present native operator and real per-use receipts; its day has finite work',()=>{
  const f=fixture();f.s.mill.techEquipment={fullingMill:{installed:true}};const coins=f.coins(),m=f.H[2].w,p=f.H[0].w;assert.equal(f.eval('technologyMillService(s,"fullingMill",H[0],1,"cloth")'),1);assert.ok(f.H[2].w>m);assert.ok(f.H[0].w<p);near(f.coins(),coins);assert.equal(f.eval('technologyMillService(s,"fullingMill",H[0],1,"cloth")'),0,'one actual miller has one day');
  f.setDay(2);f.H[2].away={until:40};assert.equal(f.eval('technologyMillService(s,"fullingMill",H[0],1,"cloth")'),0);delete f.H[2].away;f.H[0].w=0;assert.equal(f.eval('technologyMillService(s,"fullingMill",H[0],1,"cloth")'),0);
});

test('a fitted plough and collar require actual animals and land; their effects disappear with those inputs',()=>{
  const f=fixture();f.H[0].tr='ploughman';f.s.furl=[{wk:f.H[0].id,state:1,kind:1,area:10000}];f.eval('stockOf(s,H[0]).animals.cattle=2;stockOf(s,H[0]).animals.horses=1');const Q=f.eval('technologyEquipmentQuote(s,"heavyPlough",{kind:"person",id:H[0].id},H[0])');assert.ok(Q);f.H[0].techEquipment={heavyPlough:{installed:true},horseCollar:{installed:true}};
  near(f.eval('technologyFarmEquipmentYield(s)'),1.1);const draft=f.eval('technologyDraftTeams(s)');near(draft.extraOx,.24);near(draft.extraHorses,.2);f.eval('stockOf(s,H[0]).animals.cattle=0');near(f.eval('technologyFarmEquipmentYield(s)'),1);assert.equal(f.eval('technologyEquipmentUse(s,"heavyPlough",H[0],H[0])'),false);
});

test('printed teaching consumes purchased native paper and gives no extra lesson without sheets',()=>{
  const f=fixture(),coins=f.coins();f.rooms[0].techEquipment={printing:{installed:true}};const S={si:0,building:f.rooms[0],pupils:[1,2,3]};f.C.school=S;const stock=f.s.stores.paper;assert.equal(f.eval('technologyPrintedLesson(school,H[0])'),1.5);near(f.s.stores.paper,stock-.003);near(S.paperUsed,.003);near(f.coins(),coins);
  f.eval('mkt(s,"paper").clear();s.stores.paper=0');assert.equal(f.eval('technologyPrintedLesson(school,H[0])'),1);f.setDay(7);assert.equal(f.eval('technologyPrintedLesson(school,H[0])'),1);
});

test('paid arms bind to actual native holders and the army siege record waits for real completed work',()=>{
  const f=fixture();for(const p of f.H.slice(0,3))p.sk[4]=.5;const a={id:10,house:0,home:0,men:f.H.slice(0,3),strength:3};f.W.armies=[a];const Q=f.eval('technologyEquipmentQuote(s,"crossbow",{kind:"army",id:10},"crown")');assert.ok(Q);assert.equal(Q.holders.length,3);assert.equal(f.eval('technologyArmyEquipmentFactor(s,W.armies[0])'),1);f.C.Q=Q;f.eval('globalThis.q=technologyEquipmentCommission(Q)');for(let i=1;i<=Q.days;i++){f.setDay(i);f.eval('technologyEquipmentTick(q)');}assert.equal(a.techEquipment.crossbow.installed,true);near(f.eval('technologyArmyEquipmentFactor(s,W.armies[0])'),1.1);
  const siege=f.eval('technologyEquipmentQuote(s,"siegeEngine",{kind:"army",id:10},"crown")');f.C.siege=siege;f.eval('globalThis.ram=technologyEquipmentCommission(siege)');assert.equal(a.techEquipment.siegeEngine,undefined);for(let i=1;i<=siege.days;i++){f.setDay(i+40);f.eval('technologyEquipmentTick(ram)');}assert.equal(a.techEquipment.siegeEngine.installed,true);assert.equal(a.techEquipment.siegeEngine.method,'siegeEngine');
});

test('public equipment queries create neither jobs, private indexes, projects, coins nor equipment',()=>{
  const f=fixture();delete f.s._craftIndex;delete f.s._job;delete f.s._tc;delete f.s._tcY;f.C.price=(s,g)=>{(s.px||(s.px={}))[g]??=1;return s.px[g];};f.C.tradeCounts=()=>assert.fail('a public quote must not build the simulation trade cache');const before=f.eval('JSON.stringify([s.px,s._tc,s._tcY,s._craftIndex,W.projects,H.map(p=>p.techEquipment)])'),coins=f.coins();f.eval('technologyEquipmentHTML(s)');assert.equal(f.eval('JSON.stringify([s.px,s._tc,s._tcY,s._craftIndex,W.projects,H.map(p=>p.techEquipment)])'),before);near(f.coins(),coins);
});

test('a native maker building his own device records real self-work without an invented wage',()=>{
  const f=fixture();f.H[3].age=55;f.s._job.smith.sum=10000;const Q=f.eval('technologyEquipmentQuote(s,"spectacles",{kind:"person",id:H[3].id},H[3])');assert.ok(Q);f.C.Q=Q;f.eval('globalThis.q=technologyEquipmentCommission(Q)');const coins=f.coins(),before=f.H[3].w;for(let i=1;i<=Q.days;i++){f.setDay(i);f.eval('technologyEquipmentTick(q)');}assert.equal(f.C.q.complete,true);near(f.C.q.paid,0);assert.ok(f.C.q.selfWorked>0);assert.ok(f.H[3].w<before);near(f.coins(),coins);assert.equal(f.eval('technologySightFactor(s,H[3])'),1);
});

test('a real paper mill converts paid cloth and wood under one native commodity title',()=>{
  const f=fixture(true);f.s.mill.techEquipment={paperMill:{installed:true}};f.s._dem={paper:.5};const coins=f.coins(),paper=f.s.stores.paper,cloth=f.s.stores.cloth,timber=f.s.stores.timber;f.eval('technologyPaperMill(s)');near(f.s.stores.paper,paper+.5);near(f.s.stores.cloth,cloth-.1);near(f.s.stores.timber,timber-.05);near(f.eval('mkt(s,"paper").get(H[2])'),.5);near(f.coins(),coins);
});


test('native clash and siege battering consume actual paid gear instead of the calendar',()=>{
  const f=fixture();f.W.weather={state:'clear'};const a={id:1,house:0,home:0,at:0,strength:3,morale:70,men:f.H.slice(0,3)},b={id:2,house:1,home:0,at:0,strength:3,morale:70,men:f.H.slice(3)};f.C.a=a;f.C.b=b;
  assert.equal(f.eval('resolveClash(a,b)'),false);assert.equal(f.eval('siegeEngines(a,s)'),0);
  a.techEquipment={crossbow:{installed:true,si:0,holders:a.men.map(p=>p.id)}};assert.equal(f.eval('resolveClash(a,b)'),true);
  const engine={installed:true,method:'trebuchet',si:0,materials:{timber:40,tools:6},paid:300};a.techEquipment.siegeEngine=engine;a.techEquipment.trebuchet=engine;a.men[0].sk[7]=.5;a.men[1].sk[7]=.5;assert.ok(f.eval('siegeEngines(a,s)')>.0035);a.men.forEach(p=>{p.sk[7]=0;p.tr='archer';});assert.equal(f.eval('siegeEngines(a,s)'),0,'a real machine needs actual engineers');
});

test('army detachments partition actual holder kits and never duplicate the paid siege engine',()=>{
  const f=fixture(),engine={installed:true,method:'trebuchet',si:0,materials:{timber:40},paid:300},a={home:0,men:f.H.slice(0,3),techEquipment:{crossbow:{installed:true,holders:f.H.map(p=>p.id),materials:{tools:60},paid:600},trebuchet:engine,siegeEngine:engine}},b={home:0,men:f.H.slice(3)};f.C.a=a;f.C.b=b;f.eval('technologySplitArmyEquipment(a,b)');assert.equal(b.techEquipment.siegeEngine,undefined);assert.equal(a.techEquipment.siegeEngine,engine);assert.equal(b.techEquipment.crossbow.holders.length,3);assert.equal(a.techEquipment.crossbow.holders.length,3);near(a.techEquipment.crossbow.paid+b.techEquipment.crossbow.paid,600);near(a.techEquipment.crossbow.materials.tools+b.techEquipment.crossbow.materials.tools,60);
  a.men.push(...b.men);f.eval('technologyMergeArmyEquipment(a,b)');assert.equal(a.techEquipment.crossbow.holders.length,6);near(a.techEquipment.crossbow.paid,600);assert.equal(Object.keys(b.techEquipment).length,0);
  a.men=f.H.slice(0,3);b.men=f.H.slice(3);f.eval('technologySplitArmyEquipment(a,b,{moveSiege:true})');assert.equal(a.techEquipment.siegeEngine,undefined);assert.equal(a.techEquipment.trebuchet,undefined);assert.equal(b.techEquipment.siegeEngine,engine);assert.equal(b.techEquipment.trebuchet,engine);
});


test('daily apprenticeship preparation preserves exact ordered decisions and actual payments',()=>{
  const reference=fixture(),candidate=fixture();for(const f of[reference,candidate]){for(const i of[1,2,4,5])Object.assign(f.H[i],{age:20,tr:'labourer',trChosen:false,craft:undefined});f.s._job.labourer={sum:40,n:4};f.W.guilds=[{id:0,trade:'weaver',members:[f.H[0].id],ordinances:{apprenticesPerMaster:1}}];f.s.guildIds=[0];}
  let baselineCalls=0,preparedCalls=0;const rw=reference.C.craftWorking,cw=candidate.C.craftWorking;reference.C.craftWorking=(s,p)=>{baselineCalls++;return rw(s,p);};candidate.C.craftWorking=(s,p)=>{preparedCalls++;return cw(s,p);};
  reference.eval(`const I=craftIndex(s),students=[...I.young,...I.heads.filter(p=>ageYrs(p)>=24&&ageYrs(p)<40&&!craftWorking(s,p))];for(const p of students){if(!craftPresent(s,p)||institutionalJobHeld(p))continue;let best=null;for(const[tr,masters]of I.trades)for(const m of masters){const Q=craftApprenticeQuote(s,p,m,tr);if(Q&&(!best||tradeIncome(s,tr)-Q.premium/7>tradeIncome(s,best.tr)-best.premium/7))best=Q;}if(best)craftApprenticeCommission(best);}for(const p of I.heads){if(!craftPresent(s,p)||!p.craft||p.craft.employer||p.apprentice&&!p.apprentice.closed)continue;if(p.craft.rank==='journeyman'){const Q=craftMasterQuote(s,p);if(Q){craftMasterCommission(Q);continue;}for(const m of I.trades.get(p.tr)||[]){const Q2=craftHireQuote(s,m,p);if(Q2){craftHire(Q2);break;}}}}`);
  candidate.eval('craftRecruit(s)');assert.equal(candidate.eval('JSON.stringify(H.map(p=>({id:p.id,w:p.w,tr:p.tr,trChosen:p.trChosen,craft:p.craft,apprentice:p.apprentice})))'),reference.eval('JSON.stringify(H.map(p=>({id:p.id,w:p.w,tr:p.tr,trChosen:p.trChosen,craft:p.craft,apprentice:p.apprentice})))'));near(candidate.coins(),reference.coins());assert.ok(preparedCalls<baselineCalls);assert.equal(candidate.H[0].craft.apprentices.length,1,'actual slot is filled before the next pupil decides');
});
