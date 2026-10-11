// Production branch, mouths and walk over recorded Bourport street geometry.
// Terrain is a controlled dry plane; this never generates or advances a world.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const html=fs.readFileSync(process.env.FURLONG_TEST_SOURCE||new URL('../index.html',import.meta.url),'utf8');
const fn=n=>{const m=html.match(new RegExp('^function '+n+'\\b[\\s\\S]*?(?=^function |^const |^/\\*|$(?![\\s\\S]))','m'));assert.ok(m,n);return m[0];};
const cut=(a,b)=>{const i=html.indexOf(a),j=html.indexOf(b,i);assert.ok(i>=0&&j>i,a);return html.slice(i,j);};
const source=['lerpPt','resample','streetFootprintOverlap','roadAccessClear'].map(fn).join('\n')+'\n'+cut('  const nearStreet=','  const inPlace=')+cut('  const laneBlockers=','  const STANDS=')+cut('  const MOUTH=','  const wallSide=')+cut('  const joinAt=','  /* a wider circuit:')+'\nconst live={'+cut('    laneSurvey(){','    planSite(')+'};';
const pts=[{x:3718.4676790547037,z:-3239.6397964419302},{x:3707.5713642822966,z:-3245.4545454545455},{x:3713.346528346631,z:-3252.9332571995906},{x:3719.876080840825,z:-3257.4334557247175},{x:3725.780396506761,z:-3260.0211254535575},{x:3731.0388429886157,z:-3261.842574363706},{x:3736.363636363636,z:-3262.5919496799183},{x:3741.674640574665,z:-3261.800135680698},{x:3746.761145041153,z:-3259.765488416222}];
function setup(){const C=vm.createContext({pts});vm.runInContext(`
 const C={x:3736.363636363636,z:-3245.4545454545455},seed={pts,hw:2.34,kind:'lane',openingMarket:true},s={pos:C,owner:0,pop:1000,streets:[seed],buildings:[],wallRad:null},W={settlements:[s]},HW=3,R0=310;let Rmax=620,curE=5,roll=.5,wet=false,fort=false,place=false;
 const dist2d=(x,z,a,b)=>Math.hypot(x-a,z-b),clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),lerp=(a,b,t)=>a+(b-a)*t,rr=()=>roll,extent=()=>60,day=()=>1,metroOf=s=>s;
 const hAt=()=>7.259090900421143,SEA_SURFACE=.5,lakeAt=()=>wet,riverAt=()=>null,paidRoadAt=()=>false,fortRoadBlocked=()=>fort,buildable=()=>!wet,inPlace=()=>place;
 const segDist=(x,z,a,b)=>{const dx=b.x-a.x,dz=b.z-a.z,t=clamp(((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz||1),0,1);return dist2d(x,z,a.x+dx*t,a.z+dz*t)};
 const placed={near:()=>s.buildings},segH={near:()=>s.streets.filter(st=>!st.gone).flatMap(st=>st.pts.slice(1).map((b,k)=>({a:st.pts[k],b,st,hw:st.hw})))};
 const addStreet=(pts,hw,kind,extra)=>{const st={pts,hw,kind,...extra};s.streets.push(st);return st};
 `+source,C);return {C,eval:s=>vm.runInContext(s,C)};}
test('recorded short seed has one eligible interior start and can parent a legal native opening or paid lane',()=>{for(const mode of ['branch(1,true,Rmax*.8)','live.laneSurvey()']){const r=setup();assert.equal(r.eval('resample(seed.pts,20).slice(1,-1).filter(p=>dist2d(p.x,p.z,C.x,C.z)>18).length'),1);const made=r.eval(mode);assert.ok(made);if(typeof made==='number')assert.equal(made,1);else{assert.equal(made.startStreet,r.eval('seed'));assert.ok(made.pts.length>=6);assert.equal(r.eval('Rmax'),620);} }});
test('a separate existing lane still vetoes the nearby start rather than duplicating public frontage',()=>{for(const mode of ['branch(1,true,Rmax*.8)','live.laneSurvey()']){const r=setup();r.eval('const p=resample(seed.pts,20)[1];addStreet([{...p},{x:p.x+.5,z:p.z}],2.34,"lane",{})');assert.ok(!r.eval(mode));assert.equal(r.eval('s.streets.length'),2);}});
test('current native standing footprints, water, fort and public-place checks still stop branches',()=>{for(const edit of ['s.buildings.push({x:C.x,z:C.z,w:150,d:150,rot:0,state:"sound"})','wet=true','fort=true','place=true'])for(const mode of ['branch(1,true,Rmax*.8)','live.laneSurvey()']){const r=setup();r.eval(edit);assert.ok(!r.eval(mode),edit);assert.equal(r.eval('s.streets.length'),1);}});
