import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {realm,near} from './ownership-fixture.mjs';

const source=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const technology=source.slice(source.indexOf('const CONSTRUCTION_METHODS='),source.indexOf('\nconst tierCap='));
function fixture(startAD=1066){
  const f=realm({crown:10000,cash:20,households:2});let d=0,seed=72,draws=0,writes=0;
  Object.assign(f.W,{startAD,ships:[],projects:[],abbeys:[]});
  Object.assign(f.s,{_bearA:100,_gYield:1,res:{farm:100},tradeV:1000,furl:[],buildings:[{arch:'temple',state:'sound'}]});f.s.stores.cattle=4;
  const p=f.H[0];Object.assign(p,{tr:'priest',sk:new Float32Array([1,1]),age:30});
  Object.assign(f.C,{KL:0,KS:1,LS:{WILD:0,WOOD:1,SCRUB:2},day:()=>d,year:()=>Math.floor(d/360)+1,AD:()=>startAD+Math.floor(d/360),price0:(s,g)=>s.px[g]??1,
    rand:lane=>{assert.equal(lane,'inst');draws++;seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;},
    writeFurlong:()=>writes++,sovOn:()=>true,plyH:()=>0,esc:s=>String(s),emit:()=>{}});
  vm.runInContext(source.match(/^function purseAcct\([^\n]+/m)[0]+'\n'+technology,f.C);
  return {...f,p,setDay:x=>d=x,get draws(){return draws;},get writes(){return writes;},get seed(){return seed;}};
}

test('direct era opening creates inherited knowledge without prehistory, RNG or payments; queries stay pure',()=>{
  for(const start of [850,1066,1250,1350]){const f=fixture(start),coins=f.coins();f.eval('initTechnology();technologyPlace(s)');
    assert.equal(f.draws,0);near(f.coins(),coins);assert.equal(f.eval('W.technology.openingAD'),start);
    const before=f.eval('JSON.stringify([W.technology,s.technology])');
    for(let i=0;i<3;i++){f.eval('technologyState();technologyHTML();institutionalCapability(s,"cistercian1128");constructionCapability(s,"stoneKeep")');}
    assert.equal(f.eval('JSON.stringify([W.technology,s.technology])'),before);assert.equal(f.draws,0);
    assert.equal(f.eval('technologyCapability(s,"threeField").available'),start>=1130);
    assert.equal(f.eval('constructionCapability(s,"stoneKeep").available'),start>=1110);
    assert.equal(f.eval('institutionalCapability(s,"benedictine910").available'),true);
  }
});

test('invention dates and local prerequisites apply even when a malformed save claims future adoption',()=>{
  const f=fixture(1066);f.eval('initTechnology();technologyPlace(s);W.technology.known.stoneKeep={day:0};s.technology.adopted.stoneKeep={day:0};W.technology.known.royalEyre={day:0};s.technology.adopted.royalEyre={day:0}');
  assert.equal(f.eval('constructionCapability(s,"stoneKeep",1079).available'),false);
  assert.equal(f.eval('constructionCapability(s,"stoneKeep",1080).available'),true);
  assert.equal(f.eval('institutionalCapability(s,"royalEyre1166",1166).reason'),'prerequisite');
  f.eval('W.technology.known.romanLaw={day:0};s.technology.adopted.romanLaw={day:0}');
  assert.equal(f.eval('institutionalCapability(s,"royalEyre1166",1166).available'),true);
});

test('actual arrival queues information, then adoption pays an available named teacher from a real purse',()=>{
  const f=fixture(1250);f.eval('initTechnology();technologyPlace(s)');f.setDay(1);
  f.eval('W.technology.known.numerals={day:0};delete s.technology.adopted.numerals;technologyContact(null,s)');
  assert.equal(f.eval('technologyCapability(s,"numerals").available'),false);
  assert.equal(f.eval('!!s.technology.ready.numerals'),true);
  const coins=f.coins(),crown=f.W.treasury,purse=f.eval('means(H[0])');f.eval('tickTechnology()');
  assert.equal(f.eval('technologyCapability(s,"numerals").available'),true);
  const paid=f.eval('s.technology.adopted.numerals.paid');assert.ok(paid>0);near(f.W.treasury,crown-paid);near(f.eval('means(H[0])'),purse+paid);near(f.coins(),coins);
  assert.equal(f.eval('s.technology.adopted.numerals.teacher'),f.p.id);
  const before=f.eval('JSON.stringify([W.technology,s.technology])'),draws=f.draws;f.eval('tickTechnology()');
  assert.equal(f.eval('JSON.stringify([W.technology,s.technology])'),before);assert.equal(f.draws,draws);
});

test('dead, away or decorative schoolmasters create no teaching; absent payers cannot mint support',()=>{
  const f=fixture(1250);f.eval('initTechnology();technologyPlace(s)');f.p.tr='labourer';f.p.office='master';f.eval('technologyActorsDirty(s)');
  assert.equal(f.eval('technologyTeachers(s).length'),0);
  assert.equal(f.eval('technologySupport(s,null,H[0],10)'),0);
  f.eval('s.school={master:H[0].id,building:{state:"sound"},contract:{master:H[0].id,paid:1,lastPaidDay:day()}};technologyActorsDirty(s)');
  assert.equal(f.eval('technologyTeachers(s).length'),1);
  f.p.away={until:100};assert.equal(f.eval('technologyTeachers(s).length'),0);delete f.p.away;
  f.p.dead=true;assert.equal(f.eval('technologyTeachers(s).length'),0);
});

test('insufficient coin preserves adoption pending, and support records only the actual transfer receipt',()=>{
  const f=fixture(1250);f.eval('initTechnology();technologyPlace(s)');f.setDay(1);f.W.treasury=0;
  f.eval('W.technology.known.numerals={day:0};delete s.technology.adopted.numerals;technologyContact(null,s);tickTechnology()');
  assert.equal(f.eval('technologyCapability(s,"numerals").available'),false);assert.equal(f.W.treasury,0);
  f.W.treasury=0.001;const paid=f.eval('technologySupport(s,"crown",H[0],10)');near(paid,0.001);near(f.eval('s.technology.support.paid'),paid);near(f.W.treasury,0);
});

test('three-field knowledge changes cropped fraction/field records, while machines require installed equipment',()=>{
  const f=fixture(1066);f.s.furl=[{gf:0,x:50,z:50}];f.eval('initTechnology();technologyPlace(s);technologyFields(s)');
  assert.equal(f.eval('technologyFarmYield(s)'),0.75);assert.equal(f.s.furl[0].rotation,2);
  f.eval('W.technology.known.threeField={day:0};s.technology.adopted.threeField={day:0}');f.setDay(34*360);f.eval('technologyFields(s)');
  assert.equal(f.eval('technologyFarmYield(s)'),1);assert.equal(f.s.furl[0].rotation,3);assert.equal(f.writes,2);
  const late=fixture(1350);late.eval('initTechnology();technologyPlace(s)');
  assert.equal(late.eval('technologyEffect(s,"loom",{})'),1);
  assert.equal(late.eval('technologyEffect(s,"loom",{techEquipment:{loom:{installed:true}}})'),1.3);
  near(late.eval('constructionTechnologyRecipe(s,"masonry").laborFactor'),0.72);
  assert.equal(late.eval('constructionTechnologyRecipe(s,"masonry").timber'),22);
});

test('batch boundaries and repeated read projections do not change daily discovery or money histories',()=>{
  const a=fixture(1166),b=fixture(1166);for(const f of[a,b])f.eval('initTechnology();technologyPlace(s);s.technology.patronage[0]=10');
  for(let d=1;d<=60;d++){a.setDay(d);b.setDay(d);a.eval('tickTechnology()');if(d%6===0)b.eval('technologyState();technologyHTML()');b.eval('tickTechnology()');}
  assert.equal(a.seed,b.seed);assert.equal(a.draws,b.draws);
  assert.equal(a.eval('JSON.stringify([W.technology,s.technology])'),b.eval('JSON.stringify([W.technology,s.technology])'));
  near(a.W.treasury,b.W.treasury);near(a.eval('means(H[0])'),b.eval('means(H[0])'));
});


test('patronage command is validated at the worker boundary before recording an allowance',()=>{
  const f=fixture(),helpers=source.slice(source.indexOf('function workerCommandInt('),source.indexOf('function workerCommandArmyArg('));vm.runInContext(helpers,f.C);
  assert.equal(f.eval('workerCommandTarget({k:"c",c:"s-learning",a:"0:20"})'),'worker');
  for(const a of ['0:-1','0:Infinity','0:NaN','0:','999:20','0:20:extra'])assert.throws(()=>f.eval(`workerCommandTarget({k:"c",c:"s-learning",a:${JSON.stringify(a)}})`),/Invalid learning command/);
  assert.equal(f.eval('technologyCmd("0:20")'),true);assert.equal(f.eval('s.technology.patronage[0]'),20);near(f.W.treasury,10000);
});
