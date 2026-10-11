import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {realm,near} from './ownership-fixture.mjs';

const source=fs.readFileSync(process.env.FURLONG_TEST_SOURCE||new URL('../index.html',import.meta.url),'utf8');
const start=source.indexOf('function storageGroundClaim('),end=source.indexOf('function storageProjectTick(',start);
assert.ok(start>=0&&end>start);
const groundFunctions=source.slice(start,end);

function fixture(){
  const r=realm({households:3,cash:100,crown:100});
  r.eval(`W.land={};ARCH={grange:[12,10]};GRID=10;
const F=H.map((h,k)=>({k,lord:0,own:h.id,wk:h.id,title:{own:{owner:accountOwner(h)},work:{owner:accountOwner(h)}}}));
cellX=x=>x;cellZ=z=>z;furlongAt=(x,z)=>F[Math.min(2,Math.floor(x))];
compoundGround=()=>({cells:[0,1,2]});occupiedGroundFields=cells=>new Set(cells.map(k=>F[k]));occupiedGroundAreas=cells=>new Map(cells.map(k=>[F[k],225]));obbCorners=()=>[];
storageOwnerId=o=>o==null?'unassigned':typeof o==='string'?o:'household:'+o.id;
propertyRightsResolve=id=>({owner:id});
const q={arch:'grange',x:0,z:0,land:30,paid:0};
`+groundFunctions);
  return r;
}

test('site compensation goes to each actual holder and records only delivered cash',()=>{
  const r=fixture(),before=r.coins();
  r.eval(`const g=storageGroundClaim(s,q,'crown');const paid=storageGroundPay(q,s,'crown',g);`);
  assert.equal(r.eval('g.ok'),true);assert.equal(r.eval('paid.ok'),true);
  near(r.eval('paid.paid'),30);near(r.eval('q.paid'),30);near(r.W.treasury,70);
  for(const h of r.H)near(h.w,110);near(r.coins(),before);
  r.eval(`storageGroundPay(q,s,'crown',storageGroundClaim(s,q,'crown'))`);
  near(r.eval('q.paid'),30);near(r.coins(),before);near(r.W.treasury,70);
});

test('using an owned site preserves its opportunity quote without making a self-payment',()=>{
  const r=fixture(),before=r.coins();
  r.eval(`compoundGround=()=>({cells:[0]});const g=storageGroundClaim(s,q,accountOwner(H[0]));storageGroundPay(q,s,accountOwner(H[0]),g)`);
  near(r.eval('q.landCash'),0);near(r.eval('q.paid'),0);near(r.eval('q.groundClaim.quoted'),30);
  assert.equal(r.eval('q.landPaid'),true);near(r.coins(),before);
});

test('a different working tenant and changed titles stop new site payments',()=>{
  const r=fixture();r.eval(`F[1].title.work.owner=accountOwner(H[2]);const blocked=storageGroundClaim(s,q,'crown');`);
  assert.equal(r.eval('blocked.ok'),false);assert.equal(r.eval('blocked.reason'),'occupied-holding');
  near(r.eval('q.paid'),0);near(r.W.treasury,100);
  r.eval(`F[1].title.work.owner=F[1].title.own.owner;storageGroundPay(q,s,'crown',storageGroundClaim(s,q,'crown'));F[1].title.own.owner=accountOwner(H[2]);F[1].title.work.owner=accountOwner(H[2]);const changed=storageGroundClaim(s,q,'crown')`);
  assert.equal(r.eval('changed.ok'),false);assert.equal(r.eval('changed.reason'),'ground-title-changed');
});

test('an unfunded or ownerless quote is never reported as paid',()=>{
  const r=fixture();r.eval(`W.treasury=0;const unfunded=storageGroundPay(q,s,'crown',storageGroundClaim(s,q,'crown'));`);
  assert.equal(r.eval('unfunded.ok'),false);assert.equal(r.eval('q.landPaid'),undefined);near(r.eval('q.paid'),0);
  r.eval(`W.land=null;const ownerless=storageGroundClaim(s,q,'crown')`);
  assert.equal(r.eval('ownerless.ok'),false);near(r.eval('q.paid'),0);
});
