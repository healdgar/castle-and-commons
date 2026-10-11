import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {realm,near} from './ownership-fixture.mjs';
const source=fs.readFileSync(process.env.FURLONG_TEST_SOURCE||new URL('../index.html',import.meta.url),'utf8');
const fn=n=>source.match(new RegExp('^function '+n+'\\b[\\s\\S]*?(?=^function |^const |^/\\*|$(?![\\s\\S]))','m'))?.[0]||'';
const port=source.slice(source.indexOf('/* PORT_QUARANTINE_BEGIN */'),source.indexOf('/* PORT_QUARANTINE_END */'));
function setup({good='grain',sea=true,exposed=true,portPop=20}={}){
 const r=realm({households:6,pop:10,cash:10000,crown:100000,grain:500,fish:200,commodity:true});
 r.eval([fn('workers_'),fn('townCourtAccount'),fn('roadSpare'),fn('tickCaravans'),fn('ladeIn'),port].join('\n'));
 r.eval(`let now=1,draws=0,plagues=0;day=()=>now;MOD.tax=0;MOD.vir=1;MOD.leth=1;KL=0;institutionalCapability=(s,key)=>({available:s.adopted!==false});payTolls=()=>0;chance=()=>{draws++;return true};plagueArrives=()=>plagues++;s.furl=[];s.harbor=true;s.infected=${exposed?1:0};H[0].tr='merchant';H[1].tr='boatman';const d={name:'real destination',owner:0,pop:${portPop},kind:'town',stores:{grain:0,fish:0},folk:H.slice(2),buildings:[],pos:{x:50,z:0},furl:[],streets:[],harbor:true,infected:0,px:{grain:1,fish:2},_made:{},res:{}};s.folk=H.slice(0,2);for(const p of d.folk){p.si=1;p.sk=[p===H[2]?.6:0];}W.settlements.push(d);W.caravans=[];W.roads=[];W.bldList=[];W._pm=folkIndex();ownershipTick();storageInit(s);storageInit(d);purchase(s,'${good}',H[0],20);commodityCreditPurchase(s,H[0],'${good}',purchase.got);const c={origin:0,dest:1,m:H[0],drv:H[1],crew:H[1],good:'${good}',qty:purchase.got,value:40,cost:purchase.paid||20,fee:7,departDay:0,arriveDay:1,sea:${sea},_staffed:true};H[1].away={until:2,what:'actual coastal trip'};storageCargoOut(c,s,true);portPlagueDeparture(c,s);W.caravans.push(c);const total=W.treasury+H.reduce((v,p)=>v+p.w,0),population=s.pop+d.pop,people=H.length;`);
 return r;
}
const coins=r=>r.eval('W.treasury+H.reduce((v,p)=>v+p.w,0)+W.settlements.reduce((v,s)=>v+(s.murage||0),0)');

test('real exposed cargo hires a native paid keeper and stays in native transit custody',()=>{
 const r=setup(),physical=r.s.stores.grain;r.eval('tickCaravans()');
 assert.equal(r.eval('W.caravans.length'),1);assert.equal(r.eval('c.halted'),true);assert.equal(r.eval('H[2].office'),'healthAttendant');assert.equal(r.eval('institutionalJobHeld(H[2])'),true);
 assert.equal(r.eval("[...s.storage.entries({location:c.storageCargo.id})].every(x=>x.owner===accountOwner(H[0])&&x.availability==='transit')"),true);
 near(coins(r),r.eval('total'));near(r.s.stores.grain,physical);near(r.eval('d.stores.grain'),0);near(r.eval('s.pop+d.pop'),r.eval('population'));assert.equal(r.H.length,r.eval('people'));near(r.eval('d._berthDays||0'),0);near(r.eval('draws'),0);
});
test('thirty actual paid days release once without a cure, another freight wage or arrival disease draw',()=>{
 const r=setup();r.eval('for(now=1;now<=30;now++)tickCaravans();const paid=c.portQuarantine.wages,delay=c.portQuarantine.demurrage,crewMoney=H[1].w,cargo=c.qty,loss=c.portQuarantine.lost;now=31;tickCaravans()');
 assert.equal(r.eval('W.caravans.length'),0);assert.equal(r.eval('c.portQuarantine.completed'),true);near(r.eval('c.portQuarantine.served'),30);near(r.eval('c.portQuarantine.wages'),r.eval('paid'));near(r.eval('c.portQuarantine.demurrage'),r.eval('delay'));near(r.eval('H[1].w-crewMoney'),7);
 near(r.eval('cargo+loss'),20);near(r.eval('d.stores.grain'),r.eval('cargo'));near(r.eval('draws'),0);near(r.eval('plagues'),0);near(r.eval('s.infected'),1);near(r.eval('d.infected'),0);near(coins(r),r.eval('total'));assert.equal(r.eval('H[2].role'),undefined);assert.equal(r.eval('H[2].portHealthJob'),undefined);near(r.eval('H[1].away.until'),32);near(r.eval('d._berthDays'),4);
});
test('same-day calls neither double-pay nor double-spoil and a single keeper holds one consignment',()=>{
 const r=setup();r.eval('portQuarantine(c,d);const wages=c.portQuarantine.wages,expense=c.portQuarantine.demurrage,quantity=c.qty;portQuarantine(c,d);const other={...c,portQuarantine:null};const held=portQuarantine(other,d)');
 near(r.eval('c.portQuarantine.wages'),r.eval('wages'));near(r.eval('c.portQuarantine.demurrage'),r.eval('expense'));near(r.eval('c.qty'),r.eval('quantity'));near(r.eval('c.portQuarantine.served'),1);assert.equal(r.eval('held'),false);assert.equal(r.eval('d.portHealth.hold===c'),true);
});
test('adoption, real keeper, legal status, actual spare public chest and merchant purse all gate enforcement',()=>{
 for(const change of ["d.adopted=false","H[2].dead=true","H[2].status='villein'","H[2].estateOffice='actual bailiff'","H[2].craft={employer:3}","W.treasury=0","H[0].w=0","c.crew.dead=true","c.storageCargo=null"]){const r=setup();r.eval(change);assert.equal(r.eval('portQuarantine(c,d)'),false,change);assert.equal(r.eval('c.portQuarantine'),undefined,change);}
});
test('normal unexposed coastal and land cargoes are delivered without quarantine payroll',()=>{
 const clear=setup({exposed:false});clear.eval('tickCaravans()');assert.equal(clear.eval('W.caravans.length'),0);assert.equal(clear.eval('d.portHealth'),undefined);near(clear.eval('draws'),0);
 const land=setup({sea:false});land.eval('tickCaravans()');assert.equal(land.eval('W.caravans.length'),0);assert.equal(land.eval('d.portHealth'),undefined);near(land.eval('draws'),1);near(land.eval('d.infected'),3);
});
test('a source outbreak observed at departure persists as evidence when its aggregate later recovers',()=>{
 const r=setup();r.eval('s.infected=0;tickCaravans()');assert.equal(r.eval('c.plagueDeparture.exposed'),true);assert.equal(r.eval('c.portQuarantine.source.infected'),1);assert.equal(r.eval('W.caravans.length'),1);near(r.eval('s.infected'),0);
});
test('insolvency, absent keeper, lost adoption and changed authority release a partial term with one native arrival draw',()=>{
 for(const change of ["W.treasury=0","H[0].w=0","H[2].dead=true","H[2].away={until:10}","d.adopted=false","d.commune=true"]){const r=setup();r.eval('tickCaravans();now=2;'+change+';tickCaravans()');assert.equal(r.eval('W.caravans.length'),0,change);assert.equal(r.eval('c.portQuarantine.completed'),false,change);near(r.eval('draws'),1);near(r.eval('d.infected'),3);assert.equal(r.eval('d.portHealth.hold'),null,change);assert.equal(r.eval('H[2].portHealthJob'),undefined,change);}
});
test('elapsed dates cannot substitute for actual supported daily service, and a local outbreak ends an ineffective hold',()=>{
 const missing=setup();missing.eval('tickCaravans();now=31;tickCaravans()');assert.equal(missing.eval('c.portQuarantine.completed'),false);near(missing.eval('c.portQuarantine.served'),1);near(missing.eval('draws'),1);
 const outbreak=setup();outbreak.eval('tickCaravans();d.infected=3;now=2;tickCaravans()');assert.equal(outbreak.eval('W.caravans.length'),0);assert.equal(outbreak.eval('c.portQuarantine.completed'),false);near(outbreak.eval('d.infected'),3);near(outbreak.eval('draws'),0);
});
test('actual held fish spoils in one ledger and releases only the remaining owned goods',()=>{
 const r=setup({good:'fish',portPop:200});r.eval('for(now=1;now<=30;now++)tickCaravans();const remaining=c.qty,lost=c.portQuarantine.lost;now=31;tickCaravans()');near(r.eval('remaining+lost'),20);assert.ok(r.eval('lost>5'));near(r.eval('d.stores.fish'),r.eval('remaining'));near(r.eval("mkt(d,'fish').get(H[0])"),r.eval('remaining'));near(coins(r),r.eval('total'));
});
test('a removed or robbed cargo closes the actual office without creating a replacement load',()=>{
 const r=setup();r.eval('tickCaravans();W.caravans=[];now=2;portHealthPrepare()');assert.equal(r.eval('d.portHealth.hold'),null);assert.equal(r.eval('H[2].office'),undefined);assert.equal(r.eval('c.portQuarantine.completed'),false);near(r.eval('d.stores.grain'),0);
});
test('merchant sailing his own real cargo does not pay himself an invented demurrage',()=>{
 const r=setup();r.eval("c.drv=c.crew=H[0];H[0].away={until:2};tickCaravans()");near(r.eval('c.portQuarantine.delay'),0);near(r.eval('c.portQuarantine.demurrage'),0);near(coins(r),r.eval('total'));
});
test('journal policy validates authority and funding, releases current hold, and leaves blanket gates unchanged',()=>{
 const r=setup();r.eval("sovOn=()=>true;plyH=()=>0;d.quarantineUntil=80;tickCaravans();const stopped=portHealthCmd('1:stop');now=2;tickCaravans();const invalid=portHealthCmd('1:bogus');const enabled=portHealthCmd('1:enable')");assert.equal(r.eval('stopped'),true);assert.equal(r.eval('enabled'),true);assert.equal(r.eval('invalid'),false);near(r.eval('d.quarantineUntil'),80);assert.equal(r.eval('c.portQuarantine.completed'),false);near(r.eval('draws'),1);r.eval('plyH=()=>1');assert.equal(r.eval("portHealthCmd('1:stop')"),false);
 assert.match(source,/if\(c==='s-port-health'\).*Invalid funded port policy/);
});
test('scalar reports detach from native contracts and expose no payer, people or cargo graphs',()=>{
 const r=setup();r.eval("tickCaravans();const before=JSON.stringify(c.portQuarantine.source);const R=portHealthSummary(d),C=portQuarantineSummary(c);R.hold.served=999;C.sourceInfected=999;portHealthRelease(d,c,'test actual release');const roll=portHealthSummary(d);roll.roll[0].reason='changed';");assert.equal(r.eval('c.portQuarantine.served'),1);assert.equal(r.eval('JSON.stringify(c.portQuarantine.source)'),r.eval('before'));assert.equal(r.eval('d.portHealth.roll[0].reason'),'test actual release');assert.equal(r.eval('Object.hasOwn(R.hold,"payer")'),false);
});
test('actual off-manor Crown, great-house, parish and household building titles retain their named rent recipient without inspection mutation',()=>{
 const r=setup();r.eval("const house={name:'actual other house',gold:0};W.houses.push({},house);const chapel={idx:0,arch:'temple',ch:{fund:0},s};W.bldList.push(chapel);const roof={arch:'house',title:{owner:house},s};const before=JSON.stringify(roof.title);const A=ownerAcct(roof,s),pure=JSON.stringify(roof.title),cash=W.treasury+H.reduce((v,p)=>v+p.w,0);transfer(H[0],A,3,'rent',s);const crownRoof={title:{owner:'crown'},s};const parishRoof={title:{owner:chapel},s};const familyRoof={title:{owner:accountOwner(H[1])},s};const crownAliasRoof={title:{owner:W.houses[0]},s};transfer(H[0],ownerAcct(crownAliasRoof,s),2,'rent',s);transfer(H[0],ownerAcct(crownRoof,s),4,'rent',s);transfer(H[0],ownerAcct(parishRoof,s),5,'rent',s);transfer(H[0],ownerAcct(familyRoof,s),6,'rent',s);");assert.equal(r.eval('A===house'),true);near(r.eval('house.gold'),3);near(r.eval('chapel.ch.fund'),5);near(r.eval('W.treasury+H.reduce((v,p)=>v+p.w,0)+house.gold+chapel.ch.fund'),r.eval('cash'));assert.equal(r.eval('Object.hasOwn(roof,"ownerId")'),false);assert.equal(r.eval('pure'),r.eval('before'));assert.equal(r.eval('ownerAcct(crownRoof,s)'), 'crown');assert.equal(r.eval('ownerAcct(crownAliasRoof,s)'), 'crown');assert.equal(r.eval('W.houses[0].gold'),undefined);assert.equal(r.eval('ownerAcct(parishRoof,s)===chapel'),true);assert.equal(r.eval('accountOwner(ownerAcct(familyRoof,s))===accountOwner(H[1])'),true);
});
