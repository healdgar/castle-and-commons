# Funded coastal isolation

The operative #44 quarantine client uses native coastal consignments, their actual
merchant and boatman, and the port's real authority. It starts only where
`institutionalCapability(s,'quarantine')` confirms local adoption. The tree's 1377
date is the earliest possible knowledge, not automatic local enforcement.

Ragusa's 1377 rule required thirty days of isolation, a *trentina*. The fixed
thirty-day term here is that dated historical custom; it is not an arbitrary
interval for ordinary economic decisions. See Tognotti, [Lessons from the History
of Quarantine](https://wwwnc.cdc.gov/eid/article/19/2/12-0312_article), 2013.

A successful `ladeOut` records the actual origin's current aggregate SIR outbreak
and the observation day on the real consignment. Existing cargo without this
record gets an explicitly labelled in-transit source report, not an invented
past diagnosis. The native model has no individual plague diagnoses: the record
means exposure to an observed source outbreak, not confirmed infected sailors.
Coastal arrival now uses that observed source instead of consulting a possibly
recovered origin weeks later. Land arrival retains its existing source rule.

At physical arrival, the authority considers exposed cargo daily. Clear loads
continue trading. A hold requires an actual living, present, legally free local
household head with letters or maritime experience, without another institution,
army, craft, estate office or assigned field. The keeper takes a real paid office;
that same person cannot supply another institution's labour. No actor or family
is created. One keeper supervises one real consignment at a time.

The commune pays from its native town chest; otherwise the actual lord or Crown
pays from its spare chest after its existing reserve. The keeper's daily price
covers family bread and a half or the trade forgone, whichever is greater. The
merchant pays the existing boatman's household for additional daily absence.
A merchant sailing his own goods pays no invented wage to himself. These delay
payments are separate from the original freight, which is paid once on delivery.
Both payers must initially be able to cover the whole term; actual daily payment
and continuing authority/presence/adoption are rechecked each day.

The ordinary decision compares expected loss against actual wages, delay expense
and native cargo spoilage. Its explicit game calibration values a potential
plague death at one year's bread and uses the native 0.28 fatality coefficient
and existing arrival probability. It adds no money or statistical deaths.
Because the native arrival rule only seeds an uninfected town, an existing local
outbreak removes this client's incremental benefit and ends the hold.

A hold requires the game's native version-3 commodity cargo ledger. The legacy
opt-out comparison model and unledgered animal loads keep their existing arrival
behavior; the client adds neither a second legacy spoilage pass nor an unsupported
animal-feeding store. Goods remain in the merchant's existing transit location. Every supported day
consumes that cargo's actual spoiled share using the native spoilage rates, keeps
its remaining ownership, and reduces the delivered value. A second call on the
same day neither pays nor spoils again. No quay, warehouse, shadow inventory or
unearned import is added. Unloading, market offers, tolls, technology contact,
trade volume and the original freight wait for release. The keeper and crew eat
through their existing households; the client adds no second meal or population.

Thirty actual paid service days and the complete elapsed term suppress only the
native arrival transmission from this load. The model does not heal anyone or
change the origin's infected/recovered population. Missing service cannot be
replaced by advancing the date. Insolvency, lost staff/adoption/authority, siege,
lost cargo, merchant death, a local outbreak or a journaled stop ends a partial
hold. The ordinary native arrival risk then applies once, as the surviving cargo
is actually delivered. The crew's existing return absence becomes its real
remaining return trip. No deadline is extended indefinitely.

`tickCaravans` owns cleanup, staffing, payment, held custody and release, before
`tickFolk`, prepared household production and meals. `ladeOut` captures exposure
late in `tickTrade`, after actual purchase and before the next day's travel.
There is no added top-level phase, random hold cadence or rendering-dependent
choice. The existing `s.quarantineUntil` gate closure is preserved separately;
a per-cargo hold never closes the whole town.

The settlement and cargo inspectors, readonly presentation and adviser receive
new detached scalar reports. Canonical `s.portHealth` and `c.portQuarantine`
contracts, real payer references and the source evidence stay in the worker.
`s-port-health` commands journal strict settlement/mode arguments and require
the actual player's authority, harbor, adoption and funding. Read functions
create no policy, keeper, goods or receipts.

The existing anonymous overseas `W.ships` supply has neither a named crew nor an
actual foreign disease state. This client deliberately cannot quarantine those
ships on fabricated evidence. Named foreign maritime crews and disease-aware
foreign cargoes remain a separate extension. The current client operates on
real coastal merchant consignments between native places.

`tools/quarantine.test.mjs` supplies fourteen focused, serial native-account and
commodity-ledger fixtures: paid term, partial release, legal/office/funding gates,
actual spoilage, once-only freight, retained people/ownership, journal policy,
read-only reports and real off-manor title recipients. The root runner owns
combined generated-world, replay, save, worker/projection and conservation gates.
