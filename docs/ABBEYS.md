# Abbey institutions: first operative slice

The first adapter is Cistercian, available through `institutionalCapability` from 1128. This follows the accepted rules in `SYSTEMS.md` decisions 1–2 and 12: granted marginal ground, self-worked granges, actual lay brothers/sisters and hired households, wool, fish, alms and hospitality. Benedictine and Augustinian policies remain separate follow-on adapters; their calendar entries do not yet enable founding controls. The 850 and 1066 starts do not create anachronistic Cistercians.

## Canonical records and conservation

An abbey is one `corpFound('abbey', ...)` account in `W.abbeys`, identified by `abbey:N`. Founding transfers silver from the real founder and grants actual unheld demesne titles in free alms. Complete native raster cells, including their intersected Voronoi parcels, must belong to the grant; a guild, household, tenant or unknown explicit holder cannot be silently displaced. The political settlement owner is unchanged. Canonical `accountOwner` and `propertyRightsResolve` resolve institution keys and `household:hhN`; household beneficiary/head identity remains numeric for inheritance.

Members are actual named people retained on the native population roll. Admission needs an actual roof, one year's food, a personal entry gift and no existing assigned land or work. A dependent splits from the existing household; the parents' estate is retained. Personal movable goods transfer through native ownership. Death, hunger and age apply to the same people. Professed members do not marry or reproduce. No institutional `_hallN`, abstract religious cohort, opening cash, food or generated people is added.

Daily wages go to real native household heads. Hired servants retain their families, mortality and household pantries; their exclusive institutional work replaces ordinary producer/trade activity. Hiring uses the real household's bread cost and past earnings. Insufficient funding, siege or absence releases the job. A cellarer is an actual living member, with `officeFor:'abbey:N'`.

## Daily dependencies

- `tickAbbeyWork`, after `peoplePrepare`, pays today's actual servants and derives cultivated grant area and work from living, fed lay members and paid households. Native `tickEconomy` excludes this area from generic crop output, then credits the institution's actual cultivated output once. Unworked granted fields do not produce a corporate crop. Tithe and multure follow the real charter and mill; early Cistercian grants carry no serf rent or appropriated parish tithe.
- `tickAbbeyMeals`, after `tickMarket` and before `tickPopulation`, purchases/transfers actual grain and fish into the same native member/corrody pantries. Native fallback buying and eating honor the four-footed-meat prohibition. Native `eatHouseholds` consumes each mouth once. Boarding a returning local traveller uses that person's actual household pantry, not a second guest population.
- `tickAbbeys`, after `tickUpkeep`, checks founding, admission, clearing, charity, corrodies and further compound commissions from today's actual balances. New paid construction starts at tomorrow's projects phase. Late admission refreshes the native household roll and does not supply a second meal.

Real customary dates retain their cadence: the settlement market day handles sheep/hay purchases, and September 14 handles a funded annual order journey. A named leader travels on the native errand path to an older house or a port for the General Chapter; the home and visited house keep separate purses, with actual board/fare payments and explicit flows abroad. No guessed order income or automatic percentage tithe funds the journey.

## Native compound and water operations

Church, residence, grange and guest house/almonry use the shared paid compound project engine and exact fixed native building/access geometry. Required materials are real owner stock or native purchases, and work advances only with actual wages. Abbey churches are distinct from the parish church and do not claim a parish churchyard. Canonical buildings supply storage and housing; the compound owns neither a second capacity nor another inventory.

A fishpond is a paid contained river reservoir in canonical `s.lake`, only where the settlement has no existing reservoir. The entire retained pond/dam footprint must be granted, terrain must close the water, and no native road/building may be flooded. Completion consumes an actual purchased fish stocking input. Output waits a full growing year and requires today's actual paid fisher; drought and winter affect it. Fish remains the existing native commodity. Initial throughput is an explicit game calibration, not a claim about historical load weights. The pond reuses native masks, route fingerprints, minimap, water surface and dam drawing, with a dedicated worker-to-render hydraulic dirty flag. Its component references the same lake and carries no store or capacity.

Sheep are actual purchased beasts in the abbey's native owner ledger, subject to native breeding, mortality and winter hay. Milking/shearing need real spare lay or paid work. Native market/cargo sales credit actual buyers' silver; wool quantities and receipts are recorded at `lordSold`. Forward-sale contracts use the separate native credit adapter's `forwardOffer`, when present, on actual newly produced output.

Charity gives only actual grain above the institution's annual food reserve. Corrodies transfer a named elderly household's real up-front consideration for board for life; they create no population. The school component has a native paid classroom plan and completion reference `a.school={building,ownerId}`. The schooling system owns teacher employment, pupil enrolment, tuition, stipends and board and may add `schoolId`; no pupils or learning are inferred from the building label.

## Remaining continuation

Distinct Benedictine/Augustinian land/rent/tithe policies and valid earlier institutions, wider Church holders/courts/payments, funded schooling, forward contracts, order discipline/mother-daughter obligations beyond the funded journey, and additional pond/fishery forms are subsequent planned slices. This first slice does not claim those systems complete. In particular, one canonical reservoir per settlement is the existing hydraulic limit; it does not fabricate multiple decorative ponds.

The focused `tools/abbeys.test.mjs` checks actual native accounts, titles, stocks, mouth/population conservation, admission, paid work, pond stocking and delay, wool sales, charity, corrodies and observational projection. Full native founding/site generation, worker history/save and multi-year integration tests are serialized by the root agent.
