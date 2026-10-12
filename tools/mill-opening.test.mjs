import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Worker} from 'node:worker_threads';
import {inlineGameScript} from './simulation-boundary.mjs';

const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),source=inlineGameScript(html);
const realm=async(seed,coast,doc=null)=>{
  const worker=new Worker(`const {parentPort,workerData:{source,html,seed,coast,inspect,doc}}=require('node:worker_threads'),vm=require('node:vm');
    for(const k of ['localStorage','sessionStorage','navigator'])Object.defineProperty(globalThis,k,{value:undefined,writable:true,configurable:true});
    Object.assign(globalThis,{FURLONG_HEADLESS:true,FURLONG_OPTIONS:{hash:'#s='+seed+'&f=42&c='+coast+'&y=1066'},__html:html,__doc:doc,addEventListener(){},removeEventListener(){},requestAnimationFrame(){}});
    vm.runInThisContext(source,{filename:'index.html'});const run=code=>vm.runInThisContext(code);
    (async()=>{const journal='new OutcomeJournal(async e=>({chunk:e.chunk,first:e.first,last:e.last}),{maxPendingBytes:128*1024*1024})';
      if(doc)await run('worldLoad(__doc,{source:__html,outcomeJournal:'+journal+'})');
      else await run('startSimulation({seed:'+seed+',fate:42,coast:'+JSON.stringify(coast)+',startAD:1066,outcomeJournal:'+journal+'})');
      const before=run(inspect);
      const resaveSame=doc?Buffer.from(await run('worldSave({source:__html})')).equals(Buffer.from(doc)):null;
      for(let i=0;i<(doc?1:3);i++){await run('STORAGE_OUTCOMES.wait()');if(run('simTick()')===false)throw Error('Native mill tick blocked');}
      parentPort.postMessage({before,day:run('day()'),works:run('W.settlements.some(s=>waterMill(s))'),resaveSame,doc:seed===1001&&!doc?await run('worldSave({source:__html})'):null});
    })().catch(error=>{throw error;});`,{eval:true,workerData:{source,html,seed,coast,doc,inspect:INSPECT}});
  try{return await new Promise((resolve,reject)=>{worker.once('message',resolve);worker.once('error',reject);worker.once('exit',code=>reject(Error('Native mill worker exited '+code)));});}
  finally{await worker.terminate();}
};
const INSPECT=`(()=>({ponds:W.settlements.filter(s=>s.lake&&!s.lake.ownerId).length,mills:W.settlements.flatMap(s=>s.buildings.filter(b=>b.arch==='mill'&&!b.removed).map(b=>{
  const w=b.millWater;return{name:s.name,works:waterMill(s),wheelWet:!!w&&!!riverAt(w.x,w.z,0),parcelDry:obbCorners(b.x,b.z,b.w,b.d,b.rot).every(p=>!riverAt(p.x,p.z,0)&&!lakeAt(s,p.x,p.z,0)),feed:millDrive(s,b).feed};})),damAnnals:allLines.filter(l=>String(l.text||l).includes('The river was dammed above the town')).length}))()`;
for(const [seed,coast]of [[1001,'sea'],[2002,'land']])test(`native ${seed}:${coast} river mills operate without speculative valley dams`,async()=>{
  const {before,day,works,doc}=await realm(seed,coast);
  assert.equal(before.ponds,0);assert.equal(before.damAnnals,0);assert.ok(before.mills.length>0,'actual native river mills were founded');
  for(const m of before.mills){assert.ok(m.works,m.name+' grinds without a pond');assert.ok(m.wheelWet,m.name+' has a wheel in flowing water');assert.ok(m.parcelDry,m.name+' has a dry mill parcel');assert.equal(m.feed,null,'the direct river wheel needs no raised reservoir feeder');}
  assert.equal(day,3);assert.ok(works,'river mills remain operative after native ticks');
  if(doc){const restored=await realm(seed,coast,doc);assert.equal(restored.resaveSame,true,'the native saved realm restores and resaves byte-for-byte');assert.equal(restored.before.ponds,0);assert.equal(restored.before.mills.length,before.mills.length);assert.equal(restored.day,4);assert.ok(restored.works,'the restored mills continue operating');}
});
