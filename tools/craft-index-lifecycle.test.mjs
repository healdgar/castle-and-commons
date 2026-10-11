import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {realm,near} from './ownership-fixture.mjs';

const source=fs.readFileSync(process.env.FURLONG_TEST_SOURCE||new URL('../index.html',import.meta.url),'utf8');
const fn=n=>source.match(new RegExp('^function '+n+'\\b[\\s\\S]*?(?=^function |^const |^/\\*|$(?![\\s\\S]))','m'))?.[0]||assert.fail('missing '+n);
function fixture(){
  const r=realm({households:3,pop:3,cash:100,crown:1000});
  Object.assign(r.C,{OUTLAW_MAX:12,KLaw:0,technologyActorsDirty:()=>{},nearestSettlementIdx:()=>0,chance:()=>true,trait:()=>0});
  vm.runInContext(['workers_','learningStaff','learningSchoolClose','learningTutorClose','estateKeeperQuote','estateWorker','estateOfficeRelease','estatePayKeeper','outlawReturn','recruitBandit'].map(fn).join('\n'),r.C);
  r.eval(`H[0].tr='smith';H[1].tr='weaver';H[2].tr='carpenter';H.forEach(p=>{p.age=30;householdAccount(p)});householdsOf(s);W._pm=new Map(H.map(p=>[p.id,p]));W.adj={0:[]};W.roads=[];`);
  return r;
}
const roster=r=>JSON.parse(r.eval('JSON.stringify([...craftIndex(s).trades].map(([tr,L])=>[tr,L.map(p=>p.id)]))'));

test('closing an actual school restores its teacher to the ordered native trade roster',()=>{
  const r=fixture();r.eval(`H[0].tr='clerk';H[0].office='master';H[0].schoolMaster=0;const S={id:0,si:0,ownerId:null,master:H[0].id,masterName:'Teacher',pupils:[],previous:{tr:'smith'},contract:{active:true}};s.school=S;const before=craftIndex(s);`);
  assert.deepEqual(roster(r),[['weaver',[2]],['carpenter',[3]]]);
  r.eval('learningSchoolClose(S,"no paid pupils")');
  assert.equal(r.eval('s._craftIndex'),undefined);assert.equal(r.eval('H[0].schoolMaster'),undefined);assert.equal(r.eval('before.revision'),r.eval('W._folkRevision'));
  assert.deepEqual(roster(r),[['smith',[1]],['weaver',[2]],['carpenter',[3]]]);assert.equal(r.eval('craftIndex(s)===before'),false);
});

test('ending an actual tutor contract restores the prior trade without a population revision',()=>{
  const r=fixture();r.eval(`H[0].tr='clerk';H[0].office='tutor';H[0].tutorMaster=0;const T={id:0,si:0,master:H[0].id,previous:{tr:'smith'},contract:{active:true}};const before=craftIndex(s);learningTutorClose(T,'patron withdrew');`);
  assert.equal(r.eval('s._craftIndex'),undefined);assert.equal(r.eval('H[0].tutorMaster'),undefined);assert.equal(r.eval('before.revision'),r.eval('W._folkRevision'));
  assert.deepEqual(roster(r),[['smith',[1]],['weaver',[2]],['carpenter',[3]]]);
});

test('an actual household head change rebuilds heads and trades in native person order',()=>{
  const r=fixture();r.eval(`const home=householdAccount(H[0]);bindHousehold(H[1],home);const before=craftIndex(s);home.head=H[1];householdHeadsChanged(s);`);
  assert.equal(r.eval('s._craftIndex'),undefined);assert.equal(r.eval('before.revision'),r.eval('W._folkRevision'));
  assert.deepEqual(JSON.parse(r.eval('JSON.stringify(craftIndex(s).heads.map(p=>p.id))')),[2,3]);
  assert.deepEqual(roster(r),[['weaver',[2]],['carpenter',[3]]]);
});

test('keeper hire and release refresh real trade candidates and retain the actual wage receipt',()=>{
  const r=fixture(),coins=r.coins();r.eval(`const C={id:'estate:0',si:0,ownerId:0,jobs:{}};const before=craftIndex(s);const hired=estatePayKeeper(s,C,'park',100);`);
  assert.equal(r.eval('hired'),r.H[0]);assert.equal(r.eval('s._craftIndex'),undefined);assert.ok(r.eval('C.wages')>0);near(r.coins(),coins);
  assert.deepEqual(roster(r),[['weaver',[2]],['carpenter',[3]]]);
  r.eval('estateOfficeRelease(hired)');assert.equal(r.eval('s._craftIndex'),undefined);assert.equal(r.eval('hired.estateOffice'),undefined);
  assert.deepEqual(roster(r),[['smith',[1]],['weaver',[2]],['carpenter',[3]]]);
  r.eval(`const current=craftIndex(s);estateOfficeRelease(hired);estatePayKeeper(s,C,'park',0)`);assert.equal(r.eval('s._craftIndex===current'),true,'no actual job change leaves the roster intact');
});

test('release of a stale estate marker preserves the person\'s replacement office and trade',()=>{
  const r=fixture();r.eval(`H[0].estateOffice={compound:'estate:0',key:'park',priorTrade:'smith'};H[0].estatePaidDay=1;H[0].office='master';H[0].officeFor='school:1';H[0].schoolMaster=1;H[0].tr='clerk';craftIndex(s);estateOfficeRelease(H[0]);`);
  assert.equal(r.H[0].office,'master');assert.equal(r.H[0].officeFor,'school:1');assert.equal(r.H[0].schoolMaster,1);assert.equal(r.H[0].tr,'clerk');assert.equal(r.H[0].estateOffice,undefined);assert.equal(r.H[0].estatePaidDay,undefined);
  assert.deepEqual(roster(r),[['weaver',[2]],['carpenter',[3]]]);
});

test('native outlaw enlistment and return remove and restore the same ordered household head',()=>{
  const r=fixture(),coins=r.coins();r.eval(`const camp={id:7,x:10,z:0,men:[],nextRecruit:1};H[0]._hh.hunger=.8;H[0]._hh.assets._debt=200;const before=craftIndex(s);`);
  assert.equal(r.eval('recruitBandit(camp,true)'),true);assert.equal(r.eval('s._craftIndex'),undefined);assert.equal(r.eval('camp.men[0]'),r.H[0]);
  assert.deepEqual(roster(r),[['weaver',[2]],['carpenter',[3]]]);
  r.eval('outlawReturn(H[0],"the camp scattered")');assert.equal(r.eval('s._craftIndex'),undefined);assert.equal(r.H[0].outlawCampId,undefined);
  assert.deepEqual(roster(r),[['smith',[1]],['weaver',[2]],['carpenter',[3]]]);near(r.coins(),coins);
});
