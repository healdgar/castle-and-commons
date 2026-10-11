# Paid equipment and native production

Issue #44 now has actual equipment recipes for #40/#43 and native farms,
carriers and armies. Each quote uses locally adopted knowledge, a real eligible
native target and an identifiable household, house or corporate payer. It saves
fixed materials, labour and days. Makers consume real delivered goods, receive
actual wages and advance only the paid fraction of the day's work. An actual
maker working for his own account records self-work without an invented wage.
Knowledge, a purpose tag, an unpaid proposal and a bare equipment flag install
nothing. Later prices never rewrite a commissioned recipe.

`technologyEquipmentQuote(s,method,{kind,id},payer)` returns a pure fixed quote
or null. Kinds are `building`, `person` and `army`; IDs refer to canonical native
records. `technologyEquipmentCommission(quote)` saves a project in `W.projects`.
`tickProjects` dispatches `technologyEquipmentTick` before ordinary shared
compound projects. Completion writes `target.techEquipment[method]` with
`installed:true`, actual consumed materials, actual amounts paid, payer key,
self-work and actual individual arm-holder IDs. Households keep a year's bread
and roof rent before ordering; houses retain their native chest reserve.
Automatic ordering requires the actual estimate of five years' benefit to
exceed the saved cost. A journaled sovereign order may fund an eligible
unprofitable recipe from the actual house purse.

Daily placement is `peoplePrepare` -> paid learning -> local technology ->
actual craft contracts -> equipment decisions -> native production. The
per-place craft index and one daily field-worker map avoid searching the entire
world for every household. Actual project work remains in the existing paid
construction phase. Public cards and quotes use pure price and trade-count
reads; they create no caches, recipes, equipment, staff or payments.

The running consumers are:

- Smiths process held ore and charcoal only through actual eligible present
  masters in sound native work rooms. Weavers use equivalent measured rooms
  and today's paid journeymen. Actual available household members provide
  cottage weaving. Institutional employment, actual service roles, exile or
  absence preclude continuing the previous private workshop job. Furnaces,
  looms and wheels raise capacity; actual material consumption remains the
  single native goods ledger.
- Actual fitted ploughs with at least two owned cattle and available family
  labour raise the yield of those native worked fields. Collars improve real
  household horse teams. Native field and herd quantities bound the effect.
  The model has no clay-soil classification; it applies a general operational
  plough benefit, rather than claiming a soil-specific mechanism.
- A sound watermill or paid windmill, completed saw/hammer/fulling/paper equipment and a
  present actual miller are all required. Per-use fees pay the real operator
  and entitled mill holder. One miller's day is shared between these powered
  services. A missing operator, purse, material or paid installed machine
  gives no powered output. Paper converts purchased cloth and timber into the
  one owned native `paper` commodity and responds to actual demand.
- Spectacles restore the actual older scholar/craftsman's modeled sight
  capacity. Actual classroom clocks and completed presses affect paid lessons.
  Printed lessons consume purchased native paper; no sheets or Sunday gives no
  print benefit. These fittings create no extra pupils, masters or fees.
- A native carrier's paid rudder, compass and chart change the timing of his
  actual trip; completed cog/carrack recipes include their paid rudder fittings
  and lower native freight per load. Cargo limits and wreck rules retain their
  existing native mechanisms. Cart timing needs real held horses and actual
  collar/shoe fittings. Foreign anonymous ship supply is unchanged.
- Army recipes pay real local native makers and consume material before arms
  or siege kit exists. Individual bows/armour record actual qualified native
  holder IDs; deaths reduce the operative share. `technologyArmyEquipmentFactor(s,army,'combat'|'siege')` exposes the paid gear effect for actual battle
  clients. A completed ram/mining recipe is recorded as
  `army.techEquipment.siegeEngine`; completed trebuchets/cannon add their
  specific method there. Capability alone confers no siege bonus. Native field clashes and assaults now consume the actual living-holder factor.
  Wall battering requires a completed native engine and actual living engineers;
  calendar changes supply no engines. Foreign battle clients share the same
  completed records. Ammunition, wear and captured gear remain explicit limits
  where no separate native stock exists.

Recipes are `heavyPlough`, `horseshoe`, `horseCollar`, `loom`, `spinningWheel`,
`fullingMill`, `tripHammer`, `sawmill`, `blastFurnace`, `paperMill`, `spectacles`,
`clock`, `printing`, `rudder`, `cog`, `compass`, `portolan`, `carrack`,
`siegeEngine`, `trebuchet`, `siegeCannon`, `crossbow`, `longbow` and `plateArmour`.
They reuse native timber, stone, tools, ore, cloth and the new real paper good;
there is no fabricated iron commodity. Paid local crafts provide makers.
Equipment uses existing measured rooms and hull-owner records; it adds no
unpaid map building or separate person/household population.

Private worker state is `W._equipmentDay`, settlement `_equipmentFarms`, paid
project `target`, `payerKey`, `goods`, `holders`, `installedGoods`, `selfWorked`
and fixed financial estimates; native building/person/army `techEquipment`;
mill `poweredDay`, `poweredWork`, `paperMade`; school `paperUsed`, `printedFactor`.
These include account identities, people references or production contracts and
must stay out of visual DTOs. Worker queries return scalar receipts, method
names and native IDs. Existing native project progress/title can be reported
without these graphs.

Paid post-windmills require adopted knowledge (1185), a real qualified native
miller, an exposed actual retained site, paid land/access and a fixed timber
recipe through native foundation work. Daily weather and actual terrain exposure
bound grinding. Actual operator work shares the finite powered mill day;
`technologyGrindingReceipt` retains canonical operator/title-holder claims
until crop distribution, so later deaths or title changes do not erase earned
receipts. Only actually ground crop bears multure. Actual self-worked abbey crop uses
`technologyGrindingDay(s,q,false)` for its immediate distribution; this spends
the same remaining operator day without draining unrelated family crop claims. Native grain service payments
go directly to its real present operator and entitled holder, with no anonymous
miller pool. The former free mill crop-yield multiplier is removed. The existing
windmill visual still uses its old tower mesh; post-mill geometry is a rendering
follow-up.

Private additional mill fields are `grindingClaims`, `grindingPending`,
`grindingWorked`, `grindingOperator`, `multureWorked` and `grindingCash`: actual
earned grain/service claims and canonical actors, never visual state.

Machine-specific local guild resistance now uses actual sold-work claims,
a chest-funded writer and authority licence before a finite ordinance delays
new equipment commissions (see [CRAFT-RUNTIME.md](CRAFT-RUNTIME.md)). Existing
paid machines and commissioned recipes continue; knowledge and prices do not
change.

Pound locks now have a paid native client at a real existing pond/weir on a
drainage-connected barge route. It needs adopted1373 knowledge, actual upper and
lower wet reaches, a lift0.3–4.5m, a clear6×24m chamber, lawful ground/approach,
24timber/40stone and180working days before it opens. The chamber and bank keeper
house are real native fabric; projection receives only chamber geometry and
leaves a real opening in the dam. No new dry canal or cross-watershed connection
is generated. Larger lifts remain outside the single-chamber client.

`technologyRiverPassage(pr)` uses the actual weir and present wage-paid named
keeper. A keeper supplies eight two-hour passages per day; paid lock service
replaces measured unload/reload portage on that reach. A missing, ruined,
unaffordable or fully booked lock retains the boatman's portage time/work fee.
Actual merchants pay the title holder for served passages; daily keeper wages
come from that real title-holder purse. The merchant's goods reserve includes
actual lock outlay. Automatic investment must repay real capital and keeper
wages from observed native barge traffic; `s-lock` may fund an eligible site
from an owned house purse. It does not grant a free operation. These lock and
portage changes intentionally revise the previous free passage through weirs.

The global `_lockIndex` maps actual wet weir rows to native routes/local places
once daily and is invalidated on actual paid pond completion. Each place's
craft index retains native lock houses; current operators, titles, funds and
booked passages are always validated. The machinery phase staffs actual locks
and proposes paid work; construction completes in the native fabric phase;
trade quotes/bookings consume these actual operations after routing.

Additional worker-only state is `W._lockIndex`; native building `lockSource`,
`lockKeeper`, `lockWage`, `lockPaidDay`, `lockWages`, `lockDay`, `lockPassages`,
`lockReceipts`; person `lockJob`; native river-pair `lockTraffic`; consignment
`riverLeg`, `riverPlan`, `lockPaid` and `lockPayments`. These retain actual actor,
route and receipt graphs. `lockWater` is only numeric retained chamber geometry
and upper/lower water levels, permitted in the building visual DTO.

Explicit port quarantine is supplied by its separate native port-health client.
The lock client does not model a new inland canal network, continuous chamber
water volume, dredging or lock breakdown wear; it operates existing native wet
pond/weir reaches and their paid transport work.
Army splits partition actual individual holders and divide their paid recipe
provenance; one siege engine remains in the original army unless explicitly
moved. Its method and generic engine alias share the same canonical record.
Army merges retain extra actual machines in `reserveEquipment`; they confer
no second anonymous crew or battle bonus. Automatic army ordering uses real
funded idle native hosts at their own town. The same journaled equipment command
can fund actual owned armies.

Equipment has no separate wear stock; native site/owner/operator loss already
stops its use. No simulation-century throughput or economy calibration claim
follows from these focused fixtures.

Light evidence: extracted inline JavaScript syntax and twenty-five focused cases in
`tools/equipment.test.mjs`, covering both native commodity ledgers, material and
coin conservation, paid completion, actual exclusivity and current wages,
finite mill work, held animal teams, paid paper/printing, native army holders,
self-work, cold pure reports, actual native clashes/engineers and canonical
army split/merge provenance. Root runs all heavier combined gates.

Grinding uses the native craft index's ordered mill candidates and local miller
trade group, validating current power, operator and title on each transaction.
It does not rediscover every building for every family bread payment. Actual
paid fabric completion invalidates work-room discovery immediately; a newly
opened mill or repaired work room can recruit a master on the next daily phase.

Shop room title reads resolve actual canonical accounts. Symbolic `lord`,
`town` and `church` property names cannot be passed as payment recipients;
unresolved account strings are rejected. Pure room/equipment cards never
change the native title to perform this read. Paid room rents reach the actual
local house, town, church, household or corporate purse.

A lock foundation retains the actual impound-owning house account as its title,
including when the territorial lord has changed; numeric house indices never
pass through person-id property resolution. A sovereign's manual lock command
can fund only its own actual impound title, while profitable automatic corporate
investment remains independent. Operator validation requires the actual keeper's
matching role, office and building office reference. Losing that contract stops
passage and later wages and clears only the old lock's own employment fields.
