import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {realm,near} from './ownership-fixture.mjs';

const source=fs.readFileSync(process.env.FURLONG_TEST_SOURCE||new URL('../index.html',import.meta.url),'utf8');
const fn=name=>{const m=source.match(new RegExp('^function '+name+'\\b[\\s\\S]*?(?=^function |^const |^/\\*|$(?![\\s\\S]))','m'));assert.ok(m,'missing '+name);return m[0];};
const nativeHouse=source.match(/^const isHouse=.*$/m)?.[0];assert.ok(nativeHouse,'native institutional account predicate');
function fixture({commodity,cash=100,stock=0,reserve=0,good='timber'}={}){
  const r=realm({commodity,grain:0,fish:0,cash:0,crown:cash,households:1,
    bootstrap:`s.stores[${JSON.stringify(good)}]=${stock};`,
    transformSource:program=>{const old='const isHouse=x=>x&&W.houses.includes(x);';assert.ok(program.includes(old),'ownership fixture account predicate');return program.replace(old,nativeHouse);}});
  r.eval(['corpFound','price','reprice','constructionProjectMaterials'].map(fn).join('\n'));
  r.eval(`
    ownershipTick();storageInit(s);for(const g of GOODS)s.px[g]=1;
    const A=corpFound('abbey',{name:'funded buyer',si:0});transfer('crown',A,${cash},'actual founding gift',s);
    const q={timber:4,stone:0,labour:20,days:20,worked:0,paid:0,materialPaid:0,timberInstalled:0,stoneInstalled:0};
    ${stock>0?`offer(s,${JSON.stringify(good)},H[0],${stock},${reserve});`:''}
  `);
  return r;
}
const coins=r=>r.W.treasury+r.H.reduce((n,h)=>n+(h.w||0),0)+r.eval('A.gold');
const materialState=r=>JSON.parse(r.eval("JSON.stringify({cash:A.gold,seller:means(H[0]),stock:s.stores.timber,offered:mkt(s,'timber').get(H[0])||0,held:pantry(s,A).timber||0,installed:q.timberInstalled,paid:q.materialPaid,work:q.worked,wages:q.paid})"));
function risesWithinMonthlyStep(before,after){assert.ok(after>before,'unfilled funded orders discover a higher quote');assert.ok(after<=before*Math.exp(.25),'the original bounded monthly search remains in force');}

for(const commodity of [false,true]){
  const mode=commodity?'numeric balances':'legacy custody';
  test(`empty-market funded construction orders move the quote without making goods or spending cash (${mode})`,()=>{
    const r=fixture({commodity}),before=materialState(r),cash=coins(r);
    for(let month=0;month<3;month++){
      assert.equal(r.eval('constructionProjectMaterials(q,s,A)'),false);
      near(r.eval('s._dem.timber'),4);near(r.eval('purchase.got'),0);
      const quote=r.s.px.timber;r.eval('reprice(s)');risesWithinMonthlyStep(quote,r.s.px.timber);
      assert.deepEqual(materialState(r),before);near(coins(r),cash);
      assert.deepEqual(Object.keys(r.s._dem),[]);assert.deepEqual(Object.keys(r.s._sold),[]);
    }
  });

  test(`a retained real offer above the quote becomes purchasable by bounded price discovery (${mode})`,()=>{
    const r=fixture({commodity,stock:8,reserve:3}),cash=coins(r),before=materialState(r);
    assert.equal(r.eval('accountOwner(A.storageOwnerId)===A'),true);
    assert.equal(r.eval('constructionProjectMaterials(q,s,A)'),false);
    near(r.eval("avail(s,'timber',price(s,'timber'))"),0);
    near(r.eval("mkt(s,'timber').get(H[0])"),8);near(r.eval('s._dem.timber'),4);
    assert.deepEqual(materialState(r),before);
    let months=0;
    while(r.s.px.timber<3&&months<20){
      const quote=r.s.px.timber;r.eval('reprice(s)');months++;risesWithinMonthlyStep(quote,r.s.px.timber);
      if(r.s.px.timber<3){assert.equal(r.eval('constructionProjectMaterials(q,s,A)'),false);assert.deepEqual(materialState(r),before);}
      near(coins(r),cash);
    }
    assert.ok(months>1&&months<20,'the market searches across months rather than pinning its quote to the reserve');
    const quote=r.s.px.timber;assert.equal(r.eval('constructionProjectMaterials(q,s,A)'),true);
    near(r.eval('q.timberInstalled'),4);near(r.eval('q.materialPaid'),4*quote);
    near(r.eval('A.gold'),100-4*quote);near(r.eval('means(H[0])'),4*quote);
    near(r.eval('A.cashY.payments.timber'),4*quote);near(coins(r),cash);
    near(r.s.stores.timber,4);near(r.eval("mkt(s,'timber').get(H[0])"),4);
    near(r.eval("rsv(s,'timber').get(H[0])"),3);near(r.eval("pantry(s,A).timber||0"),0);
    near(r.s.stores.timber+r.eval('q.timberInstalled'),8);
    near(r.eval('q.worked'),0);near(r.eval('q.paid'),0);
    const installed=materialState(r);assert.equal(r.eval('constructionProjectMaterials(q,s,A)'),true);assert.deepEqual(materialState(r),installed);
  });

  test(`no affordable purchase cannot drive discovery or transfer the seller's reserved stock (${mode})`,()=>{
    const r=fixture({commodity,cash:0,stock:8,reserve:3}),before=materialState(r),cash=coins(r);
    assert.equal(r.eval('constructionProjectMaterials(q,s,A)'),false);
    near(r.eval("purchase(s,'timber',A,4)"),0);near(r.eval('purchase.got'),0);
    near(r.eval('s._dem.timber||0'),0);r.eval('reprice(s)');near(r.s.px.timber,1);
    assert.deepEqual(materialState(r),before);near(coins(r),cash);
  });

  test(`quiet markets with no current orders keep their quote even with old demand or a dear offer (${mode})`,()=>{
    for(const stock of [0,8]){
      const r=fixture({commodity,stock,reserve:3}),before=materialState(r),cash=coins(r);
      r.eval('s._dAvg={timber:100};s._dYr={timber:50};reprice(s)');
      near(r.s.px.timber,1);near(r.eval('s._dAvg.timber'),75);
      assert.deepEqual(materialState(r),before);near(coins(r),cash);
    }
  });

  test(`ordinary available supply still lowers an idle quote without moving any cash or custody (${mode})`,()=>{
    const r=fixture({commodity,stock:8}),before=materialState(r),cash=coins(r),quote=r.s.px.timber;
    r.eval('reprice(s)');assert.ok(r.s.px.timber<quote);assert.ok(r.s.px.timber>=quote*Math.exp(-.25));
    assert.deepEqual(materialState(r),before);near(coins(r),cash);
  });

  test(`unfilled ordinary orders for other goods are limited by the real buyer's purse (${mode})`,()=>{
    for(const good of ['ore','paper']){
      const r=fixture({commodity,cash:.25,good}),cash=coins(r);
      r.eval(`purchase(s,${JSON.stringify(good)},A,10)`);
      near(r.eval('purchase.got'),0);near(r.eval(`s._dem[${JSON.stringify(good)}]`),.25);near(coins(r),cash);
      const quote=r.s.px[good];r.eval('reprice(s)');risesWithinMonthlyStep(quote,r.s.px[good]);
      near(r.eval(`s.stores[${JSON.stringify(good)}]||0`),0);near(r.eval(`pantry(s,A)[${JSON.stringify(good)}]||0`),0);near(coins(r),cash);
    }
  });
}
