# Issues

This is the sole current list of bugs, unfinished systems, next actions, validation
blockers and release work. Update the existing issue when its state changes; do
not append a second handoff or continuation log. Design contracts and detailed
experiments belong in the linked domain documents. Keep issue IDs stable.

**Status:** Open = no accepted remedy; Investigating = diagnosis incomplete;
In progress = partial implementation or validation; Validation pending = code
exists but its remaining scenario/integration checks are not complete; Verified local = the stated
checks passed but release remains outstanding; Published = released to the stated
targets with any remaining limits recorded; Needs verification = inherited
external work whose present state has not been checked. Code presence, a preview,
a stopped run and a published build are different outcomes.

Validation pending means engineering checks remain to be completed, not that
user approval is required. Any outstanding user decision must be identified
explicitly on its issue; none of the validation-pending entries awaits user approval.

The accepted scope is completion of [SIMULATION-COMPLETION.md](SIMULATION-COMPLETION.md),
with operable verified phases released as directed. #15 remains the performance
priority. The next held construction changes are recorded under #80–82; the
native paid Abbey completion requirement is #35. Economic choices are recorded
in [SYSTEMS.md](SYSTEMS.md#accepted-economy-and-growth-decisions), not awaiting a
repeat of already answered questions.

## Construction and institutional validation

| # | Issue | Status | Next action / current evidence |
|---|---|---|---|
| 80 | Construction and upkeep do not share a finite daily crew budget | Open | Define a shared finite daily person-work budget for construction, upkeep and crafts. The held attendance slice b902f70 and resident-cache follow-up bc15442 have 16 focused checks, not full validation; legacy instant effects and scheduled services remain open. See [DAILY-LABOUR.md](DAILY-LABOUR.md) and [DAILY-SERVICE-CONTRACTS.md](DAILY-SERVICE-CONTRACTS.md). |
| 81 | A damaged castle target can block recovery while an upgrade remains pending | Open | A pending castle upgrade can prevent repair of its damaged target. Held patch 2d641c5 is outside the recorded frozen lifecycle proof: integrate and validate real repair/resumption or justified abandonment while preserving sunk payments and exact title/site. |
| 82 | Permanent loss of a non-parent prerequisite can block a partly paid range | Open | Permanent loss of a required non-parent range can strand a partly paid wing and block replacement. Held patch 2d641c5 needs integration/native validation; parent-loss recovery alone does not close this dependency. Preserve recorded connections and sunk payments. |
| 35 | Monasteries, abbeys and nunneries | In progress | Endowed houses, connected buildings, qualified residents, grants, patron gifts and own-use mills/tanneries are implemented. Still demonstrate a genuinely paid completed native core and functioning industries, with resumable closed-day checkpoints, admissions, production and conservation. A rendered finished-layout preview is not this validation test. See [ABBEYS.md](ABBEYS.md), [COMPOUND-LAYOUT-PHASE.md](COMPOUND-LAYOUT-PHASE.md) and [institution validation](#institution-validation). |
| 69 | Rural abbey foundations reuse a town-storage approach | In progress | Bounded rural founding/approach surveys preserve full native terrain, access, title and purse checks; frozen 150-day/history/save gates passed. Paid connected core and own-use industry validation remain with #35. Preserve those native criteria when diagnosing failed or unaffordable approaches. |
| 70 | Rural abbeys cannot offer work to qualified people elsewhere | Validation pending | Funded offers move real qualified households on native journeys with paid lodging, arrival-only hiring/profession and failed-offer return. Verify arrival, staffed production and save continuation in #35; sparse tanning wages are not a full-time salary. |
| 71 | A live native petition callback has no world-save closure maker | Validation pending | Native petition makers retain real callback closure context. Recheck the famine petition save that previously failed at day626; a successful save with no such late callback does not close this case. |
| 72 | Funded orders cannot move a price when no stock is affordable at that quote | Validation pending | Funded demand prevents reprice from skipping a good with no affordable stock; the original bounded monthly formula remains. Validate actual purchase/delivery and conservation in #35. Repeated backlog demand is a separate unresolved finding (#86). |
| 73 | A new paid public street can obstruct an older pending abbey approach | Validation pending | Public works reject conflicting pending private footprints/approaches; reciprocal joins require the actual lawful public endpoint. Exercise native paid approach survival under later street/road/square/wall commissions with #35/#69. |
| 74 | Religious foundations have no journaled patron-gift control | Validation pending | Journaled patron gifts transfer actual donor cash into the canonical Abbey account; frozen native history/save proofs include gifts. The gift control is present; complete the resulting paid-core campaign under #35 rather than treating the control as absent. |
| 75 | Generic housing and refits can bypass private institutional purposes | Validation pending | Ordinary housing, rebuilding and refits respect private institutional purposes and scholar reservations. Keep private occupancy, roof payment and save/load cases in shared validation; no free beds or repairs. |
| 76 | Abbey church fabric omits the complete construction bill | Validation pending | Abbey church funding now quotes timber, stone, technology-adjusted materials, wages and the live food reserve, with real return of unused earmarks. Verify delivered materials and paid completion in #35. |
| 77 | A closed abbey school keeps its room permanently bound to the old school | Validation pending | Closing a school releases only its matching owner/room/school binding. Verify qualified, funded reopening and conserved payments in the native education/Abbey campaign (#35/#40). |
| 78 | Ruined or removed castle components have no independent paid recovery | Validation pending | Owned retained castle/Abbey ruins use paid same-site recovery; partial dependent wings may wait for the same parent index and permanent parent loss abandons without refund/rebinding. Pending upgrades and non-parent losses remain #81/#82. See [COMPOUND-BUILDINGS.md](COMPOUND-BUILDINGS.md). |
| 79 | A lost Abbey church can strand its retained layout preference or trigger duplicate foundations | Validation pending | Native retained-church recovery and authoritative completed layout preferences prevent free replacement or duplicate Abbey foundations. Include ruined/captured/transferred parent and partly paid wing cases in #35/#78 validation. |
| 67 | University founding can dereference a missing eligible teacher | Validation pending | University/school quotes now require an actual eligible current master before costing faculty. Recheck the late AD1200/1001:42 sea/6 km case beyond day720; missing/exclusively employed teachers must refuse, not appear for free. |
| 68 | Crown cannot act as an abbey founder | Validation pending | Crown abbey founding uses the living monarch, while other houses use their actual heads; seven identity/refusal/tenant checks pass. Include actual Crown founding/endowment in #35 validation. |
| 63 | Storage can report quoted land compensation as paid with no recipient | Validation pending | storageGroundPay resolves actual titled recipients, occupation and paid receipts before advancing work; self-owned ground creates no fictitious transfer. Reconcile the specific compensation/succession scenarios with shared conservation/save validation. |
| 66 | Paid courtyard consolidation could finish without public access | Validation pending | Paid courtyard consolidation checks real public access rather than completing an inaccessible compound. Retain the actual funded/access scenario in shared native validation. See [COMPOUND-BUILDINGS.md](COMPOUND-BUILDINGS.md). |

## Implemented systems awaiting validation

| # | Issue | Status | Next action / current evidence |
|---|---|---|---|
| 36 | Lords' customary income | Validation pending | Customary dues/farms, productive estates, title/staff/goods/upkeep and covered rent-grain storage are integrated. Complete their shared native validation and economic calibration, rather than repeating implementation work. See [ESTATE-PRODUCTION.md](ESTATE-PRODUCTION.md) and [EQUIPMENT-RUNTIME.md](EQUIPMENT-RUNTIME.md). |
| 37 | Courts and royal justice | Validation pending | Manor/royal courts, hundred/shire services, sheriff, general eyre and the capital bench are integrated. Verify actual officers, paid journeys, recoveries, arrears and preserved subsistence in the shared native campaigns. See [GOVERNMENT-INSTITUTIONS.md](GOVERNMENT-INSTITUTIONS.md). |
| 38 | Credit and coin | Validation pending | Local credit, pawn/rent-charge policy, forwards, hardship recovery, moneyers and silver accounting are integrated. Complete native repayment/default, custody and save/worker validation. See [CREDIT-COIN.md](CREDIT-COIN.md). |
| 39 | Estates and self-government | Validation pending | Actual estates attendance, consent before extraordinary taxes, assessments, arrears and fee-farm charters are integrated. Verify them in the shared native campaigns. See [GOVERNMENT-INSTITUTIONS.md](GOVERNMENT-INSTITUTIONS.md). |
| 40 | Learning | Validation pending | Named masters/students, tuition, travel, board, lodging and knowledge transmission are integrated. Complete native education/save/worker validation and the late university case in #67. See [LEARNING-RUNTIME.md](LEARNING-RUNTIME.md). |
| 41 | The knightly world | Validation pending | Succession, service/scutage, tournaments, ransoms, orders, dubbing and actual consent/attendance are integrated. Complete generated-world and conservation validation. See [KNIGHTLY-WORLD.md](KNIGHTLY-WORLD.md) and [FOREIGN-EXPEDITIONS.md](FOREIGN-EXPEDITIONS.md). |
| 42 | Bondage and freedom | Validation pending | Inherited status, licences, manumission, flight claims and year-and-day residence are integrated. Complete shared native/save/worker validation. See [PERSONAL-STATUS.md](PERSONAL-STATUS.md). |
| 43 | The craft ladder | Validation pending | Paid masters/journeymen, apprenticeships, bench capacity, quality, guild charters and machine ordinances are integrated. Verify actual livelihood/capacity transitions and exclusivity in native validation. See [CRAFT-RUNTIME.md](CRAFT-RUNTIME.md). |
| 44 | Technology | Validation pending | Knowledge/adoption and paid productive, military and transport equipment are integrated; historical calibration remains open. The earlier stone-keep 1080 proposal is not an implemented change to the current 1070 gate. See [TECHNOLOGY-RUNTIME.md](TECHNOLOGY-RUNTIME.md), [EQUIPMENT-RUNTIME.md](EQUIPMENT-RUNTIME.md) and [PORT-HEALTH.md](PORT-HEALTH.md). |
| 46 | The Church as an institution | Validation pending | Real Church holders, clergy, payments/remittances, canon kinship/probate, appeals and order discipline are integrated. Verify them against the separate-holder/real-flow contract in shared validation. See [CHURCH.md](CHURCH.md) and [SYSTEMS.md](SYSTEMS.md). |
| 47 | Crusades and foreign wars | Validation pending | Actual foreign hosts, crews, hull contracts, provisions, absence/return, losses and holdings are integrated. Complete native journey/custody/payroll and save/worker validation. See [FOREIGN-EXPEDITIONS.md](FOREIGN-EXPEDITIONS.md). |

## Economy, land and population

| # | Issue | Status | Next action / current evidence |
|---|---|---|---|
| 12 | Famine in most towns most years | Open | Famine remains a calibration failure across generated worlds. Short histories with conserved cash/goods do not establish adequate food delivery or long-term survival; complete the institutional consumers before recalibrating #23. |
| 13 | The famine annals line repeats every month | Open | Prevent monthly hunger-band crossings from repeatedly announcing the same famine; retain genuine new outbreaks and recoveries. |
| 20 | Two population models (C12) | In progress | Town population ceilings still derive from land/trade/workshops separately from household livelihoods. Reconcile the two without reducing people to conceal food or housing shortages. |
| 21 | Meadow on dry ground (C17) | Open | Restrict hay meadow to suitable wet bottomland. Profitable hay can currently displace too much ploughland on dry ground and contribute to #12. |
| 22 | Hamlets multiply (C16) | Open | Let/share existing holdings before landless families found more hamlets, and make pioneer groups form over time. Excess settlement multiplication also contributes to #15. |
| 23 | Calibration pass not yet done | Investigating | Recheck bread delivery, household purchasing, lordly/Crown reserves, supply response and growth across several worlds and eras after institutional validation. Money conservation alone does not close famine, depleted treasuries or stalled towns. Accepted economic choices are in [SYSTEMS.md](SYSTEMS.md#accepted-economy-and-growth-decisions). |
| 51 | Prices run away where little is offered | In progress | Separate smith-input deficits and livelihood-based herds/pasture are fixed. Sustained cloth/tool or other scarce-goods spikes still need longer supply-chain traces. Keep supply/demand pricing: trade must answer quickly; do not cap prices to hide missing production or transport. See the accepted economic decisions under #23. |
| 53 | Dairy is counted as grain | Open | Dairy is still represented as grain until a dairy good exists. Beast valuation now uses actual milk/fleece/increase yields; that repair does not close the dairy-good omission. |
| 54 | Meat's market is thin | Open | Household meat offers and famine slaughter fixed runaway village meat after the opening year in tested worlds. Supply is still thin; evaluate butchers, herd increase, preservation, dealer access and the halls' grain-only diet without inventing beasts or trade. |
| 61 | Direct-era opening households can exceed physical housing capacity | In progress | Native direct-era opening completion and capacity reports pass eight opening cases, but local housing shortfalls remain. Exhausted builder queues do not prove all legal geography exhausted. Finish the occupied-world census with #65. See [DIRECT-ERA-CAPACITY.md](DIRECT-ERA-CAPACITY.md). |
| 65 | An isolated settlement can have no public street from which to grow | Validation pending | The bounded legal market-street seed and actual-parent branch spacing are integrated; completed opening homes expose usable lanes. Verify the final native occupied-world census; remaining housing shortage is #61. See [ISOLATED-TOWN-OPENING-STREET-DESIGN.md](ISOLATED-TOWN-OPENING-STREET-DESIGN.md). |
| 86 | Repeated funded backlog can inflate monthly demand | Investigating | The paid Abbey campaign diagnosis reports that repeatedly requesting the same funded backlog inflates monthly demand. Reproduce/count distinct commitments and prevent double counting without pinning prices or fabricating supply. Keep separate from the implemented skip-reprice correction (#72). |
| 87 | Rural homesteads are suppressed by current siting and income criteria | Investigating | They remain implemented, with annual household decisions. The October10 direct-era opening no longer plays centuries of prior history and does not seed rural homes; October5 also tightened road/track access. Native 1001:42 sea/AD1066/9km at day60: 140 housed work-site candidates, 46 rejected by distance and 94 by benefit/cost; no candidate reaches funding/access. Another 494 households have no home and 2,017 no work site. Investigate actual holdings, subsistence/annual income, strip centroids and walking benefit before changing the model; this census does not prove impossibility in later worlds. See [SIMULATION-GROWTH-INPUTS.md](SIMULATION-GROWTH-INPUTS.md#rural-homestead-diagnosis-12-october-2026). |

## Performance, saves and late worlds

| # | Issue | Status | Next action / current evidence |
|---|---|---|---|
| 15 | Simulation advancement slows as world complexity grows | In progress | Local first-castle reservation filtering preserves the full 60-day coastal capture/RNG and 150-day native save bodies, private counters and raw records. AD1066 coastal/inland samples use 38.8%/35.0% less CPU; AD850 gains 7.7%, with instrumentation and windows kept separate. All 2,228 unique regression checks are verified across the 2,227-pass batch and a same-limit serial rerun of its one initial-capture timeout. The verified build is published to Pages and the container in release 02d5ece; target parity remains #84 and century-per-minute throughput is not achieved. Continue from the remaining measured daily kernels. See [PERFORMANCE.md](PERFORMANCE.md#local-simulation-performance-pass-12-october-2026), [SIMULATION-ORDER.md](SIMULATION-ORDER.md) and [SIMULATION-CACHE-INPUTS.md](SIMULATION-CACHE-INPUTS.md). |
| 16 | Fastest reaches 45% of its 30 days/s | In progress | Packet suppression improved Fastest, but Reel remains limited by the cost of a simulated day. Measure actual worker advancement against selected speed; close the CPU and durable-storage gaps with #15 rather than inferring throughput from the speed selector. |
| 33 | Once armies take the field, every day slows | Investigating | Route memory and bridge/landing corrections substantially reduced army cost. Measure remaining per-army work and campaign choices, especially blocked objectives, repeated replanning and prolonged camps. Do not treat old pre-fix timings as current results. |
| 55 | The late world's day grows with its history, not its people | In progress | Spent cargo and extinct empty owners are retired; mouthful-sized spoilage, goods carried home and lazy spoilage are implemented. Living households' empty records, dealer remnants and rows per living household still grow. Measure their late-world cost before choosing another retirement or inference design; keep dealer stocks by the accepted rule. |
| 6 | Resuming a save replays every day (minutes for late games) | Open | Use build-matched world snapshots in the browser worker/IndexedDB instead of replaying every day. Preserve the portable command journal and verify archive continuation. See [WORLD-SAVE.md](WORLD-SAVE.md). |
| 48 | We never test past year 20; Reel can't reliably reach 1066 | In progress | Run the build-frozen farm through long checkpoint chains to AD 1066 and later milestones, then additional worlds. Add foundings/decade, distant lots, castle kinds, list sizes and per-era profiles to its census. Shipped checkpoints and browser snapshot resume remain unfinished (#6). See [WORLD-SAVE.md](WORLD-SAVE.md). |
| 17 | The full history recorder (`history=full`) is off by default and lost its harness; is it dead code? | Open | Review the disabled `history=full` recorder and its missing harness. Distinguish it from the HistoryGraph machinery used by checkpoints and identity tests; restore a useful supported workflow or retire only genuinely unused code. |

## Inspection, geometry and advisor

| # | Issue | Status | Next action / current evidence |
|---|---|---|---|
| 27 | Inspecting things may change the simulation | In progress | Selected cold inspections and ten worker/reference views now preserve world/RNG, including own-save continuations. Remaining target-specific reads include planDraft → cached buildingName, cold church/keep cards → chOf/casOf, and storage quote pricing. Audit these before claiming all UI reads are pure. |
| 28 | Some back-garden lots reach far from their house | Open | Some native garden lots extend more than 60 m from their houses (126 observed lots). Fix actual parcel geometry and include distant lots in the late-world census. |
| 30 | Mill wheels are the wrong size and don't reliably touch the water | In progress | Wheel fit and 0.3 m immersion are verified; Pontmor still has a pale flat tail-race tile that does not visibly meet clear river water. Finish that visual connection; #83 addresses the separate reservoir/sluice defects. |
| 32 | Advisor can't reach every control or read every panel | In progress | Stable control discovery and the 17-check live advisor flow are implemented. Remaining coverage: card-name links are not controls; caravans, envoys, camps and overlay values are absent from game:state; knowledge partitioning is unfinished. |

## Local fixes and release work

| # | Issue | Status | Next action / current evidence |
|---|---|---|---|
| 83 | River mills create unnecessary valley-wide dams and overflowing ponds | Published | Removed speculative valley reservoirs from new river-mill siting; existing bank wheels/races operate without them. Existing pond rendering now stops upstream, with correctly aligned sluice/lock cuts and a 1.2 m wall. 34 focused checks, two coastal/inland native cases, exact same-build save/resave/resumed tick and worker-browser drawing pass. All 2,228 unique suite checks are verified across the full batch and serial startup recheck described in #15. New openings intentionally change history; a long mill soak is not claimed. Pages workflow [123](https://github.com/healdgar/furlong-kingdom-annals/actions/runs/38280855610) succeeded for 02d5ece; both container architectures match release HTML, assets and LICENSE byte for byte. Separate artifact parity remains #84. Evidence: /workspace/furlong-dam-check/. |
| 84 | Publication parity across release targets | In progress | Pages and container workflow [123](https://github.com/healdgar/furlong-kingdom-annals/actions/runs/38280855610) succeeded for release 02d5ece. Both linux/amd64 and linux/arm64 image layers contain byte-identical release HTML, all seven assets and LICENSE; the commit tag and latest resolve to the same image. Stamped HTML SHA256: `4f8115fe159f6d5b50e165211114563f032592031b7ad26b3fd6ad98764003dc`. The live Pages URL and GitHub API are blocked by this environment’s HTTP policy, so Pages byte parity remains unchecked. No callable claude.ai artifact publisher is available here; that target remains unpublished/unverified from this release. Documentation-only publication receipts retain this HTML. |
| 85 | Merged determinism branch cleanup | Needs verification | The retired notes carried deletion of the merged remote determinism branch as unfinished. Confirm that it still exists and is fully merged before cleanup; do not carry forward the old proxy denial as current evidence. |

## Institution validation

This shared validation record applies to the implemented institution and
lifecycle rows above; it is not a second task list. Follow the actual actors,
rights, supplies, payments and native completion predicates in
[SIMULATION-COMPLETION.md](SIMULATION-COMPLETION.md). #35 still needs a paid
completed core and operating own-use industries, with checkpoints taken at
closed days before another long campaign. Multi-era operation, conservation and
food calibration are not established by a short identity proof or a layout image.

## Recorded validation

- **Frozen lifecycle model `99f14a5`:** recorded 150 native days on 1001:42 sea,
  AD1200/6 km, across all seven speeds, including journaled patron gifts. Complete
  world/globals/layouts/closure code and every RNG stream matched; 906 raw outcomes
  matched. A day37 load/resave and 113 continued days/678 raw outcomes matched.
  The full batch had 2,201 passes and 11 failures; repaired affected fixtures then
  passed 70 checks. This is 2,215 distinct checks verified across runs, not one
  2,215-check passing batch. Recorded executable SHA256:
  `a985ada765e6f339ffabab500c4ed0969a606e90fb03daf0e8b925720408b109`.
- **Recorded browser gate for that lifecycle phase:** default 9 km/AD1066,
  eight native days plus eight saved continuation days, worker/main parity and
  ten matching views without changing world/RNG/commands/annals/settings/storage
  sequence. Software WebGL establishes operability, not hardware/Safari or
  century-per-minute throughput. See [SIMULATION-COMPLETION.md](SIMULATION-COMPLETION.md)
  and [SCREENSHOTS.md](SCREENSHOTS.md).
- **Interrupted paid Abbey campaign:** clean cash/goods/fault progress through
  closed day720 and a monthly call at day750 preceded external SIGKILL. No
  paid-active/completed-core checkpoint or completed-run timing was emitted.
  Kernel child CPU was 1234.36 seconds; starting load was 0.058594/0.440918/0.970215.
  The cause, termination wall time and end load are unknown. This is not a saved
  day750 world or completed-core pass. At live day549 a Cistercian church had
  10.831089/40.869015 timber installed for 554.523659 gold; material progress is
  not service attendance. Ignored evidence: `tools/soak-results/institutions-lifecycle-20261011/`.
- **Current local mill change (#83):** its own focused/native/save/browser checks
  are recorded in that row. It changes generated openings; frozen lifecycle
  proofs above do not certify the modified working tree. No new same-history,
  whole-suite, long-campaign or publication result is claimed.

The full superseded chronology and detailed older hashes/timings remain in the
[immutable pre-retirement Git record](https://github.com/healdgar/furlong-kingdom-annals/blob/a23ecc032754a303c70f84a4d4e90ea8cbba0101/docs/HANDOFF.md).
That is historical evidence, not an active tracker. Current statuses are only here.

## Retired items

#34's requested fault-hunting behavior is implemented: audit runs may carry on,
recording the first fault as the end of a valid baseline; played games still
throw. #52's reserve-preserving outlays were fixed in batch8. Both are retired
from the active list, with their history retained in Git; their IDs are not reused.
Historical era gates, birth curves and other explicitly accepted model customs
are design choices rather than unlisted bugs.
