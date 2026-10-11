import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {parse} from './vendor/acorn/acorn.mjs';
import {inlineGameScript} from './simulation-boundary.mjs';

const source=inlineGameScript(fs.readFileSync(process.env.FURLONG_TEST_SOURCE||new URL('../index.html',import.meta.url),'utf8'));
const ast=parse(source,{ecmaVersion:'latest'}),functions=new Map(),variables=new Map();
for(const node of ast.body){if(node.type==='FunctionDeclaration')functions.set(node.id.name,node);else if(node.type==='VariableDeclaration')for(const declaration of node.declarations)if(declaration.id.type==='Identifier')variables.set(declaration.id.name,{kind:node.kind,node:declaration});}
const fn=n=>{const node=functions.get(n);assert.ok(node,'missing actual '+n);return source.slice(node.start,node.end);};
const constant=n=>{const d=variables.get(n);assert.ok(d,'missing actual '+n);return d.kind+' '+source.slice(d.node.start,d.node.end)+';';};
const constants=['clamp','dist2d','GOODBASE','NEED','TECH_RULES','TECH_ALIASES','AD','year','day','foodYr'];
const helpers=['technologyKey','technologyCapability','constructionTechnologyRecipe','constructionRecipe','locW','serviceDoor','segDist','polyLen','abbeyApproachRecipe','abbeySitePoses','abbeyFoundFundingFloor','PL','price','price0'];
function realm(prepare=''){
 const C=vm.createContext({}),run=code=>vm.runInContext(code,C);
 run(`const s={owner:0,streets:[{pts:[{x:-500,z:300},{x:500,z:300}],hw:2}],px:{timber:3},technology:{adopted:{}}},f={k:0,x:0,z:0,area:12500};
  const W={clock:{day:50},startAD:1250,_pl:1,settlements:[s],roads:[],land:{F:[f]},technology:{known:{}}};const minimum=250;
 `);
 run(constants.map(constant).concat(helpers.map(fn)).join('\n'));
 if(prepare)run(prepare);
 return{C,run,json:code=>JSON.parse(run('JSON.stringify('+code+')'))};
}

test('actual eight church faces produce the optimistic recipe using the current timber price',()=>{
 const r=realm();
 r.run(`const faces=abbeySitePoses(f,12,22).map(p=>serviceDoor(p,0));const D=Math.max(0,300-Math.max(...faces.map(p=>p.z))-.1-1);const quote=constructionRecipe(s,foodYr()*12+D*.6*PL(),380+D/4,40+Math.max(.5,D*.005),0);const floor=abbeyFoundFundingFloor(s,f,minimum,price(s,'timber'),true);`);
 assert.equal(r.run('faces.length'),8);
 assert.equal(r.run('floor'),r.run('quote.labour+quote.timber*price(s,"timber")+minimum'));
 assert.ok(r.run('floor>minimum+foodYr()*12+40*price(s,"timber")'));
 r.run('s.px.timber=7;');
 assert.equal(r.run('abbeyFoundFundingFloor(s,f,minimum,price(s,"timber"),true)'),r.run('quote.labour+quote.timber*7+minimum'));
});

test('the floor is below all unchanged paid approach quotes, including endpoint tolerance and detours',()=>{
 for(const level of [.001,1,3])for(const barrow of [false,true]){
  const r=realm(`W._pl=${level};${barrow?"W.technology.known.wheelbarrow={day:0};s.technology.adopted.wheelbarrow={day:0};":''}`);
  r.run(`const before=JSON.stringify(W),posesBefore=JSON.stringify(abbeySitePoses(f,12,22)),floor=abbeyFoundFundingFloor(s,f,minimum,price(s,'timber'),true),spec={labour:foodYr()*12,days:360,timber:40,stone:0};let quotes=[];
   for(const pose of abbeySitePoses(f,12,22))for(const offset of [-.1,0,.1])for(const detour of [false,true]){
    const face=serviceDoor(pose,0),pad=serviceDoor(pose),landing=serviceDoor(pose,2),end={x:landing.x,z:300+offset},path=[face,pad,landing,...(detour?[{x:landing.x+50,z:landing.z+20}]:[]),end],Q=abbeyApproachRecipe(s,{access:{},path},spec);
    quotes.push(Q.labour+Q.timber*price(s,'timber')+minimum);
   }`);
  assert.equal(r.run('quotes.length'),48);
  assert.ok(r.run('quotes.every(gift=>floor<=gift)'));
  assert.equal(r.run('JSON.stringify(W)'),r.run('before'),'the actual pure readers leave the canonical fixture graph unchanged');
  assert.equal(r.run('JSON.stringify(abbeySitePoses(f,12,22))'),r.run('posesBefore'),'native pose order and values remain unchanged');
 }
});

test('paid wheelbarrow recipe applies its actual labour factor and real additional timber once',()=>{
 const r=realm();r.run(`const ordinary=abbeyFoundFundingFloor(s,f,minimum,price(s,'timber'),true);W.technology.known.wheelbarrow={day:0};const knownOnly=abbeyFoundFundingFloor(s,f,minimum,price(s,'timber'),true);s.technology.adopted.wheelbarrow={day:0};const equipped=abbeyFoundFundingFloor(s,f,minimum,price(s,'timber'),true),T=constructionTechnologyRecipe(s,'timber');`);
 assert.equal(r.run('ordinary'),r.run('knownOnly'),'realm knowledge alone gives no local equipment benefit');
 assert.equal(r.run('T.laborFactor'),.9);assert.equal(r.run('T.timber'),2);
 const labour=r.run('(ordinary-minimum-(40+Math.max(.5,(300-Math.max(...abbeySitePoses(f,12,22).map(p=>serviceDoor(p,0).z))-.1-1)*.005))*price(s,"timber"))');
 assert.equal(r.run('equipped'),r.run('ordinary')-labour*.1+6);
});

test('hidden, planned, gone and unreachable street segments remain in the endpoint superset',()=>{
 const r=realm();r.run(`const original=abbeyFoundFundingFloor(s,f,minimum,price(s,'timber'),true);s.streets.push({hidden:true,planned:true,planQ:9,gone:true,kind:'edge',pts:[{x:-200,z:11},{x:200,z:11}]});const generous=abbeyFoundFundingFloor(s,f,minimum,price(s,'timber'),true);`);
 assert.ok(r.run('generous<original'));
 assert.equal(r.run('generous'),r.run('constructionRecipe(s,foodYr()*12,380,40.5,0).labour+40.5*price(s,"timber")+minimum'));
});

test('actual incident highway open-path precedence is included and foreign highways cannot raise the floor',()=>{
 const r=realm();r.run(`s.streets=[];W.roads=[{a:1,b:2,path:[{x:-200,z:0},{x:200,z:0}]}];`);
 assert.equal(r.run('abbeyFoundFundingFloor(s,f,minimum,price(s,"timber"),true)'),null);
 r.run(`W.roads.push({a:0,b:1,path:[{x:-200,z:20},{x:200,z:20}],open:[{x:-200,z:400},{x:200,z:400}]});const open=abbeyFoundFundingFloor(s,f,minimum,price(s,'timber'),true);delete W.roads[1].open;const path=abbeyFoundFundingFloor(s,f,minimum,price(s,'timber'),true);W.roads[1].open=[];`);
 assert.ok(r.run('open>path'));
 assert.equal(r.run('abbeyFoundFundingFloor(s,f,minimum,price(s,"timber"),true)'),null,'an empty native open path does not fall back to the retained road path');
});

test('finite segment endpoints, rather than infinite street lines, set the native geometric lower bound',()=>{
 const r=realm();r.run(`s.streets=[{pts:[{x:150,z:100},{x:160,z:100}]}];const corner=abbeyFoundFundingFloor(s,f,minimum,price(s,'timber'),true);s.streets=[{pts:[{x:-500,z:100},{x:500,z:100}]}];const extended=abbeyFoundFundingFloor(s,f,minimum,price(s,'timber'),true);`);
 assert.ok(r.run('corner>extended'),'the additional distance to the actual finite endpoints increases the real recipe floor');
});

test('uncertified calls return unknown before invoking any geometry or recipe callback',()=>{
 const r=realm();r.run(`let callbacks=0;const original=abbeySitePoses;abbeySitePoses=()=>{callbacks++;throw Error('cold reader');};`);
 assert.equal(r.run('abbeyFoundFundingFloor(s,f,minimum,price(s,"timber"))'),null);
 assert.equal(r.run('abbeyFoundFundingFloor(s,f,minimum,price(s,"timber"),false)'),null);
 assert.equal(r.run('callbacks'),0);
 r.run('abbeySitePoses=original;');
 assert.ok(Number.isFinite(r.run('abbeyFoundFundingFloor(s,f,minimum,price(s,"timber"),true)')));
});

test('unsupported geometry, nonfinite costs and data accessors return unknown without invoking getters',()=>{
 const cases=[
  `f.x=NaN;`,`f.z=Infinity;`,`f.x=1048577;`,`f.area=0;`,`f.area=Infinity;`,
  `s.streets[0].pts[0].x='-500';`,`s.streets[0].pts[0].z=NaN;`,
  `s.streets[0].pts[0]=Object.create({x:-500,z:300});`,
  `s.streets[0].pts[0]={get x(){reads++;return -500;},z:300};`,
  `Object.defineProperty(s.streets[0].pts,0,{get(){reads++;return {x:-500,z:300};}});`,
  `Object.defineProperty(s.streets[0],'pts',{get(){reads++;return [{x:-500,z:300},{x:500,z:300}];}});`,
  `delete s.streets[0].pts[0];`,`s.streets[0].pts=Float64Array.of(-500,300,500,300);`,
  `W.roads.push({get a(){reads++;return 0;},b:1,path:[{x:0,z:0},{x:100,z:100}]});`,
  `W.roads.push({a:0,b:1,get open(){reads++;return null;},path:[]});`,
  `W._pl=Infinity;`,`W._pl=-1;`,`s.px.timber=NaN;`,`s.px.timber=0;`,
  `W.settlements=[];`,`s.streets=[];`
 ];
 for(const code of cases){const r=realm('let reads=0;'+code),before=r.run('reads');assert.equal(r.run('abbeyFoundFundingFloor(s,f,minimum,price(s,"timber"),true)'),null,code);assert.equal(r.run('reads'),before,code);}
 for(const minimum of [0,-1,NaN,Infinity]){const r=realm();r.C.input=minimum;assert.equal(r.run('abbeyFoundFundingFloor(s,f,input,price(s,"timber"),true)'),null);}
});
