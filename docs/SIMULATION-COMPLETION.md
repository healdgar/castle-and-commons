# Planned simulation completion

This is the completion contract for the user's 2026-10-10 continuation of Castle
and Commons. It brings the recorded systems into the running simulation, rather
than treating the presence of an account kind or a visual building as completion.
`docs/SYSTEMS.md` records the institutions; its twelve accepted decisions take
precedence over its earlier alternatives. `SIMULATION-ORDER.md` and its machine
contract remain the daily dependency authority.

## Rules shared by every system

- Ordinary eligibility and decisions run daily. A market day, court sitting,
  quarter-day lease, harvest, feast, school term or expedition date is a world
  obligation, not a performance throttle.
- New histories may differ from the old model. The same opening seed, fate and
  player commands must still produce exactly the same history at every speed,
  in the worker, in the reference driver and after a native save/load.
- Land, buildings, goods, people, debts and purses have one canonical owner and
  identity. Institutions employ and admit actual people; they do not create a
  second population. Coin goes to a named recipient and work advances only by
  actual delivered materials and paid or explicitly owed labour.
- The worker owns decisions and the map changes they cause. Presentation is a
  readonly projection. Walking animations do not decide payments or arrivals.
- Native terrain, water, occupied parcels, public access and existing defenses
  constrain every project. A shared compound coordinates functional structures;
  its purpose labels alone do not create capacity, output or defensive strength.
- Knowledge and local adoption gate institutions, materials and construction.
  A direct-era opening establishes plausible initial stocks and institutions
  without running unrecorded centuries of simulation.

## Dependency batches and completion evidence

| Batch | Required running behavior | Dependencies |
|---|---|---|
| Construction and ownership | Usable native opening frontage; actual entitled land payments; shared saved component projects; paid daily castle, church and road work; canonical terrain-fitted compounds | Existing title, storage, construction and daily order |
| Government and courts (#37, #39) | Hundred and shire sessions, actual sheriff and bench, debt recovery, visible lords' journeys, fee-farm communes, assessment and arrears, estates attendance and consent where available | Existing manor/eyre, real offices and purses, technology |
| Abbeys (#35) | Paid foundation and grant, actual religious/conversi admissions and mortality, self-worked granges, hired labour, wool and fish, fasting diet, alms and hospitality, functional church/residence/work/storage structures and readonly controls | Corporate title, compound construction, actual goods and labour, technology |
| Credit and coin (#38) | Actual lender books, interest and risk, pledge and judgment, rent charges and pawns, forward grain/wool delivery and defaults, mint/recoinage/debasement, ruler's usury policy | Courts, corporate owners, abbey wool, government |
| Knightly society (#41) | Service or scutage, relief and wardship, paid tournaments, actual companies and orders | Estates, journeys, existing hosts and succession |
| Learning (#40) | Paid masters, actual enrolment/fees/stipends and board, graduates entering real offices and transmitting knowledge | Corporate owners, offices, technology |
| Craft ladder (#43) | Masters and journeymen, actual hiring/wages, apprenticeship, guild charters/dues, quality search and funded guild spending | Existing crafts, learning, government, corporate owners |
| Personal status (#42) | Inherited personal bondage distinct from land tenure, licences/chevage, flight claims, town freedom and manumission | Courts, communes, household identity |
| Wider Church (#46) | Separate diocesan/chapter/order/papal purses, ecclesiastical marriage and will jurisdiction, privileges, assessed contributions and actual payments abroad; distinct order adapters | Abbeys, courts, learning, credit and government |
| Foreign war (#47) | Funded expeditions and embarkation, actual participants' absence, foreign costs and combat, spoils and return | Hosts, lord travel, Church and credit |
| Customary and productive completion (#36) | Rent grain to actual covered barns; winepresses, parks, warrens, dovecotes and ponds with real land, labour, goods and upkeep | Storage, ownership, production and compounds |
| Technology (#44) | Realm knowledge and local adoption; prerequisites, teaching/contact/patronage; operative hooks for institutions, recipes, agriculture, mills, materials and defenses | Direct-era opening; learning enriches transmission |

Cistercian foundations become available through learning near their historical
arrival, not in AD 1066. Their initial grants are mainly marginal land, worked by
conversi and hired hands. Early Cistercians take no villages, serfs, rents or
tithes; their self-worked land has its own privilege. Benedictine manorial
landlords and other orders require distinct policies. The mother house, order,
bishop, chapter and papacy remain separate owners, including owners abroad.

## Publication and validation

Each operable batch is committed and pushed to `main`, then the deployed Pages
build is checked against the commit. Implementation continues after publication
until this contract is implemented. Only the coordinator runs heavy validation,
one job at a time: the combined suite, native speed/save/worker proofs and a
short multi-era conservation/profile batch. Focused fixtures cover actual
ownership, obligations, failure and completion boundaries. Drawn play confirms
that completed model structures and institution state reach the screen.

The contract is complete only when the rows above have operative behavior,
recorded evidence and no placeholder flows. Economy calibration, additional
historical detail and the century-per-minute performance target remain explicit
limits where measurement has not established them. They must not be described
as achieved merely because the feature inventory is implemented.

## Current integration and remaining gates

The published baseline is `318811d`. The root integration checkout includes the
construction, government, abbey, credit, knightly, learning, craft, personal
status, Church and productive-estate implementations described above. Focused
source fixtures cover real payment, ownership, failure and completion boundaries;
these are not substitutes for generated-world operability.

Installed native machinery and paper/printing, actual grinding and paid windmills, finite funded foreign war and religious military orders, daily monastic investment, paid institutional foundations, noble marriage/dubbing/feudal aids, funded guild resistance and native/drawn citadel apertures are integrated. Funded native pound locks and purchased courtyard rebuilding are also integrated. The bounded contract audit repairs actual guest board, departed staff, credit due dates, silver-weight commands, public access and canonical shop/lodging recipients; the last lookup repair consolidates mint candidates. Root maintains daily dependency/projection discipline and runs all expensive gates serially.

The obsolete `00c7f14` full-suite attempt was stopped on a measured castle-survey performance regression; it is not recorded as a pass. The native exact-reuse diagnostic matched complete graphs, RNG and all 600 accepted raw rows for 50 days from the actual AD 1200 day-five checkpoint. Simulation CPU was 206.2 seconds before and 84.8 seconds after. It then stopped at a pre-existing symbolic shop-title payment fault (`lord` was passed as a purse); this is a failed diagnostic, not a 150-day pass or release result. The final suite and native history/save/worker, actual paid abbey and conservation gates remain pending.

Native opening frontage #61 is still partial. Additional hydraulic forms,
species-specific food categories and detailed economic calibration remain
explicit limits. The active contract does not count a pictured building,
unused method name or an unfunded obligation as a completed institution.
