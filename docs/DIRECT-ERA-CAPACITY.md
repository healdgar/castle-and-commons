# Direct-era opening capacity: dependency record

## Status and evidence

The integrated phase completes direct-era residential fabric against native household demand, corrects burgher frontage clearance and refreshes native layout extents before land generation. Eight fresh native openings pass chronology, physical-capacity reporting and completion repeatability. Native history, all-speed determinism, checkpoint continuation, worker/reference and one-year conservation gates pass with the scope recorded below. Issue 61 remains open: some places still have less physical capacity than their native households need. This is a day-zero capacity discrepancy, not evidence that the selected year has an incorrect population.

Two reported audits found:

| Requested start | Seed / coast | Headed households | `capOf` places | Difference |
| --- | --- | ---: | ---: | ---: |
| AD 1066 | 1001 / sea | 2,628 | 2,412 | 216 |
| AD 1250 | 42 / sea | 2,676 | 1,169 | 1,507 |

These runs used different seeds, so their population, layout, and capacity differences cannot be attributed to era. Compare eras with matched seed and coast before drawing an era-effect conclusion. These figures are observations, not target densities or calibration thresholds.

## What currently determines the opening

`generateWorld()` in `index.html` (~1423; settlement draws ~1617) selects each place's raw `pop` and its starting stores. A direct-era world uses `PS=1`; the AD 850 founding uses `PS=0.35`. Direct-era population is therefore the existing per-place native draw, with no simulated centuries or elapsed-year multiplier. Stores such as grain (`pop * 0.5`) and coastal fish (`pop * 0.3`) are seeded against that same opening population.

`generateWorld()` lays out every settlement before `makeHousesAndCast()` (~1660 and ~5237). `layoutSettlement()` (~2336) calculates a *building-attempt target* from population (`round(pop/4)` for a capital; `round(pop/4.2)` otherwise, with caps). This target is not a residential-household capacity target: the layout also adds non-residential buildings, and not every intended lot succeeds. `fill()` only tries available street-frontage candidates; `buildLot()` can reject a lot for footprint fit or clear road access. Layout history can also clear houses for a citadel. Thus the target count does not imply a fixed number of surviving homes.

For direct-era starts, `initializeSimulation()` now derives resource bases and river links through `simInit(false)`, then calls `seedFolk()` before counting heads and completing physical homes. AD 850 retains its original land-first initialization branch. `seedFolk()` loops until the number of people reaches `round(s.pop)`, adding complete families; the final whole family can make the actor count exceed the nominal person target. The weighted canonical settlement population still starts at the raw draw; actor count and household slots are distinct quantities. `seedHousehold()` supplies each family and seeds the head's starting purse from the existing needs/trade mechanism. That purse is part of the opening state, not a simulated payment or income history.

`capOf(b)` (~3739) is the authoritative residential capacity in households: storeys times frontage bays. `houseFolk()` (~4946) assigns household heads against that capacity. If every home is full, its final fallback still lodges households in already-full homes. This keeps people present but does not make the fabric sufficient. Use headed-household count and `sum(capOf(sound, non-removed residential buildings))` to report the gap; do not substitute `housing(s)` (~14433), which uses a separate five-person-per-roof estimate for another UI purpose.

The land pass `genLand()` (~11122) derives ploughland demand from the same `s.pop` and `landWt(s)`, then sets `W.land.perHead` from available reachable arable land and tills a corresponding amount. It adapts land allocation to the opening population; it is not an independent population ceiling. Food yield and land carrying-capacity calibration belong to #12/#23 and should stay separate from this housing issue.

The current starting stores, biome resource bases, housing, people, and land are distinct inputs. `makeHousesAndCast()` seeds implemented dynastic houses and the crown. Do not infer or fabricate abbeys, guilds, offices, technology adoption, rents, construction payments, or other institutions from the date. A church/friary building is not by itself a generated abbey institution. No post-start cash, stock, or transaction should be added to disguise an opening shortage.

## Implemented opening order

Preserve each direct-era site's raw population draw and make the *opening fabric* meet the exact household capacity it needs. Keep AD 850 on its existing path and unchanged. Do not multiply population by elapsed time, use a souls-per-slot conversion, shrink the native population to fit the current layout, or silently overbook capacity.

The direct-era-only ordering is:

1. Generate settlements, their native raw `pop`, stores, resource classifications, and ordinary layout as today.
2. Initialize resource bases and seed the actual native population and households through the existing mechanisms. Count household heads with the same `householdHead()` semantics used by `houseFolk()`; do not estimate household count from persons.
3. Compare that exact count with the summed `capOf()` of sound, non-removed residential buildings. If short, use the settlement's existing layout context/closures (`_lay`, including legal frontage/fit/access checks) to complete additional residential fabric. These buildings are part of the opening world; they do not imply an unrecorded chain of pre-start payments or simulated events.
4. Stop with an explicit unsatisfied-capacity result if legal lots, roads, water, terrain, or settlement extent prevent completion. Never make `houseFolk()`'s overflow lodging count as success.
5. Refresh native layout extents, then run the existing land, tree, track and gate passes. Ordinary household placement occurs on the first native daily tick. Report land/food support separately; do not add fields or stocks as a housing fix.

Refresh the native layout's building-distance quantiles after completion and
before the land pass: `.92` supplies `extentR`, `radius=extentR+30`, and (only
without an actual wall circuit) `wallR=extentR+20`; `.45` supplies town paving.
Preserve `coreR`, the separate founding-road ingress boundary, and standing
wall geometry. An outermost house beyond a percentile does not prove a defect;
compare the actual pre/post quantiles.

The implementation must respect deterministic layout RNG and be idempotent across foreground/worker generation and save/load. A capacity completion must use real placed residential buildings and the existing capacity function, not an abstract slot count. If additional extent is needed, use the supported settlement growth path and legal geometry. Avoid inventing an arbitrary outer radius or retry count as a hidden population rule; expose a concrete failure when legal geometry is exhausted.

## Focused acceptance checks

For matched seed/coast pairs at AD 1066, 1250, and 1350, and a regression pair at AD 850:

- Record requested start year, actual `W.startAD`, day zero, and that no pre-start `simTick` or chronicle entries were produced.
- Record seed/coast and native `s.pop`, actual people, headed households, surviving residential buildings, and summed `capOf` by settlement and for the realm.
- For direct-era starts, assert each household head has a distinct available capacity slot at opening, or assert a surfaced legal-capacity failure; no hidden full-house lodging.
- Confirm added homes pass existing frontage, footprint, road-access, and water/terrain checks and are residential under the existing architecture rules.
- Confirm opening purses/stores still come from existing initialization, with no invented payments, income, institutions, or transactions.
- Confirm AD 850's layout, population, capacity, and chronology remain byte-for-byte/seed-for-seed unchanged by the direct-era branch.
- Keep arable acreage, yield, and food sufficiency observations as diagnostics for #12/#23, not as a rule that changes population or housing.

## Private preflight and next correction (2026-10-11)

This is evidence for the private capacity predecessor, not the published browser
build. Eight serial native openings (1001 and 42, fate 42/sea, at 1066, 1250,
1350 and 850) pass day-zero chronology and exact physical capacity reporting.
All six direct openings are idempotent for buildings, streets, slots and RNG;
the first native housing assignment uses no overflow in complete settlements.
AD 850 runs no completion pass. No runtime-equivalence, speed, worker or save
proof has yet been run for this candidate.

| Start | Seed | Heads | Total capacity | Sum of local shortfalls | Short places |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1066 | 1001 | 2,628 | 2,674 | 46 | 2 |
| 1066 | 42 | 2,667 | 1,799 | 917 | 2 |
| 1250 | 1001 | 2,652 | 1,934 | 742 | 5 |
| 1250 | 42 | 2,676 | 1,542 | 1,181 | 3 |
| 1350 | 1001 | 2,652 | 1,934 | 742 | 5 |
| 1350 | 42 | 2,676 | 1,542 | 1,181 | 3 |

Realm totals cannot establish local housing sufficiency. Builder exhaustion is
also not proof that all geographical or legal possibilities are exhausted.
The user-facing note must state measured opening capacity/demand without
inventing a cause.

Two bounded AD 1350/42 opening diagnostics record existing predicate outcomes
without rerunning them. Their opening and lodging records match the uninstrumented
run. Campoolmo consumes 700 candidates, rejecting 672 at `fits`: 597 road
overlaps, 52 building overlaps, 22 public-place conflicts and one terrain/water
failure. Blancpont rejects 431 of 524: 259 road overlaps, 171 building overlaps
and one public-place conflict. Neither has a frontage-access or final approach
rejection in this sample. Bourport has no candidates, no street-graph nodes
and no added streets despite eight extension calls; investigate its network
generation separately.

The source explains a real burgher frontage defect (#64): its setback is
`c.hw+0.7+depth/2`, while road overlap reserves a `0.8` margin. A straight own
frontage of the same width therefore rejects that house. The correction uses
the ordinary house's `0.9` setback and retains native overlap/access checks.
This is a geometry/history change, not a relaxed fit predicate or density cap.

Exact `.92` extents change 422.009→492.985 m at Campoolmo and
306.605→585.963 m at Blancpont; their `.45` values also change. Bourport's
quantiles do not change. These measurements justify repeating the native
extent calculation before land classification after opening completion.

Predecessor HTML SHA256
`13b667c7aaa5ab03d6403d50fde2448171254dd2141bd5c1534f70a362df132f`.
Eight-opening CPU 479.79 s, load 0.13/0.87/1.27 to 1.03/1.03/1.19; the two
diagnostics use 68.70 s (load 0.32/0.81/1.10→0.88/0.88/1.10) and 68.63 s
(0.09/0.42/0.86→0.69/0.54/0.87). These include initialization, observations
and native housing assignment, not tick throughput. Ignored evidence is in
`tools/soak-results/opening-capacity-20261011/`. The refined private patch must
be gated again: predecessor results do not validate the revised model. It
still needs the batched full suite, AD 850 data/history regression, all-speed
determinism, worker/own-save parity and multi-world conservation/calibration
observations before publication.

The refined private HTML is
`9b994a39967727c1c93d2cdcdeacff3676cd10555f2d62e8a611b49a6d016af3`.
Seven focused geometry/presentation tests, full inline syntax parsing, diff
checks and patch application against `877bb31` pass. The geometry check invokes
production `buildLot` and native `streetFootprintOverlap`: both sides of a
rotated own frontage clear, while a crossing foreign street still rejects the
lot. No generated world or runtime/history gate has run on this refinement.
The private originless implementation was in
`/workspace/furlong-capacity-implementation`; its refreshed patch was
`/workspace/issue61-opening-capacity.patch`. It has since been applied to the
integrated candidate below. The private checks above remain predecessor
evidence, not proof of the integrated release.

## Integrated native opening census (2026-10-11)

Frozen HTML SHA256:
`21cfdc3c49a53af9d20ed8b1825b7b481b32945980cc22be39b45eea4e24e103`.
This includes the Castle and Commons rename. All eight worlds use full native
generation, with no predicate instrumentation, replacement generator,
prehistory ticks or inserted capacity. Fate is 42 and coast is sea throughout.

| Start | Seed | Heads | Total capacity | Sum of local shortfalls | Short places |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1066 | 1001 | 2,628 | 2,674 | 46 | 2 |
| 1066 | 42 | 2,667 | 1,799 | 917 | 2 |
| 1250 | 1001 | 2,639 | 2,925 | 46 | 3 |
| 1250 | 42 | 2,636 | 2,213 | 815 | 2 |
| 1350 | 1001 | 2,639 | 2,925 | 46 | 3 |
| 1350 | 42 | 2,636 | 2,213 | 815 | 2 |
| 850 | 1001 | 942 | 569 | 373 | 12 |
| 850 | 42 | 936 | 429 | 507 | 12 |

Every row preserves the requested start at day zero with no prehistory.
Direct-era reports equal exact native head counts and summed `capOf` of sound,
non-removed residential buildings. Repeating completion changes neither
buildings, roads, streets, slots nor any RNG stream. First native household
assignment has no missing head or full-house overflow in complete settlements.
Only unmet direct-era demand receives the measured opening note; AD 850 runs
neither completion nor reporting. Realm surpluses do not erase local shortages.
This census alone establishes no daily history, worker, save or speed identity.

The burgher setback correction intentionally changes post-1100 layouts and
their downstream RNG/history. Relative to the private predecessor, total
capacity rises from 1,934 to 2,925 for seed 1001 and from 1,542 to 2,213 for
seed 42 at 1250/1350. Exact household counts also change because native layout
draws change. These are matched-world observations, not a calibration or
throughput claim. The AD 850 shortages predate the direct-era completion and
remain outside this phase.

Child native CPU sums to 443.174 s; the measured process tree uses 444.292 s,
load 0/0/0 → 1.16/0.83/0.41. Costs include generation, census, repeatability
and lodging observations, not tick throughput. Ignored evidence is in
`tools/soak-results/castle-commons-capacity-20261011/`.

### Isolated-town cause and next slice (#65)

A separate uninstrumented AD 1350, 42:42 sea opening confirms Bourport has
259 heads and four physical housing places, three buildings and only one
market-edge street. It has no connected world roads, road spokes or fort
circuits; its street graph has zero nodes. Its center is at height 7.259 m
above sea surface 0.5 m, with no river/lake at the center. Thus fort clipping
does not explain this site's lack of frontage.

`addPlace` draws the market perimeter, but `streetGraph` and `branch` exclude
edge outlines. `extend` needs an existing public street, road spoke or track;
opening completion occurs before `settleTracks`, so it has no track seed at
that point. Repeating the builder cannot create its first usable local street.
The [recorded next design](ISOLATED-TOWN-OPENING-STREET-DESIGN.md) proposes a
bounded native local street fitted around the actual market, retaining all
water/building/access checks. It is unimplemented and unvalidated; no invented
inter-town connection or navigable edge is included in this candidate.

Diagnostic native CPU 57.303 s (process tree 57.371 s), load
0.98/0.81/0.40 → 1.04/0.86/0.45. The extra geometry queries diagnose source
dependencies and do not constitute a history or performance proof.

### Save reconstruction repair and gate scope

The initial full batch reports 1,552 passes of 1,557. One native eight-day
startup/replay check exceeded its original 15 s VM tick deadline under the
concurrent suite. Four world-save checks expose a real loading defect: native
layout closures are made before the decoded world is installed, so the new
`W.startAD` method guard dereferences null.

The loading repair adds an optional `openingMethods` argument to
`layoutSettlement`. Generation retains the same `W.startAD` gate. Saved
reconstruction uses the layout's own serialized maker paths to decide whether
`completeResidential`/`refreshExtent` were present, and passes that flag before
world installation. It creates no new saved context key or format; a founding
layout remains without those methods even if its world date was later changed.
The decoder's `mark(L, mi, 0, [])` records those methods on the correct layout
base, so the flag is derived per maker rather than guessed from a calendar.

The corrected frozen HTML SHA256 is
`4ac21efbf4d39bcd399a899b458d3ecca8d7476cf4c3c21964f77f5e11aa753f`.
The eight-opening census above belongs to the pre-loading-repair source. This
narrow correction leaves generation's branch, placed buildings, RNG and
initialization order unchanged; it affects reconstruction while `saved` is
present. Subsequent native history/worker/save gates use the corrected source.
Both affected test files now pass serially at their original deadlines: all five checks, including the paid-foundation and forced-eyre save cases. The startup/tick timeout does not recur. Native world-save capture, identical re-save and continued days all match. Rerun process CPU 318.008 s, load 0.08/1.25/1.68 → 1.44/1.30/1.60. The 1,557 unique suite checks are verified across the initial unaffected results and these affected-file reruns; the initial full batch itself remains a failed run.

Initial suite CPU 1,362.439 s, load 0.81/0.81/0.44 → 1.02/2.07/1.99. The first
batch is not described as passing; final verification combines its unaffected
checks with the affected native file reruns and the fresh source gates below.

### Native history and checkpoint evidence

The completed AD 850 pair runs the actual published `0d142af` HTML and the
corrected candidate, 1001:42 sea, through 150 native days. Full graph data,
object identity/order, every daily RNG/command/annal/sequence digest and all
1,812 binary-hashed accepted raw outcomes agree at all checkpoints. The only
captured function-source difference is `buildLot`; its new residential option
and post-1100 setback are reviewed explicitly. No data/value/event normalization
is used, and no whole-source or code-inclusive old/new graph identity is claimed.

The candidate's native AD 1066 steady run saves at day 37, loads in a fresh
realm and continues to day 150. Loaded logical graph and identical re-save
bytes match; the continued complete logical graph and all 1,356 subsequent
raw accepted outcomes match the uninterrupted driver. The document is
21,000,348 bytes. Cold native summary/detail/toll/road inspections preserve
world and RNG: 35 queries in each founding driver, 42 in the modern driver.
The all-seven-speed AD 1066 comparison passes too: complete logical graphs (function source included), daily RNG/commands/annals/sequence digests and all 1,812 raw accepted outcomes match through 150 days, with event-loop yields and the same sovereign/tax commands. All 154 cold native queries across the four drivers preserve world and RNG. These checks preserve determinism within the new model; they do not assert that direct-era history matches the predecessor.

A first extra checkpoint attempt failed because `contextFor`'s host `Map`
iterator created a foreign-realm array in household successors. The strict
encoder correctly rejects unsupported prototypes. The corrected direct-era
probe evaluates the full unchanged source in a VM using that realm's intrinsic
`Map`/`Set`; it changes neither a game helper nor model input. The completed
AD 850 regression pair is retained from its original driver. The extra attempt
is a harness diagnostic, not a successful checkpoint or throughput measurement.
Successful driver CPU totals 1,294.391 s: early baseline 127.541 s (load 1.33/1.28/1.59 → 1.11/1.20/1.52), early varied 125.657 s (1.11/1.20/1.52 → 1.01/1.13/1.45), modern steady with checkpoint continuation 629.200 s (0.13/0.72/1.21 → 1.02/1.02/1.12), and modern varied 411.993 s (1.02/1.02/1.12 → 1.17/1.10/1.12). These include graph capture, raw hashing, inspector observations and checkpoint work, not kernel throughput. The initial mixed-realm attempt used 421.683 s CPU including the two successful early drivers; the corrected modern process-tree wrapper uses 1,042.969 s. They are not added again to the successful driver total. `determinism-summary.json` records the passing aggregate and exact source identities.


### Browser worker, views and classic-save continuation

The corrected frozen source passes the real isolated Chrome worker/reference
comparison at AD 1066, 1001:42 sea: 75 native days, each driver's own classic
save replay, then 75 more days. Complete state parity, resume parity, ten
selected view outputs and view world/RNG/command/annal/settings/storage-sequence
purity all pass. Worker advancement heartbeat maximums are 37 ms initially and
42 ms after resume; reference main-thread advancement reaches 11,925/14,888 ms.
These demonstrate worker separation in this run, not Safari or hardware
performance. Wrapper CPU is 3.284 s, excluding Chrome process CPU, load
0.26/0.81/1.01 → 1.28/1.15/1.09. Native simulation CPU comes from sampled
profiles, not this wrapper total. Evidence: `worker/results.json`.

### One-year conservation and calibration scope

Two fresh direct-era worlds run 360 ordinary days each, fate 42/sea, serially
with cash audit, before/after goods checks and sampled CPU profiles:

| Start / seed | Population opening → end | Famine population-place-day share | Goods checks | Commodity rows checked |
| --- | ---: | ---: | ---: | ---: |
| AD 1066 / 1001 | 7,723 → 7,337 | 22.29% | 722 | 4,734,827 |
| AD 1350 / 42 | 7,709 → 7,050 | 9.21% | 722 | 5,428,944 |

Both pass all completion/cash/goods/fault checks: total, maximum and annual
money residuals are zero; no payment lacks a recipient; no minted-money cause
is recorded. Goods audits report no first mismatch. There are no bad days,
nonfinite population/money, simulation errors or faults. Each outcome journal
finishes flushed with no pending bytes/chunks or persistence/model fault.

These checks establish conservation and operability. Famine and falling
population remain calibration problems (#12/#23), and the two different
seed/era worlds cannot establish an era effect. Nothing is added to balances
to conceal the shortages. The housing census is a separate day-zero check.

In the AD 1066 world, first-foundation work makes `tickCastles` the largest
sampled phase at 128.000 CPU ms/day, followed by population at 64.946.
In the AD 1350 world, population (54.716), market (27.377) and storage
(19.450 sampled CPU ms/day) dominate. Outside-day audits/recording and GC
are reported separately in the profiles. Those are different workloads,
not an optimization comparison. They support the recorded survey-input work
in [CASTLE-SURVEY-INPUTS.md](CASTLE-SURVEY-INPUTS.md); no cross-day survey cache
or centuries-per-minute performance is claimed.

Soak wrappers use 0.626/0.466 s CPU, excluding Chrome process CPU, with loads
1.28/1.15/1.09 → 1.25/1.29/1.17 and
1.25/1.29/1.17 → 1.57/1.42/1.23 respectively. Profiled wall milliseconds per
day are not presented as CPU throughput. Evidence: `soak-1066/` and
`soak-1350/` in the ignored release directory.


### Final stamp, drawing and README screenshots

Final stamped HTML SHA256
`d676cdf4accea463c2a9f2a9edffa37292e5e1769305a5e599dac70ff865c327`;
only the build stamp differs from corrected frozen source `4ac21ef…`.
Executable game SHA256 is unchanged:
`33ab11a241ddfae0b7389039aa9eb81314742569eac98e20c51a3660acce23a9`.
All 19 post-stamp source/advisor/frontage/presentation/search checks pass.

The final owned Chrome drawn gate boots native AD 1066/default and AD 1350
worlds at day zero, then a fresh direct AD 1068 world advanced three ordinary
days. Brand, calendar/capabilities, actual keeps, roads/geometry and loaded
texture atlas all match expectations. Runtime, console and worker fault arrays
are empty. A separate clean AD 1068 capture dismisses notices through the native
UI and verifies both cards and event bubbles are closed before capturing the
selected README images. Camera/pitch and labels change; no model assets,
weather or prehistory are inserted. The browser's tab title remains the native
chronicle title for its generated realm; the game brand is Castle and Commons.

Both selected PNGs are 1920×1080, Spring 4, AD 1068, 42:42 sea: Vadoreal's
bridge/riverside streets and Campoolmo's native timber motte-and-bailey. Native
rendering and image inspection verify the screenshots; image pixels are not
edited. Evidence is in `drawn-release/report.json` and
`screenshots-release/report.json`. Harness-only title/navigation/material
predicate corrections and an initial obstructing resume notice are recorded
separately; game source does not change for these capture corrections.

Drawn wrapper CPU 4.610 s, excluding Chrome process CPU, load
0.48/0.87/0.98 → 1.17/1.14/1.07. Clean screenshot wrapper CPU 2.579 s,
also excluding Chrome, load 0.50/0.96/1.01 → 0.96/1.08/1.05. The latter wrapper
initially selected the frozen HTML hash for its new label; metadata retains that
selection and corrects the identity to the actual stamped source hash in its
capture report. These are software-graphics operability checks, not Safari or
hardware performance measurements.
