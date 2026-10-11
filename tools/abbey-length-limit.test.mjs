import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {parse} from './vendor/acorn/acorn.mjs';
import {inlineGameScript} from './simulation-boundary.mjs';

const source=inlineGameScript(fs.readFileSync(process.env.FURLONG_TEST_SOURCE||new URL('../index.html',import.meta.url),'utf8'));
const ast=parse(source,{ecmaVersion:'latest'}),functions=new Map(),variables=new Map();
for(const node of ast.body){if(node.type==='FunctionDeclaration')functions.set(node.id.name,node);else if(node.type==='VariableDeclaration')for(const d of node.declarations)if(d.id.type==='Identifier')variables.set(d.id.name,{kind:node.kind,node:d});}
const fn=n=>{const node=functions.get(n);assert.ok(node,'missing actual '+n);return source.slice(node.start,node.end);};
const constant=n=>{const d=variables.get(n);assert.ok(d,'missing actual '+n);return d.kind+' '+source.slice(d.node.start,d.node.end)+';';};
function realm(prepare=''){
 const C=vm.createContext({}),run=code=>vm.runInContext(code,C);
 run(`const s={owner:0,px:{timber:3},technology:{adopted:{}}},W={clock:{day:67},startAD:1250,_pl:1,settlements:[s],technology:{known:{}}};let minimum=250;`);
 run(['GOODBASE','NEED','TECH_RULES','TECH_ALIASES','AD','year','day','foodYr','dist2d'].map(constant).concat(['technologyKey','technologyCapability','constructionTechnologyRecipe','constructionRecipe','abbeyFoundLengthLimit','abbeyApproachRecipe','polyLen','locW','serviceDoor','PL','price','price0'].map(fn)).join('\n'));
 run(`function gift(length){const Q=constructionRecipe(s,foodYr()*12+length*.6*PL(),380+length/4,40+Math.max(.5,length*.005),0);return Q.labour+Q.timber*price(s,'timber')+minimum;}`);
 if(prepare)run(prepare);
 return{C,run};
}
function adjacent(value,up){
 const bytes=new ArrayBuffer(8),view=new DataView(bytes);view.setFloat64(0,value);let bits=view.getBigUint64(0);bits+=(value>=0)===up?1n:-1n;view.setBigUint64(0,bits);return view.getFloat64(0);
}

test('the actual piecewise recipe confirms the whole-length bound across its 100m timber knee',()=>{
 for(const length of [0,2,25,99,100,100.00000001,101,500,10000]){
  const r=realm();r.C.length=length;r.run(`const available=gift(length),U=abbeyFoundLengthLimit(s,available,minimum,price(s,'timber'),true);`);
  const U=r.run('U');assert.ok(Number.isFinite(U),String(length));assert.ok(U>=length&&U<length+1.00001,String(length));
  assert.ok(r.run('gift(U)>available'),'actual zero-licence native quote certifies the returned bound');
  r.C.samples=[0,2,25,99,100,100.00000001,101,length,U,U+1,U*1.1];
  assert.equal(r.run('samples.every(L=>gift(L)>available||L<U)'),true,'no affordable sampled length reaches the limit');
  r.run('const T=constructionTechnologyRecipe(s,"timber");');
  assert.equal(r.run('T.laborFactor'),1);assert.equal(r.run('T.timber'),0);
 }
});

test('actual-recipe affordability is preserved immediately below, at and above floating budget boundaries',()=>{
 for(const level of [.001,1,3,1e-9,1e9])for(const timberPrice of [.1,3,1000])for(const length of [2,99.999999999,100,100.000000001,173.5,10000]){
  const r=realm(`W._pl=${level};s.px.timber=${timberPrice};`);r.C.length=length;const gift=r.run('gift(length)');
  for(const available of [adjacent(gift,false),gift,adjacent(gift,true)]){
   r.C.available=available;const U=r.run('abbeyFoundLengthLimit(s,available,minimum,price(s,"timber"),true)');
   if(U===null)continue;assert.ok(Number.isFinite(U));r.C.U=U;
   assert.ok(r.run('gift(U)>available'));
   r.C.samples=[0,2,99.999999999,100,100.000000001,length,adjacent(U,false),U,adjacent(U,true),U+1];
   assert.equal(r.run('samples.every(L=>gift(L)>available||L<U)'),true,JSON.stringify({level,timberPrice,length,available,U}));
  }
 }
});

test('local paid wheelbarrow equipment is included once while masonry-only crane adoption leaves the timber church recipe unchanged',()=>{
 const r=realm();r.run(`const available=gift(400),before=JSON.stringify(W),plain=abbeyFoundLengthLimit(s,available,minimum,price(s,'timber'),true);`);
 assert.equal(r.run('JSON.stringify(W)'),r.run('before'),'this query writes no canonical world state');
 r.run(`W.technology.known.wheelbarrow={day:0};const known=abbeyFoundLengthLimit(s,available,minimum,price(s,'timber'),true);s.technology.adopted.wheelbarrow={day:0};const barrow=abbeyFoundLengthLimit(s,available,minimum,price(s,'timber'),true),T=constructionTechnologyRecipe(s,'timber');`);
 assert.equal(r.run('known'),r.run('plain'));assert.equal(r.run('T.laborFactor'),.9);assert.equal(r.run('T.timber'),2);assert.ok(r.run('barrow>plain'));
 assert.ok(r.run('gift(barrow)>available'));
 r.run(`W.technology.known.crane={day:0};s.technology.adopted.crane={day:0};const crane=abbeyFoundLengthLimit(s,available,minimum,price(s,'timber'),true);`);
 assert.equal(r.run('crane'),r.run('barrow'),'a timber recipe buys no unused masonry crane');
 r.run(`delete s.technology.adopted.wheelbarrow;const craneOnly=abbeyFoundLengthLimit(s,available,minimum,price(s,'timber'),true);`);
 assert.equal(r.run('craneOnly'),r.run('plain'));
});

test('the current timber price changes affordable length without changing the actual funding or final recipe',()=>{
 const r=realm();r.run(`const available=gift(400),cheap=abbeyFoundLengthLimit(s,available,minimum,price(s,'timber'),true);s.px.timber=9;const dear=abbeyFoundLengthLimit(s,available,minimum,price(s,'timber'),true);`);
 assert.ok(r.run('dear<cheap'));assert.ok(r.run('gift(dear)>available'));
 r.C.samples=[0,2,20,100,150,200,300,400];assert.equal(r.run('samples.every(L=>gift(L)>available||L<dear)'),true);
});

test('the maximum covers the full retained door-prefix-plus-route quote rather than a geometric search radius',()=>{
 const r=realm();r.run(`const f={x:17,z:-23,w:12,d:22,rot:.3},face=serviceDoor(f,0),pad=serviceDoor(f),landing=serviceDoor(f,2),prefix=[face,pad,landing],stub=polyLen(prefix),end={x:landing.x,z:landing.z+200},path=[...prefix,end],spec={labour:foodYr()*12,days:360,timber:40,stone:0},Q=abbeyApproachRecipe(s,{access:{},path},spec),available=Q.labour+Q.timber*price(s,'timber')+minimum,U=abbeyFoundLengthLimit(s,available,minimum,price(s,'timber'),true);`);
 assert.ok(Math.abs(r.run('stub')-2)<1e-12);
 assert.ok(r.run('U>polyLen(path)&&U<polyLen(path)+1.00001'));
 assert.ok(r.run('gift(U)>available'));
});

test('unaffordable zero-length work yields only an outward limit and cancelled floating confirmation returns unknown',()=>{
 const r=realm();r.run(`const available=gift(0)-1,U=abbeyFoundLengthLimit(s,available,minimum,price(s,'timber'),true);`);
 assert.equal(r.run('U'),1);assert.ok(r.run('gift(0)>available&&gift(U)>available'));
 r.run('minimum=1e25;');
 assert.equal(r.run('abbeyFoundLengthLimit(s,gift(100),minimum,price(s,"timber"),true)'),null,'an inverted result is never trusted when the actual finite quote rounds back onto available funds');
});

test('uncertified calls are neutral before invoking recipe or state callbacks',()=>{
 const r=realm();r.run(`let calls=0;constructionTechnologyRecipe=()=>{calls++;throw Error('cold recipe');};Object.defineProperty(W,'_pl',{get(){calls++;throw Error('cold price level');}});`);
 assert.equal(r.run('abbeyFoundLengthLimit(s,1000,minimum,3)'),null);assert.equal(r.run('abbeyFoundLengthLimit(s,1000,minimum,3,false)'),null);assert.equal(r.run('calls'),0);
});

test('unsupported own-data state and nonfinite numeric inputs return unknown without extra getter callbacks',()=>{
 const cases=[
  `W._pl=NaN;`,`W._pl=Infinity;`,`W._pl=0;`,`W._pl=-1;`,`W.clock.day=NaN;`,`W.startAD=Infinity;`,
  `Object.defineProperty(W,'_pl',{get(){reads++;return 1;}});`,
  `Object.defineProperty(W.clock,'day',{get(){reads++;return 67;}});`,
  `Object.defineProperty(s,'technology',{get(){reads++;return {adopted:{}};}});`,
  `Object.defineProperty(W.technology,'known',{get(){reads++;return {};}});`,
  `Object.defineProperty(s.technology.adopted,'wheelbarrow',{get(){reads++;return {day:0};}});`,
  `W.technology.known=Object.create({wheelbarrow:{day:0}});`,`delete W._pl;`,`delete s.technology;`
 ];
 for(const code of cases){const r=realm('let reads=0;'+code);assert.equal(r.run('abbeyFoundLengthLimit(s,1000,minimum,3,true)'),null,code);assert.equal(r.run('reads'),0,code);}
 for(const [name,values]of [['available',[NaN,Infinity,-Infinity]],['minimum',[NaN,Infinity,0,-1]],['timberPrice',[NaN,Infinity,0,-1]]])for(const value of values){const r=realm();r.C.value=value;assert.equal(r.run(`abbeyFoundLengthLimit(s,${name==='available'?'value':'1000'},${name==='minimum'?'value':'minimum'},${name==='timberPrice'?'value':'3'},true)`),null,name+': '+value);}
 const r=realm('W._pl=1e308;');assert.equal(r.run('abbeyFoundLengthLimit(s,1e308,minimum,3,true)'),null,'overflow cannot authorize a derived limit');
});
