# Technology runtime contracts

This records the #44 completion batch. All state belongs to the simulation
worker. Read functions and projected UI/adviser data do not initialize or change
knowledge, actors, resources or random streams.

## Order and evidence

1. `generateWorld` initializes realm inherited knowledge before layout chooses
   the material of opening keeps. `initializeSimulation` initializes local
   inheritance before population/layout completion, then writes field rotation
   after `genLand`. This does not advance the opening date.
2. `tickTechnology` is first inside the existing `tickEconomy` production phase,
   once per simulation day. It reads living local teacher/contact indices,
   current ownership/purses and support receipts from this day or the preceding
   day. Prior local teaching phases must close actual receipts before the next
   technology pass. It pays approved daily patronage and local teaching, then
   discovers eligible methods on the deterministic `inst` stream. A saved day
   guard prevents duplicate work; speed/presentation never changes the draws.
3. Production and construction quotes consume current adopted capabilities.
   Machinery also requires actual installed equipment. Construction plans save
   their quantities, labour and duration once; later adoption cannot discount
   already quoted work a second time.
4. `ladeIn` passes actual cargo origin/destination settlements to
   `technologyContact`. A foreign ship's actual dock transition passes `null`
   and its destination; lord-party arrivals use their actual two settlements.
   These arrivals convey known information into the destination's sparse ready
   list. They do not award equipment, pay a teacher or adopt a method.

Actor lists contain only prospective local teachers and merchants. They rebuild
when the native folk revision/year changes, and eligibility rechecks life,
presence, office, membership, actual buildings and payment evidence. Institutions
changing roles without a native folk change call `technologyActorsDirty(s)`.
There is no place × all-realm-persons or place × all-roads × all-methods scan.
Pending inventions are a fixed small list and local decisions visit ready keys.

## Capability API

`technologyCapability(s,key,ad=AD())` and
`institutionalCapability(s,key,ad=AD())` return
`{available,known,adopted,reason,historicalYear,needs,source}`. Availability requires
invention date, stored realm knowledge, adopted prerequisites at this place and
this place's adoption. The short keys are canonical; accepted suffixed aliases
include `commune1070`, `royalBench1170`, `parliament1265`, `sheriff1066`,
`hundred1066`, `royalEyre1166`, `benedictine910`, `augustinian1100`,
`cistercian1128`.

- Government: `sheriff`/`hundred` 1066, `commune` 1070, `romanLaw` 1100,
  `royalEyre` 1166 (needs Roman law), `royalBench` 1170 (Roman law),
  `parliament` 1265 (royal bench).
- Religion: `benedictine` 850, `augustinian` 1100, `cistercian` 1128.
- Construction: `stoneKeep` 1080, `stoneCurtain` 1150,
  `castleRoundTowers` 1220, `castleBarbican` 1230,
  `castleOuterCurtain` 1280. `gothic` 1140 governs future native vault/large church
  methods. Native quoted church upgrades additionally use `churchMasonry` 980,
  `churchAisles` 1080, `churchTransepts` 1100, `churchGothic` 1190 (needs the
  general Gothic method), and `churchStoneSpire` 1230. `houseMasonry` 1200
  preserves the existing upper-tier housing era while requiring knowledge and
  actual stone. Shared queries use this same knowledge/adoption state.

`constructionCapability` retains its explicit pre-initialization legacy calendar
fallback. Real generated worlds always initialize knowledge first; advancing the
calendar or rewriting a test's start year does not discover a method. Focused
fixtures that force a future year must initialize legitimate opening knowledge,
or supply the actual known/adopted state they mean to test.

## Learning, support and economic uptake

`technologyTeacher` accepts an actual adult, living, present person with native
skills: a priest and a sound temple, an actual live religious member recorded in
`W.abbeys`, or an actual funded schoolmaster. Abbey members may be native person
references or ids; decorative `religious` counts do not teach.

A schoolmaster must have a real `school.building` in sound state, `school.master`
equal to the native person id, and
`school.contract={master,active,paid,lastPaidDay}` with a positive actual payment
and this-day or previous-day receipt. Resolve the school from the person's
canonical `officeFor` corporate record, the place's school or a native
`W.schools` record. #40 owns creating/payments/admissions; no master proficiency
comes from an office label.

`technologySupport(s,actualPayer,actualTeacher,amount)` transfers real money and
records only the returned receipt. Null/foreign-infinite payers, dead/absent or
unsupported teachers, non-finite and non-positive amounts are rejected.
`technologyRecordTeaching(s,actualTeacher,actualPaid)` records a receipt already
made by a school's tuition/stipend adapter. Call it only after successful native
`transfer`, and never both it and `technologySupport` for the same receipt.

`technologyCmd('si:annualGold')` is the journaled `s-learning` command. The player
must own the place. Each day an allowance pays an actual available teacher only
from that owner's surplus above its native reserve; unspent coin remains in the
purse. Patronage does not create a master, library, tuition or research output.

Local `technologyAdoptionQuote` checks ready information, prerequisites, peace,
actual land/team for farm methods, a named eligible teacher and actual surplus.
It compares a current local opportunity estimate in gold (real existing grain,
workshop inputs/capacity, construction, army, harbour, trade or teachers) against
one day's household bread paid to the teacher. The forecast is stored alongside
the successful receipt; it is never credited as revenue. One teacher may complete
one such local instruction per day. Failed or partial payments do not adopt.
Physical equipment/structures still need their own profitable native quotes.

Discovery's daily hazard is derived from learning/population, with a thirty-year
reference lag and rising lateness. Sources are living clergy, funded masters,
actual merchants away/ships docked and recorded patronage. The baseline is not a
hidden free learning income. Combined native history must still calibrate this
formula and its opportunity estimates.

## Operative and remaining consumers

Already operative:

- Actual production, grain-income forecasts, strip yield and carrying-capacity
  forecasts use `technologyFarmYield`: two-field inherited agriculture has half
  the land cropped; actual three-field adoption changes this to two thirds
  (`.75 -> 1` relative to the previous two-thirds baseline). Fallow grazing uses
  the corresponding `1/2 -> 1/3`. The unrelated perpetual yearly productivity
  drift is removed. Native fields, open-field/Hufe/close shaders and field reads
  carry the same rotation; method adoption updates field records once.
- Native watermill timber/smith bonuses and use labels now require local sawmill
  or trip-hammer knowledge **and** actual installed `mill.techEquipment[key]`.
  A date alone supplies no free powered saw or hammer.
- `constructionTechnologyRecipe(s,material)` returns `{laborFactor,timber}`.
  Adopted wheelbarrow: `.9` factor and two timber. Adopted masonry crane: an
  additional `.8` factor and twenty timber. Paid construction adapters must buy
  and consume the additional timber in their fixed actual recipe before using
  the discount. `constructionLaborFactor` is only a convenience accessor.
- Castle/abbey/government adapters consume capability methods above; methods
  create eligibility, never free buildings, members, grants or court receipts.

Paid equipment now supplies native farm, workshop, powered-mill, paper,
teaching and carrier effects (see [EQUIPMENT-RUNTIME.md](EQUIPMENT-RUNTIME.md)).
It requires actual recipes, makers, named payers and completed records. Smiths
and weavers process only their actual present work capacity; current paid
journeymen and available cottage hands replace anonymous town-wide capacity.
Local adoption alone changes none of these quantities.

| Consumer | Running evidence or remaining boundary |
|---|---|
| Loom, spinning, fulling, blast furnace, saw and hammer | Completed paid native machine, eligible actual master or present miller, today's paid hands or actual per-use mill receipts |
| Heavy plough, horse collar, horseshoe | Actual fitted household equipment, held teams and available family labour; native field share and carriage time use these inputs |
| Funded universities, paper, spectacles, clocks, printing | Actual masters, pupils and rooms; paper has one commodity ledger and printed lessons consume purchased sheets |
| Rudder, cog, compass, charts, carrack | Paid actual boatman equipment changes his real native trip time/freight; native cargo limits and wreck rules are unchanged |
| Crossbow, longbow, plate, ram, trebuchet, cannon | Paid actual army recipe and recorded living holders; `technologyArmyEquipmentFactor` is the battle/siege adapter contract |
| Post windmill | Paid native retained exposed site/approach, real timber and crew; present native master grinding shares finite mill time, actual earned multure and cash service receipts |
| Numerals, bills, double entry | Finance clients must use actual clerk/merchant claims; no simulated accounting errors or free remote payments |
| Quarantine, canal lock | Still require actual port closure or paid native canal/lock operations |

`technologyEffect(s,key,operation)` returns one unless the method is available
**and** the operation records `techEquipment[key].installed === true` (or the matching native
`equipment` record). Bare flags confer no physical effect.
The records must refer to actual paid/completed equipment produced by the owning
adapter; knowledge must never fill these fields. It exposes only quantity
factors for native operations. `technologyState` is a pure JSON DTO; the court
Learning view and adviser `game:state {path:'technology'}` read it. No projection
changes staffing, receipts, adoption or RNG.

## Funded-school adapter and public business

The #40 local-school adapter now supplies `W.schools` contracts with real tuition,
stipends and lessons (see [LEARNING-RUNTIME.md](LEARNING-RUNTIME.md)). An abbey's
`school.schoolId` resolves that single record; person `schoolMaster` resolves its
actual master, building and receipt. School receipt registration precedes the
daily technology update. No labels or unstaffed classroom imply a supported
master. Actual Augustinian canons/priors join monks/nuns/abbots/abbesses as native
religious knowledge sources.

Public-business capabilities include `moneyer` (850 baseline mint administration)
and `licensedCredit` (1066), with date aliases `moneyer850` and
`licensedCredit1066`. `merchantBond` / `merchantBond1285` is enhanced statute
merchant enforcement (1285, prerequisite royal bench), not the earlier ordinary
loan bond. Finance adapters still require actual funded moneyers, metal, lenders,
contracts and licence payments. Knowledge creates none of them.

The craft batch adds merchantGuild1080/craftGuild1150, and the knightly adapter
keys knightService1066, scutage1100, tournament1100, licensedTourney1194,
mercenaryCompany1100, chivalricOrder1348 and foreignExpedition1095. All are
ordinary canonical knowledge/adoption capabilities with explicit prerequisite
rules. They authorize actual contracts, licences and service; they create no
people, equipment or free income. `licensedTourney` requires both tournament
practice and the actual royal-eyre knowledge seam. Ordinary early martial
hosting remains the pre-existing native system.


Paid foundation clients now have genuine local rules for `quarry850` (the older
`quarry950` alias remains compatible), `franciscan1210`, `dominican1216`,
`stoneWharf1250` and `starCitadel1500`. Quarrying is inherited baseline knowledge
in the 850 opening, not a claim that stone extraction was invented in 950.
Military-order clients use `hospitalOrder1113` and `templeOrder1119`, each
requiring actual foreign-expedition knowledge. Suppression and lawful asset
succession belong to the actual Church/foreign adapter, not knowledge deletion.

The funded coastal quarantine consumer is described in [PORT-HEALTH.md](PORT-HEALTH.md).
It uses the actual `quarantine` local capability, paid native staff and cargo,
and preserves the separate existing gate-closure command.
