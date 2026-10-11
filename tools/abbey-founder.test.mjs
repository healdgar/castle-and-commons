import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {realm,near} from './ownership-fixture.mjs';
import {abbeyNativeEligibilityExpression,reachPaidNativeAbbey} from './abbey-native-fixture.mjs';

const source=fs.readFileSync(process.env.FURLONG_TEST_SOURCE||new URL('../index.html',import.meta.url),'utf8');
const fn=name=>{const f=source.match(new RegExp('^function '+name+'\\b[\\s\\S]*?(?=^function |^const |^/\\*|$(?![\\s\\S]))','m'))?.[0];assert.ok(f,name);return f;};
const constant=name=>{const c=source.match(new RegExp('^const '+name+'=.*$','m'))?.[0];assert.ok(c,name);return c;};

function setup(households=1){
  const r=realm({households,cash:100,crown:100000,pop:households});
  r.eval(source.slice(source.indexOf('const NOTABLE_INDEXES='),source.indexOf('let NID=1;'))+'\n'+fn('notableById'));
  r.eval(source.slice(source.indexOf('/* ABBEY_INSTITUTION_BEGIN */'),source.indexOf('/* ABBEY_INSTITUTION_END */')));
  r.eval(['corpFound','accountBalances'].map(fn).join('\n')+'\n'+['LK','LS','ARABLE'].map(constant).join('\n'));
  r.eval(`KS=2;W.houses=[{name:'Royal house',seat:0,crown:true},{name:'House One',seat:0,head:901,gold:100000,_netA:100}];
    W.notables=[{id:900,name:'The ruler',alive:true,traits:['pious'],sk:[0,0,.2]},{id:901,name:'The great-house head',alive:true,traits:[],sk:[0,0,.6]}];W.monarch=W.notables[0];notableIndexRebuild();
    W.capital=s;W._crNetA=100;W.land={F:[],perHead:1000};W.abbeys=[];W.projects=[];s.furl=[];s.history=[];s.streets=[];s._gYield=.000001;
    const field={k:0,dom:0,lord:0,core:-1,own:'lord',wk:-1,ten:'demesne',kind:LK.FIELD,state:LS.WILD,area:1000,x:20,z:20};W.land.F=[field];s.furl=[field];
    institutionalCapability=()=>({available:true,known:true,adopted:true});hostTarget=()=>60;soilYield=()=>.000001;
    compoundGround=site=>({cells:site.cells||[0],polys:[]});occupiedGroundFields=cells=>new Set(W.land.F.filter(f=>cells.includes(f.k)));
    s._lay={live:{compoundSite(site){return{...site,cells:[0],path:[{x:20,z:20},{x:20,z:10}]}}}};
  `);
  return r;
}
const state=r=>r.eval('JSON.stringify({treasury:W.treasury,people:s.folk.length,owner:field.own,worker:field.wk,abbeys:W.abbeys.length})');

test('Crown foundation reads its actual living ruler without a Crown-house head field',()=>{
  const r=setup(),before=state(r);
  assert.equal(r.eval("Object.hasOwn(W.houses[0],'head')"),false);
  assert.equal(r.eval('abbeyFounder(0)===W.monarch'),true);
  assert.equal(r.eval('abbeyFounder(1)===notableById(901)'),true);
  assert.ok(r.eval("abbeyFoundPlan(0,0,'cistercian')"));
  near(r.eval("abbeyFoundPlan(0,0,'cistercian').gift"),r.eval("52*foodYr()+STORAGE_TYPES.grange.cost+96*price(s,'timber')"));
  const rows=r.eval(abbeyNativeEligibilityExpression());assert.equal(rows[0].pious,true);assert.equal(rows[0].project,true);
  assert.equal(state(r),before,'quoting keeps actual coin, people and title');
});

test('a missing, dead or unpious actual ruler cannot borrow piety from a stale Crown-house head',()=>{
  for(const change of ['W.monarch=null','W.monarch.alive=false',"W.monarch.traits=[];W.monarch.sk[KS]=.49"]){
    const r=setup();r.eval('W.houses[0].head=901;'+change);const before=state(r);
    assert.equal(r.eval("abbeyFoundPlan(0,0,'cistercian')"),null,change);
    assert.equal(r.eval(abbeyNativeEligibilityExpression())[0].pious,false,change);
    assert.equal(state(r),before,change);
  }
  const r=setup();r.eval('W.monarch.traits=[];W.monarch.sk[KS]=.5');assert.ok(r.eval("abbeyFoundPlan(0,0,'cistercian')"),'actual scripture gate remains sufficient');
});

test('correct Crown identity retains actual cash, surplus, adoption, title and retained-site refusals',()=>{
  const changes=["W.treasury=hostTarget(0)*4",'W._crNetA=0',"institutionalCapability=()=>({available:false})",'field.held=true','field.wk=H[0].id','field.core=0','field.estateWild=true','s.siegeBy={}',"s._lay.live.compoundSite=()=>null"];
  for(const change of changes){const r=setup();r.eval(change);const before=state(r);assert.equal(r.eval("abbeyFoundPlan(0,0,'cistercian')"),null,change);assert.equal(state(r),before,change);}
});

test('great-house foundation still resolves its named head and never substitutes the monarch',()=>{
  const r=setup();r.eval('s.owner=1;field.lord=1;W.monarch.alive=false');assert.ok(r.eval("abbeyFoundPlan(1,0,'cistercian')"));
  r.eval('W.notables[1].alive=false');assert.equal(r.eval("abbeyFoundPlan(1,0,'cistercian')"),null);
});

test('a Crown manorial endowment uses the real ruler and preserves the native tenant work right',()=>{
  const r=setup(2);r.eval(`const a=corpFound('abbey',{name:'Royal Abbey',si:0,founder:0,order:'benedictine',members:[H[0]],granges:[],charter:{allowRents:true}});H[0].abbey=a.id;H[0].role='monk';
    field.ten='lease';field.wk=H[1].id;field.state=LS.TILLED;field._lqL=1;W._pm=folkIndex();bindPropertyRights(s);`);
  const cash=r.coins(),worker=r.eval('field.wk');assert.equal(r.eval('abbeyEndowLease(a,s)'),true);
  assert.equal(r.eval('field.wk'),worker);assert.equal(r.eval('field.own'),r.eval('a.storageOwnerId'));
  assert.equal(r.eval('field.title.own.owner===a'),true);assert.equal(r.eval('field.title.work.owner===H[1]._hh'),true);near(r.coins(),cash);
});

test('a dead or unpious ruler cannot endow a manorial lease',()=>{
  for(const change of ['W.monarch.alive=false',"W.monarch.traits=[];W.monarch.sk[KS]=.49"]){const r=setup(2);r.eval(`const a=corpFound('abbey',{si:0,founder:0,order:'benedictine',members:[H[0]],granges:[],charter:{allowRents:true}});H[0].abbey=a.id;field.ten='lease';field.wk=H[1].id;field.state=LS.TILLED;field._lqL=1;W._pm=folkIndex();bindPropertyRights(s);`+change);const before=state(r);assert.equal(r.eval('abbeyEndowLease(a,s)'),false);assert.equal(state(r),before);}
});

test('native reach helper reports actual Crown eligibility initially and on the monthly observation without funding or advancing a quote',async()=>{
  const r=setup(),progress=[],attempts=[];r.eval('let observedDay=1;day=()=>observedDay;W.monarch.alive=false');const before=state(r);
  const read=async expression=>{if(expression.includes('const P=abbeyFoundPlan(hi,si,order)'))attempts.push(r.eval('day()'));return JSON.parse(r.eval('JSON.stringify('+expression+')'));};
  await assert.rejects(reachPaidNativeAbbey({read,step:async()=>r.eval('observedDay++'),maxDays:30,allowCrownGrant:false,onProgress:x=>progress.push(x)}),/No actually paid unfinished native abbey church/);
  assert.deepEqual(progress.map(x=>x.day),[1,30]);assert.deepEqual(attempts,[30],'the first positive monthly observation needs no artificial year wait');assert.ok(progress.every(x=>x.eligibility[0].hi===0&&!x.eligibility[0].pious&&!x.eligibility[0].project));assert.equal(state(r),before);
});
