// Source-extracted, operation-local foundation survey. Load real geometry and shape
// helpers without booting the world generator or renderer.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const fn=name=>{const hit=source.match(new RegExp(`^function ${name}\\b[\\s\\S]*?(?=^function |^const |^/\\*|$(?![\\s\\S]))`,'m'));assert.ok(hit,`missing ${name}`);return hit[0];};
const REAL=['lerpPt','segDist','resample','obbCorners','obbOverlap','makeHash','streetFootprintOverlap','serviceDoor','locW','inPoly','lakeAt','wallRadAt','fortCenter','casRing','fortCircuits','fortContains','placeR','placeHit','placeFitRadii','furlongAt','castleFoundationLandOK','castleFoundationCentersPossible','castleFoundationBoxMayHit','castleFoundationSegmentMayHitBox','circuitLen','castleFoundationSite'];
function runtime({water=()=>false,ground=()=>true,field={dom:0,lord:-1,own:-1,wk:-1,jx:0,jz:0},street=null}={}){
  const s={pos:{x:0,z:0},radius:70,owner:0,buildings:[],streets:[],places:[],remnants:[],relicWalls:[]};
  const st=street||{kind:'lane',hw:2,pts:[{x:0,z:-100},{x:0,z:100}]};s.streets=[st];
  const F=field, W={settlements:[s],roads:[],projects:[],trackSet:[],tg:{E:new Map(),pts:[]},land:{F:[F]}};
  const C=vm.createContext({W,Math,HASH_STAMP:0,PLN:20,FN:1,FG:1000,SIZE:1000,
    hAt:()=>10,dist2d:(ax,az,bx,bz)=>Math.hypot(ax-bx,az-bz),clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),lerp:(a,b,t)=>a+(b-a)*t,
    planCellOK:(x,z)=>ground(x,z),riverAt:(x,z,pad)=>water(x,z,pad)?{x,z,hw:1}:null,
    fortCircuits:()=>[],placeR:(p,a)=>{const n=20,f=((a/(Math.PI*2))%1+1)%1*n,i=Math.floor(f)%n,t=f-Math.floor(f);return p.r[i]*(1-t)+p.r[(i+1)%n]*t;}});
  C.s=s;C.spec={w:13,d:13,tier:2,hm:.8,h:7,timber:false};vm.runInContext(REAL.map(fn).join('\n'),C);
  return{C,s,st,field:F,spec:{w:13,d:13,tier:2,hm:.8,h:7,timber:false},survey(retained=null){C.retained=retained;return vm.runInContext('castleFoundationSite(s,spec,retained)',C);}};
}
function fixture(opts){const R=runtime(opts),site=R.survey();assert.ok(site,'fixture should produce a genuine fitted foundation');return{...R,site};}

function legacyPlaceFitRadii(p,clear,stretch=1){ // previous full scan, before the optional minimum-radius cutoff
  if(!clear(p.x,p.z))return null;
  const n=p.r.length,caps=[],r=p.r.map(v=>v*stretch),step=0.75;
  for(let j=0;j<n*4;j++){const f=j/4,k=Math.floor(f),t=f-k,a=f/n*Math.PI*2,limit=r[k]*(1-t)+r[(k+1)%n]*t;let d=0;
    for(let q=step;q<=limit+step;q+=step){const R=Math.min(q,limit);if(!clear(p.x+Math.cos(a)*R,p.z+Math.sin(a)*R))break;d=R;if(R===limit)break;}
    caps[j]=Math.max(0,d-1.5);
  }
  for(let j=0;j<n*4;j++){const k=Math.floor(j/4);r[k]=Math.min(r[k],caps[j]);if(j%4)r[(k+1)%n]=Math.min(r[(k+1)%n],caps[j]);}
  return r.every(v=>Number.isFinite(v)&&v>=3)?r:null;
}
const siteShape=q=>q&&({f:{x:q.f.x,z:q.f.z,w:q.f.w,d:q.f.d,rot:q.f.rot},ward:{x:q.ward.x,z:q.ward.z,r:q.ward.r,rad:Array.from(q.ward.wallRad),gateA:q.ward.gateA},path:q.path.map(p=>[p.x,p.z])});

function compareBroadPhase(R){
  const C=R.C,exactBox=C.castleFoundationBoxMayHit,exactConnector=C.castleFoundationSegmentMayHitBox,exactSeg=C.segDist;let calls=0;
  C.segDist=(...a)=>{calls++;return exactSeg(...a);};C.castleFoundationBoxMayHit=C.castleFoundationSegmentMayHitBox=()=>true;
  const original=R.survey(),originalCalls=calls;calls=0;C.castleFoundationBoxMayHit=exactBox;C.castleFoundationSegmentMayHitBox=exactConnector;
  const filtered=R.survey(),filteredCalls=calls;
  assert.deepEqual(siteShape(filtered),siteShape(original),'the exact clear/site result is unchanged');
  assert.ok(filteredCalls<originalCalls,`broad phase skips exact segment distances (${filteredCalls} vs ${originalCalls})`);
  C.segDist=exactSeg;return {original,filtered,originalCalls,filteredCalls};
}

test('fresh survey chooses an accessible convex yard and retained survey revalidates it',()=>{
  const R=fixture(),{site}=R;
  assert.equal(R.survey(site),site);
  assert.equal(site.f.w,13);assert.equal(site.f.d,13);
  assert.ok(site.path.length>=2);assert.ok(site.ward.wallRad.every(r=>r>Math.hypot(site.f.w,site.f.d)/2+13));
  const poly=Array.from(site.ward.wallRad,(r,k)=>{const a=k/site.ward.wallRad.length*Math.PI*2;return{x:site.ward.x+Math.cos(a)*r,z:site.ward.z+Math.sin(a)*r};});
  for(let k=0;k<poly.length;k++){const a=poly[k],b=poly[(k+1)%poly.length],c=poly[(k+2)%poly.length];assert.ok((b.x-a.x)*(c.z-b.z)-(b.z-a.z)*(c.x-b.x)>=-1e-6,`radial yard is convex at ${k}`);}
});

test('retained survey sees a same-count building move and lot replacement',()=>{
  for(const key of ['poly','lot']){
    const R=runtime(),old={x:500,z:500,w:8,d:8,rot:0,state:'sound'};R.s.buildings.push(old);const site=R.survey();assert.ok(site);
    old.x=site.ward.x;old.z=site.ward.z;
    old[key]=Array.from({length:4},(_,k)=>({x:site.ward.x+Math.cos(k*Math.PI/2)*4,z:site.ward.z+Math.sin(k*Math.PI/2)*4}));
    assert.equal(R.s.buildings.length,1,'the changed geometry keeps the same building count');assert.equal(R.survey(site),null,`${key} is rebuilt from current live geometry`);
  }
});

test('retained survey rejects a moved, hidden, or non-service quay frontage at unchanged street count',()=>{
  for(const change of [st=>{st.pts=[{x:30,z:-100},{x:30,z:100}];},st=>{st.hidden=true;},st=>{st.kind='quay';st.serviceLinked=false;}]){
    const R=fixture(),{site,st}=R;change(st);assert.equal(R.s.streets.length,1);assert.equal(R.survey(site),null);
  }
  const R=fixture(),{site,st}=R;st.kind='quay';st.serviceLinked=true;assert.equal(R.survey(site),site,'a service-linked quay remains eligible');
});

test('retained survey rejects changed terrain, water, and titled ground but allows unheld ruler demesne',()=>{
  const terrain=fixture(),a=terrain.site;terrain.C.planCellOK=(x,z)=>Math.hypot(x-a.ward.x,z-a.ward.z)>a.ward.r-2;assert.equal(terrain.survey(a),null);
  const wet=fixture(),b=wet.site;wet.C.riverAt=(x,z,pad)=>Math.hypot(x-b.ward.x,z-b.ward.z)<b.ward.r?{x,z,hw:3}:null;assert.equal(wet.survey(b),null);
  const title=fixture(),c=title.site;title.field.dom=0;title.field.lord=0;title.field.own=7;assert.equal(title.survey(c),null);
  const demesne=fixture(),d=demesne.site;demesne.field.dom=0;demesne.field.lord=-1;demesne.field.own=-1;demesne.field.wk=-1;assert.equal(demesne.survey(d),d);
});

test('retained survey refuses a radial yard made concave after commissioning',()=>{
  const R=fixture(),{site}=R;site.ward.wallRad[0]=1;assert.equal(R.survey(site),null);
});


test('minimum-radius fitting preserves every valid full-fit radius and the selected foundation site',()=>{
  const R=runtime(),p={x:0,z:0,r:Array(32).fill(32)};
  const clear=()=>true;
  const fast=R.C.placeFitRadii(p,clear,1,22);
  const full=legacyPlaceFitRadii(p,clear);
  assert.ok(full&&full.every(v=>v>=22));assert.deepEqual(Array.from(fast),full);
  const a=R.survey();R.C.placeFitRadii=legacyPlaceFitRadii;const b=R.survey();
  assert.deepEqual(siteShape(a),siteShape(b),'fresh site geometry remains equal under the original complete fit');
});

test('minimum-radius cutoff rejects the same later-ray and road-clearance failures with fewer samples',()=>{
  const p={x:0,z:0,r:Array(32).fill(32)},run=clear=>{
    let fastCalls=0,fullCalls=0;
    const fast=runtime().C.placeFitRadii(p,(x,z)=>{fastCalls++;return clear(x,z);},1,22);
    const full=legacyPlaceFitRadii(p,(x,z)=>{fullCalls++;return clear(x,z);});
    assert.equal(fast,null);assert.ok(full&&full.some(v=>v<22),'the full oracle reaches the same impossible minimum');
    assert.ok(fastCalls<fullCalls*0.75,`early cutoff samples ${fastCalls} points versus ${fullCalls}`);
  };
  const target=40/128*Math.PI*2;
  run((x,z)=>!(Math.hypot(x,z)>16&&Math.abs(Math.atan2(z,x)-target)<0.025));
  run((x,z)=>!(x>13&&Math.abs(z)<1.2)); // a narrow road corridor rejected by the clearance callback
});

test('ray directions preserve the former ordered clearance samples and fitted radii',()=>{
  for(const n of [20,32])for(const obstruct of [()=>true,(x,z)=>x<18,(x,z)=>Math.abs(z)<23]){
    const p={x:7,z:-3,r:Array.from({length:n},(_,k)=>25+k%7)},before=[],after=[],R=runtime();
    const old=legacyPlaceFitRadii(p,(x,z)=>{before.push([x,z]);return obstruct(x,z);});
    const now=R.C.placeFitRadii(p,(x,z)=>{after.push([x,z]);return obstruct(x,z);});
    assert.deepEqual(after,before,'every exact callback coordinate and its order is retained');
    assert.deepEqual(now&&Array.from(now),old);
  }
});


test('operation-local bounds preserve exact surveys with moved lots, long narrow polygons, and roads',()=>{
  const R=runtime(),b={x:500,z:500,w:8,d:8,rot:0,state:'sound'};R.s.buildings.push(b);const initial=R.survey();assert.ok(initial);
  b.x=initial.ward.x;b.z=initial.ward.z+34;b.lot=[{x:initial.ward.x-80,z:initial.ward.z+32},{x:initial.ward.x+80,z:initial.ward.z+32},{x:initial.ward.x+80,z:initial.ward.z+33},{x:initial.ward.x-80,z:initial.ward.z+33}];
  R.s.streets.push({kind:'lane',hidden:true,hw:2,pts:[{x:initial.ward.x-120,z:initial.ward.z+48},{x:initial.ward.x+120,z:initial.ward.z+48}]});
  assert.ok(compareBroadPhase(R).filtered,'the long lot and current hidden road still permit another accurate site');
});

test('the AABB broad phase remains conservative at and just inside exact-distance boundaries',()=>{
  const C=runtime().C,b={minX:1,maxX:2,minZ:1,maxZ:2};
  assert.equal(C.castleFoundationBoxMayHit(0,1.5,b,1),true,'equality must reach the exact strict-distance test');
  assert.equal(C.castleFoundationBoxMayHit(-1e-7,1.5,b,1),true,'the floating-point allowance preserves near-boundary candidates');
  assert.equal(C.castleFoundationBoxMayHit(-0.01,1.5,b,1),false,'a safely distant point is rejected');
  assert.equal(C.castleFoundationBoxMayHit(NaN,1.5,b,1),true,'invalid bounds defer to exact logic');
});

test('axis rejection exactly preserves the former box predicate under native deterministic hypot',()=>{
  const start=source.indexOf('  function hypot(x,y){'),end=source.indexOf('\n  return Object.freeze(',start);
  assert.ok(start>=0&&end>start,'the actual native deterministic hypot is extracted');
  const hypot=vm.runInNewContext(source.slice(start,end)+'\nhypot',{Math});let calls=0;
  const math=Object.create(Math);math.hypot=(x,z)=>{calls++;return hypot(x,z);};
  const current=vm.runInNewContext(fn('castleFoundationBoxMayHit')+'\ncastleFoundationBoxMayHit',{Math:math});
  const prior=(x,z,b,pad=0)=>{if(!b||![x,z,b.minX,b.maxX,b.minZ,b.maxZ,pad].every(Number.isFinite))return true;
    const dx=Math.max(b.minX-x,0,x-b.maxX),dz=Math.max(b.minZ-z,0,z-b.maxZ);return hypot(dx,dz)<=pad+1e-6;};
  const compare=(x,z,b,pad)=>assert.equal(current(x,z,b,pad),prior(x,z,b,pad),JSON.stringify([x,z,b,pad]));
  const buf=new ArrayBuffer(8),f=new Float64Array(buf),u=new BigUint64Array(buf),next=n=>{
    if(n===Infinity)return n;if(n===0)return Number.MIN_VALUE;f[0]=n;u[0]+=n>0?1n:-1n;return f[0];};
  const point={minX:0,maxX:0,minZ:0,maxZ:0},box={minX:-2,maxX:3,minZ:4,maxZ:5};
  const pads=[-Number.MAX_VALUE,-1,-next(1e-6),-1e-6,next(-1e-6),-Number.MIN_VALUE,-0,0,Number.MIN_VALUE,1e-6,.5,1,1000,2**52,1e200,Number.MAX_VALUE];
  for(const pad of pads){const limit=pad+1e-6;
    for(const axis of[0,Number.MIN_VALUE,Math.abs(limit),next(Math.abs(limit)),-next(-Math.abs(limit))])
      for(const other of[0,Number.MIN_VALUE,axis*.5,axis])for(const sign of[-1,1]){
        compare(sign*axis,other,point,pad);compare(other,sign*axis,point,pad);
        assert.ok(hypot(axis,other)>=Math.max(axis,other),'native hypot never falls below its largest finite axis');
      }
  }
  for(const invalid of[undefined,null,NaN,Infinity,-Infinity,'1']){compare(invalid,0,box,1);compare(0,invalid,box,1);compare(0,0,box,invalid);
    for(const k of['minX','maxX','minZ','maxZ'])compare(0,0,{...box,[k]:invalid},1);}
  for(const b of[null,undefined,{},box,{minX:3,maxX:-2,minZ:5,maxZ:4},{minX:-Number.MAX_VALUE,maxX:-Number.MAX_VALUE,minZ:Number.MAX_VALUE,maxZ:Number.MAX_VALUE}])
    for(const x of[0,-0,Number.MIN_VALUE,-Number.MAX_VALUE,Number.MAX_VALUE])for(const z of[0,Number.MIN_VALUE,-Number.MAX_VALUE,Number.MAX_VALUE])for(const pad of pads)compare(x,z,b,pad);
  let state=0x315cd57b;const draw=()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296;};
  for(let k=0;k<4000;k++){const scale=Math.pow(2,k%2097-1074),x=(draw()*2-1)*scale,z=(draw()*2-1)*scale,pad=(draw()*2-.5)*scale;
    compare(x,z,{minX:-scale*.25,maxX:scale*.3,minZ:-scale*.1,maxZ:scale*.4},pad);}
  calls=0;assert.equal(current(100,0,point,1),false);assert.equal(current(0,100,point,1),false);assert.equal(calls,0,'distant single axes skip hypot');
  assert.equal(current(.75,.75,point,1),false);assert.equal(calls,1,'near-box corners keep the exact original hypot predicate');
});


test('OBB broad phase keeps the diagonal corners of its rectangular padding',()=>{
  const C=runtime().C,pad=1,f={x:0,z:0,w:10,d:10,rot:0},box=(()=>{const P=C.obbCorners(f.x,f.z,f.w,f.d,f.rot);return{minX:Math.min(...P.map(p=>p.x)),maxX:Math.max(...P.map(p=>p.x)),minZ:Math.min(...P.map(p=>p.z)),maxZ:Math.max(...P.map(p=>p.z))};})(),x=5+0.9*pad,z=5+0.9*pad;
  assert.ok(Math.abs(x)<f.w/2+pad&&Math.abs(z)<f.d/2+pad,'the exact local-axis OBB test includes this padded corner');
  assert.equal(C.castleFoundationBoxMayHit(x,z,box,pad),false,'the old circular pad would incorrectly reject this point');
  assert.equal(C.castleFoundationBoxMayHit(x,z,box,Math.SQRT2*pad),true,'sqrt(2) keeps the exact OBB check in play');
});

test('connector broad phase keeps a 45-degree expanded-footprint corner',()=>{
  const C=runtime().C,f={x:0,z:0,w:10,d:10,rot:Math.PI/4},P=C.obbCorners(f.x,f.z,f.w,f.d,f.rot),box={minX:Math.min(...P.map(p=>p.x)),maxX:Math.max(...P.map(p=>p.x)),minZ:Math.min(...P.map(p=>p.z)),maxZ:Math.max(...P.map(p=>p.z))};
  const g={a:{x:8.87,z:0},b:{x:8.87,z:0.1},hw:1.3},padding=0.3,margin=g.hw+padding;
  assert.equal(Math.min(g.a.x,g.b.x)-margin>box.maxX,true,'the old margin would discard this near-corner connector');
  assert.equal(C.streetFootprintOverlap(f,g,padding),true,'the exact rotated footprint test says it overlaps');
  assert.equal(C.castleFoundationSegmentMayHitBox(g.a,g.b,box,margin),true,'sqrt(2) retains the exact overlap test');
});
