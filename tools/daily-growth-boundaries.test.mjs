import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const fn=name=>source.match(new RegExp(`^function ${name}\\b[\\s\\S]*?(?=^function |^const |^/\\*|$(?![\\s\\S]))`,'m'))?.[0];
const declaration=name=>source.match(new RegExp(`^const ${name}=[^\\n]*`,'m'))?.[0];
const growthWrapper=fn('tickGrowth');
assert.ok(growthWrapper,'tickGrowth wrapper must exist');

test('occupancy, due falls and structural decisions run in dependency order every day',()=>{
  const selected=new Set([0,1,5,6,7,361]),events=new Map(),decisionDays=Array.from({length:362},()=>({widen:[],vacancy:[]}));
  const counts=Array.from({length:362},()=>({moveIn:0,fall:0,charter:0,housing:0,widen:0,vacancy:0,fabric:0,newTown:0,lane:0,wall:0,reuse:0}));
  let today=0;
  const record=(kind,s)=>{
    counts[s.index][kind]++;
    if(kind==='widen'||kind==='vacancy')decisionDays[s.index][kind].push(today);
    if(selected.has(s.index)){
      const key=`${today}:${s.index}`,list=events.get(key)||[];
      list.push(kind);events.set(key,list);
    }
  };
  const W={settlements:Array.from({length:362},(_,index)=>({index,folk:[{}]}))};
  const c=vm.createContext({
    W,day:()=>today,
    moveIn:s=>record('moveIn',s),tickFalling:s=>record('fall',s),villageMarketCharter:s=>record('charter',s),
    tickGrowthHousing:s=>record('housing',s),tickGrowthWiden:s=>record('widen',s),
    tickGrowthVacancy:s=>record('vacancy',s),tickGrowthFabric:s=>record('fabric',s),
    newTownStreetProposal:s=>record('newTown',s),publicLaneProposal:s=>record('lane',s),
    townWallProposal:s=>record('wall',s),tickTownReuse:s=>record('reuse',s)
  });
  vm.runInContext(growthWrapper,c);
  for(today=1;today<=360;today++)c.tickGrowth();

  for(const index of [0,1,5,6,7,361]){
    const n=counts[index];
    assert.equal(n.moveIn,360,`daily occupancy for settlement ${index}`);
    assert.equal(n.fall,360,`daily falls for settlement ${index}`);
    assert.equal(n.charter,360,`daily market-charter eligibility for settlement ${index}`);
    assert.equal(n.housing,360,`daily housing decision for settlement ${index}`);
    assert.equal(n.fabric,360,`daily fabric decision for settlement ${index}`);
    assert.equal(n.widen,360,`daily widening decision for settlement ${index}`);
    assert.equal(n.vacancy,360,`daily vacancy decision for settlement ${index}`);
    const due=Array.from({length:360},(_,i)=>i+1);
    assert.deepEqual(decisionDays[index].widen,due);
    assert.deepEqual(decisionDays[index].vacancy,due);
    for(const kind of ['newTown','lane','wall','reuse'])assert.equal(n[kind],360,kind+' is daily for settlement '+index);
  }
  const order=['moveIn','fall','charter','housing','widen','vacancy','fabric','newTown','lane','wall','reuse'];
  for(const key of ['174:6','29:1','29:361','6:0'])assert.deepEqual(events.get(key),order,key+' keeps the same daily order');
});

function occupancyHarness({heads,roof,dayValue=4}){
  const draws=[];
  const c=vm.createContext({
    W:{settlements:[],schools:[]},HOUSEHOLD:5,
    day:()=>c.today,
    heads_:(s,pred)=>(s.heads||[]).filter(h=>!pred||pred(h)),
    capOf:()=>1,workOf:()=>({x:0,z:0}),homeScore:()=>1,
    updateBuildingInstance:b=>{c.updated.push(b);},
    villageMarketCharter(){},tickGrowthHousing(){},tickGrowthWiden(){},tickGrowthVacancy(){},tickGrowthFabric(){},
    newTownStreetProposal(){},publicLaneProposal(){},townWallProposal(){},tickTownReuse(){},
    chance:()=>{draws.push('chance');throw Error('occupancy/falls must not draw RNG');},
    frand:()=>{draws.push('frand');throw Error('occupancy/falls must not draw RNG');},
    randi:()=>{draws.push('randi');throw Error('occupancy/falls must not draw RNG');},
    rand:()=>{draws.push('rand');throw Error('occupancy/falls must not draw RNG');},
    wpick:()=>{draws.push('wpick');throw Error('occupancy/falls must not draw RNG');},
    today:dayValue,updated:[],draws
  });
  const snippets=[declaration('RESID'),declaration('VACANT_RESIDENTIALS'),fn('vacantResidentials'),fn('vacantResidentialChanged'),...['housingEligible','housingSlots','learningLodgingUsed','learningHouseholdSlots','learningPerson'].map(fn),fn('moveIn'),fn('tickFalling'),growthWrapper];
  assert.ok(snippets.every(Boolean),'occupancy test needs current production helpers');
  vm.runInContext(snippets.join('\n'),c);
  const s={folk:heads.length?heads:[{}],heads,buildings:[roof],_falling:[roof],ruinCount:0};
  roof.s=s;roof._fallAt=dayValue;
  c.W.settlements.push(s);
  c.vacantResidentials(s);
  return {c,s,roof,draws};
}

test('a household moving in on the due day saves the scheduled roof before it falls',()=>{
  const h={w:10},roof={arch:'house',state:'sound',removed:false,hh:[],x:0,z:0};
  const {c,s,roof:r,draws}=occupancyHarness({heads:[h],roof});
  c.tickGrowth();
  assert.equal(h.bh,r);
  assert.equal(r.hh.length,1);
  assert.equal(r.hh[0],h);
  assert.equal(r.state,'sound');
  assert.equal(r._fallAt,0);
  assert.equal(s._falling.length,0);
  assert.equal(s.ruinCount,0);
  assert.deepEqual(draws,[]);
});

test('an empty roof falls on its due day without consuming RNG',()=>{
  const roof={arch:'house',state:'sound',removed:false,hh:[],x:0,z:0};
  const {c,s,roof:r,draws}=occupancyHarness({heads:[],roof});
  c.tickGrowth();
  assert.equal(r.state,'ruin');
  assert.equal(r.deserted,true);
  assert.equal(r._fallAt,0);
  assert.equal(s.ruinCount,1);
  assert.deepEqual(s._falling,[]);
  assert.equal(c.updated.length,1);
  assert.deepEqual(draws,[]);
});
