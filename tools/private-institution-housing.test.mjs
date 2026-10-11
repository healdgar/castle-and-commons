// Actual native housing and paid-fabric consumers, with controlled opening
// households, roofs, quoted geometry and real purses. No generated world.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {realm,near} from './ownership-fixture.mjs';
import {parse} from './vendor/acorn/acorn.mjs';
import {inlineGameScript} from './simulation-boundary.mjs';
const source=inlineGameScript(fs.readFileSync(process.env.FURLONG_TEST_SOURCE||new URL('../index.html',import.meta.url),'utf8')),ast=parse(source,{ecmaVersion:'latest'}),F=new Map(),V=new Map();
for(const n of ast.body)if(n.type==='FunctionDeclaration')F.set(n.id.name,n);else if(n.type==='VariableDeclaration')for(const d of n.declarations)if(d.id.type==='Identifier')V.set(d.id.name,{kind:n.kind,node:d});
const fn=n=>{const d=F.get(n);assert.ok(d,'native '+n);return source.slice(d.start,d.end);},constant=n=>{const d=V.get(n);assert.ok(d,'native '+n);return d.kind+' '+source.slice(d.node.start,d.node.end)+';';};
const names=['corpFound','houseFolk','housingEligible','housingSlots','housingRefitAllowed','learningLodgingUsed','learningHouseholdSlots','learningPerson','capOf','vacantResidentials','resetVacantResidentials','vacantResidentialChanged','unhousedOf','rehouse','moveIn','tickGrowthVacancy','tickTownReuse','constructionRecipe','fabricSnapshot','fabricProjectPayer','fabricPending','fabricProjectValidate','fabricProjectCommission','fabricProjectComplete','fabricProjectTick','constructionProjectMaterials','constructionProjectPaidWork','storageOwnerId','consumeOwnStock','consumeOwned','buildWorks','payAmong','workers_','hungryHands'];
function setup(){const r=realm({households:4,crown:2000,cash:100,grain:0,fish:0,bootstrap:['compoundPolygonDifference','obbCorners','wallRadAt','lerp','graveyardPolygonsOverlap','inPolyXZ','segSegDist','segDist','abbeySurveyBounds','abbeySurveyBoxesMayHit'].map(n=>F.has(n)?fn(n):constant(n)).join('\n')});r.eval(['RESID','ARCH','TRADE_ARCH','TILLERS','VACANT_RESIDENTIALS','HUNGRY_HANDS'].map(constant).join('\n')+'\n'+names.map(fn).join('\n'));
 r.eval(`let now=100;day=()=>now;W.bldList=[];W.projects=[];W._pm=new Map(H.map(p=>[p.id,p]));s.history=[];s.ruinCount=0;s.stores.timber=40;s.px.timber=1;s.siegeBy=null;
  const A=corpFound('abbey',{name:'Saint Mary',si:0,members:[],corrodies:[]}),B=corpFound('abbey',{name:'Saint Andrew',si:0,members:[],corrodies:[]});
  const roof=(arch,x,flags={})=>{const b={idx:W.bldList.length,s,arch,x,z:0,w:8,d:7,rot:0,h:6,tier:0,state:'sound',hh:[],ownerId:'lord',...flags};s.buildings.push(b);W.bldList.push(b);return b;};
  workOf=()=>s.pos;homeScore=(h,town,x)=>100-x;const propValue=()=>10000;const chance=()=>false;
  const updates=[];updateBuildingInstance=b=>updates.push(b.idx);settleParcels=()=>{};syncLive=()=>{};
  s._lay={live:{fabricSite(site,target,mode){return mode==='complete'?target:site;}}};
 `);r.json=e=>JSON.parse(r.eval('JSON.stringify('+e+')'));return r;}
const cash=r=>r.eval('W.treasury+W.abbeys.reduce((n,a)=>n+a.gold,0)+H.reduce((n,p)=>n+p.w,0)');
const occupants=r=>r.json('s.buildings.map(b=>({idx:b.idx,arch:b.arch,owner:b.ownerId,heads:b.hh.map(p=>p.id)}))');

test('houseFolk shares the existing native member and corrodian eligibility; hired households use ordinary roofs',()=>{
 const r=setup();r.eval(`const dorm=roof('longhouse',0,{w:16,abbey:A.storageOwnerId,ownerId:A.storageOwnerId,inst:true}),other=roof('longhouse',1,{abbey:B.storageOwnerId,ownerId:B.storageOwnerId,inst:true}),home=roof('house',2,{w:16});H[0].abbey=A.id;H[0].role='monk';H[1].corrodian=A.id;H[2].role='abbey servant';H[2].abbeyService=A.storageOwnerId;houseFolk(s);`);
 assert.equal(r.eval('H[0].bh===dorm&&H[1].bh===dorm'),true);assert.equal(r.eval('H[2].bh===home&&H[3].bh===home'),true);assert.deepEqual(r.json('other.hh'),[]);
 assert.equal(r.eval('housingEligible(other,H[0])'),false);assert.equal(r.eval('housingEligible(dorm,H[2])'),false);assert.equal(r.eval('housingEligible(home,H[0])'),false);assert.equal(r.eval('housingEligible(dorm,H[1])'),true);
});

test('moveIn skips more desirable private roofs and preserves their real occupants and available private index entries',()=>{
 const r=setup(),money=cash(r);r.eval(`H[0].abbey=A.id;H[0].role='monk';const occupied=roof('longhouse',0,{abbey:A.storageOwnerId,ownerId:A.storageOwnerId,inst:true});occupied.hh=[H[0]];H[0].bh=occupied;const empty=roof('longhouse',1,{abbey:A.storageOwnerId,ownerId:A.storageOwnerId,inst:true}),publicHome=roof('house',20);transfer('crown',H[1],300,'real savings',s);H[2].role=H[3].role='other service';moveIn(s);`);
 assert.equal(r.eval('H[1].bh===publicHome'),true);assert.deepEqual(r.json('occupied.hh.map(p=>p.id)'),[1]);assert.deepEqual(r.json('empty.hh'),[]);assert.equal(r.eval('vacantResidentials(s).has(empty)'),true);near(cash(r),money);
});

test('no eligible vacant roof skips the head instead of overwriting an institutional room',()=>{
 const r=setup();r.eval(`const dorm=roof('longhouse',0,{abbey:A.storageOwnerId,ownerId:A.storageOwnerId,inst:true});H[1].role=H[2].role=H[3].role='service';moveIn(s);`);
 assert.equal(r.eval('H[0].bh==null'),true);assert.deepEqual(r.json('dorm.hh'),[]);assert.equal(r.eval('vacantResidentials(s).has(dorm)'),true);
 r.eval(`H[0].abbey=A.id;H[0].role='monk';houseFolk(s);`);assert.equal(r.eval('H[0].bh===dorm'),true,'the same actual empty roof remains usable for a real eligible member');
});

test('ordinary housing keeps wealth, score ties and vacated-roof ordering',()=>{
 const r=setup();r.eval(`const old=roof('house',30),a=roof('house',20),b=roof('house',20);old.hh=[H[0],H[1],H[2]];H[0].bh=H[1].bh=H[2].bh=old;H[1].w=400;H[2].w=200;H[3].role='service';moveIn(s);`);
 assert.equal(r.eval('H[1].bh===a'),true);assert.equal(r.eval('H[2].bh===b'),true);assert.equal(r.eval('H[0].bh===old'),true);assert.deepEqual(r.json('old.hh.map(p=>p.id)'),[1]);assert.deepEqual(r.json('[...vacantResidentials(s)].map(b=>b.idx)'),[]);
 const q=setup();q.eval(`const first=roof('house',20),better=roof('house',0);H[1].role=H[2].role=H[3].role='service';homeScore=(h,t,x)=>-1e12-x;moveIn(s);`);assert.equal(q.eval('H[0].bh===first'),true,'the original very-negative-score fallback still selects the first ordinary roof');
});

test('actual scholar lodging reservations are preserved by moving, rebuilding and the household fallback',()=>{
 for(const action of ['moveIn(s)','rehouse(s,inn)','houseFolk(s)']){const r=setup();r.eval(`const inn=roof('inn',0);H[2].study={closed:false,journey:{lodging:inn.idx,leave:101}};inn.schoolBoarders=[H[2].id];H[1].role=H[2].role=H[3].role='service';${action};`);
  assert.equal(r.eval('learningLodgingUsed(inn)'),1);assert.equal(r.eval('housingSlots(inn)'),0);assert.equal(r.eval('H[0].bh==null'),true,action);assert.deepEqual(r.json('inn.hh'),[]);
  r.eval('now=101;moveIn(s)');assert.equal(r.eval('H[0].bh===inn'),true,'the same native room returns after the actual scholar leaves');
 }
});

test('rebuilding a private roof selects its eligible member; nonresidential work rooms acquire no residents',()=>{
 const r=setup();r.eval(`const dorm=roof('longhouse',0,{abbey:A.storageOwnerId,ownerId:A.storageOwnerId,inst:true}),grange=roof('grange',1,{abbey:A.storageOwnerId,ownerId:A.storageOwnerId,inst:true});H[1].abbey=A.id;H[1].role='monk';H[0].w=1000;rehouse(s,dorm);rehouse(s,grange);`);
 assert.equal(r.eval('H[1].bh===dorm'),true);assert.equal(r.eval('H[0].bh==null'),true);assert.deepEqual(r.json('grange.hh'),[]);
});

test('vacancy retains private purposes while the actual corporate owner pays real roof materials and workers',()=>{
 const r=setup();r.eval(`const dorm=roof('longhouse',0,{abbey:A.storageOwnerId,ownerId:A.storageOwnerId,inst:true,compoundKey:'residence'});transfer('crown',A,1000,'real endowed funds',s);H[0].tr='smith';H[1].tr='mason';H[2].tr='carter';H[3].role='service';offer(s,'timber',H[2],40);tickGrowthVacancy(s);`);
 const before=cash(r);assert.equal(r.eval('W.projects.length'),1);assert.equal(r.eval('W.projects[0].work'),'repair');assert.equal(r.eval('W.projects[0].payer===A'),true);assert.equal(r.eval('dorm.arch'),'longhouse');assert.deepEqual(r.json('dorm.hh'),[]);
 r.eval('const q=W.projects[0],beforeTimber=s.stores.timber;for(let i=0;i<q.days;i++)fabricProjectTick(q);');assert.equal(r.eval('q.status'),'completed');assert.equal(r.eval('dorm._roofMaintainedUntil'),460);near(r.eval('q.materialPaid'),r.eval('q.timber'));near(r.eval('s.stores.timber'),r.eval('beforeTimber-q.timber'));assert.ok(r.eval('q.paid>0'));near(cash(r),before);assert.equal(r.eval('dorm.arch'),'longhouse');assert.deepEqual(r.json('dorm.hh'),[]);
});

test('direct and retained generic fabric conversions cannot bypass private native purpose validation',()=>{
 for(const flags of ["{abbey:A.storageOwnerId,ownerId:A.storageOwnerId}","{college:'college:0'}","{inst:true}","{compoundKey:'mill'}","{compoundConnection:{parent:1}}","{coveredCourt:{width:2.6}}"]){const r=setup();r.eval(`const b=roof('longhouse',0,${flags});const plan={work:'refit',payer:H[0],occupant:H[0],arch:'smithy',labour:2,days:1,timber:1,stone:0};`);const before=cash(r),b0=occupants(r);
  assert.equal(r.eval('fabricProjectCommission(s,b,plan)'),null);assert.equal(r.eval(`fabricProjectValidate({...plan,target:b.idx,before:fabricSnapshot(b),site:{f:{x:b.x,z:b.z,w:b.w,d:b.d,rot:b.rot}}},s).reason`),'institutional-purpose');r.eval(`plan.work='use'`);assert.equal(r.eval('fabricProjectCommission(s,b,plan)'),null);near(cash(r),before);assert.deepEqual(occupants(r),b0);assert.equal(r.eval('W.projects.length'),0);
 }
});

test('ordinary vacancy conversion still waits for actual timber and paid work and keeps the owner title',()=>{
 const r=setup();r.eval(`const home=roof('house',0);H[0].tr='smith';H[1].tr='mason';H[2].tr='carter';H[3].role='service';offer(s,'timber',H[2],40);tickGrowthVacancy(s);const q=W.projects[0];`);const money=cash(r);
 assert.equal(r.eval('q.work'),'refit');assert.equal(r.eval('q.occupant===H[0]'),true);assert.equal(r.eval('home.arch'),'house');r.eval('fabricProjectTick(q)');assert.equal(r.eval('home.arch'),'house');assert.ok(r.eval('q.timberInstalled>0&&q.paid>0'));r.eval('while(!q.dead)fabricProjectTick(q)');assert.equal(r.eval('home.arch'),'smithy');assert.equal(r.eval('home.ownerId'),'lord');assert.equal(r.eval('H[0].bh===home'),true);near(cash(r),money);
});

test('town reuse surveys the original ordered pool but accepts only ordinary purpose conversions',()=>{
 const r=setup();r.eval(`const privateRoom=roof('tannery',0,{abbey:A.storageOwnerId,ownerId:A.storageOwnerId,inst:true,compoundKey:'tannery'}),publicHome=roof('house',10);transfer('crown',A,1000,'real endowed funds',s);let surveys=0;s._lay.reuse=(n,mode)=>{surveys++;return[{b:privateRoom,arch:'house'},{b:publicHome,arch:'smithy'}]};tickTownReuse(s);`);
 assert.equal(r.eval('surveys'),1);assert.equal(r.eval('W.projects.length'),1);assert.equal(r.eval('W.projects[0].target'),r.eval('publicHome.idx'));assert.equal(r.eval('W.projects[0].work'),'use');assert.equal(r.eval('privateRoom.arch'),'tannery');
});
