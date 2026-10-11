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
  methods. Shared construction queries use this same knowledge/adoption state.

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

Next paid adapters (#40/#43/#41/#39) still must supply physical effects:

| Consumer | Actual evidence and query |
|---|---|
| Loom, spinning, fulling, blast furnace | Named real craft contracts, paid native recipes, completed workshop/mill equipment; apply `technologyEffect` to working capacity/output, not price |
| Heavy plough, horse collar, horseshoe | Real soil, household team/equipment, fodder and paid tools; add their yield/haul effects without applying free place-wide multipliers |
| Post windmill | Sound paid native mill on a suitable wind site, actual miller/grain/multure, then its real grinding capacity |
| Universities, paper, spectacles, clocks, printing | Funded masters/admissions and real buildings/inputs/output; count their actual teaching or books through receipt/equipment contracts |
| Crossbow, longbow, plate, trebuchet, gunpowder/cannon | Paid real arms and crew bound to actual garrison/army records; equipment effect at combat/siege consumers |
| Rudder, cog, compass, charts, carrack | Paid built/fitted native ships with actual equipment; capacity/routing/wreck effects at the existing shipping consumer |
| Numerals, bills, double entry | Real clerk/merchant/account contracts and claims; no invented errors or remote coin transfer until #38 provides them |
| Quarantine, canal lock | An actual port policy/closure or paid canal/lock operation; no inert date multiplier |

`technologyEffect(s,key,operation)` returns one unless the method is available
**and** the operation records installed `equipment[key]` or `techEquipment[key]`.
The records must refer to actual paid/completed equipment produced by the owning
adapter; knowledge must never fill these fields. It exposes only quantity
factors for native operations. `technologyState` is a pure JSON DTO; the court
Learning view and adviser `game:state {path:'technology'}` read it. No projection
changes staffing, receipts, adoption or RNG.
