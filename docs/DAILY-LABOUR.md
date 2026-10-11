# Finite daily work: dependency record (#80)

Audited against assembled lifecycle source `ac59fc5` on 11 October 2026.
This records the next implementation dependency. It is not a claim that the
current simulation already allocates finite construction attendance.

Castle and Abbey campaigns create repeated real purchases and wages. Their
physical effect depends on available people as well as funds and materials.
Current project work advances from the paid fraction of a monetary labour
recipe; `buildWorks` pays named heads but reserves no shared daily attendance.
Several projects or upkeep bills can pay the same builder while ordinary craft
activity runs independently. Neither this finding nor its correction warrants
new coin, a guaranteed spending multiplier, a wage ceiling or a pinned purse.

## Actual consumers and existing order

| Consumer | Current work/payment mechanism | Allocation dependency |
|---|---|---|
| Component, fabric, storage, castle and public road projects | `constructionProjectPaidWork` → `buildWorks`; actual purchased materials | Progress follows accepted recipe work, not payment alone |
| Direct walls/foundations, rural housing, carriage, roads, petitions and grange clearing | Direct `buildWorks` bills | Share the same daily crew budget; project-only changes are insufficient |
| Equipment projects | `workers_`, named direct transfers and paid-gold progress | Claim actual eligible crew before payment and progress |
| Quarry | Present named quarrymen; output scales with paid hands | Retain actual strength and goods; reserve their attendance |
| Tournament lists | Stored builder identities with daily wages | Revalidate presence and claim the same persons |
| Ordinary craft services | `craftWork` fee pools → `payCrafts` weighted heads | Work, availability and actual recipients must agree |
| Abbey cultivation/industry, estate and port-health jobs | Existing assigned people and paid-day/area/output semantics | Preserve occupational exclusions and account for actual concurrent uses |

The existing daily sequence runs quarry work before `tickEconomy`, then learning,
technology, craft/equipment and commodity production. Storage and scheduled
market/service settlement follow. Projects and native construction/growth come
next, then routes and trade; later upkeep, Abbey work and estates also consume
labour. One allocator must therefore begin after the clock advances and before
the first consumer, remain valid through the whole `simTick`, and be discarded
at its end. It cannot reset per phase or per project.

`workers_`, its hungry-hand fallback and `dayHands` currently omit an away check.
`payCrafts` also omits away status; `craftPresent` checks it, but `tradeCounts`
counts more heads and supplies the current service availability gate. Actual
travel, death and job assignment may change during a day: even a reused candidate
list needs live eligibility validation when work is claimed. Institutional jobs
already exclude many office-holders, pupils, tutors and hired employees; ordinary
independent masters remain potential concurrent users.

## Order for the next refactor

1. Define recipe work units from their real quantities and existing attendance
   semantics. The ordinary day wage `foodYr()/360` already appears in quarry and
   tournament recipes; it is a candidate conversion for monetary labour, not an
   adopted calibration. Technology currently scales both labour and duration.
   Specify construction, ad-hoc upkeep, equipment and service conversions before
   changing their consumers.
2. Resolve scheduled craft demand explicitly. `tickMarket` currently settles a
   place's monthly service demand in one daily phase. A market-day service can
   consume work that day; daily work with later payment requires an actual pending
   obligation and named recipients. Do not silently divide a monthly workload
   into thirty unrecorded days or treat monthly fees as one person's daily wage.
3. Create one transient day-scoped allocator keyed by canonical person identity.
   Preserve native candidate and project order, use fractional capacity only
   where the source has real attendance/strength units, and recheck presence and
   employment on each claim. Keep the allocator outside saved world/DTO state.
   Save actual unfinished orders where required, rather than a second ledger.
4. Route `buildWorks` and direct named-crew consumers through accepted work and
   named payments. Materials may remain installed on an understaffed project;
   work and output advance only by the allocated units. Preserve existing
   material ownership, title, food reserve and unfinished-site validations.
5. Join ordinary craft orders and their actual recipients, then Abbey field and
   maker capacity. Unserved demand stays unpaid/unfulfilled or becomes an
   explicit owed order under the chosen service rule. Resource yields without
   individual assignments do not gain invented workers.
6. Verify conserved coin/goods, live absence/employment, two competing projects,
   mixed upkeep/craft demand, partial work and native save continuation. Batch
   determinism across speeds and worker/reference with the intentional model
   change; measure the actual worker-selection reuse before claiming speedup.

No new daily phase is required solely to provide a shared ledger. Any phase/order
change must be justified by the resolved work/payment dependency and recorded in
`SIMULATION-ORDER.md` and its machine contract before implementation.
