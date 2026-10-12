# First-castle survey dependency certificate

The daily decision still recomputes current authority, exile/siege, existing castle and projects, local construction knowledge, real technology equipment recipe, actual material prices, lord's purse, threat, defended property value and expected benefit. Those are cheap eligibility guards before geometry. Only the geometry survey's **null answer** is remembered; a positive answer is never recalled, and an existing paid project's retained site is always freshly checked.

`castleFoundationFailedSite` compares an exact ordered scalar certificate with `Object.is`. It uses no hash, day interval, retry clock, geometry revision counter or elapsed-time budget. `tickCastles` shares the read only within its synchronous operation, and invalidates that batch immediately after any foundation/compound commissioning adds a reserved site. A new daily operation rereads the native sources. Two reusable arrays avoid allocating the complete writer list every unchanged day. The memory and counters are derived objects outside `W`; checkpoint loading may leave them empty without changing the answer or saved hash counter.

## Read and writer coverage

| Native source | Values certified | Native changes that invalidate |
| --- | --- | --- |
| Survey constants and terrain | `SIZE`, `GRID`, `CELL`, `FN`, `FG`, `PLN`, every `W.h` and `W.water` sample | Map/terrain edits, earthworks modifying native heights, changed flood/water raster |
| Furlong lattice and rights | Ordered `F`, `i/j/jx/jz`, `dom`, `lord`, whether canonical own/work owner exists, crofts; full mask's occupied (`B===255`) predicate | Survey/parcel changes, ownership or holding eligibility, crofts, any newly occupied/unoccupied native mask cell |
| Settlement scope | Ordered settlements, position, radius, owner | Changed site reach, political owner or native position |
| Buildings and churchyards | All standing native footprints: center, width, depth, rotation, polygon and toft; attached standing graveyard geometry | Same-count moves/rotation/extensions, title-ground/toft boundary edits, buildings completed/removed/ruined to gone, churchyard growth/removal |
| Streets | All nongone nonedge lines and widths; local anchor visibility, planning, castle-path, quay/service flags | New/closed/moved/hidden streets, changed width or public access |
| Defensive circuits | Actual ordered `fortCircuits`, centers (including `pos`), radial arrays and radius fallbacks | Native town/castle/motte/outer-curtain/citadel installation, removal, shape edits; `fortCircuits` inclusion changes |
| Protected ground | Actual places' radial arrays, citadel dimensions, remnants, burg rings and relic-wall vertices | Place reshaping or reserved historic/defensive ground changes |
| Water geometry | Each settlement's native lake polygon/level; actual river hash cell size, ordered cell keys and segment endpoints/half-width | Dam/pond or shoreline changes, native river-hash replacement or same-cell segment edits |
| Roads and tracks | Actual `open || path` highway points; selected track keys and actual current graph endpoints | New paid highway/path geometry, native track creation/deletion or moved selected vertices |
| Active reserved projects | Actual active type/kind/settlement for `road`, `castle`, `compound`, `fabric`, `storage`, `clear` and `plan`; road routes, castle yard circle/approach, compound/fabric and paid citadel footprint polygons/boxes/rings/approaches, storage dimensions, clear radius, planned streets/quarters/places/wall radials | Commission/retirement, same-count retained geometry edits, any newly reserved or released ground |
| Foundation query | Exact `spec.w/d`; the settlement is the weak-map key and world identity is checked | A different keep footprint or world replacement |

The certified held-owner predicates deliberately follow `castleFoundationLandOK`: null or `-1` is unheld; any other canonical holder is held. Changing one held person into another does not change this geometry predicate. Financial consequences are still assessed by the current daily decision. Crop colors and unoccupied mask classifications do not affect the survey; only `B===255` does. Project payment/progress does not affect reservation geometry until its real project is removed, completed or edited. Wall damage and construction progress do not affect this survey's curtain clearance, which checks the native circuit shape.

Equipment, paving, persuasion and purchase projects do not enter any survey geometry branch: their creation, edits and retirement neither reserve survey ground nor make private hash queries. They are excluded from the certificate. The actual project type and retirement predicate are reread each operation, so changing any such record into a reserved project immediately includes its current geometry and invalidates null reuse. Native survey traversal is unchanged; recalled failures still replay the same private query count.

No spatial exclusion is assumed: the first implementation reads full native geometry, including remote records, so a distant building/road/parcel can move into the site without relying on a stale extent or writer counter. This conservatively invalidates some unrelated changes; future regional narrowing requires its own dependency proof.

## Helper discipline

`CASTLE_FOUNDATION_SURVEY_NATIVE` captures every surveyed geometry helper before boot or test overrides. A replaced helper bypasses memory. `tools/castle-foundation-memory.test.mjs` also pins each audited helper's source and core scalar helpers; a future source edit requires auditing this writer certificate before repinning. The certificate includes `computeFurlongPoly`, occupied raster intersections, `compoundGround`, native river lookup, and the complete containment, footprint, interpolation and resampling call graph.

The cheap `castleFoundationCentersPossible` preflight visits exactly the same public frontage candidates and offsets as the authoritative survey. It rejects only if every center already fails the survey's necessary terrain, water or legal-ground predicates. On that path the old survey could not reach any private hash query, so it skips world index construction without changing `HASH_STAMP`.

The point-to-box helper first rejects either axis distance greater than the original `pad+1e-6` limit, then retains the original `Math.hypot(dx,dz)<=limit` corner predicate. The native two-argument `DM.hypot` normalizes by the largest absolute axis: one squared ratio is exactly 1, the other is nonnegative, so the sum and its square root cannot be below 1. Rounding the product with that representable largest axis cannot reduce it below the axis. The zero and infinity branches preserve the same inequality. No additional tolerance is needed. The original finite-input fallback stays first; finite subtraction overflow yields positive infinity, and negative padding still uses the same signed limit. The helper reads the same numeric point/bounds/padding, `Number.isFinite`, `Math.max` and native deterministic `Math.hypot`; it adds no world reader, mutation, RNG or hash query. Its source pin alone changes after this call-graph review. The source fixture compares the former predicate using the actual native `DM.hypot` over adjacent representable thresholds, subnormal/large values, negative padding, invalid/reversed bounds and subtraction overflow, and verifies that nearby corners retain hypot. The full native graph/RNG gate remains the coordinator's responsibility; skipped pure arithmetic alone is not a measured throughput result.

Pending compound/fabric polygons and their conservative bounds are now read once per project within a single synchronous `castleFoundationSite` operation. `compoundPolys` supplies the same ordered native polygons without requesting raster cells that reservations never consumed. `compoundGround` wraps that builder and retains the exact `occupiedGroundCells` authority for title, payment and occupation clients. A private operation-local map discards polygons when that survey returns. Each probe uses the same authoritative containment and edge-distance tests, with an AABB rejection only when the entire polygon is farther away than the exact test's padding. This removes repeated native raster construction inside `clear()` without caching permission or geometry across operations. Private building/segment hash queries retain their original order and count. `CASTLE_FOUNDATION_SURVEYS.work=false` disables this operation-local optimization and performs the former per-probe exact raster work for comparison.

Native `castleFoundationReserved`, castle yard-fit checks and completion clients that only forward polygons to `markOccupiedGround` now call the same pure builder. `markOccupiedGround` still performs its own actual native raster intersection before any mask/title/yield mutation. No cell consumer was converted into a polygon-only permission check. The pure builder preserves supplied polygons, yard/hydraulic polygons, boxes, 64-point ring geometry and ordered path rectangles exactly; it reads only geometry already covered by the certificate. It neither queries a spatial hash nor changes the saved hash counter.

## Private hash stamps and checkpoint exactness

The survey's `B.add` receives shallow `{...b}` copies of native buildings/churchyards. `H.add` receives newly allocated segment records. `B.near` and `H.near` stamp only those private top-level objects; references to native polygons or street records are read without stamping or mutation. `riverAt` reads the existing hash's `historyCells` directly rather than invoking its stamping `near`. Other helpers in this audited survey are read-only.

A real failed survey records its exact `HASH_STAMP` increment. A certified recalled null advances the saved derived counter by the same amount. It does not restore the counter or discard old bookkeeping. Reuse is disabled if a native building's inherited `__hs` could be ahead of the current counter, or if a counter/delta cannot be represented as a safe integer. Thus discarded private queries cannot create stamp collisions in later native indexes, and clearing the transient memory after a checkpoint produces the same native graph and counter.

## Evidence and limits

The focused native fixture covers all writer categories, unchanged-count edits, cold memory, helper overrides, same full graph plus counter at repeated daily calls, fresh success after removing an obstruction, and a verification mode that checks recalled nulls against fresh native surveys. It uses a small fixed terrain and native geometry helpers without generation/rendering/long simulations. It does not establish the whole game's century throughput or checkpoint/worker equivalence. Root's serialized batch profile and full graph/RNG comparison remain the integration gate. `CASTLE_FOUNDATION_SURVEYS.on=false` provides the fresh-survey comparison; `.verify=true` reruns every recalled null and rejects a certificate or stamp-count disagreement.

The `219b90e` raster review adds `occupiedGroundBoxMayHit` to the actual
first-castle helper certificate, bringing it to 49 identities. Both native
`occupiedGroundCells` and `occupiedGroundFields` call it before their existing
exact overlap predicate. It rejects only a finite axis gap greater than one
metre with every coordinate bounded by 1,048,576; uncertain inputs retain the
original predicate. Raster/parcel traversal and Set order are unchanged, and
replacing this helper bypasses failed-survey reuse. Only the Cells/Fields body
pins and new Box pin change; the other 38 fixture pins remain exact. No world
field, memory lifetime or daily retry cadence changes. The current serialized
native gates remain separate from this source/dependency review.

The `d016a6a` follow-up changes only `occupiedGroundCells` in this fixture's
reviewed reader bodies. Native plain dense polygon arrays with own-data finite
points and unchanged Array/some/iterator and geometry-reader identities use
conservative row-strip x-extrema. Each strip expands the native cell row by one
metre before ascending column bounds; near-horizontal edges retain both full
endpoint x-extrema. The old corner/vertex/.01-metre segment hit predicates and
`cIdx` output order remain exact. Nonfinite, oversized, sparse, accessor, custom
array/prototype or replaced-reader inputs retain the original rectangle scan.
`OCCUPIED_GROUND_NATIVE` captures that native support at script initialization;
no field/title/mask writer, permission, private hash stamp or cache lifetime is
added. The castle certificate stays at 49 readers. Only the Cells source pin
changes in this follow-up; Fields, Box and the other 38 pins remain exact.
Current-source native/history/save/performance release gates remain root work.

## Fresh-survey reservation envelope, 12 October 2026

The current performance pass filters compound/fabric/citadel reservation polygons
only within a fresh synchronous survey. It constructs their same native ordered
polygons and bounds once, then removes only polygons wholly beyond the survey's
conservative probe envelope. Roads and planned streets still enter the original
segment hash; castle circles, storage, clearings, squares and walls retain their
original point tests. Retained paid sites use all current reservations.

Candidate centres are within `reach-40` of the settlement. Their initial radial
limits are at most `1.37*minR`; fitting only reduces them. Float32 yard radii,
interior raster probes, corners, doors and straight frontage connectors fit
inside the deliberately wider `reach+6*minR+maxAbsAnchorWidth+128` box, including
the largest point-clearance padding. Polygons touching that box remain. Invalid,
oversized or nonpositive query values and replaced native helpers disable the
envelope. No previous operation's spatial exclusion is reused.

`compoundPolys` is pure geometry: early projection neither rasterizes rights nor
changes native state or private hash stamps. All surviving polygons retain their
order and exact containment/distance predicates. Building and road hash queries
retain their original order and count. The existing full-world failed-survey
certificate is unchanged and still conservatively invalidates remote edits;
this change reduces work in a fresh miss, rather than broadening null reuse.

`placeFitRadii` also computes each ray's sine and cosine once. The callback sees
the same coordinates in the same order; multiplication, interpolation, minimum
radius and stopping rules remain unchanged. Only Site and Fit source pins are
renewed after this dependency review. Native history and timing evidence is
recorded in PERFORMANCE.md when its gates complete.
