# Compound buildings: shared model and dependency record

Status: shared paid construction, castle upgrades, native abbey institutions and their compound adapters are integrated in the unpublished working batch, updated 2026-10-11. The frozen `2d81f11` production source has 1,965 unique checks verified across the coordinator's combined suite and reviewed fixture rerun; subsequent source corrections await their own integrated gate. Final native history/save, paid-institution, conservation, worker and drawing gates are active or pending; those checks do not yet establish a published release, calibrated economics or century-scale throughput. The first-castle foundation remains deliberately bounded; see [CASTLE-FOUNDATIONS.md](CASTLE-FOUNDATIONS.md). This record describes the implemented shared mechanics and their remaining scope limits.

## Decision

Represent a compound as a connected, site-bound arrangement of canonical physical components. Each physical building remains one native building with its existing identity, archetype, geometry, title and owner. A building may support several purposes at once: residential, defensive, productive, worship, administration, hospitality, storage, or circulation. These are compatible functions over one physical object, not mutually exclusive building kinds and not duplicate buildings.

Purpose is a capability of a real component, with its existing system hooks supplying the effect. A keep that houses a lord is still the same building used by castle and residence systems. A grange is still the native productive/storage building, owned by the abbey. A chapel may be both worship space and a compound component. The compound graph records composition and construction dependency; it must not become a second ownership, inventory, income, or defense simulation.

The compound layer provides common site, component, connection, project and capability references. Institution adapters retain the rules that decide who may build, whose land is used, which account pays, how benefit is measured, and where later income goes. Castle authority and abbey corporate property are different adapters over shared construction mechanics.

The next architecture phase extends this same engine for connected layouts in
castles, abbeys and other compounds, with institution-specific layout adapters.
[COMPOUND-LAYOUT-PHASE.md](COMPOUND-LAYOUT-PHASE.md) records the accepted shared
requirement, current client audit and proposed bounded paid cloister stages.
Those layout and covered-walk additions are not implemented yet.

## What exists now

Issue #60's castle foundation operation uses existing ruler authority, seat/fort/border relevance, purse and reserve, town worth and threat, castle benefit criteria, live terrain and road geometry, agricultural land rights and foregone field value, native timber/stone prices and inventories, named builders/workers, a saved daily project, remaining construction demand, and the existing fortification/worker/rendering model. The foundation is one canonical keep plus a palisaded yard and connected approach. The yard is needed because `fortOf` grants circuit defense; a lone keep gives no circuit benefit. Current first towers require locally adopted stone-keep knowledge (historical invention AD 1080); earlier or unadopted sites use timber. The site and works are rechecked; paid materials and labor persist. Later castle upgrades now commission saved paid daily projects through the shared compound service. No unpaid annual upgrade is installed by `tickCastles`.

This is not a general castle precinct editor or a universal multi-building plan. `s.compounds` stores stable, plain references to native buildings, circuits, hydraulic features and estate fields; projects carry physical prerequisites and a component key. Castle, abbey, college and estate adapters use those references, without a second inventory or geometry model. The first keep and yard remain modest, with no automatic domestic/service range, terrain-fitted motte foundation or town circuit. Shared stock installation and daily paid work serve the castle foundation, compound and storage clients; native fabric/road clients retain their own completion rules. Each client keeps its eligibility, site/access validation, economics and actual payer. The service records installed materials and cash delivered through named wages. Storage no longer advances a full day merely because `buildWorks` was called when no wage was paid.

Storage's ground-payment client now resolves every native parcel touched by its footprint, rejects another tenant's unreleased holding, and pays actual titled recipients. A saved receipt contains only delivered cash; use of a payer's own ground retains the opportunity quote but transfers no coin. An unpaid changed title certificate stalls work; an actually paid fixed footprint licence survives parcel succession without charging twice. The building retains canonical corporate or household title and marks its exact footprint. Its final native conservation/save gates remain with the coordinator.

Issue #35 now has actual funded founding, granted land/title, corporate accounts, native membership and hired staffing, food obligations and daily compound investment. Church, residence, grange, hospital/guest service and school components use paid retained projects. Owned ponds, sheep/wool, order-specific leasing and parish appropriation use their actual land, stock, workers and receipts. Own-use mills and tanneries are also integrated: qualified exclusive operators share finite work, grinding retains the actual grain, and tanning consumes actual slaughter hides and bark before leather is worn. Presence of these clients is implementation status; the coordinator's final native gates remain the operability evidence. [ABBEYS.md](ABBEYS.md) records their account and order rules.

## Canonical records and responsibilities

The shared runtime record remains small and refers to native state:

- **Site / ground:** settlement/place identity; coordinate and local terrain reference; explicit boundary and exact affected ground cells; ownership/title/occupation checks; allowed public and private access connections; occupancy/reservation links; a geometry certificate only if every relevant input writer is enumerated. Keep the existing land mask and furlong/title model authoritative. A castle may use its ruler's eligible unheld demesne; an abbey may build only on land actually held/granted to the abbey under its institution rules. A public approach may meet a street, but does not silently transfer the title of fields the path crosses. Record foregone yield over the exact union of affected cells once. This is an opportunity cost, not cash transferred to oneself.
- **Compound:** stable ID, settlement, institution owner reference, site ID, connected component references and stage. It owns no independent purse, store, title or output quantity. Component/edge identities must be deterministic and saveable.
- **Component:** reference to its one canonical native building, fortification circuit, hydraulic feature or productive estate field. Preserve native archetype, dimensions, placement, `ownerId`, title, tier, occupancy and geometry. Component relations state adjacency, access, enclosure, or physical support. A compound wrapper must not duplicate the object's identity or be independently drawable/operable.
- **Purpose/capability:** a set of enabled purposes linked to existing operational hooks. Store only prerequisites/state that cannot be derived from the building and its institution. Each capability names its input/output, workers, payer/recipient, operation cadence and stopping conditions. Where the hook is not implemented, mark it as a future hook; do not emit substitute production, profit, lodging, defense, or staffing.
- **Project:** one persistent paid plan for new work on a compound. It references owner, site, components to add, construction dependencies, material recipe, quoted labor and work duration, purchased/installed amounts, actual paid wages/work, and stall/abandon/completion state. Existing native ledger and purse remain sole source of materials/cash. The shared project service owns construction bookkeeping; clients retain institution eligibility and their economic reason to build.

Physical components can be built in differing order where the design allows it. A dependency graph expresses the chosen plan: e.g. site/access before a keep, keep and yard circuit before claims of protected share, church before cloister-dependent functions, or a productive building before its output capability. It must not impose one universal castle/abbey sequence. A capability becomes active only when its required component and operational conditions are met.

## Institution adapters

### Castle

Authority is the actual crown/house or current lord's qualifying seat/fort/border role, not mere ownership of any village. Use the same payer that controls the actual ruler purse and its existing reserve rule. Quote defensive value with `townThreat`, `townWorth`, and the real `fortOf` circuit result, plus applicable seat value; a component with no existing defense effect has no invented defensive gain. Current first-foundation eligibility, fixed-site checks and construction duration are documented in `CASTLE-FOUNDATIONS.md`. Abandon when the patron loses qualifying ownership/authority or the planned place/component becomes invalid; siege and temporary shortage stall work under the current foundation semantics.

### Abbey

The implemented adapter uses the real #35 corporate record, `abbey:<id>` native `ownerId` / `storageOwnerId`, and `acct` / `means` / `transfer`. Founding transfers existing founder silver and actual free-alms titles, including `f.alms`; it creates no people, stores or annual income allowance. Cistercian grants are marginal unheld ground with self-worked granges and no early serf rents or appropriated parish tithes. Benedictine and Augustinian policies may accept actual cultivated demesne or a lease's landlord title, preserving the native tenant's work right and crop share. Wool sales, gifts, corrodies and purchases use actual accounts and stock. Where the order permits appropriation, the patron, funded bishop and actual serving vicar are required; the parish and vicar retain their real portion.

Abbey construction eligibility uses the actual chest and ledger after food, mouths, obligations and reserve. Founding needs house/crown surplus beyond existing obligations and funding for first works, with order/site fit such as Cistercian waste/wood. The institution cannot take town buildings without purchase/title or claim rent/wool from land it does not own. Incremental value and cost must account for flows displaced from the founder; transferred rents are not new realm income. Assigned industrial members cannot also supply a full farming/shepherd day, and a building label does not supply an operator.

## Paid construction and operations

The implemented common mechanism uses native `W.projects`, `tickProjects`, `buildWorks`, `buyBuildingMaterial`, `consumeOwnStock`, native commodity demand, and the paid castle foundation path:

1. **Cheap eligibility and value bound.** Check institution authority/ownership, duplicate/pending compound, current role and capability prerequisites, live threat/need, purse/means and reserve, and a conservative minimum cost/payoff bound. Do this before surveying candidate sites. Daily cadence follows a genuine daily decision boundary and active work; never use elapsed CPU time or an arbitrary decision throttle.
2. **Bounded site choice.** Survey only a bounded set of plausible candidates after that bound passes. Check exact geometry, land/occupation/title, streets/access, water, terrain, buildings/lots/greens, pending projects and reserved footprints against current canonical data. Record fixed chosen geometry and exact intersected ground. Do not move a paid foundation without re-quoting/re-authorizing and handling the sunk work explicitly. A cross-day cached proposal is valid only with a complete certificate and enumerated invalidation; otherwise recompute cheaply or freshly validate local fixed-site geometry each paid day and at completion.
3. **Commission and stock.** Make a saved project only after all components, rights, access, purpose/dependency graph, owner, payer, material requirements, labor quote, duration and net value are viable. Reserve the actual site; do not reserve imaginary land, stock or cash. Material may be consumed only from the payer's own native stock or purchased from available native sellers at current prices. Install exactly the quantities used by the quote and expose only remaining demand to trade. Partial purchases remain partial; do not flag materials installed until actually secured/consumed.
4. **Progress.** Buy and install material according to the chosen project policy, then advance work only by the actual cash delta that `buildWorks` paid to named recipients. No crew means zero paid progress. Paid portions advance a saved fractional worked-day amount; unfinished wages/materials remain a real project liability/sunk input, not a refund. Insufficient cash, sellers, workforce, site, lost authority and siege have explicit stall/abandon rules. Current castle order validates authority/site before buying material or wages; carry that invariant into shared work.
5. **Completion.** Revalidate the owner, site, access and all required components before instantiating canonical buildings/circuits. Update native land occupation, rights, layout, fort preparation, maps and save state from those same objects. Complete capabilities only after the physical dependency exists. Avoid marking agricultural ground unavailable twice; exact union of intersected mask cells governs foregone value and completion occupation.
6. **Operation.** Existing simulation hooks consume the native objects. Castle defense reads the ward circuit through `fortOf`; a keep may gain residential use only through native occupancy/housing. Abbey feeding and labor use the abbey's actual stores and named people; grange crop/rents, wool sales, tithes and church works hook into the specified `SYSTEMS.md` phases. A productive purpose is not active merely because a component exists: real land, beasts/workers, inputs and output ownership must be in place. The map/worker projection reads completed and pending native geometry and never selects a site or pays.

For a component serving multiple purposes, each purpose must refer to the same physical geometry and ownership. Shared costs and land opportunity cost are charged once, and shared output is recorded once in its native owner ledger. Defense, residence and production may interact through land/space, access, staffing, damage, siege and occupancy; those constraints belong in the actual affected systems, not in a one-purpose enum.

## Daily dependency order

The current order already gives useful boundaries: opening ownership/politics/military/domains/security; arrivals and person refresh; land, tenure, livestock, quarry, economy and trade supply; market and households; then map/institution work (`projects → growth → streets → churches → castles → ... → garrisons → stone demand`); departures; and closing accounts. Preserve same-day consequences and serial determinism.

The shared compound clients follow these dependency boundaries. Abbey work/staffing runs after person refresh, meals after market provisioning, and further institution investment after upkeep; [SIMULATION-ORDER.md](SIMULATION-ORDER.md) records the canonical phases.

1. Owner/authority, siege, rights/title, site obligations and institution status must be current before a project eligibility decision.
2. Current production, actual receipts, pantry/provisioning, obligations and account balances establish each institution's available means before commissioning or construction payments. Do not decide an abbey's annual/daily surplus before its actual rent/tithe/wool transfers and feeding obligations are recorded.
3. Cheap eligibility/value checks precede site survey. Site selection and project reservation precede spending. Any land title transfer/grant is a real institution transaction and updates rights before work can claim the land.
4. Active saved projects revalidate and pay at the existing projects phase; new commissions after that phase begin paid work next day. Native stock/material purchases happen before the outbound trade forecast is closed, and aggregate remaining demand once per owner/place/good. Demand must count secured/installed quantity exactly once.
5. Completion installs component identities and updates title/occupation/layout/fort indexes before any later same-day readers of those structures. If the construction phase sits after a relevant capability consumer, that capability begins on its next valid phase/day. A completed circuit must be visible to the applicable defense/siege reader without rendering as a second building.
6. Existing operational hooks then read the same native objects and account owners. If a capability produces goods or rents, credit them in that system's existing phase, with no duplicated compound-level shadow output. Closing commodity settlement stays after all stock writers.

Do not insert a second overlapping daily scan after the castle pass. Proposal eligibility is separate from active paid progress, and remaining material demand must reflect the last construction/material writer before outbound trade. Projects run before castles, with stone demand after them; first foundations and existing castle upgrades are considered daily in `tickCastles` and enter paid work tomorrow. Genuine construction quantities/durations remain separate from decision cadence.

## Technology and capability hook

Realm knowledge, historical/prerequisite gates and place-level adoption are implemented in #44. In an initialized world, `constructionCapability(s,method,ad)` delegates to the native `technologyCapability`; construction needs known and locally adopted methods and their prerequisites. [TECHNOLOGY-RUNTIME.md](TECHNOLOGY-RUNTIME.md) records the runtime and [TECH-TREE.md](TECH-TREE.md) its historical design. Knowledge may authorize a recipe or feasible form, but does not create a building, machine, output or income.

Castle stone keeps use the real AD 1080 knowledge/adoption rule. The legacy AD 1070 calendar fallback exists only before technology initialization, including older isolated fixtures; it is not an initialized world's unlock. Stone curtain, round tower, barbican and outer-curtain clients query the same native capability seam. `constructionTechnologyRecipe(s,material)` supplies fixed labour factors and additional real tool timber for adopted wheelbarrow/crane methods; paid quotes must purchase/consume that timber before claiming the reduction. Do not duplicate adoption flags in a compound or confer machinery productivity from knowledge alone.

Abbey order availability uses `institutionalCapability` with the same knowledge/adoption seam, while actual founding, grants, charter and order restrictions remain institution rules. English Cistercians are gated from 1128 and Augustinian houses from 1100; early starts retain the Benedictine option. Neither an order becoming available nor masonry knowledge fabricates a foundation or abbey church.

## Implemented refactor and remaining scope

1. **Bounded paid castle clients.** First foundations and upgrades retain real defense/value/site/economy gates and saved paid work. Daily paid upgrades deliberately change development histories; their final native gates remain with the coordinator.
2. **Exact native ground, access and component identity.** Shared queries use the authoritative mask, titles and physical footprints, with reusable native component references and multiple purposes. Correcting mask-cell dimensions intentionally changes affected placement histories; it is not an equivalence claim for the previous geometry model.
3. **Shared funded project service.** Material stock, purchase/installation, actual `buildWorks` payout, fractional paid days, stalls, demand, save/load and completion boundaries are shared. Eligibility, value criteria, site survey, payer and recipients remain client inputs/adapters, preserving each client's actual economics and geometry.
4. **Canonical component dependencies.** Connected access, circuits, construction stages and physical prerequisites refer to native buildings, hydraulic features and fields. Downstream readers consume those native objects, with stable identities and renderer/worker projections rather than a second physical model.
5. **Use the implemented tree capability service.** Recipes and feasible forms read realm knowledge and local adoption. Equipment is separately paid and installed; pre-initialization calendar compatibility does not replace initialized-world prerequisites.
6. **Keep the real abbey institution beneath its compound adapter.** Funded founding, title/endowment transfers, corporate account/storage owner, feeding/people obligations and real production/payment flows now precede its compound investment. Each physical component remains canonical. Further clients must meet those same funding and ownership conditions.
7. **Further composition.** Additional domestic, productive, worship, hospitality and defensive capabilities require real labor, land, ownership, output and combat consumers on canonical components. Combined account, inventory, land yield, defense, save/replay and worker projection gates remain serialized through the coordinator.

## Performance and verification boundaries

Eligibility must be cheaper than geometric site evaluation. Preserve stable tie-breaking and bound fully surveyed candidates (the current castle examines at most 24). Iterate only existing institutions, active projects, and bounded candidate sites; do not scan all parcels for each component or call a whole settlement generator. Aggregate outstanding stock demand in one pass per settlement/good/day rather than nesting project scans in every seller. Fixed active geometry may be checked from a local bounded footprint each work day; wider cross-day caching requires a complete certificate covering same-size geometry changes, land/title/occupation, road/access, buildings/lots/greens/water, walls, reservations, owner/authority and siege as applicable. Cache seasonal/economic quantities only with their existing authoritative writers and current-day inputs accounted for.

Correctness gates precede performance claims: account conservation, actual seller stock/cash, named wage recipients, partial payments and zero-worker stalls, no duplicated land loss/value/output, no free or duplicated native structures, ownership changes during construction, siege/site obstruction, completion and save continuation, replay determinism, worker projection purity, and defense through the actual circuit. The source-specific suite evidence above is bounded; [historical validation record](https://github.com/healdgar/furlong-kingdom-annals/blob/a23ecc032754a303c70f84a4d4e90ea8cbba0101/docs/HANDOFF.md) preserves the earlier native gates. Current validation and release limits are tracked only in [ISSUES.md](ISSUES.md#institution-validation). No calibration or throughput result follows from the shared architecture alone. Opening frontage #61 still has recorded local housing shortages; a bounded site search can exhaust its sampled candidates without proving that no eligible land exists elsewhere.

## Risks and unresolved choices

- A canonical native building currently has a single `arch`; multi-purpose semantics must be a set of capabilities over that one `arch`, not multiple arch identities or duplicate `s.buildings` rows. Some purposes may require a separate native circuit/parcel object, as the ward does, but that object must be authoritative where existing defense/land code reads it.
- The compound's geometry graph can accidentally shadow layout, land title, fort circuit, or building instance state. Prefer stable references and atomic updates to existing authoritative models; keep derived connectivity recomputable.
- Land rights and productivity are coupled. A component's exact footprint and access must be applied once to both opportunity value and production eligibility, including every intersected agricultural cell. Self-use of own land has no synthetic cash transfer.
- Funded-project quotes can become stale as prices, owner, role, danger, workforce or access changes. Freeze actual work quantities once commissioned but recheck current cash, legal authority, required site and material supply each working day; identify which estimate is fixed and which facts are live.
- A paid project that loses its owner or site can strand real sunk work. Abandonment should leave that history/accounting truthful; no invented refund or automatic relocation.
- Castle defense can be overclaimed if a standalone keep or decorative defensive purpose is mistaken for a live circuit. Use `fortOf` and `defenceOf` outcomes, not labels.
- Abbey economics can be overclaimed if endowed rents are treated as realm growth or its account receives projected wool/tithe before the assets and market operation exist. Preserve #35's actual native title/output transfers and recorded costs, food and labor.
- Multiple purposes can compete for room, access, labor, feedstock or occupant capacity. Resolve conflicts in the relevant simulation system and preserve canonical ownership/output; never solve them by disabling a purpose enum or double-booking the same physical area.
- Castle upgrades and abbey church growth now use saved paid projects; ordinary fabric and road clients retain their actual paid adapters. Generated opening buildings remain initial world state, not a fabricated history of construction payments. This does not provide a universal precinct editor, unrestricted building composition or a fully calibrated construction model.

## Shared runtime interface (working batch)

`compoundEnsure(s,kind,ownerId)` establishes a deterministic site-bound record.
`compoundBindBuilding` stores one native `idx`; `compoundBindCircuit` stores one
`fortCircuitKey`. Purposes are memberships over that same object. They do not
add housing, income, output or defense: native systems remain authoritative. A
keep is not in `RESID` and the compound does not invent occupants for it.

`compoundProjectCommission(s,C,plan)` accepts a source-selected adapter, fixed
geometry, physical component prerequisites, named payer, timber/stone quantities,
positive labor bill and working days. One active project per compound prevents
duplicate ordering; its deterministic ID uses the compound’s saved sequence.
The shared tick validates authority/site/prerequisites before stock or wages,
installs only actual stock, and advances by the native named wage payout. Saved
work survives stalls; loss of legal authority abandons sunk work without refund.
A final validation precedes the institution adapter’s canonical completion.
Adapter functions are source globals, never saved closures.

The abbey contract is `abbeyCompoundValidate(q,s,C)` returning `{ok,reason,abandon}`
and `abbeyCompoundComplete(q,s,C)` returning truthy only after actual installation,
rights, mask and layout updates. `live.compoundSite` surveys a native footprint
and a reachable public connector at most 32 metres from its service door. It
rechecks the retained footprint and path each work day; completion does not move
paid work. The institution must validate the exact union from `compoundGround`,
including the approach’s 2.6 metre width, against its actual granted title.

Castles retain canonical keep identity during rebuilding. Clear wards fit live
terrain and frontage; new wards, enlarged towers, chapels and outer curtains
reject uncompensated houses, lots or household title. Tower/gate/curtain effects
remain on the native circuit and its castle record. Repairs remove only damage
quoted at commission, preserving damage suffered during construction. Costs
include current-priced real material and labor; larger keeps and curtains use
the chosen footprint/perimeter. Stone curtain, round tower, barbican and outer
curtain methods use the integrated knowledge/adoption seam. Technology labor
reductions require the additional real tool timber in the fixed paid recipe.

New paid components carry the scalar `exactGround` policy: clearing and
`markSettlementBuilt` use the native rotated footprint instead of the legacy
bounding-circle buffer. Completion marks the footprint/approach union once
through the idempotent native mask. The same flag is reusable by paid storage;
there is no duplicate stored footprint or shadow land ledger.

Focused source fixtures cover actual native material seller payments,
named native wages and cash conservation, no-crew stalls, lost-title abandonment,
prerequisites, partial saved progress, single canonical completion and multiple
purposes without duplicate identity. These are source-level controlled fixtures,
not native generation, replay, worker, world-save or performance proof.

### Native mask width correction

`occupiedGroundCells` uses `CELL/2` on each side of a terrain-aligned native mask
center, matching the GRID raster. The previous 7.5 metre half-width confused
the 15 metre agricultural sample spacing with the wider mask cells (about
27.27 metres in the ordinary map). Tiny footprints near a mask edge could
therefore miss the cell whose actual ground they occupied.

`occupiedGroundAreas(cells)` counts the exact existing 15 metre survey samples
that those currently productive, unoccupied mask cells remove, grouped by the
current `furlongAt` result. One mask cell may remove several samples and may
span several titled fields. `occupiedGroundFields(cells)` intersects current
Voronoi parcel polygons with the entire reserved mask cells; its temporary
polygon memo lasts for that call only. First foundations and castle additions
validate all those titles and quote the actual survey-area loss. Native mask
completion refreshes every affected production field, rather than just the
field at each mask cell’s center. These changes intentionally correct land
occupation/yield histories; they are not an exact performance refactor.
