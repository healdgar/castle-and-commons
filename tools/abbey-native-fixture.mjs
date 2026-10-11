// Root-run native operability scenario. The caller supplies the full-source VM's
// read(expression) and serialized step() functions. This helper never generates
// a world, substitutes buildings/people, edits titles or stocks, or invents coin.
// Starting at 1200 exercises historically available Cistercians; 1066 exercises
// Benedictines. All sites, purchases, work, admissions and output are native.

const orders=new Set(['cistercian','benedictine','augustinian']);

export function abbeyNativeStateExpression(id=null){return `(()=>{
  const A=${id==null?'W.abbeys||[]':'[W.abbeys?.['+Number(id)+']].filter(Boolean)'};
  return {day:day(),ad:AD(),coin:accountBalances().total,flow:{...W._flow},people:W.settlements.reduce((n,s)=>n+(s.folk||[]).filter(p=>!p.dead).length,0),abbeys:A.map(a=>{
    const s=W.settlements[a.si],x=s._owners?.get(a),B=abbeyBuildings(a),P=abbeyPeople(a);
    return {id:a.id,si:a.si,key:a.storageOwnerId,name:a.name,order:a.order,gold:a.gold,formed:a.formed,
      qualifiedResidents:['miller','tanner'].map(job=>({job,people:(s.folk||[]).filter(p=>!p.dead&&abbeyIndustryQualified(p,job)).map(p=>({id:p.id,held:institutionalJobHeld(p),away:awayNow(p),status:p.status,age:ageYrs(p)}))})),
      members:P.map(p=>({id:p.id,household:p._hh?.id,role:p.role,home:p.bh?.idx??null,housed:!!(p.bh&&!p.bh.removed&&p.bh.state==='sound'&&p.bh.abbey===a.storageOwnerId&&RESID.has(p.bh.arch)),hunger:p._hh?.hunger||0,trade:p.tr,priorTrade:p.abbeyPriorTrade||null,qualified:!!p.craft?.qualified,job:p.abbeyJob||null,industry:p.abbeyIndustry??null})),
      buildings:B.map(b=>({idx:b.idx,key:b.compoundKey,arch:b.arch,state:b.state,owner:b.ownerId,operator:b.abbeyOperator??null,poweredDay:b.poweredDay?{...b.poweredDay}:null,millWater:b.millWater?{...b.millWater}:null,windExposure:b.windExposure??null})),
      fields:abbeyFields(a).map(f=>({k:f.k,owner:f.own,worker:f.wk,state:f.state,area:f.area})),
      goods:{held:{...x?.held},sale:{...x?.sale},animals:{...x?.animals}},crop:a.crop||0,foodGiven:a.foodGiven||0,wages:a.wages||0,industryPlans:{...(a.industryPlans||{})},industryTotal:{...(a.industryTotal||{})},prev:a.prev?{...a.prev}:null,millGround:a.millGround||0,hidesTanned:a.hidesTanned||0,barkUsed:a.barkUsed||0,leatherMade:a.leatherMade||0,leatherUsed:a.leatherUsed||0,servants:(a.servants||[]).filter(p=>!p.dead).map(p=>({person:p.id,job:p.abbeyJob,paidDay:p.abbeyPaidDay,industry:p.abbeyIndustry??null,wage:p.abbeyWage,qualified:!!p.craft?.qualified})),
      projects:(W.projects||[]).filter(q=>q.adapter==='abbey'&&q.ownerId===a.storageOwnerId).map(q=>({id:q.id,key:q.key,dead:!!q.dead,status:q.status,reason:q.reason,worked:q.worked||0,days:q.days,done:q.done||0,timberInstalled:q.timberInstalled||0,stoneInstalled:q.stoneInstalled||0}))};})};})()`;}

export function abbeyNativeEligibilityExpression(order='cistercian'){
  if(!orders.has(order))throw Error('Unknown native abbey order');
  return `(()=>{const order=${JSON.stringify(order)},rule=ABBEY_ORDERS[order],out=[];
    for(let hi=0;hi<W.houses.length;hi++){const h=W.houses[hi],head=abbeyFounder(hi),existing=(W.abbeys||[]).find(a=>!a.gone&&a.founder===hi);for(let si=0;si<W.settlements.length;si++){const s=W.settlements[si];if(s.owner!==hi)continue;
      const cap=institutionalCapability(s,order),fields=(s.furl||[]).filter(f=>abbeyGrantable(f,hi,si,rule)),surplus=(hi?h?._netA:W._crNetA)||0,gold=means(houseAcct(hi)),reserve=hostTarget(hi)*4,cashAboveReserve=gold-reserve;
      // Mirror price()'s value without its missing-price write; diagnostics must
      // not initialize s.px for a founder whose native early gates refuse.
      const quotedPrice=g=>s.px&&s.px[g]!=null?s.px[g]:price0(s,g),minimum=foodYr()*40+STORAGE_TYPES.grange.cost+(STORAGE_TYPES.grange.timber+32)*quotedPrice('timber'),churchFixedGift=foodYr()*12+40*quotedPrice('timber')+minimum;
      const first12CropOpportunities=fields.slice().sort((a,b)=>dist2d(a.x,a.z,s.pos.x,s.pos.z)-dist2d(b.x,b.z,s.pos.x,s.pos.z)||a.k-b.k).slice(0,12).map(f=>{const yieldY=(s._gYield||soilYield(s))*f.area*0.87*360*quotedPrice('grain');return{field:f.k,yieldY,positive:yieldY>0,belowAnnualSurplus:yieldY<surplus*12,eligible:yieldY>0&&yieldY<surplus*12};});
      out.push({hi,si,name:s.name,founderId:head?.id??null,founderAlive:!!head?.alive,founderExiled:!!h?.exiled,founderPiousTrait:!!head?.traits?.includes('pious'),founderScripture:head?.sk?.[KS]||0,besieged:!!s.siegeBy,existingFounderAbbeyId:existing?.id??null,existingFounderAbbeyOrder:existing?.order??null,pious:!!head?.alive&&!!(head.traits?.includes('pious')||(head.sk?.[KS]||0)>=.5),surplus,surplusPositive:surplus>0,annualCropBudget:surplus*12,gold,reserve,cashAboveReserve,minimum,minimumFunded:cashAboveReserve>=minimum,churchFixedGift,fullGiftFunded:cashAboveReserve>=churchFixedGift,fundingGap:Math.max(0,churchFixedGift-cashAboveReserve),available:cap.available,reason:cap.reason,fields:fields.length,first12CropOpportunityCount:first12CropOpportunities.filter(f=>f.eligible).length,first12CropOpportunities,qualifiedResidents:['miller','tanner'].map(job=>({job,people:(s.folk||[]).filter(p=>!p.dead&&abbeyIndustryQualified(p,job)).map(p=>({id:p.id,held:institutionalJobHeld(p),away:awayNow(p),status:p.status,age:ageYrs(p)}))})),project:!!abbeyFoundPlan(hi,si,order)});}}
    return out;})()`;
}

function commissionExpression(order,allowCrownGrant){return `(()=>{
  const order=${JSON.stringify(order)},existing=(W.abbeys||[]).find(a=>a.order===order&&!a.gone);if(existing)return {id:existing.id,existing:true};
  for(let hi=0;hi<W.houses.length;hi++)for(let si=0;si<W.settlements.length;si++){if(W.settlements[si].owner!==hi)continue;const P=abbeyFoundPlan(hi,si,order);if(P){const a=abbeyFound(P);if(a)return{id:a.id,existing:false,grant:0};}}
  if(!${!!allowCrownGrant})return null;
  const rule=ABBEY_ORDERS[order],candidates=[];for(let hi=1;hi<W.houses.length;hi++){const h=W.houses[hi],head=abbeyFounder(hi),surplus=h?._netA||0;if(!head?.alive||h.exiled||!(surplus>0)||!(head.traits?.includes('pious')||(head.sk?.[KS]||0)>=.5)||(W.abbeys||[]).some(a=>!a.gone&&a.founder===hi))continue;
    for(let si=0;si<W.settlements.length;si++){const s=W.settlements[si];if(s.owner===hi&&!s.siegeBy&&institutionalCapability(s,order).available&&(s.furl||[]).some(f=>abbeyGrantable(f,hi,si,rule)))candidates.push({hi,si,surplus});}}
  candidates.sort((a,b)=>b.surplus-a.surplus||a.hi-b.hi||a.si-b.si);
  for(const c of candidates){const s=W.settlements[c.si],payer=houseAcct(c.hi),target=hostTarget(c.hi)*4+foodYr()*100+STORAGE_TYPES.grange.cost+150*price(s,'timber')+100*price(s,'stone'),spare=Math.max(0,means('crown')-hostTarget(0)*8),want=Math.min(Math.max(0,target-means(payer)),spare,means('crown')/3);
    if(!(want>0))continue;const paid=transfer('crown',payer,want,'abbey endowment patron gift',s);unearned(payer,paid);const P=abbeyFoundPlan(c.hi,c.si,order);
    if(P){const a=abbeyFound(P);if(a)return{id:a.id,existing:false,grant:paid};}
    const returned=transfer(payer,'crown',paid,'abbey endowment patron refund',s);unearned('crown',returned);if(Math.abs(returned-paid)>1e-8)throw Error('Native test grant could not be returned');}
  return null;})()`;}

export async function reachPaidNativeAbbey({read,step,order='cistercian',maxDays=1440,allowCrownGrant=true,onProgress=()=>{}}){
  if(!orders.has(order))throw Error('Unknown native abbey order');
  let id=null,foundation=null,last=null;
  for(let i=0;i<=maxDays;i++){
    const state=await read(abbeyNativeStateExpression(id));
    if(id==null){if(i===0||state.day%30===0)onProgress({day:state.day,order,eligibility:await read(abbeyNativeEligibilityExpression(order))});const existing=state.abbeys.find(a=>a.order===order);if(existing){id=existing.id;foundation=existing;}else if(state.day>0&&state.day%30===0){const action=await read(commissionExpression(order,allowCrownGrant));if(action){id=action.id;foundation={...action,day:state.day};}}}
    if(id!=null){last=(await read(abbeyNativeStateExpression(id))).abbeys[0];const project=last?.projects.find(q=>q.key==='church'&&!q.dead&&q.worked>0&&q.worked<q.days);if(project)return{id,foundation,project,state:last};}
    if(i<maxDays)await step();
  }
  throw Error('No actually paid unfinished native abbey church within '+maxDays+' days: '+JSON.stringify({last,eligibility:await read(abbeyNativeEligibilityExpression(order))}));
}

export async function finishNativeAbbey({read,step,id,maxDays=2160}){
  let last=null;
  for(let i=0;i<=maxDays;i++){
    last=(await read(abbeyNativeStateExpression(id))).abbeys[0];
    if(last&&last.members.length&&last.members.every(p=>p.housed)&&last.buildings.some(b=>b.key==='church')&&last.buildings.some(b=>b.key==='residence')&&last.buildings.some(b=>b.key==='grange')&&last.crop>0&&last.foodGiven>0&&last.fields.every(f=>f.owner===last.key))return last;
    if(i<maxDays)await step();
  }
  throw Error('Native abbey has not reached actual housed membership, paid grange output and native meals: '+JSON.stringify(last));
}
