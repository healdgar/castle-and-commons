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

The next source batch should verify, on the confirmed Bourport fixture, that one native local street appears with dry/legal geometry, creates graph access, and lets ordinary lot checks run; any occupied homes must clear both their own street and all existing street footprints. It should also confirm the fallback is absent when a town already has accessible roads, absent for the unchanged AD 850 path, and idempotent when the capacity query is repeated. Four production-function fixtures cover legal access, existing roads and spokes, AD 850, idempotence, water/circuit rejection and a boundary interrupted by a real footprint. The first full native check still exhausted Bourport because the original complete-ring proposal conflicted with its hall/tavern; that diagnosis caused the bounded-run revision. The revised native opening has not yet been verified.
