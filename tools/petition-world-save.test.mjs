// The real binary world codec and native petition makers, in tiny worlds. No
// generation, substitute serializer, callback evaluation or simulation tick.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {parse} from './vendor/acorn/acorn.mjs';
import {inlineGameScript,contextFor} from './simulation-boundary.mjs';

const source=inlineGameScript(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'));
const identity='a'.repeat(64),read=(c,s)=>vm.runInContext(s,c);
function realm(open=true){
 const c=contextFor(source,'#s=1001&f=42&c=sea&y=1200');
 if(open)read(c,`(()=>{
  SEED=1001;FATE=42;START_AD=1200;RS=seedStreams(SEED,FATE);
  const s={name:'Testford',pos:{x:0,z:0},owner:0,pop:200,unrest:30,prosperity:60,stores:{grain:0},folk:[],buildings:[]};
  W={name:'The test realm',clock:{day:626},startAD:1200,settlements:[s],capital:s,
   houses:[{name:'The Crown',seat:0,gold:1000,loyalty:60},{name:'The March',seat:0,gold:1000,loyalty:50}],
   households:new Map(),notables:[],armies:[],roads:[],projects:[],petitions:[],treasury:2000,legitimacy:60,
   player:{on:true,house:0,pause:false,legacy:7,amb:{},since:0}};
 })()`);
 return c;
}
const save=c=>read(c,`worldSave({sourceSHA256:${JSON.stringify(identity)}})`);
async function roundTrip(c){
 const doc=await save(c),loaded=realm(false);loaded.__doc=doc;
 await read(loaded,`worldLoad(__doc,{sourceSHA256:${JSON.stringify(identity)}})`);
 assert.deepEqual(await save(loaded),doc,'a loaded petition world re-saves byte for byte');
 return loaded;
}
const state=c=>JSON.parse(read(c,`JSON.stringify({world:W,annals:allLines,rng:Object.fromEntries(Object.entries(RS).map(([k,r])=>[k,r.state()]))},(k,v)=>typeof v==='function'?Function.prototype.toString.call(v):v)`));

function visit(n,f){if(!n||typeof n!=='object')return;f(n);for(const[k,v]of Object.entries(n)){if(Array.isArray(v))for(const x of v)visit(x,f);else if(v&&typeof v==='object')visit(v,f);}}
test('all native queued callbacks and district acceptance use named makers',()=>{
 const ast=parse(source,{ecmaVersion:'latest'});let actions=0,ai=0,accept=0,dragon=0;
 visit(ast,n=>{
  if(n.type==='Property'&&['act','onAccept'].includes(n.key.name)){
   const v=n.value;
   assert.ok(v.type==='CallExpression'&&v.callee.name==='petitionClosure'||n.key.name==='act'&&v.type==='Identifier'&&['swear','tribute'].includes(v.name),'native callback must be made with its actual context');
   n.key.name==='act'?actions++:accept++;
  }
  if(n.type==='Property'&&n.key.name==='ai'&&n.value.type==='CallExpression'&&n.value.callee.name==='petitionClosure')ai++;
  if(n.type==='Property'&&n.key.name==='ai')assert.notEqual(n.value.type,'ArrowFunctionExpression','queued AI must also be reconstructed');
  if(n.type==='VariableDeclarator'&&['swear','tribute'].includes(n.id?.name)){assert.equal(n.init.callee?.name,'petitionClosure');dragon++;}
 });
 assert.deepEqual({actions,ai,accept,dragon},{actions:45,ai:1,accept:1,dragon:2});
});

test('every maker survives a real save/load with exact shared actor identities and untouched dice',async()=>{
 const c=realm();
 read(c,`(()=>{
  W.fixtureActors=Array.from({length:6},(_,id)=>({id,name:'actor '+id,ledger:new Map([[id,id+.5]])}));
  const before=JSON.stringify(Object.fromEntries(Object.entries(RS).map(([k,r])=>[k,r.state()])));
  W.petitions=Object.entries(PETITION_MAKERS).map(([key,make])=>({key,opts:[{act:petitionClosure(key,...W.fixtureActors.slice(0,make.length))}]}));
  if(before!==JSON.stringify(Object.fromEntries(Object.entries(RS).map(([k,r])=>[k,r.state()]))))throw Error('Making callbacks threw dice');
 })()`);
 assert.equal(read(c,'W.petitions.length'),43);
 const loaded=await roundTrip(c);
 assert.deepEqual(state(loaded),state(c));
 assert.equal(read(loaded,`W.petitions.every(p=>{const m=PETITION_CLOSURES.get(p.opts[0].act);return m.kind===p.key&&m.args.every((a,i)=>a===W.fixtureActors[i]);})`),true);
});

test('native famine and plague petitions keep both decisions tied to the same live town',async()=>{
 const c=realm();read(c,'famineStrikes(W.capital);plagueArrives(W.capital)');
 const loaded=await roundTrip(c);
 assert.equal(read(loaded,`W.petitions.every(p=>PETITION_CLOSURES.get(p.opts[0].act).args[0]===W.capital)`),true);
 assert.equal(read(loaded,`PETITION_CLOSURES.get(W.petitions[0].opts[1].act).args[0]===W.capital`),true);
 // Change the live town after the save: callbacks must use that town, not a copied
 // opening balance. Actual native actions and food/annal hooks run in both realms.
 const answer=`W.capital.pop=240;W.capital.unrest=47;W.petitions[0].opts[0].act();W.petitions[0].opts[1].act();W.petitions[1].opts[0].act()`;
 read(c,answer);read(loaded,answer);
 assert.equal(read(loaded,'W.capital.stores.grain'),144);
 assert.equal(read(loaded,'W.capital.unrest'),42);
 assert.equal(read(loaded,'W.capital.quarantineUntil'),716);
 assert.deepEqual(state(loaded),state(c));
});

test('private shared persuasion requests retain their nested maker and current point through re-saves',async()=>{
 const c=realm();
 read(c,`(()=>{
  const s=W.capital,p={x:11,z:12},req={hi:1,si:0,pos:p,title:'Clear a quarter',text:'A real request',value:200};
  req.onAccept=petitionClosure('clearAccept',0,p,30,1,s);
  persuade(req);
 })()`);
 const loaded=await roundTrip(c);
 assert.equal(read(loaded,`(()=>{const options=W.petitions[0].opts.map(o=>PETITION_CLOSURES.get(o.act));const req=options[0].args[2];return options.every(o=>o.args[2]===req&&o.args[3]===W.houses[1])&&PETITION_CLOSURES.get(req.onAccept).args[1]===req.pos&&PETITION_CLOSURES.get(req.onAccept).args[4]===W.capital;})()`),true);
 const answer=`(()=>{const options=W.petitions[0].opts,m=PETITION_CLOSURES.get(options[0].act),req=m.args[2];req.pos.x=41;req.onAccept();options.at(-1).act();})()`;
 read(c,answer);read(loaded,answer);
 assert.deepEqual(JSON.parse(read(loaded,'JSON.stringify(W.projects[0])')),{type:'clear',si:0,x:41,z:12,r:30,next:646,gone:0,payer:1});
 assert.deepEqual(state(loaded),state(c));
 await roundTrip(loaded);
});

test('unknown native closures and changed maker source still fail closed',async()=>{
 const c=realm();read(c,`W.petitions.push({key:'unknown',opts:[{act:()=>{W.legitimacy++}}]})`);
 await assert.rejects(save(c),/A closure no maker makes again.*petitions\[0\].opts\[0\].act/);
 const known=realm();read(known,'famineStrikes(W.capital)');const doc=await save(known),loaded=realm(false);loaded.__doc=doc;
 read(loaded,`PETITION_MAKERS.famineOpen=s=>()=>{s.unrest=0}`);
 await assert.rejects(read(loaded,`worldLoad(__doc,{sourceSHA256:${JSON.stringify(identity)}})`),/A closure made again differs from the one saved/);
});
