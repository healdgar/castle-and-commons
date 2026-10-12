import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {realm,near} from './ownership-fixture.mjs';
const source=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const fn=n=>{const x=source.match(new RegExp('^function '+n+'\\b[\\s\\S]*?(?=^function |^const |^/\\*|$(?![\\s\\S]))','m'))?.[0];assert.ok(x,n);return x;};
const asyncFn=n=>{const x=source.match(new RegExp('^async function '+n+'\\b[\\s\\S]*?(?=^function |^async function |^const |^/\\*|$(?![\\s\\S]))','m'))?.[0];assert.ok(x,n);return x;};

test('opening-day mill and market work pay their actual builders once, including a serialized completion',()=>{
  for(const house of [0,1])for(const kind of ['mill','market']){
    const r=realm({crown:2400,cash:10,households:2});r.W.houses=[{name:'Crown'},{name:'Lord',gold:2400}];r.W.player={on:true,house};r.s.owner=house;
    r.H[0].tr='mason';r.H[1].tr='carter';r.C.day=()=>0;
    r.eval(`const WORKS=[['mill','Build a mill',600,''],['market','Charter a market',800,'']];function hungryHands(){return [];}function craftReceipt(){}function storageWorksHTML(){return '';}`);
    r.eval(['workers_','payAmong','buildWorks','purse','purseAcct','plyH','settlementWork','worksHTML','cbtn'].map(fn).join('\n'));
    const money=()=>r.coins()+r.W.houses[1].gold,total=money(),cost=kind==='mill'?600:800,coin=()=>house?r.W.houses[1].gold:r.W.treasury;
    assert.equal(r.eval(`settlementWork(0,'${kind}').accepted`),true);near(coin(),2400-cost);near(money(),total);near(r.H[0].w-10,cost*.75);near(r.H[1].w-10,cost*.25);
    assert.equal(r.s.works[kind],0);const prosperity=r.s.prosperity;
    r.eval('s.works=JSON.parse(JSON.stringify(s.works))');
    for(let i=0;i<3;i++)assert.equal(r.eval(`settlementWork(0,'${kind}').accepted`),false);
    near(coin(),2400-cost);near(money(),total);assert.equal(r.s.prosperity,prosperity);
    assert.match(r.eval('worksHTML(s)'),new RegExp('data-arg="0:'+kind+'" disabled[^]*?built'));
  }
});

test('Learning is selected in a worker court query without changing the retained UI section',()=>{
  const C=vm.createContext({contextUI:{expanded:false},G:{ledgerOpen:false},crownSection:'orders',linkNames:x=>x});
  vm.runInContext('function crownPanelHTML(){return crownSection;}\n'+fn('workerUIQuery'),C);
  assert.equal(vm.runInContext("workerUIQuery({kind:'crown',section:'learning'}).html",C),'learning');assert.equal(C.crownSection,'orders');
});

test('late court replies cannot replace the view selected by a newer click',()=>{
  const queries=[],paint=[];const C=vm.createContext({drawerTab:'crown',crownSection:'orders',contextUI:{expanded:false},G:{},drawerVisible:()=>true,uiBusy:()=>false,workerHTML:x=>x,document:{getElementById:()=>({})},setHTML:(e,h)=>paint.push(h),workerQuery:(key,payload,install)=>{queries.push({key,payload,install});}});
  vm.runInContext(fn('workerRefreshCourt'),C);vm.runInContext('workerRefreshCourt(true);crownSection="learning";workerRefreshCourt(true)',C);
  assert.notEqual(queries[0].key,queries[1].key);queries[0].install({html:'Orders'});assert.deepEqual(paint,[]);queries[1].install({html:'Learning'});assert.deepEqual(paint,['Learning']);
});

test('a friendly host exposes march and campaign controls in a worker with no viewport globals',()=>{
  const army={id:7,house:0,strength:83,state:'idle',at:0};
  const C=vm.createContext({W:{armies:[army],settlements:[{name:'Home'}]},armySimPos:()=>({x:0,z:0}),dist2d:()=>0,garrisoned:()=>false,cbtn:(c,a,l)=>c+':'+a+':'+l,army});
  vm.runInContext(fn('armyActsHTML'),C);const text=vm.runInContext('armyActsHTML(army)',C);assert.match(text,/a-order:7/);assert.match(text,/a-objective:7:capture/);assert.match(text,/a-disband:7/);
});

test('Govern town waits for its asynchronous card before opening the Orders sheet',async()=>{
  const s={owner:0},calls=[];let arrive;const card=new Promise(r=>arrive=r);
  const C=vm.createContext({MODEL_ONLY:false,BACKGROUND:{},backgroundUserRequest:()=>false,W:{settlements:[s]},sovOn:()=>true,plyH:()=>0,showInspect:pk=>{C.inspTarget=pk;return card;},setInspectorView:v=>calls.push(v),contextExpand:v=>calls.push(v)});
  vm.runInContext(fn('runCmd'),C);const opened=vm.runInContext("runCmd('s-manage','0')",C);assert.deepEqual(calls,[]);arrive();await opened;assert.deepEqual(calls,['orders',true]);
});

test('command receipts report the actual purse change and new host, without changing world records',()=>{
  const W={treasury:1000,player:{on:true,house:0},houses:[{name:'Crown'}],armies:[],projects:[],settlements:[]};const C=vm.createContext({W});
  vm.runInContext(['plyH','purse','commandBefore','commandReceipt','projectMarkerKey'].map(fn).join('\n')+'\nconst before=commandBefore();',C);
  W.treasury=750;W.armies.push({id:9,name:'The Watch',gone:false});const saved=JSON.stringify(W);
  const result=vm.runInContext("commandReceipt(before,undefined,['83 men march out'])",C);assert.equal(result.coinChange,-250);assert.equal(result.accepted,true);assert.equal(result.links[0].code,'a9');assert.equal(JSON.stringify(W),saved);
});

for(const scenario of ['refused','accepted','second end','cancelled'])test('worker placement reply: '+scenario,async()=>{
  let resolveReply;const reply=new Promise(r=>resolveReply=r);
  const C=vm.createContext({G:{placeRevision:1},placeMode:'pave',placeArg:'pave',placeHint:'Choose a road',BACKGROUND:{request:()=>reply},workerRefreshLandscape:async()=>{},refreshCrownPanel(){},refreshInspect(){},renderPetition(){},storageFaultNotice:assert.fail});
  vm.runInContext('function setPlaceMode(m,a,h){G.placeRevision++;placeMode=m;placeArg=a;placeHint=h;}\n'+asyncFn('workerSubmitNow'),C);
  const work=vm.runInContext("workerSubmitNow({k:'place',m:'pave'})",C);assert.ok(C.G.placePending);
  if(scenario==='cancelled')vm.runInContext('setPlaceMode(null)',C);
  resolveReply(scenario==='second end'?{accepted:true,place:{mode:'road2',arg:0,hint:'Choose other end'}}:{accepted:scenario==='accepted'});await work;
  assert.equal(C.placeMode,scenario==='accepted'||scenario==='cancelled'?null:scenario==='second end'?'road2':'pave');assert.equal(C.G.placePending,null);
});

test('storage marker progress uses paid working days and does not rebind retired projects',()=>{
  const C=vm.createContext({W:{settlements:[]},clamp:(v,a,b)=>Math.max(a,Math.min(b,v))});vm.runInContext(['projectMarkerText','projectMarkerCard'].map(fn).join('\n'),C);
  C.q=Object.freeze({type:'storage',done:9,worked:9,days:90});assert.match(vm.runInContext('projectMarkerText(q)',C),/10% complete/);
  assert.match(vm.runInContext('projectMarkerCard(null).body',C),/no longer in progress/);
});

test('planning refuses full-sheet expansion before changing modality or touching the DOM',()=>{
  const C=vm.createContext({contextUI:{ready:true,kind:'plan',expanded:false}});vm.runInContext(fn('contextExpand'),C);vm.runInContext('contextExpand(true)',C);assert.equal(C.contextUI.expanded,false);
});

test('a click with no ground retains placement and explains how to correct it',()=>{
  let receipt;const C=vm.createContext({G:{},placeMode:'pave',placeArg:null,placeHint:'Choose a road',groundPoint:()=>null,orderFeedbackBegin:()=>({}),orderFeedbackFinish:(t,r)=>receipt=r});vm.runInContext(fn('onClick'),C);vm.runInContext('onClick({})',C);assert.equal(C.placeMode,'pave');assert.equal(receipt.accepted,false);assert.match(receipt.reason,/ground/);
});


test('accepted pavement quotes the commissioned wage and material bill, without charging it in advance',()=>{
  const W={treasury:5000,settlements:[{name:'Home',pos:{x:0,z:0}},{name:'Away'}],projects:[]},news=[];
  const C=vm.createContext({W,G:{},purse:()=>W.treasury,constructionRecipe:()=>({labour:600,timber:10,stone:20}),price:(s,g)=>g==='timber'?10:20,day:()=>0,emit:(kind,n,p,t)=>news.push(t)});
  vm.runInContext(fn('paveRoad'),C);C.road={a:0,b:1,len:500};assert.equal(vm.runInContext('paveRoad(road,0)',C),true);
  assert.equal(W.projects[0].cost,1100);assert.equal(W.treasury,5000);assert.match(news[0],/estimated 1,100 gold at current wages and material prices/);
});
