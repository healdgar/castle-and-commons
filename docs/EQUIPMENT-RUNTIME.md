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
- A sound paid watermill, completed saw/hammer/fulling/paper equipment and a
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
  holder IDs; deaths reduce the operative share. `technologyArmyEquipmentFactor
  (s,army,'combat'|'siege')` exposes the paid gear effect for actual battle
  clients. A completed ram/mining recipe is recorded as
  `army.techEquipment.siegeEngine`; completed trebuchets/cannon add their
  specific method there. Capability alone confers no siege bonus. Combat,
  ammunition, wear and captured gear remain actual army-client responsibilities.

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

Limits: paid windmill siting/grinding, explicit port quarantine, real canal
locks and machine-specific guild resistance still require native clients.
Equipment has no separate wear stock; native site/owner/operator loss already
stops its use. No simulation-century throughput or economy calibration claim
follows from these focused fixtures.

Light evidence: extracted inline JavaScript syntax and eleven focused cases in
`tools/equipment.test.mjs`, covering both native commodity ledgers, material and
coin conservation, paid completion, actual exclusivity and current wages,
finite mill work, held animal teams, paid paper/printing, native army holders,
self-work and cold pure reports. Root runs all heavier combined gates.
