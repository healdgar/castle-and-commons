import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const line=name=>source.match(new RegExp(`^function ${name}\\([^\\n]+`,'m'))?.[0];
const priceStart=source.indexOf('function price0(s,g){');
const priceEnd=source.indexOf('\n}',priceStart)+2;
const extract=name=>source.match(new RegExp('^function '+name+'\\b[\\s\\S]*?(?=^function |^const |^/\\*|$(?![\\s\\S]))','m'))[0];

test('presentation population and beast quote read invalid ledgers without warming or mutating them',()=>{
  const ctx=vm.createContext({GOODBASE:{sheep:4},NEED:{sheep:0.01},LU:{sheep:1},clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),W:{settlements:[]}});
  vm.runInContext([line('detailPopulation'),line('detailPrice'),line('realmPop'),source.slice(priceStart,priceEnd)].join('\n'),ctx);
  const s={_populationReady:true,_popValid:false,_popTotal:999,_want:Object.freeze({sheep:2}),stores:Object.freeze({sheep:0})};
  const population=new Map([[s,31]]),households=Object.freeze([{population}]);s.households=households;Object.defineProperty(s,'pop',{get(){throw Error('presentation read warmed canonical population');}});Object.freeze(s);
  assert.equal(ctx.detailPopulation(s),31);
  assert.ok(ctx.detailPrice(s,'sheep')>0);
  assert.equal(s._popValid,false);assert.equal(s._popTotal,999);assert.equal(Object.hasOwn(s,'px'),false);
  const empty={_populationReady:true,_popValid:false};Object.defineProperty(empty,'pop',{get(){throw Error('initialized empty ledger fell back to pop');}});Object.freeze(empty);
  assert.equal(ctx.detailPopulation(empty),0);assert.equal(empty._popValid,false);
  assert.equal(ctx.detailPopulation({pop:17}),17);
  const legacy=Object.freeze([{pop:17},{pop:23}].map(Object.freeze));ctx.W.settlements=legacy;
  assert.equal(ctx.realmPop(),40);assert.equal(ctx.realmPop(s=>s.pop*2),80);
  assert.deepEqual(legacy.map(s=>Object.keys(s)),[['pop'],['pop']]);
});

// A new contemporary walled town may not yet have been through a military tick.
test('a cold terrain prominence read gives the same defence without altering the town',()=>{
  const ctx=vm.createContext({hAt:(x,z)=>40-(x*x+z*z)/9000,activeFort:s=>s,wallDamage:()=>0,wallProg:()=>1});
  vm.runInContext(extract('prominence')+'\n'+extract('fortOf'),ctx);
  const town={pos:{x:0,z:0},wallRad:[100],walls:2};ctx.s=Object.freeze(town);
  const read=vm.runInContext('fortOf(s,true)',ctx);
  assert.equal(Object.hasOwn(town,'_prom'),false);assert.ok(read.mult>2.5);
  const canonical={...town};ctx.s=canonical;const simulation=vm.runInContext('fortOf(s)',ctx);
  assert.equal(read.mult,simulation.mult);assert.deepEqual(Array.from(read.parts),Array.from(simulation.parts));assert.equal(canonical._prom,10);
  Object.freeze(canonical);assert.equal(vm.runInContext('fortOf(s,true).mult',ctx),simulation.mult);
  assert.match(source,/const f=fortOf\(s,true\);if\(f\.mult>1\.02\)/);
});

test('cold toll payee labels match simulation ownership without assigning titles or warming world indexes',()=>{
  const realm=()=>{
    const living={id:7,name:'Alice',gn:1},dead={id:8,name:'Henry',gn:1,dead:true},away={id:9,name:'Robert',gn:1};
    const parish={arch:'temple',state:'sound'},town={owner:1,name:'Market town',pos:{x:0,z:0},buildings:[parish],folk:[living,dead]};
    const W={settlements:[town],houses:[{}, {name:'The earl'}],households:new Map([[1,{members:new Set([away])}]]),abbeys:[{name:'St Mary'},{name:'St Paul',gone:true}],guilds:[]};
    return {W,town,parish,living};
  };
  const code=['detailTollOwner','ownerOf','ownerAcct','accountOwner','lordAcct','corpOf','parishOf','acctLabel'].map(extract).join('\n');
  const pure=realm(),canonical=realm();
  const context=(r,readonly)=>vm.createContext({...r,LORD_ARCH:new Set(['toll']),CHURCH_ARCH:new Set(),TOWN_ARCH:new Set(),folkName:p=>p.name,
    chOf:b=>{if(readonly)throw Error('inspector created a parish account');return b.ch={fund:0};},
    folkIndex:()=>{if(readonly)throw Error('inspector warmed the folk index');const P=new Map();for(const s of r.W.settlements)for(const p of s.folk)P.set(p.id,p);for(const h of r.W.households.values())for(const p of h.members)if(!p.dead)P.set(p.id,p);return r.W._folkIndex=P;}});
  const a=context(pure,true),b=context(canonical,false);vm.runInContext(code,a);vm.runInContext(code,b);
  Object.freeze(pure.parish);Object.freeze(pure.town);Object.freeze(pure.W);
  const cases=[undefined,'lord','town','church','abbey:0','abbey:1',7,8,9,999,null];
  for(const ownerId of cases){
    a.toll=Object.freeze({arch:'toll',s:pure.town,...(ownerId===undefined?{}:{ownerId})});
    b.toll={arch:'toll',s:canonical.town,...(ownerId===undefined?{}:{ownerId})};
    assert.equal(vm.runInContext('detailTollOwner(toll)',a),vm.runInContext('acctLabel(ownerAcct(toll,town))',b),String(ownerId));
    assert.equal(Object.hasOwn(a.toll,'ownerId'),ownerId!==undefined);
  }
  a.toll=Object.freeze({arch:'toll',s:pure.town,title:{owner:{household:true,head:pure.living}}});
  b.toll={arch:'toll',s:canonical.town,title:{owner:{household:true,head:canonical.living}}};
  assert.equal(vm.runInContext('detailTollOwner(toll)',a),vm.runInContext('acctLabel(ownerAcct(toll,town))',b));
  assert.equal(Object.hasOwn(pure.W,'_pm'),false);assert.equal(Object.hasOwn(pure.W,'_folkIndex'),false);assert.equal(Object.hasOwn(pure.parish,'ch'),false);
  const inspector=source.slice(source.indexOf('function inspectorCard('),source.indexOf('\nfunction ',source.indexOf('function inspectorCard(')+1));
  assert.equal((inspector.match(/detailTollOwner\(b,/g)||[]).length,3);assert.doesNotMatch(inspector,/ownerAcct\(/);
});

test('a cold port berth reading returns the same shore without recording it on the settlement',()=>{
  const ctx=vm.createContext({W:{water:[0,0,0,0,0,1,0,0,0]},inB:(x,z)=>x>=0&&z>=0&&x<3&&z<3,cIdx:(x,z)=>z*3+x,cellX:x=>x*10,cellZ:z=>z*10});
  vm.runInContext(extract('landingOf')+'\n'+extract('berthsOf'),ctx);
  ctx.s=Object.freeze({cx:1,cz:1,buildings:Object.freeze([{arch:'wharf',state:'sound',x:10,z:10,rot:0,w:4,d:8}].map(Object.freeze))});
  const reading=vm.runInContext('JSON.stringify(berthsOf({...s}))',ctx);
  assert.equal(Object.hasOwn(ctx.s,'landing'),false);assert.equal(vm.runInContext('JSON.stringify(berthsOf({...s}))',ctx),reading);
  ctx.s={...ctx.s};assert.equal(vm.runInContext('JSON.stringify(berthsOf(s))',ctx),reading);assert.deepEqual({...ctx.s.landing},{x:20,z:10});
  Object.freeze(ctx.s);assert.equal(vm.runInContext('JSON.stringify(berthsOf({...s}))',ctx),reading);
  assert.match(source,/if\(s\.harbor\)\{const B=berthsOf\(\{\.\.\.s\}\)/);
});

test('card names preserve native sign uniqueness and recorded names without naming world buildings',()=>{
  const ctx=vm.createContext({SEED:1234567,W:{crownCult:'anglo'}});
  vm.runInContext(extract('sfc32')+'\n'+source.slice(source.indexOf('const CULT={'),source.indexOf('function siteFeatures('))+'\n'+source.slice(source.indexOf('const SIGNS={'),source.indexOf('\nconst CHARGES='))+'\n'+extract('detailNaming'),ctx);
  for(const cult of vm.runInContext('Object.keys(CULT)',ctx)){
    const make=()=>{const s={cult,name:'Market town',kind:'town',buildings:[],_bn:new Set(['Recorded Sign'])};for(const [i,arch] of ['tavern','tavern','shop','smithy','inn','warehouse','temple','keep','hall','house'].entries())s.buildings.push({s,arch,x:i<2?0:i*20,z:5,district:'market',...(i===2?{nm:'Recorded Sign'}:{})});return s;};
    const s=make(),reference=make();ctx.s=s;ctx.reference=reference;
    const expected=vm.runInContext('reference.buildings.map(buildingName)',ctx);
    s._bn.add=()=>{throw Error('card changed occupied business signs');};Object.freeze(s._bn);Object.freeze(s.buildings);for(const b of s.buildings)Object.freeze(b);Object.freeze(s);
    const names=vm.runInContext('detailNaming()',ctx),before=Array.from(s._bn),actual=s.buildings.map(names);
    assert.deepEqual(actual,Array.from(expected),cult);assert.notEqual(actual[0],actual[1],cult+' duplicate coordinates still choose different signs');
    assert.deepEqual(s.buildings.slice().reverse().map(names).reverse(),actual,cult+' card access order');assert.deepEqual(Array.from(s._bn),before);
    assert.equal(s.buildings.filter(b=>Object.hasOwn(b,'nm')).length,1);assert.equal(names(s.buildings[2]),'Recorded Sign');
    assert.deepEqual(s.buildings.map(vm.runInContext('detailNaming()',ctx)),actual,cult+' another cold card');
  }
  const inspector=source.slice(source.indexOf('function inspectorCard('),source.indexOf('\nfunction inspectorPickCode'));
  assert.doesNotMatch(inspector,/buildingName\(/);assert.match(inspector,/const name=detailNaming\(\)/);assert.match(inspector,/detailSettlement\(s,name\)/);assert.match(inspector,/detailHousehold\(s,p,name\)/);
});

test('opening-capacity failure note reads the stored worker result and projects only exhausted sites',()=>{
  const record=Object.freeze({capacity:4,goal:7,complete:false,exhausted:true}),town=Object.freeze({name:'Town',openingCapacity:record});
  const ctx=vm.createContext({});
  vm.runInContext(extract('openingCapacityNote'),ctx);
  assert.equal(ctx.openingCapacityNote(town),'At opening, 4 household places could be fitted for 7 households.');
  assert.equal(ctx.openingCapacityNote(Object.freeze({openingCapacity:Object.freeze({capacity:7,goal:7,complete:true,exhausted:false})})), '');
  const inspector=source.slice(source.indexOf('function inspectorCard('),source.indexOf('\nfunction inspectorPickCode'));
  assert.match(inspector,/const note=openingCapacityNote\(s\);if\(note\)h\+=row\('Opening housing',note\)/);
  assert.match(source,/\['Population','Unrest','Opening housing'\]\.includes\(r\.firstElementChild\?\.textContent\)/);
  const projection=source.slice(source.indexOf('function visualSettlement('),source.indexOf('\nfunction visualField('));
  assert.match(projection,/visualRecord\(s,'[^']*\bopeningCapacity\b[^']*',m\)/);
  assert.match(source,/const report=\{si,heads:heads\.size,\.\.\.result\};W\.openingCapacity\.push\(report\);if\(report\.exhausted\)s\.openingCapacity=report/);
  assert.match(source,/const refreshExtent=\(\)=>\{s\.extentR=extent\(0\.92\);s\.radius=s\.extentR\+30;if\(!s\.wallRad\)s\.wallR=s\.extentR\+20;s\.paveR=isVil\?0:extent\(0\.45\);\}/);
  assert.match(source,/s\._lay\?\.refreshExtent\?\.\(\);\s*const report=/);
  assert.match(source,/completeResidential,refreshExtent/);
  assert.doesNotMatch(source,/s\.coreR\s*=\s*extent/);
});

test('plan drafts, cold church and keep cards, and storage quotes avoid mutating settlement caches or lazy accounts',()=>{
  const planDraftCode=extract('planDraft');
  assert.doesNotMatch(planDraftCode,/buildingName\(/);
  assert.match(planDraftCode,/detailNaming\(\)/);

  const inspector=source.slice(source.indexOf('function inspectorCard('),source.indexOf('\nfunction inspectorPickCode'));
  assert.doesNotMatch(inspector,/\bchOf\(b\)/);
  assert.doesNotMatch(inspector,/\bcasOf\(s\)/);
  assert.match(inspector,/if\(typeof QUERY_LAND_VALUES!=='undefined'&&!prior\)QUERY_LAND_VALUES=new Map\(\)/);

  const ctx=vm.createContext({
    GOODBASE:{grain:1,stone:2,timber:2},NEED:{grain:0.01},LU:{grain:1},
    clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),
    QUERY_LAND_VALUES:new Map(),
    nonemptyHouseholds:()=>[],
    W:Object.freeze({settlements:[],households:new Map()})
  });
  vm.runInContext(source.slice(priceStart,priceEnd)+'\n'+extract('price')+'\n'+extract('folkIndex'),ctx);
  const s=Object.freeze({_want:Object.freeze({grain:2}),stores:Object.freeze({grain:1})});
  assert.ok(ctx.price(s,'grain')>0);
  assert.equal(Object.hasOwn(s,'px'),false);
  assert.equal(ctx.folkIndex().size,0);
  assert.equal(Object.hasOwn(ctx.W,'_folkIndex'),false);
});

