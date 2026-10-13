import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {inlineGameScript,contextFor} from './simulation-boundary.mjs';

const source=inlineGameScript(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'));
const rng=source.slice(source.indexOf('function sfc32('),source.indexOf('/* ---------------- one realm,'));
const origin=source.slice(source.indexOf('function settlementOrigin('),source.indexOf('function obbCorners('));
const c=vm.createContext({SEED:1001});vm.runInContext(rng+origin,c);
const plain=x=>JSON.parse(JSON.stringify(x));
const make=(seed,s,era,live=false)=>{c.SEED=seed;return plain(c.settlementOrigin(s,0,era,live));};

test('Roman predecessors and their foundations persist across opening dates and current town roles',()=>{
  let roman=0,irregular=0;
  for(let seed=1;seed<=512;seed++){
    const a=make(seed,{kind:'town',cult:'french',role:'market'},850);
    const b=make(seed,{kind:'capital',cult:'french',role:'border'},1066);
    if(a.kind!=='roman')continue;roman++;
    assert.deepEqual(a,b,'current size, role and date cannot manufacture a different Roman past');
    assert.ok(a.foundedAD>=50&&a.foundedAD<400);
    assert.ok(a.core.hl<120&&a.core.hw<90,'inherited core cannot span the whole town');
    if(a.layout==='grown')irregular++;
  }
  assert.ok(roman>0&&roman<512&&irregular>0,'Roman inheritance includes planned and irregular predecessors');
});

test('villages and cultures without the configured Roman legacy never acquire a Roman grid',()=>{
  for(let seed=1;seed<=128;seed++)for(const s of[{kind:'village',cult:'italian',role:'farm'},{kind:'town',cult:'norse',role:'border'},{kind:'capital',cult:'slavic',role:'seat'}]){
    const o=make(seed,s,1066);assert.equal(o.kind,'medieval');assert.notEqual(o.layout,'roman');
  }
});

test('planted markets require their dated foundation and report no future history',()=>{
  let planned=0;
  for(let seed=1;seed<=256;seed++)for(const era of[850,1066,1200]){
    const o=make(seed,{kind:'town',cult:'norse',role:'market'},era);
    assert.ok(o.foundedAD<=era);
    if(o.layout==='planned'){planned++;assert.ok(o.foundedAD>=950);}
    if(era===850)assert.notEqual(o.layout,'planned');
  }
  assert.ok(planned>0,'later openings exercise actual dated planted markets');
});

test('new foundations record the actual date and cannot invent a Roman predecessor',()=>{
  for(const era of[850,1066,1200])for(const kind of['town','village']){
    const o=make(1,{kind,cult:'italian',role:'market'},era,true);
    assert.equal(o.kind,'medieval');assert.equal(o.foundedAD,era);assert.equal(o.live,true);
    assert.equal(o.layout,kind==='village'?'village':'grown');
  }
  assert.equal(make(1,{kind:'town',cult:'italian',forceMode:'planned'},850,true).layout,'planned');
});

test('native AD850 and AD1066 realms retain ancient cores, medieval lanes, chronology and exact saved origins', {timeout:600_000},async()=>{
  const sha=createHash('sha256').update(source).digest('hex'),openings=[];
  for(const era of[850,1066]){
    const hash='#s=1001&f=42&c=sea&y='+era+'&km=6',C=contextFor(source,hash),R=code=>vm.runInContext(code,C,{timeout:180_000});
    C.__sha=sha;
    await R('startSimulation({seed:1001,fate:42,coast:"sea",startAD:'+era+',outcomeJournal:new OutcomeJournal(async e=>({chunk:e.chunk,first:e.first,last:e.last}),{maxPendingBytes:64*1024*1024})})');
    const records=plain(R(`W.settlements.map((s,si)=>({si,name:s.name,cult:s.cult,mode:s.mode,origin:s.origin,history:s.history,grid:s.streets.filter(st=>st.roman).map(st=>({pts:st.pts,foundedAD:st.foundedAD})),lanes:s.streets.filter(st=>st.kind==='lane'&&!st.hidden&&!st.gone&&!st.straight).length}))`));
    const roman=records.filter(s=>s.origin.kind==='roman'),grids=roman.filter(s=>s.mode==='roman');
    assert.ok(grids.some(s=>s.grid.length>0),'native realm has surviving ancient grid streets at AD'+era);
    assert.ok(grids.some(s=>s.lanes>0),'native Roman cores also have irregular medieval lanes');
    for(const s of records){
      assert.ok(s.history.length>0);
      for(const h of s.history){assert.ok(Number.isFinite(h.ad)&&h.ad<=era);assert.ok(h.ad>=s.origin.foundedAD);}
      assert.deepEqual(s.history.map(h=>h.ad),s.history.map(h=>h.ad).sort((a,b)=>a-b));
      if(s.origin.kind==='roman')assert.equal(s.history[0].ad,s.origin.foundedAD);
      for(const st of s.grid)assert.equal(st.foundedAD,s.origin.foundedAD);
    }
    await R('STORAGE_OUTCOMES.flush()');const doc=await R('worldSave({sourceSHA256:__sha})');
    const D=contextFor(source,hash),L=code=>vm.runInContext(code,D,{timeout:180_000});D.__sha=sha;D.__doc=doc;
    await L('worldLoad(__doc,{sourceSHA256:__sha,outcomeJournal:new OutcomeJournal(async e=>({chunk:e.chunk,first:e.first,last:e.last}),{maxPendingBytes:64*1024*1024})})');
    assert.deepEqual(plain(L('W.settlements.map(s=>({origin:s.origin,history:s.history,layoutOrigin:s._lay.historyState().origin}))')),plain(R('W.settlements.map(s=>({origin:s.origin,history:s.history,layoutOrigin:s._lay.historyState().origin}))')));
    const again=await L('worldSave({sourceSHA256:__sha})');assert.equal(createHash('sha256').update(again).digest('hex'),createHash('sha256').update(doc).digest('hex'));
    for(let day=1;day<=3;day++){for(const run of[R,L]){await run('STORAGE_OUTCOMES.wait()');run('simTick()');await run('STORAGE_OUTCOMES.flush()');}}
    assert.deepEqual(plain(L('Object.fromEntries(Object.entries(RS).map(([k,r])=>[k,r.state()]))')),plain(R('Object.fromEntries(Object.entries(RS).map(([k,r])=>[k,r.state()]))')));
    assert.equal(createHash('sha256').update(Buffer.from(L('worldSaveEncode().bytes'))).digest('hex'),createHash('sha256').update(Buffer.from(R('worldSaveEncode().bytes'))).digest('hex'));
    openings.push(records);
  }
  for(const s of openings[0].filter(s=>s.origin.kind==='roman')){
    const later=openings[1][s.si];assert.deepEqual(later.origin,s.origin);
    assert.deepEqual(later.grid,s.grid,'inherited street geometry persists across starting dates');
  }
});
