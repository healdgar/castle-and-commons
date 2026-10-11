# Daily simulation order

The day is the authoritative decision boundary. Every speed executes the same
serial `simTick`, with commands on the same simulation days. The user has
authorized a better model even when it changes previous histories. Calendar
intervals need a world reason: market days, contractual payment dates, seasons
or a physical duration. A cheap unchanged-input check can skip work within a
daily decision; an arbitrary six-day/monthly/yearly CPU throttle is not the
intended model.

The order was surveyed on 2026-10-10 and extended for the current institution batch on 2026-10-11. It is a
dependency-informed foundation, not a demonstrated globally optimal schedule or
centuries-per-minute clearance. The new paid institutional and building clients
make ordinary proposals daily; older mixed annual/monthly functions still need
their quantities and obligations separated.

## Evidence and contract

[SIMULATION-ORDER.json](SIMULATION-ORDER.json) records the survey of all **42**
original guarded phases at `39d929e`: source references, reads, writes, ownership
aliases, RNG, ordered records, helpers, caches and uncertainties. Its old-order
observations describe that source; they do not prescribe the redesigned model.
Root review corrected several old-chronology assumptions, recorded in
`corrections`. The current contract has **59** smaller phases and **200** directed
same-day prerequisites. The additional boundaries separate existing work; they
do not introduce a second simulation or runtime modules.

Four read-only Luna surveys covered economy, people, map and power. A syntactic
call-closure inventory assisted helper review. Neither that inventory nor the
human survey is a formal interprocedural proof: property accessors, callbacks,
class methods, aliases and state-dependent helper dispatch need explicit review.
Cache work must enumerate every writer of the proposed cache's inputs.

`node tools/simulation-order.mjs` reads the actual dispatch from the game's AST.
It rejects missing, duplicate, conditional or unaudited phases, violated edges,
cycles and settlement before the day's final writer. The tests exercise arrival
custody and actual freight transfers, provisioning before meals, quarry rate,
remaining construction demand, refreshed actor lookup and ward field handover.
Passing the graph check alone does not prove determinism or conservation.

Shared construction remains within these existing phases: each client validates
its authority/site/funding, `constructionProjectMaterials` installs actual owned
or purchased stock, and `constructionProjectPaidWork` advances saved fractional
days from actual net wages. Canonical completion then changes buildings/circuits
and the remaining demand. Castle and storage clients retain their own eligibility,
recipes, site checks and completion. Storage/fabric ground receipts use actual titled recipients and saved footprint
permissions (#63); these and institutional crop/meal ownership are checked by
the combined native gates, not certified by extracting the wage helper alone.

The current institution integration adds internal dependencies around the existing daily boundaries: paid teaching, technology discovery/local adoption and craft staffing run
first in economy, reading prior staffing/support and actual incoming contacts
before current crop/mill production. Three explicit abbey phases add actual
paid work after actor preparation, actual pantry gifts after markets/before
meals, and foundation/admission/commission decisions after upkeep. Existing government stays are fed before household meals, sharing actual person receipts with scholars, abbeys and funded hosts. Journey creation, fees and consent remain late: government runs first inside justice,
followed by daily personal-status decisions and existing due manor/eyre business.
Personal status is initially enrolled after native opening land and refreshed for
unknown actors in person preparation; migration records leave/flight before
departure. These are intended model changes, with combined gates pending.

## The fixed day

| Stage | Order and source | Same-day meaning |
|---|---|---|
| Opening | ownership → weather → politics → military → domains → forced dragon wake → threats | Authority and security use yesterday's closed demography/accounts. Current hazards, captures, siege lines and damage precede supply. Domains can found a settlement. |
| Arrivals | storage preparation → caravans → folk → travel → migration → person preparation | Every destination ledger is ready. Existing cargo arrives and its delivery payments settle. Folk counts inbound people before travel removes their trip; person lookup refreshes after mutations. |
| Rights and supplies | estate keeper work → abbey/Church staff/work → land → tenure → livestock → quarries → economy → incoming ships → metro → local carriage → spoilage | Current fields/plough teams and herd output feed production. Imports can pool into wards. Carriage puts output under cover before losses. |
| Living | market → abbey pantry gifts → government visitor board → population → households | Due markets provision using opening household sizes. Meals use current supplies before daily demography. Household decisions see the resulting hunger and purses. |
| Map and institutions | history → projects → growth → streets → paid parish/quarry/wharf foundations → churches → castles → courtyard redevelopment → infill → settlers → repairs → wall completion → ways → justice → garrisons → call to arms → stone demand | Remaining stock and accounts fund work. Courts can hear evidence generated by current household/road phases. New recruits are available to tomorrow's military pass. Demand reflects remaining work. |
| Departures | routing preparation → foreign loading/departures → domestic trade → errands | Final roads/tolls guide new domestic journeys. Meals and construction precede exports. Already-docked foreign ships load before domestic dealers select new opportunities. |
| Close | sovereign → envoys → titles → upkeep → abbey decisions → productive estate investment → storage investment → victory → commodity settlement | Current decisions/roles precede title and result records. Due pay and Crown household spending follow receipts. New storage commissions start tomorrow. All stock writers precede settlement. |

The order makes these feedback loops explicit rather than pretending every
consumer can see all future outputs of its own day:

- Politics and opening security respond to yesterday's closed hunger, population
  and finances; their consequences affect today's supplies and meals.
- Folk's discrete reconciliation uses the opening fractional population; meals
  then advance fractional births/deaths. Arrivals are counted once.
- Tenure uses the preceding market prices/price level for dated dues. The market
  sees those dues before provisioning and repricing.
- Ward ownership takes effect during Metro. Opening production belongs to its
  then-owner; later market/garrison decisions see the new owner. `syncOwner`
  updates field lords/titles at the transition, including previously uninitialized
  `_lord` markers.
- Quarry output is daily actual paid eligible work, with Sunday rest; it cannot come from an unstaffed quarry.
  Closing stone demand includes remaining paving and current church/castle
  proposals. Domestic trade sees that forecast; the next market uses it.
  Storage projects commissioned after financial close first enter work and
  the forecast tomorrow.
- Existing journeys keep their recorded route and dates. Household/army helpers
  can request a route before the closing preparation, so lazy invalidation remains
  necessary. One graph rebuild per day is not claimed.
- A berth occupied at the opening remains occupied through that day's incoming
  pass; departing ships free it in the closing pass. Annual port utilization is
  reckoned with the departures.

Shared household purses, lord/crown chests, ownership claims, RNG streams,
record/ID allocation and ordered journal callbacks prevent treating towns as
independent mutable jobs. The schedule is serial. Immutable preparation can be
shared only across consumers whose inputs have not changed.

## Daily work and remaining cadence changes

Daily trade now considers every origin. Its former every-fourth-day visit was
an arbitrary throttle. Existing margin, available goods, incoming cargo, real
merchant means and free drivers limit loads. Per-call market/destination-price
indexes remain shared across its candidate searches. This removes a throttle;
it is not intrinsically a speed optimization. Daily titles use the existing
change marker, so unchanged roles produce no new records. Stone demand is a
daily forecast, separate from the quantity produced by quarries.

| Existing phase family | Current cadence/debt | Daily conversion needed |
|---|---|---|
| Growth, land | Funded housing/refit decisions and work daily; field use still monthly | Native housing/fabric has saved paid duration and current eligibility. Separate remaining field quantities/tenure decisions from dated assessments. |
| Castles, churches | Paid native foundations and compound upgrades daily | Retained native geometry, prerequisites, paid material/work and current authority control completion. Parish gifts spread the customary annual quantity daily; Church assessments and order chapters remain dated. |
| Streets, courtyards, infill, settlers | Streets, purchased courtyard housing, infill and speculative landlord roofs have daily paid proposals | Geometry, rights and paid construction control new native maps. `tickCourts` is courtyard housing, separate from judicial `tickJustice`. |
| Folk, households | Monthly reconciliation/annual aging by place; annual family/career/housing pass | Due birthdays, life hazards and actor eligibility need daily rates/queues. Household choices must be split from annual rent, clothing, wine, winter-hay and pannage quantities. |
| Livestock, migration | Monthly herd/feed reckoning and opportunity pass | Convert production/feed quantities and stochastic hazards to daily rates; keep seasonal slaughter events. Cache grazing/opportunity inputs by their actual writers. |
| New government and foreign staffing | Ordinary charters, funded mayor service/replacement, overdue collector eligibility and actual foreign enlistment daily | Reserve real farm dues and use the current actual service budget; a foreign recruit receives only the actual advance to the next payroll date. Court/assessment/payment dates remain dated. |
| Legacy native military | Household hosts and local watch recruitment monthly; emergency militia decisions every other day | Existing per-visit recruitment/release quantities need deliberate conversion. These paths remain cadence debt; the new-institution conversion does not claim all older decisions are daily. |
| Tenure, justice, domains, ways | Contracts and assessments mixed with admission/recruitment/investment decisions | Keep genuine rent, quarter-day farms, court sittings and tax/upkeep dates. Separate vacancies, profitable offices, hosts, toll-house and route choices. |
| Market, metro | Monthly market; monthly pooling/annual amalgamation | Market cadence can be a world rule, but the current monthly horizon is not yet a chosen market-day design. Split pooling and ownership opportunities from dated services; use stock/price/topology changes for candidate invalidation. |
| Storage investment | Daily, from current exposed custody and funds | Native profitability and nearby-street bounds precede full site surveys; ordered proposals share only one synchronous pass. Eligible surveys start with fresh graphs. Cross-day reuse needs a complete geometry certificate ([audit](SIMULATION-CACHE-INPUTS.md)). Construction advances only by actual paid work, including fractional days. |
| History, repairs, threats | Mixed dated choices, event hazards and physical work | Keep due events; separate ordinary proposals from calendar guards, annual assessments and damage rates. Daily physical hazard conversion changes probabilities intentionally, but must be fixed across speeds. |

Live property certificates now separate geometry-derived kernels from current
population and security. `lvField` compares ordered current geometry inputs,
wall state and fear; `townWorth` reads current property rents. Operation-local
queries share only an unchanged native field. Same-size geometry changes remain
inputs, and the drawing-only `updateBuildingInstance` hook is not an
authoritative invalidation source. The implemented contract and its frozen
uncached comparisons are in [SIMULATION-GROWTH-INPUTS.md](SIMULATION-GROWTH-INPUTS.md).

Other reuse candidates are current household/person indexes (already partly
cached by day/revision), active owner/good rows, grazing summaries, construction
material totals, price-ranked destination lists and route/topology epochs.
Neither a whole-day food snapshot nor a single shared purse budget is safe across
intervening purchases/transfers. Preserve actual transfer limits at execution.

### Reuse within an operation, 10 October 2026

The operation-local kernel batch retained its then-current 52 phases and their cadence.
`tickTrade` owns a private, lazy candidate map lasting only for that synchronous
pass. Its first query visits `householdsOf` in canonical order and separates
dealers, carters and boatmen. Later selections reread purses and driver absence;
they retain merchant preference, first-wins ties, origin-before-destination
scans, destination fetching, self-driving and the same RNG draws. Missing hands
still enter `ladeOut` and record the existing missed opportunity.

Within the native departure call chain, purchases/borrowing change means,
`ladeOut` sets a driver's absence and `life` appends records. These operations do
not change household heads, trades, roles or mortality. Those writers belong to
earlier phases; the candidate map is discarded before the next phase/day. The
index falls back when its guarded selectors/purchase or the storage outcome
callback are replaced. It is not a persistent actor-eligibility certificate.

Commodity withdrawal planning also reads current custody each time. When the
private owner/good location set has exactly one member, it can read the live
balance and spoilage clock without allocating/sorting an ordered row list.
Transit, exposure, crumbs, tolerance, mutation and event order are unchanged.
Multiple locations and overridden `entries` retain the general path. No pantry,
quantity or purse is frozen for the day.

The next storage-investment dependency audit is recorded in
[SIMULATION-CACHE-INPUTS.md](SIMULATION-CACHE-INPUTS.md). It identifies the costly
site/route inputs separately from current exposure, ownership, means and prices;
the daily investment conversion and persistent quote cache are still pending.

## Map activity and payment

Movement can share payment timing without advancing the economy per frame.
The simulation creates a task with a real actor, counterparties, cargo, route,
start and due time. Its completion event moves custody and posts the existing
canonical transfer. The renderer interpolates position between those facts;
visual arrival, draw caps, camera range and speed cannot create a payment.
At fast forward, events still execute; the display can show only a recent subset.

Domestic caravans already provide this chain: `ladeOut` selects the actual
merchant and driver, buys cargo and assigns custody; `tickCaravans` resolves
arrival/siege delays; `ladeIn` pays the living driver's household on delivery.
A future activity projection should reference that consignment and actor and
report the amount returned by `transfer`, including partial/zero payment or loss,
rather than treating the requested fee as paid. It must not add a second wage.

Town walkers currently follow display routines without a purchase/work event.
Ordinary errand travellers have no corresponding payment. Institutional scholars and lords now retain actual board, tuition and attendance payments on their canonical journeys. Whole
household moves can post actual carriage only when the last living member
arrives. Ordinary foreign merchant ships still have an anonymous `out` counterparty. Funded foreign expeditions use actual registered finite foreign hulls, masters, crew, chests and native custody. A payment-synchronized
town routine therefore needs a real economic task and payer first. This batch
documents the contract and changes the phase timing; it does not yet add that
town-activity model or a new actor projection.

See [PERFORMANCE.md](PERFORMANCE.md) for the throughput budgets and validation.

The historical bounded growth/property implementation (2026-10-10) first separated daily occupancy and due falls from six-day housing/fabric and independent annual widening/vacancy. The current paid implementation makes those proposals daily and advances only actual installed materials and paid saved work. Live property certificates replace annual value authority. [SIMULATION-GROWTH-INPUTS.md](SIMULATION-GROWTH-INPUTS.md) retains the original audit; founding-only geometry dependencies for #59 are in [OPEN-SPACES-AND-CASTLE-SITING.md](OPEN-SPACES-AND-CASTLE-SITING.md).

First-castle foundations (#60, 2026-10-10) keep the dispatcher order: existing paid projects progress before growth, then daily first-foundation proposals see current growth/church geometry and begin work tomorrow. Exact occupied mask cells connect land rights and foregone value to completion and field production; remaining material demand closes before departures. Proposal/site selection is deterministic; completion uses the saved layout RNG. Existing castle upgrades now use the same paid saved compound channel; their functional native components and defensive circuits become available only at completion. The implementation contract is [CASTLE-FOUNDATIONS.md](CASTLE-FOUNDATIONS.md).

Estate keeper hiring/paid biological harvest runs after the current actor roll in `tickEstateWork`, before production and storage. New titled estate projects are selected after meals, project completions and abbey endowments in the closing `tickEstateProjects` phase. Wildlife growth is dated biological state; inspectors never advance it.

Learning, local adoption and craft contracts run in that order at the start of `tickEconomy`. The actual actor roll, household identities, early abbey/Church staffing and estate work precede them. A teacher, current keeper, monk, apprentice or paid employee is unavailable for a second full ordinary job; an independent craft master remains a native construction candidate. Current net work receipts, rather than an occupational label, support skill and output.

Within `tickGovernment`, lord journeys and dated credit settlement precede bench and assembly-of-estates work. Overdue unassessed grants reconsider an actual collector daily until their genuine expiry. Each place then funds current mayor service/replacement before annual farm payment, daily commune eligibility and due quarter-day recoveries. Monthly hundred/shire sittings close the visit. `tickChurchBodies` closes the parish/Church side after actual receipts; separately funded appointments first work on the following day. These are data dependencies, not new artificial monthly eligibility throttles.

Native manor and royal officer selection now checks current presence, literacy,
matching office identity and conflicting institutional duties. Quotes remain
readonly. Funded court or eyre appointments release only the replaced holder's
exact matching office and invalidate canonical work rosters in late justice;
the changed staffing affects tomorrow's ordinary production.

Current institutional details are recorded in the JSON `institution_integration` contract. Paid machinery completes in `tickProjects` after today's ordinary production, so its effect starts tomorrow. Abbey dairy/wool/ordinary crop shares are allocated once; its self-worked area is excluded from the ordinary tillers' grain. Church inheritance evidence follows actual creditor recovery. Foreign holdings and funded voyages update inside `tickKnighthood`, before domestic military work; actors aboard remain absent from home. No screen read makes equipment, advances an institution, changes a title or pays an account.

The own-use abbey industry adapter preserves the 59 top-level phases. Early
`tickAbbeyWork` first checks actual Church service, then refreshes membership
and due annual counters,
releases invalid or covered-day industry bookings, pays/recruits current staff,
and binds the resulting actual operators before calculating field and flock
hands. `tickLivestock`
creates skins only from actual lawful native slaughter; later `tickMarket`
butcher slaughter supplies subsequent production days. Inside `tickEconomy`,
public grinding and the abbey crop share one native mill workday; only public
work creates multure claims. The actual owned hide/timber recipe and finite
footwear wear follow crop/fish output and precede smith/weaver processing, paper
production and ordinary nonfood use. Paid retained mill/tannery completion
follows production, and closing `tickAbbeys` commissions first work tomorrow.
Actual additional hydraulic geometry crosses the draw boundary; operator jobs,
refusal reasons and annual/lifetime counters remain worker state and detached
inspector output. This intentionally adds the accepted own-use mechanics and
changes affected histories; same-speed/history/save discipline still applies.

The assembled static review at `85f0368` retains 59 phases and 200 edges;
`simTick` is byte-identical to its parent candidate. All 39 own-use-industry pins
match exact AST declaration slices. This survey change renews only the existing
`abbeySitePlan`, `abbeyMillPlan` and founding-quote pins, and separately records
the nine changed and six new survey/dispatcher/layout bodies. The recognized
legacy search inventory contains 417 sites across 1423 reported functions:
191 building, 73 street, 49 folk and 16 owner collection scans; 35 `heads_`,
22 `workers_`, 16 `headsOf` helper calls and 15 unscoped entries. Four additional
recognized occurrences cover the ordered geometry snapshot, public strips,
cached-building traversal beside its mutually exclusive native fallback, and
street observations on a rejected grant. These are syntactic counts, not
measured costs or a centuries-per-minute result.

Rural abbey surveys share native ordered building/project geometry only within
one synchronous proposal, across its existing candidate fields and poses.
Public strips are discovered lazily in that context. Conservative axis bounds
retain native tolerance and rotated-footprint clearance before the exact
predicates; changed helper identities select the original full traversal.
Every retained project's validation, payment and completion still read current
obstructions, endpoints, title permissions and grant. The local context and
legal callback enter neither saved world/layout roots nor presentation data.

Direct access still runs first. Physical building/hydraulic grant and power
checks can now reject before remote routing; candidate clearance runs before
private-strip subtraction and land pricing. Wheel/feeder ground is included
before this preflight. This authorized query order can delay initialization of
the static `LANDV` coefficient table by skipping `landPrice`; that table is
outside history/save roots and later fills the same fixed coefficients.
These changes carry no old-model 150-day identity claim. The JSON records the
exact source and dependency review separately from historical evidence and
the current source's pending native speed/save/conservation gates.

The later route adapter shares ghost-free terrain edges, native scope/circuit
lists and certified flood banks only inside that proposal. Its 53-function
identity certificate and current world/place/owner/day/size/cell/placed checks
guard reuse. Each candidate pose keeps a fresh ghost-edge memo; its current
ghost still uses the native interpolation and strict rotated footprint test.
First ghost rejection keeps the original paid-road query prefix, while signed
zero, off-lattice or long spans use the original segment loop. Floods speak for
another door only after native closure, first-step and search-box certificates.
Changed inputs supply neither shared terrain nor shared banks.

This context stays on local service walkers and returns only ordinary
path/street results. Host route recall accepts no `_em`, `settlement` or
`placed`, and its own temporary memo carries no `abbeyTerrain`; the added
`armySegmentClear` branch introduces no ordinary host-memory input. Its earlier
fixture pin change remains exact. The JSON records the three changed and five new bodies,
the separate certificate, and one added transitive-search function without
changing any of the 417 recognized site counts. Current-source generated
performance and native release gates remain coordinator work.

The current spatial adapter bins the same ordered building/project rows once,
retaining unknown, oversized and castle-reservation rows unconditionally.
Queries deduplicate and sort original row IDs before unchanged exact collision
checks; invalid or oversized bounds return all rows. No new recognized search
site or data source enters the day. `LandPath`, `Detour` and `Reach` certify once
at uninterrupted native entry and restore the guard/memo in `finally` on every
exit. Planner callbacks run after that scope has ended; standalone edge queries
keep their full checks. Only the changed host `LandPath`/`Detour` fixture pins
renew, while the service-only `Reach` body is pinned in the helper contract.
The previous candidate's fresh performance diagnostic failed at tick 50 under
the original deadline. This static review claims no current native performance
clearance and includes no subsequent corridor-aware planner.

Foreign population/food and current recruitment run first inside
`tickExpeditions`, before that phase's actual campaign combat. Recruitment is
daily and consumes one actual tool plus treasury wages advanced only to the
next twentieth-day payday; that payroll and the actual harvest stay dated.
Daily `tickGrowth` grants an eligible village's market charter after current
paid project completions and before housing and late commune choices. The
annual history visit still maintains its native peak/queue/aftermath work, but
no longer gates that charter.
