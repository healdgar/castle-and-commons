# Personal status and freedom

The #42 model keeps `p.status` and a saved personal bond independently of land
and household membership. Opening status follows the actual villein holding;
subsequent children inherit by the origin place's paternal custom, or its explicit
maternal custom. Later sales, leasing, marriage and inheritance do not derive a
new personal status from the current strip. Merchet and heriot follow the
personal bond once status is enrolled; a free holder of villein land remains free.

`freedomPrepare` enrols only unknown people after native opening land and after
arrival/actor preparation. `W.freedom.active` contains references to actual bound
people, not a second population. `tickFreedom` runs daily inside justice, after
current government business. Dead and released people leave its active map.

A permanent move outside the actual claimant's places buys a licence from that
claimant if the household has coin beyond its month of bread and rent. The saved
licence covers the same family's same-day move and actual adult dependants;
it cannot be charged again for each traveller. Annual chevage is due from its
resident adult head. These are named manor customs, initially one-sixtieth of an
adult's annual bread, one year's dues for leave and five years for release. They
are historical custom inputs, not pinned market prices or new income.

An unfunded move becomes flight. Residence starts on actual arrival and resets
on departure. Only an actual chartered commune grants freedom after 361
continuous days in the game's 360-day year, without a valid claim. A worthwhile
claim requires a real available bailiff, funded fees and a native outward/return
journey; a timely hearing returns the same person by native travel. A dead
claimant's official or a late arrival does not keep the bond pending forever.

An adult head buys release only from spare actual coin when the prospective dues
and opportunities avoided exceed the customary price. Payments conserve coin;
release does not transfer agricultural title. The controlling lord can also grant
freedom through a journaled, worker-validated person command. Person cards show
status and the real release quote through readonly worker inspection.

This intentionally changes model history. Eight light native-account fixtures
cover inheritance versus tenure, actual funded release and subsistence, one
family licence, arrival/residence, nonchartered places, live/dead claims and
inspection/command authority. Full native speed/save/worker/conservation gates
remain part of the combined institution batch; #42 is not yet release-validated.
