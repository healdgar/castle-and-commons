# Connected compound layouts: next architecture phase

Status: accepted shared architecture direction, recorded 2026-10-11; implementation
is pending. This is a plan, not a claim that the current abbey image contains a
cloister. The closed AD 1201 image shows a real paid church under construction,
with nave, chancel and bellcote. Current residence and service components are
independently placed buildings.

## Shared requirement

Castles, abbeys and every other multi-component institution use the same compound
engine. Extend the existing engine with retained layout relationships and lawful
connections; do not create an abbey-only construction or geometry engine.
Institution adapters choose forms and priorities. Shared services continue to own
native component references, exact ground and reservations, paid stages,
materials, technology checks, completion, saveable data and presentation contracts.
The compound has no additional purse, store, population, housing or defense value.

The current clients have different layouts, not different physical laws:

| Current client | Existing native components | Layout responsibility |
| --- | --- | --- |
| Castle | Keep, chapel, wards and native defensive circuits; paid upgrades | Fit defense to relief, entrances and the protected place; connect domestic and service ranges within the lawful ward. A closed circuit supplies defense, not its label. |
| Abbey | Church, residence, grange, guest house/almonry, school, own-use industries and hydraulic pond | Arrange church, private cloister and domestic ranges together; keep public guests, farm work and dirty/water-powered services in appropriate outer areas. |
| College | Paid classroom and residential lodging | Connect teaching and actual lodging around available entitled space, preserving teacher, pupil and room contracts. |
| Estate | Productive buildings, pond and native park/warren fields | Connect the actual work sites and keeper access; dispersed productive land need not become an enclosed courtyard. |
| Citadel and town defense | Bound native ramparts/circuits and citadel barracks | Retain engineering, terrain, era and paid-work constraints; do not replace these circuits with a decorative compound boundary. |

Paid fabric foundations, courtyard-house rebuilding, parish/friary churches,
quarries, wharves, windmills and locks already use related ground, material, wage
and access services. A future multi-building version should bind its same native
components to the shared layer. This does not require converting every isolated
building or specialized completion adapter before the first connected layout.

## Required abbey shape

[SYSTEMS.md](SYSTEMS.md) section 2 promises a church with cloister buildings;
[SIMULATION-COMPLETION.md](SIMULATION-COMPLETION.md) requires functional owned
church, residence, work and storage structures. Those economic functions exist,
but recognizable connected cloister architecture remains unfinished.

Use the actual church's position, rotation and west/choir direction as the anchor.
A common medieval arrangement has the church on one side of the cloister, an east
range with chapter room and dormitory, a refectory range opposite the church, and
a west range for lay brothers or stores. This is an adapter's preference, not an
identical stamp: the court can be smaller, mirrored to the other side, incomplete
or refused where actual titles, slope, water, existing buildings or access prevent
it. Initial bounded court candidates around 10–16 metres across are physical
design assumptions, not a minimum institutional population or guaranteed fit.

For the first implementation, use separate canonical dormitory, chapter-room and
refectory buildings with real covered circulation. This avoids counting a whole
two-storey chapter/dormitory range as sleeping accommodation: current `capOf`
counts native residential area and storeys in household places. Stacked uses can
follow when the shared engine records actual room/floor allocation and native
housing capacity uses only the residential portion. A chapter room or refectory
must not gain residents because of a purpose tag.

The refectory receives the house's actual meal service, using the existing owner
pantry and person meal receipts once; it creates no food or second feeding pass.
The chapter room supplies a real meeting place for the named community and order
proceedings, without automatic learning, income or discipline bonuses. Provisional
meetings and meals can still happen in the house's existing usable rooms while
new ranges are built. Dormitory occupancy continues to use actual admitted people
and native household lodging.

Covered walks need paid roofs, supports and native circulation geometry. Initial
wooden lean-to walks can use the timber recipe; masonry arcades and richer ranges
require locally adopted masonry and actual stone. A courtyard is the unbuilt space
left between these components, using the native seasonal ground. It is not a
painted circular green, independent productive field or free defensive enclosure.
When it becomes domestic court space, retain its exact bounded polygon, check its
actual rights, pay the quoted surface work and remove the occupied union once from
native farm production. Until that stage is commissioned, a layout preference
creates no cleared ground or reservation.
Grange, kitchens/service yard, mill, tannery and pond stay where their actual work,
water and rights permit. Guest house/almonry and its public entrance belong by the
lawful approach rather than through the private cloister.

This phased growth has historical support: [Cadw's Tintern account](https://cadw.gov.wales/visit/places-to-visit/tintern-abbey)
describes a simple church and cloisters before wealthy patronage funded the much
larger church begun in 1269. [Valle Crucis](https://cadw.gov.wales/visit/places-to-visit/valle-crucis-abbey)
preserves a chapter house, east range, dormitory and monastic fishpond. These are
functional relationships to model, not shapes to copy regardless of the site.

## Retained connections and paid stages

1. Survey a bounded set of church-relative poses and court sizes only after actual
   need, authority, funds and food reserve pass. Check every component's current
   native terrain, full occupied-cell titles and legal access. An unfunded preferred
   layout may not reserve or clear somebody else's land.
2. Retain one paid component and its exact connection per project. Reuse the
   completed compound's lawful entrance for internal routes; do not independently
   search for a distant public highway for every wing. The external public
   endpoint, private internal door and paid route rights must remain distinguishable.
3. Preserve the existing useful church, housing and grange priorities. Add the
   chapter/refectory ranges and roofed walk sections as funded stages; allow an
   incomplete court rather than installing a complete ensemble at foundation.
   Each stage has actual material quantities, named paid work and current checks.
4. Keep ordinary building setbacks. A matched shared wall, doorway or roof bridge
   needs a narrowly defined connection rule with retained geometry; membership in
   the same compound never exempts arbitrary overlap. Protected fit clearance is
   distinct from ground that is owned, occupied or paid for.
5. Complete each part as one native building or supported native structure,
   atomically bind its component reference, mark the real occupied/access union
   once and refresh native layout indexes. No renderer-created wing, second land
   mask, second resident list or invented defensive circuit is allowed.

The initial roofed walk can be a canonical nonresidential circulation archetype,
with its footprint and paid native building reference. It cannot silently enter
`RESID`, grant storage or advertise an ordinary secular craft room.

## Implementation dependency boundary

The common changes belong around `live.compoundSite`, native fit/reservation and
access queries, `compoundPolys`/`compoundGround`, component/connection references,
and the existing `compoundProjectCommission`/validation/tick/completion service.
The abbey adapter changes `abbeySitePlan`, `abbeyCommission` and its completion
bindings; the castle, college and estate adapters consume the same new primitives
while retaining their own legal, economic and geographic choices.

The worker owns layout choice and completion. Saves retain only plain native IDs,
fixed geometry, relationships and paid stages; derived survey/search contexts stay
operation-local. Rendering consumes projected native geometry, including roofed
walks and doors, through `visualBuilding`/project geometry and intentional worker
projection contracts. Inspectors explain completed parts, current works and fit,
title, material or funding refusals without making decisions.

No new daily phase is needed. Late institutional decisions commission work;
`tickProjects` performs actual paid progress; existing housing, meals, teaching,
industry and defense consumers activate completed capabilities at their next valid
phase. Any new geometry reader must be covered by the relevant native survey/route
identity certificates and reviewed dependency/search manifests. Affordable poses
and local connections must not restart a full realm route search every day.

The first reviewable phase is shared retained connections plus a small paid abbey
court with real dormitory, chapter/refectory space and covered walks. It also needs
a second client fixture demonstrating that the same primitive supports castle or
college components. Required gates cover native titles, private/public access,
reciprocal pending reservations, partial wages/materials, no duplicate capacity or
meals, one canonical completion, unfinished save continuation, worker projection
and a real paid draw. Large stone cloisters, every medieval room, full interiors,
cathedral-scale churches and universally completed precincts are later scope;
the connected-cloister requirement itself is accepted unfinished work.
