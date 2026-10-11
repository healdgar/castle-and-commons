// Recovery authority is live; this capsule loads the actual native reader captures.
// No generated world, route search, account stub or rewritten reservation predicate.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {parse} from './vendor/acorn/acorn.mjs';
import {inlineGameScript} from './simulation-boundary.mjs';

const source=inlineGameScript(fs.readFileSync(process.env.FURLONG_TEST_SOURCE||new URL('../index.html',import.meta.url),'utf8'));
const ast=parse(source,{ecmaVersion:'latest'}),functions=new Map(),variables=new Map();
for(const n of ast.body){if(n.type==='FunctionDeclaration')functions.set(n.id.name,n);else if(n.type==='VariableDeclaration')for(const d of n.declarations)if(d.id.type==='Identifier')variables.set(d.id.name,{kind:n.kind,node:d});}
const native=n=>{const f=functions.get(n),v=variables.get(n);assert.ok(f||v,'actual native '+n);return f?source.slice(f.start,f.end):v.kind+' '+source.slice(v.node.start,v.node.end)+';';};
const approachReaders=variables.get('ABBEY_APPROACH_SURVEY_CURRENT').node.init.body.properties.map(p=>p.key.name);
const routeReaders=variables.get('ABBEY_ROUTE_SURVEY_NATIVE').node.init.arguments[0].properties.map(p=>p.key.name);
const readers=[...new Set([...approachReaders,...routeReaders,'abbeyRouteSurveyNative','abbeyRouteSurveyInputs','abbeyRouteTerrain'])];
function setup({capture=true}={}){
 const C=vm.createContext(),run=s=>vm.runInContext(s,C),json=s=>JSON.parse(run('JSON.stringify('+s+')'));
 run(`const SIZE=640,CELL=40,GRID=16;
 const s={owner:0,buildings:[],streets:[],_lay:{placed:{historyCells:new Map(),near:Object.assign(()=>[],{cell:40})}}},t={owner:1,buildings:[],streets:[],_lay:{placed:{historyCells:new Map(),near:Object.assign(()=>[],{cell:40})}}};
 const W={clock:{day:7},settlements:[s,t],projects:[],roads:[],randomState:{gen:[1,2,3,4],sim:[5,6,7,8]}};
 const q={type:'compound',adapter:'abbey',si:0,site:{f:{x:40,z:0,w:8,d:12,rot:0}}},root={type:'fabric',si:0,site:{f:{x:0,z:0,w:8,d:12,rot:0}},compoundRebuild:{compound:'abbey:0',key:'church',ownerId:'abbey:0'}};
 `);
 run(readers.map(native).join('\n'));
 if(capture)run(native('ABBEY_APPROACH_SURVEY_NATIVE')+'\n'+native('ABBEY_ROUTE_SURVEY_NATIVE'));
 return{run,json};
}
function corridor(r,expression='q'){
 r.run(`const C=abbeyApproachSurvey(s,${expression}),R={C,s,world:W,day:day(),house:s.owner,placed:s._lay.placed,size:SIZE,cell:CELL,terrain:C.terrain},a={house:s.owner,settlement:s,placed:s._lay.placed,requireRoadCrossing:true,waterClearance:2.3};`);
}

test('a retained repair root is cold before native geometry, including a not-yet-queued probe',()=>{
 const r=setup();assert.equal(r.run('abbeyApproachSurveyNative()&&abbeyRouteSurveyNative()'),true);
 r.run('q.compoundRebuild={compound:"abbey:0",key:"church",ownerId:"abbey:0"};');corridor(r);
 assert.equal(r.run('C.native'),false);assert.equal(r.run('C.coldRecovery'),true);
 assert.equal(r.run('C.projectIndex===undefined&&C.terrain===undefined'),true);
 assert.equal(r.run('abbeyCorridorInputs(R,a,true)'),false,'a certified route must still reject live recovery authority');
});

test('another active same-place repair makes a retained child use live authority',()=>{
 const r=setup();r.run('W.projects=[root,q];const before=JSON.stringify(W);');corridor(r);
 assert.equal(r.run('C.native'),false);assert.equal(r.run('C.coldRecovery'),true);
 for(const certified of[false,true])assert.equal(r.run(`abbeyCorridorInputs(R,a,${certified})`),false);
 assert.equal(r.run('JSON.stringify(W)===before'),true);
 assert.equal(r.run('Object.hasOwn(W,"coldRecovery")||Object.hasOwn(q,"coldRecovery")||Object.hasOwn(root,"coldRecovery")'),false,'the guard is local to this operation');
});

test('q-less founding retains native survey work even while a repair is pending',()=>{
 const r=setup();r.run('W.projects=[root];');corridor(r,'undefined');
 assert.equal(r.run('C.native'),true);assert.equal(r.run('C.coldRecovery===undefined'),true);
 assert.equal(r.run('C.projects.length'),1);assert.equal(r.run('C.projects[0].q===root'),true);
 assert.equal(r.run('abbeyCorridorInputs(R,a,false)&&abbeyCorridorInputs(R,a,true)'),true);
});

test('only the existing reservation eligibility makes a foreign repair relevant',()=>{
 const cases=[['root.si=1',true],['root.dead=true',true],['root.site=null',true],['W.projects=[q];q.compoundRebuild=undefined',true],['root.si=1;root.type="road"',false]];
 for(const[change,available]of cases){const r=setup();r.run('W.projects=[root,q];'+change+';');corridor(r);assert.equal(r.run('C.native'),available,change);assert.equal(r.run('abbeyCorridorInputs(R,a,true)'),available,change);}
});

test('fresh operation sees repair removal and retained geometry edits without a saved flag',()=>{
 const r=setup();r.run('W.projects=[root,q];const first=abbeyApproachSurvey(s,q);root.dead=true;const second=abbeyApproachSurvey(s,q);root.dead=false;delete root.compoundRebuild;root.site.f.x=90;const third=abbeyApproachSurvey(s,q);');
 assert.equal(r.run('first.coldRecovery'),true);assert.equal(r.run('second.native&&third.native'),true);
 assert.equal(r.run('third.projects[0].q===root&&third.projects[0].polys[0].P[0].x>80'),true);
});

test('normal certified terrain remains usable and a later coldRecovery flag cannot pass its fast tail',()=>{
 const r=setup();corridor(r);assert.equal(r.run('!!R.terrain&&abbeyCorridorInputs(R,a,false)'),true);
 r.run('R.C.coldRecovery=true;');assert.equal(r.run('abbeyCorridorInputs(R,a,true)'),false);
 r.run('delete R.C.coldRecovery;');assert.equal(r.run('abbeyCorridorInputs(R,a,true)'),true);
});

test('missing or replaced native reader captures retain the original conservative path',()=>{
 const absent=setup({capture:false});corridor(absent);assert.equal(absent.run('C.native'),false);
 const r=setup();r.run('const original=castleFoundationReserved;castleFoundationReserved=(...args)=>original(...args);');corridor(r);
 assert.equal(r.run('C.native'),false);assert.equal(r.run('C.coldRecovery===undefined'),true,'reader replacement is the existing cold policy');
 assert.equal(r.run('C.terrain===undefined&&C.projectIndex===undefined'),true);
});


test('a stale supplied survey loses retained terrain and world/authority truth after reader replacement',()=>{
 const r=setup();corridor(r);
 r.run(`const old=abbeyCorridorReady(s,C,null,q,0,C.terrain),T=C.terrain;
   old.memo.set('span:old',true);old.claims.set('old-field',true);T.memo.set('terrain-old',true);
   const before=JSON.stringify(W),original=castleFoundationReserved;castleFoundationReserved=(...args)=>original(...args);
   const fresh=abbeyCorridorReady(s,C,null,q,0,T);`);
 assert.equal(r.run('abbeyApproachSurveyNative()'),false);
 assert.equal(r.run('fresh!==old&&fresh.C!==C&&fresh.C.native===false'),true);
 assert.equal(r.run('fresh.terrain===null&&fresh.memo.abbeyTerrain===undefined'),true);
 assert.equal(r.run('fresh.memo.size===0&&fresh.claims.size===0'),true);
 assert.equal(r.run('fresh.memo.scopes!==T.memo.scopes&&fresh.memo.circuits!==T.memo.circuits'),true);
 assert.equal(r.run("old.memo.get('span:old')&&old.claims.get('old-field')&&T.memo.get('terrain-old')"),true,'discarding reuse does not mutate the caller’s old memo');
 assert.equal(r.run('JSON.stringify(W)===before'),true);
});

test('a current native previous corridor still reuses the same uninterrupted operation',()=>{
 const r=setup();corridor(r);r.run('const first=abbeyCorridorReady(s,C,null,q,0,C.terrain),second=abbeyCorridorReady(s,C,null,q,0,C.terrain);');
 assert.equal(r.run('first===second&&first.C===C&&first.terrain===C.terrain'),true);
});
