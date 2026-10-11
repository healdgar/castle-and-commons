# Connected compound layouts

Status: the first connected-layout implementation is reviewable in an isolated
phase-two batch; generated-world, cold-save, worker and drawing gates remain with
the serialized root runner. The accepted direction was recorded 2026-10-11. The
published AD 1201 image still shows the predecessor’s actual paid church, with
nave, chancel and bellcote; it is not evidence of a completed cloister.

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
and the new connected adapter supplies the missing paid court and domestic ranges.
Their generated-world operation and drawing still require phase-two gates.

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
the connected-cloister requirement itself is the scope of this implementation.


## First operable implementation

`compoundLayoutPoses` and `compoundConnectionPlan` are common services. The
shared [patron-gift service](COMPOUND-PATRONAGE.md) transfers real donor silver
to each compound's actual native owner account; the compound keeps no purse. The Abbey
adapter anchors to an actually completed, entitled church and tries two mirrored
sides and 14 m or 10 m inner court widths. It keeps the chosen arrangement only
when the first connected component actually completes. Dormitory, chapter and refectory
candidates have at most three nearby positions; each exact footprint and retained
path still passes native terrain, titles, standing geometry and pending
reservations. A preference for an unbuilt wing grants, occupies and reserves no
future ground.

The connected dormitory is an 8×24 m native longhouse, with the same 192 m² and
native residential capacity as the previous 24×8 m range. The chapter house is
8–10×8 m and the refectory is 8–12×8 m according to court size. They are separate
nonresidential archetypes: neither supplies beds or commodity storage. Their
inward doors are saved as `compoundDoor`; `serviceDoor` supplies the same entrance
to path checks, and completion sets the native `fx/fz` front used by the wall atlas.
This keeps the visible doorway on the physical inward face.

A late funded stage builds one nonresidential `cloister` component, with four
2.6 m roofed walks, .24×.24 m supports and an open rectangular court. The external
width is inner width+5.2 m; depth follows the actual church. Its timber requirement
is .12 native timber units per square metre of roof, with paid labour of
`2*foodYr()+roofArea*.08*PL()` and `90+roofArea/4` base workdays. These are explicit
physical game assumptions, not historical load weights. Shared construction
technology modifies the bill, and actual materials and wages are consumed by the
existing paid engine. The full outer envelope is conservatively fitted and
reserved; its exact granted domestic/access union is removed from production once.
There is no court housing, food, storage, productivity or defense bonus.

Only actual supports obstruct walkers. A native .8 m internal footpath and closed
walk loop pass between the supports with the existing .6 m walker clearance;
completion and native occupied-ground rebuilds use the actual retained street
half-width, so the paid .8 m private corridor never grows into a 2.6 m claim.
External rural approaches retain their existing width and full checks. Rendering
derives precisely four roofs and the supports from paid saved geometry. The
inner court uses seasonal native grass; walk surfaces use the native ground mesh.
Separate paid walk sections, stone arcades, integrated two-storey room allocations
and richer interiors remain later detail.

The completed church’s current lawful entrance is the root. Saved plain connection
records retain actual compound, parent-building and street indices, segment,
endpoint and path identity. A bounded local connector does not run distant A*.
Every daily validation checks the current parent’s ownership, existence, physical
access chain and retained geometry. Completed private footpaths may pass under
this open roof only when the actual owning component and compound match and
supports remain clear. No arbitrary same-compound building overlap is allowed.
Unrelated private footpaths remain protected; a College cannot treat occupied
private circulation as public entitlement.

The College adapter is the second live client: paid scholars’ lodging uses the
same bounded poses, internal connection, material bill, ground payment and
completion binding, anchored to its real completed classroom. Ordinary public
street graphs and castle, storage, growth and courtyard frontage proposals exclude
these private routes. Members receive a derived private walking graph; the public
graph never advertises a cloister as public frontage.

Useful church, housing, grange, hospitality, schooling and feasible own-use
industry/pond priorities remain ahead of domestic embellishment. A connected core
range may still use the original lawful independent site if its preferred court
cannot fit. After those priorities, chapter, refectory and covered court are
sequential funded stages. A present named community meets in its actual chapter
room. A present native cellarer serves actual member pantries in the refectory,
recording the existing per-person meal receipt before household consumption;
neither pass creates actors or a second meal.

The focused `tools/compound-layout.test.mjs` uses actual native placement,
commission/progress/completion, material custody, payments, capacity and meal
helpers on controlled opening titles and terrain. It covers mirrored layout,
paid Abbey and College completion, reserve/title/access refusals, private-route
protection, open support navigation after all ranges are built, inward projected
fronts, seasonal surface geometry and unfinished plain-data continuation. It also checks actual completion and occupied-ground reconstruction at a native
raster-cell edge, where the former2.6m private-path assumption would claim extra
cells. All15 checks pass. This is a light fixture, not a generated-world or
browser proof.

No daily phase changes. The dependency changes are shared connection/layout
helpers and `live.compoundSite`; `collegePlanQuote`/completion; Abbey connected
plans, commission/completion, chapter/refectory consumers and summaries; native
`serviceDoor`, private/public `streetGraph`/frontage consumers; support-aware
`armyObstacle` and its route certificate; completed court drawing and ground
projection. Storage’s native fit certificate now includes the court/street
compatibility entry. The first-castle survey records the private-anchor flag in
its exact input certificate. Worker packets carry `coveredCourt` and
`compoundDoor` geometry, while connection, arrangement, authority and meal records
remain private. Final assembled-source manifest renewal belongs to the integration
review, not this isolated patch.
