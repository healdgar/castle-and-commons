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
| 15 | Simulation advancement slows as world complexity grows | In progress | The released first-castle allocation pass preserves complete 150-day native save bytes, every RNG, private counters and all raw outcomes; fresh matched AD1066 coastal/inland windows use 19.7%/3.5% less tick CPU, and AD850 uses 9.0% less. All 2,286 regression checks pass in one batch, including native paid-castle and royal-eyre save/load continuation. Published to Pages/container in [9ae52b6](https://github.com/healdgar/furlong-kingdom-annals/commit/9ae52b60b6db88e84d6be4c279d74cb871b24adb), with both image architectures matching HTML/assets/LICENSE; external target parity remains #84. The 13 October follow-up discarded five survey prototypes after mixed/regressive measurements; no additional runtime gain is claimed. A discovered model-run bug allowed different builds/worlds into one report with stale metadata; the new identity guard has eleven checks, including its snapshot loader, plus two added native geometry/coercion regressions. All 2,299 distinct checks are verified across the 2,297-pass batch and its unchanged-assertion timeout recheck plus the final report/snapshot tests. The actual native snapshot resumes one day with exact full/world/RNG digests and census against a fresh run. Tools/coverage update [9598442](https://github.com/healdgar/furlong-kingdom-annals/commit/9598442e32f842000d0c55c841298bb4138fac5f) is published to Pages/container with both image architectures matching the stamped HTML, assets and LICENSE; its game script is unchanged. External target parity remains #84. Castle clearance still leads the hot list; finish a reliable measured improvement and actual worker/storage throughput toward the century-per-minute goal. See [follow-up evidence](PERFORMANCE.md#follow-up-measurements-and-report-integrity-13-october-2026). Prior reservation filtering is published in 02d5ece. See [PERFORMANCE.md](PERFORMANCE.md#first-castle-survey-allocation-pass-12-october-2026), [SIMULATION-ORDER.md](SIMULATION-ORDER.md) and [SIMULATION-CACHE-INPUTS.md](SIMULATION-CACHE-INPUTS.md). |
| 16 | Fastest reaches 45% of its 30 days/s | In progress | Packet suppression improved Fastest, but Reel remains limited by the cost of a simulated day. Measure actual worker advancement against selected speed; close the CPU and durable-storage gaps with #15 rather than inferring throughput from the speed selector. |
| 88 | Animation becomes jerky at different simulation speeds | In progress | User identifies people and vehicles as the primary symptom. The local repair retains Reel’s landscape budget while moving existing meshes each frame, and buffers delivered calendar readings for path motion instead of running at nominal speed until prediction freezes. Worker walking plans retain bounded history/forecasts at delivered pace, including CPU-limited Fastest/Reel; no daily transaction or model scheduler changed. 87 focused display/clock/deferral/readonly/worker-boundary/source checks pass. In the six-speed GPU-excluded browser probe, Fastest vehicle positions change on 375/429 frames and Reel on 471/479, while their old screen clocks change on 12 and 2 frames respectively. The final candidate matches complete native save bytes, private counters and every RNG at days0/50/100/150, plus all 1,812 raw journal rows with clean inventory/cash/fault checks. All 2,231 full-suite checks pass, including native paid-castle/royal-eyre save/load continuation. Motion repair is published to Pages and the container in [b741919](https://github.com/healdgar/furlong-kingdom-annals/commit/b741919a2987a8c0e7f136147de4da3f97e8f0d8); workflow [125](https://github.com/healdgar/furlong-kingdom-annals/actions/runs/38290792728) succeeded. Both container architectures match the stamped HTML, assets and LICENSE; external parity limits remain #84. Actual structural work can still cause occasional main-thread hitches. See [PERFORMANCE.md](PERFORMANCE.md#animation-cadence-investigation-12-october-2026). |
| 33 | Once armies take the field, every day slows | Investigating | Route memory and bridge/landing corrections substantially reduced army cost. Measure remaining per-army work and campaign choices, especially blocked objectives, repeated replanning and prolonged camps. Do not treat old pre-fix timings as current results. |
| 55 | The late world's day grows with its history, not its people | In progress | Spent cargo and extinct empty owners are retired; mouthful-sized spoilage, goods carried home and lazy spoilage are implemented. Living households' empty records, dealer remnants and rows per living household still grow. Measure their late-world cost before choosing another retirement or inference design; keep dealer stocks by the accepted rule. |
| 6 | Resuming a save replays every day (minutes for late games) | Open | Use build-matched world snapshots in the browser worker/IndexedDB instead of replaying every day. Preserve the portable command journal and verify archive continuation. See [WORLD-SAVE.md](WORLD-SAVE.md). |
| 48 | We never test past year 20; Reel can't reliably reach 1066 | In progress | Run the build-frozen farm through long checkpoint chains to AD 1066 and later milestones, then additional worlds. Add foundings/decade, distant lots, castle kinds, list sizes and per-era profiles to its census. Shipped checkpoints and browser snapshot resume remain unfinished (#6). See [WORLD-SAVE.md](WORLD-SAVE.md). |
| 17 | The full history recorder (`history=full`) is off by default and lost its harness; is it dead code? | Open | Review the disabled `history=full` recorder and its missing harness. Distinguish it from the HistoryGraph machinery used by checkpoints and identity tests; restore a useful supported workflow or retire only genuinely unused code. |

## Playability and order feedback

The [12 October playability audit](PLAYABILITY-AUDIT-2026-10-12.md) records the
released defects and repair evidence. All six scoped repairs are verified and published to Pages and the container:
14 new regression cases, 15 real worker/browser flows plus the paving-estimate
check, native paid day-zero work/save continuation, and final 150-day complete
save/RNG/journal identity with clean conservation. All 2,245 unique suite checks
are verified across the 2,243-pass batch and unchanged-assertion rechecks of its
two missing fixture dependencies; 59 focused checks also pass on the final source.
Release [13447ff](https://github.com/healdgar/furlong-kingdom-annals/commit/13447ff55dfa6387f19a7bedad706c2a3380652c)
passed Pages/container workflow [127](https://github.com/healdgar/furlong-kingdom-annals/actions/runs/38305044317); both image architectures match
the stamped HTML, assets and LICENSE byte for byte. Target parity limits remain
#84; none awaits user acceptance.

| # | Issue | Status | Next action / current evidence |
|---|---|---|---|
| 89 | Opening-day works can charge repeatedly for the same completed order | Published | Completion guards, buttons, market-toll readers and advisor flags now recognize day zero without changing its recorded timestamp. Crown/lord mill and market checks verify one payment to actual builders, conserved coins and disabled “built” controls. Native paid mill/market save/load retains zero and rejects duplicates before/after reload, with clean five-day continuation. |
| 90 | Learning tab opens Overview in the simulation worker | Published | Learning is included in worker court views. Replies are keyed to their requested view and ignored after a newer selection; mouse and rapid keyboard navigation retain the actual Learning panel. Compact realm tabs wrap with usable spacing. |
| 91 | A ruler's host card fails silently in worker mode | Published | Host controls use viewport-independent wording; failed worker views produce a visible recoverable error. Real worker browser flow opens the called-out watch, exposes march/campaign controls and orders an actual native march. |
| 92 | Orders lack durable results and failed placement ends the order | Published | A persistent result survives expanded card refreshes, reports pending/accepted/refused or processed outcomes, actual net purse movement and links to new hosts/places/projects. Invalid placement retains its prompt; pending duplicate clicks are blocked and cancellation prevents late replies restoring placement. Govern town waits for its asynchronous card before opening Orders. Paving now announces the commissioned wage/material estimate rather than its lower recipe input. |
| 93 | Ground markers have no persistent explanation or hover labels | Published | Menu → Map symbols explains host badges, trade dots, event rings and construction marks. Existing picking supplies named hover labels; project pegs/bands/rings open actual progress, payments and stalled-state cards through renderer records with stable project keys. Browser checks pass for host hover and actual paving-band hover/map inspection. The user's exact other symbols remain unidentified. |
| 94 | Expanded planning sheet disables the map it asks the player to draw on | Published | Active planning stays compact, hides Expand and refuses programmatic expansion. A real 390×844 worker browser flow drags a street on the available map, receives its native survey refusal and closes with Escape. |

## Further UI and playability scan

Eight repairs (#95–101 and #103) are verified and published to Pages and the container. The fresh worker-browser
scan and before/after evidence are in
[UI-PLAYABILITY-SCAN-2026-10-12.md](UI-PLAYABILITY-SCAN-2026-10-12.md).
The full batch had 2,232 passes and three diagnosed failures: two stale fixture
interfaces and a new repeated family search. Unchanged assertions pass after
fixture corrections and a single-census implementation; all 116 affected checks
and 35 final control/source checks pass. This verifies 2,273 distinct checks
across the batch and rechecks, not one 2,273-pass batch. Final native 150-day
coastal and 30-day inland bodies, private counters, every RNG and all 2,276 raw
outcomes match the previous release, with clean cash/goods/fault checks. No repair
awaits user acceptance. Release [5d77d36](https://github.com/healdgar/furlong-kingdom-annals/commit/5d77d36c900b2cdca9592092a763cd78f0cca2f0)
passed Pages/container workflow [129](https://github.com/healdgar/furlong-kingdom-annals/actions/runs/38323934003); both image architectures
match the stamped HTML, all seven assets and LICENSE byte for byte.
Target parity limits remain #84; grid-origin/chronology work remains #102.

| # | Issue | Status | Next action / current evidence |
|---|---|---|---|
| 95 | Refreshing town accounts shows kingdom figures under the town heading | Published | Town refresh preserves its requested scope, body and scroll; keys distinguish town/reference/view. Native Rougecastel refresh retains 18,484.62 gold, and concurrent-town reply checks keep the latest town. |
| 96 | Late information replies replace a newer screen or restore a closed panel | Published | Pending views show status, current errors are recoverable inside the view, and navigation/full-view ownership guards discard stale replies/errors. Actual held worker ledger delivery cannot replace Crown or reopen a closed panel; departure clears busy state. |
| 97 | Find, Visit and Follow can do nothing on cards opened by name | Published | Camera controls consume authoritative worker type/code/position metadata. Native named monarch Find and live-host Follow work, including an actual enlisted person opened through Family. UI references resolve real army rolls and promoted people; dead-person Show home uses its exact building. The simulation person finder is unchanged. |
| 98 | Expanded sheets disable keyboard tabs and nested links can trigger their parent control | Published | Expanded tabs support arrows/Home/End and focus; custom buttons work inside dialogs while native nested anchors/buttons retain their own activation. Native Enter on the compact host's town link opens the town; Tab/Escape behavior remains verified. |
| 99 | Linked-card navigation has no way back to the previous screen | Published | Back keeps at most 24 renderer routes, resolves current records and restores expansion/view/scroll/camera. Native spouse and account returns, foreground references and superseded-completion guards pass. Close/new roots reset the trail. The advisor discovers and presses Back and omits unavailable planning expansion. |
| 100 | Known family links become indistinguishable choices | Published | Known Family links use exact IDs and native headings. One census adds age/trade/place/member counts, retains real army rolls, active travellers and promoted people without duplicates, and explains genuinely empty records. All 28 native Dumont choices are distinct before and after call-out; a real soldier link opens its person card and follows its live host. Trade reference scope remains verified. |
| 101 | Persistent order results cover phone Menu controls | Published | Opened Menu rises above the floating result. At 390×844 its actual Help click opens the modal, and closing Help retains the native call-out result. |
| 102 | Roman street inheritance depends on the opening date and has false foundation dates | Published | Seeded predecessors retain Roman core dimensions, street lines and ancient foundation dates at AD850 and AD1066, with irregular medieval lanes and dated later growth. Current capital/border role cannot invent a Roman past; live foundations use their actual date. Quay surveys also respect standing footprints, including smoothing. All 2,280 distinct checks are verified across the 2,276-pass/two-failure full batch and 74 passing affected rechecks, including the repaired coastal collision, worker-only origin contract and two new quay cases. Native origins/core geometry, three 120-day street worlds and four saved-world continuations pass; three 30-day coastal/inland campaigns conserve cash/goods with no faults. Generated openings/history intentionally change. Release [1f065c9](https://github.com/healdgar/furlong-kingdom-annals/commit/1f065c90a7a7185e93bb8496f7d3c04c7195e990) passed Pages/container workflow [131](https://github.com/healdgar/furlong-kingdom-annals/actions/runs/38334224698); both image architectures match the stamped HTML/assets/LICENSE. Target parity limits remain #84. Design, limits and rendered evidence are in [SYSTEMS.md](SYSTEMS.md#settlement-origins-and-surviving-roman-streets). |
| 103 | Birthdays and earlier life dates display undefined seasons and negative days | Published | Card display normalizes earlier-year offsets and reports missing dates as unrecorded. The actual Yves Dumont birthday now reads Born Winter 84, AD1034. Negative-year/season boundaries and current/future compatibility pass; the simulation formatter, birth/event records and final native history are unchanged. |

## Inspection, geometry and advisor

| # | Issue | Status | Next action / current evidence |
|---|---|---|---|
| 27 | Inspecting things may change the simulation | In progress | Selected cold inspections and ten worker/reference views now preserve world/RNG, including own-save continuations. Remaining target-specific reads include planDraft → cached buildingName, cold church/keep cards → chOf/casOf, and storage quote pricing. Audit these before claiming all UI reads are pure. |
| 28 | Some back-garden lots reach far from their house | Open | Some native garden lots extend more than 60 m from their houses (126 observed lots). Fix actual parcel geometry and include distant lots in the late-world census. |
| 30 | Mill wheels are the wrong size and don't reliably touch the water | In progress | Wheel fit and 0.3 m immersion are verified; Pontmor still has a pale flat tail-race tile that does not visibly meet clear river water. Finish that visual connection; #83 addresses the separate reservoir/sluice defects. |
| 32 | Advisor can't reach every control or read every panel | In progress | Stable control discovery and the 17-check live advisor flow are implemented. Remaining coverage: card-name links are not controls; caravans, envoys, camps and overlay values are absent from game:state; knowledge partitioning is unfinished. |
| 104 | Woodland repeats solid crowns and renders full tree meshes at map distance | In progress | An opt-in game trial now imports the seven native Forestmodeler oak/birch/fir/larch individuals: **Menu → Preview grown trees**, with immediate return to the original palette. Three packed directional atlases share 24 spatial batches in the native 1001:42 sea/AD1066/9km opening; near/middle pools are globally bounded at 256/2,048. The 11-view worker capture has linked shaders and no GL errors, preserves all 57,320 instances on switching, transfers display clearing, and leaves the winter shadow map byte-identical under camera-only rotation. Matched realm submission falls from 3,072,113 triangles/100 draws to 1,809,759/79; this excludes shadow work and is not a hardware speed claim. Complete native save bytes, every RNG, private counters and raw outcomes match at days0/50/100/150 in AD1066 sea seed1001/fate42, with a matched conserved 30-day inland seed2002 case. All 2,306 regression checks pass. The final WebGL2 and forced-WebGL1 worker runs each pass 11 matched views, preview switching, initial hidden-tree restoration, display clearing and the fixed winter shadow-map check. The preview is ready for publication; live Pages/container parity remains subject to #84. Close foliage cards remain angular, the source palette is North American, and regrowing saplings retain the original representation. Regional genomes, art refinement and hardware/mobile acceptance remain open. No game engine enters Forestmodeler. See [RENDERING.md](RENDERING.md#grown-woodland-integration-trial) and the [independent asset contract](https://github.com/healdgar/forestmodeler/blob/codex/woodland-assets/docs/WOODLAND-ASSETS.md). |
| 105 | Sun shadows switch off abruptly and winter casters depend on the camera | Open | Captures at camera distances 1,590/1,610 m confirm the hard 1,600 m cutoff. The default winter crown/depth shaders both use the player's eye rather than a fixed branch skeleton; The opt-in #104 trial has light-facing casters with a byte-identical winter map under two camera bearings; the default palette and original regrowing saplings still need that repair. Fade shadow contribution before disabling its map and use stable winter/light-facing casters. Separately verify the below-horizon sunlight risk: daylight's 0.14 floor makes its >0.05 shadow test always true. Nighttime was not captured. Preserve the existing PCF, snapped coverage and texel-scaled bias budgets. See [RENDERING.md](RENDERING.md#shadows). |
| 106 | Close window textures have no interior depth | Open | The town capture shows repeated flat dark openings. Consider view-ray interior mapping only inside resolved window openings, fading to the existing appearance at map scale and respecting shutters/unglazed medieval windows. This is a proposed visual enhancement after #104/#105, not implemented room geometry or a simulation feature. See [RENDERING.md](RENDERING.md#proposed-asset-contract). |

## Local fixes and release work

| # | Issue | Status | Next action / current evidence |
|---|---|---|---|
| 83 | River mills create unnecessary valley-wide dams and overflowing ponds | Published | Removed speculative valley reservoirs from new river-mill siting; existing bank wheels/races operate without them. Existing pond rendering now stops upstream, with correctly aligned sluice/lock cuts and a 1.2 m wall. 34 focused checks, two coastal/inland native cases, exact same-build save/resave/resumed tick and worker-browser drawing pass. All 2,228 unique suite checks are verified across the full batch and serial startup recheck described in #15. New openings intentionally change history; a long mill soak is not claimed. Pages workflow [123](https://github.com/healdgar/furlong-kingdom-annals/actions/runs/38280855610) succeeded for 02d5ece; both container architectures match release HTML, assets and LICENSE byte for byte. Separate artifact parity remains #84. Evidence: /workspace/furlong-dam-check/. |
| 84 | Publication parity across release targets | In progress | Latest tools/coverage release [9598442](https://github.com/healdgar/furlong-kingdom-annals/commit/9598442e32f842000d0c55c841298bb4138fac5f): Pages/container workflow [135](https://github.com/healdgar/furlong-kingdom-annals/actions/runs/38436558919) succeeded. At publication its commit tag and latest matched image index `sha256:162b88b5e974d7e5f1cb3a21c86f7c4869395fb2523a3b5f200ed554ddc4c9f9`; both linux/amd64 and linux/arm64 layers contain byte-identical release HTML, all seven assets and LICENSE. Stamped HTML SHA256: `c77c0501f0852dd7cf3a80415c034765c8e946b8d7f1efe75f7e47ec285e91c1`. The game script remains byte-identical to 9ae52b6; only the visible build stamp changes. A fresh live Pages fetch was rejected by the proxy with CONNECT HTTP403, so live Pages byte parity remains unchecked. No callable claude.ai artifact publisher is available here; that target remains unpublished/unverified from this release. Documentation-only receipts retain this HTML. |
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
