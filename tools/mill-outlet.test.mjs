import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const extract=n=>source.match(new RegExp('^function '+n+'\\b[\\s\\S]*?(?=^function |^const |^/\\*|$(?![\\s\\S]))','m'))[0];
for(const angle of[0,Math.PI/4,Math.PI/2])test('sluice follows the fitted mill feeder through the dam at angle '+angle,()=>{
  const cs=Math.cos(angle),sn=Math.sin(angle),world=(x,z)=>({x:x*cs-z*sn,z:x*sn+z*cs});
  const b={arch:'mill',state:'sound',millWater:{}},s={buildings:[b],lake:{dam:{...world(0,0),a:Math.PI+angle,w:20}}};
  let feed={a:world(-5,3),b:world(8,3)};
  const C=vm.createContext({Math,millWheelPose:()=>({feed})});vm.runInContext(extract('millSluiceSlots'),C);
  const before=JSON.stringify(s),slots=C.millSluiceSlots(s);assert.equal(slots.length,1);
  assert.ok(Math.abs(slots[0][0]+3.6)<1e-8);assert.ok(Math.abs(slots[0][1]+2.4)<1e-8);
  assert.equal(JSON.stringify(s),before);
  feed=null;assert.equal(C.millSluiceSlots(s).length,0);
  feed={a:world(-5,13),b:world(8,13)};assert.equal(C.millSluiceSlots(s).length,0);
  b.removed=true;feed={a:world(-5,3),b:world(8,3)};assert.equal(C.millSluiceSlots(s).length,0);
});
test('an asymmetric dam opens on the feeder bank, not its mirror image',()=>{
  const feed={a:{x:-5,z:3},b:{x:8,z:3}},s={buildings:[{arch:'mill',state:'sound',millWater:{}}],lake:{dam:{x:0,z:0,a:Math.PI,w:10,lo:-8,hi:2}}};
  const C=vm.createContext({Math,millWheelPose:()=>({feed})});vm.runInContext(extract('millSluiceSlots'),C);
  const slots=C.millSluiceSlots(s);assert.equal(slots.length,1);assert.ok(slots[0][0]<-3&&slots[0][1]>-3);
  feed.a.z=feed.b.z=-3;assert.equal(C.millSluiceSlots(s).length,0);
});
test('lock cuts use the same bank axis and omit chambers outside the dam',()=>{
  const s={buildings:[{state:'sound',lockWater:{f:{x:0,z:4,w:2}}},{state:'sound',lockWater:{f:{x:0,z:-20,w:2}}}],lake:{dam:{x:0,z:0,a:0,w:12,lo:-2,hi:10}}};
  const C=vm.createContext({Math});vm.runInContext(extract('millSluiceSlots'),C);
  const slots=C.millSluiceSlots(s);assert.equal(slots.length,1);assert.ok(Math.abs(slots[0][0]-2.3)<1e-8&&Math.abs(slots[0][1]-5.7)<1e-8);
});
const pondContext=()=>{const C=vm.createContext({Math,Infinity,C1:{r:.2,g:.4,b:.6,setHex(){}}});
  vm.runInContext(source.slice(source.indexOf('const MILL_DAM_HALF='),source.indexOf('function millSluiceSlots(')),C);return C;};
const area=P=>Math.abs(P.reduce((sum,p,i)=>{const q=P[(i+1)%P.length];return sum+p.x*q.z-q.x*p.z;},0)/2);
for(const angle of[0,Math.PI/4,Math.PI/2,Math.PI])test('raised pond water meets the narrow upstream dam face without extending through it at '+angle,()=>{
  const cs=Math.cos(angle),sn=Math.sin(angle),world=(x,z)=>({x:100+x*cs-z*sn,z:-40+x*sn+z*cs}),L={y:9,dam:{x:100,z:-40,a:angle},poly:[world(-5,-5),world(-5,5),world(5,5),world(5,-5)]},C=pondContext(),before=JSON.stringify(L);
  const faces=C.millPondFaces(L);assert.ok(faces.length);assert.ok(Math.abs(faces.reduce((sum,P)=>sum+area(P),0)-44)<1e-8);
  assert.ok(faces.flat().every(p=>(p.x-100)*cs+(p.z+40)*sn>=.6-1e-8));
  assert.ok(faces.flat().some(p=>Math.abs((p.x-100)*cs+(p.z+40)*sn-.6)<1e-8));
  const A={p:[],n:[],c:[],i:[]};C.appendMillPondWater(A,L);assert.ok(A.i.length);assert.ok(A.p.every((v,i)=>i%3!==1||v===9));assert.equal(JSON.stringify(L),before);
  const wall=extract('projectWalls');assert.ok(wall.includes('dx=Math.cos(dm.a)*MILL_DAM_HALF,dz=Math.sin(dm.a)*MILL_DAM_HALF'));
});
test('pond clipping preserves a concave shore rather than bridging its dry bay',()=>{
  const L={dam:{x:0,z:0,a:0},poly:[{x:0,z:0},{x:-1,z:-6},{x:8,z:-6},{x:3,z:0},{x:8,z:6},{x:-1,z:6}]},C=pondContext();vm.runInContext(extract('inPoly'),C);
  const faces=C.millPondFaces(L);assert.ok(faces.some(P=>C.inPoly(P,2,0)));assert.ok(faces.every(P=>!C.inPoly(P,5,0)));
});
test('rendered bank queries do not treat the downstream pond wedge as water',()=>{
  const L={dam:{x:0,z:0,a:0},poly:[{x:-5,z:-5},{x:-5,z:5},{x:5,z:5},{x:5,z:-5}]},C=pondContext();C.W={coastal:false,settlements:[{lake:L}]};
  vm.runInContext(extract('inPoly')+'\n'+extract('renderedWaterNear'),C);
  assert.equal(C.renderedWaterNear(2,0),true);assert.equal(C.renderedWaterNear(-2,0),false);
  assert.equal(C.renderedWaterNear(.2,0,.5),true);assert.equal(C.renderedWaterNear(-2,0,.5),false);
});
test('both initial and rebuilt reservoirs use the contained pond mesh',()=>{
  assert.ok(extract('buildTerrain').includes('appendMillPondWater(lk,s.lake)'));
  assert.ok(extract('projectLakeWater').includes('appendMillPondWater(A,L)'));
});
