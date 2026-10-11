// Exercise the production lot builder against the native road/footprint predicate.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {inlineGameScript} from './simulation-boundary.mjs';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=inlineGameScript(fs.readFileSync(process.env.FURLONG_TEST_SOURCE||path.join(ROOT,'index.html'),'utf8'));
const footprintStart=source.indexOf('function streetFootprintOverlap(');
const footprintEnd=source.indexOf('\n// Water crossings',footprintStart);
const nativeFootprint=source.slice(footprintStart,footprintEnd);
const lotStart=source.indexOf('const buildLot=(c,tier,residentialOnly=false)=>');
const lotEnd=source.indexOf('\n  /* ---- back lanes:',lotStart);
assert.ok(footprintStart>=0&&footprintEnd>footprintStart,'native footprint predicate found');
assert.ok(lotStart>=0&&lotEnd>lotStart,'production buildLot found');
const productionLot=source.slice(lotStart,lotEnd);

function build(c,streets){
  const context=vm.createContext({ARCH:{burgher:[14,6,7,0,'burgher'],house:[9,7,6,0,'house']},
    HOME:new Set(['house','longhouse','burgher']),isVil:false,focus:null,Rmax:100,oldVil:null,
    AD:()=>1200,rr:()=>0.5,home:()=> 'house',archFor:()=> 'house',frontageAccess:()=>true,
    gapFor:()=>0.6,roadAccessClear:()=>true,
    s:{streets,buildings:[],burns:[]},dist2d:(x,z,a,b)=>Math.hypot(x-a,z-b),built:0});
  vm.runInContext(nativeFootprint+'\n'+productionLot+`\nconst fits=f=>!s.streets.some(st=>st.pts.some((p,k)=>k>0&&streetFootprintOverlap(f,{a:st.pts[k-1],b:p,hw:st.hw})));
const place=(arch,tier,f,district,hm,extra)=>{const b={arch,tier,...f,district,hm,extra};s.buildings.push(b);return b;};`,context);
  const b=vm.runInContext(`buildLot(${JSON.stringify(c)},1,true)`,context);
  return {building:b,context};
}

test('opening burgher lots clear their own rotated street on both sides and respect a crossing street',()=>{
  const angle=0.63,ux=Math.cos(angle),uz=Math.sin(angle),hw=3.4;
  for(const side of[-1,1]){
    const own={kind:'road',hw,pts:[{x:-100*ux,z:-100*uz},{x:100*ux,z:100*uz}]};
    const c={mx:0,mz:0,ux,uz,side,hw,d:10,st:own};
    const {building,context}=build(c,[own]);
    assert.ok(building,`side ${side}: buildLot accepted its frontage`);
    assert.equal(vm.runInContext('streetFootprintOverlap(s.buildings[0],{a:s.streets[0].pts[0],b:s.streets[0].pts[1],hw:s.streets[0].hw})',context),false,
      `side ${side}: generated footprint clears its own street`);

    const b=building,foreign={kind:'lane',hw:2.8,pts:[{x:b.x-40,z:b.z},{x:b.x+40,z:b.z}]};
    const blocked=build(c,[own,foreign]);
    assert.equal(blocked.building,null,`side ${side}: buildLot rejects a genuinely crossing foreign street`);
    assert.equal(vm.runInContext('streetFootprintOverlap({x:'+b.x+',z:'+b.z+',w:'+b.w+',d:'+b.d+',rot:'+b.rot+'},{a:s.streets[1].pts[0],b:s.streets[1].pts[1],hw:s.streets[1].hw})',blocked.context),true,
      'the foreign centerline crosses the generated footprint under the native predicate');
  }
  assert.match(productionLot,/set=c\.hw\+0\.9\+depth\/2/,'burgher setback uses the ordinary frontage clearance');
});
