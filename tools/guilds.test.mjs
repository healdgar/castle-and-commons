import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {realm,near} from './ownership-fixture.mjs';
const source=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const craft=source.slice(source.indexOf('/* CRAFT LADDER (#43):'),source.indexOf('/* the rank-and-file notables share'));
function fn(n){return source.match(new RegExp('^function '+n+'\\b[\\s\\S]*?(?=^function |^const |^/\\*|$(?![\\s\\S]))','m'))?.[0]||'';}
function constant(n){return source.match(new RegExp('^const '+n+'=.*$','m'))?.[0]||'';}
function fixture(){
  const f=realm({crown:2000,cash:1000,households:5,pop:5});let d=1;
  for(const p of f.H)Object.assign(p,{age:35,tr:'baker',trChosen:true,sk:new Float32Array(9)});
  f.H[0].sk[7]=.7;f.H[1].sk[7]=.7;f.H[4].sk[0]=.6;f.H[4].sk[1]=.5;f.H[4].tr='merchant';f.H[2].sk[7]=.5;
  Object.assign(f.H[3],{age:14,tr:'ploughman',trChosen:false,ma:f.H[1]});
  f.eval('H.forEach(householdAccount);bindHousehold(H[3],householdAccount(H[1]));householdsOf(s)');
  const a={idx:0,arch:'bakery',w:12,d:10,state:'sound',tier:0,ownerId:f.H[0].id,s:f.s},b={...a,idx:1,ownerId:f.H[1].id};f.s.buildings=[a,b];f.W.bldList=[a,b];f.H[0].bh=a;f.H[1].bh=b;
  f.W._pm=new Map(f.H.map(p=>[p.id,p]));f.s._job={baker:{sum:12000,n:3},ploughman:{sum:100,n:1},merchant:{sum:1000,n:1}};
  Object.assign(f.C,{day:()=>d,year:()=>0,AD:()=>1250,TRADE_W:{baker:1.2,merchant:1.6},TRADE_ARCH:{baker:'bakery',merchant:'shop'},KL:0,KR:1,KCr:7,GW:0,GD:2,trait:()=>0,
    marketTradeIndexInvalidate:()=>{},institutionalCapability:()=>({available:true}),sovOn:()=>true,plyH:()=>0,rentDue:()=>0,chestReserve:()=>0,esc:String,tills:()=>false,craftWork:()=>0,buildWorks:()=>0});
  const deps=['learningHead','learningPayer','learningFamilySize','learningPerson','learningSpare','learningTeacherCost','tradeIncome','corpFound','craftTransferReceipt'];
  vm.runInContext(deps.filter(n=>n!=='craftTransferReceipt').map(fn).join('\n')+'\n'+craft+'\n'+fn('payCrafts'),f.C);
  f.eval(`H[0].craft={rank:'master',qualified:true,room:0,opened:0,takings:6000,lastWorkDay:1,employees:[]};H[1].craft={rank:'master',qualified:true,room:1,opened:0,takings:6000,lastWorkDay:1,employees:[]};H[2].craft={rank:'journeyman',qualified:true,employees:[]};s.buildings[0].craftMasters=[H[0].id];s.buildings[1].craftMasters=[H[1].id]`);
  return{...f,setDay:x=>d=x,coins:()=>f.coins()+(f.W.guilds||[]).reduce((t,g)=>t+g.gold,0)};
}

test('master contracts pay a real journeyman before work and distribute no independent second share',()=>{
  const f=fixture(),coins=f.coins(),j=f.H[2],m=f.H[0],w=f.eval('craftHireQuote(s,H[0],H[2])');assert.ok(w);f.C.Q=w;assert.equal(f.eval('craftHire(Q)'),true);
  const before=j.w;f.eval('craftEmployeeTick(s,H[2])');assert.ok(j.w>before);assert.equal(j.craft.paidDay,1);assert.equal(j.craft.fraction,1);near(f.coins(),coins);
  f.s._poolBy={baker:100};const jcash=j.w,mCash=m.w,oCash=f.H[1].w;f.eval('payCrafts(s,H)');near(j.w,jcash);near((m.w-mCash)+(f.H[1].w-oCash),100);assert.ok(m.w-mCash>f.H[1].w-oCash);near(f.coins(),coins+100);
  m.w=0;f.setDay(2);f.eval('craftEmployeeTick(s,H[2])');assert.equal(j.craft.employer,undefined);assert.equal(j.craft.fraction,0);assert.equal(j.craft.paidDay,1);
});

test('seven-year apprenticeship has a living master and one real family premium; absence gives no lesson',()=>{
  const f=fixture(),p=f.H[3],m=f.H[0],parent=f.H[1],coins=f.coins(),Q=f.eval('craftApprenticeQuote(s,H[3],H[0],"baker")');assert.ok(Q);f.C.Q=Q;const before=parent.w,master=m.w;assert.equal(f.eval('craftApprenticeCommission(Q)'),true);
  near(parent.w,before-Q.premium);near(m.w,master+Q.premium);near(f.coins(),coins);assert.equal(p.apprentice.master,m.id);assert.equal(p.tr,'ploughman');assert.equal(p.apprentice.term,2520);
  f.eval('craftApprenticeTick(H[3])');assert.ok(p.sk[7]>0);assert.equal(p.apprentice.served,1);const sk=p.sk[7];m.away={until:50};f.setDay(2);f.eval('craftApprenticeTick(H[3])');assert.equal(p.sk[7],sk);assert.equal(p.apprentice.served,1);
  m.dead=true;f.eval('craftApprenticeTick(H[3])');assert.equal(p.apprentice.closed,true);assert.equal(p.apprentice.graduated,false);assert.equal(p.craft.qualified,false);
});

test('a guild buys a real charter from contributions and a named writer; dilution controls eligibility',()=>{
  const f=fixture(),coins=f.coins(),crown=f.W.treasury,writer=f.H[4].w;const Q=f.eval('craftGuildQuote(s,"baker")');assert.ok(Q);f.C.Q=Q;const g=f.eval('craftGuildFound(Q)');assert.equal(g.members.length,2);near(f.W.treasury,crown+Q.licence);near(f.H[4].w,writer+Q.writing);near(g.gold,0);near(f.coins(),coins);
  assert.equal(f.eval('craftGuildQuote(s,"baker")'),null);assert.equal(f.H[0].craft.guild,g.id);assert.equal(g.wardens.length,1);assert.equal(f.H.find(p=>p.id===g.wardens[0]).office,'warden');
  const low=fixture();low.s._job.baker.sum=1;assert.equal(low.eval('craftGuildQuote(s,"baker")'),null);low.s._job.baker.sum=12000;low.C.institutionalCapability=()=>({available:false});assert.equal(low.eval('craftGuildQuote(s,"baker")'),null);
});

test('quarterage and quality searches use sold work, and relief spends only the actual chest',()=>{
  const f=fixture(),Q=f.eval('craftGuildQuote(s,"baker")');f.C.Q=Q;const g=f.eval('craftGuildFound(Q)');f.C.guild=g;const p=f.H[0];p.craft.takings+=480;p.sk[7]=.1;p.w=500;f.H[1].w=0;const coins=f.coins();f.setDay(g.nextQuarter);f.eval('craftGuildTick(guild)');
  near(g.dues,10);assert.ok(g.fines>0);assert.ok(g.relief>0);assert.ok(f.H[1].w>0);assert.ok(g.gold>=0);near(f.coins(),coins);assert.equal(f.s.px.grain,1);assert.equal(f.s.px.fish,2);
  const due=g.dues;f.eval('craftGuildTick(guild)');assert.equal(g.dues,due);near(f.coins(),coins);
});

test('entry fine follows native recorded income dilution and no master can buy entry without actual surplus',()=>{
  const f=fixture(),Q=f.eval('craftGuildQuote(s,"baker")');f.C.Q=Q;const g=f.eval('craftGuildFound(Q)');f.H[2].w=10000;const entry=f.eval('craftMasterQuote(s,H[2],"baker")');assert.ok(entry);near(entry.fine,12000/2-12000/3);f.C.entry=entry;const coins=f.coins();assert.equal(f.eval('craftMasterCommission(entry)'),true);near(g.entryReceipts,entry.fine);near(f.coins(),coins);
  const v=f.eval('craftEntryFine(s,"baker",3)');assert.ok(v<entry.fine);assert.equal(f.H[2].craft.rank,'master');
});

test('job exclusivity and the public guild read are pure and leave independent builders available',()=>{
  const f=fixture();assert.equal(f.eval('institutionalJobHeld(H[0])'),false);f.H[0].estateOffice={job:'keeper'};assert.equal(f.eval('institutionalJobHeld(H[0])'),true);delete f.H[0].estateOffice;
  f.H[1].apprentice={closed:false};assert.equal(f.eval('institutionalJobHeld(H[1])'),true);delete f.H[1].apprentice;
  const coins=f.coins(),before=f.eval('JSON.stringify([W.guilds,H.map(p=>[p.tr,p.craft,p.sk])])');f.eval('craftState();craftPlaceHTML(s);craftGuildsHTML()');assert.equal(f.eval('JSON.stringify([W.guilds,H.map(p=>[p.tr,p.craft,p.sk])])'),before);near(f.coins(),coins);
  f.eval('s.owner=1');assert.equal(f.eval('craftGuildCmd("0:baker:grant")'),false);
});
