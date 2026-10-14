import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
// Embedded README/docs text (the advisor's rules, refreshed by stamp.sh) is documentation, not game source.
const source=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8').replace(/(<script type="text\/plain" id="adv(?:rules|bridge)">)[\s\S]*?(<\/script>)/g,'$1$2');
const digest=s=>createHash('sha256').update(s).digest('hex');
// Pin the reviewed ownership/balance adapter region and the unchanged external
// legacy owner-table writers. This is a source-change tripwire, not an alias proof.
test('managed claim and commodity balance architecture remains reviewed',()=>{
 const a=source.indexOf('function oldHouseholdHead('),b=source.indexOf('function houseFolk(s)');
 // Combined review covers household membership, inherited arithmetic frontiers
 // hay loss debit, safe metadata, successful-pass title caching and explicit
 // pending purchase completion and canonical-order lot indexes. Writers, captures,
 // purchase filtering and arithmetic provenance remain intact; focused tests and
 // native comparisons against f2e4b93 renew this contract.
 // Consumption now proves small requests through an owned, non-transit lot;
 // legal/physical writers and arithmetic remain unchanged. Native total/getter
 // admission and deferred warming preserve cache and override semantics. Frozen
 // 139dd52 fixtures and native replay comparisons renew this bounded-read review.
 // Sale iteration uses derived offer membership; its native Map cursor preserves
 // live fallback. No legal/physical writer or journal event changes. Sparse and
 // opaque mutation fixtures plus exact 34846e4 native replay renew this review.
 // The annual household trade-cache hook shares a line with existing _owners reads;
 // those outside claim references retain identical ownership operations.
 // Composite owner/good membership, incremental certified-group selection and
 // phase-local facility candidates preserve managed writer and event order.
 // Native admission retains full scans for observer callbacks and overrides.
 // Frozen 3067ee5 comparisons and journal-append replay validate this batch.
 // The numeric-balance core/runtime now resides in this reviewed region.
 // Main adds a read-only household inspector; UI/material additions introduce no
 // quantity writes. The combined source is reviewed with both test suites.
 // This defaults to numeric balances while explicit false opts into the legacy lot
 // ledger. The outside legacy owner-table mutation corpus below remains pinned.
 // Positive rows and existing owner registration ranks now narrow native queries.
 // Lazy allocation preflight and phase-local warehouse/spoilage reuse add no
 // commodity membership index or journal event. Exact b264e07 core and settlement
 // comparisons plus sparse seller/routing fixtures renew this review.
 // UI integration adds a read-only animal-sale tally and a herd-birth visual
 // callback; the exact native balance writer body and other claim sites match main.
 // Fortified endpoint attachments now reject closed castle curtains; the route
 // cache follows the clipped street graph. Quantity, title and journal writers
 // are unchanged; fort-streets and frozen routing fixtures cover this change.
 // 48c2b35 changes only storage site surveys and prevents repeat construction
 // labour charges after the work is done; storage-placement/project fixtures cover
 // those reviewed changes. The worker host does not modify this region.
 // Exact balance addresses, membership-only updates and unchanged facility
 // refresh bypasses preserve arithmetic, preflight and journal order. Frozen
 // 450d2b6 differential fixtures and two native years renew this bounded review.
 // commoditySettleAll alone changed since: a settlement before the day's end (a save, a flush) is now journaled
 // ({k:'settle'}) and replayed at the same point; the daily settlement passes daily=true. Settle calls, their order and
 // every quantity/title writer are unchanged; save-session.test.mjs covers the journaling.
 // Tick-cost: the ledger fast paths (fixed-depth nested maps, slot quantity cache, exposedOnly rows) keep writers, events and order; commodity-ledger-equivalence covers them.
 // Money routing (issue #19): carriage and construction wages now pass their payer to buildWorks/payAmong
 // instead of debiting it and booking the wage as coined from nobody, and a robbed cargo is owned by the
 // outlaw household that took it (the thief argument, default 'out') instead of a dealer abroad. No lot,
 // title, claim or journal writer changes; money-routes.test.mjs and the storage fixtures cover these lines.
 // Money routing (#19) in this region: carriage and storage works paid by their payer through buildWorks, a robbed cargo owned by
 // the household that took it (thief); and the storage walk's remembered blocking step (#15), a pure read kept outside the world.
 // No lot, title, claim or journal writer changes.
 // Economy (#23): spoilOwned now notes what rotted this month for the price (s._lostM) around the unchanged spoilage body (spoilOwned0);
 // winterFeed reads the shared WINTER_HAY. No lot, title, claim or journal writer changes.
 // Economy (#23): the market's bread loan is bounded by creditOf (what a lender judges a household can repay) instead of a
 // quarter-year; the loan itself is unchanged. No lot, title, claim or journal writer changes.
 // Economy (#23, #15): the storage tick bills each owner's carrying once per tick (the same sums, rounding apart); no lot, title, claim or journal writer changes.
 // Reserves (#50): commodityInheritance and transferOwnership blend an heir's reserve with the inherited one by quantity
 // (costBlend) instead of keeping the dearer. A reserve is a seller's price floor, not a quantity, title, claim or journal
 // writer; transfers and their order are unchanged. reserve-cost.test.mjs covers both paths.
 // World save (#48): the accessors and Proxies a world holds are made by named binders that the living code and worldLoad both
 // call (householdHerdBind, householdFieldsBind, settlementPopBind, commodityStoreBind, commodityAccountViews, commodityCargoQtyBind,
 // furlongRightsBind, buildingRightsBind, ownershipLard), moved out of their callers with their closures' source text unchanged;
 // the views are noted in COMMODITY_VIEW_PROXIES and keep their targets; the ledger gains static historyState/historyAdopt over
 // its private state. No writer, journal event or order changed: world graphs, RNG and annals equal the previous build (42 and
 // 1001 sea, 40 days), and world-save.test.mjs covers the round trip.
 // Meat (batch 9): STORAGE_GOODS gains meat's volume; commodityClearMarket lends for every food (FOODS), not grain and fish alone;
 // herdProduce no longer counts the swine's bacon as grain (their meat comes at Martinmas); winterFeed reads its loss rate as STARVE.
 // No lot, title, claim or journal writer changes; meat.test.mjs and the ownership and storage fixtures cover these lines.
 // The manor's dues (#36, batch 9): commodityClearMarket and commoditySpoil also tally the lord's grain sold, eaten at his table and
 // rotted (lordSold, lordRot: s._lg, read at the year's reckoning for his mill farms and commutation), and a crown's sale is booked
 // in its labelled book. Tallies and books only: no lot, title, claim or journal writer changes; customary-dues.test.mjs covers them.
 // Meat, after its gate: herdProduce reads its milk and wool rates as the named MILK and FLEECE that beastYield shares; the same
 // quantities, no writer changed.
 // Pruning (batch 10): the ledger gains retire, holds and forget, and a spent set in its private state (saved with it): a cart's
 // place of passage, empty once its load is laid down or lost, leaves with the next settlement written in any case, journaled as a
 // removal (after: null), never alone. ownersRetire (monthly, from ownershipTick) deletes the empty owner records of households with
 // no member and their successors named, holding nothing in any ledger nor on the road, keeping STORAGE_ACTIVE_CLAIMS' size, and
 // drops only their cached quantities. No quantity, title, claim or balance writer changed, and no settlement is written or withheld
 // that was not before: with the retired places and records taken out, world graphs, RNG, annals and the journal's deltas, flows
 // and notes equal deab546 (1001 sea 150 days, 42 sea 3600 days); world-save.test.mjs covers the saved spent set.
 // Crumbs (#55, batch 10b, behaviour): commoditySpoil sweeps out a store whose day's spoilage leaves less than CRUMB of it, whole,
 // through the same consume and spoilage causes (journaled as spoilage; the stores, s._lostM, pending output and the lord's rot
 // tally in step), and a seller left with nothing on sale there loses his reserve there, as commodityConsume does; spoilOwned
 // calls it for goods that never rot too, for their crumbs. No other writer changed; ledger-growth.test.mjs covers the rule.
 // A family's goods (#55, batch 10b, behaviour): moveHouseholdGoods takes a moving household's ledger goods, held and on sale, through
 // carryHome (commodityMove, cause household-carriage, as far as each is worth more at the new home than the carters' freight and the purse
 // pays it; the carriage paid through buildWorks; a seller's reserve moved with his stock, the carriage added) instead of storageMoveLots
 // of its held goods alone; its beasts as before. homeward (at each place's market) offers what a family living elsewhere left there and
 // is not worth carrying (held to sale, cause offered, reserve dropped), and waifs gives what the market did not take to the lord (cause
 // waif). No other writer changed; ledger-growth.test.mjs covers the rules, the migration fixtures their new expectations.
 // Spoilage in closed form (#55, batch 10b, behaviour): the ledger keeps each good's clock of days of spoilage (spoilage: {n, rate},
 // ripen) and on each owner's store of a good at a facility the count it was last settled at (since, non-enumerable on its Map); every
 // read (quantity, total, entries, _quantityAt, _usedStats, _plan) gives the store as it stands, compounded in closed form with a crumb
 // gone, and every write (_set) first settles the store (_settle: the loss written by _put, journaled as exposure-loss or stored-spoilage,
 // and handed to the spoiled hook). commoditySpoil ripens the good and settles only the place's unsold output; commoditySpoiled notes
 // the month's loss, pending output, the lord's rot and an emptied seller's reserve; the storage report reads balances as they stand.
 // The quantity, total and used caches are dated by the clock. Powers are products, memoised (POWERS), the same in every engine. A store
 // left below its crumb by a write is noted (sweep) and settled after the next day's ripening, so crumbs go the next day as they did. A
 // yard without bounds is not reckoned for room (adjust, transfer): what it holds cannot fail a capacity it does not have. No other writer
 // changed; ledger-growth.test.mjs covers the closed form.
 // Batch 10b's gate: a moving family carries a month of its own food on its back before the carters' reckoning (carryHome), through the
 // same commodityMove; no quantity, title, claim or journal writer changes. ledger-growth.test.mjs covers it.
 // Courts (#37, batch 11b): departHousehold slices each native loan tuple before dividing its principal, preserving its date and
 // prior ruling across the split. Principal arithmetic, ownership, balances and journal writers are unchanged; justice.test.mjs
 // covers both portions, merger, voluntary repayment and estate retirement; world-save.test.mjs saves the native loan reference.
 // Annual accounts: the two commodityClearMarket acct calls now carry the good and place as report labels.
 // Their amounts, order, ownership, quantities and journal effects are unchanged; reviewed against 06eaf18.
 // Courts (#37, batch 11d): marryHouseholds witnesses its existing native title and working-right changes in a scratch
 // Map and the bounded scalar enrolment roll. Ownership transfers, beneficiary setters and their order are unchanged;
 // justice.test.mjs checks the former working head and both rights, and the 150-day whole-graph proof strips only enrolments.
 // Fast forward (#15): quantity invalidation clears its private slot values in place. Canonical balances,
 // rank-ordered additions, writers and records are unchanged; caches remain absent from historyState.
 // The frozen ledger differential, fresh world-save continuation and native 150-day full-graph/RNG proof renew this review.
 // Daily kernels (#15): singleton owner/good withdrawal reads current custody and ripening without a general row list;
 // multiple locations and overridden entries retain the old path. No quantity/title/claim/record writer changes.
 // Generic-planner differential fixtures, fresh world-save continuations and the native 8980908 150-day identity/pace
 // proof (all world/RNG/command/annal values and every accepted binary storage outcome) renew this bounded read review.
 // Daily storage (#15): live exposure and daily funded proposals replace the monthly gate.
 // Native necessary profit bounds and synchronous payer-independent quote reuse add no stock/title writer.
 // Fresh investment graphs deliberately change old route/history decisions; paid construction remains unchanged.
 // Daily investment/road-connector fixtures and pace/save-replay/conservation gates review this model conversion.
 // Shared construction (#62): native material credit/consumption is preserved;
 // paid work now records only buildWorks net wage cash and saves fractional days.
 // The storage client retains its existing land policy (#63). Commodity ownership,
 // physical title/claim writers and arithmetic provenance are unchanged.
 // Medieval institutions (#35–47, #62): corporate account keys resolve to their actual
 // holders; native marriage/split hooks carry real credit references without changing
 // the existing goods partition. Corporate titles retain stable external owner keys.
 // Paid fabric/compound works validate exact ground, named title holders, tenant release
 // and retained payment receipts before installing consumed materials and paid work.
 // Storage uses that same ground contract; paid barn carriage plans reserve actual
 // capacity and transfer only the quantity funded by each owner's actual wage bill.
 // Staff-limited abbey milk/fleece passes actual new output through finite forwards.
 // The outside corpus includes real abbey gifts, court pledges/subsidy valuation,
 // installed-equipment reads and actual hosted-meal deduction. Its direct writers
 // transfer existing held title or breeding-safe pledged animals; witness/card
 // additions only read existing stock. The explicit worker inspector stays unchanged.
 // Source review against 877bb3, native government/credit/abbey/equipment/estate fixtures
 // and custody/ground/routing conservation checks renew this source tripwire; the
 // coordinated release gate owns full-world conservation and exact-optimization proofs.
 // Own-use abbey industries (reviewed d36bf93..2d81f11): this region changes only
 // hides/leather volume metadata, finite private tannery storage and the rejection
 // of that compound-only facility by the generic storage-site quote. Existing
 // custody, claims, titles, purchase completion and quantity writers are unchanged.
 // New callers were reviewed separately: skins credit only actual slaughtered
 // beasts to their canonical owner (or funded butcher); tanning purchases and
 // consumes the abbey's real hides/bark before crediting bounded leather output.
 // Named present qualified operators, actual wages, paid compound fabric and
 // private own-use milling retain real actor/title and material provenance.
 // Lawful rural access (reviewed c2059ac..e2fa455): only the Abbey rural
 // client pays its retained corridor licence at commission and rechecks before
 // material/work payment. The opt-in claimOccupied flag includes privately titled
 // core-mask ground; public surface was geometrically removed by that client.
 // The actual owner and distinct tenant work-right veto remain unchanged.
 // institutionFoundationPath optionally validates the retained public endpoint;
 // ordinary clients keep their previous predicate. Paid fixed cells, actual named
 // receipts, native title/custody and generic work arithmetic remain unchanged.
 // abbey-industries fixtures cover a public-core tenant refusal, real freeholder
 // payment once, lawful succession, deceased donor before/after paid permission,
 // separate building grant, fixed-footprint drift and actual road replacement.
 // Synchronous survey optimization (reviewed e2fa455..cd82178): this region
 // changes only the two rural-payment guards from q.site.accessMode to optional
 // q.site?.accessMode; normal retained sites pay the identical native recipients
 // before identical material/work operations. No quantity/title/claim writer or
 // payment order changes. The additional survey contexts live only in a proposal,
 // hold current geometry and lazily derived public polygons, and are discarded;
 // no context is installed on W, a site, project or presentation record.
 // Native geometry function identity certifies the optimized path; replaced
 // predicates retain original unfactored checks. Existing Abbey industry fixtures
 // cover near-boundary rotated geometry, fresh pending/yard mutations, original
 // fallback, ordered private polygons and grant/water preflight before routing.
 // Ground reuse (reviewed f7ff0f7..219b90e): this region changes only
 // storageGroundClaim's optional nativeGround argument and initial survey selection.
 // Its one admitted caller passes the exact compoundGround result for the same
 // synchronous site only under the current native corridor guard. Cold/ordinary
 // calls retain the original survey. Cells, current title/work rights, named
 // recipients, paid receipts and all quantity/payment writers remain unchanged.
 // The external writer corpus, inspector and title-dirty call count stay exact.
 // Reviewed af07d28: exactly four new pure pending-reservation helpers are
 // inserted after compoundPolys. Removing that contiguous block reproduces the
 // prior managed region byte-for-byte. They read current native endpoint/project
 // geometry and return local polygons/clearance; the optional joins Map lives
 // only inside one certified synchronous validation. Reciprocal fit setbacks
 // grant no extra land. Existing cash, goods, title, custody and payment writers,
 // the external corpus, inspector and title-dirty count remain unchanged.
 // Reviewed assembled lifecycle: actual canonical gifts, native paid recovery
 // authority/reserves/fabric consumers, pure private-purpose housing predicates,
 // guarded reservation bounds and completion-only connection metadata. Existing
 // cash/goods/title writers remain native; source-specific gates are separate.
 // Pure UI quotes (#27): storageRoute skips writing s._storageRouteSignature and
 // s._storageGraph when QUERY_LAND_VALUES is active or the settlement is frozen,
 // caching on the local batch C when provided. Simulation routing, quantity,
 // title, claim and payment writers are unchanged.
 assert.equal(digest(source.slice(a,b)),"bd9e0a41a1118ac017811127174cc37509044ac3de2a5263b10612fb263a4096");
 // This explicit worker inspector copies existing balances. Pin the entire line
 // before excluding it so a future mutation cannot hide behind the read exemption.
 const inspectorLine=source.split('\n').find(l=>l.trim().startsWith("if(kind==='household'){const h=W.households.get(payload.id);"));
 assert.equal(digest(inspectorLine),"277f2b74eb272b2cf60044723871d434e72e0bfa7add685246696265b292ddfc");
 const outside=(source.slice(0,a)+source.slice(b)).split('\n')
   .filter(l=>l!==inspectorLine).filter(l=>/_owners|storageClaimTables|\.held(?:\[[^\]]+\])?\s*(?:=|[+*/-]=)|\.sale(?:\[[^\]]+\])?\s*(?:=|[+*/-]=)/.test(l)&&!l.includes('const inc=tradeIncome(s,hh.tr,counts),herd=s._owners?.get('))
   .map(l=>l.trim().replace(/(?:G\.land&&G\.land\.lordTex|W\.land&&G\.landView\?\.lordTex)/g,'LAND_VIEW_GUARD')).sort().join('\n');
 // The herd reader now accumulates four species in one owner pass, preserving
 // each species owner order; no external ownership writer changed.
 // Sort to tolerate declaration moves; exclude the added read-only herd inspector,
 // and normalize the land-uniform guard. Canonical claim and balance writes match HEAD.
 // Re-pinned with the embedded docs excluded: the corpus is identical at 9c66076, cd2eab8, e472d30 and HEAD; only stamped doc lines had varied.
 // Tick-cost: the smith/weaver owner scan is skipped when no owner holds ore and charcoal (or wool); one copy of _owners, no writer changed.
 // Meat (batch 9): the lords' halls eat through eatFood; herdOwners and martinmas read the families' beasts (x.animals) in owner
 // order. No held or sale writer outside the region changed.
 // Courts (#37, batch 11b): hallmotePlan reads only a cash-short defendant's native animal row into the sitting's scratch budget; a funded
 // judgement decrements that row and leaves stores unchanged, passing the sold beasts to the reeve's existing unassigned herd.
 // The family's breeders, team and subsistence and the buyer's reserve survive. No commodity/lot/title or journal writer changed;
 // justice.test.mjs proves real funding, shared budgets, herd and money conservation, and an adjourned quote's lack of writes.
 // Wool supply (#51): sheepLand reads each freeholder's existing native animal row into phase-local land/food/feed budgets.
 // No commodity, claim, balance or journal writer changed; production-inputs.test.mjs covers real flocks, funding and land rights.
 // Annual accounts: the distraint transfer additionally names q.home; its payer, amount and animal decrement are unchanged.
 // Courts (#37, batch 11c): courtGrazing reads native animal rows once in an overstocked month's reckoning, into scratch
 // grazing shares and bounded presentments. The two fine-only case kinds never invoke the existing distraint writer.
 // No quantity, claim, balance, title or journal writer changed; justice.test.mjs covers the shares, pardons and purses,
 // and world-save.test.mjs saves the native household references of both presentments.
 // Courts (#37, batch 11e): the only added outside claim line is courtFelony's direct native owner-row
 // lookup for evidence at joining. Coin, goods and beasts remain with the household; no claim, balance,
 // ownership or journal writer changed. Justice and fresh-save fixtures cover the snapshot and live reference.
 // Royal justice (#37, batch 11f): scratch stock is quoted from the defendant's existing row. A funded
 // hearing moves canonical balances by transfer (cause forfeiture), or native legacy titles and matched
 // claim debits/credits. Animals pass from the family's herd to the Crown's sale stock; town totals stay.
 // Free confiscated stock blends zero purchase cost into the Crown’s old reserve by actual quantities.
 // royal-justice.test.mjs covers both ledgers, cost basis, spent evidence, protected stock, shared budgets and coin;
 // the forced-era native world-save fixture covers the real accounts, rulings, circuit and continuation.
 // This batch changes the outside corpus only in abbeySummary: detached scalar
 // industry totals, reasons and copied operator/power receipts read current stock.
 // It adds no exemption or stock writer; the explicit household inspector and
 // storageTitleDirty call count remain pinned unchanged.
 // Reviewed c2059ac..e2fa455 outside diff: abbeySummary alone adds detached
 // scalar offer identity/status/dates, genuine quoted service terms, actual paid
 // travel/board and copied refusal reasons. Its existing _owners read is unchanged;
 // no external ownership writer or inspector exemption is added.
 // e2fa455..cd82178 leaves this outside corpus byte-identical. The frozen
 // ABBEY_APPROACH_SURVEY_NATIVE constant holds geometry function identities,
 // not native account/state/stock; it adds no corpus exemption. The pure geometry
 // contexts and unchanged public projection require no private-field expansion.
 // The only new outside corpus line is readonly abbeySummary: copied current
 // layout, meal, chapter and connected-component geometry metadata. The other
 // 51 lines, explicit inspector and title-dirty count remain byte-identical.
 assert.equal(digest(outside),"6b051b7bb494a0e07a4a389ead649eadc0081066e3e8020c04dcab6b01c16686");
 assert.equal((source.match(/storageTitleDirty\(/g)||[]).length,3);
});

// Exercise the actual pure transport bodies without generating or advancing W.
// Licence/recruitment books stay private; the retained paid construction path
// and physical footprint remain available to drawing.
test('retained Abbey licences and recruitment books stay private while actual approach geometry crosses',()=>{
 const helpers=source.slice(source.indexOf('function visualScalars('),source.indexOf('// DELTA.'));
 const put=source.slice(source.indexOf('function visualPut('),source.indexOf('function visualSeal('));
 const project=source.split('\n').find(l=>l.trim().startsWith('project:q=>')).trim().replace(/^project:/,'').replace(/};$/,'');
 const c=vm.createContext({});vm.runInContext(helpers+'\n'+put+'\nconst nativeProject='+project+';',c);
 const raw=vm.runInContext(`(()=>{
   const privateNames=['approachClaim','approachPayments','approachPaid','approachCash','accessDonor','abbeyRecruitment','skilledOffers','skilledRecruitmentPlans','recruitmentPaid','_skilledOfferDay'];
   const q={id:'abbey:0:project:0',type:'compound',key:'church',site:{f:{x:200,z:0,w:12,d:22,rot:0},path:[{x:200,z:11},{x:200,z:14},{x:0,z:14}],access:{endpoint:{kind:'road',ref:0,segment:1,point:{x:0,z:14}},privatePolys:[[{x:3,z:12},{x:200,z:12},{x:200,z:16},{x:3,z:16}]]}},
     approachClaim:{cells:[1,2],recipients:[{id:'household:hh1',due:3}]},approachPayments:{'household:hh1':3},approachPaid:true,approachCash:3,accessDonor:0,
     abbeyRecruitment:'abbey:0',skilledOffers:[{person:{id:1},household:{id:'hh1'},state:'outward'}],skilledRecruitmentPlans:{tanner:'native household offer'},recruitmentPaid:2,_skilledOfferDay:1};
   let reads=0;Object.defineProperty(q,'economicAccessor',{enumerable:true,get(){reads++;return {holder:'private'};}});
   const before=JSON.stringify(Object.fromEntries(Object.entries(Object.getOwnPropertyDescriptors(q)).filter(([,d])=>Object.hasOwn(d,'value')).map(([k,d])=>[k,d.value]))),record=nativeProject(q),geometry=visualGeometry(q),privateFlags=privateNames.map(k=>VISUAL_PRIVATE.has(k));
   const same=before===JSON.stringify(Object.fromEntries(Object.entries(Object.getOwnPropertyDescriptors(q)).filter(([,d])=>Object.hasOwn(d,'value')).map(([k,d])=>[k,d.value]))),result={record,geometry,privateNames,privateFlags,same,reads};
   result.record.site.path[0].x=-1;result.detached=q.site.path[0].x===200;result.record.site.path[0].x=200;return result;
 })()`,c);
 const out=JSON.parse(JSON.stringify(raw));assert.ok(out.same&&out.detached);assert.equal(out.reads,0,'native projectors never read economic accessors');
 assert.ok(out.privateFlags.every(Boolean),'reviewed books remain classified private');
 for(const k of out.privateNames){assert.equal(Object.hasOwn(out.record,k),false,k+' crosses project');assert.equal(Object.hasOwn(out.geometry,k),false,k+' crosses geometry');}
 assert.equal(Object.hasOwn(out.record,'economicAccessor'),false);assert.equal(Object.hasOwn(out.geometry,'economicAccessor'),false);
 assert.deepEqual(out.record.site.path,[{x:200,z:11},{x:200,z:14},{x:0,z:14}]);
 assert.deepEqual(out.record.site.f,{x:200,z:0,w:12,d:22,rot:0});
 assert.equal(out.record.site.access.endpoint.kind,'road');assert.equal(out.record.site.access.privatePolys[0].length,4);
 const drift=fs.readFileSync(new URL('./simulation-projection-drift.test.mjs',import.meta.url),'utf8');
 assert.match(drift,/project:\{abbeyOwner:[^\n]*approachClaim:/,'paid claim explanation belongs to project completeness');
 assert.match(drift,/approachPayments:/,'actual named receipt explanation belongs to project completeness');
});
