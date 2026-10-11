// A world saved at a day's end and loaded into a fresh realm goes on as the world that was saved (docs/WORLD-SAVE.md):
// the loaded realm captures equal to the saved one, saves again to the same bytes, and every day after is the same day
// in both: the world's graph (its closures' source text included), every RNG stream, the annals, the commands and the
// storage journal. Each realm is a worker thread of its own, as tools/engine-math.test.mjs grows one.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Worker} from 'node:worker_threads';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {inlineGameScript,captureExpression} from './simulation-boundary.mjs';
import {foundationFixtureExpression} from './castle-foundation-fixture.mjs';

const SOURCE=inlineGameScript(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'));
const N=37,K=55; // the save falls on no week, month or year: the journal's flushes, the month's reckoning and the year's turn come after it
const KEYS=process.env.FURLONG_WORLD_SAVE_KEYS==='1'; // name the keys of W that differ (slower)

const REALM=`{const {parentPort,workerData:{source,seed,fate,coast,N,K,doc,capture,keys,royal,startAD=850,foundation,foundationInit}}=require('node:worker_threads'),vm=require('node:vm'),{createHash}=require('node:crypto');
  for(const k of ['localStorage','sessionStorage','navigator'])Object.defineProperty(globalThis,k,{value:undefined,writable:true,configurable:true});
  Object.assign(globalThis,{FURLONG_HEADLESS:true,FURLONG_OPTIONS:{hash:'#s='+seed+'&f='+fate+'&c='+coast+'&y='+startAD},addEventListener(){},removeEventListener(){},requestAnimationFrame(){}});
  globalThis.__hashWorldGraph=graph=>{const digest=createHash('sha256'),feed=v=>{ // as tools/simulation-boundary.mjs hashes it
      if(v===null||typeof v!=='object'){digest.update(JSON.stringify(v));return;}
      if(Array.isArray(v)){digest.update('[');for(let i=0;i<v.length;i++){if(i)digest.update(',');feed(v[i]);}digest.update(']');return;}
      digest.update('{');const ks=Object.keys(v);for(let i=0;i<ks.length;i++){if(i)digest.update(',');digest.update(JSON.stringify(ks[i])+':');feed(v[ks[i]]);}digest.update('}');};
    feed(graph);return {sha256:digest.digest('hex'),nodes:graph.state.length,changes:graph.changes.length,functions:graph.code.length};};
  vm.runInThisContext(source,{filename:'index.html'});const R=c=>vm.runInThisContext(c),h=s=>createHash('sha256').update(s).digest('hex').slice(0,16);
  globalThis.__source=source;globalThis.__doc=doc;
  const journal='new OutcomeJournal(async e=>({chunk:e.chunk,first:e.first,last:e.last}),{maxPendingBytes:64*1024*1024})';
  const summary=()=>{const c=R(capture),o={day:c.day};for(const k of Object.keys(c))if(k!=='day'&&k!=='worldGraph'&&k!=='worldOnlyGraph')o[k]=h(JSON.stringify(c[k]));
    o.worldGraph=c.worldGraph.sha256;o.worldOnlyGraph=c.worldOnlyGraph.sha256;
    if(keys){o.keys=R('(()=>{const out={};for(const k of Object.keys(W)){const g=new HistoryGraph(),f=g.capture(W[k],{skipQueryScratch:true});out[k]=JSON.stringify([f.root,[...g.state].sort((x,y)=>x[0]-y[0]),g.code]);}return out;})()');for(const k in o.keys)o.keys[k]=h(o.keys[k]);}
    return o;};
  const day=()=>({day:R('W.clock.day'),rng:h(R('JSON.stringify(Object.entries(RS).map(([k,r])=>[k,r.state()]))')),annals:h(R('JSON.stringify(allLines)')),commands:h(R('JSON.stringify(JOURNAL)')),
    journal:R('STORAGE_OUTCOMES.journal.seq'),treasury:R('W.treasury'),people:R('W.settlements.reduce((t,s)=>t+s.pop,0)')});
  const play=async i=>{await R('STORAGE_OUTCOMES.wait()');if(R('simTick()')===false)throw Error('day '+i+' was blocked by the storage journal');if(i%8===0)await R('STORAGE_OUTCOMES.journal.flush()');};
  (async()=>{const out={},t0=process.cpuUsage();
    if(!doc){await R('startSimulation({seed:'+seed+',fate:'+fate+',coast:'+JSON.stringify(coast)+',startAD:'+startAD+',outcomeJournal:'+journal+'})');
      if(foundation)R(foundationInit);
      for(let i=1;i<=N;i++)await play(i);
      if(foundation){const q=R('W.projects.find(q=>q.type==="castle"&&q.si===3)');if(!q||!(q.worked>0)||q.done>=1)throw Error('Foundation save must contain paid unfinished work');out.foundationAt={worked:q.worked,days:q.days};}
      R(\`(()=>{const s=W.capital,P=folkIndex(),h=headsOf(s)[0],f=(s.furl||[]).find(f=>P.has(f.wk));if(!h||!f)throw Error('court save fixture needs a head and holding');
        f._arr=10;courtPlead(s,'arrears',f.wk,10,f,lordAcct(s));
        courtPlead(s,'farm',h.id,10000,{who:h.id,arr:10000,paid:0},lordAcct(s)); // a retired farm survives through its unpaid plea alone
        courtPlead(s,'entry',h.id,10000,f,lordAcct(s));
        const e=[lordAcct(s),10000,day()-360,true];h._owe.push(e);h._debt+=e[1];const p=courtPlead(s,'loan',h.id,e[1],e,e[0]);p.against=householdAccount(h);p.heard=true;
        courtRiot(s);courtFelony(s,h,{id:7});courtRobbery(s,{value:40,qty:8,good:'cloth',origin:0,dest:1,drv:h},{id:7},{x:s.pos.x,z:s.pos.z});
        courtAssize(s,h,40);const t=courtPlead(s,'trespass',h.id,20,householdAccount(h),lordAcct(s));t.against=householdAccount(h);return true;})()\`);
      R(\`(()=>{const s=W.capital,h=headsOf(s)[0],f=s.furl.find(f=>f.wk===h.id)||s.furl[0],right=courtHolding(f),lord=courtLord(s,f,stripLord(f,s));
        courtEnrol(s,'land',h,{field:f.k,ha:f.area/1e4,action:'admission',before:right,after:{...right},...lord});
        courtEnrol(s,'entry',h,{field:f.k,paid:0,assessed:10,left:10,...lord});
        courtEnrol(s,'merchet',h,{payer:h.id,payerName:folkName(h),partner:-1,partnerName:'',paid:0,assessed:10,...lord});
        courtEnrol(s,'heriot',h,{beast:'horses',qty:1,...lord});})()\`); // exercise every scalar witness shape across a native save, separately from its live pleas
      if(royal)R(\`(()=>{const s=W.capital,cap=W.settlements.indexOf(s),capability=institutionalCapability(s,"royalEyre");if(!capability.available)throw Error("royal save fixture needs actual inherited eyre learning: "+JSON.stringify(capability));
        const O=royalOfficers();if(!O)throw Error('royal fixture needs two actual eligible justices');const reserved=new Set(O.picked.map(p=>householdAccount(p))),h=headsOf(s).find(p=>!reserved.has(householdAccount(p))&&!p.office&&!p.outlawCampId&&!awayNow(p)&&!institutionalJobHeld(p)&&ageYrs(p)>=18&&!(s.royalPleas?.rows||[]).some(q=>q.kind==="felony"&&q.who===p.id&&q.camp===7));if(!h)throw Error('royal fixture needs an unoccupied adult without an earlier witnessed felony');reserved.add(householdAccount(h));
        const daily=O.fees.reduce((v,q)=>v+q,0),stake=foodYr()*100,H=royalHundreds(),plans=royalPlans([...H.values()].flat(),new Map()),towns=new Set([cap]);
        for(const[si,places]of H)if(plans.filter(q=>places.includes(W.settlements.indexOf(q.s))).reduce((v,q)=>v+(q.cash||0)+q.value,0)>(1+2*royalTravel(cap,si))*daily)towns.add(si);
        for(const si of W.houses[0]?.justice?.eyre?.trip?.towns||[])towns.add(si);
        const cost=[...towns].reduce((v,si)=>v+(1+2*royalTravel(cap,si))*daily,0),service=(30-day()%30)*daily; // real sittings and service through the next dated monthly cash close
        let left=Math.max(0,chestReserve(0)+stake+cost+service-means('crown'));const needed=left,donors=[],seen=new Set(reserved);
        const quote=(account,home,keep)=>{if(!(left>1e-8)||seen.has(account))return;seen.add(account);const spare=Math.min(roadSpare(account,home),Math.max(0,means(account)-keep)),amount=Math.min(left,spare);if(amount>1e-8){donors.push({account,keep,amount});left-=amount;}};
        for(let hi=1;hi<W.houses.length;hi++){const a=W.houses[hi],home=W.settlements[a.seat];if(a.exiled||a.extinct||!home||!notableById(a.head)?.alive)continue;quote(a,home,Math.max(chestReserve(hi),Math.max(6,a._hallN||0)*foodYr())+Math.max(0,a._debt||0));}
        for(const p of headsOf(s)){if(p.dead||p.si!==cap||p.outlawCampId||awayNow(p))continue;const a=householdAccount(p);let mouths=0;for(const q of a.members)if(!q.dead)mouths++;quote(a,s,Math.max(1,mouths)*foodYr()+rentDue(s,p)+Math.max(0,p._debt||0));}
        if(left>1e-8)throw Error('royal fixture lacks real donor surplus: '+JSON.stringify({needed,missing:left,donors:donors.map(q=>({name:acctLabel(q.account),keep:q.keep,amount:q.amount}))}));
        const total=()=>means('crown')+donors.reduce((v,q)=>v+means(q.account),0),before=total();for(const q of donors){const paid=transfer(q.account,'crown',q.amount,'royal justice endowment',s);if(Math.abs(paid-q.amount)>1e-8||means(q.account)+1e-8<q.keep)throw Error('royal endowment must preserve the actual donor reserve');}
        if(Math.abs(total()-before)>1e-7)throw Error('royal endowment must conserve actual coin');const paid=transfer('crown',h,stake,'royal save fixture stake',s);if(Math.abs(paid-stake)>1e-8||means('crown')+1e-8<chestReserve(0)+cost+service)throw Error('royal fixture stake must preserve the funded Crown reserve');h.outlawCampId=7;courtFelony(s,h,{id:7});
        const r=W.roads.find(r=>r.a===W.settlements.indexOf(s)||r.b===W.settlements.indexOf(s));if(r)courtNeglect(s,r,W.houses[1],40);
        if(!W.houses[0]?.justice?.eyre?.trip&&!royalEyreStart())throw Error('royal save fixture must fund a circuit');})()\`); // a native AD1200 opening inherits eyre and Roman-law knowledge; a calendar rewrite cannot supply either
      await R('STORAGE_OUTCOMES.flush()');out.at=summary(); // the save commits the journal: capture after the commit, as the document holds it
      const s0=process.cpuUsage();out.doc=await R('worldSave({source:__source})');out.saveCPU=process.cpuUsage(s0);parentPort.postMessage({doc:out.doc});}
    else{const l0=process.cpuUsage();await R('worldLoad(__doc,{source:__source,outcomeJournal:'+journal+'})');out.loadCPU=process.cpuUsage(l0);
      out.at=summary();out.doc=await R('worldSave({source:__source})');}
    out.royalAt=R('W.houses[0]?.justice?.eyre?.sessions||0');out.days=[];for(let i=N+1;i<=N+K;i++){await play(i);out.days.push(day());}
    out.end=summary();if(foundation)out.foundation=R('(()=>{const s=W.settlements[3],k=casKeep(s);return {keep:!!k,timber:!!k?.timberKeep,ward:!!s.ward,wallBuild:!!s.ward?.wallBuild,capturedKeep:s._lay.historyState().keep===k,pending:W.projects.some(q=>q.type==="castle"&&q.si===3)};})()');out.royal=R('W.houses[0]?.justice?.eyre?.sessions||0');out.cpu=process.cpuUsage(t0);parentPort.postMessage({done:out});})().catch(e=>parentPort.postMessage({error:String(e.stack||e)}));}`; // in a block: its names stay out of the game's global scope

// One realm: the played one posts its document as soon as it has saved, then plays on; a loaded one is given a document.
function realm(world,doc=null,onDoc=()=>{}){return new Promise((resolve,reject)=>{
  const w=new Worker(REALM,{eval:true,workerData:{source:SOURCE,...world,N,K:world.foundation?90:K,doc,capture:captureExpression(),keys:KEYS,foundationInit:foundationFixtureExpression}});
  w.on('message',m=>{if(m.error){reject(Error(m.error));w.terminate();}else if(m.doc)onDoc(m.doc);else if(m.done){resolve(m.done);w.terminate();}});
  w.once('error',reject);w.once('exit',code=>{if(code)reject(Error('realm exited '+code));});});}
const differ=(a,b)=>Object.keys({...a,...b}).filter(k=>k!=='keys'&&JSON.stringify(a[k])!==JSON.stringify(b[k])).concat(a.keys&&b.keys?Object.keys({...a.keys,...b.keys}).filter(k=>a.keys[k]!==b.keys[k]).map(k=>'W.'+k):[]);
const cpu=c=>((c.user+c.system)/1e6).toFixed(1)+' s';

for(const world of [{seed:42,fate:42,coast:'sea'},{seed:1001,fate:42,coast:'sea'},{seed:1001,fate:42,coast:'sea',royal:true,startAD:1200},{seed:1001,fate:42,coast:'sea',foundation:true}])
  test(`world ${world.seed} ${world.coast}${world.royal?' (native AD1200 eyre)':world.foundation?' (paid first castle)':''}: saved on day ${N} and loaded in a fresh realm, it goes on as the world that was saved`,async t=>{
    let loaded;const played=realm(world,null,doc=>{loaded=realm(world,doc);});
    const A=await played,B=await loaded;
    t.diagnostic(`document ${(A.doc.length/1e6).toFixed(2)} MB, gzipped ${(gzipSync(A.doc).length/1e6).toFixed(2)} MB; save ${cpu(A.saveCPU)} CPU, load ${cpu(B.loadCPU)} CPU; realms ${cpu(A.cpu)} and ${cpu(B.cpu)} CPU`);
    assert.equal(A.at.day,N);
    assert.deepEqual(differ(A.at,B.at),[],'the loaded world captures as the saved one');
    assert.equal(createHash('sha256').update(B.doc).digest('hex'),createHash('sha256').update(A.doc).digest('hex'),'saved again, the loaded world is the same document');
    for(let i=0;i<(world.foundation?90:K);i++)assert.deepEqual(B.days[i],A.days[i],`day ${N+1+i}`);
    assert.deepEqual(differ(A.end,B.end),[],`the worlds after ${K} more days`);
    if(world.foundation){assert.ok(A.foundationAt.worked>0);assert.deepEqual(A.foundation,{keep:true,timber:true,ward:true,wallBuild:false,capturedKeep:true,pending:false});assert.deepEqual(A.foundation,B.foundation);}
    if(world.royal){assert.equal(A.royalAt,B.royalAt);assert.ok(A.royal>A.royalAt,'the continued native fixture actually hears royal cases after the saved day');assert.equal(A.royal,B.royal);}
  });
