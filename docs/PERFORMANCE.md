# Simulation performance

## Follow-up measurements and report integrity, 13 October 2026

The next castle-survey pass established no reliable additional CPU gain.
Fixed-shape blocker views increased profiled process CPU by 8.1% in their
matched 30-day coastal pair (3055.62→3303.55 ms/day, load0.5→1.1 / 1.1→1.4).
A smaller combined-bound rejection preserved complete native history, but its
unprofiled tick CPU moved in opposite directions across the three worlds:

| Start / world | Days | Baseline / prototype CPU ms/day | Baseline / prototype load0 |
|---|---:|---:|---|
| AD850, 1001 sea | 150 | 741.65 / 818.60 | 1.20→1.19 / 1.19→1.59 |
| AD1066, 2002 land | 30 | 4351.54 / 5058.42 | 1.59→1.18 / 1.18→1.56 |
| AD1066, 1001 sea | 30 | 2457.00 / 1851.89 | 1.56→1.57 / 1.57→1.40 |

The bound prototype matches every native save-body byte, RNG stream and hash
counter at days0/50/100/150 in sea AD850 and days0/30 in the AD1066 worlds.
All 1812/465/372 raw journal rows match, with no inventory/fault failures and
maximum absolute cash residual 6.56e-10. Its combined comparison uses 923.89
child CPU / 701.62 wall seconds, load1.20→1.40, peak RSS1462788KB. These are
proofs for a discarded experiment; the released survey implementation is retained.

Broader private-bucket reuse, terrain-cell caching and splitting clearance
functions also failed to establish a consistent benefit in fixed native-world
survey probes. The repeated-probe CPU varied materially between runs, and the
split's lower mean coincided with baseline outliers and a higher median.
These prototypes are discarded too. Current absolute timings are higher than
in the previous pass; comparisons use fresh source pairs. No extra speedup is
claimed, and actual worker/storage throughput and the century-per-minute goal
remain #15/#16. The updated profiles still put castle clearance first, followed
by growth, economy and institutional foundations.

Investigation found a measurement bug: `model-run` could append a different
build or opening world's windows to an existing `--out` report while retaining
its old source hash and world metadata. Its first window could also belong to
an older invocation. Raw CPU-profile files and hot-list records identified the
current input correctly; the report header did not. The comparisons above use
the matching latest window, frozen source files and the independent native gate.

`model-run` now checks an existing report's source SHA, seed, fate, coast,
opening year and map-size argument before opening a world, and again before
appending. A mismatch requests a fresh `--out` path and preserves the old file.
New reports record map size; legacy reports without it accept the default map
only. Matching reports retain all their prior windows and runs. Eleven checks
cover every mismatch, legacy defaults, malformed evidence and the actual CLI's
refusal before boot. A single-file startup-snapshot smoke also serializes the guard and the actual day-parts list; snapshot builds read that list through built-in fs instead of the unsupported user-module loader. Two additional native survey regressions compare fresh
and retained sites, complete graphs/counters, removal and uncertain-dimension
coercions across rectangles, lots, polygons, empty polygons and graveyards.

The 2,298-check full batch has 2,297 passes and one initial-world capture
timeout in the unchanged headless eight-day save/replay check. Its original
30-second limit and every assertion pass in isolation, alongside all eleven
final tooling checks. This verifies 2,299 distinct checks across the batch and
rechecks, including the native paid-castle and AD1200 royal-eyre save/load
continuations. The batch uses 6337.99 child CPU / 2328.85 wall seconds,
load0.04→1.04, peak RSS2314388KB. The 12-check recheck uses 208.49 child CPU /
184.17 wall seconds, load0.62→1.23, peak RSS1404128KB. These are test-runner
costs. The actual native snapshot build resumes one day with the same full
digest, world graph, world-only graph, RNG hash and census as a fresh
AD850/1001:42 coastal run. Its three serial jobs use 164.45 child CPU /
147.56 wall seconds, load0.40→1.35, peak RSS755868KB; this proves one-day
continuation, without establishing snapshot throughput or long-term validity.
Publication checks are running. No simulation code changes are included in
this tools update. The baseline HTML SHA256 is
`26916db4b4c65a8efefe29a9c81e1c00821071485a760c79d3897428fb862296`.
Frozen sources, native bodies, profiles and probe receipts remain outside the
checkout in `/workspace/furlong-performance-clearance/`. Current status and next
work belong in [ISSUES.md](ISSUES.md#performance-saves-and-late-worlds).

## First-castle survey allocation pass, 12 October 2026

The current Roman-origin release's AD1066 coastal profile attributes 30.5% of
sampled CPU to first-castle decisions. The largest costs are repeated point
clearance and writing the full-world failure certificate. This pass preserves
all geometry, financial decisions, retry cadence and recorded certificate inputs.

Native surveys reuse consecutive equal private building/road bucket results,
including their exact ordered objects, counter increment and object stamps.
Copied finite bounds avoid allocating a validation array at every probe;
field permissions and copied building rotations are reused only within the
synchronous survey. The certificate reader overwrites its owned arrays and
truncates completed reads, retaining their storage and every original value.
External buffers, replaced helpers/writers, inherited future stamps and unsafe
counters retain the documented reference paths. The complete dependency proof
is in [CASTLE-FOUNDATION-DEPENDENCIES.md](CASTLE-FOUNDATION-DEPENDENCIES.md#native-point-reuse-within-a-survey-12-october-2026).

Fresh serial baseline/candidate native measurements (fate42, default9km):

| Start / world | Days | Baseline tick CPU ms/day | Candidate tick CPU ms/day | Reduction | Baseline / candidate load0 |
|---|---:|---:|---:|---:|---|
| AD1066, 1001 sea | 30 | 1364.80 | 1096.57 | 19.7% | 1.24→1.30 / 1.30→1.27 |
| AD1066, 2002 land | 30 | 1526.39 | 1472.24 | 3.5% | 0.93→1.16 / 1.16→1.24 |
| AD850, 1001 sea | 150 | 335.43 | 305.07 | 9.0% | 0.06→0.75 / 0.75→0.93 |

These are individual matched windows, not universal speed guarantees. Early
point-only prototypes gave mixed small changes; only the final source's fresh
paired measurements above describe this release candidate. Native ticks use an
in-memory raw journal acknowledgement sink. Compression, IndexedDB, rendering
and view delivery are excluded; checkpoint audits/encoding are outside the
tick timer, though their allocations can affect subsequent GC.

A separate matched 30-day coastal profile measures process CPU at
1430.36→1231.03 ms/day (13.9% less), load0.1→0.5 / 0.4→0.8. Its sampled
castle attribution falls 318.67→202.94 ms/day (36.3% less); all sampled CPU
falls 1043.69→861.26 ms/day. Sampling totals, process CPU and nested phase
elapsed timers are different measurements and are not pooled. Castle work
still leads the updated hot list, followed by economy and institutional
foundations. This does not establish browser-worker throughput or the
century-per-minute goal; #15/#16 remain open for those larger limits.

Complete native save-body bytes, every RNG stream and the private hash counter
match at days0/50/100/150 in AD850 sea and days0/30 in both AD1066 worlds.
Every raw outcome byte matches: 1812, 465 and 372 accepted rows respectively.
Survey reads/misses/hits are identical too; no surveys were deferred or omitted.
Checkpoint inventory/fault checks pass and cash residuals match the reference,
with maximum absolute residual 6.56e-10. The combined six-run native gate uses
362.75 child CPU / 270.15 wall seconds, load0.06→1.27, peak RSS1332476KB.

All 2,286 checks across 217 test files pass in one full batch, including the
paid first-castle and AD1200 royal-eyre native save/load continuations, the
current Roman-origin openings, projection checks and the six added survey
regressions. The batch uses 3727.39 child CPU / 1399.88 wall seconds,
load0.92→1.11, peak RSS2562324KB. These are test-runner costs, not game
throughput. Only the visible build stamp changes after these gates.

Release [9ae52b6](https://github.com/healdgar/furlong-kingdom-annals/commit/9ae52b60b6db88e84d6be4c279d74cb871b24adb)
is published to Pages and the container; workflow
[133](https://github.com/healdgar/furlong-kingdom-annals/actions/runs/38345084189)
succeeded. Both image architectures contain byte-identical stamped HTML, all
seven assets and LICENSE. Release HTML SHA256:
`26916db4b4c65a8efefe29a9c81e1c00821071485a760c79d3897428fb862296`.
Fresh live Pages verification is blocked by the proxy's CONNECT HTTP403;
no callable claude.ai artifact publisher is available. Those external parity
limits remain #84. Documentation-only receipts retain this same game build.

Baseline HTML SHA256: `8e5dc2c8b74f2bcde120d60c0ad67d161fcc1203febf70663f6ff03a9170b989`.
Frozen candidate HTML SHA256: `07e5823ccf464751df797ac174a3752eabea0bcaea8e5742318e7307771903a5`.
Sources, prototypes, native bodies, profiles and timing receipts remain outside
the checkout in `/workspace/furlong-performance-next/`. Current regression and
publication status belongs solely in [ISSUES.md](ISSUES.md#performance-saves-and-late-worlds).


## Animation cadence investigation, 12 October 2026

The user identifies people and vehicles as the primary symptom. At paced high
speeds, `presStep` spends the nominal pace and reaches its bounded prediction
limit while the worker is completing an expensive day. `workerWalkOn` also
emits a single position at nominal Fastest/Reel rather than a walking track,
even when actual delivered progress is slow. Traffic and people therefore hold
and jump despite continuing page frames. Separately, Reel’s `projectWorld`
guard has wrapped all of `animateWorld` since `e0cd7e5` (5 October), limiting
motion to 10 Hz alongside landscape work. Release `02d5ece` did not change
these clocks, worker delivery, mesh invalidation or the render loop.

The local repair keeps the HUD’s current clock and the authoritative worker.
People and traffic interpolate delivered readings over the time their preceding
progress took, using a disposable motion clock that never runs past a reading.
Repeated/stale readings do not restart its blend, pause freezes it and a new
world resets it. No motion clock or pacing decision enters the saved simulation.
Worker walking plans use that delivered pace and retain bounded past/future
path samples across slower replies; delayed forecasts are limited to 240 steps
per request. They reuse the existing semantic street/walking planner and meshes.
Reel still budgets landscape projection while updating mesh motion each frame.
Direct draw callers still project by default; simulation ticks, commands,
storage and packet acknowledgements are unchanged.

A serial worker-browser probe runs all six moving speeds near the Porthcrug
mill in 1001:42 sea, AD1066/default9km. GPU submission is excluded after native
WebGL initialization because this cloud host’s software GPU took seconds per
drawn frame; actual animation, worker, projection, details and UI paths run.
In the current eight-second candidate windows, Fastest vehicle positions change
on 375 of 429 page frames, while the original screen clock changes on 12 frames;
Reel positions change on 471 of 479 frames while its original clock changes on
two. People move on 278/429 and 287/479 frames respectively; standing/indoors
actors are counted without forcing them to move. These are pose-cadence counts,
not hardware FPS or simulation throughput. The baseline eight-second windows
move vehicles on 20/417 Fastest frames and
5/476 Reel frames. People move on 0/417 and 1/476 frames, but the Fastest
baseline has no displayed people during that window; these are not matched
cohorts. Independent sweeps reach different days and actor populations. Baseline
load0 is 0.19→1.65, candidate 0.08→1.88, with no browser exceptions.

Most measured daily packets do not invalidate structures/details/roads. Actual
changes can still invoke whole-scene feature and road work, causing occasional
main-thread hitches. Worker throughput remains #15/#16 and those structural
hitches remain part of #88.

Eighty-seven focused display/clock/deferral/readonly/worker-boundary/source checks
pass. The final native comparison matches complete save-body bytes, private hash
counters and every RNG at days0/50/100/150, plus every byte of 1,812 raw journal
rows. Inventory/fault checks are clean and final cash residual is 1.01e-10,
identical to the baseline. The deployed baseline’s simulation script is
byte-identical to the earlier performance-gated source; its completed native
bodies are reused as the reference. This candidate gate uses 80.22 child CPU /
61.80 wall seconds, load0.50→1.25, peak RSS913504KB. Final HTML SHA256:
`f8917b6e32a0ed82bd8eed9cb54fa6c3bd90d2bbfafb6eb89823010ae9250c9e`. All 2,231 checks across 214 test files pass in one full batch, including
native paid-castle and royal-eyre save/load continuation. The batch uses
3835.60 child CPU / 1399.63 wall seconds, load1.25→1.01, peak RSS2397140KB.
Release [b741919](https://github.com/healdgar/furlong-kingdom-annals/commit/b741919a2987a8c0e7f136147de4da3f97e8f0d8) is published to Pages and the container; only the visible build
stamp changes after the gates. Both image architectures match the release HTML,
assets and LICENSE byte for byte. Live Pages-byte verification and the separate
claude.ai artifact remain #84. The initial Reel-only gate is superseded by this complete
extended-candidate validation.
Current status is solely in [ISSUES.md](ISSUES.md#performance-saves-and-late-worlds).
Sources and evidence are outside the checkout in `/workspace/furlong-animation-pass/`.

## Local simulation performance pass, 12 October 2026

The leading cost in the current AD1066 coastal profile is first-castle geometry. Failed-site memory has zero hits across 217 fresh misses
in 60 days: unrelated changes to the full-world geometry certificate force new
surveys. Each yard probe then scans reservations throughout the realm.

Fresh surveys now project the same native reservation polygons once and omit
only geometry wholly outside that operation's conservative probe envelope.
Retained paid sites still check all current reservations. Roads, exact nearby
predicates, candidate order and private hash-query counts remain unchanged.
Radius fitting also reuses each ray's sine/cosine. The dependency proof and
fallbacks are in [CASTLE-FOUNDATION-DEPENDENCIES.md](CASTLE-FOUNDATION-DEPENDENCIES.md#fresh-survey-reservation-envelope-12-october-2026).

Serial measurements on this cloud host (fate42, default9km):

| Start / world | Days | Measurement | Baseline CPU ms/day | Candidate CPU ms/day | Reduction | Baseline / candidate load |
|---|---:|---|---:|---:|---:|---|
| AD1066, 1001 sea | 60 | Profiled process CPU | 3822.33 | 2340.19 | 38.8% | 0.4→1.1 / 0.7→1.5 |
| AD1066, 2002 land | 30 | Unprofiled tick CPU | 4888.57 | 3176.21 | 35.0% | 1.19→1.06 / 1.06→1.48 |
| AD850, 1001 sea | 150 | Unprofiled tick CPU | 630.16 | 581.86 | 7.7% | 0.39→1.04 / 1.04→1.19 |

Comparisons are within each row; instrumentation and windows differ and are not
pooled. The coastal phase timer attributes 1897.92→640.14 ms/day to castle work;
those nested timers measure synchronous elapsed time, whereas the table uses
process CPU. The raw journal uses an acknowledgement sink in memory. Browser
compression, IndexedDB, view delivery and drawing are excluded. The unprofiled
runs flush at closed-day boundaries and perform checkpoint audits outside the
tick timer; their allocations can still influence later GC. These are bounded
native measurements, not shipping worker throughput or a century-scale result.

The 60-day coastal run matches the full simulation capture and every RNG stream.
The native comparison matches complete save-body bytes, private hash counters
and every RNG at days0/50/100/150 in AD850 sea, and days0/30 in AD1066 inland.
Every raw journal byte matches (1812 and 464 accepted rows respectively).
Checkpoint inventory checks pass; cash residuals are identical to baseline,
with maximum absolute residual 5.87e-10. The combined native gate uses 528.35
child CPU / 433.17 wall seconds, load0.39→1.48, peak RSS1410180KB.

The full suite reports 2,227 passes and one 30-second initial-graph-capture
timeout across 214 files / 2,228 checks. The unchanged headless startup/replay
check passes serially with the same capture limit: all 2,228 unique checks are
verified across those runs, not one clean parallel-suite pass. The full batch
uses 4238.88 child CPU / 1542.68 wall seconds, load1.48→1.16, peak RSS2354588KB;
the serial recheck uses 190.61 CPU / 170.55 wall seconds, load0.59→1.29.
Paid castle and AD1200 royal-eyre native save/load continuation, current mill
opening/save checks, projection checks and the new reservation/ray regressions
are included. These are test-runner costs, not game throughput. Release
`02d5ece` publishes this candidate to Pages and the container; only the visible
build stamp changed after these gates. Both container architectures contain
byte-identical HTML, assets and LICENSE. Pages live-byte verification and the
separate claude.ai artifact remain #84.

The baseline snapshot already includes the local river-mill changes; both sides
hold those intended model changes constant. Baseline HTML SHA256:
`3fdd0a6aec38f657827f3a8608eefc33cf548a4311ecd349cc082b4f209fc429`.
Candidate HTML SHA256:
`e1cdc4c9e8331e021b67b93db22d94fa064001344aff201ae62bcd988fd7a6bf`.
Local sources, profiles, native bodies and measurements are retained outside the
checkout in `/workspace/furlong-performance-pass/`. Current validation/release
status remains solely in [ISSUES.md](ISSUES.md#performance-saves-and-late-worlds).


**Frozen connected-layout prefix (`55b32a9`):** HTML `4a8eed633cde8de3bf1813d2de43b8040996aa3e200258e9086fc7fe6fafd1bc` was deliberately stopped at compared audited closed day 60, with 366 accepted raw outcomes, two abbeys, and clean cash/goods/faults. Reference and bounded-reservation runs match the complete graph and every RNG stream through that boundary; this is not a 150-day proof. The source-matched checkpoint reload/resave is exact (`179b5881fc8d825cae6019642d01cfc74a124eb62c24d28286a26f9cc7c4b73e`). Total child CPU was `613.785417` / wall `567.454874`, load `0.058594→1.313965`, RSS `1852884` KB. Audited step CPU `113.900951` reference / `96.385633` candidate is partial same-model evidence, not browser throughput. The initial merged 43-check fixture batch failed during helper initialization; actual imports are repaired, with the final assembled rerun pending. The continuation audit confirmed a private-purpose housing/refit bypass and an incomplete Abbey church-fabric quote. Church growth already runs through `tickChurches→tickChurchBodies→abbeyFabric`; its budget omits timber and technology-adjusted costs. The earlier claim of a missing caller was incorrect. Those two repairs are being assembled before the next native batch. Frozen source, original checks/deadlines, marker and closed-save evidence remain in ignored `institutions-connected-20261011`; none is retagged as the new phase.

**Assembled continuation:** shared connected Abbey/College layouts and exact operation-local reservation bounds are integrated; journaled patron grants and the private-path mask-width correction are implemented; private-purpose housing and the complete Abbey fabric quote are being repaired. This intentionally extends the model. Their native completion/save, worker, drawing and release gates have not passed yet. The bounds optimization needs a same-model 150-day reference comparison, distinct from the prior model’s evidence. The last published game remains `318811d`.

**Frozen `af07d28` construction outcome:** its unassisted paid-core scenario was deliberately stopped at audited closed day 720 after 570 continuation days. Four abbeys exist and two Benedictine churches completed, but the selected Cistercian church has installed only `30.03327699/40.86901505` timber units, with `1050.43567498` gold spent on materials and `0.43952749` left. Initial capital was consumed by actual purchases; no full-core or industry pass is claimed. The recorded player control to give further Abbey grants was missing and is now being implemented; no automatic top-up, price pin or invented income is warranted. Cash/goods/fault audits stayed clean (maximum cash residual `2.64840594e-10`). The runner used `1725.356433` child CPU / `1686.091616` wall seconds, load `0.104492→1.0`, maximum RSS `1187972` KB; audits/saves are included, not browser throughput. Exact source-matched reload of the closed checkpoint reproduces its entire graph and every RNG stream, with byte-identical resave (`747e565f08899ff9ff5c9dac20d9a031a91685286b6c1eae4545d9e822215d15`). Its graph/save/marker and `closed-checkpoint-verified.json` remain in ignored `institutions-final-af07d28-20261011`. Weighted hunger `0.29351466`, famine population share `0.40788895`, and 1676/3420 famine place-days leave economy calibration open.

**Frozen predecessor (11 October):** `af07d28` (production `af07d282f03100f61fa6ad2f661ce3d8f6320882`, HTML SHA256 `11fb123ebd3e7ded5f40ad1739fd78f6ce85b7413cf5d216a11745b8840bc8cc`) now passes the fresh 150-day native comparison of full world/globals/layouts/closure code and every RNG stream at all seven speeds, with 906 accepted raw outcomes. The actual day-37 save/load reproduces the full graph and exact resave, then 113 days/678 raw continuation outcomes through day 150. Maximum cash residual is `2.1100277081131935e-10`; goods/fault checks are clean. The runner used `2252.874268` child CPU / `2108.689493` wall seconds, load `0.128906→1.272949`, maximum RSS `1922784` KB. Audited fixed-speed-5/variable-speed steps cost `397.092032` / `396.617865` seconds on this same candidate; these include audits/serialization and imply no previous-source performance comparison or browser throughput. Day 150 has three abbeys, 11 schools, 227 projects and population `4746.578524`; weighted hunger `0.0210579595` and famine population share `0.00567918953` (5/900 famine place-days) leave calibration open. The earlier same-source 90-day feasibility pass remains separate evidence (`358.092691` child CPU / `345.504920` wall seconds). Source-specific results are retained in ignored `institutions-final-af07d28-20261011/history.json` and `history-time.json`. The reviewed 114-reader route fixture rerun passes all 32 original checks; together with the 116 unaffected affected-batch checks, 148 unique checks are verified across those runs, not one combined 148-check pass. Paid core/industry, full suite, worker, era, current drawing and release gates remain pending. Frozen `61dd0bb` history and closed-day-660 church-only draw remain tied to their original source. Opening capacity, legacy cadence debt and the century-per-minute target remain explicit limits; the new shared connected-layout phase and held reservation bounds optimization are not part of this frozen HTML.

Frozen `61dd0bb`’s later paid abbey core gate was deliberately stopped at audited closed day660 after 510 continued days, with four abbeys and at least one completed Benedictine church; this is neither a timeout nor a full-core/industry pass. The run used `1044.221707` child CPU / `1002.7718814` wall seconds, load `0.05615→1.37451`, maximum RSS `1245040` KB, including audits/saves rather than browser throughput. `requested-closed-checkpoint.json` and `failed-native-abbey-core.fws` remain in ignored `institutions-final-61dd0bb-20261011`. The subsequent church-only draw verifies the exact saved/source graph, exact resave and every RNG stream, with all textures ready and zero errors. It shows a separately placed functional church; recognizable cloister architecture is not implemented yet.

Frozen `61dd0bb` (HTML SHA256 `503eec9311722394d7281d3f56e452be1d1a7944831138fca2d4f6d9b00680d7`) passes the fresh 150-day native comparison of complete world/globals/layouts/closure code and every RNG stream at all seven speeds, with 906 accepted raw outcomes. The day-37 native load reproduces the full graph and exact resave, then 113 days/678 raw continuation outcomes through day 150. Maximum cash residual is `1.780904312909115e-10`; goods/faults are clean. The runner used `1822.352379` child CPU / `1679.469807` wall seconds, load `0.730957→1.013672`, maximum RSS `1911716` KB. Audited steps cost `248.294278` seconds at fixed speed 5 and `246.477937` at variable speeds on the same candidate; this is no old-source performance comparison or browser throughput result. Day 150 has three abbeys, 11 schools, 217 projects and population 4835.3554; weighted hunger 0.01539279 and famine population share zero do not close economy calibration. Paid core/industry, coupled suite, worker, era and drawing/release gates remain pending; legacy cadence debt and the century-per-minute target remain explicit limits.

The same-source 90-day feasibility also passed with three abbeys/235 projects and clean cash/goods/faults. Day-50/day-90 tick-plus-audit CPU was `1.607689` / `2.994492` seconds; aggregate `233.482374` child CPU / `220.536047` wall seconds, load `0.32861→1.16992`, RSS `1039784` KB, includes generation, audits and saves. It is separate feasibility evidence, not completed paid core/industry or release validation. Root's 126 focused checks and full-source boot pass.

The frozen `d016a6a` 150-day native gate was deliberately stopped for measured performance after logged matches through 60 closed days and 366 accepted raw outcomes, with two abbeys, 186 projects and clean money/goods/faults; this is neither a timeout nor a 150-day pass. Exactly readonly live partial-day-67 inspection found every native founding/approach certificate true. Its 5.687762-second live sample attributes 97.9698546% inclusive work to `armyDetour`, after the prior day-50 straight-span cost was resolved. The stopped runner used 1308.025605 child CPU / 1251.1622995 wall seconds, load 0.474609→1.0, maximum RSS 1840044 KB; these include generation, audits and saves and are not browser throughput. That frozen diagnosis motivated the funded path-length/ellipse repair now integrated in `61dd0bb`; it is not retagged as current-source evidence. Day-0/day-37 FWS remain same-source; there is no partial-day-67 snapshot or new-source retag. Full native history/save, paid core/industry, coupled suite, worker, era and drawing/release gates remain pending.

The preceding frozen `04614a7` feasibility run completed 60 audited closed days with two actual abbey foundations, 186 projects, clean goods/faults and maximum cash residual `1.78e-10`. Day 50 used `1.905215` child CPU seconds including audits; aggregate `172.793065` child CPU / `162.645695` wall seconds, load `0.187→1.269`, also includes generation and saves. This is source-specific feasibility before the final reader guard, not browser throughput or a completed final gate.

Frozen `219b90e` remains failure evidence: the original 120-second day-50 deadline was exceeded after 49 clean audited closed days (269.18 child CPU / 259.29 wall seconds, load 0.02→1.01). Its 5.396-second live sample confirms the flood was gone while native path planning was 97.2% and full-corridor checks 90.3% inclusive. An ignored, exactly readonly inspection of its failed partial-day snapshot found all 43 remaining yield-eligible field/order combinations unaffordable even at an optimistic direct-distance gift. That affordability diagnostic is neither a native tick pass nor a closed-day baseline; failed snapshots and source-specific evidence remain retained. The earlier frozen `61896d3` failure measured exhaustive ghost-free reachability flooding at 99.6% inclusive; the final candidate retains its ordinary/cold fallback while certified native Abbey callers avoid that flood.

Fresh maps, every daily tick, every named person and household, and existing ownership and
inheritance rules remain intact. No era presets, saved-world bank, actor culling or SQLite were added.
The app remains a single HTML file with no build step.

## Exact fast forward (current priority, 2026-10-10)

### Alternating-tick observation, 11 October

The user reports alternating apparent tick costs. This is under investigation;
there is no measured attribution or completed optimization. In the frozen
`61dd0bb` native 90-day log, days 48–90 have even-day median tick-plus-audit CPU
1.186234 seconds (22 days) and odd-day median 1.171209 (21 days). Their means
2.3365/1.8032 reflect irregular spikes rather than a strict alternating pattern.
The location of the observed timing is still being clarified. These native
audit timings do not establish a cause for the reported alternation.

Source review finds an actual day-parity guard in `tickCallToArms`, a Crown
panel refresh every second 500 ms HUD update, and worker view-inflight/ack plus
view-before-clock delivery that can affect apparent cadence. These are possible
places to measure, not attributed causes. Browser `PERF` times foreground
`advanceSimulation`; when `BACKGROUND` is active that call is skipped and
`ticks` is zero, so its simulation reading is not worker tick CPU. A matched
browser/worker trace is still needed to distinguish authoritative day work from
presentation and delivery latency. The current native 150-day history/save
gate now passes; it does not attribute the reported alternating timing.

The operative rural-access candidate `73237fe` matches native full graphs/RNG/raw outcomes through day49, then tick50 exceeds its unchanged120-second deadline. This is a failed gate, not a throughput result. The sole diagnostic resumes the valid same-source day37 checkpoint, applies the actual day38 tax command, audits through49 and profiles the unchanged failing tick. It again reaches the deadline:124.47 process CPU seconds for the sampled partial tick; the whole diagnostic uses146.82 child CPU/139.52 wall seconds, load0.10→0.92. No partial diagnostic world becomes a comparison baseline.

The120.34-second V8 sample attributes99.08% to closing abbey foundation eligibility,52.66% to approach clearance and47.92% to polygon intersection, chiefly every route segment against every pending component/corridor. Route solving accounts for20.68% and public-strip subtraction8.41%. These figures diagnose one failed tick, not a shipping speedup or centuries-per-minute claim.

The operative `cd82178` repair retains ordered pending-project, standing-building, graveyard and public-strip geometry within one synchronous proposal. Conservative bounds skip only distant exact predicates; replaced predicate functions select the original unfactored path. Clearance precedes unused corridor subtraction/raster/pricing. Pure physical building/hydraulic grant and power checks precede remote routing, then repeat on the final retained site. This is an intentional planner query-order update, with fresh source-specific history/save gates running. Rejected geometry can skip initialization of the rebuildable static `LANDV` rate table; it is not a world/save/RNG root. All41 focused industry tests pass, including exact nearby/boundary comparisons and more than ten times fewer distance calls with120 distant pending projects. That fixture result is not native-world or browser throughput. Route order, actual tenant rights, exact nearby intersections and the original120-second native deadline remain authoritative.

That candidate's fresh native gate also matches through49 and times out on tick50:566.01 child CPU/528.30 wall seconds, load0→1.02. Both geometry certificates remain valid on actual same-source day37 and49 cold-load continuation. A second bounded profile at the unchanged deadline uses124.64 process CPU seconds for the partial tick; the entire diagnostic uses146.57 child CPU/139.31 wall seconds, load0.34→0.94. Its120.34-second sample attributes61.13% to `armyLandPath`,60.70% to its detour searches and21.14% to reachability floods. The prior polygon-intersection cost is no longer leading. Service walkers supply a bare edge Map, so `armyLandPath` skips creation of its cell-scope/circuit caches; each Abbey pose also recreates ghost-free terrain edge tests. A narrow operation-local consolidation is under repair. This remains failure evidence, not a speedup or operability result. The eleven-file serial affected/source batch passes147/147 (11.80 child CPU/9.52 wall seconds, load0.02→0.49), including the generic site-guard regressions, with unchanged deadlines.

The frozen c2059ac native exactness gate passes150 days at all seven speeds, full authoritative graph/every RNG and906 accepted raw rows, with actual day38/day91 commands. Native day37 load/resave and113-day continuation reproduce678 rows exactly. Audited step CPU is1212.71 s for the controlled original selectors versus366.45 s optimized; complete comparison/replay costs2992.80 child CPU/2853.52 wall seconds, load0.57→1.05. Both contain the same intentional model changes and cache maintenance. This includes inventory/audit/serialization and does not measure browser persistence or centuries-per-minute throughput. The subsequent Abbey gate stops by coordinator decision after audited day626 because of proven rural-access/recruitment gaps, rather than waiting on an impossible short-street recipe. Native petition snapshot failure is also recorded (#69–71).

The 11 October institution batch is assembled and being gated. Its frozen
`d36bf93` correctness suite finished 196 files with 1,916 passes and two fixture
failures: 2,683.46 aggregate child CPU seconds, 1,704.25 wall seconds, load
0.004→1.00. Those are test-runner costs, not game throughput. The reviewed
fixture repairs, operative own-use abbey processing and the remaining daily
institution eligibility decisions form the coupled `2d81f11` batch. The assembled suite records 2,840.95 aggregate child CPU seconds, 1,788.89
wall seconds and load 0.00→1.00. All 1,965 unique checks for the frozen `2d81f11` production source are verified
across that batch and the reviewed three-file rerun (1.37 CPU seconds, load
0.20→0.20). These are test costs, not daily simulation throughput; subsequent source corrections await their own integrated gate.
The final native 150-day comparison preserves full world/globals/layouts/closure code, every RNG stream and all 906 accepted raw rows at all seven speeds. A day-37 native save/resave/replay also matches through day 150. Its controlled reference uses original full native craft/ground/mint/lodging selectors and disables castle survey/work reuse, with all intended model changes and candidate-cache maintenance common to both sides. Audited step CPU is 623.96 versus 230.08 seconds over 150 days; the complete comparison/replay runner costs 2,127.22 CPU / 1,989.30 wall seconds, load 0.10→1.34. These costs include inventory audits and serialization, omit browser persistence, and do not establish game throughput.

Earlier exact-reuse diagnostics and failures are retained in the
[historical validation record](https://github.com/healdgar/furlong-kingdom-annals/blob/a23ecc032754a303c70f84a4d4e90ea8cbba0101/docs/HANDOFF.md); they are not a final 150-day or shipping speed result.

The current institution integration uses daily housing, road, castle and
institution decisions with actual paid component projects. The assembled daily
contract has 59 phases and 200 checked prerequisites. It retains dated market,
court, harvest, lease and study obligations. Remaining native institution/worker/conservation validation and
measurement are pending; the century-per-minute target is not established.

An obsolete integration suite was interrupted after 2,010 wall seconds and
3,512 aggregate child CPU seconds (load 0.00→1.07). Its remaining native street
fixture repeatedly surveyed first-castle geometry. Two owned five-second live
profiles identified native deterministic hypot and point-to-box checks as the
largest costs. The exact axis rejection retains the original corner predicate;
operation-local polygon reuse and a certified failed-survey memory retain actual
geometry authority. These are diagnostic samples, not a measured throughput
claim. The same suite also exposed private mill counters entering display
packets; that projection defect is repaired without changing simulation work.
The combined source passes the current suite and native exactness gate; actual paid institution, multi-era conservation, worker and drawing gates remain pending.

The earlier growth/property batch below kept daily occupancy and live valuation
inputs while retaining the then unfinished six-day housing/fabric throttle.
Operation-local native fields consolidated roof selection, lot ranking, buyer
rent averages and landlord tests; widening, refits and construction boundaries
still obtained fresh fields. Its dependencies and original regression are
recorded in [SIMULATION-GROWTH-INPUTS.md](SIMULATION-GROWTH-INPUTS.md).

One serial unprofiled raw-journal diagnostic on 1001:42 sea (AD 850, ticks
41–360, same host) measures:

| Source | CPU ms/day | Window load | Whole runner CPU / wall seconds |
|---|---:|---|---|
| Published `c479429` | 96.89 | 0.7→1.1 | 40.82 / 32.74 |
| Live property/layout candidate before consolidation | 132.17 | 1.4→1.3 | 56.77 / 45.49 |
| Operation-local consolidation | 103.56 | 0.2→0.8 | 43.67 / 34.62 |

The last two sources have the same year-end census: 2,497 people, 1,060
households, 667 buildings and twelve settlements. Consolidation reduces tenure
wall cost 10.737→0.299 ms/day and growth 9.538→5.062 in this diagnostic.
This single sequence is not a calibrated speedup claim against the published
model: live values, reachable annual growth assessments and generated layouts
deliberately change history. Compression/IndexedDB and late-world scaling are
excluded. The remaining early-world gap to 100 years/minute is about 62× before
durable writes. Final identity/conservation gates and source hashes are recorded
in the [historical validation record](https://github.com/healdgar/furlong-kingdom-annals/blob/a23ecc032754a303c70f84a4d4e90ea8cbba0101/docs/HANDOFF.md); evidence is in `tools/soak-results/live-growth-20261010/`.

The user’s target is hundreds of simulated years per real minute, with exactly the
same history at every speed for the same seed and commands on the same simulation
days. Source-file splitting offers no demonstrated speed
advantage here; keep the sectioned file and the authoritative simulation worker.

Reel already runs daily transactions continuously through the worker’s unpaced
pump. Its nominal `SPEEDS[5]` value of 360 is not a throughput ceiling. Display
acknowledgements limit landscape publication, while simulation can continue.
Raising the speed number or removing frames cannot eliminate daily model cost.

With 360-day years, the complete simulation and persistence budget is:

| Years per minute | Simulated days per second | Milliseconds per day |
|---|---:|---:|
| 100 | 600 | 1.667 |
| 200 | 1,200 | 0.833 |
| 300 | 1,800 | 0.556 |

Recent audited year-three profiles on this host put core `simTick` at 83.076 ms/day
for 42:42 sea and 66.532 for 1001:1001 sea, at loads 0.06→0.96 and 0.96→1.26.
They include profiler/audit effects; they are diagnostic profiles, not shipping
throughput measurements. Daily household feeding, economy and commodity queries
dominate. Most Proxy key enumeration in those profiles comes from the independent
inventory audit, outside simulation; optimizing it would mainly speed the test.

Two unprofiled native 1001:42 sea comparisons cover ticks 41–360 (320 measured
days each), using the worker’s raw capture/binary journal with an in-memory
acknowledgement sink. Compression and IndexedDB are excluded. Baseline/candidate
CPU is 94.73/85.49 ms/day (loads 0.3→0.6 / 0.2→0.5), then 91.51/86.64
(0.3→0.6 / 0.3→0.6): 9.8% and 5.3% less CPU. Median cost is 93.12→86.065 ms/day,
a 7.6% reduction, with identical year-end censuses. The shorter portable-journal
windows varied more; these modes and windows are not pooled into one speed claim.
The rejected missing-stock/combined candidates offer no demonstrated advantage
over the smaller retained-slot change.
These measurements precede the daily-order model changes described below.

Slots are private derived caches; each write still clears all twelve scopes, and
stock arithmetic, rank order, callbacks, writers and records remain unchanged.
Cold save/load rebuilds them; estate retirement drops the owner’s cache. Keeping
arrays increases retained cache memory per queried owner/good pair; native goods
are bounded, but late-world memory has not been measured. No memory improvement
is claimed.

This early-world measurement still exceeds the 100-years/minute budget by roughly
52× before durable browser storage. It is not a century-scale clearance or a
Safari/browser throughput claim. The Mac’s late farm snapshots remain unavailable.
Validation and artifact hashes are retained in the [historical validation record](https://github.com/healdgar/furlong-kingdom-annals/blob/a23ecc032754a303c70f84a4d4e90ea8cbba0101/docs/HANDOFF.md). Local evidence is in
`tools/soak-results/fast-forward-20261009/`.

To measure the current raw capture path without profiles:

```sh
node tools/model-run.cjs --seed 1001 --fate 42 --coast sea --journal raw --days 360 --measure 40:360 --prof 0 --phases 1 --hotlist 0 --out tools/soak-results/fast-forward-raw.json
```

`--journal portable` remains the tool’s historical default. Both sinks acknowledge
records in memory, so neither measures archive compression or IndexedDB writes.

### Daily-order refactor, 10 October 2026

The dependency record covers 42 original phases at `39d929e`, now separated into
52 source boundaries with 168 checked prerequisites. This first batch follows
the recorded serial order, makes trade/title choices and quarry output daily,
and deliberately changes histories. It is a foundation for subsequent input
reuse and daily eligibility work, not a speed optimization by itself.

One serial unprofiled 1001:42 sea comparison, ticks 41–360, uses the same raw
capture/binary journal and in-memory sink as above. Baseline/current CPU is
**94.58→99.74 ms/day**, loads **1.1→1.1 / 1.1→1.1**: 5.5% more CPU in this pair.
Phase wall time for trade is 3.983→10.573 ms/day after replacing the alternating
every-fourth-day origin visits with daily visits. This identifies a cost to
reduce; a single pair does not establish a precise regression or a speed gain.
Final population is 2,497→2,499, buildings 705→701 and cached routes 0→41.
The histories differ intentionally, so this is a cost comparison rather than
an equivalent-work optimization proof. Compression and IndexedDB are excluded.
At 99.74 ms/day the early-world CPU cost is about 60 times the 100-years/minute
budget, before durable storage.

The native 150-day fixed/changing-speed proof matches the full logical history,
RNG, commands, annals and every completed outcome event. It omits only playback
preferences and compares event contents independently of asynchronous chunk
packing. Two serial one-year worlds pass money/goods/fault checks. A browser
worker/reference comparison passes 180 days plus 180 after save/replay, with
matching tested views that leave the world/RNG unchanged. It also exposed an
existing bounded-advance bug when a petition restores speed: completion now
pauses at its target, covered separately by host tests and the final browser
gate. Exact source hashes, test results, the initial failed comparisons and
their diagnoses are recorded in the [historical validation record](https://github.com/healdgar/furlong-kingdom-annals/blob/a23ecc032754a303c70f84a4d4e90ea8cbba0101/docs/HANDOFF.md). Local evidence:
`tools/soak-results/daily-order-20261010/`. Late-world, hardware drawing, Safari
and centuries-per-minute throughput remain unverified.

### Daily kernels, 10 October 2026

The next exact batch keeps the daily order and model. Trade shares lazy, ordered
dealer/driver candidates within its synchronous pass, rereading purses and
absence for each load. A singleton commodity location avoids general withdrawal
list allocation, while reading live custody and spoilage. Multiple locations,
overridden entries and guarded trade callbacks retain their general paths.
Neither optimization freezes a household's budget or food for the day.

Two serial unprofiled CPU pairs compare frozen `8980908` against the combined
patch: 1001:42 sea, AD 850, ticks 41–360, native raw binary journal acknowledged
in memory. The second pair ran candidate before baseline.

| Pair | Baseline CPU ms/day (load) | Candidate CPU ms/day (load) |
|---|---:|---:|
| 1 | 99.43 (0.5→0.6) | 96.90 (0.6→1.1) |
| 2 | 98.04 (0.3→0.7) | 95.07 (1.0→1.0) |

Median CPU is **98.735→95.985 ms/day, 2.8% less** for this early world. Phase wall
diagnostics also fall: trade 10.147→8.596, economy 11.186→9.839 and population
31.177→30.099 ms/day. Those are whole-batch diagnostics, not separate CPU gains
assigned to each optimization. Year-end censuses match. Compression, IndexedDB,
late-world scaling and hardware/Safari throughput are outside these measurements.
The remaining CPU gap to 100 years/minute is about 58×, before durable writes.

Evidence is in `tools/soak-results/daily-kernels-20261010/`; validation and exact
source hashes are recorded in the [historical validation record](https://github.com/healdgar/furlong-kingdom-annals/blob/a23ecc032754a303c70f84a4d4e90ea8cbba0101/docs/HANDOFF.md). The 19 new focused cases compare the
current dealer/driver selectors against frozen `8980908` and singleton planning
against the unchanged general path, including live intervening mutations,
ranked custody, missed loads, RNG, spoilage, crumbs, transit and callback fallbacks.

### Daily storage decisions, 10 October 2026

Storage investment now reads current exposed custody, owners, means and prices
each day. A native profitability upper bound rejects proposals that cannot repay
even with free ground and handling. Ordered quotes are shared by type only within
one synchronous pass; an inexpensive necessary street check precedes the full
survey. The first eligible survey rebuilds both route graphs. Instrumented helper
and callback paths retain per-site evaluation. No cross-day proposal cache is
installed: its complete invalidation certificate remains unproven. Granges and
warehouses still require 90/150 funded working days, current materials and access.
The input audit and bounded design are in
[SIMULATION-CACHE-INPUTS.md](SIMULATION-CACHE-INPUTS.md).

One serial unprofiled native raw-journal pair compares frozen `8d92a4f` with the
final source on 1001:42 sea, AD 850, ticks 41–360: **92.35→92.30 CPU ms/day**,
at window loads 1.1→1.1 and 1.0→1.2. This establishes no speed gain. The histories
deliberately differ (701→699 buildings, 1081→1069 households at day 360), so it
is a cost comparison of the model conversion, not an equal-work kernel proof.
Storage-investment phase wall time grows 0.410→3.724 ms/day with daily visits.
A preliminary conversion without the street precheck cost 106.20 CPU ms/day;
that diagnostic motivated the bounded precheck and is not a final paired result.
Compression/IndexedDB, mature worlds and hardware/Safari throughput are excluded.
The remaining early-world CPU gap to 100 years/minute is about 55× before writes.

Native 150-day steady/changing-speed runs match the full logical graph at days
0/37/90/150, every daily RNG/command/annal digest and all 1,812 accepted storage
outcomes. The 23 new focused cases cover live economics/ownership, interleaved
fallbacks, graph edits, paid-day construction and the necessary street filter.
Local evidence: `tools/soak-results/daily-storage-20261010/`; full validation and
source hashes are retained in the [historical validation record](https://github.com/healdgar/furlong-kingdom-annals/blob/a23ecc032754a303c70f84a4d4e90ea8cbba0101/docs/HANDOFF.md).

The subsequent growth/input batch, summarized above, follows
[SIMULATION-GROWTH-INPUTS.md](SIMULATION-GROWTH-INPUTS.md). It removes the six-day
outer guard that made annual widening and vacancy/refit/maintenance visits
unreachable except at settlement indexes divisible by six. Occupancy and due
falls now run daily; reusable property geometry is certified while current
population/security stay live. Housing/fabric still retain their six-day rate
throttle until economic eligibility and paid physical progress are separated.

### Work in order

The user has since authorized changes to the model/history while retaining exact
history across speeds. The recorded dependency survey and new daily source order
are in [SIMULATION-ORDER.md](SIMULATION-ORDER.md), with a machine-checked contract
in `SIMULATION-ORDER.json`. Calendar intervals need simulation reasons; arbitrary
CPU decision throttles are to be replaced by daily eligibility and input-revision
checks. The first refactor separates arrivals, production, protection/loss,
construction, departures and financial close. It deliberately changes histories;
its throughput is to be remeasured, not inferred from the ordering.

1. **Refactor from the recorded daily dependencies, then make each day cheaper.**
   Keep the canonical writers and new serial schedule identical across speeds.
   Separate mixed decision/rate/contract functions before changing their cadence.
   Make daily trade eligibility cheap using current driver/merchant means and
   stock/price/inbound/route changes; preserve live balances at execution.
   Validated exact optimizations retain commodity quantity-cache slots across
   writes, singleton withdrawal planning and trade-pass actor candidates;
   privately ranked live-cell handles remain a candidate. Daily storage uses
   bounded within-pass reuse as recorded in
   [SIMULATION-CACHE-INPUTS.md](SIMULATION-CACHE-INPUTS.md). The implemented occupancy/geography certificate and remaining paid growth/rate
   split are recorded in
   [SIMULATION-GROWTH-INPUTS.md](SIMULATION-GROWTH-INPUTS.md). Keep current
   population/security inputs live. Reads must see each intervening
   purchase and consumption; a whole-day food snapshot becomes stale.

2. **Bound cost by the living world.** Profile later eras and distinguish active
   actors/stock from expired routes, empty accounts and historical records. Use
   derived active/due indexes only where all invalidation paths and canonical visit
   order can be proved. Keep every named actor and household in the model.
3. **Budget presentation by real time during Reel.** Measure the daily clock
   messages, thirty-day landscape packets and annual autosave barriers. The
   nominal target cadences imply 600–1,800 daily clock messages, 20–60 landscape
   publications and 1.67–5 annual saves per second; acknowledgements and autosave
   coalescing reduce actual delivery, while urgent updates add exceptions.
   Coalesce display publication while preserving
   pending events, geometry dirtiness, wire order and urgent pause/endgame updates.
   Display cadence must not determine simulation outcomes.
4. **Separate exact history from eager audit materialization.** Current three-year
   archives record roughly 201–235 kB binary and 55–63 kB compressed per day.
   Extrapolating this early-world rate to 100 years/minute requires 121–141 MB/s of
   binary processing and 33–38 MB/s of durable compressed writes. Measure journal
   worker CPU and IndexedDB waits separately. Lossless encoding can change without
   dropping canonical events. A later reconstructable archive could retain exact
   engine identity, seed, ordered commands/settles and day-boundary checkpoints,
   then regenerate an older requested economic segment in an isolated replay
   worker. That changes the current always-on audit-retention contract and needs
   an explicit design and continuation/export proof; checkpoints alone do not
   accelerate future days. Preserve annals, biographies and genealogy.
5. **Prove each gain.** Freeze a baseline; compare every world node, closure,
   recorder, RNG stream, command, annal and storage outcome over at least 150 days.
   Include cold-cache save/load, worker/reference/replay and money/goods checks.
   Measure repeated CPU windows with load recorded and validate late-world scaling
   before claiming the target is met.

### Why an arbitrary calendar jump cannot preserve this model

Institutions, folk, land and livestock already run on monthly, quarterly or annual
schedules. Their dispatch can be cheaper, but skipping their guard calls does not
remove the daily critical path. Food output, purchases, consumption, births/deaths,
prosperity, unrest, SIR epidemics, travelling loads and military actions affect the
following day. Politics and threats consume shared RNG streams in daily order.
Multiplying a rate by a month, using a closed-form population update or sampling a
next-event date would change rounding, thresholds, transaction order or RNG draws.
An event skip is admissible only where its entire interval is proved equivalent to
executing the original days. Approximate fast-forward is outside the user’s request.

## Earlier exact optimizations (historical notes)

This batch removes repeated work without additional simulation indexes or events:

- Daily feeding prepares ownership and food reconciliation once; independent
  food top-up calls still prepare their own inputs.
- Monthly wage payments retain only the first five sorted poor candidates,
  enough for four recipients after excluding the payer. Payment order and ties
  remain unchanged.
- A household's migration roots are evaluated once for its destination search,
  rather than scanning its fields for each destination.
- Hidden Crown and realm panels skip their periodic reconstruction. Opening a
  panel refreshes its data immediately. Crown reference linking otherwise
  searches living and historical people even when the drawer is hidden.

All 916 source tests pass. Focused tests cover household food, hunger, debt and money equivalence, wage
recipient ordering, migration-root values and panel visibility. They establish
removed work, not a measured whole-game speedup or century-scale clearance.

Architecture planned at that time (worker separation is now implemented):

1. Eliminate remaining household-by-population and owner-history scans using
   authoritative household membership and existing active balance membership.
   Preserve ordering where it affects RNG, inheritance or money.
2. Separate display projection from daily state changes. `animateWorld` currently
   mutates traffic, envoy and actor state; throttling it wholesale is unsafe.
   Keep authoritative changes in simulation, then refresh visible geometry and
   animation at a bounded cadence during reeling.
3. Move the serial daily engine behind the existing worker boundary, with one
   authoritative world, ordered player commands and bounded display deltas.
   A worker improves responsiveness; it does not make the same CPU work cheaper.
4. Measure matched drawn and undrawn runs on the resulting source, including
   later-year cost growth and persistence backpressure. Faster short fixtures
   cannot establish practical fast-forward throughput.

Daily pantry, hunger and debt settlement remains required. Monthly and annual
decisions should run only when due; no coarser approximation is enabled here.

## Failed army retreat retries, 5 October 2026

A 32.9-second main-thread profile of the running `48c2b35` release, seed
287970763 / fate 370450810, found `tickMilitary` at 62.9% inclusive CPU and
`armyDetour` at 62.4%. Two hungry armies repeatedly tried an impassable retreat.
These nested percentages overlap. Journal-worker CPU was outside this profile.

Failed automatic retreats now reuse `holdUntil` to retry after 30 days, retaining
any longer hold. Explicit orders remain immediate. Failed moves preserve the
field position and do not announce successful foraging. Roads and paid sea
crossings remain available from a field position; the army joins the nearest
origin-side land segment through a physically checked connector. If the road
route fails or is absent, passable cross-country travel remains possible at
`FIELD_MPD`. Both routes retain river, building, wall and slope checks. No new
maintained index or event was added. Automatic retries see changed obstacles
on the next retry; a new explicit order can retry immediately.

Nine focused regression tests cover cooldown, longer holds, queued orders,
changed passability, field position, terrain fallback and charged sea crossings.
A matched synthetic Node/V8 kernel fixture over 60 days reduced failed orders
from 60 to 2, detour calls from 180 to 12 and segment checks from 1,500 to 100.
It uses the actual terrain-search kernel with a synthetic impassable cliff;
these are fixture results, not whole-game timing or long-run clearance.

The final game source (SHA256
`b666e678300c24f59a68830a7450d08b1d269811ae0359fa0a6d08cc3c4c6c77`)
also passed a three-year native Chrome run with the same map/fate seeds:
2,160 independent inventory checks, zero simulation errors, zero annual money
residuals, and complete journal settlement. This does not reproduce the live
year-five army state or establish later-year throughput. All 39 focused army,
campaign, routing and old-search guard tests pass.

## Remembered army routes, 6 October 2026

On seed 2002 (land), days 1000–1200, `tickMilitary` took 45–58% of the daily tick before this change. A host
whose campaign route is impassable asks for it again every day: the 30-day `holdUntil` guards only the hungry
fall-back, not the campaign objective or a queued `nextOrder`. Each failed `armyLandPath` searched up to three
detour boxes of up to 30,000 lattice points.

`armyLandPath` now remembers, for each host, every answer whose search needed a detour box
(`armyRouteRecall`). With the answer it keeps an exact copy of everything that search could read
(`armyRouteRead`): the host's fording depth, road-only crossing and raft (with whether it is ready that day);
the terrain and domain cells under each span it tested and each box it searched, with two cells (at least
54 m) to spare; the river lines and road bounds and lines there; and, for every place whose domain those cells
lie in, its lake, buildings, walls (with breaches, building progress and kinds), gates, motte and ring ditch,
and whether its gates stand open to this host. The answer is given again only while that copy equals the
world value for value. Any difference searches afresh, so a bridge built, a breach, a peace or a finished raft
is seen the same day. A search stores the bounds of the roads it looks at (`onRoad`, up to `onRoad.reach`);
a recall stores them on the same roads. Walkers (`a.settlement` or a shared `_em`) are not remembered.

The memory is derived state in the module (`ARMY_ROUTES`, a WeakMap keyed by host), outside `W`. It is never
saved, sent to the screen or captured by the history graph, and an empty memory (a loaded game) finds the
same answers. `ARMY_ROUTES.verify` searches afresh at every recall and throws if the path, the search, what
it read or the roads' bounds differ. `tools/army-route-memory.test.mjs` runs the game's own search and memory
against fresh searches, through random changes and through one targeted change of each kind the search reads.
It also pins the source of every function the copy mirrors, so changing one of them fails until
`armyRouteRead` is reviewed. Deliberately weakened copies (one input left out at a time) fail that file,
except a narrower margin, which only the long verify runs exercise.

Evidence (model-only runner, instructions retired per simulated day over days 1000–1200; one-minute load
beside each, mostly from work outside Furlong):

| World | Memory off | Memory on | `tickMilitary` CPU ms/day |
|---|---|---|---|
| seed 2002, land | 1,087 M (load 54–63) | 574 M (load 20–24), −47% | 26.1 → 1.1 |
| seed 287970763 / fate 370450810, sea | 1,915 M (load 8–9) | 901 M (load 58–101), −53% | 65.9 → 14.4 |

The world graph, world-only graph, RNG streams and the full capture are equal with the memory off, on and in
verify mode at days 1000, 1100 and 1200 on both worlds. They also equal main at days 360 and 720 (seeds 1001
sea and 2002 land) and over the 150-day proof. The verify runs made 332 and 837 recalls without a difference.
The largest copy held 18,937 values. On seed 287970763 after day 1000, 19 of 411 fresh searches needed a
detour box (6.5 ms a day); 4 remembered answers were searched afresh because roads were added, and stayed
blocked.

Buildings are weighed by the points the search tested (6 October 2026). A growing town inside a search box
changed the copy every few days, and its hosts searched afresh for the same answer. The copy now keeps a place's
buildings apart (`ROUTE_BLD`), and each detour box notes the nodes it expanded. A building raised, taken down, moved
or turned in the copied cells spoils the copy only if its footprint (armyObstacle's rectangle and 0.6 m) could cover
a tested point: on a straight stretch, or within 3√2 m of an expanded node. Otherwise every test the search made
comes out as before. On seed 1001 sea at km 15, days 31–150 (8 hosts, model only, instructions by
`proc_pid_rusage`, load 5–11): 20 of 46 such re-searches are spared (boxed-key hits 90% → 95%); `tickMilitary`
663 → 512 M instructions a day, the whole day 1,895 → 1,752 M. The other 26 are new buildings on ground the search
tested; an exact edge-by-edge test of the probe points spares none of them either. In the batch gate, verify mode found no
difference over 1,486 recalls (287970763 to day 1200) and 486 (km 15 to day 150), every digest equal to main's;
287970763 days 1000–1200 went from 664 to 549 M instructions a day.

## Algorithms

- Settlement population totals are computed lazily from the household ledger. Ledger set/delete/clear
  and household recomposition invalidate the total. Summation retains the original household order;
  incremental arithmetic would introduce different rounding.
- The person index and household census are reused until membership changes. Birth, death, household
  registration, parish removal, migration and military return invalidate the index. The census retains
  the existing same-day invalidation rules.
- Caravan quotes compute distance and freight once per town pair, and destination price once per good.
- Routing computes one shortest-path tree per origin and road revision, rather than searching again
  for every destination. Queue order, strict comparison on ties, road condition, paving, crossings,
  polylines and travel times follow the previous search. Unreachable pairs are cached until revision.

## Worker boundary

One background worker precomputes route trees from immutable numeric road graphs. Its code is made
from the same `routingTree` function used for synchronous misses; there is no second routing engine.
Results use transferable numeric buffers. The main thread accepts results only for the current
route-cache identity and revision. One graph is in flight and at most the latest replacement is queued.
Construction, posting or execution failures fall back to the synchronous kernel.

`&worker=off` disables the routing worker for comparison. The setting is captured before boot
normalizes the world link. Worker activity/failures are available in `ROUTING.stats`.

This boundary separates routing computation. **The main thread still owns the simulation, RNG,
rendering and input.** Moving the entire simulation into a worker remains further work: town-planner
closures, account projections, Three.js mutations, petitions and commands need explicit boundaries
and a bounded view-update protocol. A routing worker alone does not remove every long simulation tick.

Era startup now yields by elapsed time, roughly every 40 ms, rather than blocking for three simulated
years. It still advances every day. A single expensive tick can exceed that budget.

## Verification

```sh
node --test tools/source.test.mjs tools/provision.test.mjs tools/ownership.test.mjs \
  tools/advisor-api.test.mjs tools/routing.test.mjs
node tools/performance-check.mjs --baseline 8c35b973 --seeds 1001:sea,2002:land \
  --years 20 --variants baseline,candidate,off --out /tmp/furlong-performance
node tools/render-check.mjs --baseline 8c35b973 --seeds 1001:sea,2002:land \
  --days 720 --out /tmp/furlong-render
node tools/ownership-replay.mjs /tmp/furlong-replay
node tools/performance-check.mjs --baseline 8c35b973 --seeds 1001:sea \
  --era 860 --years 0 --boot-timeout 600 --out /tmp/furlong-era
```

The performance comparison runs worlds serially in native Chrome with the hardware GPU. Each source
is snapshotted and hashed. Annual graph fingerprints retain numeric precision, reference identity,
Map/Set/array order, household accounts, goods, genealogy, terrain, land, annals and modifiers; derived
caches and graphics objects are excluded. Subsequent draws from all three RNG streams are compared.
The worker-disabled run must prove it stayed disabled. DOM/UI intervals and rendering are suppressed
equally; deferred monthly land work and annual autosaves are flushed.

Reported daily CPU time excludes fingerprinting and the first warm-up year. It is an undrawn history
measurement, separate from frame rate and actual later-era boot time. Use `tools/soak.mjs` for food,
money, long histories and drawn scenarios; its [limits](SOAK.md) still apply. The existing whole-realm
money-audit failures must remain failures even when a candidate exactly matches baseline.

`--era` additionally compares actual boot from a freshly generated map through every prehistory day.
With `--years 0`, it checks the completed boot state and subsequent RNG draws without claiming daily
timings. Increase `--boot-timeout` for expensive eras. Controlled comparisons suppress the periodic
house-panel refresh; live UI timing and very long histories require separate validation.

An inventory index based on proxies was measured and removed: proxy access and iterator overhead
made it slower. Any further optimization must demonstrate both behavior equality and measured benefit.

Capturing market offers was also rejected. A twenty-year comparison first diverged on day 6,067:
two inventories can project the same household head, and settling an earlier offer changes a later
quantity. Market availability and settlement retain their live scans. A regression test freezes the
baseline behavior; correcting the underlying inventory alias requires separate ownership validation.

## Storage lot index migration, 4 October 2026

The remaining filtered full-lot scans now use the existing good, owner, location and availability
indexes. Multi-field queries inspect the smallest bucket. Purchases, physical outflow, spoilage,
inheritance, cargo dispatch, exposed hauling, investment aggregation, building reports and destruction
retain canonical lot insertion order, including after index reinsertion and intertown arrivals.
An external WeakMap tracks that order without adding fields to authoritative state or saves.
Only its first nonempty query walks all lot keys to initialize the order; subsequent mutations maintain it.
Existing indexed operations retain their original index order and accounting rules.

`node --test tools/*.test.mjs` passes 274 tests. Seven new regressions compare the former scans,
exact events, rounding, index order, incoming cargo and bounded index reads. Native Chrome/Metal
comparisons against `405fed3` match full state, subsequent RNG draws and every storage journal chunk
through days 30, 60 and 90 in sea seed 1001 and inland seed 2002, including commissioned storage.
Daily simulation CPU totals improve only 0.5% and 0.8% respectively in this short sample; this is
within timing variation and does not establish a material end-to-end speedup.

The baseline one-year sea profile attributes 67.3% of tick time to economy, 17.8% to population
and 12.6% to markets. Repeated accessible street-node searches and terrain checks remain costly.
The always-on storage journal records 5,026,615 outcomes in that year: 3,019,556,825 encoded bytes
and 174,044,598 compressed bytes. Record projection and serialization remain substantial CPU costs.
The exhaustive whole-world history recorder is opt-in and was disabled for these measurements.
The indexed source also passes the same one-year sea soak with zero simulation errors, zero
money residual and a fully committed journal. Its 264.79 ms/day versus baseline 262.87 ms/day
(including profiling, persistence and deferred work) confirms no material overall improvement.
Validated game source SHA256: `3126749421fa06a34dc368d2dcd91c541888898a390d6207cd1aa9e87d3277df`.
Local evidence is retained under ignored `tools/soak-results/index-migration-2026-10-04/`.

## Repeated storage routes and journal projection

Storage surveys and daily carriage now share accessible endpoint and street-path searches within
one synchronous calculation. Nested site quotes reuse the investment survey's cache. Each endpoint
and path cache admits at most 4,096 entries, then computes misses normally. A graph replacement clears
both caches; all cache state is released on return or exception. Subsequent calculations recheck current
terrain, water, walls, quarantine and sieges. Distances retain the original summation order and ties.

Journal projections copy ordinary own data fields using direct assignment, retaining the explicit
definition needed for `__proto__`. Descriptor inspection still rejects accessors and executable or
non-plain metadata. Undefined presence, special numbers, bigint, array holes, property order and every
transient outcome remain intact. Journal encoding and exported archive format remain unchanged.
Serializer alternatives that slowed representative encoding were discarded.

The local comparison harness now accepts `--baseline-source` to compare an exact uncommitted local
snapshot and measures route access, routing and record projection as well as daily CPU. Full-state,
RNG and journal-byte equality remain mandatory.

All 280 tests pass. Final-source native Chrome/Metal sea seed 1001 and inland seed 2002 match
the preceding indexed source at days 30, 60 and 90: full state, subsequent RNG draws and every
journal chunk are identical. Synchronous tick execution totals fall 13,634.8→6,933.2 ms (sea, 49%) and
14,451.3→8,336.8 ms (inland, 42%). Route execution time falls 90% and 85%; record projection falls 47%
in both. Tagged JSON encoding itself and journal volume are unchanged. These are serial, undrawn,
instrumented short histories on this host, not mature-world, startup or frame-rate guarantees.
Final game source SHA256: `9400f2d42344162cb174dfdcb4023b3f2e314c6227c73942900fe7ff59881699`.
Exact local snapshots, harness, fingerprints and measurements remain under ignored
`tools/soak-results/routing-journal-2026-10-04/`.

The timer measures elapsed `performance.now()` time inside each synchronous `simTick()` call,
including nested work and calls rejected by journal backpressure. Both variants make 134 calls
in the coastal run and 163 in the inland run. Asynchronous persistence waits and rendering are
outside that timer; this is not an OS CPU counter or a frame-rate measurement. The measured source
above is the performance checkpoint before journal deduplication or the proposed worker refactor.

### Architectural proposal at the checkpoint

The current `simTick()` already runs daily phases synchronously on the main thread. A daily barrier
alone will not parallelize that work. A future simulation worker should own the world and RNG,
process dependent daily phases in order, settle the accounts, then publish a small immutable view
with its day/revision. UI and rendering consume completed views and submit commands for an atomic
transaction between days; they do not mutate the authoritative world. Commands must remain usable
while paused and at life pace, where a simulated day lasts 30 minutes. A command can therefore publish
a new revision on the same day. Asynchronous calculations return versioned proposals,
accepted before commit only when their inputs still match. Full-world daily copies should be avoided.
Journal projection, encoding and persistence can be batched separately with bounded backpressure;
coalescing a rendered view must never discard required historical outcomes. This worker/day-boundary
refactor is a proposal, not part of the changes above.

## Integration with the current public release, 4 October 2026

Checkpoint `1c8bb84` is integrated onto public release `f2e4b93`. Its canonical-order lot
indexes and bounded coordinate/path reuse preserve the release's capture-fault guards,
native journal worker, immutable captures, active facility/claim indexes, hay remnant
losses, pending purchase protection and arithmetic provenance. Explicit route-batch
callers retain their existing API. Recursive plain-data projection uses direct assignment
with the own-property protection for `__proto__`; record projection already had that optimization.

All 578 tests pass. A stamped-source drawn one-day coastal smoke passes shader compilation,
camera uniforms, live rebuilds and church variants without browser or simulation errors.
Serial native Chrome/Metal comparisons against `f2e4b93` pass through
90 days in sea seed 1001 and inland seed 2002. Full world/land/annal fingerprints and RNG
states match at days 0/30/60/90, every accepted expanded storage event matches, persisted
replay matches accepted records, and both journals fully commit. The optional semantic field
oracle is unsupported in these sources; complete game-history reconstruction is not claimed.
Timing and correctness use separate fresh browser sessions. End-to-end undrawn timing is
6,739.4→6,666.2 ms coastal and 8,846.6→8,909.8 ms inland: approximately +1.1% and -0.7%
throughput, respectively, within variation. The current public release already includes
other optimizations; the historical 49%/42% checkpoint result is not an additional gain
against this newer baseline. Neither sample meets the harness's separate 70% encoded-history
reduction or 2x RAF-throughput gates; neither target is claimed for this integration.

Compared simulation source SHA256: `664b831fd98a0370aee2befc8d588ba6c406d3b37f259ba113882c7884265ac4`.
Release source SHA256: `f261626ad9f07648c82ac4b64069ae0886223db766de6075b527cb3be84f1d09`; only the visible build stamp differs from the compared source.
Full snapshots, accepted/persisted fingerprints and measurements remain local under ignored
`tools/soak-results/performance-deploy-2026-10-04/`.

## Validated source, 3 October 2026

`index.html` SHA256: `0a3808bf2f1c3c4a7df7cfdba6890c59e7cf043239778eb722bb4052a01526ec`.
Baseline: main commit `8c35b973c21dcbdb73aeb8b04d6b725e227674d4`.

- All 85 focused tests pass, including ownership, inheritance, food/payment conservation and routing.
- Seeds 1001 sea and 2002 inland match baseline for twenty years: every annual full-state fingerprint
  and subsequent RNG draw, with the routing worker both enabled and disabled.
- Desktop rendering after 720 days, touch/WebGL1 at 390×844 after 90 days, and the 360-day household
  save/replay pass. Shaders, camera uniforms, geometry, draw calls and texture budgets match baseline.
- Four worlds (1001/2002 × sea/inland) complete ten-year GPU-backed soaks and sixteen drawn smoke
  scenarios without simulation errors. Finite population/money, living realms and sane walls pass.
  Whole-realm money reconciliation fails in all four, as on baseline; no tolerance was relaxed.

On this Mac's M4 Max, the isolated 1001-sea history averaged 39.22 ms/day on baseline and 29.88 ms/day
on the candidate over years 2–20: 31% more daily throughput. Worker-disabled candidate averaged
28.85 ms/day. This establishes algorithm gains; it does not establish an additional worker speedup.
Inland timings overlapped other validation and are excluded from performance claims. These are
undrawn history timings, not frame-rate or later-century guarantees. Mature simulation still runs
on the main thread. Raw snapshots, diagnostics and coordination records remain local under `.git`.

Actual fresh-map AD860 startup also matches full state and RNG draws in both worlds, with the worker
on and off. Enabled startup took 34.57→33.47 seconds (sea) and 47.75→45.88 seconds (inland): only
3–4% less waiting. The longest 20-ms startup heartbeat interval fell from 12.42→0.79 seconds and
18.59→0.85 seconds; p95 intervals fell from about 84 ms to 58–63 ms. This improves responsiveness,
but does not make later-era starts immediate. Very long eras and full simulation-worker migration
remain unvalidated and unfinished respectively.

### Zero-demand owned consumption

`consumeOwned` retains pantry resolution, physical ordered-sum reads, title
synchronization, claim assignment and title-matching bookkeeping when effective
demand is exactly zero. It omits only the owner-lot iteration and its no-op
removal. The explicit journal assertion retains fail-closed behavior. NaN still
uses the original iteration; tiny positive demands never enter this shortcut.
The resolved owner is reused within a nonzero synchronous removal loop after
pantry and title synchronization. No physical sum or arithmetic order changes.

`tools/consume-owned.test.mjs` compares the complete relevant event, lot, claim,
household, index, counter and RNG projections against frozen `405fed3`, including
zero/negative-zero/NaN/tiny demand, char-to-timber mapping, live household
formation and household splitting. Local microbenchmarks demonstrate scan cost;
whole-game gains require separate native measurements.
