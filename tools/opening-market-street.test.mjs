import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(process.env.FURLONG_TEST_SOURCE||new URL('../index.html',import.meta.url),'utf8');
const between=(a,b)=>{const i=source.indexOf(a),j=source.indexOf(b,i);assert.ok(i>=0&&j>i,a);return source.slice(i,j);};
const seed=between('  const seedMarketStreet=()=>','  const completeResidential=goal=>');
const graph=between('function streetGraph(s){','function nearestNode(');
const footprint=between('function streetFootprintOverlap(','// Water crossings');
const road=between('function roadAccessClear(','// A service lane');
const place=between('function placeR(','function placeReach(');

function fixture({year=1350,streets=[],spokes={},buildings=[],wet=false,fort=false}={}){
  const p={x:0,z:0,kind:'market',r:Array.from({length:20},(_,i)=>20+3*Math.sin(i*0.8))};
  const s={pos:{x:0,z:0},streets,roadSpoke:spokes,places:[p]},W={startAD:year,roads:[]},G={};
  let queued=0,stitched=0;
  const c=vm.createContext({s,W,G,C:s.pos,HW:3,FOUNDING_AD:850,PLN:20,SEA_SURFACE:0.5,
    dist2d:(x,z,a,b)=>Math.hypot(x-a,z-b),polyLen:P=>P.reduce((n,p,k)=>n+(k?Math.hypot(p.x-P[k-1].x,p.z-P[k-1].z):0),0),lerp:(a,b,t)=>a+(b-a)*t,
    hAt:(x,z)=>wet?0:5,lakeAt:()=>false,riverAt:()=>false,paidRoadAt:()=>false,
    fortRoadBlocked:()=>fort,fortCircuits:()=>[],fortStreetRuns:(s,st)=>[st.pts],
    wallProg:()=>1,wallDamage:()=>0,streetGraphFortContext:()=>null,
    resample:(P,step)=>P.flatMap((b,k)=>{if(!k)return[b];const a=P[k-1],n=Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)/step);return Array.from({length:n},(_,j)=>({x:a.x+(b.x-a.x)*(j+1)/n,z:a.z+(b.z-a.z)*(j+1)/n}));}),
    placeEdge:p=>Array.from({length:21},(_,k)=>({x:p.x+Math.cos(k/20*Math.PI*2)*p.r[k%20],z:p.z+Math.sin(k/20*Math.PI*2)*p.r[k%20]})),
    buildable:()=>!wet,queue:()=>{queued++;return[];},stitchRoads:()=>{stitched++;},
    addStreet:(pts,hw,kind,extra)=>{const st={pts,hw,kind,...extra};s.streets.push(st);return st;},
    rr:()=>assert.fail('opening fallback must not throw dice'),buildings});
  vm.runInContext(footprint+road+place+graph+`
const laneHitsBldg=(a,b,hw)=>buildings.some(f=>streetFootprintOverlap(f,{a,b,hw},0.3));
`+seed+'globalThis.seedMarketStreet=seedMarketStreet;',c);
  return{c,s,p,run:()=>c.seedMarketStreet(),get queued(){return queued;},get stitched(){return stitched;}};
}

test('an isolated market gets one legal local lane and native accessible graph nodes',()=>{
  const r=fixture();assert.equal(r.run(),true);assert.equal(r.s.streets.length,1);
  const st=r.s.streets[0];assert.equal(st.kind,'lane');assert.equal(st.openingMarket,true);
  assert.ok(vm.runInContext('streetGraph(s).N.some(n=>n.access)',r.c));
  assert.equal(vm.runInContext('s.streets[0].pts.every(p=>!placeHit(s.places[0],p.x,p.z,s.streets[0].hw+0.3))',r.c),true);
  const before=JSON.stringify(r.s.streets);assert.equal(r.run(),false);assert.equal(JSON.stringify(r.s.streets),before);
  assert.equal(r.queued,1);assert.equal(r.stitched,1);assert.equal(Object.keys(r.s.roadSpoke).length,0);
});

test('existing accessible streets, connected spokes and the AD 850 opening do not receive a fallback',()=>{
  for(const opts of[{year:850},{spokes:{0:[{x:0,z:0},{x:100,z:0}]}},{streets:[{kind:'road',hw:4,pts:[{x:0,z:0},{x:100,z:0}]}]}]){
    const r=fixture(opts),before=r.s.streets.length;assert.equal(r.run(),false);assert.equal(r.s.streets.length,before);
  }
});

test('water and a blocked fort circuit prevent an illegal market lane',()=>{
  for(const opts of[{wet:true},{fort:true}]){
    const r=fixture(opts);assert.equal(r.run(),false);assert.equal(r.s.streets.length,0);assert.equal(r.queued,0);
  }
});


test('a market bounded by a standing building receives only an unobstructed boundary run',()=>{
  const b={x:28,z:0,w:30,d:20,rot:0},r=fixture({buildings:[b]});
  assert.equal(r.run(),true);assert.equal(r.s.streets.length,1);
  assert.equal(vm.runInContext('s.streets[0].pts.some((b,k)=>k&&streetFootprintOverlap(buildings[0],{a:s.streets[0].pts[k-1],b,hw:s.streets[0].hw},0.3))',r.c),false);
  assert.ok(vm.runInContext('streetGraph(s).N.some(n=>n.access)',r.c));
});
