# Isolated town opening streets: bounded next slice

This note records the smallest likely follow-up for an otherwise valid settlement that has no connected public street when direct-era housing is fitted. The working batch implements it; native opening and combined validation are pending.

## Evidence and source path

The native trace at `tools/soak-results/castle-commons-capacity-20261011/bourport-opening.json` reports AD 1350, seed 42, sea coast, settlement 4 (`Bourport`): a town of role `fort`, ground height 7.259 above sea surface 0.5, with no river or lake at its center, no attached world roads or road spokes, and one visible market edge with 21 points. It has no fort circuits and no street-graph nodes. The trace attributes the missing graph to the edge being the only street; this is not a castle-clipping failure.

The source behavior matches that result:

- `addPlace()` records a place perimeter as `kind: 'edge'`; it is a market outline, not a traversable street.
- `streetGraph()` and `branch()` both intentionally exclude edge streets. `queue()` only accepts candidates whose `frontageAccess()` reaches an accessible graph node.
- `extend()` can extend existing road spokes, join existing country tracks, or branch from existing public streets. At opening completion, `settleTracks()` has not yet supplied country tracks. With no road spokes or non-edge public street, it has no seed from which to grow.

The opening-capacity code should therefore leave the edge and fort filters intact and supply a small, local public street only for this isolated-site case.

## Minimal design

Add a layout-local, direct-era-only `seedMarketStreet()` used once when all of these conditions hold: the settlement has an existing market place; no connected road spoke exists; the street graph has no accessible node; and there is no existing live opening-market street. This is a local street around the market, not a new inter-town route.

Build a candidate polyline from the market polygon using its actual boundary (`placeEdge(place)`) and an outward offset. Validate the whole line at native sample spacing before adding it: every sample must pass `buildable()` and `roadAccessClear()`, remain outside the market polygon, avoid existing building footprints through `laneHitsBldg()`, and pass the actual `fortRoadBlocked()` gates. Use the ordinary street width and `addStreet(..., 'lane', {openingMarket:true})`; keep the edge as an edge. Standing buildings can make a complete circuit impossible: the implementation keeps the longest valid contiguous boundary run, joining runs across the polygon seam, and accepts a run only with native center access and enough length for real frontage. At most one lane is added. If no valid run exists, return false and retain the exhausted report.

After adding a valid lane, call the existing street stitching/cache invalidation path and rebuild the normal frontage queue. `streetGraph()` should then find an accessible node near the settlement center, and `frontageAccess()`, `queue()`, `fits()`, and `buildLot()` remain the authorities for usable residential frontage. The market-facing side can fail `fits()` because it lies inside the public place; the outward side may accept homes only when the ordinary placement checks succeed.

The fallback must be deterministic and idempotent. It should consume no simulation RNG, add at most one local street, and never bypass `buildable`, `laneHitsBldg`, road/water checks, or castle gates. It should not fabricate a road spoke, alter settlement ownership, or count place edges as graph nodes.

## Focused follow-up proof

The next source batch should verify, on the confirmed Bourport fixture, that one native local street appears with dry/legal geometry, creates graph access, and lets ordinary lot checks run; any occupied homes must clear both their own street and all existing street footprints. It should also confirm the fallback is absent when a town already has accessible roads, absent for the unchanged AD 850 path, and idempotent when the capacity query is repeated. Four production-function fixtures cover legal access, existing roads and spokes, AD 850, idempotence, water/circuit rejection and a boundary interrupted by a real footprint. The first full native check still exhausted Bourport because the original complete-ring proposal conflicted with its hall/tavern; that diagnosis caused the bounded-run revision. The revised native AD 1350 seed42/fate42 sea opening now has one legal nine-node lane, all nine nodes accessible, eleven native buildings and capacity42 (formerly4). It still reports its remaining259-head shortfall honestly (#61). CPU55.64s at load0/.01/0→.6/.18/.06; source/geometry evidence is recorded in the coordinator’s ignored institution batch. This proves usable native frontage, not complete housing.

## Short parent lane follow-up

The recorded nine-point seed is 57.9666 m long. Of its production 20 m resamples, only one interior point meets the existing settlement-center distance rule. Both the opening `branch()` and the daily paid `laneSurvey()` treated the parent itself as a nearby child lane: that point lies 13.4006 m from the seed head, within both endpoint vetoes. Neither larger reach nor available funding can overcome that unconditional rejection.

The candidate repair excludes only the actual parent street from those child-lane spacing checks. Their foreign-lane distances and all native mouth, access, standing-footprint, water, public-place, terrain and fort checks remain in force. `tools/frontage-lane-parent.test.mjs` executes the production selectors, mouths and walkers over the recorded seed on a controlled dry plane: a legal branch can start, a separate nearby lane still vetoes it, and standing, water, fort and public-place obstructions still reject it (3/3). It generates no native world. This deliberately changes native opening and paid expansion eligibility; the final occupied-world capacity check remains a coordinator release gate, and #61 is not declared complete from this fixture.

The follow-up source review found that opening homes on a prospective hidden lane did not expose that lane, although paid new-home completion already does. A hidden child then blocks another nearby branch at the seed's only eligible start while itself remaining excluded from the walking graph and both branch builders. Opening completion now refuses a hidden lane with a standing footprint in its path and exposes only its own lane after a successful native home build, clearing the graph cache. The production-loop/lot/graph fixture `tools/opening-lane-completion.test.mjs` passes 3/3 for successful reachable frontage, terrain/water/fort/reservation/access refusals, a remotely blocked lane and unrelated hidden lanes. Capacity still comes solely from actual placed homes and `capOf`; this fixture makes no whole-town completion claim. The coordinator must regenerate native history and opening census. The ordinary sampled queue and supported extent remain bounded, so an exhausted result is not a proof that every legal geographic layout has been searched.
