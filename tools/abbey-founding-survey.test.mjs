import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {parse} from './vendor/acorn/acorn.mjs';
import {inlineGameScript} from './simulation-boundary.mjs';

const source=inlineGameScript(fs.readFileSync(process.env.FURLONG_TEST_SOURCE||new URL('../index.html',import.meta.url),'utf8'));
const ast=parse(source,{ecmaVersion:'latest'}),functions=new Map(),variables=new Map(),classes=new Map();
for(const n of ast.body){if(n.type==='FunctionDeclaration')functions.set(n.id.name,n);else if(n.type==='ClassDeclaration')classes.set(n.id.name,n);else if(n.type==='VariableDeclaration')for(const d of n.declarations)if(d.id.type==='Identifier')variables.set(d.id.name,{kind:n.kind,node:d});}
const fn=n=>{const d=functions.get(n);assert.ok(d,'native function '+n);return source.slice(d.start,d.end);};
const constant=n=>{const d=variables.get(n);assert.ok(d,'native constant '+n);return d.kind+' '+source.slice(d.node.start,d.node.end)+';';};
const native=n=>functions.has(n)?fn(n):classes.has(n)?source.slice(classes.get(n).start,classes.get(n).end):constant(n);
const routeReaders=variables.get('ABBEY_ROUTE_SURVEY_NATIVE').node.init.arguments[0].properties.map(p=>p.key.name);
const foundReaders=variables.get('ABBEY_FOUND_SURVEY_CURRENT').node.init.body.properties.map(p=>p.key.name);
const approachReaders=variables.get('ABBEY_APPROACH_SURVEY_CURRENT').node.init.body.properties.map(p=>p.key.name);
const readerNames=[...new Set([...routeReaders,...foundReaders,...approachReaders])].filter(n=>n!=='abbeyFoundFundingFloor'||functions.has(n));
const layout=functions.get('layoutSettlement'),privateDeclarations=new Map();
for(const n of layout.body.body)if(n.type==='VariableDeclaration')for(const d of n.declarations)if(d.id.type==='Identifier')privateDeclarations.set(d.id.name,{kind:n.kind,node:d});
const privateConstant=n=>{const d=privateDeclarations.get(n);assert.ok(d,'native layout binding '+n);return d.kind+' '+source.slice(d.node.start,d.node.end)+';';};
const compoundSite=privateDeclarations.get('liveOps').node.init.properties.find(p=>p.key.name==='compoundSite');
assert.ok(compoundSite?.method);
const registration=layout.body.body.find(n=>n.type==='IfStatement'&&source.slice(n.start,n.end).startsWith("if(typeof ABBEY_FOUND_SURVEYS!=="));
assert.ok(registration,'registration belongs to native layout creation/load');
const counted=(n,insertion)=>{const d=functions.get(n),code=fn(n),at=d.body.start-d.start+1;return code.slice(0,at)+insertion+code.slice(at);};
const siteCode=fn('abbeySitePlan').replace('for(const pose of abbeySitePoses(f,spec.w,spec.d)){','for(const pose of abbeySitePoses(f,spec.w,spec.d)){count.poses.push([f.k,key,pose.x,pose.z,pose.rot]);count.contexts.push(C);');
assert.notEqual(siteCode,fn('abbeySitePlan'));

function setup({register=true,state='wild'}={}){
 const count={surveys:0,poses:[],contexts:[]},context=vm.createContext({count,btoa:s=>Buffer.from(s,'binary').toString('base64')});
 const run=s=>vm.runInContext(s,context),json=s=>JSON.parse(run('JSON.stringify('+s+')'));
 run(`const GRID=16,CELL=40,SIZE=640,SEA=0,SEA_SURFACE=.5,MOTTEH=9,BACKGROUND=null,KS=2,PLN=20,FN=1,FG=SIZE,MAPK=SIZE/6000;let HASH_STAMP=0;
 const s={name:'Pontepino',owner:0,kind:'village',pos:{x:0,z:0},pop:0,res:{farm:1},buildings:[],streets:[],places:[],remnants:[],furl:[],stores:{grain:10,timber:10},households:[],_gYield:.0001};
 const W={clock:{day:1},startAD:1200,_pl:1,_crNetA:10000,treasury:100000,houses:[{name:'Crown',might:1}],monarch:{alive:true,traits:['pious']},settlements:[s],roads:[],projects:[],abbeys:[],notables:[],water:new Uint8Array(GRID*GRID),h:new Float32Array(GRID*GRID).fill(20),dom:new Int16Array(GRID*GRID),land:{F:[],perHead:10000}};
 `);
 const constants=('ARCH GOODBASE NEED STORAGE_TYPES ABBEY_ORDERS TECH_RULES TECH_ALIASES TECH_KEYS LK LS ARABLE LANDV LU HH_FIELDS HOUSEHOLD_MEMBER_INDEXES HOUSEHOLD_NATIVE_MAP HOUSEHOLD_MAP_ENTRIES HOUSEHOLD_NATIVE_SET HOUSEHOLD_SET_VALUES HOUSEHOLD_SET_ITERATOR HOUSEHOLD_MAP_SIZE HOUSEHOLD_SET_SIZE HOUSEHOLD_MAP_METHODS HOUSEHOLD_SET_METHODS NOTABLE_INDEXES HISTORY_SCRATCH ABBEY_FOUND_SURVEYS').split(' ');
 run(constants.map(constant).join('\n'));
 const names=[...new Set([...readerNames,'abbeyFoundSurveyNative','abbeyFoundSurvey','abbeyRouteSurveyNative','castleFoundationReserved','seedStreams','sfc32'])].filter(n=>!constants.includes(n)&&n!=='ABBEY_APPROACH_SURVEY_CURRENT');
 run(names.map(n=>n==='abbeyApproachSurvey'?counted(n,'count.surveys++;'):n==='abbeySitePlan'?siteCode:native(n)).join('\n'));
 // Reconstruct the actual query closure, with the same private native readers
 // and registration statement. This runs no map generation or opening layout.
 run(`W.rivHash=makeHash(40);const C=s.pos,RHW=3.2,placed=makeHash(16),segH=makeHash(24);
 ${['cellOK','buildable','inPlace','wallSide','probe','onRoadway','onStreet','fits'].map(privateConstant).join('\n')}
 const liveOps={${source.slice(compoundSite.start,compoundSite.end)}};s._lay={fits,placed,segH,live:liveOps};
 ${register?source.slice(registration.start,registration.end):''}
 `);
 if(variables.has('OCCUPIED_GROUND_NATIVE'))run(constant('OCCUPIED_GROUND_NATIVE'));
 run(['ABBEY_APPROACH_SURVEY_CURRENT','ABBEY_APPROACH_SURVEY_NATIVE','ABBEY_ROUTE_SURVEY_NATIVE','ABBEY_FOUND_SURVEY_CURRENT','ABBEY_FOUND_SURVEY_NATIVE'].map(constant).join('\n'));
 run(native('HistoryGraph'));
 run(`const field={k:0,i:0,j:0,jx:.5,jz:.5,x:100,z:100,area:10000,dom:0,lord:0,core:-1,held:false,kind:LK.DEMESNE,state:LS.${state==='tilled'?'TILLED':'WILD'},own:'lord',wk:'lord',ten:'demesne'};s.furl.push(field);W.land.F.push(field);const RS=seedStreams(1001,42);const batch={s,hi:0,world:W,day:day(),house:s.owner,layout:s._lay,key:'abbey:0',context:null,closed:false};
 function graph(){const G=new HistoryGraph(),root=G.capture({world:W,rng:RS,hashStamp:HASH_STAMP});return{root,state:[...G.state],code:G.code};}
 `);
 return{run,json,count};
}
function attempt(r,shared=true){r.run(`var answers=['cistercian','benedictine','augustinian'].map(order=>abbeyFoundPlan(0,0,order,'m'${shared?',batch':''}));`);return r.json('answers');}

test('registered native failed orders share one survey and preserve every pose, graph and RNG',()=>{
 const hot=setup(),cold=setup();assert.equal(hot.run('abbeyFoundSurveyNative(s)'),true);
 assert.deepEqual(attempt(hot),attempt(cold,false));assert.deepEqual(Array.from(hot.count.poses,p=>Array.from(p)),Array.from(cold.count.poses,p=>Array.from(p)));
 assert.equal(hot.count.poses.length,24);assert.equal(hot.count.surveys,1);assert.equal(cold.count.surveys,3);
 assert.equal(new Set(hot.count.contexts).size,1);assert.equal(new Set(cold.count.contexts).size,3);
 assert.deepEqual(hot.json('graph()'),cold.json('graph()'));
 assert.equal(hot.run('W.abbeys.length+W.projects.length'),0);assert.equal(hot.run('W.treasury'),100000);
});

test('per-order grants stay distinct and all accepted native poses run in original order',()=>{
 const hot=setup({state:'tilled'}),cold=setup({state:'tilled'});
 assert.deepEqual(attempt(hot),attempt(cold,false));assert.deepEqual(Array.from(hot.count.poses,p=>Array.from(p)),Array.from(cold.count.poses,p=>Array.from(p)));
 assert.equal(hot.count.poses.length,16,'Cistercian charter rejects a worked grant');
 assert.equal(hot.count.surveys,1);assert.equal(cold.count.surveys,3);
 assert.deepEqual(hot.json('graph()'),cold.json('graph()'));
});

test('first-seen custom callbacks and unregistered layouts remain independent cold surveys',()=>{
 for(const custom of [false,true]){const r=setup({register:!custom});
  if(!custom)r.run('const nativeSite=liveOps.compoundSite;liveOps.compoundSite=function(...args){return nativeSite(...args);};');
  assert.equal(r.run('abbeyFoundSurveyNative(s)'),false);attempt(r);assert.equal(r.count.surveys,3);
  assert.equal(new Set(r.count.contexts).size,3);assert.equal(r.run('batch.closed&&batch.context===null'),true);
 }
});

test('registered closure, hashes and transitive query readers cannot be replaced or promoted',()=>{
 const mutations=["s._lay={...s._lay};","s._lay.live={...liveOps};","s._lay.fits=()=>true;","s._lay.placed=makeHash(16);","s._lay.segH=makeHash(24);","placed.near=(...args)=>[];","segH.near.cell=25;","const original=slopeAt;slopeAt=(...v)=>original(...v);","const original=lerpPt;lerpPt=(...v)=>original(...v);","const original=householdHerdBind;householdHerdBind=(...v)=>original(...v);","const original=castleFoundationReserved;castleFoundationReserved=(...v)=>original(...v);","const original=abbeyApproachPlan;abbeyApproachPlan=(...v)=>original(...v);"];
 for(const mutation of mutations){const r=setup();assert.equal(r.run('abbeyFoundSurveyNative(s)'),true);r.run(mutation);assert.equal(r.run('abbeyFoundSurveyNative(s)'),false,mutation);}
});

test('world, day, owner, layout, proposal and real actor-binding changes discard the holder',()=>{
 for(const mutation of ['W.clock.day++;','s.owner=1;','s._lay={...s._lay};',"batch.key='abbey:1';","const legacy={gn:'A',si:0,w:7};const H=newHousehold(legacy);bindHousehold(legacy,H);"]){const r=setup();r.run("var first=abbeyFoundSurvey(s,0,'abbey:0',batch);");r.run(mutation);r.run("var second=abbeyFoundSurvey(s,0,'abbey:0',batch);");assert.equal(r.run('first===second'),false,mutation);assert.equal(r.run('batch.closed&&batch.context===null'),true,mutation);assert.equal(r.count.surveys,2);}
});

test('custom early refusal invalidates a warm context even if the helper is later restored',()=>{
 const r=setup();r.run("abbeyFoundPlan(0,0,'cistercian','m',batch);const original=abbeyOrderAvailable;abbeyOrderAvailable=()=>false;");
 assert.equal(r.run("abbeyFoundPlan(0,0,'benedictine','m',batch)"),null);assert.equal(r.run('batch.closed&&batch.context===null'),true);
 r.run("abbeyOrderAvailable=original;abbeyFoundPlan(0,0,'augustinian','m',batch);");assert.equal(r.count.surveys,2);
});

test('only a fully certified native funding floor can reject an impossible route before poses',()=>{
 assert.ok(functions.has('abbeyFoundFundingFloor'),'load the actual native lower-bound helper');
 const r=setup();r.run(`W.roads.push({a:0,b:0,path:[{x:300,z:300},{x:310,z:300}]});
  const minimum=foodYr()*40+STORAGE_TYPES.grange.cost+(STORAGE_TYPES.grange.timber+32)*price(s,'timber'),church=constructionRecipe(s,foodYr()*12,360,40);
  W.treasury=hostTarget(0)*4+minimum+church.labour+church.timber*price(s,'timber')+1;`);
 assert.equal(r.run('abbeyFoundSurveyNative(s)'),true);assert.deepEqual(attempt(r),[null,null,null]);
 assert.equal(r.count.poses.length,0);assert.equal(r.count.surveys,1);assert.equal(r.run('W.abbeys.length+W.projects.length'),0);
 const cold=setup();cold.run('const originalFloor=abbeyFoundFundingFloor;let customFloorCalls=0;abbeyFoundFundingFloor=()=>{customFloorCalls++;return 1e9;};');
 attempt(cold);assert.equal(cold.count.poses.length,24);assert.equal(cold.run('customFloorCalls'),0);
});

test('native holder is discarded before commissioning and fresh final funding/title quote',()=>{
 const tick=fn('tickAbbeys'),found=fn('abbeyFound');
 assert.ok(tick.includes('if(P){batch.context=null;batch.closed=true;abbeyFound(P);'));
 assert.ok(tick.includes('batch.context=null;batch.closed=true;if(found)break;'));
 assert.ok(found.includes('fresh=abbeyFoundPlan(P.hi,P.si,P.order,P.sex)'));
 assert.ok(!found.includes('surveyBatch')&&!source.slice(functions.get('abbeyFoundSurvey').start,functions.get('abbeyFoundPlan').end).includes('W.abbeySurvey'));
 assert.ok(fn('abbeyFoundPlan').includes("const floor=native&&typeof abbeyFoundFundingFloor==='function'?abbeyFoundFundingFloor(s,f,minimum,price(s,'timber'),true):null;"));
 assert.ok(fn('abbeyFoundPlan').includes('if(Number.isFinite(floor)&&floor>means(who)-reserve)continue;'));
 assert.ok(fn('bindHousehold').indexOf('invalidateFolkIndex();')<fn('bindHousehold').indexOf('h.assets.herd'),'legacy raw herd access invalidates the roll first');
});
