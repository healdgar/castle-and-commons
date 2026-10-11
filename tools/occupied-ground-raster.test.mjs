import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const html=fs.readFileSync(process.env.FURLONG_TEST_SOURCE||new URL('../index.html',import.meta.url),'utf8');
const fn=n=>{const m=html.match(new RegExp('^function '+n+'\\b[\\s\\S]*?(?=^function |^const |^/\\*|$(?![\\s\\S]))','m'));assert.ok(m,n);return m[0];};
const constant=n=>{const m=html.match(new RegExp('^const '+n+'=.*$','m'));assert.ok(m,n);return m[0];};
// The previous production rectangle scan, unchanged apart from its name.
const rectangleSource=String.raw`function rectangleGroundCells(P){ // exact intersections with the native CELL-wide agricultural-mask raster
  if(!P?.length)return [];let x0=Infinity,x1=-Infinity,z0=Infinity,z1=-Infinity;const cells=[];
  for(const q of P){x0=Math.min(x0,q.x);x1=Math.max(x1,q.x);z0=Math.min(z0,q.z);z1=Math.max(z1,q.z);}
  const half=CELL/2,c0=toCell(x0-half),c1=toCell(x1+half),r0=toCell(z0-half),r1=toCell(z1+half),hit=(cx,cz)=>{const ax=cellX(cx)-half,bx=cellX(cx)+half,az=cellZ(cz)-half,bz=cellZ(cz)+half;if(!occupiedGroundBoxMayHit(P,ax,bx,az,bz))return false;const C=[[ax,az],[bx,az],[bx,bz],[ax,bz]];
    if(C.some(([x,z])=>inPolyXZ(P,x,z))||P.some(q=>q.x>=ax&&q.x<=bx&&q.z>=az&&q.z<=bz))return true;
    for(let k=0;k<P.length;k++){const a=P[k],b=P[(k+1)%P.length];for(let j=0;j<4;j++){const u={x:C[j][0],z:C[j][1]},v={x:C[(j+1)%4][0],z:C[(j+1)%4][1]};if(segSegDist(a,b,u,v)<0.01)return true;}}return false;};
  for(let cz=Math.max(0,r0);cz<=Math.min(GRID-1,r1);cz++)for(let cx=Math.max(0,c0);cx<=Math.min(GRID-1,c1);cx++)if(hit(cx,cz))cells.push(cIdx(cx,cz));return cells;
}`;
function realm(cell=30,grid=5,{capture=true,replaceable=[]}={}){
 const GRID=grid,SIZE=GRID*cell,clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),cellX=x=>x*cell-SIZE/2,toCell=x=>clamp(Math.round((x+SIZE/2)/cell),0,GRID-1),F=[{id:0},{id:1}],W={land:{mask:new Uint8Array(GRID*GRID*4)}};
 for(let i=0;i<GRID*GRID;i++)W.land.mask[i*4]=1;
 const reads={candidates:0,edges:0,boxes:0},ctx=vm.createContext({GRID,SIZE,CELL:cell,W,F,reads,furlongAt:(x,z)=>x<0?F[0]:F[1]});
 // Count only entries into actual predicates; their source bodies remain intact.
 const counted=(code,key)=>{const at=code.indexOf('{');return code.slice(0,at+1)+'reads.'+key+'++;'+code.slice(at+1);};
 const raster=code=>{assert.ok(code.includes('hit=(cx,cz)=>{'));return code.replace('hit=(cx,cz)=>{','hit=(cx,cz)=>{reads.candidates++;');};
 vm.runInContext(['clamp','cIdx','cellX','cellZ','toCell'].map(n=>replaceable.includes(n)?constant(n).replace(/^const /,'let '):constant(n)).concat([
  counted(fn('occupiedGroundBoxMayHit'),'boxes'),fn('inPolyXZ'),fn('segDist'),counted(fn('segSegDist'),'edges'),fn('obbCorners'),
  raster(fn('occupiedGroundCells')),raster(rectangleSource),fn('occupiedGroundAreas'),...(capture?[constant('OCCUPIED_GROUND_NATIVE')]:[])
 ]).join('\n'),ctx);
 const run=code=>vm.runInContext(code,ctx);
 return{ctx,W,F,cellX,toCell,reads,run,compare(code){run(code);reads.candidates=reads.edges=reads.boxes=0;const before=Array.from(run('rectangleGroundCells(P)')),old={...reads};reads.candidates=reads.edges=reads.boxes=0;const after=Array.from(run('occupiedGroundCells(P)')),current={...reads};assert.deepEqual(after,before);return{before,after,old,current};}};
}
for(const cell of [15,30,6000/220])test('native mask cell width '+cell+' includes footprints near both cell edges',()=>{const r=realm(cell),x=r.cellX(2)+cell/2-0.5,z=r.cellX(2);r.ctx.P=[{x:x-0.1,z:z-0.1},{x:x+0.1,z:z-0.1},{x:x+0.1,z:z+0.1},{x:x-0.1,z:z+0.1}];assert.ok(Array.from(r.run('occupiedGroundCells(P)')).includes(12));r.ctx.P=r.ctx.P.map(p=>({...p,x:p.x-cell+1}));assert.ok(Array.from(r.run('occupiedGroundCells(P)')).includes(12));});
test('a native edge-crossing footprint claims both actual cells at non15 spacing',()=>{const r=realm(30),x=r.cellX(2)+15,z=r.cellX(2);r.ctx.P=[{x:x-0.2,z:z-0.2},{x:x+0.2,z:z-0.2},{x:x+0.2,z:z+0.2},{x:x-0.2,z:z+0.2}];assert.deepEqual(Array.from(r.run('occupiedGroundCells(P)')),[12,13]);});
test('survey-area loss counts every actual 15m sample once, split across titled parcels',()=>{const r=realm(30);r.ctx.cells=[12,12,13];const actual=r.run('occupiedGroundAreas(cells)'),expected=new Map();for(let j=0;j<150/15;j++)for(let i=0;i<150/15;i++){const x=-75+7.5+i*15,z=-75+7.5+j*15,c=r.toCell(z)*5+r.toCell(x);if(c===12||c===13){const f=x<0?r.F[0]:r.F[1];expected.set(f,(expected.get(f)||0)+225);}}assert.equal(actual.size,expected.size);for(const[f,v]of expected)assert.equal(actual.get(f),v);assert.equal([...actual.values()].reduce((n,v)=>n+v,0),1800);r.W.land.mask[12*4+2]=255;assert.equal([...r.run('occupiedGroundAreas(cells)').values()].reduce((n,v)=>n+v,0),900);});


test('long diagonal native corridors keep ordered cells while visiting row strips instead of their bounding rectangles',t=>{
 for(const [cell,grid]of [[15,80],[6000/220,80],[9000/220,80]])for(const angle of [Math.PI/4,-Math.PI/4,Math.PI/3]){
  const r=realm(cell,grid),result=r.compare(`const length=SIZE*.8;const P=obbCorners(0,0,2.6,length,${angle});`);
  assert.ok(result.after.length>20,'the actual long corridor touches many native cells');
  assert.ok(result.current.candidates<result.old.candidates/4,JSON.stringify({cell,angle,...result}));
  assert.ok(result.current.edges<result.old.edges/4,'original exact edge calls fall with the candidate rectangle');
  assert.equal(result.current.boxes,0,'finite polygon extrema are reused once, rather than recomputed inside every hit');
  assert.equal(result.old.boxes,result.old.candidates);
  if(cell===6000/220&&angle===Math.PI/4)t.diagnostic(JSON.stringify({cell,angle,old:result.old,current:result.current}));
 }
});

test('native row strips preserve concave, self-crossing, degenerate, horizontal and boundary raster results',()=>{
 for(const cell of [1,15,6000/220,9000/220,40]){
  const r=realm(cell,24);
  r.run(`const edge=cellX(11)+CELL/2,z=cellZ(11),cases=[
   [{x:-0,z:-0}],[{x:-CELL*5,z:-CELL*5},{x:CELL*5,z:CELL*5}],
   [{x:-CELL*5,z:-CELL*5},{x:CELL*5,z:CELL*5},{x:-CELL*5,z:CELL*5},{x:CELL*5,z:-CELL*5}],
   [{x:-CELL*5,z:-CELL*5},{x:CELL*5,z:-CELL*5},{x:CELL*5,z:CELL*5},{x:0,z:0},{x:-CELL*5,z:CELL*5}],
   [{x:-CELL*7,z:-.49},{x:CELL*7,z:.49},{x:CELL*7,z:.5},{x:-CELL*7,z:-.5}],
   [{x:-SIZE/2-CELL,z:-SIZE/2-CELL},{x:-SIZE/2+CELL,z:-SIZE/2-CELL},{x:-SIZE/2,z:-SIZE/2+CELL}],
   [{x:SIZE/2-CELL,z:SIZE/2-CELL},{x:SIZE/2+CELL,z:SIZE/2-CELL},{x:SIZE/2,z:SIZE/2+CELL}],
   obbCorners(0,0,CELL*8,.001,0),obbCorners(0,0,2.6,CELL*10,Math.PI/2),[]
  ];
  for(const gap of [0,.005,.009999999,.01,.010000001,.999999999,1,1.000000001,2])for(const angle of [0,Math.PI/4,-Math.PI/3])cases.push(obbCorners(edge+gap+1,z,2,3,angle));
  for(let k=0;k<48;k++){const a=k*Math.PI/24,w=.001+k/7,d=CELL*(1+k%9),x=Math.sin(k*3)*CELL*6,z=Math.cos(k*5)*CELL*6;cases.push(obbCorners(x,z,w,d,a));}`);
  const count=r.run('cases.length');for(let k=0;k<count;k++)r.compare(`var P=cases[${k}];`);
 }
});

test('malformed, scaled, unsafe and accessor polygons retain the original native rectangle fallback',()=>{
 for(const code of [
  `const P=[{x:NaN,z:0},{x:1,z:1},{x:0,z:1}];`,
  `const P=[{x:Infinity,z:0},{x:1,z:1},{x:0,z:1}];`,
  `const P=[{x:-Infinity,z:0},{x:1,z:1},{x:0,z:1}];`,
  `const P=[{x:1e7,z:-1},{x:1e7+2,z:1},{x:1e7,z:1}];`,
  `const P=[{x:'10',z:-5},{x:'10',z:5},{x:20,z:0}];`,
  `const P=[Object.create({x:10,z:-5}),{x:10,z:5},{x:20,z:0}];`,
  `let coordinateReads=0;const P=[{get x(){coordinateReads++;return 10},z:-5},{x:10,z:5},{x:20,z:0}];`
 ]){
  const native=realm(30,24),result=native.compare(code);assert.equal(result.current.candidates,result.old.candidates);assert.equal(result.current.edges,result.old.edges);assert.equal(result.current.boxes,result.old.boxes);
  if(code.includes('coordinateReads')){native.run('coordinateReads=0;rectangleGroundCells(P);');const old=native.run('coordinateReads');native.run('coordinateReads=0;occupiedGroundCells(P);');assert.equal(native.run('coordinateReads'),old,'eligibility must not call coordinate getters');}
 }
 for(const cell of [.1,NaN,Infinity]){const native=realm(cell,5),result=native.compare('const P=[{x:0,z:0}];');assert.equal(result.current.candidates,result.old.candidates);assert.equal(result.current.edges,result.old.edges);}
});

test('missing native capture and cold predicate or coordinate overrides preserve the original full scan',()=>{
 for(const replacement of ['',`inPolyXZ=()=>true;`,`segSegDist=()=>0;`,`segDist=()=>0;`,`occupiedGroundBoxMayHit=()=>true;`]){
  const r=realm(30,24,{capture:replacement!==''}),result=r.compare(`${replacement}const P=obbCorners(0,0,2.6,SIZE*.8,Math.PI/4);`);
  assert.equal(result.current.candidates,result.old.candidates,'a replaced predicate cannot certify row-strip exclusion');
  assert.equal(result.current.edges,result.old.edges);
  assert.equal(result.current.boxes,result.old.boxes);
 }
 // Native coordinate bindings are const in production; mutable copies allow
 // the fixture to exercise cold identity invalidation without changing bodies.
 for(const name of ['clamp','cIdx','cellX','cellZ','toCell']){
  const r=realm(30,24,{replaceable:[name]}),result=r.compare(`const original=${name};${name}=(...args)=>original(...args);const P=obbCorners(0,0,2.6,SIZE*.8,Math.PI/4);`);
  assert.equal(result.current.candidates,result.old.candidates,name+' identity invalidates column exclusion');assert.equal(result.current.edges,result.old.edges);assert.equal(result.current.boxes,result.old.boxes);
 }
 const r=realm();assert.equal(r.run('Object.isFrozen(OCCUPIED_GROUND_NATIVE)'),true);
});

test('custom polygon array methods and indexed accessors retain the native rectangle result and query prefix',()=>{
 for(const extra of [
  `P.some=()=>true;`,
  `let visits=0;Object.defineProperty(P,0,{get(){visits++;return first;}});`,
  `let visits=0;Object.defineProperty(P,'some',{get(){visits++;return Array.prototype.some;}});`,
  `const some=Array.prototype.some;Array.prototype.some=function(...args){return some.apply(this,args);};`,
  `const iterator=Array.prototype[Symbol.iterator];Array.prototype[Symbol.iterator]=function(){return iterator.call(this);};`
 ]){
  const r=realm(30,24),result=r.compare(`const P=obbCorners(0,0,2.6,SIZE*.8,Math.PI/4),first=P[0];${extra}`);
  assert.equal(result.current.candidates,result.old.candidates,extra);assert.equal(result.current.edges,result.old.edges,extra);assert.equal(result.current.boxes,result.old.boxes,extra);
  if(extra.includes('visits')){r.run('visits=0;rectangleGroundCells(P);');const before=r.run('visits');r.run('visits=0;occupiedGroundCells(P);');assert.equal(r.run('visits'),before,'the eligibility guard invokes no array accessors');}
 }
});
