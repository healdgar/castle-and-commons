// Named patrons give existing coin through the actual compound/account and
// worker journal helpers; no generated world or simulation soak is involved.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {realm,near} from './ownership-fixture.mjs';
import {parse} from './vendor/acorn/acorn.mjs';
import {inlineGameScript} from './simulation-boundary.mjs';
const source=inlineGameScript(fs.readFileSync(process.env.FURLONG_TEST_SOURCE||new URL('../index.html',import.meta.url),'utf8')),ast=parse(source,{ecmaVersion:'latest'}),F=new Map(),V=new Map();
for(const n of ast.body)if(n.type==='FunctionDeclaration')F.set(n.id.name,n);else if(n.type==='VariableDeclaration')for(const d of n.declarations)if(d.id.type==='Identifier')V.set(d.id.name,{kind:n.kind,node:d});
const fn=n=>{const d=F.get(n);assert.ok(d,'native '+n);return source.slice(d.start,d.end);},constant=n=>{const d=V.get(n);assert.ok(d,'native '+n);return d.kind+' '+source.slice(d.node.start,d.node.end)+';';};
const names=['corpFound','compoundEnsure','compoundOf','compoundPatronRecipient','compoundPatronQuote','compoundPatronGift','abbeyFounder','notableById','purseAcct','sovOn','plyH','abbeyGiftQuote','abbeyPlayerGift','abbeyGiftHTML','abbeyOrdersHTML','abbeyCard','abbeyPeople','abbeyBuildings','abbeyField','abbeyOrderMother','abbeyPreferredOrders','abbeyOrderAvailable','esc','detailNumber','book','churchReceipt','backgroundUserRequest','workerCommandIsLocal','workerCommandString','workerCommandTarget','workerCommandValidate','workerCommandApply','workerCommandApplyClick','runCmd','replayEntry','jot','emit','projectEvent'];
function setup({commodity=false,crown=2500,house=2000,modelOnly=true}={}){
 const r=realm({commodity,crown,cash:20,grain:30,fish:20,pop:1,transformSource:p=>p.replace('const isHouse=x=>x&&W.houses.includes(x);',constant('isHouse'))});
 r.eval(source.slice(source.indexOf('const NOTABLE_INDEXES='),source.indexOf('let NID=1;'))+'\n'+names.map(fn).join('\n')+'\n'+['ABBEY_ORDERS','ARCH','abbeyLay'].map(constant).join('\n'));
 const journal=source.match(/^let JOURNAL=.*$/m)?.[0];assert.ok(journal);r.eval(journal);
 r.eval(`const MODEL_ONLY=${modelOnly};let uiDownAt=99;const uiRefresh=[];const refreshCrownPanel=()=>uiRefresh.push('crown'),refreshInspect=()=>uiRefresh.push('inspect'),updateHUD=()=>uiRefresh.push('hud'),renderPetition=()=>uiRefresh.push('petition');const HISTORY={events:[],event(kind,value){this.events.push({kind,value})}};const WORKER_PRESENTATION={started:false};let allLines=[],entryCount=0;const dateStr=d=>'day '+d;
   W.notables=[{id:900,name:'Queen Joan',alive:true,traits:[]},{id:901,name:'Lord Robert',alive:true,traits:[]},{id:902,name:'Lady Alice',alive:true,traits:[]}];W.monarch=W.notables[0];
   W.houses=[{name:'Royal house',crown:true,seat:0},{name:'House One',seat:0,head:901,gold:${house}},{name:'House Two',seat:1,head:902,gold:700}];notableIndexRebuild();W.player={on:true,house:0};W.capital=s;
   const other={name:'Far manor',owner:2,pop:0,folk:[],buildings:[],streets:[],pos:{x:100,z:100}};W.settlements.push(other);s.owner=1;s.streets=[];s.history=[];W.land={F:[]};W.projects=[{type:'compound',worked:3,paid:7,timberInstalled:2,stoneInstalled:0,done:.1}];
   const A=corpFound('abbey',{name:'Saint Mary',si:0,founder:1,order:'cistercian',members:[],granges:[],charter:{selfWorked:true}}),B=corpFound('abbey',{name:'Saint Andrew',si:1,founder:2,order:'benedictine',members:[],granges:[],charter:{selfWorked:false}});
   const C=compoundEnsure(s,'abbey',A.storageOwnerId);A.compound=C.id;const BC=compoundEnsure(other,'abbey',B.storageOwnerId);B.compound=BC.id;
 `);
 r.json=e=>JSON.parse(r.eval('JSON.stringify('+e+')'));return r;
}
const coin=r=>r.eval('W.treasury+W.houses.reduce((n,h)=>n+(h.gold||0),0)+W.abbeys.reduce((n,a)=>n+a.gold,0)+H.reduce((n,h)=>n+h.w,0)');
const state=r=>r.eval('JSON.stringify({treasury:W.treasury,houses:W.houses,abbeys:W.abbeys,compounds:W.settlements.map(s=>s.compounds),projects:W.projects,stores:s.stores,owners:[...s._owners].map(([o,x])=>({owner:o===A?"A":o===B?"B":o,sale:x.sale,held:x.held,animals:x.animals})),folk:s.folk.map(p=>({id:p.id,w:p.w})),notables:W.notables,px:s.px,flow:W._flow,events:HISTORY.events,journal:JOURNAL})');

for(const commodity of[false,true])test(`Crown gift uses the real living monarch and conserves coin and all construction/goods (${commodity?'native balances':'legacy lots'})`,()=>{
 const r=setup({commodity}),cash=coin(r),before=r.json('({projects:W.projects,stores:s.stores,components:C.components,people:s.folk.length})');
 assert.equal(r.eval("Object.hasOwn(W.houses[0],'head')"),false);assert.equal(r.eval("abbeyGiftQuote('0:0:500').donor===W.monarch"),true);
 assert.equal(r.eval("abbeyPlayerGift('0:0:500')"),true);near(r.W.treasury,2000);near(r.eval('A.gold'),500);near(coin(r),cash);
 near(r.eval('A.led["compound patron endowment"]'),500);near(r.eval('W.crownBook.led["compound patron endowment"]'),-500);
 near(r.eval('A.cashY.receipts["compound patron endowment"]'),500);near(r.eval('W.crownBook.cashY.payments["compound patron endowment"]'),500);near(r.eval('A._inc'),0);
 assert.deepEqual(r.json('({projects:W.projects,stores:s.stores,components:C.components,people:s.folk.length})'),before);assert.equal(r.eval('Object.hasOwn(C,"gold")'),false);assert.equal(r.eval('Object.keys(W._flow||{}).length'),0);
 assert.match(r.eval('HISTORY.events.at(-1).value.text'),/Queen Joan gives 500 gold to Saint Mary/);
 r.eval('A.cashPrev=A.cashY');near(r.eval('churchReceipt(A)'),0,'capital is not a recurring ecclesiastical receipt');
});

test('a lord gives only from the named house purse to a founded or locally held house; the Crown can give across the realm',()=>{
 const r=setup(),cash=coin(r);r.eval('W.player.house=1');assert.equal(r.eval("abbeyPlayerGift('1:0:100')"),true);near(r.W.houses[1].gold,1900);near(r.eval('A.gold'),100);near(coin(r),cash);
 let before=state(r);assert.equal(r.eval("abbeyPlayerGift('1:1:100')"),false);assert.equal(state(r),before,'a lord cannot spend on an unrelated manor institution');
 r.eval('B.founder=1');assert.equal(r.eval("abbeyPlayerGift('1:1:100')"),true,'the actual founder may keep patronizing a house after its manor changes lord');
 r.eval('B.founder=2;other.owner=1');assert.equal(r.eval("abbeyPlayerGift('1:1:100')"),true,'the actual current manor lord can give');
 r.eval('other.owner=2;W.player.house=0');assert.equal(r.eval("abbeyPlayerGift('0:1:100')"),true,'realm patronage retains the Crown payer');near(coin(r),cash);
});

test('malformed IDs and amounts, invalid authority and insufficient coin never partially transfer or initialize native data',()=>{
 const args=['0:0:0','0:0:-1','0:0:Infinity','0:0:NaN','0:0:1e3','0:0: 100','0:0:100:extra','00:0:100','0:00:100','0:0:.5','0:0:1.','0:9:100','9:0:100','1:0:100','0:0:2500.01','9007199254740992:0:1','0:9007199254740992:1',null,100];
 for(const arg of args){const r=setup();r.eval('delete s.px;delete A.led;delete A.cashY;');const before=state(r);r.C.arg=arg;assert.equal(r.eval('abbeyPlayerGift(arg)'),false,String(arg));assert.equal(state(r),before,String(arg));}
 const r=setup();r.eval('W.player.on=false');const before=state(r);assert.equal(r.eval("abbeyPlayerGift('0:0:100')"),false);assert.equal(state(r),before);
});

test('dead, exiled, gone, detached and wrong canonical owner references refuse without mutating books or goods',()=>{
 const changes=['W.monarch=null','W.monarch.alive=false','W.monarch.dead=true','W.monarch.fp={dead:true}','W.houses[0].exiled=true','W.houses[0].extinct=true','A.gone=true','C.gone=true','s.compounds=[]','A.compound="another"','C.ownerId="abbey:00"','C.ownerId=B.storageOwnerId','C.si=1','A.si=8','A.kind="guild"','A.storageOwnerId="abbey:01"','A.id=5','W.treasury=NaN'];
 for(const change of changes){const r=setup();r.eval(change);const before=state(r);assert.equal(r.eval("abbeyPlayerGift('0:0:100')"),false,change);assert.equal(state(r),before,change);}
 const r=setup();r.eval('W.player.house=1;W.notables[1].alive=false');const before=state(r);assert.equal(r.eval("abbeyPlayerGift('1:0:100')"),false);assert.equal(state(r),before,'a stale great-house head cannot pay');
});

test('the common service gives to the current Castle, College or Estate account and refuses self-purses and dead owners',()=>{
 for(const kind of['castle','college','estate']){const r=setup(),cash=coin(r);r.eval(`const K=compoundEnsure(s,'${kind}',1);`);assert.equal(r.eval('compoundPatronGift(s,K,0,125)'),true,kind);near(r.W.treasury,2375);near(r.W.houses[1].gold,2125);near(r.W.houses[1]._inc||0,0);near(coin(r),cash);assert.equal(r.eval('Object.hasOwn(K,"gold")'),false);const before=state(r);assert.equal(r.eval('compoundPatronGift(s,K,1,100)'),false);assert.equal(state(r),before,'the compound is already the owner purse');r.eval('W.notables[1].alive=false');assert.equal(r.eval('compoundPatronQuote(s,K,0,100).ok'),false);}
 const r=setup(),cash=coin(r);r.eval('const K=compoundEnsure(s,"college",0);');assert.equal(r.eval('compoundPatronGift(s,K,1,125)'),true);near(r.W.houses[1].gold,1875);near(r.W.treasury,2625);near(r.W._crInc||0,0);near(coin(r),cash);near(r.eval('W.crownBook.cashY.receipts["compound patron endowment"]'),125);
});

test('quotes and actual card/panel controls are readonly, use live full amounts, and advertise only authorized donors',()=>{
 const r=setup({crown:750});r.eval('delete s.px;');const before=state(r),html=r.eval('abbeyGiftHTML(A)'),card=r.eval('abbeyCard(A)'),panel=r.eval('abbeyOrdersHTML(s,0)');
 assert.match(html,/your purse 750 g/);assert.match(html,/data-arg="0:0:100">Give 100 g/);assert.match(html,/data-arg="0:0:500">Give 500 g/);assert.match(html,/data-arg="0:0:1000" disabled>Give 1000 g · Not enough coin/);assert.match(card,/data-cmd="abbey-gift"/);assert.match(panel,/data-arg="0:1:100"/,'the actual Crown panel includes another founder');assert.match(panel,/data-cmd="abbey-found"/,'other realm abbeys do not prevent the Crown founding its own');assert.equal(state(r),before,'control queries initialize no prices, ledgers, compounds or titles');
 r.eval('W.player.house=1');const beforeLord=state(r),lord=r.eval('abbeyOrdersHTML(s,1)');assert.match(lord,/data-arg="1:0:100"/);assert.doesNotMatch(lord,/data-arg="1:1:/);assert.equal(r.eval('abbeyGiftHTML(B)'), '');assert.equal(state(r),beforeLord);
 r.eval('W.player.on=false');assert.equal(r.eval('abbeyGiftHTML(A)'), '');
});

test('worker validation binds the named payer and journals the exact gift once; replay produces the same money and annal',()=>{
 const r=setup(),replayed=setup();const entry={k:'c',c:'abbey-gift',a:'0:1:500'};r.C.entry=entry;assert.equal(r.eval('workerCommandIsLocal(entry.c,entry.a)'),false);const before=state(r);assert.equal(r.eval('workerCommandValidate(entry).target'),'worker');assert.equal(state(r),before,'policy quoting is pure');assert.equal(r.eval('workerCommandApply(entry)'),true);
 assert.deepEqual(r.json('JOURNAL'),[{...entry,d:1}]);near(r.eval('B.gold'),500);near(r.eval('A.gold'),0);
 replayed.C.entry=r.json('JOURNAL[0]');replayed.eval('REPLAYING=true;replayEntry(entry);REPLAYING=false');
 assert.deepEqual(replayed.json('({treasury:W.treasury,recipient:B,flow:W._flow,events:HISTORY.events,annals:allLines})'),r.json('({treasury:W.treasury,recipient:B,flow:W._flow,events:HISTORY.events,annals:allLines})'));assert.deepEqual(replayed.json('JOURNAL'),[],'replay does not append a second command');
 const invalid=setup();invalid.C.entry={...entry,a:'1:1:500'};const failed=state(invalid);assert.throws(()=>invalid.eval('workerCommandApply(entry)'),/Invalid abbey gift/);assert.equal(state(invalid),failed,'invalid worker orders never reach the journal or payment');
});

test('the same exact decimal gift command ignores render speed and pays in full, without clamping to a preset',()=>{
 let first;for(const speed of[0,.5,2,8,30,360,1/1800]){const r=setup();r.C.speed=speed;r.eval("workerCommandApply({k:'c',c:'abbey-gift',a:'0:0:750.25'})");near(r.eval('A.gold'),750.25);const got=r.json('({treasury:W.treasury,recipient:A,journal:JOURNAL,events:HISTORY.events})');if(first)assert.deepEqual(got,first);else first=got;}
 const r=setup({crown:100});assert.equal(r.eval("abbeyPlayerGift('0:0:100')"),true);near(r.W.treasury,0);near(r.eval('A.gold'),100);
});


test('foreground gift dispatch reaches the common live-control refresh before returning its actual result',()=>{
 const r=setup({modelOnly:false});assert.equal(r.eval("runCmd('abbey-gift','0:0:100')"),true);assert.deepEqual(r.json('uiRefresh'),['crown','inspect','hud','petition']);assert.equal(r.eval('uiDownAt'),0);near(r.eval('A.gold'),100);
 r.eval('uiRefresh.length=0');assert.equal(r.eval("runCmd('abbey-gift','0:0:99999')"),false);assert.deepEqual(r.json('uiRefresh'),['crown','inspect','hud','petition']);near(r.eval('A.gold'),100,'a stale insufficient command refreshes without a clipped payment');
});
