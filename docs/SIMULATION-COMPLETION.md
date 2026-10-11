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

**Current candidate (11 October):** `af07d28` (production `af07d282f03100f61fa6ad2f661ce3d8f6320882`, HTML SHA256 `11fb123ebd3e7ded5f40ad1739fd78f6ce85b7413cf5d216a11745b8840bc8cc`) integrates funded empty/blocked-offer price discovery (#72) and reciprocal protection of pending private compound footprints and approaches (#73). True joins use only the retained endpoint’s actual current public segment; the day602 proposal’s 0.16814 m² nonpublic wedge remains refused. Root’s affected batch has 116/117 passes; the sole import failure is the reviewed route-reader inventory change from 112 to 114, whose complete routing assertions remain. Fresh same-source90 feasibility passes all90 audited closed days with three abbeys/231 projects, maximum cash residual2.1100277081131935e-10 and clean goods/faults. The runner used358.092691 child CPU/345.504920 wall seconds, load0.228027→1.0, maximum RSS1113728 KB, including generation/audits/saves rather than browser throughput. Current-source history/save, paid core/industry, coupled suite, worker, era and drawing/release gates remain pending. Frozen `61dd0bb` evidence below belongs to that source, including its later deliberately stopped closed-day660 core run; no earlier native pass or snapshot is retagged. Colony famine/population decline, opening capacity, legacy cadence debt and the century-per-minute target remain explicit limits.

Frozen `61dd0bb`’s later paid abbey core gate was deliberately stopped at audited closed day660 after 510 continued days, with four abbeys and at least one completed Benedictine church; this is neither a timeout nor a full-core/industry pass. The run used `1044.221707` child CPU / `1002.7718814` wall seconds, load `0.05615→1.37451`, maximum RSS `1245040` KB, including audits/saves rather than browser throughput. `requested-closed-checkpoint.json` and `failed-native-abbey-core.fws` remain in ignored `institutions-final-61dd0bb-20261011`. The subsequent church-only draw verifies the exact saved/source graph, exact resave and every RNG stream, with all textures ready and zero errors. It shows a separately placed functional church; recognizable cloister architecture is not implemented yet.

Frozen `61dd0bb` (HTML SHA256 `503eec9311722394d7281d3f56e452be1d1a7944831138fca2d4f6d9b00680d7`) passes the fresh 150-day native comparison of complete world/globals/layouts/closure code and every RNG stream at all seven speeds, with 906 accepted raw outcomes. The day-37 native load reproduces the full graph and exact resave, then 113 days/678 raw continuation outcomes through day 150. Maximum cash residual is `1.780904312909115e-10`; goods/faults are clean. The runner used `1822.352379` child CPU / `1679.469807` wall seconds, load `0.730957→1.013672`, maximum RSS `1911716` KB. Audited steps cost `248.294278` seconds at fixed speed 5 and `246.477937` at variable speeds on the same candidate; this is no old-source performance comparison or browser throughput result. Day 150 has three abbeys, 11 schools, 217 projects and population 4835.3554; weighted hunger 0.01539279 and famine population share zero do not close economy calibration. Paid core/industry, coupled suite, worker, era and drawing/release gates remain pending; legacy cadence debt and the century-per-minute target remain explicit limits.

The same-source 90-day feasibility also passed with three abbeys/235 projects and clean cash/goods/faults. Day-50/day-90 tick-plus-audit CPU was `1.607689` / `2.994492` seconds; aggregate `233.482374` child CPU / `220.536047` wall seconds, load `0.32861→1.16992`, RSS `1039784` KB, includes generation, audits and saves. It is separate feasibility evidence, not completed paid core/industry or release validation. Root's 126 focused checks and full-source boot pass.

The frozen `d016a6a` 150-day native gate was deliberately stopped for measured performance after logged matches through 60 closed days and 366 accepted raw outcomes, with two abbeys, 186 projects and clean money/goods/faults; this is neither a timeout nor a 150-day pass. Exactly readonly live partial-day-67 inspection found every native founding/approach certificate true. Its 5.687762-second live sample attributes 97.9698546% inclusive work to `armyDetour`, after the prior day-50 straight-span cost was resolved. The stopped runner used 1308.025605 child CPU / 1251.1622995 wall seconds, load 0.474609→1.0, maximum RSS 1840044 KB; these include generation, audits and saves and are not browser throughput. That frozen diagnosis motivated the funded path-length/ellipse repair now integrated in `61dd0bb`; it is not retagged as current-source evidence. Day-0/day-37 FWS remain same-source; there is no partial-day-67 snapshot or new-source retag. Full native history/save, paid core/industry, coupled suite, worker, era and drawing/release gates remain pending.

The preceding frozen `04614a7` feasibility run completed 60 audited closed days with two actual abbey foundations, 186 projects, clean goods/faults and maximum cash residual `1.78e-10`. Day 50 used `1.905215` child CPU seconds including audits; aggregate `172.793065` child CPU / `162.645695` wall seconds, load `0.187→1.269`, also includes generation and saves. This is source-specific feasibility before the final reader guard, not browser throughput or a completed final gate.

The published baseline is `318811d`. The root integration checkout includes the
construction, government, abbey, credit, knightly, learning, craft, personal
status, Church and productive-estate implementations described above. Focused
source fixtures cover real payment, ownership, failure and completion boundaries;
these are not substitutes for generated-world operability.

Installed native machinery and paper/printing, actual grinding and paid windmills, finite funded foreign war and religious military orders, daily monastic investment, paid institutional foundations, noble marriage/dubbing/feudal aids, funded guild resistance and native/drawn citadel apertures are integrated. Funded native pound locks and purchased courtyard rebuilding are also integrated. The bounded contract audit repairs actual guest board, departed staff, credit due dates, silver-weight commands, public access and canonical shop/lodging recipients; ordered native candidates now serve mint and lodging queries. The isolated short-street self-veto is corrected while other native geometry/access checks remain unchanged. Root maintains daily dependency/projection discipline and runs all expensive gates serially.

The obsolete `00c7f14` full-suite attempt was stopped on a measured castle-survey performance regression; it is not recorded as a pass. The native exact-reuse diagnostic matched complete graphs, RNG and all 600 accepted raw rows for 50 days from the actual AD 1200 day-five checkpoint. Simulation CPU was 206.2 seconds before and 84.8 seconds after. It then stopped at a pre-existing symbolic shop-title payment fault (`lord` was passed as a purse); this is a failed diagnostic, not a 150-day pass or release result. The first final-model native comparison stops on day 19: all accepted raw rows and all graph nodes except one derived craft-index revision match. The diagnostic records that failed graph gate, rather than deleting the cache from comparison. The revised controlled reference retains identical final candidate-cache maintenance and selects from the original full native arrays; the actual restored-trade invalidation repair is common to both sides.

The frozen `d36bf93` suite completed all 196 files with 1,916 passes and two fixture failures (2,683.46 aggregate child CPU seconds, load 0.004→1.00). Reviewed repairs retain actual eligibility, protected reserves and full saved-history assertions. The accepted-decision audit found and repaired own-use abbey mills and tanneries. Actual retained paid components now employ qualified exclusive operators, grind finite own grain, and consume slaughter hides and bark-equivalent timber into finite leather and footwear. Daily charter eligibility, overdue collector eligibility, funded mayor service and foreign recruitment are also integrated; dated assessments, annual fee farms and foreign payroll dates remain intact. The final coupled suite covers 197 files: 1,961 of 1,964 checks pass initially. Reviewed fixture-only corrections retain employer, wheel geometry and storage writer guards; all 40 affected-file checks now pass, adding one employer regression. All 1,965 unique checks for the frozen `2d81f11` production source are verified across that batch and reviewed fixture rerun without changing that source or its deadlines. Subsequent source corrections await their own integrated gate. The native 150-day full graph/RNG/all-seven-speed gate passes with 906 actual accepted raw rows. A fresh day-37 native load resaves exactly and reproduces the complete graph and 678 raw continuation rows through day 150. Actual paid abbey industries, multi-era conservation, worker and drawing gates remain pending. A feature inventory alone does not close this contract.

Native opening frontage #61 is still partial. Additional hydraulic forms,
species-specific food categories and detailed economic calibration remain
explicit limits. The active contract does not count a pictured building,
unused method name or an unfunded obligation as a completed institution.

The repaired source `c2059ac` passes the current coupled check inventory: the 198-file frozen batch passes 1,977/1,978, with only a 30-second graph serialization deadline failure. The complete eight-file serial affected/source/boundary rerun passes 82/82 with original assertions and deadlines. Two new public/private windmill regressions bring the verified unique inventory to 1,980 across that batch and rerun. Actual native industries, fresh current-source history/save, worker, conservation and drawing remain pending; the old native pass below belongs to `2d81f11`.

The fresh c2059ac native gate now passes150 days/full authoritative graph/every RNG/all seven speeds and906 raw outcomes, plus exact native day37 resave and113-day replay (678 rows). Its later abbey run is a diagnostic abort at day626, not a pass: no abbey formed, rural grants cannot reach the32 m storage approach, qualified staff elsewhere have no abbey-funded migration path, and a live petition callback cannot be saved. Issues69–71 are assigned to isolated implementation lanes. Native completed housing/grange/food/own-use industries, new-source save/worker/presentation and era gates remain required. The recorded feature inventory does not close these operability gaps.

Frozen `219b90e` remains failure evidence: the original 120-second day-50 deadline was exceeded after 49 clean audited closed days (269.18 child CPU / 259.29 wall seconds, load 0.02→1.01). Its 5.396-second live sample confirms the flood was gone while native path planning was 97.2% and full-corridor checks 90.3% inclusive. An ignored, exactly readonly inspection of its failed partial-day snapshot found all 43 remaining yield-eligible field/order combinations unaffordable even at an optimistic direct-distance gift. That affordability diagnostic is neither a native tick pass nor a closed-day baseline; failed snapshots and source-specific evidence remain retained.
